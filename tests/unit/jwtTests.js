'use strict';

var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var config = require('../../app/config');
var assert = require('assert');

describe('JWT token tests', function () {
  var req = {};
  var res = {};

  it('should work if authorization header is valid jwt', function() {
    var secret = new Buffer(config.auth0.secret || '', 'base64');
    var audience = config.auth0.clientId;
    var token = jwt.sign(
      {foo: 'bar'},
      secret, {'audience': audience}
    );

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    expressjwt({
      secret: new Buffer(config.auth0.secret || '', 'base64'),
      audience: config.auth0.clientId
    })(req, res, function(err) {
      assert.equal(err, undefined);
      assert.equal('bar', req.user.foo);
    });
  });

  it('should failed if authorization header has invalid jwt', function() {
    var secret = new Buffer(config.auth0.secret || '', 'base64');
    var audience = config.auth0.clientId;
    var token = jwt.sign(
      {foo: 'bar'}, 'invalid secret'
    );

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    expressjwt({
      secret: new Buffer(config.auth0.secret || '', 'base64'),
      audience: config.auth0.clientId
    })(req, res, function(err) {
      assert.equal(err.status, 401);
      assert.equal(err.code, 'invalid_token');
      assert.equal('bar', req.user.foo);
    });
  });
});