import { createProxyMiddleware, Options } from 'http-proxy-middleware'
import { DocumentNode, parse } from 'graphql'
import { print } from 'graphql/language/printer'
import { hasDirectives } from 'apollo-utilities'
import type { Application, Request } from 'express'
import { decode, warnInDev } from './utils'
import type { Cache } from './caches/types'
import {
  calculateArguments,
  DIRECTIVE,
  removeCacheDirective,
  errorOnGet,
  errorOnSet,
  CacheKeyModifier,
} from './utils-browser-only'
const CACHE_HEADER = 'X-Proxy-Cached'

type RequestWithCache = Request & { _hasCache: { id: string; timeout: number } }

export const proxyCacheMiddleware =
  <T extends Cache<string, any>>(
    queryCache: T,
    cacheKeyModifier?: CacheKeyModifier
  ) =>
  (app: Application, endpoint: string, proxyConfig: Options) => {
    app.use(endpoint, async (req, response, next) => {
      if (!req.body && req.method === 'POST') {
        warnInDev(
          'skipping, request.body is not populated. Please add "body-parser" middleware (or similar).'
        ) // eslint-disable-line
        return next()
      }
      if (!req.body.query) {
        return next()
      }
      let doc: DocumentNode
      try {
        doc = parse(req.body.query)
      } catch (e) {
        warnInDev(`skipping, unable to parse query`, e)
        return next()
      }
      const isCache = hasDirectives([DIRECTIVE], doc)

      // we remove the @cache directive if it exists
      if (isCache) {
        const nextQuery = removeCacheDirective(doc)
        const { id, timeout } = calculateArguments(
          doc,
          req.body.variables,
          cacheKeyModifier,
          req
        )
        try {
          const possibleData = await queryCache.get(id)
          if (possibleData) {
            response.set(CACHE_HEADER, 'true')
            return response.json({ data: possibleData })
          }
        } catch (e) {
          errorOnGet(e)
        }
        // eslint-disable-next-line @typescript-eslint/no-extra-semi
        ;(req as RequestWithCache)._hasCache = { id, timeout }
        // could this be piped here (with req.pipe)
        req.body = { ...req.body, query: print(nextQuery) }
      }
      next()
    })

    const proxyInstance = createProxyMiddleware({
      ...proxyConfig,
      onProxyReq: (proxyReq, req, res) => {
        let data
        if (req.is('application/json')) {
          // We have to rewrite the request body due to body-parser's removal of the content.
          data = JSON.stringify(req.body)
          proxyReq.setHeader('Content-Length', Buffer.byteLength(data))
        }
        if (proxyConfig.onProxyReq) {
          proxyConfig.onProxyReq(proxyReq, req, res)
        }
        // We write the data at the end in case something get's manipulated before.
        if (data) {
          proxyReq.write(data)
        }
      },
      onProxyRes: async (proxyRes, req, res) => {
        if ((req as RequestWithCache)._hasCache) {
          const { id, timeout } = (req as RequestWithCache)._hasCache
          try {
            const response = JSON.parse(await decode(proxyRes))

            if (!response.errors && response.data) {
              await queryCache.set(id, response.data, timeout)
            }
          } catch (e) {
            errorOnSet(e)
          }
        }
        if (proxyConfig.onProxyRes) {
          proxyConfig.onProxyRes(proxyRes, req, res)
        }
      },
    })

    app.use(endpoint, proxyInstance)
    return proxyInstance
  }
