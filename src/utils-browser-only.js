// @flow

import type { DocumentNode } from 'graphql'
import { checkDocument, cloneDeep } from 'apollo-utilities'
import _get from 'lodash/get'

export function removeDirectivesFromQuery(doc: DocumentNode, directive: string) {
  const docClone = cloneDeep(doc)
  docClone.definitions.forEach((definition: Object) => {
    definition.directives = definition.directives.filter(d => d.name.value !== directive)
  })
  return docClone
}

const removed = new Map()

export function removeCacheDirective(
  query: DocumentNode,
): DocumentNode {
  const cached = removed.get(query)
  if (cached) return cached

  checkDocument(query)
  const docClone = removeDirectivesFromQuery(
    query,
    'cache'
  )
  removed.set(query, docClone)
  return docClone
}

export function getDirectiveArgumentsAsObject(doc: DocumentNode, directive: string) {
  return _get(doc.definitions, '0.directives', [])
    .filter(v => v.name.value === directive)
    .reduce((next, v) => {
      return {
        ...v.arguments.reduce((next, v) => (
          { [v.name.value]: v.value.value ||
            (v.value.values ? v.value.values.map(v => v.value) : undefined), ...next }), {}),
        ...next
      }
    }, {})
}

export const DIRECTIVE = 'cache'

export type CacheKeyModifier = (?string, ?Object, ?Object) => ?string

export const didTimeout = (timeout: number, time: number) =>
  timeout > 0 && ((time + (Number(timeout) * 1000)) < Number(new Date()))

export const calculateArguments =
  (query: DocumentNode, variables: ?Object, cacheKeyModifier: ?CacheKeyModifier, context: Object) => {
    const { id, timeout, modifier } = getDirectiveArgumentsAsObject(query, DIRECTIVE)
    let thisId = modifier ? modifier.reduce((next, path) => {
      return `${next}.${_get(variables, path, '')}`
    }, id) : id

    if (cacheKeyModifier) {
      thisId = cacheKeyModifier(thisId, variables, context)
    }

    if (!thisId) {
      throw new Error(`@${DIRECTIVE} directive requires a unique id.`)
    }

    return { id: thisId, timeout: Number(timeout || 0) || 0, modifier }
  }

export const errorOnSet = (e: Object) => {
  // eslint-disable-next-line no-console
  console.error('[CACHE] Cache implementation threw Exception on `set`', e)
}

export const errorOnGet = (e: Object) => {
  // eslint-disable-next-line no-console
  console.error('[CACHE] Cache implementation threw Exception on `get`', e)
}
