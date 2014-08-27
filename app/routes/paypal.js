var _ = require('underscore');
var prequest = require('../components/prequest');
var path = require('path');
var qs = require('querystring');

function ipnHandler(req, res) {
  console.log('Paypal POST: ',  req.query, req.params, req.body);
  res.send();

  req.query.cmd = '_notify-validate';
  var data = qs.stringify(req.query);
  console.log('paypal data: ' + data);

  var url = 'http://';
  if (process.env.USE_REAL_PAYPAL) {
    url += 'paypal.com';
  } else {
    url += 'sandbox.paypal.com';
  }

  prequest({
    url: url + '/cgi-bin/webscr',
    method: 'POST',
    data: data
  }).then(function (body) {
    console.log('Paypal response: ' + body);
  }).catch(function (err) {
    console.error('Error with paypal ipn', err);
  });
}

module.exports = {
  ipnHandler: ipnHandler
};