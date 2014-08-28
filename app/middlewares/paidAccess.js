function paidAccess(req, res, next) {
  if (!req.github.private) {
    return next();
  } else {
    // Check that there is an entry in billings and that it has been paid
    return next();
  }
}

module.exports = paidAccess;