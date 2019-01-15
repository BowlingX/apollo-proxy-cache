// @flow

import proxy from 'http-proxy-middleware'
import { parse } from 'graphql'
import { print } from 'graphql/language/printer'
import { hasDirectives } from 'apollo-utilities'
import { calculateArguments, didTimeout, DIRECTIVE, removeCacheDirective } from './utils'
import type { Cache } from './utils'

const CACHE_HEADER = 'X-Proxy-Cached'

export const proxyCacheMiddleware =
    (queryCache: Cache<String, Object>) => (app: Object, endpoint: string, proxyConfig: Object) => {
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
          const { id, timeout } = calculateArguments(doc, req.body.variables)
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
          // We have to rewrite the request body and Content-Length after modifications
          if (req._hasCache) {
            const data = JSON.stringify(req.body)
            delete req.body
            proxyReq.setHeader('Content-Length', Buffer.byteLength(data))
            proxyReq.write(data)
          }
          if (proxyConfig.onProxyReq) {
            proxyConfig.onProxyReq(proxyReq, req, res)
          }
        },
        onProxyRes: (proxyRes, req, res) => {
          if (req._hasCache) {
            const { id } = req._hasCache
            // Save data into cache
            let body = new Buffer('')
            proxyRes.on('data', function(data) {
              body = Buffer.concat([ body, data ])
            })
            proxyRes.on('end', function() {
              try {
                const response = JSON.parse(body.toString())
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
