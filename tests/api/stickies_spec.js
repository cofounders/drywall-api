var frisby = require('frisby');
var utils = require('../helpers/utils');

frisby.create('Test posting empty stickie')
  .post(utils.endpoint('/stickies'))
  .expectStatus(200)
.toss();