apollo-proxy-cache
------------------

Using an external graphql server on your server side rendered node application can slow down the initial render time.

This library provides an apollo-link and express (proxy) middleware setup to support a local `@cache` directive for queries.
It comes with a default in-memory cache implementation (using `Map`). You can provide your own (e.g. `redis` etc.) by just
implementing a simple interface.

### Example

```graphql

query someQuery($arg1: String!) @cache(id: "cache-key", timeout: 3600, modifier: ["arg1"])  {
    field {
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


### TODO

- Add support for batch queries
- Add async cache interface support
