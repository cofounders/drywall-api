var prequest = require('request-promise');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var config = require('../../app/config');

var token = jwt.sign(
  {foo: 'bar'},
  new Buffer(config.auth0.secret || '', 'base64'),
  {'audience': config.auth0.clientId}
);
var baseUrl = 'http://localhost:' + config.port;

prequest({
  url: baseUrl + '/api/ping',
  headers: {
    'Authorization': 'Bearer ' + token
  }
}).then(function(d) {
  console.log(d);
}).catch(function(err) {
  console.error('Could not connect');
});

function postEmptyStickie() {
  prequest({
    method: 'POST',
    url: baseUrl + '/stickies'
  }).then(function(d) {
    console.log(d);
  }).catch(function(e) {
    console.error(e.statusCode, e.error);
  });
}

