define(['underscore'], function(_) {
  function pairJoin(pair) {
    return pair.join('=');
  };

  function toParameters(p) {
    var tail = _.pairs(p).map(pairJoin).join('&');
    return ('?' + tail);
  };

  function toURL(base,params) {
    var url = base + toParameters(params);
    return url;
  };

  return {
    toURL: toURL 
  }
});
