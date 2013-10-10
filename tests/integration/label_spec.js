var frisby             = require('frisby');
var mkFrisbyGETJSON200 = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var isGithubLabel      = require('../helpers/typecheck.js').isGithubLabel;
var allHaveProperty    = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200('List of labels for some repository', {
  endpoint: 'labels/SomeRepo',
  output:     { labels: Array },
  sub_output: { labels: allHaveProperty(isGithubLabel) }
}).toss();
