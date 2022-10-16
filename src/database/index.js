// Som det er lige nu, så bliver dette ikke brugt.
//  	Dette var til tidlig test af systemet. 
// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

const MongoDB = require("mongodb");
require("dotenv").config();

//Credentials
const __user = process.env.MONGO_INITDB_ROOT_USERNAME;
const __password = process.env.MONGO_INITDB_ROOT_PASSWORD;
const __host = process.env.MONGO_INITDB_HOST;

// Intial Setup Source: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb-how-to-get-connected-to-your-database
async function main() {
  //Connection URL
  const _MONGO_URL = `mongodb://${__user}:${__password}@${__host}.dtu.praktikportal.diplomportal.dk:6543`;

  const mongoClient = new MongoDB(_MONGO_URL);

  try {
    await mongoClient.connect();
    await listDatabases(mongoClient);
  } catch (e) {
    console.error(e);
  } finally {
    await mongoClient.close();
  }
}

async function listDatabases(client) {
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
}

main().catch(console.error);
