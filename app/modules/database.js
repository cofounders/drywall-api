var mongoose = require('mongoose');
var PaymentPlansModel = require('../models/paymentplans');

function log() {
  console.log.apply(this, Array.prototype.slice.call(arguments));
}

function connect(dbUrl, cb) {
  mongoose.connect(dbUrl);

  mongoose.connection.on('error', function (err) {
    log('mongo connection error:', err);
    mongoose.disconnect();
    cb(err);
  });

  mongoose.connection.on('open', function () {
    log('mongo connection opened at:', dbUrl);
    cb(null);
  });
}

function loadPaymentPlans(config) {
  PaymentPlansModel
    .find({})
    .select('-timestamp -_id')
    .exec(function (err, plans) {
      if (err) {
        console.error('Error loading payment plans');
        throw err;
      } else {
        console.log('Loaded ' + plans.length + ' payment plans');
        config.paymentPlans = plans;
      }
    }
  );
}

module.exports = {
  connect: connect,
  loadPaymentPlans: loadPaymentPlans
};
