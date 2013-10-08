var frisby  = require('frisby');

function drywall(path) {
  var base = 'http://localhost';
  var port = 9002;
  return [base, ':', port, '/', path].join('');
}

frisby.create('get organisations')
      .get(drywall('user/orgs'))
      .expectStatus(200)
      .toss();

