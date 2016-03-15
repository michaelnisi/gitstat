// gitstat - stream git status

module.exports = GitStat

var child_process = require('child_process')
var stream = require('readable-stream')
var string_decoder = require('string_decoder')
var util = require('util')

function GitStat (repo, mode) {
  if (!(this instanceof GitStat)) return new GitStat(repo, mode)

  var opts = { encoding: 'utf8', highWaterMark: 0 }
  stream.Readable.call(this, opts)

  this.repo = repo
  this.mode = mode
  this.decoder = new string_decoder.StringDecoder()
}
util.inherits(GitStat, stream.Readable)

function ex (mode) {
  return new RegExp(mode.split('').join('|'), 'g')
}

function parse (decoder, buf, mode) {
  var lines = decoder.write(buf).split('\0').filter(function (line) {
    return !!line
  })

  var chunks = []
  if (mode) {
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
  return { cwd: cwd, env: process.env }
}

GitStat.prototype._read = function (size) {
  var chunks = this.chunks
  if (!chunks) {
    var cmd = 'git status -uno -z'
    var o = psopts(this.repo)
    var me = this

    child_process.exec(cmd, o, function (er, stdout, stderr) {
      if (er instanceof Error) {
        me.emit('error', er)
        return me.push(null)
      }
      chunks = parse(me.decoder, stdout, me.mode)
      me.chunks = chunks
      me.next()
    })
  } else {
    this.next()
  }
}

GitStat.prototype.next = function () {
  var chunk = this.chunks.shift()
  if (chunk === undefined) chunk = null
  this.push(chunk)
}

if (parseInt(process.env.NODE_TEST, 10) === 1) {
  module.exports.parse = parse
}
