import http from 'http'
import type { AddressInfo } from 'net'
import express from 'express'
import { parse, print } from 'graphql'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCache } from '../caches/inmemory.js'
import type { Cache } from '../caches/types.js'
import { createProxyCacheMiddleware } from '../createProxyCacheMiddleware.js'
import {
  CacheKeyModifier,
  removeCacheDirective,
} from '../utils-browser-only.js'
import { stream } from '../utils.js'

type Data = Record<string, any> | null
type DirectiveMiddleware = ReturnType<
  ReturnType<typeof createProxyCacheMiddleware>
>['directiveMiddleware']
type Req = Parameters<DirectiveMiddleware>[0]
type Res = Parameters<DirectiveMiddleware>[1]

const QUERY = 'query Foo @cache(id: "foo", timeout: "60") { foo }'
// What the middleware forwards upstream: the same query with `@cache` stripped.
const NETWORK_QUERY = print(removeCacheDirective(parse(QUERY)))
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

describe('createProxyCacheMiddleware', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('directiveMiddleware', () => {
    const create = (cache: Cache<string, Data>, modifier?: CacheKeyModifier) =>
      createProxyCacheMiddleware(
        cache,
        modifier,
      )({
        target: 'http://upstream.invalid',
        logLevel: 'silent',
      }).directiveMiddleware

    const createRequest = (
      body: unknown,
      headers: Record<string, string> = {},
    ) => ({ method: 'POST', headers, body }) as unknown as Req

    const run = async (middleware: DirectiveMiddleware, req: Req) => {
      const res = { setHeader: vi.fn(), json: vi.fn() }
      const next = vi.fn()
      await middleware(req, res as unknown as Res, next)
      return { res, next }
    }

    it('passes requests without a GraphQL body straight through', async () => {
      const cache = createCache()

      const { next, res } = await run(create(cache), createRequest({}))

      expect(next).toHaveBeenCalledTimes(1)
      expect(cache.get).not.toHaveBeenCalled()
      expect(res.json).not.toHaveBeenCalled()
    })

    it('passes queries without @cache through untouched', async () => {
      const cache = createCache()
      const body = { query: 'query Plain { foo }', variables: { a: 1 } }
      const req = createRequest({ ...body })

      const { next } = await run(create(cache), req)

      expect(next).toHaveBeenCalledTimes(1)
      expect(cache.get).not.toHaveBeenCalled()
      expect(req.body).toEqual(body)
      expect(req._hasCache).toBeUndefined()
    })

    it('skips queries it cannot parse', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const cache = createCache()

      const { next } = await run(
        create(cache),
        createRequest({ query: 'query {' }),
      )

      expect(next).toHaveBeenCalledTimes(1)
      expect(cache.get).not.toHaveBeenCalled()
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('unable to parse query'),
        expect.any(Error),
      )
    })

    it('answers a cache hit directly and marks the response as cached', async () => {
      const cache = createCache(async () => CACHED_DATA)

      const { next, res } = await run(
        create(cache),
        createRequest({ query: QUERY }),
      )

      expect(cache.get).toHaveBeenCalledWith('foo')
      expect(res.setHeader).toHaveBeenCalledWith('X-Proxy-Cached', 'true')
      expect(res.json).toHaveBeenCalledWith({ data: CACHED_DATA })
      expect(next).not.toHaveBeenCalled()
    })

    it('on a miss strips @cache from the forwarded query and records the cache key', async () => {
      const cache = createCache()
      const req = createRequest({ query: QUERY, variables: { a: 1 } })

      const { next, res } = await run(create(cache), req)

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.json).not.toHaveBeenCalled()
      expect(req.body).toEqual({ query: NETWORK_QUERY, variables: { a: 1 } })
      expect(req._hasCache).toEqual({ id: 'foo', timeout: 60 })
    })

    it('applies the cacheKeyModifier with the request as context', async () => {
      const cache = createCache()
      const middleware = create(cache, (key, _variables, context) => {
        const { headers } = context as unknown as Req
        return `${headers['accept-language']}.${key}`
      })

      await run(
        middleware,
        createRequest({ query: QUERY }, { 'accept-language': 'de' }),
      )

      expect(cache.get).toHaveBeenCalledWith('de.foo')
    })

    it('falls through to the proxy when the cache `get` rejects', async () => {
      const error = vi.spyOn(console, 'error').mockImplementation(() => {})
      const cache = createCache(async () => {
        throw new Error('redis down')
      })

      const { next, res } = await run(
        create(cache),
        createRequest({ query: QUERY }),
      )

      expect(next).toHaveBeenCalledTimes(1)
      expect(res.json).not.toHaveBeenCalled()
      expect(error).toHaveBeenCalledWith(
        expect.stringContaining('on `get`'),
        expect.any(Error),
      )
    })
  })

  describe('proxying end to end', () => {
    const servers: http.Server[] = []

    afterEach(async () => {
      await Promise.all(
        servers.splice(0).map(
          (server) =>
            new Promise<void>((resolve, reject) => {
              server.closeAllConnections()
              server.close((error) => (error ? reject(error) : resolve()))
            }),
        ),
      )
    })

    const listen = async (server: http.Server) => {
      await new Promise<void>((resolve) =>
        server.listen(0, '127.0.0.1', resolve),
      )
      servers.push(server)
      const { port } = server.address() as AddressInfo
      return `http://127.0.0.1:${port}`
    }

    const startUpstream = async (
      respond: () => unknown = () => ({ data: NETWORK_DATA }),
    ) => {
      const received: unknown[] = []
      const url = await listen(
        http.createServer(async (req, res) => {
          received.push(JSON.parse(await stream(req)))
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(respond()))
        }),
      )
      return { url, received }
    }

    const startApp = async (cache: Cache<string, Data>, target: string) => {
      // Settles once the proxy has post-processed the upstream response; the
      // cache write-through happens before the user's onProxyRes hook runs.
      let settle!: () => void
      const proxied = new Promise<void>((resolve) => {
        settle = resolve
      })
      const onProxyRes = vi.fn(() => settle())
      const { proxyMiddleware, directiveMiddleware } =
        createProxyCacheMiddleware(cache)({
          target,
          changeOrigin: true,
          logLevel: 'silent',
          onProxyRes,
        })

      const app = express()
      // no body parser on purpose: the directive middleware parses JSON itself
      app.use(
        '/graphql',
        (req, res, next) => directiveMiddleware(req as Req, res, next),
        proxyMiddleware,
      )
      const url = await listen(http.createServer(app))
      return { url, proxied, onProxyRes }
    }

    const post = (url: string, body: unknown) =>
      fetch(`${url}/graphql`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      })

    it('proxies a miss upstream with @cache stripped and serves the next request from the cache', async () => {
      const cache = new InMemoryCache()
      const upstream = await startUpstream()
      const app = await startApp(cache, upstream.url)

      const first = await post(app.url, { query: QUERY, variables: { a: 1 } })

      expect(first.status).toBe(200)
      expect(first.headers.get('x-proxy-cached')).toBeNull()
      expect(await first.json()).toEqual({ data: NETWORK_DATA })
      expect(upstream.received).toEqual([
        { query: NETWORK_QUERY, variables: { a: 1 } },
      ])
      await app.proxied
      expect(await cache.get('foo')).toEqual(NETWORK_DATA)

      const second = await post(app.url, { query: QUERY, variables: { a: 1 } })

      expect(second.status).toBe(200)
      expect(second.headers.get('x-proxy-cached')).toBe('true')
      expect(await second.json()).toEqual({ data: NETWORK_DATA })
      expect(upstream.received).toHaveLength(1)
      expect(app.onProxyRes).toHaveBeenCalledTimes(1)
    })

    it('does not cache upstream responses that carry errors', async () => {
      const cache = createCache()
      const payload = { data: null, errors: [{ message: 'nope' }] }
      const upstream = await startUpstream(() => payload)
      const app = await startApp(cache, upstream.url)

      const response = await post(app.url, { query: QUERY })

      expect(await response.json()).toEqual(payload)
      await app.proxied
      expect(cache.set).not.toHaveBeenCalled()
    })
  })
})
