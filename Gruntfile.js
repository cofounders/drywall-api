module.exports = function (grunt) {
  require('load-grunt-config')(grunt, {
    configPath: require('path').join(process.cwd(),
      'grunt/options'
    ),
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
