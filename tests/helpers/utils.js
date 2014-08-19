function endpoint(path) {
  var base = 'http://localhost';
  var port = require('../../app/config').port;
  return [base, ':', port, path || ''].join('');
}

module.exports = {
  endpoint: endpoint
};
