var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyParser = require('body-parser');
var morgan  = require('morgan');
var compression = require('compression');

var config = require('./config');
var db = require('./components/database');
var routes = require('./routes');

var app = express();
var dbUrl = config.db.uri;

app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET, PUT, POST, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

console.log('Connecting to', dbUrl);
db.connect(dbUrl, function(err) {
  if (err) {
    console.log('Not connected to a database');
    process.exit(1);
  } else {
    routes.setup(app);
    app.listen(config.port);
    console.log('Server up at port %d', config.port);
  }
});
