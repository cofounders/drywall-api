var path = require('path');
var frisby = require('frisby');
var utils = require('../helpers/utils');

var owner = 'cofounders';
var repo = 'drywall-web';
var coordinatesUrl = utils.localhost(
  path.join(owner, repo, 'coordinates')
);

frisby.create('Test getting coordinates from public repo')
  .get(utils.localhost(
    path.join('alyssaq', 'egg', 'coordinates')
  ))
  .expectStatus(200)
  // .expectJSONTypes('?', {
  //   number: Number,
  //   x: Number,
  //   y: Number
  // })
.toss();

frisby.create('Test posting missing coordinates')
  .post(coordinatesUrl)
  .expectStatus(404)
.toss();

frisby.create('Test updating missing number')
  .post(coordinatesUrl, {
    x: 180,
    y: 20
  }, {json: true})
  .expectStatus(404)
.toss();