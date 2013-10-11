define(['request', 'app/components/utils/uri', 'app/models/login', 'config/config'], 
function (request, uri, login, config) {
  var endpoints = config.endpoints;
  var keys = config.keys;

  function redirectURL(where,state) {
    return uri.toURL(endpoints.dwRedirect, {
      redirect_uri: where,
      session: state
    });
  };

  function mkLogin(code, session) { 
    getAccessToken(code, function(body) {
      var parameters = uri.fromParameterString(body);
      login.create({
        session: session,
        access_token: parameters.access_token
      });
    });
  }

  function authorize(req, res) {
    var later = req.query.redirect_uri
    var state = req.query.session
    var url = uri.toURL(endpoints.ghAuthorize, {
      redirect_uri: redirectURL(later,state),
      client_id: keys.ghClientId,
      scope: 'repo'
    });
    res.redirect(url);
  }; 
  
  function redirect(req, res) {
    var code    = req.query.code;
    var session = req.query.session;
    mkLogin(code, session);
    var after = req.query.redirect_uri;
    res.redirect(after);
  };
  
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

  return {
    authorize: authorize,
    redirect: redirect
  };
});
