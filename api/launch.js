var deployd = require('deployd');

var server = deployd({
	port: process.env.PORT || 2403,
	env: 'development',
});

server.on('listening', function() {
	console.log('Server is listening');
});

server.on('error', function(err) {
	console.error(err);
});

server.listen();
