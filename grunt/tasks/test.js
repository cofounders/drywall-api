module.exports = function (grunt) {
  grunt.registerTask('test', [
    'default',
    'jshint',
    'exec:frisby'
  ]);
};
