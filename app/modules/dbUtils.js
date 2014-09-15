function caseinsensitiveRegex(str) {
  return {
    '$regex': '^' + str + '$',
    '$options': 'i'
  };
}

module.exports = {
  caseinsensitiveRegex: caseinsensitiveRegex
};