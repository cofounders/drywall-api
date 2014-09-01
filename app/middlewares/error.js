function errorHandler(err, req, res, next) {
  var msg = {message: err.message || 'Nothing to see here!'};
  if (err.hasOwnProperty('details')) {
    msg.details = err.details;
  }
  res.status(err.statusCode || err.status || 404).send(msg);
}

module.exports = errorHandler;