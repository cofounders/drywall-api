var jwt = require('jsonwebtoken');
var Promise = require('bluebird');
var prequest = require('prequest');
var config = require('../../app/config');

function localhost(path) {
  var base = 'http://localhost';
  var port = require('../../app/config').port;
  path = path && path[0] !== '/' ? '/' + path : path;
  return [base, ':', port, path || ''].join('');
}

function testerAccessToken(testerId) {
  testerId = testerId || 'github|8487474';

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

function bearerToken() {
  var secret = new Buffer(config.auth0.secret || '', 'base64');
  var audience = config.auth0.clientId;
  var id = 'github|8487474';

  return testerAccessToken(id).then(function (token) {
    return 'Bearer ' + jwt.sign({
        identities: [{
          access_token: token,
          provider: 'github'
        }],
        iss: 'https://drywall.auth0.com/',
        sub: id,
        nickname: 'drywallcfsg'
      },
      secret, {'audience': audience}
    );
  });
}

module.exports = {
  localhost: localhost,
  bearerToken:bearerToken,
  testerAccessToken: testerAccessToken
};
