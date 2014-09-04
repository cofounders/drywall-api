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
  this.options = options;
  this.credQuery = qs.stringify({
    user: this.options.user,
    pwd: this.options.password,
    signature: this.options.signature,
    version: '104.0'
  }) + '&';
}

PayPal.prototype.planName = function(planOpts) {
  return 'Drywall {0}ly {1} Plan'.format(
    planOpts.billingPeriod, planOpts.name);
};

PayPal.prototype.paymentPlanOptions = function(planId) {
  return _.findWhere(config.paymentPlans,
    {plan: parseInt(planId)}
  );
};

PayPal.prototype.createBillingPlan = function(data) {
  var that = this;
  var options = this.options;
  var planOpts = this.paymentPlanOptions(data.plan);
  planOpts.planName = this.planName(planOpts);

  return new Promise(function (resolve, reject) {
    var query = qs.stringify({
      plan: data.plan,
      owner: data.owner
    });
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        METHOD: 'SetExpressCheckout',
        RETURNURL: '{0}/{1}/execute?url={2}&{3}'.format(
          options.internalUrl, data.user, data.returnUrl, query),
        CANCELURL: '{0}/{1}/abort?url={2}&{3}'.format(
          options.internalUrl, data.user, data.cancelUrl, query),
        PAYMENTREQUEST_0_AMT: planOpts.amount,
        PAYMENTREQUEST_0_CURRENCYCODE: 'USD',
        PAYMENTREQUEST_0_PAYMENTACTION: 'Sale',
        L_PAYMENTREQUEST_0_NAME0: planOpts.planName,
        L_PAYMENTREQUEST_0_AMT0: planOpts.amount,
        L_PAYMENTREQUEST_0_DESC0: planOpts.users + ' active users',
        L_BILLINGAGREEMENTDESCRIPTION0: planOpts.planName,
        L_BILLINGTYPE0: 'RecurringPayments',
        REQCONFIRMSHIPPING: 0,
        NOSHIPPING: 1,
        ADDROVERRIDE: 0,
        BRANDNAME: 'Drywall',
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
  var options = this.options;
  var planOpts = this.paymentPlanOptions(data.plan);
  planOpts.planName = this.planName(planOpts);

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        TOKEN: data.token,
        METHOD: 'CreateRecurringPaymentsProfile',
        AMT: planOpts.amount,
        BILLINGPERIOD: planOpts.billingPeriod,
        BILLINGFREQUENCY: 1,
        CURRENCYCODE: 'USD',
        PROFILESTARTDATE: moment().add(3, 'hours').format(),
        DESC: planOpts.planName,
        MAXFAILEDPAYMENTS: 0,
        AUTOBILLOUTAMT: 'NoAutoBill'
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

PayPal.prototype.cancelRecurringPayment = function(paymentId) {
  var that = this;
  var options = this.options;

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        METHOD: 'ManageRecurringPaymentsProfileStatus',
        PROFILEID: paymentId,
        ACTION: 'cancel' //'suspend', 'reactivate', 'cancel'
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
      console.error('Error cancelling payment id: ' + paymentId);
      reject(err);
    });
  });
};

PayPal.prototype.listRecurringPayment = function(paymentId) {
  var that = this;
  var options = this.options;

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: that.credQuery + qs.stringify({
        METHOD: 'GetRecurringPaymentsProfileDetails',
        PROFILEID: paymentId
      })
    }).then(function (data) {
      data = qs.parse(data);

      if (data.ACK === 'Success') {
        resolve(data);
      } else {
        console.error('Error getRecurringPaymentProfile failed', data);
        reject(JSON.stringify(data));
      }
    }).catch(function (err) {
      console.error('Error getting payment id: ' + paymentId);
      reject(err);
    });
  });
};

module.exports = PayPal;