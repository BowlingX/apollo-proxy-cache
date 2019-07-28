// @flow

import { Cache } from './types'

export class RedisCache implements Cache<string, Object> {
  client: Object

  constructor(client: Object) {
    this.client = client
  }

  delete(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err, response) => {
        if (err) {
          return reject(err)
        }
        resolve(response === 1)
      })
    })
  }

  get(key: string): Promise<?Object> {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          return reject(err)
        }
        if (value) {
          resolve(JSON.parse(value.toString()))
        }
        return resolve(null)
      })
    })
  }

  set(key: string, value: Object, timeout: number): Promise<Cache<string, Object>> {
    return new Promise((resolve, reject) => {
      this.client.set(key, JSON.stringify(value), 'EX', timeout, err => {
        if (err) {
          return reject(err)
        }
        resolve(this)
      })
    })
  }
}
