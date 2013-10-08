var frisby               = require('frisby');
var fromPath             = require('../helpers/endpoint.js').endpoint;
var isGithubOrganization = require('../helpers/typecheck.js').isGithubOrganization;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

var endpoint   = fromPath('organizations');
var output     = { organizations: Array };
var sub_output = { 
  organizations: allHaveProperty(isGithubOrganization)
};

frisby.create('List of organisations for a user')
      .get(endpoint)
      .expectStatus(200)
      .expectHeaderContains('content-type','application/json')
      .expectJSONTypes('0', output)
      .expectJSONTypes('0', sub_output)
      .toss();
