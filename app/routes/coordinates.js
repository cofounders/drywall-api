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
  console.log('POST: ', req.body);
  values = modelValues(req.body);
  console.log(Object.keys(values).length);
  if (Object.keys(values).length === 0) {
    return res.status(200)
              .send('No coordinates posted');
  }

  var coordinates = new CoordinatesModel(values);
  coordinates.save(function (err) {
    if (!err) {
      return console.log('Coordinate created');
    } else {
      return console.log(err);
    }
  });
  return res.send('Coordinate posted');
}

function list(req, res) {
  console.log('GET: ', req.query);
  var owner = req.query.owner;
  var repo = req.query.repo;
  if (!owner || !repo) {
    return res.status(404).send('No owner or repo');
  }

  CoordinatesModel.find({
    repo: repo,
    owner: owner
  }, function (err, coordinate) {
    if (!err) {
      return res.send(coordinate);
    } else {
      console.error(err);
      return res.status(404).send('No coordinates found');
    }
  });
}

module.exports = {
  add: add,
  list: list
};