const Typesense = require("typesense");

const cleanCollection = async () => {
  const client = new Typesense.Client({
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

  const collections = ["products", "suggest"];

  for (const collection of collections) {
    const collectionName = `${collection}_${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

    const exists = await client.collections(collectionName).exists();

    if (!exists) {
      return;
    }

    await client.collections(collectionName).delete();
  }
};

cleanCollection().then(() => {
  return process.exit(0);
});
