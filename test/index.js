// @flow

import express from 'express'
import { proxyCacheMiddleware } from '../src/index'
import bodyParser from 'body-parser'
import { RedisCache } from '../src/caches/redis'
import Redis from 'ioredis'

const app = express()

const client = new Redis()

const redisCache = new RedisCache(client)

const middleware = proxyCacheMiddleware(
  redisCache,
  v => v
)

app.use(bodyParser.json())
middleware(app, '/',
  /* the endpoint (will be proxied from localhost/graphql to target)*/
  { target: 'http://api/', changeOrigin: true }
  /* configuration object for http-proxy-middleware */)

app.listen(3000)
