module.exports = function (grunt) {
  grunt.registerTask('test', [
    'jshint',
    'express',
    'jasmine_node'
  ]);
};
