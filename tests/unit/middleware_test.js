var assert = require('assert');
var middleware = require('../../app/components/middleware');

describe('Middleware tests', function () {
  var req = {query: {}, path: {}, params: {}, body: {}};
  var res = {};

  it('should pass if public repo', function () {
    req.path = '';
    req.params = {owner: 'alyssaq', repo: 'egg'};
    middleware.githubAuthorization(req, res, function (err) {
      assert.equal(err, undefined);
    });
  });
});