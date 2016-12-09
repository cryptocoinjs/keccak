#!/usr/bin/env bash
set -x

IMPL=reference
FILES=(
	"align.h"
	"brg_endian.h"
	"KeccakP-1600-reference.c"
	"KeccakP-1600-reference.h"
	"KeccakP-1600-SnP.h"
	"KeccakSponge.c"
	"KeccakSponge.h"
	"KeccakSponge.inc"
)

rm -rf ./src/libkeccak

make --directory=./util/KeccakCodePackage ${IMPL}/libkeccak.a.pack
tar -xf ./util/KeccakCodePackage/bin/${IMPL}_libkeccak.a.tar.gz

mkdir ./src/libkeccak
for FILE in "${FILES[@]}"
do
	mv ./${IMPL}/libkeccak.a/${FILE} ./src/libkeccak
done

rm -rf ./${IMPL}
