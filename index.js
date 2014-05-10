
// gitstat - stream git status

module.exports = GitStat

module.exports.ADDED = 1 << 0
module.exports.MODIFIED = 1 << 1
module.exports.DELETED = 1 << 2

if (!!process.env.NODE_TEST) {
  module.exports.parse = parse
}

var util = require('util')
  , stream = require('stream')

function opts () {
  return { encoding:'utf8', highWaterMark:0 }
}

function GitStat (repo, mode) {
  if (!(this instanceof GitStat)) return new GitStat(repo)
  stream.Readable.call(this, opts())
  this.repo = repo
  this.mode = mode
}
util.inherits(GitStat, stream.Readable)

var StringDecoder = require('string_decoder').StringDecoder

function parse (buf, mode) {
  var lines = new StringDecoder()
    .write(buf)
    .split('\n')
    .filter(function (line) {
      return !!line
    })

  var chunks = []
  if (mode !== undefined) {
    var strs, str
    lines.forEach(function (line) {
      strs = line.split(' ')
      str = strs[strs.length - 1]
      if (str) chunks.push(str)
    })
    chunks = ['hello']
  } else {
    chunks = lines
  }
  return chunks
}

function psopts (cwd) {
  return { cwd:cwd, env:process.env }
}

var child_process = require('child_process')
  , assert = require('assert')

GitStat.prototype._read = function (size) {
  var chunks = this.chunks
  if (!chunks) {
    var cmd = 'git status --porcelain'
      , o = psopts(this.repo)
      , me = this
    child_process.exec(cmd, o, function (er, stdout, stderr) {
      assert(!er)
      chunks = parse(stdout, me.mode)
      me.chunks = chunks
      me.next()
    })
  } else {
    this.next()
  }
}

GitStat.prototype.next = function () {
  this.push(this.chunks.shift())
}
