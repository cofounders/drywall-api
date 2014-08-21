var path = require('path');
var jwt = require('express-jwt');
var prequest = require('request-promise');
var NodeCache = require('node-cache');
var config = require('../config');
var cache = new NodeCache({checkperiod: 108000}); //30mins

function authenticate(req, res, next) {
  return jwt({
    secret: new Buffer(config.auth0.secret || '', 'base64'),
    audience: config.auth0.clientId
  })(req, res, function(err) {
    if (!err) {
      console.log(req.user);
      next();
    } else {
      console.error(err.status, err.message);
      res.status(err.status)
         .send({error: 'Unauthorized user!'});
    }
  });
}

function errorHandler(err, req, res, next) {
  res.status(err.statusCode || 404);
  res.send({message: err.message || 'Nothing to see here!'});
}

function githubAuthorization(req, res, next) {
  console.log('Authorizing github' + req.path);

  var token = req.query.access_token || req.body.access_token || undefined;
  var accessQuery = token ? '?access_token=' + token : '';
  var owner = req.params.owner;
  var repo = req.params.repo;
  var url = 'https://api.github.com/' +
          path.join('repos', owner, repo) + accessQuery;

  cache.get(url, function(err, value) {
  if (!err && Object.keys(value).length !== 0) {
      console.log('From cache: ' + url);
      req.github = value[url];
      return next();
    }
  });

  prequest({
    url: url,
    headers: {'User-Agent': owner},
    json: true
  }).then(function (data) {
    var permissions = data.permissions || {};
    req.github = {
      private: data.private || false,
      read: !data.private ? true : permissions.pull || false,
      write: permissions.push || false,
    };
    cache.set(url, req.github);
    return next();
  }).catch(function (err) {
    err.message = 'Cannot access ' + url;
    return next(err);
  });
}

function githubAccess(type) {
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
  authenticate: authenticate,
  errorHandler: errorHandler,
  githubAuthorization: githubAuthorization,
  githubReadAccess: githubAccess('read'),
  githubWriteAccess: githubAccess('write')
};