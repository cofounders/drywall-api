var mongoose = require('mongoose');

var BillingSchema = new mongoose.Schema({
  pid: {type: Number, required: true},
  owner: {type: String, required: true},
  user: String,
  lastPaid: Date,
  isPaid: {type: Boolean, default: false}
});

module.exports = mongoose.model('Billing', BillingSchema);
