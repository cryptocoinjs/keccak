'use strict'
const test = require('tape')

const vectors = [{
  input: '',
  keccak224: 'f71837502ba8e10837bdd8d365adb85591895602fc552b48b7390abd',
  keccak256: 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',
  keccak384: '2c23146a63a29acf99e73b88f8c24eaa7dc60aa771780ccc006afbfa8fe2479b2dd2b21362337441ac12b515911957ff',
  keccak512: '0eab42de4c3ceb9235fc91acffe746b29c29a8c366b7c60e4e67c466f36a4304c00fa9caf9d87976ba469bcbe06713b435f091ef2769fb160cdab33d3670680e'
}]

module.exports = (name, createHash) => {
  for (let i = 0; i < vectors.length; ++i) {
    const vector = vectors[i]
    const data = Buffer.from(vector.input, 'hex')

    for (let hash of ['keccak224', 'keccak256', 'keccak384', 'keccak512']) {
      test(`${name} ${hash} vector#${i}`, (t) => {
        t.equal(createHash(hash).update(data).digest('hex'), vector[hash])
        t.end()
      })
    }
  }
}
