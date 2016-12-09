'use strict'
var test = require('tape')

function main (name, createHash) {
  require('./vectors-keccak')(name, createHash)
  require('./vectors-sha3')(name, createHash)
  require('./vectors-shake')(name, createHash)

  require('./api-sha3')(name, createHash)
  require('./api-shake')(name, createHash)

  test(`${name} invalid algorithm`, (t) => {
    t.throws(() => {
      createHash(null)
    }, /^Error: Invald algorithm: null$/)
    t.end()
  })
}

main('bindings', require('../bindings'))
// test('pure js', require('../js'))
