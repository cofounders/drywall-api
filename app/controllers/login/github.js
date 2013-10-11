define(['request', 'app/components/utils/uri'], function (request, uri) {

  // Redirect users to Github to request access.
  // Afterwards, have GitHub redirect to another URI, with `code` as parameter.
  //  (Include a redirect in the endpoint, so we know where to go next..)
  function authorize(req, res) {
    var url = uri.toURL('https://github.com/login/oauth/authorize', {
      redirect_uri: req.query.redirect_uri, // '/login/github/redirect?redirect_uri=app'
      client_id: 'a110297b7d6a6fab5dac',
      scope: 'repo'
    });
    res.redirect(url);
  }; 

  // Take the code parameter, and exchange this for an access token.
  //  (Persist this, someplace..)
  // Having authenticated, redirect..
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
    return request.post(url);
  }

	return {
	  authorize: authorize,
	  redirect: redirect
	};
});
