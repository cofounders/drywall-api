'use strict';

var assert = require('chai').assert;
var supertest = require('supertest');
var express = require('express');

var utils = require('../helpers/utils');
var mid = require('../../app/middlewares');

describe('Github Authorization tests', function () {
  var githubAccessToken = '';

  var app = express();
  app.get('/:owner/:repo',
    mid.authorize,
    function(req, res) {
      res.send(req.github || 'nothing');
    }
  );
  app.use(mid.errorHandler);
  var agent = supertest(app);

  before(function (done) {
    this.timeout(5000);
    utils.testerAccessToken().then(function (testerToken) {
      githubAccessToken = testerToken;
      done();
    }).catch(function (err) {
      console.error('Cannot get github token');
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

  it('should pass if private repo has access token', function (done) {
    this.timeout(5000);
    agent.get('/cofounders/drywall-api?access_token=' + githubAccessToken)
      //.set('Authorization', utils.bearerToken())
      .expect(200, done());
  });
});

describe('API Authorization header tests', function() {
  var app = express();
  app.get('/api', mid.authenticate,
    function(req, res) {
      res.send(req.body || 'nothing');
    }
  );
  app.use(mid.errorHandler);
  var agent = supertest(app);

  it('should fail without Auth headers', function (done) {
    this.timeout(4000);
    agent.get('/api')
      .expect(401)
      .end(function (err, res) {
        assert.equal(res.body.message, 'No Authorization header was found');
        return err ? done(err) : done();
      });
  });

  it('should pass with Auth headers', function (done) {
    this.timeout(4000);
    agent.get('/api')
      .set('Authorization', utils.bearerToken())
      .expect(200)
      .end(function (err, res) {
        return err ? done(err) : done();
      });
  });
});
