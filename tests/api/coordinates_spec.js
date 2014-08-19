var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test posting missing coordinates')
  .post(utils.endpoint('/cofounders/drywall/coordinates'))
  .expectStatus(500)
.toss();