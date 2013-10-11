var frisby   = require('frisby');
var fromPath = require('./endpoint.js').endpoint;

function mkFrisby(desc, path, method, body, response, type, output, sub_output) {
  var endpoint = fromPath(path);
  console.log('test ' + path);
  return frisby.create(desc)[method](endpoint, body)
               .expectStatus(response)
               .expectHeaderContains('content-type', type)
               .expectJSONTypes('0', output)
               .expectJSONTypes('0', sub_output);
}

function mkFrisbyGET(desc, path, response, type, output, sub_output) {
  return mkFrisby(desc, path, 'get', {}, response, type, output, sub_output);
}

function mkFrisbyGETJSON200(desc, path, output, sub_output) {
  return mkFrisbyGET(desc,path,200,'application/json',output,sub_output);
}

function mkFrisbyPOST(desc, path, body, response, type, output, sub_output) {
  return mkFrisby(desc, path, 'post', body, response, type, output, sub_output);
}

function mkFrisbyPUT(desc, path, body, response, type, output, sub_output) {
  return mkFrisby(desc, path, 'put', body, response, type, output, sub_output);
}

function mkFrisbyDELETE(desc, path, response, type, output, sub_output) {
  return mkFrisby(desc, path, 'delete', {}, response, type, output, sub_output);
}

function mkFrisbyGET302(desc, path) {
  return mkFrisby(desc, path, 'get', {}, 302, 'text/html', {}, {})
}


module.exports = {
  mkFrisby:            mkFrisby,
  mkFrisbyGET:         mkFrisbyGET,
  mkFrisbyPOST:        mkFrisbyPOST,
  mkFrisbyPUT:         mkFrisbyPUT,
  mkFrisbyDELETE:      mkFrisbyDELETE,
  mkFrisbyGETJSON200:  mkFrisbyGETJSON200,
  mkFrisbyGET302: mkFrisbyGET302
}
