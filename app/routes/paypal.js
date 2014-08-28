var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var paypal = require('paypal-rest-sdk');
var basicAuth = require('basic-auth-header');
var prequest = require('../components/prequest');
var config = require('../config');
var paypalMode = config.paypal.mode;

paypal.configure({
  mode: paypalMode,
  client_id: config.paypal[paypalMode].clientId,
  client_secret: config.paypal[paypalMode].secret
});

function ipnHandler(req, res) {
  console.log('Paypal POST: ', req, res);
  res.send();

  req.query.cmd = '_notify-validate';
  var data = qs.stringify(req.query);
  console.log('paypal data: ' + data);

  var url = 'https://www.';
  if (process.env.USE_REAL_PAYPAL) {
    url += 'paypal.com';
  } else {
    url += 'sandbox.paypal.com';
  }

  prequest({
    url: url + '/cgi-bin/webscr',
    method: 'POST',
    body: data
  }).then(function (body) {
    console.log('Paypal response: ' + body);
  }).catch(function (err) {
    console.error('Error with paypal ipn', err);
  });
}

function billingPlanAttributes() {
  return {
    'name': 'Drywall Monthly Billing Plan',
    'description': 'Drywall Billing Plan Template',
    'type': 'INFINITE',
    'merchant_preferences': {
      'auto_bill_amount': 'YES',
      'return_url': 'http://drywall-web-staging.herokuapp.com',
      'cancel_url': 'http://drywall-web-staging.herokuapp.com/404'
    },
    'payment_definitions': [
      {
        'amount': {
          'currency': 'USD',
          'value': '18'
        },
        'cycles': '0',
        'frequency': 'MONTH',
        'frequency_interval': '1',
        'name': 'Monthly 3 users',
        'type': 'REGULAR'
      }
    ]
  };
}

function paymentHandler(req, res, next) {
  var ppConfig = config.paypal[paypalMode];

  prequest({
    url: ppConfig.url + '/oauth2/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': basicAuth(ppConfig.clientId, ppConfig.secret)
    },
    body: 'grant_type=client_credentials'
  }).then(function (oauth) {
    console.log(oauth.access_token);
    prequest({
      url: ppConfig.url + '/payments/billing-plans',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + oauth.access_token
      },
      body: billingPlanAttributes()
    }).then(function (planRes) {
      console.log(planRes);
    }).catch(function (err) {
      err.statusCode = 500;
      err.message = 'Failed creating a paypal billing plan';
      console.error(err.body);
      return next(err);
    });
  }).catch(function (err) {
    err.statusCode = 500;
    err.message = 'Failed getting paypal access token';
    console.error(err.body);
    return next(err);
  });
}

module.exports = {
  ipnHandler: ipnHandler,
  paymentHandler: paymentHandler
};