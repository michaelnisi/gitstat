
var test = require('tap').test
  , gitstat = require('../')

function p (mode, input, wanted, t) {
  t.deepEqual(gitstat.parse(input, mode), wanted)
  t.end()
}

test('raw', function (t) {
  p(null
  , 'A  a\0A  b\0A  c'
  , ['A  a', 'A  b', 'A  c']
  , t)
})

test('added', function (t) {
  p('A'
  , 'A  a\0A  b\0AM c'
  , ['a', 'b', 'c']
  , t)
})

test('modified', function (t) {
  p('M'
  , 'A  a\0A  b\0AM c'
  , ['c']
  , t)
})

test('added and/or modfied', function (t) {
  p('AM'
  , 'A  a\0A  b\0AM c'
  , ['a', 'b', 'c']
  , t)
})

test('deleted', function (t) {
  p('D'
  , 'D  a\0A  b\0AM c'
  , ['a']
  , t)
})

// Issues

test('mutliple modifieds', function (t) {
  p('M'
  , ' M about.html\0 M archive.html\0 M index.html'
  , ['about.html', 'archive.html', 'index.html']
  , t)
})
