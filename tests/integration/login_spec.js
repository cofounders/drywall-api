var frisby         = require('frisby');
var mkFrisbyGET302 = require('../helpers/frisby.js').mkFrisbyGET302;

mkFrisbyGET302('get code', {
  endpoint: 'login/github?redirect_uri=example.com&session=blah'
}).toss();

mkFrisbyGET302('persist oauth token and continue', {
  endpoint: 'login/github/redirect?redirect_uri=example.com&session=blah&code=blah'
}).toss();
