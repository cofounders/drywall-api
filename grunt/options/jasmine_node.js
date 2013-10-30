module.exports = {
  integration: {
    forceExit: true,
    projectRoot: 'tests/integration/'
  },
  unit: {
    forceExit: true,
    useRequireJs: "./tests/helpers/require.js",
    projectRoot: 'tests/unit/'
  }
};
