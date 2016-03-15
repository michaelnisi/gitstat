var gitstat = require('../')

gitstat('.', 'M').pipe(process.stdout)
