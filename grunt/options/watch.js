module.exports = {
	scripts: {
		files: [
			'Gruntfile.js',
			'package.json',
			'tests/**/*.js',
			'server.js',
			'routes/*.js'
		],
		tasks: [
			'jshint',
			'exec:frisby'
		]
	},
};
