var frisby               = require('frisby');
var fromPath             = require('../helpers/endpoint.js').endpoint;
var isGithubMilestone    = require('../helpers/typecheck.js').isGithubMilestone;
var allHaveProperty      = require('../helpers/typecheck.js').allHaveProperty;

var endpoint   = fromPath('milestones/someGithubRepo');
var output     = { milestones: Array };
var sub_output = { 
  milestones: allHaveProperty(isGithubMilestone)
};

frisby.create('List of milestones for some repo')
      .get(endpoint)
      .expectStatus(200)
      .expectHeaderContains('content-type','application/json')
      .expectJSONTypes('0', output)
      .expectJSONTypes('0', sub_output)
      .toss();
