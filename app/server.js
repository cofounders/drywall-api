require('newrelic');
var bodyParser = require('body-parser');
var express = require('express');
var compression = require('compression');
var cors = require('cors');
var mongoose = require('mongoose');
var morgan  = require('morgan');
var config = require('./config');
var db = require('./modules/database');
var routes = require('./routes');

var app = express();
var dbUrl = config.db.uri;

app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(compression());
app.use(cors({
  origin: '*',
  methods: ['GET, POST, DELETE, OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

console.log('Connecting to', dbUrl);
db.connect(dbUrl, function(err) {
  if (err) {
    console.log('Not connected to a database');
  } else {
    db.loadPaymentPlans().then(function (plans) {
      config.paymentPlans = plans;
    });
    routes.setup(app);
    app.listen(config.port);
    console.log('Server up at port ' + config.port);
  }
});
