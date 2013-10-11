define([
	'config/config.js',
	'app/components/utils/uri'
], function(
	config,
	uri
) {
	var Exports = {};

	Exports.someUtility = function (req, callback) {
	}

	Exports.uri = uri;

	return Exports;
});
