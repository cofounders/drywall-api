module.exports = function (grunt) {
  grunt.registerTask('test', [
    'jshint',
    'complexity',
    'express',
    'jasmine_node',
    'cafemocha'
  ]);
};
