module.exports = {
  scripts: {
    files: [
      'Gruntfile.js',
      'package.json',
      'app/**/*.js'
    ],
    tasks: [
      'jshint'
    ]
  },
  test: {
    files: [
      'tests/**/*.js'
    ],
    tasks: [
      'cafemocha'
    ]
  }
};
