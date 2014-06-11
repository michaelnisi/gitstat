
var test = require('tap').test
  , fs = require('fs')
  , child_process = require('child_process')
  , gitstat = require('../')
  , es = require('event-stream')
  , rimraf = require('rimraf').sync
  ;

var dir = '/tmp/gitstat-' + Math.floor(Math.random() * (1<<24))

function opts () {
  return { cwd:dir, env:process.env }
}

function exec (cmd, cb) {
  child_process.exec(cmd, opts(), function (er, stdout, stderr) {
    cb(er)
  })
}

test('setup', function (t) {
  fs.mkdirSync(dir, 0700)
  t.plan(2)
  t.ok(fs.statSync(dir).isDirectory())
  exec('git init ; touch a b c', function (er) {
    t.ok(!er)
    t.end()
  })
})

function stat (mode, wanted, t) {
  gitstat(dir, mode)
    .pipe(es.writeArray(function (er, found) {
      t.ok(!er)
      t.deepEqual(found, wanted)
      t.end()
    }))
}

test('added (no mode)', function (t) {
  exec('git add .', function (er) {
    t.ok(!er)
    stat(null, ['A  a', 'A  b', 'A  c'], t)
  })
})

test('added (A)', function (t) {
  stat('A', ['a', 'b', 'c'], t)
})

test('modified (M)', function (t) {
  exec('echo hello > b', function (er) {
    stat('M', ['b'], t)
  })
})

test('no changes', function (t) {
  exec('git commit -a -m "Add files"', function (er) {
    stat(null, [], t)
  })
})

test('delete', function (t) {
  exec('rm c ; git add --all', function (er) {
    stat('D', ['c'], t)
  })
})

test('rename', function (t) {
  exec('mv a d ; git add --all', function (er) {
    stat('R', ['d'], t)
  })
})

test('teardown', function (t) {
  t.end()
  t.plan(1)
  rimraf(dir)
  fs.stat(dir, function (er) {
    t.ok(!!er, 'should clean up after ourselves')
    t.end()
  })
})
