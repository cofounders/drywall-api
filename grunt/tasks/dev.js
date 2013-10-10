module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'default',
    'exec:express'
  ]);
};
