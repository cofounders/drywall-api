define(['app/components/utils/uri'], function (uri) {
  function github(req, res) {
    var url = uri.toURL("https://github.com/login/oauth/authorize", {
      redirect_uri: req.query.redirect_uri,
      client_id: 'a110297b7d6a6fab5dac',
      scope: 'repo'
    });
    res.redirect(url);
  }

	return {
	  github: github
	};
});
