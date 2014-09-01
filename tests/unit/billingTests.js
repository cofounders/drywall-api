'use strict';

var assert = require('chai').assert;
var supertest = require('supertest');
var express = require('express');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var _ = require('underscore');
var config = require('../../app/config');
var billing = require('../../app/routes/billing');
var utils = require('../helpers/utils');
var mid = require('../../app/middlewares');
var db = require('../../app/modules/database');

describe('Billing tests', function () {
  var githubAccessToken = '';

  var app = express();
  app.get('/:user/list', billing.list);
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
      githubAccessToken = results.testerToken;
      done();
    }).catch(function (err) {
      done(err);
    });
  });

  it('should list paid organisations for authorized user', function (done) {
    this.timeout(10000);
    agent.get('/drywallcfsg/list?access_token=' + githubAccessToken)
      .expect(200)
      .end(function (err, res) {
        assert.ok(res.body.length > 0);
        assert.isArray(res.body, 'list of billed organisations');
        return err ? done(err) : done();
      });
  });
});

describe('Billing Function tests', function() {
  it('should correctly merge github and paid Organisations', function () {
    var githubOrgs = ['cofounders', 'supernew', 'happycamper'];
    var paidOrgs = [{owner: 'cofounders', paidBy: 'drywall', plan: 1},
    {owner: 'strawberry', paidBy: 'farmer', plan: 2}];
    var orgs = billing.test.mergeLists(paidOrgs, githubOrgs);
    assert.isArray(orgs);
    assert.lengthOf(orgs, 4);
    assert.sameMembers(_.pluck(orgs, 'owner'),
      ['cofounders', 'strawberry', 'supernew', 'happycamper'],
      'list of organisations');
    assert.isUndefined(_.findWhere(orgs, {owner: 'supernew'}).plan,
      'no plan for unpaid organisation');
    assert.isDefined(_.findWhere(orgs, {owner: 'cofounders'}).plan,
      'has plan for paid organisation');
  });
});