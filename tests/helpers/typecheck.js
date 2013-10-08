function fromSpecification(spec) {
  return function(element) {
    return spec.forEach(function(name, type) {
      var property = element.getProperty(name)
      var has      = typeof(property) != 'undefined'
      var is       = typeof(property) == type
      (has&&is) ? true : false
    }).hasOwnProperty(false);
  }
}

isGithubOrganization = fromSpecification({
  id:         String,
  name:       String,
  github_url: String
});

isGithubLabel = fromSpecification({
  id:      String,
  name:    String,
  color:   String,
  on_wall: Boolean
});

isGithubMilestone = fromSpecification({
  id:       String,
  name:     String,
  color:    String,
  due_date: Date
});

function allHaveProperty(callback) {
  return function(list) {
    var hasOther = list.map(callback).hasOwnProperty(false);
    return(!hasOther);
  }
}

module.exports = {
  isGithubMilestone: isGithubMilestone,
  isGithubLabel: isGithubLabel,
  isGithubOrganization: isGithubOrganization,
  allHaveProperty: allHaveProperty
}
