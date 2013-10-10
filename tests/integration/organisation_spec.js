var frisby               = require('frisby');
var mkFrisbyGETJSON200      = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var isGithubOrganization = require('../helpers/typecheck.js').isGithubOrganization;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200('List of organisations for user', {
  endpoint: 'organizations',
  output:     { organizations: Array },
  sub_output: { organizations: allHaveProperty(isGithubOrganization) }
}).toss();
