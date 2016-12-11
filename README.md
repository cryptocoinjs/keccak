# keccak

[![NPM Package](https://img.shields.io/npm/v/keccak.svg?style=flat-square)](https://www.npmjs.org/package/keccak)
[![Build Status](https://img.shields.io/travis/cryptocoinjs/keccak.svg?branch=master&style=flat-square)](https://travis-ci.org/cryptocoinjs/keccak)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

This module provides native bindings to [Keccak sponge function family][1] from [Keccak Code Package][2]. In browser pure JavaScript implementation will be used.

## Usage

You can use this package as [node Hash][3].

```js
const createKeccakHash = require('keccak')

console.log(createKeccakHash('keccak256').digest().toString('hex'))
// => c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470

console.log(createKeccakHash('keccak256').update('Hello world!').digest('hex'))
// => ecd0e108a98e192af1d2c25055f4e3bed784b5c877204e73219a5203251feaab
```

Also object has two useful methods: `_resetState` and `_clone`

```js
const createKeccakHash = require('keccak')

console.log(createKeccakHash('keccak256').update('Hello World!')._resetState().digest('hex'))
// => c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470

const hash1 = createKeccakHash('keccak256').update('Hello')
const hash2 = hash1._clone()
console.log(hash1.digest('hex'))
// => 06b3dfaec148fb1bb2b066f10ec285e7c9bf402ab32aa78a5d38e34566810cd2
console.log(hash1.update(' world!').digest('hex'))
// => throw Error: Digest already called
console.log(hash2.update(' world!').digest('hex'))
// => ecd0e108a98e192af1d2c25055f4e3bed784b5c877204e73219a5203251feaab
```

## LICENSE

This library is free and open-source software released under the MIT license.

[1]: http://keccak.noekeon.org/
[2]: https://github.com/gvanas/KeccakCodePackage
[3]: https://nodejs.org/api/crypto.html#crypto_class_hash
