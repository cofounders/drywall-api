module.exports = function (grunt) {
  grunt.registerTask('stage', [
    'default',
    'express:staging',
    'express-keepalive'
  ]);
};
