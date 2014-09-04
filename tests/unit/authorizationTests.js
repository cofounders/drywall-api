'use strict';

var assert = require('chai').assert;
var supertest = require('supertest');
var express = require('express');

var utils = require('../helpers/utils');
var mid = require('../../app/middlewares');

describe('Github Authorization tests', function () {
  var BEARERTOKEN = '';

  var app = express();
  app.get('/:owner/:repo',
    mid.authenticate,
    mid.authorize,
    function(req, res) {
      res.send(req.github || 'nothing');
    }
  );
  app.use(mid.errorHandler);
  var agent = supertest(app);

  before(function (done) {
    this.timeout(10000);

    utils.bearerToken().then(function (token) {
      BEARERTOKEN = token;
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('should pass if public repo has no authorization', function (done) {
    this.timeout(3000);
    agent.get('/alyssaq/egg')
      .expect(200)
      .end(function (err, res) {
        assert.ok(res.body.private === false);
        return err ? done(err) : done();
      });
  });

  it('should fail if private repo has no authorization', function (done) {
    this.timeout(3000);
    agent.get('/cofounders/drywall')
      .expect(404)
      .end(function (err, res) {
        return err ? done(err) : done();
      });
  });

  it('should fail with invalid token', function (done) {
    this.timeout(4000);
    agent.get('/cofounders/drywall')
      .set('Authorization', 'Bearer 1234')
      .expect(401)
      .end(function (err, res) {
        assert.equal(res.body.message, 'jwt malformed');
        return err ? done(err) : done();
      });
  });

  it('should pass if private repo has access token', function (done) {
    this.timeout(5000);
    agent.get('/cofounders/drywall-api')
      .set('Authorization', BEARERTOKEN)
      .expect(200)
      .end(function (err, res) {
        return err ? done(err) : done();
      });
  });
});

