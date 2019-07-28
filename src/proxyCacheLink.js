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

      return new Observable(async observer => {
        try {
          const data = await queryCache.get(id)

          if (data) {
            return observer.next({ data })
          }
        } catch (e) {
          errorOnGet(e)
        }

        const obs =
          server && forward
            ? forward(operation)
            : Observable.of({
              data: {}
            })

        obs.subscribe({
          next: async ({ data, errors }) => {
            if (!errors) {
              try {
                await queryCache.set(id, data, timeout)
              } catch (e) {
                errorOnSet(e)
              }
            }
            observer.next({
              data,
              errors
            })
          },
          error: observer.error.bind(observer),
          complete: () => {
            observer.complete()
          }
        })
      })
    }
  }()
}
