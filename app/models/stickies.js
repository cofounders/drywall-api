var mongoose = require('mongoose');

var stickiesSchema = new mongoose.Schema({
	number: Number,
  x: Number,
  y: Number,
  owner: String,
  repo: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
}, { strict: false });

stickiesSchema.methods = {

};

stickiesSchema.statics = {
  list: function () { return; },
  update: function () { return; },
  add: function () { return; },
  remove: function () {
    return;
  }
};

stickiesSchema.pre('save', function (next) {
	next();
});

module.exports = mongoose.model('Stickie', stickiesSchema);
