module.exports = function(grunt) {
  return {
    frisby: {
      command: 'node ./node_modules/jasmine-node/bin/jasmine-node ./tests/integration'
    }
  };
};