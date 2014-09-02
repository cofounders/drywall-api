var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var validUrl = require('valid-url');
var Promise = require('bluebird');
var moment = require('moment');
var consts = require('../modules/consts');
var prequest = require('../modules/prequest');
var paypalApi = require('../modules/paypal');
var githubApi = require('../modules/github');
var config = require('../config');
var ppConfig = config.paypal[config.paypal.mode];
var PayPal = new paypalApi(ppConfig);
var AccountsModel = require('../models/accounts');
var findAccounts = Promise.promisify(AccountsModel.find, AccountsModel);
var findOneAccount = Promise.promisify(AccountsModel.findOne, AccountsModel);

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
    res.status(500).send(msg('Failed to create billing plan'));
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
    data.nextBillingDate = moment().add(2, 'hours').format();
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
    res.redirect(data.url + '?error=1');
  });
}


function mergeLists(paidOrgs, githubOrgs) {
  var githubDict = _.object(githubOrgs, []);

  paidOrgs.forEach(function (paidOrg) {
    if (_.has(githubDict, paidOrg.owner)) {
      delete(githubDict[paidOrg.owner]);
    }
  });

  return paidOrgs.concat(_.map(Object.keys(githubDict),
    function(org) { return {owner: org}; }
  ));
}

// List all github organisations and paid organisations for a user
//  A user may still be paying for an organisation have lost github access.
function list(req, res) {
  var data = req.query;
  data.user = req.params.user;
  var requiredProperties = ['access_token'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }

  githubApi.userOrganisations(data).then(function (githubOrgs) {
    findAccounts({
      '$or': [{
        paidBy: data.user
      },{
        owner: {'$in': githubOrgs}
      }]
    }, '-_id owner paidBy plan nextBillingDate').then(function (paidOrgs) {
      var orgs = mergeLists(paidOrgs, githubOrgs);
      console.log(orgs);
      return res.send(orgs);
    }).catch(function (err) {
      err.message = 'Error getting paid organisations for ' + data.user;
      console.error(err.message);
      res.status(500).send(err);
    });
  }).catch(function (err) {
    err.message = 'Error getting github organisations for ' + data.user;
    console.error(err.message);
    res.status(500).send(err);
  });

  // PayPal.listRecurringPayment('I-FXKU0WPKWKUL').then(function (payments) {
  //   console.log(payments);
  //   res.send(payments);
  // }).catch(function (err) {
  //   err.statusCode = 500;
  //
  // });
}

function cancel(req, res) {
  var data = req.query;
  data.user = req.params.user;
  var requiredProperties = ['owner', 'user'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send(msg('Missing payload: ' + requiredProperties.join(', ')));
  }

  findOneAccount({
    owner: data.owner,
    status: consts.active
  }).then(function (account) {
    PayPal.cancelRecurringPayment(account.paymentId).then(function (data) {
      account.status = consts.cancelled;
      account.lastModifiedBy = data.user;
      account.save();
      console.log('Recurring Payment cancelled for ' + data.owner);
      res.send(msg('Success. ' + account.paymentId + ' cancelled.'));
    }).catch(function (err) {
      return res.status(500).send(msg('Failed to cancel recurring payment'));
    });
  }).catch(function (err) {
    return res.status(500)
      .send(msg('Failed to find active account for ' + data.owner));
  });
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

module.exports = {
  create: create,
  execute: execute,
  list: list,
  cancel: cancel,
  abort: abort,
  test: {
    mergeLists: mergeLists
  }
};
