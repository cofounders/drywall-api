var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test index')
  .get(utils.endpoint())
  .expectStatus(200)
.toss();