

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

module.exports = {
  isGithubOrganization: isGithubOrganization
}
