var _ = require('underscore');

function verifyConfig(config, masterKey) {
  masterKey = masterKey || '';
  _.each(config, function (val, key) {
    if (_.isObject(val)) {
      verifyConfig(val, masterKey + key + '.');
    } else if (val === undefined) {
      console.warn('config ' + masterKey + key + ' has not been set');
    }
  });
}

module.exports = verifyConfig;