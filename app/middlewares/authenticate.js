var jwt = require('express-jwt');
var config = require('../config');

function authenticate(req, res, next) {
  return jwt({
    secret: new Buffer(config.auth0.secret || '', 'base64'),
    audience: config.auth0.clientId
  })(req, res, function(err) {
    if (!err) {
      console.log(req.user);
      return next();
    } else {
      console.error(err.status, err.message);
      return next(err);
    }
  });
}

module.exports = authenticate;