var mongoose = require('mongoose');

var PaymentPlanSchema = new mongoose.Schema({
  numUsers: {type: Number, required: true},
  monthlyAmount: {type: Number, required: true},
  yearlyAmount: {type: Number, required: true},
  plan: Number,
  timestamp: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('PaymentPlan', PaymentPlanSchema);
