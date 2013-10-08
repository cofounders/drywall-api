var frisby               = require('frisby');
var mkFrisbyJSON200      = require('../helpers/frisby.js').mkFrisbyJSON200;
var isGithubOrganization = require('../helpers/typecheck.js').isGithubOrganization;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyJSON200(
  'List of organisations for user',
  'organizations',
  { organizations: Array },
  { organizations: allHaveProperty(isGithubOrganization) }
).toss();
