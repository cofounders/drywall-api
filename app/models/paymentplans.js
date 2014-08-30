var mongoose = require('mongoose');

var PaymentPlanSchema = new mongoose.Schema({
  plan: Number,
  users: {type: Number, required: true},
  amount: {type: Number, required: true},
  name:{type: String, required: true},
  billingPeriod: {type: String, required: true},
  timestamp: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('PaymentPlan', PaymentPlanSchema);
