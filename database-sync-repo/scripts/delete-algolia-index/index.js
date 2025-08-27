const algoliasearch = require("algoliasearch");

const prefix = `${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

const dropProductsAlgoliaIndex = async () => {
  try {
    const client = algoliasearch(
      process.env.ALGOLIA_APP_ID,
      process.env.ALGOLIA_API_KEY
    );

    const productsIndex = client.initIndex(`products_${prefix}`);
    await productsIndex.delete();
  } catch (error) {
    console.log("DropProductsAlgoliaIndexError", error);
  }
};

dropProductsAlgoliaIndex().then(() => {
  return process.exit(0);
});
