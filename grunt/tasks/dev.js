module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'jshint',
    'concurrent'
    //'express',
    //'nodemon',
    //'node-inspector'
  ]);
};
