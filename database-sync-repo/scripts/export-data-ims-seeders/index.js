const { MongoClient, ObjectId } = require("mongodb");
const { EJSON } = require("bson");

const { writeFileSync } = require("fs");

const url = process.env["MONGO_CONNECTION_STRING"];

const client = new MongoClient(url);

const prefix =
  process.env.DATABASE ?? `${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

const exportPath = process.env.EXPORT_PATH;

const exportAndSave = async (db, collection, file, match) => {
  console.log(`Exporting ${collection} ...`);
  const categories = await db
    .collection(collection)
    .aggregate([{ $match: match }], { allowDiskUse: true })
    .toArray();
  writeFileSync(`${exportPath}/${file}`, EJSON.stringify(categories));
  console.log(`Exported ${collection}`);
};

const exportDataForIMSSeeders = async () => {
  console.log("Connecting ...");
  await client.connect();
  console.log("Connected");
  const db = client.db(`soum-${prefix}`);
  await exportAndSave(db, "categories", "ims-categories.json", {
    status: "Active",
  });
  await exportAndSave(db, "brands", "ims-brands.json", {
    status: "Active",
    _id: { $ne: new ObjectId("6315de62276cdd00219ebbd3") },
  });
  await exportAndSave(db, "device_models", "ims-models.json", {
    status: "Active",
  });
  await exportAndSave(db, "varients", "ims-variants.json", {
    status: "Active",
  });
  await exportAndSave(db, "Attribute", "ims-attributes.json", {
    status: "Active",
  });
  await exportAndSave(db, "users", "ims-merchants.json", {
    status: "Active",
    isMerchant: true,
  });
};

exportDataForIMSSeeders().then(() => {
  return process.exit(0);
});
