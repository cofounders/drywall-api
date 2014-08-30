var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Transaction', TransactionSchema);
