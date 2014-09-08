var prequest = require('prequest');
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

function testapi() {
  prequest({
    url: baseUrl + '/api/ping',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  }).then(function (data) {
    console.log(data);
  }).catch(function(err) {
    console.error('Could not connect');
  });
}

function postCoordinates() {
  prequest({
    method: 'POST',
    url: baseUrl + '/cofounders/drywall-web/coordinates' +
          '?x=10&y=20&number=70'
  }).then(function (data) {
    console.log(data);
  }).catch(errFunc);
}

function getCoordinates() {
  prequest(baseUrl + '/webuildsg/webuild/coordinates')
  .then(function (data) {
    console.log(data);
  }).catch(errFunc);
}

function updateCoordinates() {
  prequest({
    method: 'POST',
    url: baseUrl + '/cofounders/drywall-web/coordinates',
    json: {
      'x': 80,
      'y': 100,
      'number': 72
    }
  }).then(function (data) {
    console.log(data);
  }).catch(errFunc);
}

getCoordinates();
