var frisby         = require('frisby');
var mkFrisbyGET302 = require('../helpers/frisby.js').mkFrisbyGET302;

mkFrisbyGET302(
  'set oauth token',
  'login/github&redirect_uri=example.com'
).toss();
