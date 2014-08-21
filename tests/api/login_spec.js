var frisby = require('frisby');
var utils = require('../helpers/utils');
var jwt = require('jsonwebtoken');
var config = require('../../app/config');

frisby.create('Test index')
  .get(utils.localhost())
  .expectStatus(200)
.toss();

var secret = new Buffer(config.auth0.secret || '', 'base64');
var audience = config.auth0.clientId;
var token = jwt.sign(
  {random: 'cofounders'},
  secret, {'audience': audience}
);

frisby.create('Authenticated user')
  .get(utils.localhost('/api/ping'))
  .addHeader('Authorization', 'Bearer ' + token)
  .expectStatus(200)
.toss();

frisby.create('Authenticated user')
  .get(utils.localhost('/api/ping'))
  .addHeader('Authorization', 'Bearer 1234567890')
  .expectStatus(401)
.toss();

frisby.create('No Authorization header')
  .get(utils.localhost('/api/ping'))
  .expectStatus(401)
  .expectJSONTypes({
    error: String
  })
.toss();
