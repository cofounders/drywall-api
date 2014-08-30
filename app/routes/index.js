var express = require('express');
var coordinates = require('./coordinates');
var paypal = require('./paypal');
var mid = require('../middlewares');

function testRoutes() {
  var router = express.Router();

  router.use('/api', mid.authenticate);

  router.get('/ping/:owner/:repo',
    mid.github.authorization,
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
    var config = require('../config');
    console.log(config);
    res.send('Hello from Drywall');
  });
  router.route('/:owner/:repo/coordinates')
    .all(mid.github.authorization, mid.paidAccess)
    .get(mid.github.readAccess, coordinates.list)
    .post(mid.github.writeAccess, mid.authenticate, coordinates.add);

  router.post('/paypal_callback', paypal.ipnListener);
  router.post('/paypal', paypal.paymentHandler);

  app.use('/', router);
  app.use(testRoutes());
  app.use(mid.errorHandler);
}

exports.setup = setup;