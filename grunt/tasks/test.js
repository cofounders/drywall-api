module.exports = function (grunt) {
  grunt.registerTask('test', [
    'jshint',
    'express',
    'exec:unit_tests',
    'exec:integration_tests'
  ]);
};
