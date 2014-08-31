var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var validUrl = require('valid-url');
var prequest = require('../modules/prequest');
var paypalApi = require('../modules/paypal');
var config = require('../config');
var ppConfig = config.paypal[config.paypal.mode];
var PayPal = new paypalApi(ppConfig);
var AccountsModel = require('../models/accounts');

function createAccount(data) {
  var account = new AccountsModel(data);
  account.save(function (err) {
    if (!err) {
      console.log('Account created for ' + data.user);
    } else {
      console.error(err.errors);
    }
  });
}

function hasMissingProperties(data, arr) {
  return arr.some(function (elem) {
    return (!_.has(data, elem));
  });
}

function invalidProperties(arr) {
  var results = {};
  if (arr.plan) {
    var num = parseInt(arr.plan);
    if (num > 8 || num < 1) {
      results.plan = 'plan must be between 1 and 8';
    }
  }
  if (arr.returnUrl && !validUrl.isUri(arr.returnUrl)) {
    results.returnUrl = 'Invalid url';
  }
  if (arr.cancelUrl && !validUrl.isUri(arr.cancelUrl)) {
    results.cancelUrl = 'Invalid url';
  }
  return results;
}

function msg(str) {
  return {message: str};
}

//TODO: Check that an owner has already been paid
function create(req, res) {
  var data = req.body;
  data.user = req.params.user;

  var requiredProperties = ['plan', 'owner', 'returnUrl', 'cancelUrl'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send(msg('Missing payload: ' + requiredProperties.join(', ')));
  }
  var invalidResults = invalidProperties(data);
  if (!_.isEmpty(invalidResults)) {
    return res.status(400).send(msg(invalidResults));
  }
  PayPal.createBillingPlan(data).then(function (approvalUrl) {
    console.log(approvalUrl);
    res.send({url: approvalUrl});
  }).catch(function (err) {
    console.error(err);
    res.status(500).send(msg('Unable to create billing plan'));
  });
}

function execute(req, res) {
  var data = req.query;
  data.user = req.params.user;
  console.log('Execute billing for ' + data.user, data.owner);
  var requiredProperties = ['token', 'plan', 'owner', 'user', 'url'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send(msg('Missing payload: ' + requiredProperties.join(', ')));
  }

  PayPal.createRecurringPayment(data).then(function (profile) {
    data.paymentId = profile.PROFILEID;
    data.paidBy = data.user;
    data.activeUsers = [data.user];
    var account = new AccountsModel(data);
    account.save(function (err) {
      if (!err) {
        console.log('Recurring Payment created: ', data);
      } else {
        console.error('Error saving Account to DB: ', err);
      }
    });

    res.redirect(data.url);
  }).catch(function (err) {
    console.error(err);
    res.redirect(data.url + '?error=1');
  });
}

function update(req, res) {

}

function abort(req, res) {
  var data = req.query;
  data.user = req.params.user;
  var requiredProperties = ['token', 'plan', 'owner', 'user', 'url'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }

  console.log(data.token, data.owner + ' aborted plan ' + data.plan);
  //TODO: Save to DB
  res.redirect(data.url);
}

function list(req, res) {
  var data = req.query;
  data.user = req.params.user;
  var requiredProperties = ['access_token'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }
  // TODO: return list of users' paid org and orgs user has access to
  // Do a github call to check list of orgs
  return res.send([]);

  // PayPal.listRecurringPayment('I-FXKU0WPKWKUL').then(function (payments) {
  //   console.log(payments);
  //   res.send(payments);
  // }).catch(function (err) {
  //   err.statusCode = 500;
  //   res.status(500).send(msg('Unable to list payments for ' + data.user));
  // });
}

module.exports = {
  create: create,
  execute: execute,
  update: update,
  abort: abort,
  list: list
};
