var frisby               = require('frisby');
var mkFrisbyGETJSON200      = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var isGithubOrganization = require('../helpers/typecheck.js').isGithubOrganization;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200(
  'List of organisations for user',
  'organizations',
  { organizations: Array },
  { organizations: allHaveProperty(isGithubOrganization) }
).toss();
