define(['request', 'app/components/utils/uri'], function (request, uri) {
  function redirectURL(where) {
    return uri.toURL("http://localhost:9000/login/github/redirect", {
      redirect_uri: where
    });
  };

  function authorize(req, res) {
    var later = req.query.redirect_uri
    var url = uri.toURL("https://github.com/login/oauth/authorize", {
      redirect_uri: redirectURL(later),
      client_id: 'a110297b7d6a6fab5dac',
      scope: 'repo'
    });
    res.redirect(url);
  }; 

  function redirect(req, res) {
    var code  = req.query.code;
    var token = getAccessToken(code);
    var after = req.query.redirect_uri;
    res.redirect(after);
  };

  function getAccessToken(code) {
    var url = uri.toURL('https://github.com/login/oauth/access_token', {
      client_id: 'a110297b7d6a6fab5dac',
      client_secret: '1f452780e9f37f5c49a3406e60917e0c1032fae7', // Abuse wisely. ;-)
      code: code
    });
    request.post(url, {}, function(err,resp,body) {
      console.log(body);
    });
  }

	return {
	  authorize: authorize,
	  redirect: redirect
	};
});
