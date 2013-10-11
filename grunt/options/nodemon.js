module.exports = {
  server: {
    options: {
      file: '<%= package.main %>',
      env: {
        PORT: '<%= package.port %>'
      }
    }
  }
};
