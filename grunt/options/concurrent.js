module.exports = function (grunt) {
  return {
    dev: {
      tasks: ['nodemon', 'node-inspector', 'watch:scripts'],
      options: {
        logConcurrentOutput: true
      }
    }
  };
};