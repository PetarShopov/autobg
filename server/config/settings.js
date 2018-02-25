const path = require('path')

let rootPath = path.normalize(path.join(__dirname, '/../../'))

module.exports = {
  development: {
    rootPath: rootPath,
    db: 'mongodb://localhost:27017/autobg',
    port: 5000
  },
  staging: {
  },
  production: {
    db: '',
    port: process.env.PORT
  }
}
