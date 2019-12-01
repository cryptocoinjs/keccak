'use strict'
var P1600_RHO_OFFSETS = [0, 1, 62, 28, 27, 36, 44, 6, 55, 20, 3, 10, 43, 25, 39, 41, 45, 15, 21, 8, 18, 2, 61, 56, 14]
var P1600_ROUND_CONSTANTS = [
  0x00000001, 0x00000000,
  0x00008082, 0x00000000,
  0x0000808a, 0x80000000,
  0x80008000, 0x80000000,
  0x0000808b, 0x00000000,
  0x80000001, 0x00000000,
  0x80008081, 0x80000000,
  0x00008009, 0x80000000,
  0x0000008a, 0x00000000,
  0x00000088, 0x00000000,
  0x80008009, 0x00000000,
  0x8000000a, 0x00000000,
  0x8000808b, 0x00000000,
  0x0000008b, 0x80000000,
  0x00008089, 0x80000000,
  0x00008003, 0x80000000,
  0x00008002, 0x80000000,
  0x00000080, 0x80000000,
  0x0000800a, 0x00000000,
  0x8000000a, 0x80000000,
  0x80008081, 0x80000000,
  0x00008080, 0x80000000,
  0x80000001, 0x00000000,
  0x80008008, 0x80000000
]

// shortcuts
function index (x, y) { return x + 5 * y }
function ilo (x, y) { return index(x, y) * 2 }
function ihi (x, y) { return index(x, y) * 2 + 1 }

function genROL64LO (lo, hi, shift) {
  if (shift >= 32) {
    [lo, hi] = [hi, lo]
    shift -= 32
  }

  return shift === 0 ? lo : `(${lo} << ${shift} | ${hi} >>> ${32 - shift})`
}

function genROL64HI (lo, hi, shift) {
  if (shift >= 32) {
    [lo, hi] = [hi, lo]
    shift -= 32
  }

  return shift === 0 ? hi : `(${hi} << ${shift} | ${lo} >>> ${32 - shift})`
}

// produce output
process.stdout.write(`'use strict'
var P1600_ROUND_CONSTANTS = [${P1600_ROUND_CONSTANTS.join(', ')}]

exports.p1600 = function (s) {
  for (var round = 0; round < 24; ++round) {
    // theta`)

for (let x = 0; x < 5; ++x) {
  process.stdout.write(`
    var lo${x} = s[${ilo(x, 0)}]`)
  for (let y = 1; y < 5; ++y) process.stdout.write(` ^ s[${ilo(x, y)}]`)
  process.stdout.write(`
    var hi${x} = s[${ihi(x, 0)}]`)
  for (let y = 1; y < 5; ++y) process.stdout.write(` ^ s[${ihi(x, y)}]`)
}
process.stdout.write(`
`)

for (let x = 0; x < 5; ++x) {
  const next = (x + 1) % 5
  const prev = (x + 4) % 5

  process.stdout.write(`
    ${x === 0 ? 'var ' : ''}lo = lo${prev} ^ ${genROL64LO(`lo${next}`, `hi${next}`, 1)}`)
  process.stdout.write(`
    ${x === 0 ? 'var ' : ''}hi = hi${prev} ^ ${genROL64HI(`lo${next}`, `hi${next}`, 1)}`)

  for (let y = 0; y < 5; ++y) {
    process.stdout.write(`
    var t1slo${index(x, y)} = s[${ilo(x, y)}] ^ lo
    var t1shi${index(x, y)} = s[${ihi(x, y)}] ^ hi`)
  }
}

process.stdout.write(`

    // rho & pi`)

for (let x = 0; x < 5; ++x) {
  for (let y = 0; y < 5; ++y) {
    process.stdout.write(`
    var t2slo${index((0 * x + 1 * y) % 5, (2 * x + 3 * y) % 5)} = ${genROL64LO(`t1slo${index(x, y)}`, `t1shi${index(x, y)}`, P1600_RHO_OFFSETS[index(x, y)])}
    var t2shi${index((0 * x + 1 * y) % 5, (2 * x + 3 * y) % 5)} = ${genROL64HI(`t1slo${index(x, y)}`, `t1shi${index(x, y)}`, P1600_RHO_OFFSETS[index(x, y)])}`)
  }
}

process.stdout.write(`

    // chi`)

for (let x = 0; x < 5; ++x) {
  for (let y = 0; y < 5; ++y) {
    process.stdout.write(`
    s[${ilo(x, y)}] = t2slo${index(x, y)} ^ (~t2slo${index((x + 1) % 5, y)} & t2slo${index((x + 2) % 5, y)})
    s[${ihi(x, y)}] = t2shi${index(x, y)} ^ (~t2shi${index((x + 1) % 5, y)} & t2shi${index((x + 2) % 5, y)})`)
  }
}

process.stdout.write(`

    // iota
    s[0] ^= P1600_ROUND_CONSTANTS[round * 2]
    s[1] ^= P1600_ROUND_CONSTANTS[round * 2 + 1]
  }
}
`)
