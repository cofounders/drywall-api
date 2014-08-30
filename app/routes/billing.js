var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var prequest = require('../modules/prequest');
var paypalApi = require('../modules/paypal');
var config = require('../config');
var ppConfig = config.paypal[config.paypal.mode];
var PayPal = new paypalApi(ppConfig);

function hasMissingProperties(data, arr) {
  return arr.some(function (elem) {
    return (!_.has(data, elem));
  });
}

function create(req, res) {
  var data = req.body;
  var requiredProperties = ['plan', 'owner', 'returnUrl', 'cancelUrl'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }

  PayPal.createBillingPlan(_.pick(
    data, 'plan', 'owner', 'returnUrl', 'cancelUrl')
  ).then(function (approvalUrl) {
    console.log(approvalUrl);
    res.send({url: approvalUrl});
  }).catch(function (err) {
    console.error(err);
    res.status(500).send('Unable to create billing plan');
  });
}

function execute(req, res) {
  var data = req.query;
  console.log('/billing/execute', data);
  var requiredProperties = ['token', 'plan', 'owner', 'url'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }

  PayPal.createRecurringPayment(_.pick(
    data, 'token', 'plan',  'owner')
  ).then(function (profile) {
    //TODO: Create an account with data.user.id, data.owner, data.plan
    console.log('Recurring Payment created for ' + data.owner);
    res.redirect(data.url);
  }).catch(function (err) {
    console.error(err);
    res.status(500).send('Error: Failed to create recurring payment plan');
  });
}

function update(req, res) {

}

function abort(req, res) {
  var data = req.query;
  var requiredProperties = ['token', 'plan', 'owner', 'url'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }

  console.log(data.token, data.owner + ' aborted plan ' + data.plan);
  //TODO: Save to DB
  res.redirect(data.url);
}

module.exports = {
  create: create,
  execute: execute,
  update: update,
  abort: abort
};
