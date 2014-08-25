module.exports = function (grunt) {
  return {
    dev: {
      NODE_ENV : 'development'
    },
    prod: {
      NODE_ENV : 'production'
    }
  };
};