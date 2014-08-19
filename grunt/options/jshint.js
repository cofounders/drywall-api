module.exports = function (grunt) {
  return {
    build: {
      jshintrc: '.jshintrc',
      src: [
        'package.json',
        'Gruntfile.js',
        'grunt/**/*.js'
      ]
    },
    tests: {
      jshintrc: '.jshintrc',
      src: [
        'tests/**/*js',
      ]
    },
    app: {
      jshintrc: '.jshintrc',
      src: [
        'app/**/*.js'
      ]
    }
  };
};
