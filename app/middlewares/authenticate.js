var jwt = require('express-jwt');
var config = require('../config');

function authenticate(req, res, next) {
  if (!req.headers.hasOwnProperty('authorization')) {
    return next();
  }

  return jwt({
    secret: new Buffer(config.auth0.secret || '', 'base64'),
    audience: config.auth0.clientId
  })(req, res, function(err) {
    if (!err) {
      req.user.access_token = req.user.identities[0].access_token;
      console.log(req.user.nickname, req.user.sub, 'logged in');
      return next();
    } else {
      if (err.message === 'jwt expired') {
        err.status = 419;
      }
      console.error(err.status, err.message);
      return next(err);
    }
  });
}

module.exports = authenticate;