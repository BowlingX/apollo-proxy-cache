// @flow

import type { Redis, KeyType } from 'ioredis'
import { Cache } from './types'

export class RedisCache<
  K extends KeyType = string,
  V = null | Record<string, any>
> implements Cache<K, V | null>
{
  client: Redis

  constructor(client: Redis) {
    this.client = client
  }

  async delete(key: K): Promise<boolean> {
    const result = await this.client.del(key)
    return result === 1
  }

  async get(key: K): Promise<V | null> {
    const result = await this.client.get(key)
    if (result) {
      return JSON.parse(result.toString())
    }
    return null
  }

  async set(key: K, value: V, timeout: number): Promise<RedisCache<K, V>> {
    if (timeout > 0) {
      await this.client.set(key, JSON.stringify(value), 'EX', timeout)
      return this
    }
    await this.client.set(key, JSON.stringify(value))
    return this
  }
}
