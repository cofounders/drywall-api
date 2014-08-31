var _ = require('underscore');
var path = require('path');
var Promise = require('bluebird');
var NodeCache = require('node-cache');
var cache = new NodeCache({checkperiod: 0});
var prequest = require('../modules/prequest');
var ApiUrl = 'https://api.github.com/';

function githubOrganisations(data) {
  return _.map(data, function(obj) {
    return {'owner': obj.login};
  });
}

function userOrganisations(opts) {
  var url = ApiUrl + path.join('users', opts.user, 'orgs') +
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
      headers: _.defaults({'User-Agent': opts.user}, moreHeaders),
      arrayResponse: true
    }).spread(function (response, data) {
      if (response.statusCode === 304) {
        return resolve(orgs);
      }

      orgs = githubOrganisations(data);
      cache.set(url, {orgs: orgs, etag: response.headers.etag});
      resolve(orgs);
    }).catch(function (err) {
      err.message = 'Cannot access ' + url;
      reject(err);
    });
  });
}

module.exports = {
  userOrganisations: userOrganisations
};
