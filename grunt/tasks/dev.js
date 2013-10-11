module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'default',
    'nodemon:development'
  ]);
};
