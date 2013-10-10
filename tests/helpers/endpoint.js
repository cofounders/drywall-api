function endpoint(path) {
  var base = 'http://localhost';
  var port = 9002;
  return [base, ':', port, '/', path].join('');
}

module.exports = {
  endpoint: endpoint
};
