var frisby = require('frisby');
var utils = require('../helpers/utils');
var config = require('../../app/config');

frisby.create('Test index')
  .get(utils.localhost())
  .expectStatus(200)
.toss();

frisby.create('Bad token user')
  .get(utils.localhost('/api/ping'))
  .addHeader('Authorization', 'Bearer 1234567890')
  .expectStatus(401)
.toss();

frisby.create('No Authorization header is fine')
  .get(utils.localhost('/api/ping'))
  .expectStatus(200)
.toss();
