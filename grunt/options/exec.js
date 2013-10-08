module.exports = function(grunt) {
  return {
    frisby: {
      command: 'jasmine-node tests/integration' 
    }
  }
}
