var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var basicAuth = require('basic-auth-header');
var prequest = require('../components/prequest');
var config = require('../config');
var TransactionsModel = require('../models/transactions');
var paypalMode = config.paypal.mode;
var ppConfig = config.paypal[paypalMode];

function saveTransaction(data) {
  var transaction = new TransactionsModel({data: data});

  transaction.save(function (err) {
    if (!err) {
      console.log(data.recurring_payment_id,
        data.product_name,
        data.profile_status
      );
    } else {
      console.error('Error saving ipn transaction');
    }
  });
}

function ipnListener(req, res) {
  var data = req.body;
  console.log('Paypal IPN: ', data);
  res.send();

  data.cmd = '_notify-validate';

  prequest({
    url: ppConfig.ipnUrl,
    method: 'POST',
    body: qs.stringify(data),
    headers: {'Connection': 'close'}
  }).then(function (body) {
    console.log('Paypal response: ' + body);
    if (body === 'VERIFIED') {
      saveTransaction(data);
    }
  }).catch(function (err) {
    console.error('Error with verifying paypal ipn', ppConfig.ipnUrl, err);
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
var billingPlanUpdateAttributes = [
  {
    'op': 'replace',
    'path': '/',
    'value': {
      'state': 'ACTIVE'
    }
  }
];

function paymentHandler(req, res, next) {
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
    }).then(function (billingPlan) {
      console.log('Billing Plan: ', billingPlan);
      prequest({
        url: ppConfig.url + '/payments/billing-plans/' + billingPlan.id,
        method: 'PATCH',
        headers: {
          'Authorization': 'Bearer ' + oauth.access_token
        },
        body: billingPlanUpdateAttributes
      }).then(function (agreement) {
        console.log('Billing Agreement: ', agreement);

      }).catch(function (err) {
        err.statusCode = 500;
        err.message = 'Failed to update paypal billing plan';
        console.error(err.message, err.body);
        return next(err);
      });
    }).catch(function (err) {
      err.statusCode = 500;
      err.message = 'Failed creating a paypal billing plan';
      console.error(err.message, err.body);
      return next(err);
    });
  }).catch(function (err) {
    err.statusCode = 500;
    err.message = 'Failed getting paypal access token';
    console.error(err.message, err.body);
    return next(err);
  });
}

module.exports = {
  ipnListener: ipnListener,
  paymentHandler: paymentHandler
};