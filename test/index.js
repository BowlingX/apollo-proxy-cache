// @flow

import express from 'express'
import { proxyCacheMiddleware } from '../src/index'
import bodyParser from 'body-parser'
import { InMemoryCache } from '../src/caches/inmemory'
import { RedisCache } from '../src/caches/redis'
import redis from 'redis'

const app = express()
const queryCache = new InMemoryCache()

const client = redis.createClient()

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
