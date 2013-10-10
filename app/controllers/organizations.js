define([
	'mongoose'
], function (mongoose) {

	var Exports = {};


	// GET /user/orgs
	// List public and private organizations for the authenticated user.
	// http://developer.github.com/v3/orgs/

	Exports.getOrgs = function (req, res) {
		// db.collection('orgs', function(err, col) {
		// 	col.find().toArray(function(err, items) {
		// 		res.send(items);
		// 	});
		// });
	}


	// GET /orgs/:org/repos
	// List organization repositories
	// http://developer.github.com/v3/repos/#list-organization-repositories
	Exports.getRepos = function (req, res) {
		// var org = req.params.org;
		// console.log("Getting repos from " + org);
		// db.collection('repos', function(err, col) {
		// 	col.find({'owner.login': org}).toArray(function(err, items) {
		// 		if(items.length > 0) {
		// 			res.send(items);
		// 		} else {
		// 			res.send("No items retrieved for "+ org);
		// 		}
		// 	});
		// });
	}

	return Exports;
});
