'use strict';

var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var supertest = require('supertest');
var express = require('express');
var assert = require('assert');
var config = require('../../app/config');
var mid = require('../../app/middlewares');

describe('JWT token tests', function () {
  var req = {};
  var res = {};
  var secret = new Buffer(config.auth0.secret || '', 'base64');
  var audience = config.auth0.clientId;

  var app = express();
  app.get('/auth',
    mid.authenticate,
    function(req, res) {
      res.send(req.github || 'nothing');
    }
  );
  app.use(mid.errorHandler);
  var agent = supertest(app);

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

  it('should fail if authorization header has invalid jwt', function() {
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

  it('should return 419 with expired token', function (done) {
    var token = jwt.sign(
      {foo: 'bar'},
      secret,
      {'audience': audience, expiresInMinutes: -1}
    );

    this.timeout(2000);
    agent.get('/auth')
      .set('Authorization', 'Bearer ' + token)
      .expect(419)
      .end(function (err, res) {
        assert.equal(res.body.message, 'jwt expired');
        return err ? done(err) : done();
      });
  });
});