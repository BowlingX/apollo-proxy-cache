import {
  ApolloClient,
  ApolloLink,
  execute,
  gql,
  InMemoryCache as ApolloInMemoryCache,
} from '@apollo/client/core'
import { MockLink, MockedResponse, tick } from '@apollo/client/testing/core'
import { GraphQLError } from 'graphql'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCache } from '../caches/inmemory.js'
import type { Cache } from '../caches/types.js'
import { proxyCacheLink } from '../proxyCacheLink.js'
import { removeCacheDirective } from '../utils-browser-only.js'

type Data = Record<string, any> | null

const QUERY = gql`
  query Foo @cache(id: "foo", timeout: "60") {
    foo
  }
`
// What the link forwards downstream: the same query with `@cache` stripped.
const NETWORK_QUERY = removeCacheDirective(QUERY)
const NETWORK_DATA = { foo: 'network' }
const CACHED_DATA = { foo: 'cached' }

const createCache = (get: Cache<string, Data>['get'] = async () => null) => {
  const cache: Cache<string, Data> = {
    get: vi.fn(get),
    set: vi.fn(async () => cache),
    delete: vi.fn(async () => true),
  }
  return cache
}

const networkMock = (
  result: MockedResponse['result'] = { data: NETWORK_DATA },
): MockedResponse => ({ request: { query: NETWORK_QUERY }, result })

const createMockLink = (mocks: MockedResponse[] = [networkMock()]) =>
  new MockLink(mocks, false, { showWarnings: false })

const createClient = (link: ApolloLink) =>
  new ApolloClient({
    cache: new ApolloInMemoryCache({ addTypename: false }),
    link,
  })

const query = (client: ApolloClient<unknown>, errorPolicy?: 'all') =>
  client.query({ query: QUERY, fetchPolicy: 'no-cache', errorPolicy })

describe('proxyCacheLink', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('forwards operations without @cache untouched', async () => {
    const cache = createCache()
    const plain = gql`
      query Plain {
        foo
      }
    `
    const client = createClient(
      ApolloLink.from([
        proxyCacheLink(cache),
        createMockLink([
          { request: { query: plain }, result: { data: NETWORK_DATA } },
        ]),
      ]),
    )

    const result = await client.query({ query: plain, fetchPolicy: 'no-cache' })

    expect(result.data).toEqual(NETWORK_DATA)
    expect(cache.get).not.toHaveBeenCalled()
    expect(cache.set).not.toHaveBeenCalled()
  })

  it('serves a hit from the cache without touching the network', async () => {
    const cache = createCache(async () => CACHED_DATA)
    const mockLink = createMockLink([])
    const request = vi.spyOn(mockLink, 'request')
    const client = createClient(
      ApolloLink.from([proxyCacheLink(cache), mockLink]),
    )

    const result = await query(client)

    expect(result.data).toEqual(CACHED_DATA)
    expect(cache.get).toHaveBeenCalledWith('foo')
    expect(request).not.toHaveBeenCalled()
    expect(cache.set).not.toHaveBeenCalled()
  })

  it('on a miss forwards to the network and writes the result through', async () => {
    const cache = createCache()
    const client = createClient(
      ApolloLink.from([proxyCacheLink(cache), createMockLink()]),
    )

    const result = await query(client)

    expect(result.data).toEqual(NETWORK_DATA)
    expect(cache.set).toHaveBeenCalledWith('foo', NETWORK_DATA, 60)
  })

  it('applies the cacheKeyModifier to the cache key', async () => {
    const cache = createCache()
    const client = createClient(
      ApolloLink.from([
        proxyCacheLink(cache, (key) => `de.${key}`),
        createMockLink(),
      ]),
    )

    await query(client)

    expect(cache.get).toHaveBeenCalledWith('de.foo')
    expect(cache.set).toHaveBeenCalledWith('de.foo', NETWORK_DATA, 60)
  })

  it('does not cache responses that carry errors', async () => {
    const cache = createCache()
    const client = createClient(
      ApolloLink.from([
        proxyCacheLink(cache),
        createMockLink([
          networkMock({ data: null, errors: [new GraphQLError('nope')] }),
        ]),
      ]),
    )

    const result = await query(client, 'all')

    expect(result.errors).toHaveLength(1)
    expect(cache.set).not.toHaveBeenCalled()
  })

  it('writes through so the next identical query is served from the cache', async () => {
    const cache = new InMemoryCache()
    // exactly one mocked network response: a second network call would error
    const mockLink = createMockLink()
    const request = vi.spyOn(mockLink, 'request')
    const client = createClient(
      ApolloLink.from([proxyCacheLink(cache), mockLink]),
    )

    expect((await query(client)).data).toEqual(NETWORK_DATA)
    expect((await query(client)).data).toEqual(NETWORK_DATA)

    expect(request).toHaveBeenCalledTimes(1)
  })

  it('falls back to the network when the cache `get` rejects instead of hanging the query', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const cache = createCache(async () => {
      throw new Error('redis down')
    })
    const client = createClient(
      ApolloLink.from([proxyCacheLink(cache), createMockLink()]),
    )

    const result = await query(client)

    expect(result.data).toEqual(NETWORK_DATA)
    // the failed read is logged, and the fresh result is still written back
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('on `get`'),
      expect.any(Error),
    )
    expect(cache.set).toHaveBeenCalledWith('foo', NETWORK_DATA, 60)
  })

  it('reports a synchronously throwing downstream link as a query error instead of hanging', async () => {
    const cache = createCache()
    const boom = new ApolloLink(() => {
      throw new Error('boom')
    })
    const client = createClient(ApolloLink.from([proxyCacheLink(cache), boom]))

    await expect(query(client)).rejects.toThrow('boom')
  })

  it('does not fire a network request when unsubscribed while the cache read is pending', async () => {
    let resolveGet!: (data: Data) => void
    const cache = createCache(
      () =>
        new Promise<Data>((resolve) => {
          resolveGet = resolve
        }),
    )
    const mockLink = createMockLink()
    const request = vi.spyOn(mockLink, 'request')
    const next = vi.fn()

    const subscription = execute(
      ApolloLink.from([proxyCacheLink(cache), mockLink]),
      { query: QUERY },
    ).subscribe({ next })
    subscription.unsubscribe()
    resolveGet(null)
    await tick()

    expect(request).not.toHaveBeenCalled()
    expect(cache.set).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })
})
