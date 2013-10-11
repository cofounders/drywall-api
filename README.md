# DryWall API

*RESTful API using Node.js, Express, and MongoDB*

### Setup

1. Install [nodejs](http://nodejs.org/)

1. Install [mongoDB](http://docs.mongodb.org/manual/installation/)

1. Grab node dependencies (express):

		npm install

1. Install nodemon

		npm install nodemon -g

1. Start MongoDB

		bin/mongod.exe

	or

		mongod &

1. Run the node server on localhost (default port 3003)

		nodemon server.js

1. To see a list of repos for an organisation, navigate to:

	<http://localhost:3003/orgs/cofounders/repos>

###Quick start usage to playing with the interactive mongo shell

<http://docs.mongodb.org/manual/reference/mongo-shell/>

In the mongo/bin folder, run mongo.exe

	> use <dbName>
	> show collections
	> db.<collection>.find() //return all
	> db.<collection>.find({id: 1})
	> db.<collection>.remove() //Does not remove indexes
	> db.<collection>.drop()   //drops documents and indexes

###To play with/research a little more:

- Generate API documentation (needs redis): <https://github.com/mashery/iodocs>
- Create configurable REST APIs using Mongoose schemata: <https://github.com/wprl/baucis>
- Create restful APIs with express: <https://github.com/baugarten/node-restful>
