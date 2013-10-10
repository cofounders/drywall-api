var frisby   = require('frisby');
var fromPath = require('./endpoint.js').endpoint;
var _        = require('underscore');

var parameters = {
//method:     function(f,o) { return f[o]; },
//endpoint:   function(g,o) { return function(body) { return g(fromPath(o), body); };},
//body:       function(h,o) { return h(o); },
  response:   function(f,o) { return f.expectStatus(o); },
  type:       function(f,o) { return f.expectHeaderContains('content-type', o); },
  output:     function(f,o) { return f.expectJSONTypes('0',o); },
  sub_output: function(f,o) { return f.expectJSONTypes('0',o); }
};

var frisbyDefaults = {
  body:       {},
  output:     {},
  sub_output: {}
};

function mkFrisby(desc, mkOptions, mkDefaults) {
  var frisbee  = frisby.create(desc);
  var defaults = _.extend(frisbyDefaults, mkDefaults);
  var options  = _.defaults(mkOptions, defaults);

  var m = options.method, // Not in `frisbyDefaults`!
      e = fromPath(options.endpoint),
      b = options.body;
  frisbee = frisbee[m](e,b);

  _(parameters).each(function(fn, par){
    var option = options[par];
    if (option) { frisbee = fn(frisbee, option); }
  }); 
  return frisbee;
}

function mkFrisbyGET(description, options) {
  return mkFrisby(description, options, { 
    method: 'get'
  });
}

function mkFrisbyGETJSON200(description,options) {
  return mkFrisby(description, options, {
    method: 'get',
    response: 200,
    type: 'application/json'
  });
}

function mkFrisbyPOST(description,options) {
  return mkFrisby(description, options, {
    method: 'post'
  });
}


function mkFrisbyPUT(description,options) {
  return mkFrisby(description, options, {
    method: 'put'
  });
}

function mkFrisbyDELETE(description,options) {
  return mkFrisby(description, options, {
    method: 'delete'
  });
}

function mkFrisbyGET302(description,options) {
  return mkFrisby(description, options, { 
    method: 'get',
    response: 302,
    type: 'text/html'
  });
}

module.exports = {
  mkFrisby:            mkFrisby,
  mkFrisbyGET:         mkFrisbyGET,
  mkFrisbyPOST:        mkFrisbyPOST,
  mkFrisbyPUT:         mkFrisbyPUT,
  mkFrisbyDELETE:      mkFrisbyDELETE,
  mkFrisbyGETJSON200:  mkFrisbyGETJSON200,
  mkFrisbyGET302: mkFrisbyGET302
};
