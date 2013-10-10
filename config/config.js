define([
	'underscore',
], function (_) {

	var env = (function () {
		var envTmp = {}
		_.each(process.env, function (value, key) {
			try {
				envTmp[key] = JSON.parse(value);
			} catch (e) {
				envTmp[key] = value;
			}
		});
		return envTmp;
	} ());

	var generate_mongo_url = function (obj) {
		obj.hostname = (obj.hostname || 'localhost');
		obj.port = (obj.port || 27017);
		obj.db = (obj.db || 'testApp');

		if (obj.username && obj.password) {
			return "mongodb://" + obj.username + ":" +
				obj.password + "@" +
				obj.hostname + ":" +
				obj.port + "/" +
				obj.db;
		} else {
			return "mongodb://" + obj.hostname + ":" + obj.port + "/" + obj.db;
		}
	};

	var mongo1 = (function () {
		var mongo =  {
			"hostname": "localhost",
			"port": 27017,
			"username": "",
			"password": "",
			"name": "",
			"db": "gitdb"
		}

		return generate_mongo_url(mongo);
	}());

	return {
		server: {
			port: env.PORT || 3003,
			ip: env.IP || "127.0.0.1",
		},
		db: {
			mongo1: process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				mongo1
		},
		env: env
	};
});
