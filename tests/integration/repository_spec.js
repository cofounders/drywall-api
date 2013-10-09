var frisby               = require('frisby');
var mkFrisbyJSON200      = require('../helpers/frisby.js').mkFrisbyJSON200;
var isGithubOrganization = require('../helpers/typecheck.js').isGithubOrganization;
var isGithubRepository   = require('../helpers/typecheck.js').isGithubRepository;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyJSON200(
  'List repos by organisation',
  'repositories/?github_organisation=someid',
  { organizations: Array,
    repositories:  Array
  },
  { organizations: allHaveProperty(isGithubOrganization),
    repositories:  allHaveProperty(isGithubRepository)
  }
).toss();
