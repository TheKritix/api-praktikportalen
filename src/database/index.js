// Som det er lige nu, så bliver dette ikke brugt.
//  	Dette var til tidlig test af systemet.
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

//Credentials
const __user = process.env.MONGO_INITDB_ROOT_USERNAME;
const __password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const __host = process.env.MONGO_INITDB_HOST;

// Intial Setup Source: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database

//Connection URL
const _MONGO_URL = `mongodb://localhost:27017/?connectTimeoutMS=10000`;

MongoClient.connect(
  _MONGO_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, client) => {
    if (err) {
      return console.log(err);
    }

    const db = client.db("praktikportal");
    console.log(`MongoDB Connected: ${_MONGO_URL}`);
    const students = db.collection("students");
    students.insertMany([{ name: "John" }], (err, result) => {
      console.log(result);
    });
  }
);
