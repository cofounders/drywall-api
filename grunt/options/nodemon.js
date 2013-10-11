module.exports = {
  development: {
    options: {
      file: 'server.js',
      env: {
        PORT: '9002'
      }
    }
  },
  staging: {
    options: {
      file: 'server.js',
      env: {
        PORT: '9001'
      }
    }
  },
  production: {
    options: {
      file: 'server.js',
      env: {
        PORT: '9000'
      }
    }
  }
};
