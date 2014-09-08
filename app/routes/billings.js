var _ = require('underscore');
var path = require('path');
var qs = require('querystring');
var validUrl = require('valid-url');
var Promise = require('bluebird');
var moment = require('moment');
var prequest = require('prequest');
var consts = require('../modules/consts');
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
  var num = parseInt(arr.plan, 10);
  if (num > 8 || num < 0) {
    results.plan = 'Plan must be between 0 and 8';
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
  data.userId = req.user.sub;
  data.githubName = req.user.nickname;

  var requiredProperties = ['plan', 'owner'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send(msg('Missing payload: ' + requiredProperties.join(', ')));
  }
  githubApi.userOrganisations(req.user).then(function (githubOrgs) {
    if (!_.contains(githubOrgs, data.owner)) {
      return res.status(403)
        .send(data.githubName + ' no longer has access to ' + data.owner);
    }
  });
  var invalidResults = invalidProperties(data);
  if (!_.isEmpty(invalidResults)) {
    return res.status(400).send(msg(invalidResults));
  }

  function cancelPayPalAccount(account) { // find and cancel
    if (account) {
      return [account, PayPal.cancelRecurringPayment(account.paymentId)];
    }
  }

  function updateDatabaseAccount(account, ppRes) {
    //TODO: update status to upgraded or downgraded
    if (account) { // cancelled, update status
      account.status = consts.cancelled;
      account.lastModifiedBy = data.userId;
      console.log('Recurring Payment cancelled for ' + data.owner);
      account.save();
    }

    if (parseInt(data.plan, 10) > consts.freePlan) {
      return PayPal.createBillingPlan(data)
        .then(function (approvalUrl) {
          res.send({url: approvalUrl});
        }, function (err) {
          res.status(500).send(msg('Failed to create billing plan'));
        });
    } else {
      return res.send(ppRes);
    }
  }

  findOneAccount({
    owner: data.owner,
    status: consts.active
  }).then(cancelPayPalAccount)
    .spread(updateDatabaseAccount)
    .catch(function (err) {
      console.error(err);
      res.status(500).send(msg('Failed to update billing plan'));
    });
}

function execute(req, res) {
  var data = req.query;
  data.nextBillingDate = moment().add(12, 'hours').utc().format();
  console.log('Execute billing for ' +
    data.userId, data.owner, data.nextBillingDate);
  var requiredProperties = ['token', 'plan', 'owner', 'userId', 'url'];
  if (hasMissingProperties(data, requiredProperties)) {
    return res.status(400)
      .send(msg('Missing payload: ' + requiredProperties.join(', ')));
  }

  PayPal.createRecurringPayment(data).then(function (profile) {
    data.paymentId = profile.PROFILEID;
    data.paidBy = data.userId;
    data.activeUsers = [data.userId];
    data.nextBillingDate = data.nextBillingDate;
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
  data.githubName = req.user.sub;

  githubApi.userOrganisations(req.user).then(function (githubOrgs) {
    return [githubOrgs, findAccounts({'$or': [
      {paidBy: data.githubName, status: consts.active},
      {owner: {'$in': githubOrgs}, status: consts.active}
    ]}, '-_id owner paidBy plan nextBillingDate')];
  }).spread(function (githubOrgs, paidOrgs) {
    var orgs = mergeLists(paidOrgs, githubOrgs);
    console.log(orgs);
    return res.send(orgs);
  }).catch(function (err) {
    err.message = 'Error getting billings for ' + data.githubName;
    console.error(err.body, err.message);
    return res.status(500).send(err);
  });
}

function checkAndUpdateAccount(account) {
  return PayPal.listRecurringPayment(account.paymentId)
    .then(function (payment) {
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
          timestamp: (new Date()).toISOString()
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
}

function checkAccounts(req, res) {
  findAccounts({status: consts.active}).then(function (accts) {
    var arr = accts.map(function (account) {
      return checkAndUpdateAccount(account);
    });
    return res.send('Billings. Checking ' + accts.length + ' active accounts');
  }).catch(function (err) {
    err.message = 'Error: Failed to get all Accounts from db';
    console.error(err.message);
    return res.status(500).send(msg(err.message));
  });
}

function abort(req, res) {
  var data = req.query;
  var requiredProperties = ['token', 'plan', 'owner', 'userId', 'url'];
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
  execute: execute,
  list: list,
  abort: abort,
  checkAccounts: checkAccounts,
  test: {
    mergeLists: mergeLists
  }
};
