var frisby = require('frisby');

frisby.create('Test index')
  .get('http://localhost:9000')
  .expectStatus(200)
.toss();
