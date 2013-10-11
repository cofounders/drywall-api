define(['request', 'app/components/utils/uri'], function (request, uri) {
  function authorize(req, res) {
    var url = uri.toURL('https://github.com/login/oauth/authorize', {
      redirect_uri: req.query.redirect_uri,
      client_id: 'a110297b7d6a6fab5dac',
      scope: 'repo'
    });
    res.redirect(url);
  }; 
  
  function retrieveCode(request) { 
    return request.query.code; 
  }

  function retrieveAccessToken(req, res) {
    var code = retrieveCode(req); 
    return getAccessToken(code);
  }

  function getAccessToken(code) {
    var url = uri.toURL('https://github.com/login/oauth/access_token', {
      client_id: 'a110297b7d6a6fab5dac',
      client_secret: '1f452780e9f37f5c49a3406e60917e0c1032fae7', // Abuse wisely. ;-)
      code: code
    });
    return request.post(url);
  }

	return {
	  authorize: authorize
	};
});
