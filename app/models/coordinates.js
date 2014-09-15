var mongoose = require('mongoose');

var CoordinateSchema = new mongoose.Schema({
	number: {type: Number, required: true},
  x: {type: Number, required: true},
  y: {type: Number, required: true},
  z: Number,
  owner: {type: String, lowercase: true},
  repo: {type: String, lowercase: true},
  timestamp: {
    type: Date,
    default: Date.now
  },
});

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

CoordinateSchema.index({owner: 1, repo: 1});

module.exports = mongoose.model('Coordinate', CoordinateSchema);
