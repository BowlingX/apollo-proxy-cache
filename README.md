apollo-proxy-cache
------------------

[![CircleCI](https://circleci.com/gh/BowlingX/apollo-proxy-cache/tree/master.svg?style=svg)](https://circleci.com/gh/BowlingX/apollo-proxy-cache/tree/master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Using an external graphql server on your server side rendered node application can slow down the initial render time.

This library provides an apollo-link and express (proxy) middleware setup to support a local `@cache` directive for queries.
It comes with a default in-memory cache implementation (using `Map`). You can provide your own (e.g. `redis` etc.) by just
implementing a simple interface.

### Install

    yarn add apollo-proxy-cache 
    
    or 
    
    npm install apollo-proxy-cache


### Example Query

```graphql

query someQuery($arg1: String!) @cache(id: "cache-key", timeout: 3600, modifier: ["arg1"])  {
    field(arg: $arg1) {
        property
    }
}

```

### Options

| name     | description                                                                                                                                                                                                                                                                | type            | required |   |
|----------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|----------|---|
| id       | static cache key                                                                                                                                                                                                                                                           | `string`        | **true** |   |
| timeout  | when the cache should be invalidated (in seconds), if unset or 0 it will be cached indefinitely.                                                                                                                                                                           | `number`        | false    |   |
| modifier | path's inside any query argument that should be appended to the cache key. `lodash` is used for property access, so you can use `.` and `[]` delimiters (e.g. `some.path[0].in.array`). A resulting cache could look like `$id.$firstPathsValue.$secondPathsValue` etc.    | `Array<String>` | false    |   |

### Setup

The library requires to have `body-parser` (see https://www.npmjs.com/package/body-parser or similar) in the middleware chain.
Please add accordingly to the setup example.

#### Express

The Express middleware will either redirect the request to your graphql server or serve the request locally (depending on the `@cache` settings for the query).
It will additionally remove the `@cache` directive and forward only the pure query to your server.
There are no changes on your implementation required.

```js
import { proxyCacheMiddleware } from 'apollo-proxy-cache'
import express from 'express'
const queryCache = new Map()
import bodyParser from 'body-parser'

const proxyMiddlewareFactory = proxyCacheMiddleware(queryCache)

const app = express()
app.use(bodyParser.json()) // setup body-parser before (or anything else that populates request.body).
proxyMiddlewareFactory(
    app, 
    '/graphql', /* the endpoint (will be proxied from localhost/graphql to target)*/
    { target: "http://graphql-server.com", changeOrigin: true } /* configuration object for http-proxy-middleware */
    )
```


#### Apollo-Link Setup (on node side)

To speed up the initial rendering you can also setup the `proxyCacheLink`. 
This will skip any http request and server directly from your cache implementation.
```js
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { from } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { proxyCacheLink } from 'apollo-proxy-cache'

 const queryCache = new Map() /* Make sure you use the same instance that you use in the middleware setup.*/

  const proxyCache = proxyCacheLink(queryCache)
  const cache = new InMemoryCache()

  const httpLink = createHttpLink({ uri: 'http://graphql-server.com' })

  return new ApolloClient({
    ssrMode: true,
    link: from([
      proxyCache,
      httpLink
    ]),
    cache
  })

```

### Cache implementation's

Your cache implementation needs to implement the following interface (here in flow):

```js
interface Cache<K, V> {
    delete(key: K): boolean;
    get(key: K): ?V;
    set(key: K, value: V): Cache<K, V>;
}
```

Javascript's `Map` implements this interface, so you can use that as default.

### TODO

- Add support for batch queries
- Add async cache interface support
