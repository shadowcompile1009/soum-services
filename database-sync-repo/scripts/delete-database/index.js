const { MongoClient } = require("mongodb");

const url = process.env["MONGO_CONNECTION_STRING"],
  database = process.env["DATABASE"];

const client = new MongoClient(url);

const deleteDB = async () => {
  console.log("Connecting ...");
  await client.connect();
  console.log("Connected");
  const db = client.db(database);
  console.log("Dropping Database ...");
  await db.dropDatabase();
  console.log("Database Dropped ...");
};

deleteDB().then(() => {
  return process.exit(0);
});
