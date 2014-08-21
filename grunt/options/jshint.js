module.exports = function (grunt) {
  return {
    options: {
      jshintrc: '.jshintrc'
    },
    build: {
      src: [
        'package.json',
        'Gruntfile.js',
        'grunt/**/*.js'
      ]
    },
    tests: {
      src: [
        'tests/**/*js',
      ]
    },
    app: {
      src: [
        ['app/**/*.js', '!app/config.js']
      ]
    }
  };
};
