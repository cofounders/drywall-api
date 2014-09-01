var _ = require('underscore');
var AccountsModel = require('../models/accounts');
var consts = require('../modules/consts');
var config = require('../config');

function paidAccess(req, res, next) {
  if (req.github && !req.github.private) {
    return next();
  }
  var owner = req.params.owner;
  var user = req.query.user || (req.body && req.body.user);

  if (!user) {
    return res.status(400)
      .send({message: 'Github `user` required in query or payload'});
  }
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
      console.log(error.message);
      return next(error);
    } else {
      if (_.contains(account.activeUsers, user)) {
        return next(); // User already recorded as an activeUser
      }

      //TODO: Need to flush activeUsers every month
      var planDetails = _.findWhere(config.paymentPlans,
        {plan: parseInt(account.plan)}
      );

      account.activeUsers.push(user);
      account.save();
      console.log(account.activeUsers);
      if (account.activeUsers.length > planDetails.users) {
        var error1 = new Error('Max active users reached. Current plan: ' +
          planDetails);
        error1.statusCode = 402;
        console.log(error1.message);
        return next(error1);
      }

      return next();
    }
  });
}

module.exports = paidAccess;