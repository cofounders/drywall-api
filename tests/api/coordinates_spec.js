var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test posting empty coordinate')
  .post(utils.endpoint('/coordinates'))
  .expectStatus(200)
.toss();