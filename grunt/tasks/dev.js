module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'jshint',
    'nodemon'
  ]);
};
