function endpoint(path) {
  var base = 'http://localhost';
  var port = process.env.PORT || 9000;
  return [base, ':', port, '/', path].join('');
}

module.exports = {
  endpoint: endpoint
};
