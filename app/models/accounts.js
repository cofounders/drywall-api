var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
  paymentId: {type: String, required: true},
  owner: {type: String, required: true},
  plan: Number,
  paidBy: String,
  activeUsers: [String],
  status: {type: String, default: 'Active'}, //active or cancelled
  dateCreated: {type: Date, default: Date.now},
  timestamp: {type: Date, default: Date.now},
  cyclesCompleted: {type: Number, default: 0},
  nextBillingDate: Date
});

AccountSchema.statics.hasOwnerPaid = function(owner, cb) {
  this.find({
    owner: owner
  }, cb);
};

module.exports = mongoose.model('Account', AccountSchema);
