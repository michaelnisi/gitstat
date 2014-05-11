# gitstat - stream git status

The gitstat [Node.js](http://nodejs.org/) module provides a stream of [Git](http://git-scm.com/) file status information.

[![Build Status](https://secure.travis-ci.org/michaelnisi/gitstat.png)](http://travis-ci.org/michaelnisi/gitstat)

## Usage

```js    
var gitstat = require('gitstat'), changes

changes = gitstat('.')
// changes = gitstat('.', 'AM')
changes.on('readable', function () {
  var chunk
  while (null !== (chunk = changes.read())) {
    console.log('%s', chunk)
  }
})
```

## API

### gitstat(repo, [mode])

- `repo` the path to the repository
- `mode` mode() 

A [Readable](http://nodejs.org/api/stream.html#stream_class_stream_readable) stream [Git](http://git-scm.com/) file status information.

#### mode()

An optional [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) to configure which filenames should be emitted (`"M|A|D|R|C|U|?|!"`). For example:

```js
gitstat('.', 'AM')
```
… would return a Stream that emits filenames of all added and/or modified files. 

With the default mode (`undefined`), not filenames, but the original output of `git status -uno -z` is emitted line by line. For details please refer to [`man git-status`](http://git-scm.com/docs/git-status).

## Installation

[![NPM](https://nodei.co/npm/gitstat.png)](https://npmjs.org/package/gitstat)

## License

[MIT License](https://raw.github.com/michaelnisi/gitstat/master/LICENSE)
