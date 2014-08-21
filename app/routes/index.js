var express = require('express');
var github = require('./github');
var coordinates = require('./coordinates');

function setup(app) {
  var router = express.Router();

  router.get('/', function(req, res){
    res.send('Hello from Drywall');
  });
  router.route('/:owner/:repo/coordinates')
    .get(coordinates.list)
    .post(coordinates.add);

  app.use('/', router);
}

exports.setup = setup;