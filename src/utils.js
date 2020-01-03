// @flow

import { decompressStream } from 'iltorb'
import zlib from 'zlib'

export async function stream(data: Object) {
  const thisBuffer = []
  return new Promise((resolve, reject) => {
    data.on('data', data => {
      thisBuffer.push(data.toString('utf8'))
    }).on('end', () => {
      resolve(thisBuffer.join(''))
    }).on('error', ex => {
      reject(ex)
    })
  })
}

// $FlowFixMe: ignore, supported from node v11
const supportsBrotli = typeof zlib.createBrotliDecompress === 'function'

export async function decode(response: Object) {
  const encoding = (response.headers['content-encoding'] || '').trim().toLowerCase()
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
    return await stream(response.pipe(decoder))
  }
  return await stream(response)
}
