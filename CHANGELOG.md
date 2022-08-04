## [8.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v8.0.1...v8.0.2) (2022-08-04)


### Bug Fixes

* fixed a problem in case a query cannot be parsed and the application would crash without further error handling. Log warnings only in development mode ([7c6c9dc](https://github.com/BowlingX/apollo-proxy-cache/commit/7c6c9dcbb0b3a87ba1488e5e8898c9fbb931059b))

## [8.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v8.0.0...v8.0.1) (2022-04-10)


### Bug Fixes

* brought back nodejs 12 compatibility; Bumped dependencies ([ff84764](https://github.com/BowlingX/apollo-proxy-cache/commit/ff847648dc4eb94d251b62f71e6aea7d9b58b2ae))

# [8.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v7.0.5...v8.0.0) (2021-08-19)


### Bug Fixes

* **brotli:** removed deprecated brotli `iltorb` compression usage ([c26b0e1](https://github.com/BowlingX/apollo-proxy-cache/commit/c26b0e13955ef1893eb9831fca8f7296440b4b2f))
* **brotli:** removed deprecated brotli `iltorb` compression usage ([b8d9398](https://github.com/BowlingX/apollo-proxy-cache/commit/b8d939880126fe486952ba87632bb8a54ed30a0e))


### BREAKING CHANGES

* **brotli:** removed iltorb implementation, will break on earlier nodejs versions
* **brotli:** removed iltorb implementation, will break on earlier nodejs versions

## [7.0.5](https://github.com/BowlingX/apollo-proxy-cache/compare/v7.0.4...v7.0.5) (2021-06-01)


### Bug Fixes

* **formatting, crash:** fixed possible crashing when `[@cache](https://github.com/cache)` directive has missing arguments ([6671b5c](https://github.com/BowlingX/apollo-proxy-cache/commit/6671b5c06f8a186697ebfc2556c3397c4e6d12b6))

## [7.0.4](https://github.com/BowlingX/apollo-proxy-cache/compare/v7.0.3...v7.0.4) (2021-06-01)


### Bug Fixes

* **leak:** fixed memory leak, removed global `deleted` cache; switched to build in removal functionality ([ac402b6](https://github.com/BowlingX/apollo-proxy-cache/commit/ac402b688296a5f2f25e5b606190e57770747f7e))

## [7.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v7.0.2...v7.0.3) (2021-05-27)


### Bug Fixes

* **error:** fixed error handling, fixed header ([2285303](https://github.com/BowlingX/apollo-proxy-cache/commit/22853037dd2a48bafd770ded6807082e206020d3))

## [7.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v7.0.1...v7.0.2) (2021-05-27)


### Bug Fixes

* **api:** adjusted warn logic ([5001379](https://github.com/BowlingX/apollo-proxy-cache/commit/500137947a3f775f92009b77ad6c1cbef5b26bbb))

## [7.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v7.0.0...v7.0.1) (2021-05-27)


### Bug Fixes

* **api:** removed incompatible api parts ([68694b1](https://github.com/BowlingX/apollo-proxy-cache/commit/68694b16b9227eb341052ca35b75dbed7bdc983d))

# [7.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.2.0...v7.0.0) (2021-05-27)


### Features

* **request-handler:** Adjusted middleware to be compatible with non-express http implementations (e.g. nextjs http server) ([be4372a](https://github.com/BowlingX/apollo-proxy-cache/commit/be4372af1abece1893d4380c49b5a461a2432a4c))


### BREAKING CHANGES

* **request-handler:** API changed

# [6.2.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.1.0...v6.2.0) (2021-05-27)


### Bug Fixes

* **dep:** bumped dependencies ([e3f7949](https://github.com/BowlingX/apollo-proxy-cache/commit/e3f7949bb80252e83a4123ed7cde32c5ab746c9a))
* **dep:** bumped dependencies ([3982067](https://github.com/BowlingX/apollo-proxy-cache/commit/3982067ab35c68f8491bab31f46336f73a1cb0d5))
* **dep:** bumped eslint plugins ([b10d0b3](https://github.com/BowlingX/apollo-proxy-cache/commit/b10d0b33b19d11d45af5b25c5e54d714ff070a70))
* **dep:** fixed dependencies ([2dd906e](https://github.com/BowlingX/apollo-proxy-cache/commit/2dd906e1f726d7fee8c60c987d16a58b92cd3fe2))
* **ie11, node12:** fixed ie11 and node 12 support ([1b86533](https://github.com/BowlingX/apollo-proxy-cache/commit/1b86533b78e09a27a8413c5282f0998548338085))
* **node12:** bring back node 12 compatibility ([ad7b24e](https://github.com/BowlingX/apollo-proxy-cache/commit/ad7b24ef656c56ad18c511c1efdee70973d122af))


### Features

* **browser:** create separate build for browser and nodejs ([cf4aeab](https://github.com/BowlingX/apollo-proxy-cache/commit/cf4aeab2c2277f5cb114ccf101bad73ccfeef13a))
* **ts:** use latest master version with apollo 2.x compability. ([5853a1f](https://github.com/BowlingX/apollo-proxy-cache/commit/5853a1ff8177e367fe8dd6096aaee1c35f33edb3))

# [6.1.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.2...v6.1.0) (2021-03-05)


### Features

* **browser:** create separate build for browser and nodejs ([e6d737d](https://github.com/BowlingX/apollo-proxy-cache/commit/e6d737d870ecf9229559aaeb32434b1b59349173))

## [6.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.1...v6.0.2) (2021-03-05)


### Bug Fixes

* **ie11, node12:** fixed ie11 and node 12 support ([36023b5](https://github.com/BowlingX/apollo-proxy-cache/commit/36023b5cf1e8fcc70bcf5f206e0255b120462164))

## [6.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.0...v6.0.1) (2021-03-02)


### Bug Fixes

* **types:** fixed types ([b92a693](https://github.com/BowlingX/apollo-proxy-cache/commit/b92a693c26f823663b6718a7e792aa16189bf207))

# [6.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.3...v6.0.0) (2021-03-02)


### Bug Fixes

* **build:** fixed semis, added github plugin ([2b89572](https://github.com/BowlingX/apollo-proxy-cache/commit/2b895728a2f9e9d9a9cc5abf95158ac9852ebf43))


### Features

* **typescript:** migrated codebase to typescript, fixed possible memory leaks ([9e1cfe0](https://github.com/BowlingX/apollo-proxy-cache/commit/9e1cfe0fe2afa86bd82624dbc4dda6bc3fa9488d))


### BREAKING CHANGES

* **typescript:** This might cause flow errors as flow types are removed.

## [5.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.2...v5.0.3) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [5.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.1...v5.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([9e3953c](https://github.com/BowlingX/apollo-proxy-cache/commit/9e3953cac541934eb582373fbd96106a614ad7a5))
* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([0c3029d](https://github.com/BowlingX/apollo-proxy-cache/commit/0c3029d299b188a6554b7130e5ff1e2d91d9b23e))

## [5.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.0...v5.0.1) (2020-08-25)


### Bug Fixes

* **apollo:** fixed import ([f26447b](https://github.com/BowlingX/apollo-proxy-cache/commit/f26447bbf07b2db298a86834d06b4d45f0836290))

# [5.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.0...v5.0.0) (2020-08-25)


### Bug Fixes

* **apollo:** bumped apollo client to 3.x ([65de286](https://github.com/BowlingX/apollo-proxy-cache/commit/65de2867125bc3a5b708b081ec4bc1a500a2c863))


### BREAKING CHANGES

* **apollo:** Requires apollo client 3.x

## [4.1.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.1.0...v4.1.1) (2021-03-05)


### Bug Fixes

* **ie11, node12:** fixed ie11 and node 12 support ([1b86533](https://github.com/BowlingX/apollo-proxy-cache/commit/1b86533b78e09a27a8413c5282f0998548338085))

## [6.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.0...v6.0.1) (2021-03-02)


### Bug Fixes

* **types:** fixed types ([b92a693](https://github.com/BowlingX/apollo-proxy-cache/commit/b92a693c26f823663b6718a7e792aa16189bf207))

# [6.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.3...v6.0.0) (2021-03-02)


### Bug Fixes

* **build:** fixed semis, added github plugin ([2b89572](https://github.com/BowlingX/apollo-proxy-cache/commit/2b895728a2f9e9d9a9cc5abf95158ac9852ebf43))


### Features

* **typescript:** migrated codebase to typescript, fixed possible memory leaks ([9e1cfe0](https://github.com/BowlingX/apollo-proxy-cache/commit/9e1cfe0fe2afa86bd82624dbc4dda6bc3fa9488d))


### BREAKING CHANGES

* **typescript:** This might cause flow errors as flow types are removed.

## [5.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.2...v5.0.3) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [5.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.1...v5.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([9e3953c](https://github.com/BowlingX/apollo-proxy-cache/commit/9e3953cac541934eb582373fbd96106a614ad7a5))
* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([0c3029d](https://github.com/BowlingX/apollo-proxy-cache/commit/0c3029d299b188a6554b7130e5ff1e2d91d9b23e))

## [5.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.0...v5.0.1) (2020-08-25)


### Bug Fixes

* **apollo:** fixed import ([f26447b](https://github.com/BowlingX/apollo-proxy-cache/commit/f26447bbf07b2db298a86834d06b4d45f0836290))

# [5.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.0...v5.0.0) (2020-08-25)


### Bug Fixes

* **apollo:** bumped apollo client to 3.x ([65de286](https://github.com/BowlingX/apollo-proxy-cache/commit/65de2867125bc3a5b708b081ec4bc1a500a2c863))


### BREAKING CHANGES

* **apollo:** Requires apollo client 3.x

# [4.1.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.2...v4.1.0) (2021-03-03)


### Features

* **ts:** use latest master version with apollo 2.x compability. ([5853a1f](https://github.com/BowlingX/apollo-proxy-cache/commit/5853a1ff8177e367fe8dd6096aaee1c35f33edb3))

## [6.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.0...v6.0.1) (2021-03-02)


### Bug Fixes

* **types:** fixed types ([b92a693](https://github.com/BowlingX/apollo-proxy-cache/commit/b92a693c26f823663b6718a7e792aa16189bf207))

# [6.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.3...v6.0.0) (2021-03-02)


### Bug Fixes

* **build:** fixed semis, added github plugin ([2b89572](https://github.com/BowlingX/apollo-proxy-cache/commit/2b895728a2f9e9d9a9cc5abf95158ac9852ebf43))


### Features

* **typescript:** migrated codebase to typescript, fixed possible memory leaks ([9e1cfe0](https://github.com/BowlingX/apollo-proxy-cache/commit/9e1cfe0fe2afa86bd82624dbc4dda6bc3fa9488d))


### BREAKING CHANGES

* **typescript:** This might cause flow errors as flow types are removed.

## [5.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.2...v5.0.3) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [5.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.1...v5.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([9e3953c](https://github.com/BowlingX/apollo-proxy-cache/commit/9e3953cac541934eb582373fbd96106a614ad7a5))
* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([0c3029d](https://github.com/BowlingX/apollo-proxy-cache/commit/0c3029d299b188a6554b7130e5ff1e2d91d9b23e))

## [5.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.0...v5.0.1) (2020-08-25)


### Bug Fixes

* **apollo:** fixed import ([f26447b](https://github.com/BowlingX/apollo-proxy-cache/commit/f26447bbf07b2db298a86834d06b4d45f0836290))

# [5.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.0...v5.0.0) (2020-08-25)


### Bug Fixes

* **apollo:** bumped apollo client to 3.x ([65de286](https://github.com/BowlingX/apollo-proxy-cache/commit/65de2867125bc3a5b708b081ec4bc1a500a2c863))


### BREAKING CHANGES

* **apollo:** Requires apollo client 3.x

## [4.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.1...v4.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [4.2.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.2.0...v4.2.1) (2021-03-05)


### Bug Fixes

* **node12:** bring back node 12 compatibility ([ad7b24e](https://github.com/BowlingX/apollo-proxy-cache/commit/ad7b24ef656c56ad18c511c1efdee70973d122af))

# [4.2.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.1.1...v4.2.0) (2021-03-05)


### Features

* **browser:** create separate build for browser and nodejs ([cf4aeab](https://github.com/BowlingX/apollo-proxy-cache/commit/cf4aeab2c2277f5cb114ccf101bad73ccfeef13a))

## [4.1.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.1.0...v4.1.1) (2021-03-05)


### Bug Fixes

* **ie11, node12:** fixed ie11 and node 12 support ([1b86533](https://github.com/BowlingX/apollo-proxy-cache/commit/1b86533b78e09a27a8413c5282f0998548338085))

## [6.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.0...v6.0.1) (2021-03-02)


### Bug Fixes

* **types:** fixed types ([b92a693](https://github.com/BowlingX/apollo-proxy-cache/commit/b92a693c26f823663b6718a7e792aa16189bf207))

# [6.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.3...v6.0.0) (2021-03-02)


### Bug Fixes

* **build:** fixed semis, added github plugin ([2b89572](https://github.com/BowlingX/apollo-proxy-cache/commit/2b895728a2f9e9d9a9cc5abf95158ac9852ebf43))


### Features

* **typescript:** migrated codebase to typescript, fixed possible memory leaks ([9e1cfe0](https://github.com/BowlingX/apollo-proxy-cache/commit/9e1cfe0fe2afa86bd82624dbc4dda6bc3fa9488d))


### BREAKING CHANGES

* **typescript:** This might cause flow errors as flow types are removed.

## [5.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.2...v5.0.3) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [5.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.1...v5.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([9e3953c](https://github.com/BowlingX/apollo-proxy-cache/commit/9e3953cac541934eb582373fbd96106a614ad7a5))
* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([0c3029d](https://github.com/BowlingX/apollo-proxy-cache/commit/0c3029d299b188a6554b7130e5ff1e2d91d9b23e))

## [5.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.0...v5.0.1) (2020-08-25)


### Bug Fixes

* **apollo:** fixed import ([f26447b](https://github.com/BowlingX/apollo-proxy-cache/commit/f26447bbf07b2db298a86834d06b4d45f0836290))

# [5.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.0...v5.0.0) (2020-08-25)


### Bug Fixes

* **apollo:** bumped apollo client to 3.x ([65de286](https://github.com/BowlingX/apollo-proxy-cache/commit/65de2867125bc3a5b708b081ec4bc1a500a2c863))


### BREAKING CHANGES

* **apollo:** Requires apollo client 3.x

# [4.1.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.2...v4.1.0) (2021-03-03)


### Features

* **ts:** use latest master version with apollo 2.x compability. ([5853a1f](https://github.com/BowlingX/apollo-proxy-cache/commit/5853a1ff8177e367fe8dd6096aaee1c35f33edb3))

## [6.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v6.0.0...v6.0.1) (2021-03-02)


### Bug Fixes

* **types:** fixed types ([b92a693](https://github.com/BowlingX/apollo-proxy-cache/commit/b92a693c26f823663b6718a7e792aa16189bf207))

# [6.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.3...v6.0.0) (2021-03-02)


### Bug Fixes

* **build:** fixed semis, added github plugin ([2b89572](https://github.com/BowlingX/apollo-proxy-cache/commit/2b895728a2f9e9d9a9cc5abf95158ac9852ebf43))


### Features

* **typescript:** migrated codebase to typescript, fixed possible memory leaks ([9e1cfe0](https://github.com/BowlingX/apollo-proxy-cache/commit/9e1cfe0fe2afa86bd82624dbc4dda6bc3fa9488d))


### BREAKING CHANGES

* **typescript:** This might cause flow errors as flow types are removed.

## [5.0.3](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.2...v5.0.3) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [5.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.1...v5.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([9e3953c](https://github.com/BowlingX/apollo-proxy-cache/commit/9e3953cac541934eb582373fbd96106a614ad7a5))
* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([0c3029d](https://github.com/BowlingX/apollo-proxy-cache/commit/0c3029d299b188a6554b7130e5ff1e2d91d9b23e))

## [5.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v5.0.0...v5.0.1) (2020-08-25)


### Bug Fixes

* **apollo:** fixed import ([f26447b](https://github.com/BowlingX/apollo-proxy-cache/commit/f26447bbf07b2db298a86834d06b4d45f0836290))

# [5.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.0...v5.0.0) (2020-08-25)


### Bug Fixes

* **apollo:** bumped apollo client to 3.x ([65de286](https://github.com/BowlingX/apollo-proxy-cache/commit/65de2867125bc3a5b708b081ec4bc1a500a2c863))


### BREAKING CHANGES

* **apollo:** Requires apollo client 3.x

## [4.0.2](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.1...v4.0.2) (2020-12-20)


### Bug Fixes

* **timeout:** only timeout if > 0 ([41a6054](https://github.com/BowlingX/apollo-proxy-cache/commit/41a6054eda9ce3215df1152cda1dd6fda11aa660))

## [4.0.1](https://github.com/BowlingX/apollo-proxy-cache/compare/v4.0.0...v4.0.1) (2020-12-20)


### Bug Fixes

* **timeout:** fixed an issue that timeout is a string or empty. Now defaults to 0 and will be converted to a number. Bumped semantic release ([0c3029d](https://github.com/BowlingX/apollo-proxy-cache/commit/0c3029d299b188a6554b7130e5ff1e2d91d9b23e))

# [4.0.0](https://github.com/BowlingX/apollo-proxy-cache/compare/v3.0.0...v4.0.0) (2020-04-20)


### Features

* **export and dependencies:** return proxy instance by default now on server side, bumped dependencies and `http-proxy-middleware` ([bb17aa7](https://github.com/BowlingX/apollo-proxy-cache/commit/bb17aa738bc91e90a3e883ff1c40dfa8b1a95662))
* **export and dependencies:** return proxy instance by default now on server side, bumped dependencies and `http-proxy-middleware` ([83ef725](https://github.com/BowlingX/apollo-proxy-cache/commit/83ef7252b2a9e66bab85278dcd15f0e36e024ea6))


### BREAKING CHANGES

* **export and dependencies:** Uses 1.x middleware with different import scheme, see https://github.com/chimurai/http-proxy-middleware/releases
* **export and dependencies:** Uses 1.x middleware with different import scheme, see https://github.com/chimurai/http-proxy-middleware/releases

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
