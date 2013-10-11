module.exports = function (grunt) {
  grunt.registerTask('prod', [
    'default',
    'nodemon:production'
  ]);
};
