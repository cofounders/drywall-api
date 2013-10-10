define([
	'underscore',
	'app/controllers/organizations'
], function (
	_, Organizations
) {
	return function (app, config) {

		app

		.get('/user/orgs', Organizations.getOrgs)
		.get('/orgs/:org/repos', Organizations.getRepos)


		// .post('/orgs/:org/repos', Organizations.addRepo);
		// .patch('/orgs/:org/repos', Organizations.editRepo);
		// .get('/repos/:owner/:repo/branches', Do.Something)
		// .get('/repos/:owner/:repo/issues')  repos.getIssues



		.all('*', function (req, res) {
			res.send(404);
		})
	};
});
