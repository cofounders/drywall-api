var express = require('express');
var mid = require('../middlewares');
var coordinates = require('./coordinates');
var ipnListener = require('./ipnListener');
var billing = require('./billing');

function testRoutes() {
  var router = express.Router();

  router.use('/api', mid.authenticate);

  router.get('/ping/:owner/:repo',
    mid.authorize,
    function(req, res) {
    console.log(req.github);
    res.status(200).send({text: 'All good. No need to be authenticated'});
  });

  router.get('/api/ping', function(req, res) {
    console.log('access_token: ' + req.query.access_token);
    res.status(200)
       .send({text: 'All good. Authenticated'});
  });

  return router;
}

function setup(app) {
  var router = express.Router();

  router.get('/', function(req, res) {
    res.send('Hello from Drywall');
  });
  router.route('/:owner/:repo/coordinates')
    .all(mid.authorize, mid.paidAccess, mid.authenticate)
    .get(coordinates.list)
    .post(coordinates.add);

  router.post('/billing/:user/create', mid.authenticate, billing.create);
  router.post('/billing/:user/update', mid.authenticate, billing.update);
  router.get('/billing/:user/list', mid.authenticate, billing.list);
  router.get('/billing/:user/execute', billing.execute);
  router.get('/billing/:user/abort', billing.abort);

  router.post('/paypal_callback', ipnListener);

  app.use('/', router);
  app.use(testRoutes());
  app.use(mid.errorHandler);
}

exports.setup = setup;