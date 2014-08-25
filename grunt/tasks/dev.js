module.exports = function (grunt) {
  grunt.registerTask('dev', [
    'env:dev',
    'jshint',
    'concurrent'
    //'express',
    //'nodemon',
    //'node-inspector'
  ]);
};
