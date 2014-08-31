var config = require('../../app/config');
var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
var prequest = require('../../app/modules/prequest');

function localhost(path) {
  var base = 'http://localhost';
  var port = require('../../app/config').port;
  path = path && path[0] !== '/' ? '/' + path : path;
  return [base, ':', port, path || ''].join('');
}

function bearerToken(data) {
  var secret = new Buffer(config.auth0.secret || '', 'base64');
  var audience = config.auth0.clientId;

  return 'Bearer ' + jwt.sign(
    data || {iss: 'https://drywall.auth0.com/',
      sub: 'github|8487474',
      user: 'drywallcfsg'},
    secret,
    {'audience': audience}
  );
}

function testerAccessToken() {
  var testerId = 'github|8487474';

  return new Promise(function(resolve, reject) {
    prequest({
      method: 'POST',
      url: 'https://drywall.auth0.com/oauth/token',
      body: {
        'grant_type': 'client_credentials',
        'client_id': config.auth0.clientId,
        'client_secret': config.auth0.secret
      }
    }).then(function(data) {
      prequest({
        url: 'https://drywall.auth0.com/api/users/' + testerId,
        headers: {'Authorization': 'Bearer ' + data.access_token}
      }).then(function(data) {
        resolve(data.identities[0].access_token);
      }).catch(function(err) {
        console.error('Error github token' + JSON.stringify(err));
        reject(err);
      });
    }).catch(function(err) {
      console.error('Error getting Auth0 token: ' + JSON.stringify(err));
      reject(err);
    });
  });
}

module.exports = {
  localhost: localhost,
  bearerToken:bearerToken,
  testerAccessToken: testerAccessToken
};
