'use strict';

var assert = require('chai').assert;
var supertest = require('supertest');
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var config = require('../../app/config');
var db = require('../../app/modules/database');
var utils = require('../helpers/utils');
var mid = require('../../app/middlewares');

describe('Paid Access tests', function () {
  var githubAccessToken = '';

  var app = express();
  app.get('/:owner/:repo',
    mid.authorize,
    mid.paidAccess,
    function(req, res) {
      res.send(req.github || 'nothing');
    }
  );
  app.use(mid.errorHandler);
  var agent = supertest(app);

  before(function (done) {
    this.timeout(10000);
    var connectDb = function(obj) {
      return obj;
    };
    if (mongoose.connection.readyState !== 1) {
      connectDb = Promise.promisify(db.connect, db);
    }

    Promise.props({
      db: connectDb(config.db.uri),
      testerToken: utils.testerAccessToken()
    }).then(function (results) {
      db.loadPaymentPlans(config);
      githubAccessToken = results.testerToken;
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('should pass if public repo', function (done) {
    this.timeout(3000);
    agent.get('/alyssaq/egg')
      .expect(200)
      .end(function (err, res) {
        assert.ok(res.body.private === false);
        return err ? done(err) : done();
      });
  });

  it('should return 400 without user', function (done) {
    this.timeout(5000);
    agent.get('/cofounders/drywall-api?access_token=' + githubAccessToken)
      .expect(400)
      .end(function (err, res) {
        return err ? done(err) : done();
      });
  });

  it('should return 402 if plan needs to upgrade', function (done) {
    this.timeout(5000);
    agent.get('/cofounders/drywall-api?user=drywallcfsg&access_token=' +
      githubAccessToken)
      .expect(402)
      .end(function (err, res) {
        assert.equal(res.body.message, 'Max active users reached');
        return err ? done(err) : done();
      });
  });

  it('should pass if organisation has been paid', function (done) {
    this.timeout(5000);
    agent.get('/superdrywall/egg?user=drywallcfsg&access_token=' +
      githubAccessToken)
      .expect(200)
      .end(function (err, res) {
        return err ? done(err) : done();
      });
  });
});