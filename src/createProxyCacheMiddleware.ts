import { hasDirectives } from 'apollo-utilities'
import bp from 'body-parser'
import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { DocumentNode, parse, print } from 'graphql'
import {
  createProxyMiddleware,
  fixRequestBody,
  Options,
} from 'http-proxy-middleware'
import type { Cache } from './caches/types.js'
import {
  calculateArguments,
  DIRECTIVE,
  removeCacheDirective,
  errorOnGet,
  errorOnSet,
  CacheKeyModifier,
} from './utils-browser-only.js'
import { decode, warnInDev } from './utils.js'
const CACHE_HEADER = 'X-Proxy-Cached'

type RequestWithCache = Request & { _hasCache: { id: string; timeout: number } }

const { json } = bp

const middlewareToPromise =
  (middleware: RequestHandler) =>
  (req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) => {
    return new Promise<ReturnType<RequestHandler>>((resolve, reject) => {
      const next = (x: unknown) => (x ? reject(x) : resolve())
      middleware(req, res, next)
    })
  }

const jsonBodyParserPromise = middlewareToPromise(json())

export const createProxyCacheMiddleware =
  <T extends Cache<string, any>>(
    queryCache: T,
    cacheKeyModifier?: CacheKeyModifier,
  ) =>
  (proxyConfig: Options) => {
    const directiveMiddleware = async (
      req: RequestWithCache,
      response: Response,
      next: NextFunction,
    ) => {
      if (!req.body && req.method === 'POST') {
        await jsonBodyParserPromise(req, response)
      }
      if (!req.body?.query) {
        return next()
      }
      let doc: DocumentNode
      try {
        doc = parse(req.body?.query)
      } catch (e) {
        warnInDev(`skipping, unable to parse query`, e as Error)
        return next()
      }
      const isCache = hasDirectives([DIRECTIVE], doc)

      // we remove the @cache directive if it exists
      if (isCache) {
        try {
          const nextQuery = removeCacheDirective(doc)
          const { id, timeout } = calculateArguments(
            doc,
            req.body.variables,
            cacheKeyModifier,
            req,
          )
          const possibleData = await queryCache.get(id)
          if (possibleData) {
            response.setHeader(CACHE_HEADER, 'true')
            return response.json({ data: possibleData })
          }
          req._hasCache = { id, timeout }
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          // could this be piped here (with req.pipe)
          req.body = { ...req.body, query: print(nextQuery) }
        } catch (e) {
          errorOnGet(e as Error)
        }
      }
      next()
    }

    const proxyMiddleware = createProxyMiddleware({
      ...proxyConfig,
      onProxyReq: fixRequestBody,
      onProxyRes: async (proxyRes, req, res) => {
        if ((req as RequestWithCache)._hasCache) {
          const { id, timeout } = (req as RequestWithCache)._hasCache
          try {
            const response = JSON.parse(await decode(proxyRes))

            if (!response.errors && response.data) {
              await queryCache.set(id, response.data, timeout)
            }
          } catch (e) {
            errorOnSet(e as Error)
          }
        }
        if (proxyConfig.onProxyRes) {
          proxyConfig.onProxyRes(proxyRes, req, res)
        }
      },
    })

    return { proxyMiddleware, directiveMiddleware }
  }
