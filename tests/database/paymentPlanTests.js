var assert = require('chai').assert;
var mongoose = require('mongoose');
var config = require('../../app/config');
var database = require('../../app/modules/database');
var PaymentPlanModel = require('../../app/models/paymentplans');

describe('Payment Plan collection test', function() {
  before(function (done) {
    this.timeout(5000);
    if (mongoose.connection.readyState === 1) {
      return done();
    }
    database.connect(config.db.uri, function (err) {
      return err ? done() : done(err);
    });
  });

  it('should get all plans from DB', function (done) {
    this.timeout(3000);
    PaymentPlanModel.find({}, function (err, plans) {
      if (err) {
        done(err);
      } else {
        assert.isArray(plans, 'plans in the db');
        assert.lengthOf(plans, 8, '8 different plans');
        done();
      }
    });
  });
});
