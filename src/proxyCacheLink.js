// @flow

import {
  ApolloLink,
  Observable
} from 'apollo-link'
import { hasDirectives } from 'apollo-utilities'
import { calculateArguments, DIRECTIVE, errorOnGet, errorOnSet, removeCacheDirective } from './utils'
import type { CacheKeyModifier } from './utils'
import type { Cache } from './caches/types'

export const proxyCacheLink = (queryCache: Cache<string, Object>, cacheKeyModifier: CacheKeyModifier) => {
  return new class NodeCacheLink extends ApolloLink {
    request(operation: Object, forward): Observable<any> {
      const directives = 'directive @cache on QUERY'
      operation.setContext(({ schemas = [] }) => ({
        schemas: schemas.concat([ { directives } ])
      }))

      const isCache = hasDirectives([ DIRECTIVE ], operation.query)

      if (!isCache) return forward(operation)

      const server = removeCacheDirective(operation.query)
      const { query } = operation
      if (server) operation.query = server
      const { id, timeout } = calculateArguments(query, operation.variables, cacheKeyModifier, operation.getContext())

      return new Observable(observer => {
        try {
          queryCache.get(id).then(data => {
            if (data) {
              return observer.next({ data })
            }
            const obs =
              server && forward
                ? forward(operation)
                : Observable.of({
                  data: {}
                })

            obs.subscribe({
              next: ({ data, errors }) => {
                if (!errors) {
                  try {
                    queryCache.set(id, data, timeout).then(() => {
                      observer.next({
                        data,
                        errors
                      })
                    })
                  } catch (e) {
                    errorOnSet(e)
                  }
                }
              },
              error: observer.error.bind(observer),
              complete: () => {
                observer.complete()
              }
            })
          })
        } catch (e) {
          errorOnGet(e)
        }
      })
    }
  }()
}
