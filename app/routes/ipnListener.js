var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var prequest = require('../modules/prequest');
var config = require('../config');
var TransactionsModel = require('../models/transactions');
var ppConfig = config.paypal[config.paypal.mode];

function saveTransaction(data) {
  var transaction = new TransactionsModel({data: data});

  transaction.save(function (err) {
    if (!err) {
      console.log(data.recurring_payment_id,
        data.product_name,
        data.profile_status
      );
    } else {
      console.error('Error saving IPN transaction');
    }
  });
}

function ipnListener(req, res) {
  var data = req.body;
  console.log('Paypal IPN: ', data);
  res.send();

  if (req.headers.host.indexOf('drywall') !== -1) {
    return saveTransaction(data);
  }
  data.cmd = '_notify-validate';

  prequest({
    url: ppConfig.paymentUrl,
    method: 'POST',
    body: qs.stringify(data),
    headers: {'Connection': 'close'}
  }).then(function (body) {
    console.log('Paypal IPN response: ' + body);
    if (body === 'VERIFIED') {
      saveTransaction(data);
    }
  }).catch(function (err) {
    console.error('Error verifying paypal IPN', ppConfig.paymentUrl, err);
  });
}

module.exports = ipnListener;