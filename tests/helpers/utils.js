function localhost(path) {
  var base = 'http://localhost';
  var port = require('../../app/config').port;
  path = path && path[0] !== '/' ? '/' + path : path;
  return [base, ':', port, path || ''].join('');
}

module.exports = {
  localhost: localhost
};
