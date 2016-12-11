const benchmark = require('benchmark')
const cbindings = require('../bindings')
const cpurejs = require('../js')
const obindings = require('sha3')
const opurejs = require('js-sha3')

new benchmark.Suite()
  .add('Bindings (current)', () => cbindings('keccak256').digest('hex'))
  .add('Pure JS (current)', () => cpurejs('keccak256').digest('hex'))
  .add('Bindings (sha3)', () => obindings.SHA3Hash(256).digest('hex'))
  .add('Pure JS (js-sha3)', () => opurejs.keccak_256(''))
  .on('cycle', (event) => {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run()
