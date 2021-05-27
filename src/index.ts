export { proxyCacheLink } from './proxyCacheLink'
export { createProxyCacheMiddleware } from './createProxyCacheMiddleware'
export { DIRECTIVE, removeCacheDirective } from './utils-browser-only'

export { InMemoryCache } from './caches/inmemory'
export { RedisCache } from './caches/redis'
export type { Cache } from './caches/types'
