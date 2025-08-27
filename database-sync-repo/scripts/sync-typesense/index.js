const Typesense = require("typesense");
const fs = require("fs");

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

const createCollection = async (client, indexKey, collectionPrefixName) => {
  if (collectionPrefixName === "products") {
    const productionCollectionSchema = await productionClient
      .collections(`${collectionPrefixName}_production-${process.env.COUNTRY}`)
      .retrieve();

    const productsSchema = {
      ...productionCollectionSchema,
      name: indexKey,
    };

    if ("num_documents" in productsSchema) {
      delete productsSchema.num_documents;
    }

    if ("created_at" in productsSchema) {
      delete productsSchema.created_at;
    }

    return new Promise((resolve, reject) => {
      client
        .collections()
        .create(productsSchema)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  if (collectionPrefixName === "suggest") {
    const suggestSchema = {
      name: indexKey,
      enable_nested_fields: false,
      fields: [
        {
          name: "q",
          type: "string",
          facet: false,
          index: true,
          optional: false,
        },
        {
          name: "count",
          type: "int32",
          sort: true,
          index: true,
          facet: false,
          optional: false,
        },
      ],
    };

    const ruleConfiguration = {
      type: "popular_queries",
      params: {
        source: {
          collections: [
            `products_${process.env.ENVIRONMENT}-${process.env.COUNTRY}`,
          ],
        },
        destination: {
          collection: indexKey,
        },
        expand_query: false,
        limit: 1000,
      },
    };

    return new Promise((resolve, reject) => {
      client
        .collections()
        .create(suggestSchema)
        .then(() => {
          return client.analytics.rules().upsert(indexKey, ruleConfiguration);
        })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
};

const migrateProducts = async (collectionPrefixName) => {
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

  const collectionName = `${collectionPrefixName}_${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

  console.log("Syncing collectionName", collectionName);

  const exists = await stagingClient.collections(collectionName).exists();

  console.log("Check if collection exists", collectionName, "exists", exists);

  if (exists) {
    await stagingClient.collections(collectionName).delete();
  }

  console.log("Creating collection", collectionName);
  await createCollection(stagingClient, collectionName, collectionPrefixName);

  if (collectionPrefixName === "suggest") {
    console.log("Skip import for suggest collection");
    return;
  }

  const result = JSON.parse(
    fs
      .readFileSync(
        `./${collectionPrefixName}-${process.env.COUNTRY}-latest.json`
      )
      .toString("utf-8")
  );

  console.log("Importing documents", result.length);

  await new Promise((resolve) => {
    stagingClient
      .collections(collectionName)
      .documents()
      .import(result, { action: "create" })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        resolve(error);
      });
  });

  console.log("Documents imported", result.length);
};

const runMigration = async () => {
  const collectionNames = ["products", "suggest"];

  for (const collectionName of collectionNames) {
    await migrateProducts(collectionName);
  }
};

runMigration().catch((error) => {
  console.error(error);

  throw error;
});
