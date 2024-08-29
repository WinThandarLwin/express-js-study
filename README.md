# Express Project with MongoDB Setup

This guide will walk you through setting up a Node.js project for ES6 study.

## 1. Install Node.js

First, install Node.js from the official website:

- [Download Node.js](https://nodejs.org/en)

After installation, verify the installation by checking the Node.js and npm versions:

```bash
node -v
npm -v
```

## 2. Create Express Project with MongoDB (Project Name: express-js-study)

```bash
mkdir express-js-study
cd express-js-study
npm init -y
npm i express
npm i -D eslint
npm i mongojs body-parser
npm i express-validator
npm i jsonwebtoken
npm i cor
```

## 3 Setup MongoDB(NoSQL Database, Document Database)

### 3.1 Install MongoDB adn Mongo Shell

- [Download MongoDB](https://www.mongodb.com/try/download/community)
- [Download MongoDB Shell](https://www.mongodb.com/try/download/shell)

mongod : run for MongoDB Server
Mongo : MongoDB Client (Mongo Shell) for connect MongoDB Server
Mongo Compass : GUI Program for MongoDB

### 3.2 Setting PATH Environment Variable

```bash
C:\Program Files\MongoDB\Server\7.0\bin
C:\mongosh-2.3.0-win32-x64\bin
```

### 3.3 Auto run MongoDB Server as system service

```bash
mongod --install
```

and then PC restart
command for manual run, need to create C:\mongodata folder.

```bash
mongod --dbpath=C:\mongodata
```

### 3.4 Use MongoDB Command

```bash
mongo　OR　mongosh
show dbs
use travel
show dbs
```

・Create Collection Command 1

```bash
db.createCollection("name")
db.dropCollection("name") OR db.name.drop()
show collections
```

・Create Collection Command 2

```bash
use travel
db.records.insertOne({ name: "Bobo", age: 23 })
db.records.find()
```

・Other Useful Command

```bash
ObjectId("5f62481e8873b1d7bff76272").getTimestamp()
db.records.remove({ name: "Bobo" })
"db.records.insertMany([
  {name: ""Bobo"", nrc: ""A0131"", from: ""Yangon"", to: ""Mandalay"", with: ""5B9876""},
  {name: ""Nini"", nrc: ""A1476"", from: ""Yangon"", to: ""Bago"", with: ""3G6457""},
  {name: ""Coco"", nrc: ""B0487"", from: ""Bago"", to: ""Yangon"", with: ""4L2233""},
  {name: ""Mimi"", nrc: ""C1987"", from: ""Yangon"", to: ""Mandalay"", with: ""9E4343""},
  {name: ""Nono"", nrc: ""B0098"", from: ""Bago"", to: ""Yangon"", with: ""4L2233""},
  {name: ""Momo"", nrc: ""C0453"", from: ""Yangon"", to: ""Bago"", with: ""3G6457""}
]);"
db.records.find().pretty()
db.records.find({ from: "Yangon" })
db.records.find({ from: "Yangon", to: "Bago" })
"db.records.find({
  $or: [
    { from:""Yangon"" },
    { to: ""Yangon"" }
  ]
})"
db.products.find({ price: { $gt: 9 } })
db.records.find().sort({ name: 1 })
db.records.find().sort({ from: 1, name: 1 })
db.records.find().limit(3)
db.records.find().skip(1).limit(3)
db.records.find({}, {name: 1, nrc: 1})
db.records.save({ name: "Test", age: 22 })
"db.records.save({ ""_id"" : ObjectId(""5f6250f28873b1d7bff76277"")
, ""name"" :""Test2"" })"
"db.records.update(
  { to: ""Bago"" },
  { $set: { to: ""Bagan"" } },
  { multi: true }
)"
・Filter Multi Structure
"{
  name: ""Bobo"",
  nrc: ""A0131"",
  trip: {
    from: ""Yangon"",
    to: ""Mandalay"",
    vehicle: {
       type: ""car"",
       license: ""5B9876""
    }
  }
}"
db.records.find({ "trip.vehicle.type": "car" })
```

## 4 Run Server

```bash
    node index.js
```

## 5 Run MongoServer

```bash
    mongosh
```
