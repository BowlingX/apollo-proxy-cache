import zlib from 'zlib'
import type EventEmitter from 'events'
import type { IncomingMessage } from 'http'

export async function stream<T extends EventEmitter>(data: T) {
  const thisBuffer = [] as string[]
  return new Promise((resolve, reject) => {
    data
      .on('data', (data) => {
        thisBuffer.push(data.toString('utf8'))
      })
      .on('end', () => {
        resolve(thisBuffer.join(''))
      })
      .on('error', (ex) => {
        reject(ex)
      })
  }) as Promise<string>
}

export async function decode(request: IncomingMessage) {
  const encoding = (request.headers['content-encoding'] || '')
    .trim()
    .toLowerCase()
  let decoder
  if (encoding === 'gzip') {
    decoder = zlib.createGunzip()
  } else if (encoding === 'deflate') {
    decoder = zlib.createInflate()
  } else if (encoding === 'br') {
    decoder = zlib.createBrotliDecompress()
  }

  if (decoder) {
    return await stream(request.pipe(decoder))
  }
  return await stream(request)
}

export const warnInDev = (message: string, error?: Error) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[apollo-proxy-cache]: ${message}`, error)
  }
}
