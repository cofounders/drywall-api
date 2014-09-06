'use strict';

var assert = require('chai').assert;
var qs = require('querystring');
var config = require('../../app/config');
var paypalApi = require('../../app/modules/paypal');
var ppConfig = config.paypal[config.paypal.mode];
var PayPal = new paypalApi(ppConfig);

describe('PayPal tests', function () {
  it('should construct the right returnUrl', function () {
    var query = qs.stringify({
      plan: 1,
      owner: 'org',
      userId: 'drywall'
    });

    var url = PayPal.constructUrl('execute', 'http://cf.sg', query);
    assert.strictEqual(url, ppConfig.internalUrl +
      '/execute?url=http://cf.sg&plan=1&owner=org&userId=drywall');
  });
});