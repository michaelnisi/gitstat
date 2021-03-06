# gitstat - stream git status

The `gitstat` [Node](http://nodejs.org/) module streams paths of changed files tracked by a local [Git](http://git-scm.com/) repository.

[![Build Status](https://travis-ci.org/michaelnisi/gitstat.svg)](http://travis-ci.org/michaelnisi/gitstat)

## Usage

Read orginal output of the underlying `git status -uno -z` file by file:

```js
var gitstat = require('gitstat'), status

status = gitstat('.')
status.on('readable', function () {
  var chunk
  while ((chunk = status.read()) !== null) {
    console.log('%s', chunk)
  }
})
```

Pipe filenames of added and/or modified files:

```js
var gitstat = require('gitstat')

gitstat('.', 'AM')
  .pipe(process.stdout)
```

## Types

### repo()

A path to a local git repository.

### mode()

Optionally configure which filenames should be emitted by passing Git statuses (`"M|A|D|R|C|U"`) as String of undefined length. For example:

```js
gitstat('.', 'AM')
```
This would return a readable stream that emits filenames of all added and/or modified files.

With the default mode (`undefined`), not filenames, but the original output of `git status -uno -z` is emitted file by file. For details please refer to [`man git-status`](http://git-scm.com/docs/git-status).

## Exports

### gitstat(repo(), [mode()])

This function returns a [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable) stream. On the first read this stream executes `git status -uno -z` and begins emitting paths according to mode. Untracked files are ignored.

## Installation

[![NPM](https://nodei.co/npm/gitstat.svg)](https://npmjs.org/package/gitstat)

## License

[MIT License](https://raw.github.com/michaelnisi/gitstat/master/LICENSE)
