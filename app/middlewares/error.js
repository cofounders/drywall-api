function errorHandler(err, req, res, next) {
  res.status(err.statusCode || err.status || 404);
  res.send({message: err.message || 'Nothing to see here!'});
}

module.exports = errorHandler;