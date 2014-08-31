var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
  paymentId: {type: Number, required: true},
  owner: {type: String, required: true},
  plan: Number,
  paidBy: String,
  lastPaid: Date,
  activeUsers: [String],
  status: {type: String, default: 'Active'}, //active or cancelled
  dateCreated: {type: Date, default: Date.now},
  timestamp: {type: Date, default: Date.now},
  cyclesCompleted: Number
});

AccountSchema.statics.hasOwnerPaid = function(owner, cb) {
  this.find({
    owner: owner
  }, cb);
};

module.exports = mongoose.model('Account', AccountSchema);
