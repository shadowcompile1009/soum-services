const Typesense = require("typesense");

const cleanAllTypesense = async () => {
  const stagingClient = new Typesense.Client({
    nodes: [
      {
        host: process.env.DEVELOPMENT_TYPESENSE_HOST,
        port: parseInt(process.env.DEVELOPMENT_TYPESENSE_PORT),
        protocol: process.env.DEVELOPMENT_TYPESENSE_PROTOCOL,
      },
    ],
    apiKey: process.env.DEVELOPMENT_TYPESENSE_API_KEY,
    connectionTimeoutSeconds: 36000,
  });

  const collections = await stagingClient.collections().retrieve();

  for (const collection of collections) {
    const collectionName = collection.name;
    console.log("Deleting collection", collectionName);
    await stagingClient.collections(collectionName).delete();
  }
};

cleanAllTypesense()
  .then(() => {
    return process.exit(0);
  })
  .catch((error) => console.error(error));
