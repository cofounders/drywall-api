define([
	'underscore',
], function (_) {

  var keys = {
    ghClientId: 'a110297b7d6a6fab5dac',
    ghClientSecret: '1f452780e9f37f5c49a3406e60917e0c1032fae7' // Abuse wisely. ;-)
  }
  
  var endpoints = {
    dwRedirect: "http://localhost:9000/login/github/redirect",
    ghAuthorize: "https://github.com/login/oauth/authorize",
    ghAccessToken: "https://github.com/login/oauth/access_token"
  };

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
			port: env.PORT || 9000,
			ip: env.IP || "127.0.0.1",
		},
		db: {
			mongo1: process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				mongo1
		},
		env: env,
		endpoints: endpoints,
		keys: keys
	};
});
