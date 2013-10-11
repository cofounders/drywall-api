module.exports = function (grunt) {
  grunt.registerTask('test', [
    'default',
    'jshint',
    'jasmine_node'
  ]);
};
