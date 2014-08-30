var Promise = require('bluebird');
var request = require('request');

function prequest(url, options) {
  if (options) {
    options.url = url;
  } else {
    options = url;
  }
  options.json = options.json === undefined ? true : options.json;

  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else if (response.statusCode >= 400) {
        reject(response);
      } else if (options.arrayResponse) {
        resolve([response, body]);
      } else {
        resolve(body);
      }
    });
  });
}

module.exports = prequest;