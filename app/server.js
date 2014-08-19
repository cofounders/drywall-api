var bodyParser = require('body-parser');
var express = require('express');
var compression = require('compression');
var cors = require('cors');
var jwt = require('express-jwt');
var mongoose = require('mongoose');
var morgan  = require('morgan');

var config = require('./config');
var db = require('./components/database');
var routes = require('./routes');

var app = express();
var dbUrl = config.db.uri;
var authenticate = jwt({
  secret: new Buffer(config.auth0.secret || '', 'base64'),
  audience: config.auth0.clientId
});

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api', authenticate);

console.log('Connecting to', dbUrl);
db.connect(dbUrl, function(err) {
  if (err) {
    console.log('Not connected to a database');
    process.exit(1);
  } else {
    routes.setup(app);
    app.listen(config.port);
    console.log('Server up at port ' + config.port);
  }
});

app.get('/ping', function(req, res) {
  res.status(200).send({text: "All good. You don't need to be authenticated to call this"});
});

app.get('/api/ping', function(req, res) {
  console.error('!!' + JSON.stringify(req.user));
  console.log(req.query.access_token);
  res.status(200).send({text: "All good. You only get this message if you're authenticated"});
});
