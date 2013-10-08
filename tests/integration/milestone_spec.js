var frisby               = require('frisby');
var mkFrisbyJSON200      = require('../helpers/frisby.js').mkFrisbyJSON200;
var isGithubMilestone    = require('../helpers/typecheck.js').isGithubMilestone;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyJSON200(
  'List of milestones for some repo',
  'milestones/someGithubRepo',
  { milestones: Array },
  { milestones: allHaveProperty(isGithubMilestone) }
).toss();
