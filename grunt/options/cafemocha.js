module.exports = function (grunt) {
  return {
    mochaTest: {
      options: {
        ui: 'bdd',
        reporter: 'list'
      },
      src: ['tests/unit/*.js']
    }
  };
};