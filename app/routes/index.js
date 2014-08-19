var github = require('./github');
var coordinates = require('./coordinates');

function index(req, res) {
  res.send('Drywall!');
}

function setup(app) {
  app.get('/', function(req, res){
    res.send('hello');
  });
  app.post('/post', function(req, res) {
    console.log('/post');
    res.send('Fine');
  });
  app.post('/:owner/:repo/coordinates', coordinates.add);
  app.get('/:owner/:repo/coordinates', coordinates.list);
  app.put('/:owner/:repo/coordinates', coordinates.update);
  app.get('/login/github', github.authorize);
  app.get('/login/github/redirect', github.redirect);
  app.all('*', function (req, res, next) {
    res.status(404);
  });
}

exports.setup = setup;
