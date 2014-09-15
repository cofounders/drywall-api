var _ = require('underscore');
var path = require('path');
var Promise = require('bluebird');
var prequest = require('prequest');
var NodeCache = require('node-cache');
var cache = new NodeCache({checkperiod: 0, stdTTL: 172800}); //2days
var ApiUrl = 'https://api.github.com/';

function githubOrganisations(data) {
  return _.map(data, function(obj) {
    return obj.login.toLowerCase();
  });
}

// Get a user's list of organisations from /user/orgs
//  Options github object: nickname` and `access_token`
function userOrganisations(opts) {
  var url = ApiUrl + 'user/orgs' +
    '?access_token=' + opts.access_token;
  var moreHeaders = {};
  var orgs = {};

  cache.get(url, function(err, store) {
    if (!err && Object.keys(store).length !== 0) {
      console.log('Orgs from cache: ' + url);
      orgs = store[url].orgs;
      moreHeaders = {'If-None-Match': store[url].etag};
    }
  });

  return new Promise(function (resolve, reject) {
    prequest({
      url: url,
      headers: _.defaults({'User-Agent': opts.nickname}, moreHeaders),
      arrayResponse: true
    }).spread(function (response, data) {
      if (response.statusCode === 304) {
        return resolve(orgs);
      }
      data.push({login: opts.nickname}); // Add user into list of orgs
      orgs = githubOrganisations(data);
      cache.set(url, {orgs: orgs, etag: response.headers.etag});
      resolve(orgs);
    }).catch(function (err) {
      err.message = 'Cannot access ' + url;
      reject(err);
    });
  });
}

function githubPermissions(data) {
  var permissions = data.permissions || {};
  return {
    private: data.private || false,
    read: !data.private ? true : permissions.pull || false,
    write: permissions.push || false,
  };
}

// Get a user's permission to a repo from /repos/:owner/:repo
// Options object: `owner`, `repo`, `query`
function userPermissions(opts) {
  var url = ApiUrl + path.join('repos', opts.owner, opts.repo) +
    '?' + opts.query;
  var moreHeaders = {};
  var permissions = {};

  cache.get(url, function(err, store) {
    if (!err && Object.keys(store).length !== 0) {
      console.log('From cache: ' + url);
      permissions = store[url].permissions;
      moreHeaders = {'If-None-Match': store[url].etag};
    }
  });

  return new Promise(function (resolve, reject) {
    prequest({
      url: url,
      headers: _.defaults({'User-Agent': opts.owner}, moreHeaders),
      arrayResponse: true
    }).spread(function (response, data) {
      if (response.statusCode === 304) {
        resolve(permissions);
      }

      permissions = githubPermissions(data);
      cache.set(url, {permissions: permissions, etag: response.headers.etag});
      resolve(permissions);
    }).catch(function (err) {
      err.message = 'Cannot access ' + url;
      reject(err);
    });
  });
}

module.exports = {
  userOrganisations: userOrganisations,
  userPermissions: userPermissions
};
