// @flow

import proxy from 'http-proxy-middleware'
import { parse } from 'graphql'
import { print } from 'graphql/language/printer'
import { hasDirectives } from 'apollo-utilities'
import { calculateArguments, didTimeout, DIRECTIVE, removeCacheDirective } from './utils'
import type { Cache, CacheKeyModifier } from './utils'
import zlib from 'zlib'
import { decompressSync } from 'iltorb'

const CACHE_HEADER = 'X-Proxy-Cached'

const decode = (res: Object, data: Buffer) => {
  const encoding = (res.getHeader('content-encoding') || '').trim().toLowerCase()
  if (encoding === 'gzip') {
    return zlib.gunzipSync(data).toString('utf8')
  } else if (encoding === 'deflate') {
    return zlib.inflateSync(data).toString('utf8')
  } else if (encoding === 'br') {
    return decompressSync(data).toString('utf8')
  }
  return data.toString('utf8')
}

export const proxyCacheMiddleware =
    (queryCache: Cache<string, Object>, cacheKeyModifier: CacheKeyModifier) =>
      (app: Object, endpoint: string, proxyConfig: Object) => {
        app.use(endpoint, (req, response, next) => {
          if (!req.body) {
      console.warn('[skip] proxy-cache-middleware, request.body is not populated. Please add "body-parser" middleware (or similar).') // eslint-disable-line
            return next()
          }
          if (!req.body.query) {
            return next()
          }
          const doc = parse(req.body.query)
          const isCache = hasDirectives([ DIRECTIVE ], doc)

          // we remove the @cache directive if it exists
          if (isCache) {
            const nextQuery = removeCacheDirective(doc)
            const { id, timeout } = calculateArguments(doc, req.body.variables, cacheKeyModifier, req)
            const possibleData = queryCache.get(id)
            if (possibleData) {
              const { data, time } = possibleData
              if (didTimeout(timeout, time)) {
                queryCache.delete(id)
              } else {
                response.set(CACHE_HEADER, 'true')
                return response.json({ data })
              }
            }
            req._hasCache = { id, timeout }
            // could this be piped here (with req.pipe)
            req.body = { ...req.body, query: print(nextQuery) }
          }
          next()
        })

        app.use(endpoint, proxy({
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
          onProxyRes: (proxyRes, req, res) => {
            if (req._hasCache) {
              const { id } = req._hasCache
              // Save data into cache
              let body = Buffer.from([])
              proxyRes.on('data', function(data) {
                body = Buffer.concat([ body, data ])
              })
              proxyRes.on('end', function() {
                try {
                  const response = JSON.parse(decode(res, body))
                  // We don't cache when there are any errors in the response
                  if (!response.errors && response.data) {
                    queryCache.set(id, { data: response.data, time: Number(new Date()) })
                  }
                } catch (e) {
            console.error(`Exception during cache processing with id ${id}`, e) // eslint-disable-line
                }
              })
            }
            if (proxyConfig.onProxyRes) {
              proxyConfig.onProxyRes(proxyRes, req, res)
            }
          }
        }))
      }
