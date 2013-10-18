var path      = require('path');
var requirejs = require('requirejs').config({
  baseUrl: path.join(__dirname, '../../')
});

var setupHasRun = true;
