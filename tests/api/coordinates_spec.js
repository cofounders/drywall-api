var path = require('path');
var frisby = require('frisby');
var utils = require('../helpers/utils');

var owner = 'cofounders';
var repo = 'drywall-api';
var coordinatesUrl = utils.localhost(
  path.join(owner, repo, 'coordinates')
);

frisby.create('Test getting coordinates from public repo ignorecase')
  .get(utils.localhost(
    path.join('Webuildsg', 'Webuild', 'coordinates')
  ))
  .expectStatus(200)
  .expectJSONTypes('?', {
    number: Number,
    x: Number,
    y: Number
  })
.toss();

// frisby.create('Get Auth0 access token')
//   .post('https://drywall.auth0.com/oauth/token')
//   .afterJSON(function(data) {
//     frisby.create('Test getting coordinates from private repo')
//       .get('https://drywall.auth0.com/api/users/github|8487474')
//       .addHeader('Authorization', 'Bearer ' + data.access_token)
//         headers: {'Authorization': 'Bearer ' + data.access_token}
//       }).then(function(data) {
//         resolve(data.identities[0].access_token);
//       }).catch(function(err) {
//         console.error(err);
//       });
//     }).catch(function(err) {
//       console.error('Error getting Auth0 token: ' + err);
//     });

// utils.testerAccessToken().then(function(token) {
//   frisby.create('Test getting coordinates from private repo')
//     .get(coordinatesUrl + '?access_token=' + token)
//     .addHeader('Authorization', utils.bearerToken())
//     .expectStatus(200)
//   .toss();
// });
// .afterJSON(function(user) {

frisby.create('Test posting missing coordinates')
  .post(coordinatesUrl)
  .expectStatus(404)
.toss();

frisby.create('Test updating missing number')
  .post(coordinatesUrl, {
    x: 180,
    y: 20
  }, {json: true})
  .expectStatus(404)
.toss();