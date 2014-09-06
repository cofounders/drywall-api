var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var prequest = require('../modules/prequest');
var config = require('../config');
var TransactionsModel = require('../models/transactions');
var ppConfig = config.paypal[config.paypal.mode];
var AccountsModel = require('../models/accounts');
var consts = require('../modules/consts');

function updateAccountStatus(data) {
  AccountsModel.findOne({
    paymentId: data.recurring_payment_id,
    status: consts.active
  }, function (err, account) {
    if (!err && account && account.status !== data.profile_status) {
      account.status = data.profile_status;
      account.save();
      console.log('WARNING! ', account.owner,
        account.user + ' may have cancelled via PayPal');
    }
  });
}

function saveTransaction(data) {
  var transaction = new TransactionsModel({data: data});

  transaction.save(function (err) {
    if (!err) {
      console.log('Paypal IPN saved: ',
        data.recurring_payment_id,
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
      if (data.profile_status === consts.cancelled) {
        updateAccountStatus(data);
      }
    }
  }).catch(function (err) {
    console.error('Error verifying paypal IPN', ppConfig.paymentUrl, err);
  });
}

module.exports = ipnListener;