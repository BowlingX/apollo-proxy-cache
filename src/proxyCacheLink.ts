import { ApolloLink, Observable, FetchResult } from '@apollo/client/core'
import { hasDirectives } from 'apollo-utilities'
import type { Subscription } from 'zen-observable-ts'
import type { Cache } from './caches/types.js'
import {
  calculateArguments,
  DIRECTIVE,
  errorOnGet,
  errorOnSet,
  removeCacheDirective,
  CacheKeyModifier,
} from './utils-browser-only.js'

export const proxyCacheLink = <K extends string, V, T extends Cache<K, V>>(
  queryCache: T,
  cacheKeyModifier?: CacheKeyModifier,
) => {
  return new ApolloLink((operation, forward) => {
    const directives = 'directive @cache on QUERY'
    operation.setContext(({ schemas = [] }) => ({
      // @ts-expect-error schemas is never
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
        operation.getContext(),
      )
      id = thisId
      timeout = thisTimeout
    } catch (e) {
      errorOnGet(e as Error)
      return forward(operation)
    }
    return new Observable((observer) => {
      let subscriber: Subscription | undefined

      const forwardToNetwork = () => {
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
      }

      queryCache
        .get(id)
        .then(
          (data) => {
            if (observer.closed) return
            if (data) {
              observer.next({ data })
              observer.complete()
              return
            }
            forwardToNetwork()
          },
          (e) => {
            // Never fail the request if the cache is not available
            if (observer.closed) return
            errorOnGet(e)
            forwardToNetwork()
          },
        )
        .catch((e) => observer.error(e))

      return () => {
        subscriber?.unsubscribe()
      }
    })
  })
}
