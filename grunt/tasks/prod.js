module.exports = function (grunt) {
  grunt.registerTask('prod', [
    'default',
    'express:production'
  ]);
};
