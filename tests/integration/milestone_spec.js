var frisby               = require('frisby');
var mkFrisbyGETJSON200      = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var isGithubMilestone    = require('../helpers/typecheck.js').isGithubMilestone;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200('List of milestones for some repo', {
  endpoint: 'milestones/someGithubRepo',
  output:     { milestones: Array },
  sub_output: { milestones: allHaveProperty(isGithubMilestone) }
}).toss();
