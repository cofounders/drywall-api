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
      return res.status(400)
         .send('Error finding coordinates for ' + owner + '/' + repo);
    }
  });
}

function create(req, res) {
  console.log('POST: ', req.query);
  var owner = req.params.owner;
  var repo = req.params.repo;

  values = modelValues(_.extend(req.query, {
    owner: owner, repo: repo
  }));

  var coordinates = new CoordinatesModel(values);
  coordinates.save(function (err) {
    if (!err) {
      console.log('Coordinates created');
      return res.send(values);
    } else {
      console.error(err.errors);
      return res.status(400)
         .send('Error saving coordinates for ' + owner + '/' + repo);
    }
  });
}

function addUpdate(req, res) {
  console.log('PUT: ', req.query);

  if (!req.query.number || !req.query.x || !req.query.y) {
    return res.status(400)
       .send('Missing required param `x`,`y` or `number`');
  }
  var owner = req.params.owner;
  var repo = req.params.repo;
  var queryVals = {
    owner: owner,
    repo: repo,
    number: req.query.number
  };
  var updateVals = {
    x: req.query.x,
    y: req.query.y,
    timestamp: new Date().toISOString()
  };

  function callback(err, obj) {
    if (!err) {
      console.log('Updated Coordinates' + obj);
      return res.send(_.extend(queryVals, updateVals));
    } else {
      console.error(err.errors);
      return res.status(400)
         .send('Error updating coordinates for ' + owner + '/' + repo);
    }
  }

  CoordinatesModel.findOneAndUpdate(
    queryVals,
    updateVals,
    {upsert: true},
    callback
  );
}

module.exports = {
  list: list,
  add: addUpdate
};