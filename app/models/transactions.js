var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
  timestamp: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
