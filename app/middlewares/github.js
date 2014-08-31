var path = require('path');
var qs = require('querystring');
var _ = require('underscore');
var NodeCache = require('node-cache');
var cache = new NodeCache({checkperiod: 0});
var prequest = require('../modules/prequest');
var config = require('../config');

function githubPermissions(data) {
  var permissions = data.permissions || {};
  return {
    private: data.private || false,
    read: !data.private ? true : permissions.pull || false,
    write: permissions.push || false,
  };
}

function authorization(req, res, next) {
  console.log('Authorizing github ' + req.path);

  var token = req.query.access_token || (req.body && req.body.access_token);
  var query = token ? 'access_token=' + token : qs.stringify({
    client_id: config.github.clientId,
    client_secret: config.github.secret
  });
  var owner = req.params.owner;
  var repo = req.params.repo;
  var url = 'https://api.github.com/' +
          path.join('repos', owner, repo) + '?' + query;
  var moreHeaders = {};

  cache.get(url, function(err, store) {
    if (!err && Object.keys(store).length !== 0) {
      console.log('From cache: ' + url);
      req.github = store[url].github;
      moreHeaders = {'If-None-Match': store[url].etag};
    }
  });

  prequest({
    url: url,
    headers: _.defaults({'User-Agent': owner}, moreHeaders),
    arrayResponse: true
  }).spread(function (response, data) {
    if (response.statusCode === 304) {
      return next();
    }

    req.github = githubPermissions(data);
    cache.set(url, {github: req.github, etag: response.headers.etag});
    console.log(req.github);
    return next();
  }).catch(function (err) {
    err.message = 'Cannot access ' + url;
    return next(err);
  });
}

module.exports = {
  authorization: authorization
};