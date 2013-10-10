var _ = require('underscore');

function toTypeOf(cons) {
  var definition = cons.toString();
  var pattern    = /function (\w+)\(/;
  return pattern.exec(definition)[1].toLowerCase();
}

function isTrue(val) {
  return (val===true);
}

function fromSpecification(spec) {
  return function(element) {
    return _.map(spec, function(type, name) {
      var property = element[name];
      var has      = typeof(property) != 'undefined';
      var is       = typeof(property) == toTypeOf(type);
      return (has&&is);
    }).every(isTrue);
  };
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

isStickie = fromSpecification ({
  id:            String,
  name:          String,
  color:         String,
  github_number: Number,
  milestone:     String,
  label:         String,
  x:             Number,
  y:             Number
});

function allHaveProperty(callback) {
  return function(list) {
    return list.map(callback).every(isTrue);
  };
}

module.exports = {
  isGithubMilestone: isGithubMilestone,
  isGithubLabel: isGithubLabel,
  isGithubOrganization: isGithubOrganization,
  isStickie: isStickie,
  allHaveProperty: allHaveProperty
};
