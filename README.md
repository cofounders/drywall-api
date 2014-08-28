# DryWall API

*RESTful API using Node.js, Express, and MongoDB*

[ ![Codeship Status for cofounders/drywall-api](https://codeship.io/projects/cb87fab0-04be-0132-38cc-22164d46567f/status)](https://codeship.io/projects/30705)

### Setup

1. Install [Node.js](http://nodejs.org/)

1. Set a DRYWALL_MONGO environment variable (details below) or install [MongoDB](http://docs.mongodb.org/manual/installation/)

1. Install the dependencies
```
	$ npm install
```

1. Run the node server on localhost (default port 8000)
```
	$ npm start
```
1. Check that its working:

	<http://localhost:8000>

### Development

Run the app in development mode to automatically restart when you make a change to the source code.
```
  $ grunt dev
```
### Tests

Sanity check the code and run integration tests.
```
  $ npm test
```
### Configurations
The following environment variables are used in this app and can be configured by creating a `.env` file in the root of the project.
It should be in the format: KEY=VALUE

`PORT` (default: 8000): TCP port where the app listens for HTTP requests
`DRYWALL_AUTH0_CLIENT_SECRET`: [Auth0](http://auth0.com) client secret for drywall. It handles user social logins.
`DRYWALL_AUTH0_ID`: [Auth0](http://auth0.com) client id for drywall. It handles user social logins.
`DRYWALL_MONGOHQ_URI`: [MongoHQ/compose](https://www.compose.io) connection string (only one MongoDB connection).
`DRYWALL_MONGOLAB_URI`: [MongoLab](https://mongolab.com/) connection string (only one MongoDB connection).

paypalMode is either `SANDBOX` or `LIVE`
`DRYWALL_PAYPAL_LIVE_MODE` (default: false): Either `true` or `false` to specify whether to use live mode credentials
`DRYWALL_PAYPAL_<paypalMode>_CLIENT_ID`: Paypal client id for this mode.
`DRYWALL_PAYPAL_<paypalMode>_SECRET`: Paypal secret for this mode.

By default the app connects to MongoDB as `mongodb://localhost:27017/test`.

### Deployment
Auto deployment from a code branch to heroku is handled by codeship.

| Environment Type | branch | URL |
| --- | --- | --- |
| Staging | `develop` | <http://drywall-api-staging.herokuapp.com> |
| Production | `master` | <http://drywall-api-production.herokuapp.com> |

### MongoDB
To start MongoDB locally:
```
  $ mongod
  $ mongod --dbpath /data/db  # specify path to db data
```

<http://docs.mongodb.org/manual/reference/mongo-shell/>

In the mongo/bin folder, run `mongo`

	> use <dbName>
	> show collections
	> db.<collection>.find() //return all
	> db.<collection>.find({id: 1})
	> db.<collection>.remove() //Does not remove indexes
	> db.<collection>.drop()   //drops documents and indexes

### To play with/research a little more:

- Generate API documentation (needs redis): <https://github.com/mashery/iodocs>
- Create configurable REST APIs using Mongoose schemata: <https://github.com/wprl/baucis>
- Create restful APIs with express: <https://github.com/baugarten/node-restful>
