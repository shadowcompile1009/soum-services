const Typesense = require("typesense");
const fs = require("fs");

const snapshotTypeSenseCollection = async (collectionName) => {
  try {
    const productionClient = new Typesense.Client({
      nodes: [
        {
          host: process.env.PRODUCTION_TYPESENSE_HOST,
          port: parseInt(process.env.PRODUCTION_TYPESENSE_PORT),
          protocol: process.env.PRODUCTION_TYPESENSE_PROTOCOL,
        },
      ],
      apiKey: process.env.PRODUCTION_TYPESENSE_API_KEY,
      connectionTimeoutSeconds: 36000,
    });

    const docs = await productionClient
      .collections(`${collectionName}_production-${process.env.COUNTRY}`)
      .documents()
      .export();

    console.log("Docs exported", docs.length);

    const colDocs = docs.split("\n");

    const result = [];

    colDocs.forEach((line) => {
      try {
        const obj = JSON.parse(line);
        result.push(obj);
      } catch (error) {
        console.error(`Error parsing JSON: ${line}`);
      }
    });

    console.log("Exported documents", result.length);

    const path = `./${collectionName}-${process.env.COUNTRY}-latest.json`;

    fs.writeFileSync(path, JSON.stringify(result));

    console.log("Snapshot created", path);
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

const snapshotTypeSenseCollections = async () => {
  const collectionNames = ["products"];

  for (const collectionName of collectionNames) {
    await snapshotTypeSenseCollection(collectionName);
  }
};

snapshotTypeSenseCollections().catch((error) => {
  console.error(error);

  throw error;
});
