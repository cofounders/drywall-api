# DryWall API

*RESTful API using Node.js, Express, and MongoDB*

[ ![Codeship Status for cofounders/drywall-api](https://codeship.io/projects/cb87fab0-04be-0132-38cc-22164d46567f/status)](https://codeship.io/projects/30705)

### Setup

1. Install [Node.js](http://nodejs.org/)

1. Install [MongoDB](http://docs.mongodb.org/manual/installation/)

1. Install the dependencies
```
	$ npm install
```
1. Start MongoDB
```
  $ mongod
  $ mongod --dbpath /data/db  # specify path to db data
```
1. Run the node server on localhost (default port 9000)
```
	$ npm start
```
1. Check that its working:

	<http://localhost:9000>

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
### Configuration

| Environment Variable | Default Value | Description |
| --- | --- |--- |
| `PORT` | 9000 | TCP port where the app listens for HTTP requests |
| `MONGOHQ_URL` | n/a | MongoDB connection string |
| `MONGOLAB_URI` | n/a | MongoDB connection string |

By default the app connects to MongoDB as `mongodb://localhost:27017/gitdb`.

### Quick start usage to playing with the interactive mongo shell

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
