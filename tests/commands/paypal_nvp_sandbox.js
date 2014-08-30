var config = require('../../app/config');
var prequest = require('../../app/components/prequest');
var mode = config.paypal.mode;
var paypalConfig = config.paypal[mode];
var qs = require('querystring');
var moment = require('moment');
var stringFormat = require('string-format');

function createBillingPlan(options) {
  prequest(paypalConfig.nvpApiUrl, {
    method: 'POST',
    body: qs.stringify({
      method: 'SetExpressCheckout',
      user: paypalConfig.user,
      pwd: paypalConfig.password,
      signature: paypalConfig.signature,
      RETURNURL: 'http://staging.drywall.cf.sg',
      CANCELURL: 'http://staging.drywall.cf.sg/404',
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
      LOGOIMG: 'http://img4.wikia.nocookie.net/__cb20131205162124/' +
      'elysiantail/images/3/3d/Tasty_Cupcake.png'
    })
  }).then(function (data) {
    data = qs.parse(data);
    if (data.ACK === 'Success') {
      console.log('https://www.sandbox.paypal.com/cgi-bin' +
        '/webscr?cmd=_express-checkout&token=' + data.TOKEN);
    } else {
      console.error('Error SetExpressCheckout failed', data);
    }
  }).catch(function (err) {
    console.error('Error sending SetExpressCheckout', err);
  });
}

function createPaymentProfile(token, options) {
  prequest(paypalConfig.nvpApiUrl, {
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
      user: paypalConfig.user,
      pwd: paypalConfig.password,
      signature: paypalConfig.signature,
      MAXFAILEDPAYMENTS: 1,
      AUTOBILLOUTAMT: 'AddToNextBilling'
    })
  }).then(function (data) {
    data = qs.parse(data);
    console.log(data);
  }).catch(function (err) {
    console.error('Error creating recurring payment profile');
  });
}

function cancelRecurringPayment(paymentId) {
  prequest(paypalConfig.nvpApiUrl, {
    method: 'POST',
    body: qs.stringify({
      METHOD: 'ManageRecurringPaymentsProfileStatus',
      PROFILEID: paymentId,
      ACTION: 'Suspend',
      VERSION: '104.0',
      user: paypalConfig.user,
      pwd: paypalConfig.password,
      signature: paypalConfig.signature
    })
  }).then(function (data) {
    data = qs.parse(data);
    console.log(data);
  }).catch(function (err) {
    console.error('Error suspending payment id: ' + paymentId);
  });
}

var options = {
  name: 'Micro',
  users: 3,
  amount: 18,
  billingPeriod: 'Month'
};
options.planName = 'Drywall {0}ly {1} Plan'.format(
  options.billingPeriod, options.name);

if (process.argv[2] === '1') {
  createBillingPlan(options);
} else if (process.argv[2] === '2') {
  createPaymentProfile(process.argv[3], options);
} else if (process.argv[2] === '3') {
  cancelRecurringPayment(process.argv[3], options);
}