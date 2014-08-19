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
  console.log("POST: ", req.body);
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

module.exports = {
  add: add
};