var _ = require('underscore');
var CoordinatesModel = require('../models/coordinates');
var dbUtils = require('../modules/dbUtils');

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
    owner: dbUtils.caseinsensitiveRegex(owner),
    repo: dbUtils.caseinsensitiveRegex(repo)
  }).select('-_id -timestamp'
  ).exec(function (err, coordinates) {
    if (!err) {
      return res.send(coordinates);
    } else {
      console.error(err.errors);
      return res.status(500)
         .send('Error finding coordinates for ' + owner + '/' + repo);
    }
  });
}

function create(req, res) {
  console.log('POST: ', req.query);
  var owner = req.params.owner;
  var repo = req.params.repo;

  var values = modelValues(_.extend(req.query, {
    owner: dbUtils.caseinsensitiveRegex(owner),
    repo: dbUtils.caseinsensitiveRegex(repo)
  }));

  var coordinates = new CoordinatesModel(values);
  coordinates.save(function (err) {
    if (!err) {
      console.log('Coordinates created');
      return res.send(values);
    } else {
      console.error(err.errors);
      return res.status(500)
         .send('Error saving coordinates for ' + owner + '/' + repo);
    }
  });
}

function addUpdate(req, res) {
  console.log('POST: ', req.body);

  if (!req.body.hasOwnProperty('number') ||
      !req.body.hasOwnProperty('x') ||
      !req.body.hasOwnProperty('y')) {
    return res.status(404)
       .send('Missing required data `x`,`y` or `number`');
  }
  var owner = req.params.owner;
  var repo = req.params.repo;
  var queryVals = {
    owner: dbUtils.caseinsensitiveRegex(owner),
    repo: dbUtils.caseinsensitiveRegex(repo),
    number: req.body.number
  };
  var updateVals = {
    owner: owner,
    repo: repo,
    x: req.body.x,
    y: req.body.y,
    timestamp: new Date().toISOString()
  };

  function callback(err, obj) {
    if (!err) {
      console.log('Updated Coordinates' + obj);
      return res.send(_.extend(queryVals, updateVals));
    } else {
      console.error(err.errors);
      return res.status(500)
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