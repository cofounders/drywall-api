module.exports = function (grunt) {
  return {
    production: {
      options: {
        server: 'server.js',
        port: 9000,
        serverreload: false,
        open: true
      }
    },
    staging: {
      options: {
        server: 'server.js',
        port: 9001,
        serverreload: false,
        open: false
      }
    },
    development: {
      options: {
        server: 'server.js',
        port: 9002,
        serverreload: true,
        open: true
      }
    }
  };
};
