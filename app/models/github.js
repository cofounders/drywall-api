var mongoose = require('mongoose');
var uri = require('../components/uri');
var config = require('../config');

var endpoints = config.endpoints;
var keys = config.keys;
var schema = new mongoose.Schema({
  session: String,
  access_token: String
});

function getAccessToken(code, callback) {
  var url = uri.toURL(endpoints.ghAccessToken, {
    client_id: keys.ghClientId,
    client_secret: keys.ghClientSecret,
    code: code
  });
  // request.post(url, {}, function(err,resp,body) {
  //   callback(body);
  // });
}

schema.static('make', function(code, session) {
  var Self = this;
  getAccessToken(code, function(body) {
    var parameters = uri.fromParameterString(body);
    new Self({
      session: session,
      access_token: parameters.access_token
    }).save();
  });
});

module.exports = {
  schema: schema
};
