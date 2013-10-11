define([
	'underscore',
	'app/controllers/organizations',
	'app/controllers/login'
], function (
	_, Organizations, login
) {
	return function (app, config) {

		app

		.get('/user/orgs', Organizations.getOrgs)
		.get('/orgs/:org/repos', Organizations.getRepos)


		// .post('/orgs/:org/repos', Organizations.addRepo);
		// .patch('/orgs/:org/repos', Organizations.editRepo);
		// .get('/repos/:owner/:repo/branches', Do.Something)
		// .get('/repos/:owner/:repo/issues')  repos.getIssues

    .get('/login/github',          login.github.authorize)
    .get('/login/github/redirect', login.github.redirect)

		.all('*', function (req, res) {
			res.send(404);
		})
	};
});
