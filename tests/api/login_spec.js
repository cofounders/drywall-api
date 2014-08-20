var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test index')
  .get(utils.localhost())
  .expectStatus(200)
.toss();
