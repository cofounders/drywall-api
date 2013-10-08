module.exports = function (grunt) {
  grunt.registerTask('test', [
    'default',
    'exec:frisby',
    'jshint',
    'watch'
  ]);
};
