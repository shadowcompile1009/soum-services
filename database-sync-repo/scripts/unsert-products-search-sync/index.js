const { MongoClient } = require("mongodb");

const url = process.env["MONGO_CONNECTION_STRING"];

const client = new MongoClient(url);

const prefix =
  process.env.DATABASE ?? `${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

const updateEnvPrefixSetting = async () => {
  console.log("Connecting ...");
  await client.connect();
  console.log("Connected");
  const db = client.db(`soum-${prefix}`);
  console.log("Updating collection products unset field search_sync ...");
  await db
    .collection("products")
    .updateMany({}, { $unset: { search_sync: 1 } });
  console.log("Updated collection products unset field search_sync ...");
};

updateEnvPrefixSetting().then(() => {
  return process.exit(0);
});
