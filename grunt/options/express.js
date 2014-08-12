module.exports = function (grunt) {
  return {
    express: {
      options: {
        script: '<%= package.main %>',
        port: '<%= package.port %>'
      }
    }
  };
};
