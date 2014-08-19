var mongoose = require('mongoose');

var CoordinateSchema = new mongoose.Schema({
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

CoordinateSchema.methods = {

};

CoordinateSchema.statics = {
  list: function () { return; },
  update: function () { return; },
  add: function () { return; },
  remove: function () {
    return;
  }
};

CoordinateSchema.pre('save', function (next) {
	next();
});

module.exports = mongoose.model('Coordinate', CoordinateSchema);
