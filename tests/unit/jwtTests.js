'use strict';

var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var assert = require('assert');
var config = require('../../app/config');

describe('JWT token tests', function () {
  var req = {};
  var res = {};
  var secret = new Buffer(config.auth0.secret || '', 'base64');
  var audience = config.auth0.clientId;

  it('should work if authorization header is valid jwt', function() {
    var token = jwt.sign(
      {foo: 'bar'},
      secret, {'audience': audience}
    );

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    expressjwt({
      secret: secret,
      audience: audience
    })(req, res, function(err) {
      assert.equal(err, undefined);
      assert.equal('bar', req.user.foo);
    });
  });

  it('should failed if authorization header has invalid jwt', function() {
    var token = jwt.sign(
      {foo: 'bar'}, 'invalid secret'
    );

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    expressjwt({
      secret: secret,
      audience: audience
    })(req, res, function(err) {
      assert.equal(err.status, 401);
      assert.equal(err.code, 'invalid_token');
      assert.equal('bar', req.user.foo);
    });
  });
});