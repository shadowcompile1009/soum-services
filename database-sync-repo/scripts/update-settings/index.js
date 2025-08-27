const { MongoClient } = require("mongodb");

const url = process.env["MONGO_CONNECTION_STRING"];

const client = new MongoClient(url);

const prefix = `${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

const updateEnvPrefixSetting = async () => {
  console.log("Connecting ...");
  await client.connect();
  console.log("Connected");
  const db = client.db(`soum-${prefix}`);
  console.log("Updating collection Settings ...");
  await db.collection("Setting").updateOne(
    { name: "ENV_PREFIX" },
    {
      $set: {
        value: prefix,
        status: "Enabled",
        name: "ENV_PREFIX",
        description: "Current environment",
        type: "string",
        setting_category: "Global",
      },
    },
    { upsert: true }
  );

  await db.collection("Setting").updateOne(
    { name: "ALGOLIA_PRODUCTS_INDEX" },
    {
      $set: {
        value: `products_${prefix}`,
        status: "Enabled",
        name: "ALGOLIA_PRODUCTS_INDEX",
        description: "products index",
        type: "string",
        setting_category: "Global",
      },
    },
    { upsert: true }
  );

  await db.collection("Setting").updateOne(
    { name: "ALGOLIA_SUGGEST_INDEX" },
    {
      $set: {
        value: `suggest_${prefix}`,
        status: "Enabled",
        name: "ALGOLIA_SUGGEST_INDEX",
        description: "product suggestions",
        type: "string",
        setting_category: "Global",
      },
    },
    { upsert: true }
  );

  console.log("Updated collection Settings ...");
};

updateEnvPrefixSetting().then(() => {
  return process.exit(0);
});
