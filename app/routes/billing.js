var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var prequest = require('../modules/prequest');
var paypalApi = require('../modules/paypal');
var config = require('../config');
var ppConfig = config.paypal[config.paypal.mode];
var PayPal = new paypalApi(ppConfig);

function create(req, res) {
  var data = req.body;
  if (!_.has(data, 'plan') || !_.has(data, 'returnUrl') ||
      !_.has(data,'cancelUrl')) {
    return res.status(400)
      .send('Missing `plan`, `returnUrl` or `cancelUrl` in payload');
  }

  PayPal.createBillingPlan(_.pick(
    data, 'plan', 'returnUrl', 'cancelUrl')
  ).then(function (approvalUrl) {
    console.log(approvalUrl);
    res.send({url: approvalUrl});
  }).catch(function (err) {
    console.error(err);
    res.status(500).send('Unable to create billing plan');
  });
}

function execute(req, res) {
  var data = req.body;
  if (!_.has(data, 'token') || !_.has(data, 'owner') ||
      !_.has(data, 'plan')) {
    return res.status(400)
      .send('Missing `token`, `plan` or `owner` in payload');
  }

  PayPal.createRecurringPayment(_.pick(
    data, 'plan', 'token', 'owner')
  ).then(function (profile) {
    //TODO: Create an account with data.user.id, data.owner
    console.log('Recurring Payment created for ' + data.owner);
    res.send(profile);
  }).catch(function (err) {
    console.error(err);
    res.status(500).send('Error: Failed to create recurring payment plan');
  });
}

function update(req, res) {

}

module.exports = {
  create: create,
  execute: execute,
  update: update
};
