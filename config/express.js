define([
	'express', 'config/config.js', 'cors',
	'app/components/utils.js'
], function(
	express, config, cors, utils
) {
	return function (app, config) {

		app.set('showStackError', true);

		app.configure(function () {
			app.use(express.logger('dev'));
			app.use(express.favicon());
			app.use(express.bodyParser());
			app.use(express.methodOverride());
			app.use(express.cookieParser('wowWhatASecret!'));
			app.use(express.session());

			app.use(app.router);

			app.use(function(err, req, res, next){
				// treat as 404
				if (err.message
					&& (~err.message.indexOf('not found')
					|| (~err.message.indexOf('Cast to ObjectId failed')))) {
					return next()
				}
				res.status(500).send('500', { error: err.stack })
			});

		});

	};
});
