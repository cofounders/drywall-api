var frisby   = require('frisby');
var fromPath = require('./endpoint.js').endpoint;

function mkFrisby(desc, path, response, type, output, sub_output) {
  var endpoint = fromPath(path);
  return frisby.create(desc)
               .get(endpoint)
               .expectStatus(response)
               .expectHeaderContains('content-type', type)
               .expectJSONTypes('0', output)
               .expectJSONTypes('0', sub_output);
}

function mkFrisbyJSON200(desc, path, output, sub_output) {
  return mkFrisby(desc, path, 200, 'application/json', 
                  output, sub_output);
}

module.exports = {
  mkFrisby: mkFrisby,
  mkFrisbyJSON200: mkFrisbyJSON200
}
