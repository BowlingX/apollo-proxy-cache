// @flow

import { Cache } from './types'
import { didTimeout } from '../utils-browser-only'

// Simple in memory implementation using `Map`

export class InMemoryCache implements Cache<string, Object> {
  cache: Map<string, Object> = new Map()

  delete(key: string): Promise<boolean> {
    return Promise.resolve(this.cache.delete(key))
  }

  get(key: string): Promise<?Object> {
    const possibleData = this.cache.get(key)

    if (!possibleData) {
      return Promise.resolve(null)
    }

    const { data, time, timeout } = possibleData
    if (didTimeout(timeout, time)) {
      this.cache.delete(key)
      return Promise.resolve(null)
    }
    return Promise.resolve(data)
  }

  set(key: string, value: Object, timeout: number): Promise<Cache<string, Object>> {
    this.cache.set(key, { data: value, time: Number(new Date()), timeout })
    return Promise.resolve(this)
  }
}
