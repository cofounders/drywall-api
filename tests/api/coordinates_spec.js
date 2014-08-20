var path = require('path');
var frisby = require('frisby');
var utils = require('../helpers/utils');

var owner = 'cofounders';
var repo = 'drywall-web';
var coordinatesUrl = utils.localhost(
  path.join(owner, repo, 'coordinates')
);

frisby.create('Test getting coordinates')
  .get(coordinatesUrl)
  .expectStatus(200)
  .expectJSONTypes('?', {
    number: Number,
    x: Number,
    y: Number,
    owner: owner,
    repo: repo
  })
.toss();

frisby.create('Test posting missing coordinates')
  .post(coordinatesUrl)
  .expectStatus(400)
.toss();

frisby.create('Test updating missing number')
  .post(coordinatesUrl + '?x=100&y=20')
  .expectStatus(400)
.toss();