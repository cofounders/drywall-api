module.exports = function (grunt) {
  require('load-grunt-config')(grunt, {
    configPath: 'grunt/options',
    config: {
      port: 9000
    }
  });
  grunt.loadTasks('grunt/tasks');
};
