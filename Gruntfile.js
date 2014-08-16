module.exports = function (grunt) {
  require('load-grunt-config')(grunt, {
    configPath: 'grunt/options',
    config: {
      port: 9000
    },
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    }
  });
  grunt.loadTasks('grunt/tasks');
};
