define(['app/components/utils/uri', 'app/models/login', 'config/config'], 
function (uri, login, config) {
  var endpoints = config.endpoints;
  var keys = config.keys;

  function redirectURL(where,state) {
    return uri.toURL(endpoints.dwRedirect, {
      redirect_uri: where,
      session: state
    });
  };

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
    login.make(code, session);
    var after = req.query.redirect_uri;
    res.redirect(after);
  };
  
  return {
    authorize: authorize,
    redirect: redirect
  };
});
