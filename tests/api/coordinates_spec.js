var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test posting missing coordinates')
  .post(utils.endpoint('/cofounders/drywall/coordinates'))
  .expectStatus(400)
.toss();

frisby.create('Test updating missing number')
  .put(utils.endpoint('/cofounders/drywall/coordinates?x=100&y=20'))
  .expectStatus(400)
.toss();