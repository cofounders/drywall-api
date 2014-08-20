var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test getting coordinates')
  .get(utils.endpoint('/cofounders/drywall/coordinates'))
  .expectStatus(200)
.toss();

frisby.create('Test posting missing coordinates')
  .post(utils.endpoint('/cofounders/drywall/coordinates'))
  .expectStatus(400)
.toss();

frisby.create('Test updating missing number')
  .post(utils.endpoint('/cofounders/drywall/coordinates?x=100&y=20'))
  .expectStatus(400)
.toss();