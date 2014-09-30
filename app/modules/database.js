var mongoose = require('mongoose');
var PaymentPlansModel = require('../models/paymentplans');
var Promise = require('bluebird');
var retryNum = 1;
var maxRetries = 3;
var options = {
  server: {
    socketOptions: {keepAlive: 1}
  }
};

function connect(dbUrl, cb) {
  mongoose.connect(dbUrl, options, function (err) {
    if (err) {
      console.warn('mongo connection error - retry ' + retryNum + ':', err);
      if (retryNum < maxRetries) {
        retryNum = retryNum + 1;
        setTimeout(function() {
          connect(dbUrl, cb);
        }, 5000);
      } else {
        cb(err);
      }
    } else {
      retryNum = 1;
      console.log('mongo connection opened at:', dbUrl);
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
