var dotenv = require('dotenv');
dotenv.load();

module.exports = {
  port: process.env.PORT || 8000,

  db: {
    sess_interval: 3600,
    uri:
      process.env.DRYWALL_MONGOLAB_URI ||
      process.env.DRYWALL_MONGOHQ_URI ||
      'mongodb://127.0.0.1:27017/test'
  },

  auth0: {
    secret: process.env.DRYWALL_AUTH0_CLIENT_SECRET,
    clientId: process.env.DRYWALL_AUTH0_CLIENT_ID
  },

  keys: {
    ghClientId: 'a110297b7d6a6fab5dac',
    ghClientSecret: '1f452780e9f37f5c49a3406e60917e0c1032fae7'
  },

  endpoints: {
    dwRedirect: 'http://localhost:9000/login/github/redirect',
    ghAuthorize: 'https://github.com/login/oauth/authorize',
    ghAccessToken: 'https://github.com/login/oauth/access_token'
  }
};