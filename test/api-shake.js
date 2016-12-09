'use strict'
const test = require('tape')
const stream = require('stream')

const utf8text = 'УТФ-8 text'

module.exports = (name, createHash) => {
  test(`${name} Shake#_transform`, (t) => {
    t.test('should use Shake#update', (t) => {
      const hash = createHash('shake256')

      t.plan(3)
      hash.update = function () {
        t.same(arguments[0], utf8text)
        t.same(arguments[1], 'utf8')
      }
      hash._transform(utf8text, 'utf8', (err) => t.same(err, null))
      t.end()
    })

    t.test('should handle error in Shake#update', (t) => {
      const hash = createHash('shake256')
      const err = new Error('42')

      t.plan(1)
      hash.update = () => { throw err }
      hash._transform(Buffer.allocUnsafe(0), 'buffer', (_err) => t.true(_err === err))
      t.end()
    })

    t.end()
  })

  test(`${name} Shake#_read`, (t) => {
    t.test('should work', (t) => {
      const hash = createHash('shake256')
      hash._readableState.highWaterMark = 8

      const src = stream.Readable({
        read (size) {
          this.push(null)
        }
      })

      let data = Buffer.allocUnsafe(0)
      const squeezed = '46b9dd2b0ba88d13233b3feb743eeb243fcd52ea62b81b82b50c27646ed5762f'
      const dst = stream.Writable({
        write (chunk, encoding, callback) {
          data = Buffer.concat([data, chunk])
          if (data.length < 32) return callback(null)
          hash.unpipe(dst)
          t.equal(data.slice(0, 32).toString('hex'), squeezed)
          t.end()
        }
      })

      src.once('end', () => hash.pipe(dst))
      src.pipe(hash)
    })

    t.end()
  })

  test(`${name} Shake#update`, (t) => {
    t.test('only string or buffer is allowed', (t) => {
      const hash = createHash('shake256')

      t.throws(() => {
        hash.update(null)
      }, /^TypeError: Data must be a string or a buffer$/)
      t.end()
    })

    t.test('should throw error after Shake#squeeze', (t) => {
      const hash = createHash('shake256')

      hash.squeeze(32)
      t.throws(() => {
        hash.update('')
      }, /^Error: Squeeze already called$/)
      t.end()
    })

    t.test('should return `this`', (t) => {
      const hash = createHash('shake256')

      t.same(hash.update(Buffer.allocUnsafe(0)), hash)
      t.end()
    })

    t.end()
  })

  test(`${name} Shake#squeeze`, (t) => {
    t.test('should not throw error on second call', (t) => {
      const hash = createHash('shake256')

      hash.squeeze(16)
      t.doesNotThrow(() => {
        hash.squeeze(16)
      })
      t.end()
    })

    t.test('should return buffer by default', (t) => {
      const hash = createHash('shake256')

      t.true(Buffer.isBuffer(hash.squeeze(32)))
      t.end()
    })

    t.test('should encode result with custom encoding', (t) => {
      const hash = createHash('shake256')

      const squeeze = hash.squeeze(32, 'hex')
      t.equal(typeof squeeze, 'string')
      t.equal(squeeze.length, 64)
      t.end()
    })

    t.end()
  })

  test(`${name} Shake#_clone`, (t) => {
    t.test('should work', (t) => {
      const hash1 = createHash('shake256')
      const hash2 = hash1._clone()

      const squeezed1 = hash1.squeeze(32, 'hex')
      t.throws(() => {
        hash1.update(Buffer.allocUnsafe(0))
      }, /^Error: Squeeze already called$/)
      t.equal(hash2.squeeze(32, 'hex'), squeezed1)

      t.end()
    })

    t.end()
  })
}
