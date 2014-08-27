var express = require('express');
var github = require('./github');
var coordinates = require('./coordinates');
var paypal = require('./paypal');
var mod = require('../components/middleware');


function addTestRoutes(router) {
  router.use('/api', mod.authenticate);

  router.get('/ping/:owner/:repo',
    mod.githubAuthorization,
    function(req, res) {
    console.log(req.github);
    res.status(200).send({text: 'All good. No need to be authenticated'});
  });

  router.get('/api/ping', function(req, res) {
    console.log('access_token: ' + req.query.access_token);
    res.status(200)
       .send({text: 'All good. Authenticated'});
  });
}

function setup(app) {
  var router = express.Router();

  router.get('/', function(req, res){
    res.send('Hello from Drywall');
  });
  router.route('/:owner/:repo/coordinates')
    .all(mod.githubAuthorization, mod.paidAccess)
    .get(mod.githubReadAccess, coordinates.list)
    .post(mod.githubWriteAccess, mod.authenticate, coordinates.add);

  router.post('/paypal_callback', paypal.ipnHandler);

  addTestRoutes(router);
  app.use('/', router);
  app.use(mod.errorHandler);
}

exports.setup = setup;