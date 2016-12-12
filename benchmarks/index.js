const benchmark = require('benchmark')
const cbindings = require('../bindings')
const cpurejs = require('../js')
const obindings = require('sha3')
const opurejs = require('js-sha3')

new benchmark.Suite('Buffer 0bytes')
  .add('Bindings (current)', () => cbindings('keccak256').digest('hex'))
  .add('Pure JS (current)', () => cpurejs('keccak256').digest('hex'))
  .add('Bindings (sha3)', () => obindings.SHA3Hash(256).digest('hex'))
  .add('Pure JS (js-sha3)', () => opurejs.keccak_256(''))
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`${this.name}: fastest is ${this.filter('fastest').map('name')}`)
  })
  .run()

const buffer10mib = require('crypto').randomBytes(10 * 1024 * 1024)
new benchmark.Suite('Buffer 10MiB')
  .add('Bindings (current)', () => cbindings('keccak256').update(buffer10mib).digest('hex'))
  .add('Pure JS (current)', () => cpurejs('keccak256').update(buffer10mib).digest('hex'))
  .add('Bindings (sha3)', () => obindings.SHA3Hash(256).update(buffer10mib).digest('hex'))
  .add('Pure JS (js-sha3)', () => opurejs.keccak_256(buffer10mib))
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`${this.name}: fastest is ${this.filter('fastest').map('name')}`)
  })
  .run()
