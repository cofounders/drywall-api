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
        'tests/**/*_spec.js',
        'tests/helpers/*.js'
      ]
    },
    app: {
      jshintrc: '.jshintrc',
      src: [
        'server.js',
        'routes/*.js'
      ]
    }
  };
};
