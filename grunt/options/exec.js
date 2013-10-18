module.exports = function (grunt) { 
  return {
    unit_tests: {
      command: "jasmine-node --runWithRequireJs --requireJsSetup ./tests/helpers/require.js ./tests/unit/" },
    integration_tests: {
      command: "jasmine-node ./tests/integration/"
    }
  };
};
