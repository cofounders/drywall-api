module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'default',
    'express:development'
  ]);
};
