# gitstat - stream git status

The gitstat [Node.js](http://nodejs.org/) module provides a stream of file statuses of a local git repository.

[![Build Status](https://secure.travis-ci.org/michaelnisi/gitstat.png)](http://travis-ci.org/michaelnisi/gitstat)

## Usage

```js    
var gitstat = require('gitstat'), changes

changes = gitstat('.')
changes.on('readable', function () {
  var chunk
  while (null !== (chunk = changes.read())) {
    console.log('%s', chunk)
  }
})
```

## API

### gitstat(repo, mode)

- repo the path to the repository
- mode the mode is M|A|D|R|C|U|?|! (default `undefined`)

## Installation

[![NPM](https://nodei.co/npm/gitstat.png)](https://npmjs.org/package/gitstat)

## License

[MIT License](https://raw.github.com/michaelnisi/gitstat/master/LICENSE)
