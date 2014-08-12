module.exports = {
  port: process.env.PORT || 9000,

  db: {
    sess_interval: 3600,
    uri: //'mongodb://<username>:<password>@dbh16.mongolab.com:<port>/<dbname>' ||
      process.env.MONGOLAB_URI ||
      process.env.MONGOHQ_URL ||
      'mongodb://127.0.0.1:27017/test'
  },

  keys: {
    ghClientId: 'a110297b7d6a6fab5dac',
    ghClientSecret: '1f452780e9f37f5c49a3406e60917e0c1032fae7' // Abuse wisely. ;-)
  },

  endpoints: {
    dwRedirect: "http://localhost:9000/login/github/redirect",
    ghAuthorize: "https://github.com/login/oauth/authorize",
    ghAccessToken: "https://github.com/login/oauth/access_token"
  }
};