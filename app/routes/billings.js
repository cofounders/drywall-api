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

function update(req, res) {
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

  findOneAccount({
    owner: data.owner,
    status: consts.active
  }).then(function (account) { // find and cancel
    if (account) {
      return [account, PayPal.cancelRecurringPayment(account.paymentId)];
    }
    return [];
  }).spread(function (account) {
    //TODO: update status to upgraded or downgraded
    if (account) { // cancelled, update status
      account.status = consts.cancelled;
      account.lastModifiedBy = data.user;
      console.log('Recurring Payment cancelled for ' + data.owner);
      return account.save();
    }
  }).then(function () {
    PayPal = new paypalApi(ppConfig);
    PayPal.createBillingPlan(data).then(function (approvalUrl) {
      res.send({url: approvalUrl});
    }).catch(function (err) {
      res.status(500).send(msg('Failed to create billing plan'));
    });
  }).catch(function (err) {
    console.error(err);
    res.status(500).send(msg('Failed to update billing plan'));
  });
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

// List all billings - paid and open source organisations for a user
//  A user may still be paying but not belong to an organisation.
function list(req, res) {
  var data = req.query;
  data.user = req.params.user;
  var requiredProperties = ['access_token'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send('Missing payload: ' + requiredProperties.join(', '));
  }

  githubApi.userOrganisations(data).then(function (githubOrgs) {
    return [githubOrgs, findAccounts({'$or': [
      {paidBy: data.user}, {owner: {'$in': githubOrgs}}
    ]}, '-_id owner paidBy plan nextBillingDate')];
  }).spread(function (githubOrgs, paidOrgs) {
    var orgs = mergeLists(paidOrgs, githubOrgs);
    console.log(orgs);
    return res.send(orgs);
  }).catch(function (err) {
    err.message = 'Error getting billings for ' + data.user;
    console.error(err.message);
    return res.status(500).send(err);
  });
}

function checkAndUpdateAccount(account) {
  return function() {
    PayPal.listRecurringPayment(account.paymentId).then(function (payment) {
      if (account.status !== payment.STATUS) {
        console.error('Error! Account and PayPal status differ');
        console.error(account, payment);
      }
      if (payment.NUMCYCLESCOMPLETED > account.cyclesCompleted) {
        var newAcc = {
          _id: account._id,
          status: payment.STATUS,
          cyclesCompleted: payment.NUMCYCLESCOMPLETED,
          nextBillingDate: payment.NEXTBILLINGDATE,
          timestamp: moment().format()
        };
        return newAcc;
      }
    }).then(function (updatedAcc) {
      if (!updatedAcc) {
        return;
      }
      var id = updatedAcc._id;
      console.log('Updating', updatedAcc);
      delete(updatedAcc._id);
      var query = AccountsModel.findByIdAndUpdate(
        id, updatedAcc, function (err, d) {
        if (err) {
          console.error(err);
        }
      });
    });
  };
}

function checkAccounts(req, res) {
  findAccounts({}).then(function (accts) {
    accts.map(function (account) {
      return checkAndUpdateAccount(account);
    }).forEach(function (func) {
      func();
    });
    return res.send(msg('Accounts updated!'));
  }).catch(function (err) {
    err.message = 'Error: Failed to get all Accounts from db';
    console.error(err.message);
    return res.status(500).send(msg(err.message));
  });
}

function cancel(req, res) {
  var data = req.body;
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
    return [account, PayPal.cancelRecurringPayment(account.paymentId)];
  }).spread(function (account, paypalRes) {
    account.status = consts.cancelled;
    account.lastModifiedBy = data.user;
    account.save();
    console.log('Recurring Payment cancelled for ' + data.owner);
    res.send(msg('Success. ' + account.paymentId + ' cancelled.'));
  }).catch(function (err) {
    err.message = 'Error cancelling recurring payment' + data.user + data.owner;
    return res.status(500).send(err.message);
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
  update: update,
  create: create,
  execute: execute,
  list: list,
  cancel: cancel,
  abort: abort,
  checkAccounts: checkAccounts,
  test: {
    mergeLists: mergeLists
  }
};
