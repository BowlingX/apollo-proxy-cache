import zlib from 'zlib'
import type EventEmitter from 'events'
import type { IncomingMessage } from 'http'
import { decompressStream } from 'iltorb'

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

const supportsBrotli = typeof zlib.createBrotliDecompress === 'function'

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
    if (supportsBrotli) {
      // $FlowFixMe: ignore, supported from node v11
      decoder = zlib.createBrotliDecompress()
    } else {
      decoder = decompressStream()
    }
  }

  if (decoder) {
    return await stream(request.pipe(decoder))
  }
  return await stream(request)
}
