var mongoose = require('mongoose');
var PaymentPlansModel = require('../models/paymentplans');
var Promise = require('bluebird');
var options = {
  keepAlive: 1,
  connectTimeoutMS: 30000
};

function connect(dbUrl, cb) {
  mongoose.connect(dbUrl, options, function (err) {
    if (err) {
      console.warn('mongo connection error:', err);
      cb(err);
    } else {
      console.log('MongoDB connected');
      cb(null);
    }
  });
}

function loadPaymentPlans() {
  return new Promise(function (resolve, reject) {
    PaymentPlansModel
      .find({})
      .select('-timestamp -_id')
      .exec(function (err, plans) {
        if (err) {
          console.error('Error loading payment plans');
          reject(err);
        } else {
          console.log('Loaded ' + plans.length + ' payment plans');
          resolve(plans);
        }
      });
  });
}

module.exports = {
  connect: connect,
  loadPaymentPlans: loadPaymentPlans
};
