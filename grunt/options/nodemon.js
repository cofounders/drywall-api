module.exports = {
  server: {
    script: 'app/server.js',
    options: {
      nodeArgs: ['--debug'],
      env: {
        PORT: '<%= package.port %>'
      },
      watch: ['app'],
      callback: function (nodemon) {
        nodemon.on('log', function (event) {
          console.log(event.colour);
        });
      },
    }
  }
};
