const { createClient } = require("@clickhouse/client");

const prefix = `${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

const createClickhouseDatabase = async () => {
  const commonConfig = {
    host: process.env.CLICKHOUSE_HOST,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
  };

  const database = `activity-log-${prefix}-db`;

  const databaseClient = createClient({
    ...commonConfig,
  });

  await databaseClient.exec({
    query: `DROP DATABASE IF EXISTS "activity-log-${prefix}-db"`,
  });

  await databaseClient.exec({
    query: `CREATE DATABASE IF NOT EXISTS "${database}"`,
  });

  const tableClient = createClient({
    ...commonConfig,
    database,
  });

  await tableClient.exec({
    query: `
      CREATE TABLE IF NOT EXISTS activitylogs
      (
        userId String,
        username String,
        orderId String,
        orderNumber String,
        eventType String,
        module String,
        topic String,
        action String,
        version String,
        createdAt String,
        updatedAt String,
      )
      ENGINE MergeTree()
      ORDER BY (createdAt)
    `,
  });

  await tableClient.exec({
    query: `
      CREATE TABLE IF NOT EXISTS commissionactivitylogs
      (
        actionType String,
        module String,
        commissionModuleType String,
        commissionName String,
        actionDate String,
        userName String,
        createdAt String,
        updatedAt String,
      )
      ENGINE MergeTree()
      ORDER BY (createdAt)
    `,
  });

  await tableClient.exec({
    query: `
      CREATE TABLE IF NOT EXISTS paymentactivitylogs
      (
        userName String,
        orderId String,
        createdAt String,
        updatedAt String,
        actionDate String,
        productId String,
        soumNumber String,
        mobileNumber String,
        errorMessage String,
        paymentErrorId String,
        paymentProvidor String,
        paymentProvidorType String,
        amount String,
        sourcePlatform String,
      )
      ENGINE MergeTree()
      ORDER BY (createdAt)
    `,
  });
  
};



createClickhouseDatabase().then(() => {
  return process.exit(0);
});
