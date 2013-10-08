var frisby               = require('frisby');
var fromPath             = require('../helpers/endpoint.js').endpoint;
var isGithubOrganization = require('../helpers/typecheck.js').isGithubOrganization;

var endpoint   = fromPath('organizations');
var output     = { organizations: Array };
var sub_output = { 
  organizations: function(list) { 
    var hasOther = list.map(isGithubOrganization).hasOwnProperty(false);
    return (!hasOther);
  }
};

frisby.create('List of organisations for a user')
      .get(endpoint)
      .expectStatus(200)
      .expectHeaderContains('content-type','application/json')
      .expectJSONTypes('0', output)
      .expectJSONTypes('0', sub_output)
      .toss();
