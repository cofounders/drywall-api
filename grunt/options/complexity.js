module.exports = function (grunt) {
  return {
    complexity: {
      src: [
        'app/**/*.js',
        'Gruntfile.js'
      ],
      options: {
        errorsOnly: false,
        cyclomatic: 4,
        halstead: 8,
        maintainability: 65,
        hideComplexFunctions: true,
      }
    }
  };
};
