var path = require('path');
var qs = require('querystring');
var prequest = require('../modules/prequest');
var config = require('../config');
var githubApi = require('../modules/github');

function authorize(req, res, next) {
  console.log('Authorizing github ' + req.path);

  var opts = req.params;
  opts.query = req.user ? 'access_token=' + req.user.access_token :
    qs.stringify({
      client_id: config.github.clientId,
      client_secret: config.github.secret
    });

  githubApi.userPermissions(opts).then(function (permissions) {
    req.github = permissions;
    return next();
  }).catch(function (err) {
    err.message = 'Error getting github permissions';
    console.error(err.message);
    return next(err);
  });
}

module.exports = authorize;