var mongoose = require('mongoose');

var AccountSchema = new mongoose.Schema({
  pid: {type: Number, required: true},
  owner: {type: String, required: true},
  plan: Number,
  user: String,
  lastPaid: Date,
  isPaid: {type: Boolean, default: false}
});

AccountSchema.statics.hasOwnerPaid = function(owner, cb) {
  this.find({
    owner: owner
  }, cb);
};

module.exports = mongoose.model('Account', AccountSchema);
