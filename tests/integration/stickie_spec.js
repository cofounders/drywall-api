var frisby             = require('frisby');
var mkFrisbyGETJSON200 = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var mkFrisbyPOST       = require('../helpers/frisby.js').mkFrisbyPOST;
var mkFrisbyPUT        = require('../helpers/frisby.js').mkFrisbyPUT;
var mkFrisbyDELETE     = require('../helpers/frisby.js').mkFrisbyDELETE;
var isStickie          = require('../helpers/typecheck.js').isStickie;
var allHaveProperty    = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200('issues by organisation and repository', {
  endpoint: 'stickies/?github_organization=someOrg&github_repository=someRepo',
  output:     { stickies: Array },
  sub_output: { stickies: allHaveProperty(isStickie) }
}).toss();

mkFrisbyGETJSON200('issues by organisation and repository:get', {
  endpoint: 'stickies/someId',
  output:     { stickie: Object },
  sub_output: { stickie: isStickie }
}).toss();

someStickie = {
  id: "6a0f0731d84afa4082031e3a72354991",
  name: "life, the universe, and everything",
  color: "#421729",
  github_number: 42,
  milestone: "3.0",
  label: "feature",
  x: 23,
  y: 5
};

mkFrisbyPOST('issues by organisation and repository:post',{
  endpoint: 'stickies/someId',
  body: someStickie,
  response: 200,
  type: 'application/json',
  output:     { stickie: Object },
  sub_output: { stickie: isStickie }
}).toss();

mkFrisbyPUT('issues by organisation and repository:put', {
  endpoint: 'stickies/someId',
  body: someStickie,
  response: 200,
  type: 'application/json',
  output:     { stickie: Object },
  sub_output: { stickie: isStickie }
}).toss();

mkFrisbyDELETE('issues by organisation and repository:delete', {
  endpoint: 'stickies/someId',
  response: 200,
  type: 'application/json',
  output:     { stickie: Object },
  sub_output: { stickie: isStickie }
}).toss();
