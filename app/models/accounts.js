var mongoose = require('mongoose');
var consts = require('../modules/consts');

var AccountSchema = new mongoose.Schema({
  paymentId: {type: String, required: true, unique: true},
  owner: {type: String, required: true},
  plan: Number,
  paidBy: String,
  lastModifiedBy: String,
  activeUsers: [String],
  status: {type: String, default: consts.active},
  dateCreated: {type: Date, default: Date.now},
  timestamp: {type: Date, default: Date.now},
  cyclesCompleted: {type: Number, default: 0},
  nextBillingDate: Date
});

AccountSchema.index({owner: 1, status: 1});

module.exports = mongoose.model('Account', AccountSchema);
