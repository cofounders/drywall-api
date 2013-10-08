var frisby               = require('frisby');
var mkFrisbyJSON200  = require('../helpers/frisby.js').mkFrisbyJSON200;
var isGithubLabel    = require('../helpers/typecheck.js').isGithubLabel;
var allHaveProperty  = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyJSON200(
  'List of labels for some repository',
  'labels/SomeRepo',
  { labels: Array },
  { labels: allHaveProperty(isGithubLabel) }
).toss();
