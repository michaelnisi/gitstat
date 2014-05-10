
var test = require('tap').test
  , gitstat = require('../')

function p (mode, input, wanted, t) {
  t.deepEqual(gitstat.parse(input, mode), wanted)
  t.end()
}

test('raw', function (t) {
  p(null
  , ' M example/example.js\n M index.js\n?? test/\n'
  , [' M example/example.js', ' M index.js', '?? test/']
  , t)
})

test('added', function (t) {
  p(gitstat.ADDED | gitstat.MODIFIED
  , 'M  example/example.js\nAM test/parse_tests.js'
  , ['example/example.js', 'test/parse_tests.js']
  , t)
})
