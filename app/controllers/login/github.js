define(['request', 'app/components/utils/uri', 'app/models/login'], function (request, uri, login) {

  var keys = {
    ghClientId: 'a110297b7d6a6fab5dac',
    ghClientSecret: '1f452780e9f37f5c49a3406e60917e0c1032fae7' // Abuse wisely. ;-)
  }

  var endpoints = {
    dwRedirect: "http://localhost:9000/login/github/redirect",
    ghAuthorize: "https://github.com/login/oauth/authorize",
    ghAccessToken: "https://github.com/login/oauth/access_token"
  };

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
    getAccessToken(code, saveWithSession(session));
    var after = req.query.redirect_uri;
    res.redirect(after);
  };

  function saveWithSession(session) {
    return function(str) {
      var parameters = uri.fromParameterString(str);
      new login({
        session: session,
        access_token: parameters.access_token
      }).save;
    } 
  }

  function getAccessToken(code, callback) {
    var url = uri.toURL(endpoints.ghAccessToken, {
      client_id: keys.ghClientId,
      client_secret: keys.ghClientSecret,
      code: code
    });
    request.post(url, {}, function(err,resp,body) {
      callback(body);
    });
  }

	return {
	  authorize: authorize,
	  redirect: redirect
	};
});
