'use strict';

var assert = require('assert');
var supertest = require('supertest');
var express = require('express');

var middleware = require('../../app/components/middleware');
var utils = require('../helpers/utils');

describe('No Auth header tests', function () {
  var app = express();
  app.get('/:owner/:repo', middleware.githubAuthorization, function(req, res) {
    res.send(req.github || 'nothing');
  });
  var agent = supertest(app);

  it('should pass if public repo has no Auth headers', function (done) {
    this.timeout(3000);
    agent.get('/alyssaq/egg')
      .expect(200)
      .end(function (err, res) {
        assert.ok(res.body.private === false);
        done();
      });
  });

  it('should fail if private repo has no Auth headers', function (done) {
    this.timeout(3000);
    agent.get('/cofounders/drywall-api')
      .expect(404)
      .end(function (err, res) {
        done();
      });
  });
});

describe('Auth header tests', function () {
  var githubAccessToken = '';

  var app = express();
  app.get('/:owner/:repo', middleware.githubAuthorization, function(req, res) {
    res.send(req.github || 'nothing');
  });
  var agent = supertest(app);

  beforeEach(function (done) {
    this.timeout(5000);
    utils.testerAccessToken().then(function (testerToken) {
      githubAccessToken = testerToken;
      done();
    }).catch(function(err) {
      console.error('Cannot get github token');
    });
  });

  it('should pass if private repo has Auth headers', function (done) {
    this.timeout(5000);
    agent.get('/cofounders/drywall-api?access_token=' + githubAccessToken)
      .set('Authorization', utils.bearerToken())
      .expect(200);
    done();
  });
});