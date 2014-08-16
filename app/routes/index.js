var github = require('./github');
var stickies = require('../models/stickies');

function index(req, res) {
  res.send('Drywall!');
}

function setup(app) {
  app.get('/', function(req, res){
    res.send('hello')
  });
  app.get('/:organisation/:repo/stickies', stickies.list);
  // app.put('/:organisation/:repo/stickies', stickies.update);
  // app.post('/:organisation/:repo/stickies', stickies.add);
  // app.delete('/:organisation/:repo/stickies', stickies.delete);
  app.get('/login/github', github.authorize);
  app.get('/login/github/redirect', github.redirect);
  app.all('*', function (req, res, next) {
    res.send(404);
  });
}

exports.setup = setup;
