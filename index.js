
// gitstat - stream git status

module.exports = GitStat

if (!!process.env.NODE_TEST) {
  module.exports.parse = parse
}

var util = require('util')
  , stream = require('stream')

function opts () {
  return { encoding:'utf8', highWaterMark:0 }
}

function GitStat (repo, mode) {
  if (!(this instanceof GitStat)) return new GitStat(repo, mode)
  stream.Readable.call(this, opts())
  this.repo = repo
  this.mode = mode
}
util.inherits(GitStat, stream.Readable)

var StringDecoder = require('string_decoder').StringDecoder

function ex (mode) {
  return new RegExp(mode.split('').join('|'), 'g')
}

function parse (buf, mode) {
  var lines = new StringDecoder()
    .write(buf)
    .split('\0')
    .filter(function (line) {
      return !!line
    })

  var chunks = []
  if (!!mode) {
    var strs, status, filename
    lines.forEach(function (line) {
      strs = line.split(' ').filter(function (str) {
        return !!str
      })
      status = strs[0]
      filename = strs[1]
      if (ex(mode).test(status)) {
        chunks.push(filename)
      }
    })
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
    var cmd = 'git status -uno -z'
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
