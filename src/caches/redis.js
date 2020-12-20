// @flow

import { Cache } from './types'

export class RedisCache implements Cache<string, Object> {
  client: Object

  constructor(client: Object) {
    this.client = client
  }

  async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key)
    return result === 1
  }

  async get(key: string): Promise<?Object> {
    const result = await this.client.get(key)
    if (result) {
      return JSON.parse(result.toString())
    }
    return null
  }

  set(key: string, value: Object, timeout: number): Promise<Cache<string, Object>> {
    if (timeout > 0) {
      return this.client.set(key, JSON.stringify(value), 'EX', timeout)
    }
    return this.client.set(key, JSON.stringify(value))
  }
}
