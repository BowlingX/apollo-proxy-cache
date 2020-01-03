# [3.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v2.0.4...v3.0.0) (2020-01-03)


### Features

* **browser:** adjusted structure to be browser compatible. ([35317c9](https://github.com/BowlingX/apollo-proxy-cache/commit/35317c9c8e8806b556bb4dd07834b90b2b38ade6))


### BREAKING CHANGES

* **browser:** removed support for `redis` library, added `ioredis` instead

## [2.0.4](https://github.com/BowlingX/apollo-proxy-cache/compare/v2.0.3...v2.0.4) (2019-07-28)


### Bug Fixes

* **brotli:** fixed brotli decoding for legacy node versions ([983e972](https://github.com/BowlingX/apollo-proxy-cache/commit/983e972))

## [2.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v2.0.2...v2.0.3) (2019-07-28)


### Bug Fixes

* **apollo-link:** optimized stack ([a83db09](https://github.com/BowlingX/apollo-proxy-cache/commit/a83db09))

## [2.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v2.0.1...v2.0.2) (2019-07-28)


### Bug Fixes

* **apollo-link:** removed async calls ([843c826](https://github.com/BowlingX/apollo-proxy-cache/commit/843c826))

## [2.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v2.0.0...v2.0.1) (2019-07-28)


### Bug Fixes

* **apollo-link:** fixed async link implementation ([0e43c80](https://github.com/BowlingX/apollo-proxy-cache/commit/0e43c80))

# [2.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.6...v2.0.0) (2019-07-28)


### Features

* **async:** Replaced all sync methods with async implementation including caches. ([86f06cd](https://github.com/BowlingX/apollo-proxy-cache/commit/86f06cd))


### BREAKING CHANGES

* **async:** Cache implementations are now async. Please supply the new `InMemoryCache` or `RedisCache`.

## [1.2.6](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.5...v1.2.6) (2019-03-19)


### Bug Fixes

* **onProxyReq:** fixed a case when e.g. headers are manipulated in a callback handler (onProxyReq). ([ec8aa1c](https://github.com/BowlingX/apollo-proxy-cache/commit/ec8aa1c))

## [1.2.5](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.4...v1.2.5) (2019-03-13)


### Bug Fixes

* **iltorb:** use native library instead ([936191f](https://github.com/BowlingX/apollo-proxy-cache/commit/936191f))

## [1.2.4](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.3...v1.2.4) (2019-03-13)


### Bug Fixes

* **brotli:** fixed return type to be Buffer not UInt8Array ([00d311e](https://github.com/BowlingX/apollo-proxy-cache/commit/00d311e))

## [1.2.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.2...v1.2.3) (2019-03-13)


### Bug Fixes

* **brotli:** add support for brotli encoding ([ff0ea4c](https://github.com/BowlingX/apollo-proxy-cache/commit/ff0ea4c))

## [1.2.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.1...v1.2.2) (2019-03-13)


### Bug Fixes

* **request:** dont readd request body when no json ([f460814](https://github.com/BowlingX/apollo-proxy-cache/commit/f460814))

## [1.2.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.2.0...v1.2.1) (2019-03-05)


### Bug Fixes

* **encode:** fixed wrong header ([beab287](https://github.com/BowlingX/apollo-proxy-cache/commit/beab287))

# [1.2.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.1.1...v1.2.0) (2019-03-05)


### Features

* **encode:** Added compression support ([8568f87](https://github.com/BowlingX/apollo-proxy-cache/commit/8568f87))

## [1.1.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.1.0...v1.1.1) (2019-03-04)


### Bug Fixes

* **context:** pass request or current context to key builder ([b5604c4](https://github.com/BowlingX/apollo-proxy-cache/commit/b5604c4))

# [1.1.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.0.4...v1.1.0) (2019-03-04)


### Features

* **cacheModifier:** Added cache modifier function, bumped dependencies ([4e24acc](https://github.com/BowlingX/apollo-proxy-cache/commit/4e24acc))

## [1.0.4](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.0.3...v1.0.4) (2019-01-18)


### Bug Fixes

* **middleware:** invalid removal of body ([e4cf62e](https://github.com/BowlingX/apollo-proxy-cache/commit/e4cf62e))

## [1.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.0.2...v1.0.3) (2019-01-18)


### Bug Fixes

* **nullpointer:** modifier should be optional. ([e318fad](https://github.com/BowlingX/apollo-proxy-cache/commit/e318fad))

## [1.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.0.1...v1.0.2) (2019-01-15)


### Bug Fixes

* **proxy:** forward onProxyRes and onProxyReq event handlers. ([46026c9](https://github.com/BowlingX/apollo-proxy-cache/commit/46026c9))

## [1.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v1.0.0...v1.0.1) (2019-01-15)


### Bug Fixes

* **dep:** downgraded apollo-utilities ([9f533e7](https://github.com/BowlingX/apollo-proxy-cache/commit/9f533e7))

# 1.0.0 (2019-01-15)


### Bug Fixes

* **release:** adjusted node version ([a1853cd](https://github.com/BowlingX/apollo-proxy-cache/commit/a1853cd))
* **release:** setup release ([8563f4e](https://github.com/BowlingX/apollo-proxy-cache/commit/8563f4e))
