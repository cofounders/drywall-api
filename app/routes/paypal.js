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

function paymentHandler(req, res, next) {
  var ppConfig = config.paypal[paypalMode];
  prequest({
    url: ppConfig.url + '/oauth2/token',
    headers: {
      'Authorization': basicAuth(ppConfig.clientId, ppConfig.secret)
    },
    body: 'grant_type=client_credentials'
  }).then(function (data) {
    console.log(data);
  }).catch(function (err) {
    console.error(err);
  });
}

module.exports = {
  ipnHandler: ipnHandler,
  paymentHandler: paymentHandler
};