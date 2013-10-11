define(['URIjs'], function(URI) {

  function toURL(base, params) {
    return URI(base).search(params).toString();
  }
  
  function fromParameterString(str) {
    return URI('?' + str).query(true)
  }

  return {
    toURL: toURL ,
    fromParameterString: fromParameterString
  }
});
