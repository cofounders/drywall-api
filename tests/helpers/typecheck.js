function isGithubOrganization(el) {
  var hasOther = [ 
    el.hasOwnProperty('id'),
    typeof(el.id) == String,
    el.hasOwnProperty('name'),
    typeof(el.name) == String,
    el.hasOwnProperty('github_url'),
    typeof(el.github_url) == String
  ].hasOwnProperty(false);
  return (!hasOther);
}

function isGithubLabel(el) {
  var hasOther = [ 
    el.hasOwnProperty('id'),
    typeof(el.id) == String,
    el.hasOwnProperty('name'),
    typeof(el.name) == String,
    el.hasOwnProperty('color'),
    typeof(el.color) == String,
    el.hasOwnProperty('on_wall'),
    typeof(el.on_wall) == Boolean
  ].hasOwnProperty(false);
  return (!hasOther);
}

function allHaveProperty(callback) {
  return function(list) {
    var hasOther = list.map(callback).hasOwnProperty(false);
    return(!hasOther);
  }
}

module.exports = {
  isGithubOrganization: isGithubOrganization,
  allHaveProperty: allHaveProperty
}
