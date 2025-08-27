const { createClient } = require("@clickhouse/client");

const prefix = `${process.env.ENVIRONMENT}-${process.env.COUNTRY}`;

const dropClickhouseDatabase = async () => {
  const client = createClient({
    host: process.env.CLICKHOUSE_HOST,
    username: process.env.CLICKHOUSE_USER,
    password: process.env.CLICKHOUSE_PASSWORD,
  });

  await client.exec({
    query: `DROP DATABASE IF EXISTS "activity-log-${prefix}-db"`,
  });
};

dropClickhouseDatabase().then(() => {
  return process.exit(0);
});
