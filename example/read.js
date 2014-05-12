
var gitstat = require('../'), changes

changes = gitstat('.', 'M')
changes.on('readable', function () {
  var chunk
  while (null !== (chunk = changes.read())) {
    console.log('changed file %s', chunk)
  }
})
