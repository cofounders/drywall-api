var express = require('express'),
	orgs = require('./routes/orgs'),
	app = express(),
	port = process.env.PORT || 3003;

app.configure(function () {
	app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
	app.use(express.bodyParser());
});

app.get('/user/orgs',         orgs.getOrgs );
app.get('/orgs/:org/repos',   orgs.getRepos);
//app.post('/orgs/:org/repos',  orgs.addRepo );
//app.patch('/orgs/:org/repos', orgs.editRepo);
//GET /repos/:owner/:repo/branches
//app.get('/repos/:owner/:repo/issues')  repos.getIssues

app.listen(port);

console.log('Server running at port ' + port);
