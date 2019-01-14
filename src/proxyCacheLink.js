// @flow

import {
  ApolloLink,
  Observable
} from 'apollo-link'
import { hasDirectives } from 'apollo-utilities'
import { calculateArguments, didTimeout, DIRECTIVE, removeCacheDirective } from './utils'
import type { Cache } from './utils'

export const proxyCacheLink = (queryCache: Cache<String, Object>) => {
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
      const { id, timeout } = calculateArguments(query, operation.variables)

      const possibleData = queryCache.get(id)

      if (possibleData) {
        const { data, time } = possibleData
        if (didTimeout(timeout, time)) {
          queryCache.delete(id)
        } else {
          return Observable.of({ data })
        }
      }
      const obs =
        server && forward
          ? forward(operation)
          : Observable.of({
            data: {}
          })

      return new Observable(observer => {
        obs.subscribe({
          next: ({ data, errors }) => {
            if (!errors) {
              queryCache.set(id, { data, time: Number(new Date()) })
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
