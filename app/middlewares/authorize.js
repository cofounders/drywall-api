var path = require('path');
var qs = require('querystring');
var prequest = require('prequest');
var config = require('../config');
var githubApi = require('../modules/github');

function authorize(req, res, next) {
  console.log('Authorizing github ' + req.path);

  var opts = req.params;
  console.log(!!req.user, req.headers)
  opts.query = req.user ?
    'access_token=' + (
      req.user.access_token ||
      req.headers['github-access-token']
    )
    : qs.stringify({
      client_id: config.github.clientId,
      client_secret: config.github.secret
    });

  githubApi.userPermissions(opts).then(function (permissions) {
    req.github = permissions;
    return next();
  }).catch(function (err) {
    err.message = 'Cannot get github permissions. ' + opts.query;
    console.error(err.message);
    return next(err);
  });
}

module.exports = authorize;