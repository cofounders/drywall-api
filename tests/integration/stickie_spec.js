var frisby             = require('frisby');
var mkFrisbyGETJSON200 = require('../helpers/frisby.js').mkFrisbyGETJSON200;
var mkFrisbyPOST       = require('../helpers/frisby.js').mkFrisbyPOST;
var mkFrisbyPUT        = require('../helpers/frisby.js').mkFrisbyPUT;
var mkFrisbyDELETE     = require('../helpers/frisby.js').mkFrisbyDELETE;
var isStickie          = require('../helpers/typecheck.js').isStickie;
var allHaveProperty    = require('../helpers/typecheck.js').allHaveProperty;

mkFrisbyGETJSON200(
  'issues by organisation and repository',
  'stickies/?github_organization=someOrg&github_repository=someRepo',
  { stickies: Array },
  { stickies: allHaveProperty(isStickie) }
).toss();

mkFrisbyGETJSON200(
  'issues by organisation and repository:get',
  'stickies/someId',
  { stickie: Object },
  { stickie: isStickie }
).toss();

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

mkFrisbyPOST(
  'issues by organisation and repository:post',
  'stickies/someId',
  someStickie,
  200,
  'application/json',
  { stickie: Object },
  { stickie: isStickie }
).toss();

mkFrisbyPUT(
  'issues by organisation and repository:put',
  'stickies/someId',
  someStickie,
  200,
  'application/json',
  { stickie: Object },
  { stickie: isStickie }
).toss();

mkFrisbyDELETE(
  'issues by organisation and repository:delete',
  'stickies/someId',
  200,
  'application/json',
  { stickie: Object },
  { stickie: isStickie }
).toss();
