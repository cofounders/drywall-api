var assert = require('chai').assert;
var config = require('../../app/config');
var database = require('../../app/components/database');
var PaymentPlanModel = require('../../app/models/paymentplans');

describe('Payment Plan Collection Test', function() {

  before(function (done) {
    this.timeout(5000);
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
        assert.lengthOf(plans, 4, '4 different plans');
        done();
      }
    });
  });
});