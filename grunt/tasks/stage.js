module.exports = function (grunt) {
  grunt.registerTask('stage', [
    'default',
    'nodemon:staging'
  ]);
};
