var URI = require('URIjs')

function toURL(base, params) {
  return URI(base).search(params).toString();
}

function fromParameterString(str) {
  return URI('?' + str).query(true)
}

module.exports = {
  toURL: toURL ,
  fromParameterString: fromParameterString
}
