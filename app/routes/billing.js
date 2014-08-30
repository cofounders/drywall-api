var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var prequest = require('../modules/prequest');
var config = require('../config');
var paypalApi = require('../modules/paypal');
var PayPal = new paypalApi(config.paypal[config.paypal.mode]);

function create(req, res) {
  var data = req.body;
  if (!_.has(data, 'plan') || !_.has(data, 'returnUrl') ||
      !_.has(data,'cancelUrl')) {
    return res.status(400)
      .send('Missing plan, returnUrl or cancelUrl in payload');
  }

  PayPal.setPaymentPlanOptions(data.plan, config.paymentPlans);
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

}

function update(req, res) {

}

module.exports = {
  create: create,
  execute: execute,
  update: update
};
