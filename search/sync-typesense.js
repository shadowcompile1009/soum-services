const Typesense = require('typesense');

const createCollection = async (client, indexKey) => {
  const productsSchema = {
    name: indexKey,
    enable_nested_fields: true,
    fields: [
      { name: '.*', type: 'auto' },
      { name: 'price_range', type: 'auto', facet: true, optional: true },
      { name: 'originalPrice', type: 'float', optional: true },
      { name: 'sellPrice', type: 'float', facet: true, optional: true },
      { name: 'condition', type: 'object', facet: false, optional: true },
    ],
  };

  return new Promise((resolve) => {
    client
      .collections()
      .create(productsSchema)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

const migrateProducts = async () => {
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

  const collectionName = 'products_' + process.env.PREFIX;

  const exists = await client.collections(collectionName).exists();

  if (exists) {
    return;
  }

  const docs = await client
    .collections('products_staging-sa')
    .documents()
    .export();

  const colDocs = docs.split('\n');

  const result = [];

  colDocs.forEach((line) => {
    try {
      const obj = JSON.parse(line);
      result.push(obj);
    } catch (error) {
      console.error(`Error parsing JSON: ${line}`);
    }
  });

  await createCollection(client, collectionName);

  await new Promise((resolve) => {
    client
      .collections(collectionName)
      .documents()
      .import(result, { action: 'create' })
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        resolve(error);
      });
  });
};

migrateProducts().then(() => {
  return process.exit(0);
});
