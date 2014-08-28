var dotenv = require('dotenv');
dotenv.load();

var isPaypalLiveMode = process.env.DRYWALL_PAYPAL_LIVE_MODE || false;

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

  paypal: {
    mode: isPaypalLiveMode ? 'live' : 'sandbox',
    live: {
      clientId: process.env.DRYWALL_PAYPAL_LIVE_CLIENT_ID,
      secret: process.env.DRYWALL_PAYPAL_LIVE_SECRET,
      url: 'https://api.paypal.com/v1'
    },
    sandbox: {
      clientId: process.env.DRYWALL_PAYPAL_SANDBOX_CLIENT_ID,
      secret: process.env.DRYWALL_PAYPAL_SANDBOX_SECRET,
      url: 'https://api.sandbox.paypal.com/v1'
    }
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