import type { RedisClientType } from 'redis'
import { Cache } from './types.js'

export class RedisCache<V = null | Record<string, any>>
  implements Cache<string, V | null>
{
  client: RedisClientType

  constructor(client: RedisClientType) {
    this.client = client
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key)
    return result === 1
  }

  async get(key: string): Promise<V | null> {
    const result = await this.client.get(key)
    if (result) {
      return JSON.parse(result.toString())
    }
    return null
  }

  async set(key: string, value: V, timeout: number) {
    if (timeout > 0) {
      await this.client.set(key, JSON.stringify(value), {
        EX: timeout,
      })
      return this
    }
    await this.client.set(key, JSON.stringify(value))
    return this
  }
}
