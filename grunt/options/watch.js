module.exports = {
  scripts: {
    files: [
      'Gruntfile.js',
      'package.json',
      'server.js',
      '{config,routes,tests}/**/*.js'
    ],
    tasks: [
      'jshint'
    ]
  }
};
