'use strict'
const test = require('tape')
const fs = require('fs')

module.exports = (name, createHash) => {
  for (const hash of ['shake128', 'shake256']) {
    const filename = require.resolve(`../util/KeccakCodePackage/TestVectors/ShortMsgKAT_${hash.toUpperCase()}.txt`)
    const content = fs.readFileSync(filename, 'utf8')
    const lines = content.split('\n')

    let count = 0
    for (let i = 0; i < lines.length; ++i) {
      if (!lines[i].startsWith('Len')) continue

      const length = parseInt(lines[i].slice(6), 10)
      if (length % 8 !== 0) continue

      const data = lines[++i].slice(6, length * 2)
      const squeezed = lines[++i].slice(11).toLowerCase()

      test(`${name} ${hash} vector#${count++}`, (t) => {
        t.equal(createHash(hash).update(data, 'hex').squeeze(squeezed.length / 2, 'hex'), squeezed)
        t.end()
      })
    }
  }
}
