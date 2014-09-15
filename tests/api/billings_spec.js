var frisby = require('frisby');
var utils = require('../helpers/utils');

utils.bearerToken().then(function(token) {
  frisby.create('Test getting billings')
    .get(utils.localhost('billings'))
    .addHeader('Authorization', token)
    .expectStatus(200)
    .expectJSONLength(4)
    .expectJSONTypes('?', {
      owner: 'superdrywall',
      paidBy: String,
      plan: Number,
      nextBillingDate: String
    })
  .toss();
});