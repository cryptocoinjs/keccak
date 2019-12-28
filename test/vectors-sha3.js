const test = require('tape')
const fs = require('fs')

module.exports = (name, createHash) => {
  for (const hash of ['sha3-224', 'sha3-256', 'sha3-384', 'sha3-512']) {
    const filename = require.resolve(`../util/XKCP/tests/TestVectors/ShortMsgKAT_${hash.toUpperCase()}.txt`)
    const content = fs.readFileSync(filename, 'utf8')
    const lines = content.split('\n').map((x) => x.trim())

    for (let i = 0, count = 0; i < lines.length; ++i) {
      if (!lines[i].startsWith('Len')) continue

      const length = parseInt(lines[i].slice(6), 10)
      if (length % 8 !== 0) continue

      const data = lines[++i].slice(6, length * 2)
      const digest = lines[++i].slice(5).toLowerCase()

      test(`${name} ${hash} vector#${count++}`, (t) => {
        t.equal(createHash(hash).update(data, 'hex').digest('hex'), digest)
        t.end()
      })
    }
  }
}
