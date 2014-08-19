var prequest = require('request-promise');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var config = require('../../app/config');
var errFunc = function(e) {
  return console.error(e.statusCode, e.error);
};

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

function postEmptyCoordinate() {
  prequest({
    method: 'POST',
    url: baseUrl + '/coordinates'
  }).then(function(d) {
    console.log(d);
  }).catch(errFunc);
}

function getCoordinates() {
  prequest(baseUrl + '/coordinates?owner=cofounders&repo=drywall-web')
  .then(function(d) {
    console.log(d);
  }).catch(errFunc);
}
