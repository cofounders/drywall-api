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
      url: 'https://api.paypal.com/v1',
      nvpApiUrl: 'https://api-3t.paypal.com/nvp',
      ipnUrl: 'https://paypal.com/cgi-bin/webscr',
      user: process.env.DRYWALL_PAYPAL_LIVE_USER,
      password: process.env.DRYWALL_PAYPAL_LIVE_PASSWORD,
      signature: process.env.DRYWALL_PAYPAL_LIVE_SIGNATURE
    },
    sandbox: {
      clientId: process.env.DRYWALL_PAYPAL_SANDBOX_CLIENT_ID,
      secret: process.env.DRYWALL_PAYPAL_SANDBOX_SECRET,
      url: 'https://api.sandbox.paypal.com/v1',
      nvpApiUrl: 'https://api-3t.sandbox.paypal.com/nvp',
      ipnUrl: 'https://sandbox.paypal.com/cgi-bin/webscr',
      user: process.env.DRYWALL_PAYPAL_SANDBOX_USER,
      password: process.env.DRYWALL_PAYPAL_SANDBOX_PASSWORD,
      signature: process.env.DRYWALL_PAYPAL_SANDBOX_SIGNATURE
    }
  },

  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    secret: process.env.GITHUB_SECRET
  }
};