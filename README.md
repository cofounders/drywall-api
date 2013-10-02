#drywall-api

RESTful API using Node.js, Express, and MongoDB

1) Install [nodejs](http://nodejs.org/)    
2) Install [mongoDB](http://docs.mongodb.org/manual/installation/)   
3) Grab node dependencies (express):   

    npm install
    
4) Start mongodb: bin/mongod.exe   
5) To see a list of repos for an organisation, navigate to:

    http://localhost:3003/orgs/cofounders/repos

###Quick start usage to playing with the interactive mongo shell
http://docs.mongodb.org/manual/reference/mongo-shell/   
In the mongo/bin folder, run mongo.exe   
  
    > use <dbName>   
    > show collections   
    > db.<collection>.find() //return all   
    > db.<collection>.find({id: 1})    
    > db.<collection>.remove() //Does not remove indexes    
    > db.<collection>.drop()   //drops documents and indexes    
