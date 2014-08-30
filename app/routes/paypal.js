var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var basicAuth = require('basic-auth-header');
var prequest = require('../components/prequest');
var config = require('../config');
var TransactionsModel = require('../models/transactions');
var paypalMode = config.paypal.mode;

function ipnHandler(req, res) {
  console.log('Paypal IPN: ', req.body);
  res.send();
  res.end();

  var data = qs.parse(req.body);
  data.cmd = '_notify-validate';

  // read the IPN message sent from PayPal and prepend 'cmd=_notify-validate'
  var postreq = 'cmd=_notify-validate';
  for (var key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      var value = qs.escape(req.body[key]);
      postreq = postreq + '&' + key + '=' + value;
    }
  }

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
    body: qs.stringify(data),
    headers: {'Connection': 'close'}
  }).then(function (body) {
    console.log('Paypal response: ' + body, data);
    if (body === 'VERIFIED') {
      var transaction = new TransactionsModel(data);
      transaction.save(function (err) {
        if (!err) {
          console.log(data.recurring_payment_id,
            data.product_name,
            data.profile_status
          );
          return res.send();
        } else {
          console.error(err.errors);
          return res.status(400)
             .send('Error saving ipn transaction');
        }
      });
    }
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
  ipnHandler: ipnHandler,
  paymentHandler: paymentHandler
};