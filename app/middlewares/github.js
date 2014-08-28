var path = require('path');
var _ = require('underscore');
var NodeCache = require('node-cache');
var cache = new NodeCache({checkperiod: 0});
var prequest = require('../components/prequest');
var config = require('../config');

function authorization(req, res, next) {
  console.log('Authorizing github' + req.path);

  var token = req.query.access_token || (req.body && req.body.access_token);
  var accessQuery = token ? '?access_token=' + token : '';
  var owner = req.params.owner;
  var repo = req.params.repo;
  var url = 'https://api.github.com/' +
          path.join('repos', owner, repo) + accessQuery;
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

    var permissions = data.permissions || {};
    req.github = {
      private: data.private || false,
      read: !data.private ? true : permissions.pull || false,
      write: permissions.push || false,
    };

    cache.set(url, {github: req.github, etag: response.headers.etag});
    return next();
  }).catch(function (err) {
    err.message = 'Cannot access ' + url;
    return next(err);
  });
}

function access(type) {
  return function (req, res, next) {
    if (req.github[type]) {
      console.log(req.github);
      next();
    } else {
      var error = new Error('No ' + type + ' access to github repo');
      error.status = 401;
      next(error);
    }
  };
}

module.exports = {
  authorization: authorization,
  readAccess: access('read'),
  writeAccess: access('write')
};