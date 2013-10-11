define(['mongoose'], function(m) {
  var schema = new m.Schema({
    session: String,
    access_token: String
  });

  return {
    schema: schema
  }
});
