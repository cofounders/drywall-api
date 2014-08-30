var prequest = require('../../app/modules/prequest');
var qs = require('querystring');
var moment = require('moment');
var stringFormat = require('string-format');
var _ = require('underscore');
var Promise = require('bluebird');

/*
 * Class to create/update a recurring billing plan
 *  with PayPal's NVP API.
*/
function PayPal(options) {
  this.options = options;
  Object.defineProperty(this.options, 'planName', {
    get: function() {
      return 'Drywall {0}ly {1} Plan'.format(
        this.billingPeriod, this.name);
    }
  });
}

PayPal.prototype.setPaymentPlanOptions = function(planId, planArr) {
  var planOptions = _.findWhere(planArr, {plan: parseInt(planId)});
  _.extend(this.options, planOptions);
};

PayPal.prototype.createBillingPlan = function(options) {
  options = _.extend(this.options, options);

  return new Promise(function (resolve, reject) {
    prequest(options.nvpApiUrl, {
      method: 'POST',
      body: qs.stringify({
        method: 'SetExpressCheckout',
        user: options.user,
        pwd: options.password,
        signature: options.signature,
        RETURNURL: options.returnUrl + '/?plan=' + options.plan,
        CANCELURL: options.cancelUrl,
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

PayPal.prototype.createRecurringPayment = function(token) {
  var options = this.options;
  console.log(options);
  prequest(options.nvpApiUrl, {
    method: 'POST',
    body: qs.stringify({
      token: token,
      method: 'CreateRecurringPaymentsProfile',
      AMT: options.amount,
      CURRENCYCODE: 'USD',
      PROFILESTARTDATE: moment().add(2, 'hours').format(),
      BILLINGFREQUENCY: 1,
      BILLINGPERIOD: options.billingPeriod,
      DESC: options.planName,
      VERSION: '104.0',
      user: options.user,
      pwd: options.password,
      signature: options.signature,
      MAXFAILEDPAYMENTS: 1,
      AUTOBILLOUTAMT: 'AddToNextBilling'
    })
  }).then(function (data) {
    data = qs.parse(data);
    console.log(data);
  }).catch(function (err) {
    console.error('Error creating recurring payment profile');
  });
};

PayPal.prototype.updateRecurringPayment = function(paymentId, action) {
  var options = this.options;
  action = action || 'Reactivate';

  prequest(options.nvpApiUrl, {
    method: 'POST',
    body: qs.stringify({
      METHOD: 'ManageRecurringPaymentsProfileStatus',
      PROFILEID: paymentId,
      ACTION: action, //'suspend', 'reactivate', 'cancel'
      VERSION: '104.0',
      user: options.user,
      pwd: options.password,
      signature: options.signature
    })
  }).then(function (data) {
    data = qs.parse(data);
    console.log(data);
  }).catch(function (err) {
    console.error('Error suspending payment id: ' + paymentId);
  });
};

module.exports = PayPal;