var StickiesModel = require('../models/stickies');

function modelValues(obj) {
  var attributes = {};

  StickiesModel.schema.eachPath(function(key) {
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
              .send('No stickies posted');
  }

  var stickies = new StickiesModel(values);
  stickies.save(function (err) {
    if (!err) {
      return console.log('Stickie created');
    } else {
      return console.log(err);
    }
  });
  return res.send('Stickie posted');
}

function list(req, res) {
  console.log('GET: ', req.query);
  var owner = req.query.owner;
  var repo = req.query.repo;
  if (!owner || !repo) {
    return res.status(404).send('No owner or repo');
  }

  StickiesModel.find({
    repo: repo,
    owner: owner
  }, function (err, stickie) {
    if (!err) {
      return res.send(stickie);
    } else {
      console.error(err);
      return res.status(404).send('No stickie found');
    }
  });
}

module.exports = {
  add: add,
  list: list
};