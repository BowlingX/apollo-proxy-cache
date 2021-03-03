// @flow

import { didTimeout } from '../utils-browser-only'
import { Cache } from './types'

// Simple in memory implementation using `Map`

interface CachedData<T> {
  data: T
  time: number
  timeout: number
}

export class InMemoryCache<K extends string = string, V = Record<string, any>>
  implements Cache<K, V | null> {
  cache: Map<string, CachedData<V>> = new Map()

  delete(key: string): Promise<boolean> {
    return Promise.resolve(this.cache.delete(key))
  }

  get(key: string): Promise<V | null> {
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

  set(key: K, value: V, timeout: number): Promise<InMemoryCache<K, V>> {
    this.cache.set(key, { data: value, time: Number(new Date()), timeout })
    return Promise.resolve(this)
  }
}
