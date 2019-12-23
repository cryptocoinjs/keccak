const test = require('tape')
const proxyquire = require('proxyquire')

const Keccak = proxyquire('../lib/keccak', {
  './keccak-state-unroll': {
    p1600 () {}
  }
})
const keccakState = require('../lib/keccak-state-reference')

function to32bin (x) {
  let str = (x >>> 0).toString(2)
  if (str.length < 32) str = new Array(32 - str.length).fill(0).join('') + str
  return `0b${str}`
}

test('absorb', (t) => {
  const keccak = new Keccak()
  keccak.initialize(56, 1544)
  keccak.absorb(Buffer.alloc(10, 0x01))

  t.equal(keccak.state[0], (0x01 << 24))
  t.equal(keccak.state[1], (0x01 << 16) | (0x01 << 8) | (0x01 << 0))
  t.equal(keccak.state[2], 0)
  t.equal(keccak.blockSize, 7)
  t.equal(keccak.count, 3)
  t.equal(keccak.squeezing, false)

  t.end()
})

test('absorbLastFewBits', (t) => {
  const keccak = new Keccak()
  keccak.initialize(40, 1560)
  keccak.absorbLastFewBits(0x01)

  t.equal(keccak.state[0], 0x01)
  t.equal(keccak.state[1], 0x80)
  t.equal(keccak.state[2], 0)
  t.equal(keccak.blockSize, 5)
  t.equal(keccak.count, 0)
  t.equal(keccak.squeezing, true)

  t.end()
})

test('squeeze', (t) => {
  const keccak = new Keccak()
  keccak.initialize(56, 1544)
  keccak.absorb(Buffer.alloc(5, 0x01))

  t.equal(keccak.squeeze(7).toString('hex'), '01010101010180')
  t.equal(keccak.squeeze(3).toString('hex'), '010101')
  t.equal(keccak.squeeze(4).toString('hex'), '01010180')

  t.equal(keccak.state[0], (0x01 << 24) | (0x01 << 16) | (0x01 << 8) | (0x01 << 0))
  t.equal(keccak.state[1], (0x80 << 16) | (0x01 << 8) | (0x01 << 0))
  t.equal(keccak.state[2], 0)
  t.equal(keccak.blockSize, 7)
  t.equal(keccak.count, 0)
  t.equal(keccak.squeezing, true)

  t.end()
})

test('rol64lo', (t) => {
  const fixtures = [
    [0b00000000000000000000000000000000, 0b11111111111111111111111111111111, 0, '0b00000000000000000000000000000000'],
    [0b11111111111111111111111111111111, 0b00000000000000000000000000000000, 32, '0b00000000000000000000000000000000'],
    [0b00000000000000000000000000000000, 0b11111111111111111111111111111111, 32, '0b11111111111111111111111111111111'],
    [0b11111111111111111111111111111110, 0b10000000000000000000000000000000, 1, '0b11111111111111111111111111111101'],
    [0b00000000000000000000000000000000, 0b00000000000000001000000000000000, 17, '0b00000000000000000000000000000001'],
    [0b11111111111111111111111111111110, 0b10000000000000000000000000000000, 33, '0b00000000000000000000000000000001'],
    [0b10000000000000000000000000000000, 0b00000000000000000000000000000000, 63, '0b01000000000000000000000000000000']
  ]

  for (const fixture of fixtures) {
    t.equal(to32bin(keccakState._rol64lo(fixture[0], fixture[1], fixture[2])), fixture[3])
  }

  t.end()
})

test('rol64hi', (t) => {
  const fixtures = [
    [0b11111111111111111111111111111111, 0b00000000000000000000000000000000, 0, '0b00000000000000000000000000000000'],
    [0b11111111111111111111111111111111, 0b00000000000000000000000000000000, 32, '0b11111111111111111111111111111111'],
    [0b00000000000000000000000000000000, 0b11111111111111111111111111111111, 32, '0b00000000000000000000000000000000'],
    [0b10000000000000000000000000000000, 0b11111111111111111111111111111110, 1, '0b11111111111111111111111111111101'],
    [0b00000000000000001000000000000000, 0b00000000000000000000000000000000, 17, '0b00000000000000000000000000000001'],
    [0b10000000000000000000000000000000, 0b11111111111111111111111111111110, 33, '0b00000000000000000000000000000001'],
    [0b00000000000000000000000000000000, 0b10000000000000000000000000000000, 63, '0b01000000000000000000000000000000']
  ]

  for (const fixture of fixtures) {
    t.equal(to32bin(keccakState._rol64hi(fixture[0], fixture[1], fixture[2])), fixture[3])
  }

  t.end()
})
