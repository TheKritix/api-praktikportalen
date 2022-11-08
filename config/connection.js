require("dotenv").config();
const mongoose = require("mongoose");
const { getSecret } = require("./keyvault");

async function putKeyVaultSecretInEnvVar() {

    const secretName = process.env.KEY_VAULT_SECRET_NAME_DATABASE_URL || "mongodb://praktikportalen-mongodb-server:MOsXUsgveqFRigCfwqx4kDlpKb6NHXtmTmq9CAduFbcIfSwEip1X9V5DiDQ4mDVH4aArB6KCwDOMcPZ4lLaSIA==@praktikportalen-mongodb-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@praktikportalen-mongodb-server";
    const keyVaultName = process.env.KEY_VAULT_NAME || "praktikportalen-mongodb";

    console.log(secretName);
    console.log(keyVaultName);
    
    if (!secretName || !keyVaultName) throw Error("getSecret: Required params missing");

    connectionString = await getSecret(secretName, keyVaultName);
    process.env.DATABASE_URL = connectionString;

}

async function getConnectionInfo() {
  if (!process.env.DATABASE_URL) {

    await putKeyVaultSecretInEnvVar();

    // still don't have a database url?
    if(!process.env.DATABASE_URL){
      throw new Error("No value in DATABASE_URL in env var");
    }
  }

  // To override the database name, set the DATABASE_NAME environment variable in the .env file
  const DATABASE_NAME = process.env.DATABASE_NAME || "praktikportalen-mongodb";

  return {
    DATABASE_URL: "mongodb://root:grp5devops@20.199.101.106:1101/mongo-praktikportalen",//process.env.DATABASE_URL,
    DATABASE_NAME: "mongo-praktikportalen"//process.env.DATABASE_NAME
  }
}


module.exports = {
  getConnectionInfo
}