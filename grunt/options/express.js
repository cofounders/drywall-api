module.exports = function (grunt) {
  return {
    production: {
      server: 'server.js',
      options: {
        port: 9000,
        serverreload: false,
        open: true
      }
    },
    staging: {
      server: 'server.js',
      options: {
        port: 9001,
        serverreload: false,
        open: false
      }
    },
    development: {
      server: 'server.js',
      options: {
        port: 9002,
        serverreload: true,
        open: true
      }
    }
  };
};
