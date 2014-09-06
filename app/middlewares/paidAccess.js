var _ = require('underscore');
var AccountsModel = require('../models/accounts');
var consts = require('../modules/consts');
var config = require('../config');

function paidAccess(req, res, next) {
  if (req.github && req.github.private === false) {
    return next();
  }
  var owner = req.params.owner;
  var user = req.user.sub;

  AccountsModel.findOne({
    owner: owner,
    status: consts.active
  }, function (err, account) {
    if (err) {
      err.statusCode = 500;
      err.message = 'Error finding Account for ' + owner;
      console.error(err.message);
      return next(err);
    } else if (_.isEmpty(account)) {
      var error = new Error('No paid account found for ' + owner);
      error.statusCode = 402;
      error.details = {plan: 0};
      console.log(error.message);
      return next(error);
    } else {
      if (_.contains(account.activeUsers, user)) {
        return next();
      }

      //TODO: Need to flush activeUsers every month
      var planDetails = _.findWhere(config.paymentPlans,
        {plan: parseInt(account.plan)}
      );

      if (planDetails &&
        account.activeUsers.length >= planDetails.users) {
        var error1 = new Error('Max active users reached');
        error1.details = planDetails;
        error1.statusCode = 402;
        console.log(error1.message, error1.details, user, account.activeUsers);
        return next(error1);
      } else {
        account.activeUsers.push(user);
        account.save();
        return next();
      }
    }
  });
}

module.exports = paidAccess;