import { ApolloLink, FetchResult, Observable } from '@apollo/client'
import { hasDirectives } from 'apollo-utilities'
import type { Subscription } from 'zen-observable-ts'
import {
  calculateArguments,
  DIRECTIVE,
  errorOnGet,
  errorOnSet,
  removeCacheDirective,
  CacheKeyModifier,
} from './utils-browser-only'
import type { Cache } from './caches/types'

export const proxyCacheLink = <K extends string, V, T extends Cache<K, V>>(
  queryCache: T,
  cacheKeyModifier?: CacheKeyModifier
) => {
  return new ApolloLink((operation, forward) => {
    const directives = 'directive @cache on QUERY'
    operation.setContext(({ schemas = [] }) => ({
      // FIXME: not sure why this gives an error
      // @ts-ignore
      schemas: schemas.concat([{ directives }]),
    }))

    const isCache = hasDirectives([DIRECTIVE], operation.query)

    if (!isCache) return forward(operation)

    const server = removeCacheDirective(operation.query)
    const { query } = operation

    if (server) {
      operation.query = server
    }

    let id: K, timeout: number
    try {
      const { id: thisId, timeout: thisTimeout } = calculateArguments<K>(
        query,
        operation.variables,
        cacheKeyModifier,
        operation.getContext()
      )
      id = thisId
      timeout = thisTimeout
    } catch (e) {
      errorOnGet(e)
      return forward(operation)
    }
    let subscriber: Subscription
    return new Observable((observer) => {
      queryCache
        .get(id)
        .then((data) => {
          if (data) {
            observer.next({ data })
            observer.complete()
            return data
          }
          const obs: Observable<FetchResult> = server
            ? forward(operation)
            : Observable.of({
                data: {},
              })
          subscriber = obs.subscribe({
            next: ({ data, errors }) => {
              if (!errors) {
                queryCache.set(id, data as V, timeout).catch(errorOnSet)
              }
              observer.next({
                data,
                errors,
              })
            },
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          })
        })
        .catch(errorOnGet)
      return () => {
        if (subscriber) {
          subscriber.unsubscribe()
        }
      }
    })
  })
}
