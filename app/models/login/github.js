define(['mongoose','request','app/components/utils/uri', 'config/config'], function(m,request,uri,config) {
  var endpoints = config.endpoints;
  var keys = config.keys;

  var schema = new m.Schema({
    session: String,
    access_token: String
  });
  
  function getAccessToken(code, callback) {
    var url = uri.toURL(endpoints.ghAccessToken, {
      client_id: keys.ghClientId,
      client_secret: keys.ghClientSecret,
      code: code
    });
    request.post(url, {}, function(err,resp,body) {
      callback(body);
    });
  };
  
  schema.static('make', function(code, session) {
    var self = this;
    getAccessToken(code, function(body) {
      var parameters = uri.fromParameterString(body);
      new self({
        session: session,
        access_token: parameters.access_token
      }).save();
    });
  });


  return {
    schema: schema
  }
});
