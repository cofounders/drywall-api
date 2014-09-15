var _ = require('underscore');
var AccountsModel = require('../models/accounts');
var consts = require('../modules/consts');
var config = require('../config');
var dbUtils = require('../modules/dbUtils');

function errorObj(code, message, details) {
  var error = new Error(message);
  error.statusCode = code;
  console.error(error.message);
  if (details) {
    error.details = details;
  }

  return error;
}

function paidAccess(req, res, next) {
  if (req.github && req.github.private === false) {
    return next();
  }
  var owner = req.params.owner;
  var user = req.user.sub;

  AccountsModel.findOne({
    owner: dbUtils.caseinsensitiveRegex(owner),
    status: consts.active
  }, function (err, account) {
    if (err) {
      err.statusCode = 500;
      err.message = 'Error finding Account for ' + owner;
      console.error(err.message);
      return next(err);
    } else if (_.isEmpty(account)) {
      return next(errorObj(402,
        'No paid account found for ' + owner, {plan: 0}));
    } else {
      if (_.contains(account.activeUsers, user)) {
        return next();
      }

      //TODO: Need to flush activeUsers every month
      var planDetails = _.findWhere(config.paymentPlans,
        {plan: parseInt(account.plan)}
      );

      if (!planDetails) {
        return next(errorObj(500,
          'Error! Cannot find details for plan ' + account.plan));
      } else if (account.activeUsers.length >= planDetails.users) {
        console.log(planDetails, user, account.activeUsers);
        return next(errorObj(402, 'Max active users reached', planDetails));
      } else {
        account.activeUsers.push(user);
        account.save();
        return next();
      }
    }
  });
}

module.exports = paidAccess;