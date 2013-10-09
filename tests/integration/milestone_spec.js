var frisby               = require('frisby');
var mkFrisbyGETJSON200      = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var isGithubMilestone    = require('../helpers/typecheck.js').isGithubMilestone;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200(
  'List of milestones for some repo',
  'milestones/someGithubRepo',
  { milestones: Array },
  { milestones: allHaveProperty(isGithubMilestone) }
).toss();
