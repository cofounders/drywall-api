var _ = require('underscore');
var CoordinatesModel = require('../models/coordinates');

function modelValues(obj) {
  var attributes = {};

  CoordinatesModel.schema.eachPath(function(key) {
    if (obj[key]) {
      attributes[key] = obj[key];
    }
  });

  return attributes;
}

function add(req, res) {
  console.log('POST: ', req.query);
  var owner = req.params.owner;
  var repo = req.params.repo;

  values = modelValues(_.extend(req.query, {
    'owner': owner, 'repo': repo
  }));

  var coordinates = new CoordinatesModel(values);
  coordinates.save(function (err) {
    if (!err) {
      console.log('Coordinates created');
      return res.send(values);
    } else {
      console.error(err.errors);
      res.status(500)
         .send('Error saving coordinates for ' + owner + '/' + repo);
    }
  });
}

function list(req, res) {
  console.log('GET: ', req.params);
  var owner = req.params.owner;
  var repo = req.params.repo;

  CoordinatesModel.find({
    repo: repo,
    owner: owner
  }, function (err, coordinate) {
    if (!err) {
      return res.send(coordinate);
    } else {
      console.error(err.errors);
      return res.status(404)
      .send('Error finding coordinates for ' + owner + '/' + repo);
    }
  });
}

function update(req, res) {
  console.log('PUT: ', req.query);
}

module.exports = {
  add: add,
  list: list,
  update: update
};