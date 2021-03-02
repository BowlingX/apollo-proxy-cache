import type {
  DocumentNode,
  ListValueNode,
  OperationDefinitionNode,
  StringValueNode,
  DirectiveNode,
} from 'graphql'
import { checkDocument, cloneDeep } from 'apollo-utilities'
import _get from 'lodash/get'

export function removeDirectivesFromQuery(
  doc: DocumentNode,
  directive: string
) {
  const docClone = cloneDeep(doc)
  docClone.definitions.forEach((definition) => {
    if ((definition as OperationDefinitionNode).directives) {
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;(definition as any).directives = (definition as OperationDefinitionNode).directives?.filter(
        (d) => d.name.value !== directive
      )
    }
  })
  return docClone
}

const removed = new Map()

export function removeCacheDirective(query: DocumentNode): DocumentNode {
  const cached = removed.get(query)
  if (cached) return cached

  checkDocument(query)
  const docClone = removeDirectivesFromQuery(query, 'cache')
  removed.set(query, docClone)
  return docClone
}

type ValueValueNodes = StringValueNode

type Directive<K> = {
  id: K
  timeout?: string
  modifier?: string[]
}

export function getDirectiveArgumentsAsObject<K>(
  doc: DocumentNode,
  directive: string
) {
  return _get(doc.definitions, '0.directives', [])
    .filter((v: DirectiveNode) => v.name.value === directive)
    .reduce((next: Record<string, string[] | string>, v: DirectiveNode) => {
      return {
        ...v.arguments?.reduce(
          (next, v) => ({
            [v.name.value]:
              (v.value as ValueValueNodes).value ||
              ((v.value as ListValueNode).values
                ? (v.value as ListValueNode).values?.map(
                    (v) => (v as ValueValueNodes).value
                  )
                : undefined),
            ...next,
          }),
          {}
        ),
        ...next,
      }
    }, {}) as Directive<K>
}

export const DIRECTIVE = 'cache'

export type CacheKeyModifier = <T>(
  key: string,
  variables?: Record<string, any>,
  context?: T
) => string

export const didTimeout = (timeout: number, time: number) =>
  timeout > 0 && time + Number(timeout) * 1000 < Number(new Date())

export const calculateArguments = <K extends string, T = Record<string, any>>(
  query: DocumentNode,
  variables?: Record<string, any>,
  cacheKeyModifier?: CacheKeyModifier,
  context?: T
) => {
  const { id, timeout, modifier } = getDirectiveArgumentsAsObject<K>(
    query,
    DIRECTIVE
  )
  let thisId = modifier
    ? modifier.reduce((next, path) => {
        return `${next}.${_get(variables, path, '')}`
      }, id)
    : id

  if (cacheKeyModifier) {
    thisId = cacheKeyModifier(thisId, variables, context)
  }

  if (!thisId) {
    throw new Error(`@${DIRECTIVE} directive requires a unique id.`)
  }

  return { id: thisId as K, timeout: Number(timeout || 0) || 0, modifier }
}

export const errorOnSet = (e: Error) => {
  // eslint-disable-next-line no-console
  console.error('[CACHE] Cache implementation threw Exception on `set`', e)
}

export const errorOnGet = (e: Error) => {
  // eslint-disable-next-line no-console
  console.error('[CACHE] Cache implementation threw Exception on `get`', e)
}
