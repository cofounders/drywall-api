var prequest = require('../../app/modules/prequest');
var qs = require('querystring');
var moment = require('moment');
var stringFormat = require('string-format');
var _ = require('underscore');
var Promise = require('bluebird');
var config = require('../config');

/*
 * Class to create/update a recurring billing plan
 *  with PayPal's NVP API.
*/
function PayPal(options) {
  this.options = _.extend({}, options);
  this.credQuery = qs.stringify({
    user: this.options.user,
    pwd: this.options.password,
    signature: this.options.signature
  }) + '&';

  Object.defineProperty(this.options, 'planName', {
    get: function() {
      return 'Drywall {0}ly {1} Plan'.format(
        this.billingPeriod, this.name);
    }
  });
}

PayPal.prototype.paymentPlanOptions = function(planId) {
  return _.findWhere(config.paymentPlans,
    {plan: parseInt(planId)}
  );
};

PayPal.prototype.createBillingPlan = function(data) {
  var that = this;
  var planOpts = this.paymentPlanOptions(data.plan);
  var options = _.extend(this.options, planOpts);

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        METHOD: 'SetExpressCheckout',
        RETURNURL: data.returnUrl + '/?plan=' + data.plan,
        CANCELURL: data.cancelUrl,
        version: '104.0',
        PAYMENTREQUEST_0_AMT: options.amount,
        PAYMENTREQUEST_0_CURRENCYCODE: 'USD',
        PAYMENTREQUEST_0_PAYMENTACTION: 'Sale',
        L_PAYMENTREQUEST_0_NAME0: options.planName,
        L_PAYMENTREQUEST_0_AMT0: options.amount,
        L_PAYMENTREQUEST_0_DESC0: options.users + ' active users',
        L_BILLINGAGREEMENTDESCRIPTION0: options.planName,
        L_BILLINGTYPE0: 'RecurringPayments',
        REQCONFIRMSHIPPING: 0,
        NOSHIPPING: 1,
        ADDROVERRIDE: 0,
        BRANDNAME: 'drywall.cf.sg',
        LOGOIMG: 'http://img4.wikia.nocookie.net/__cb20131205162124/' +
        'elysiantail/images/3/3d/Tasty_Cupcake.png'
      })
    }).then(function (data) {
      data = qs.parse(data);

      if (data.ACK === 'Success') {
        resolve(options.paymentUrl +
          '?cmd=_express-checkout&token=' + data.TOKEN);
      } else {
        console.error('Error SetExpressCheckout failed', data);
        reject(JSON.stringify(data));
      }
    }).catch(function (err) {
      console.error('Error sending SetExpressCheckout', err);
      reject(err);
    });
  });
};

PayPal.prototype.createRecurringPayment = function(data) {
  var that = this;
  var planOpts = this.paymentPlanOptions(data.plan);
  var options = _.extend(this.options, planOpts);

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        TOKEN: data.token,
        METHOD: 'CreateRecurringPaymentsProfile',
        AMT: options.amount,
        BILLINGPERIOD: options.billingPeriod,
        BILLINGFREQUENCY: 1,
        CURRENCYCODE: 'USD',
        PROFILESTARTDATE: moment().add(2, 'hours').format(),
        VERSION: '104.0',
        DESC: options.planName,
        MAXFAILEDPAYMENTS: 1,
        AUTOBILLOUTAMT: 'AddToNextBilling'
      })
    }).then(function (data) {
      data = qs.parse(data);

      if (data.ACK === 'Success') {
        resolve(data);
      } else {
        console.error('Error CreateRecurringPaymentsProfile failed', data);
        reject(JSON.stringify(data));
      }
    }).catch(function (err) {
      console.error('Error creating recurring payment profile');
      reject(err);
    });
  });
};

PayPal.prototype.updateRecurringPayment = function(paymentId, action) {
  var that = this;
  var options = this.options;
  action = action || 'Reactivate';

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        METHOD: 'ManageRecurringPaymentsProfileStatus',
        PROFILEID: paymentId,
        ACTION: action, //'suspend', 'reactivate', 'cancel'
        VERSION: '104.0'
      })
    }).then(function (data) {
      data = qs.parse(data);

      if (data.ACK === 'Success') {
        resolve(data);
      } else {
        console.error('Error ManageRecurringPaymentsProfile failed', data);
        reject(JSON.stringify(data));
      }
    }).catch(function (err) {
      console.error('Error suspending payment id: ' + paymentId);
      reject(err);
    });
  });
};

module.exports = PayPal;