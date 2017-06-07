'use strict'
const Buffer = require('safe-buffer').Buffer
const test = require('tape')

const utf8text = 'УТФ-8 text'

module.exports = (name, createHash) => {
  test(`${name} Keccak#_transform`, (t) => {
    t.test('should use Keccak#update', (t) => {
      const hash = createHash('sha3-256')

      t.plan(3)
      hash.update = function () {
        t.same(arguments[0], utf8text)
        t.same(arguments[1], 'utf8')
      }
      hash._transform(utf8text, 'utf8', (err) => t.same(err, null))
      t.end()
    })

    t.test('should handle error in Keccak#update', (t) => {
      const hash = createHash('sha3-256')
      const err = new Error('42')

      t.plan(1)
      hash.update = () => { throw err }
      hash._transform(Buffer.alloc(0), 'buffer', (_err) => t.true(_err === err))
      t.end()
    })

    t.end()
  })

  test(`${name} Keccak#_flush`, (t) => {
    t.test('should use Keccak#digest', (t) => {
      const hash = createHash('sha3-256')
      const buffer = Buffer.alloc(0)

      t.plan(2)
      hash.push = (data) => t.true(data === buffer)
      hash.digest = () => buffer
      hash._flush((err) => t.same(err, null))
      t.end()
    })

    t.test('should handle errors in Keccak#digest', (t) => {
      const hash = createHash('sha3-256')
      const err = new Error('42')

      t.plan(1)
      hash.digest = () => { throw err }
      hash._flush((_err) => t.true(_err === err))
      t.end()
    })

    t.end()
  })

  test(`${name} Keccak#update`, (t) => {
    t.test('only string or buffer is allowed', (t) => {
      const hash = createHash('sha3-256')

      t.throws(() => {
        hash.update(null)
      }, /^TypeError: Data must be a string or a buffer$/)
      t.end()
    })

    t.test('should throw error after Keccak#digest', (t) => {
      const hash = createHash('sha3-256')

      hash.digest()
      t.throws(() => {
        hash.update('')
      }, /^Error: Digest already called$/)
      t.end()
    })

    t.test('should return `this`', (t) => {
      const hash = createHash('sha3-256')

      t.same(hash.update(Buffer.alloc(0)), hash)
      t.end()
    })

    t.end()
  })

  test(`${name} Keccak#digest`, (t) => {
    t.test('should throw error on second call', (t) => {
      const hash = createHash('sha3-256')

      hash.digest()
      t.throws(() => {
        hash.digest()
      }, /^Error: Digest already called$/)
      t.end()
    })

    t.test('should return buffer by default', (t) => {
      const hash = createHash('sha3-256')

      t.true(Buffer.isBuffer(hash.digest()))
      t.end()
    })

    t.test('should encode result with custom encoding', (t) => {
      const hash = createHash('sha3-256')

      const digest = hash.digest('hex')
      t.equal(typeof digest, 'string')
      t.equal(digest.length, 64)
      t.end()
    })

    t.end()
  })

  test(`${name} Keccak#_clone`, (t) => {
    test('should work', (t) => {
      const hash1 = createHash('sha3-256')
      const hash2 = hash1._clone()

      const digest1 = hash1.digest('hex')
      t.throws(() => {
        hash1.digest()
      }, /^Error: Digest already called$/)
      t.equal(hash2.digest('hex'), digest1)

      t.end()
    })

    t.end()
  })
}
