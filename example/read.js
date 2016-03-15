var gitstat = require('../')

var changes = gitstat('.', 'M')
changes.on('readable', function () {
  var chunk
  while ((chunk = changes.read()) !== null) {
    console.log('changed file %s', chunk)
  }
})

changes.on('end', function () {
  console.log('done')
})
