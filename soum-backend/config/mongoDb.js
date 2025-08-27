const promiseRetry = require("promise-retry");

const mongoose = require("mongoose");

const db = mongoose.connection;

db.once("open", () => {
  console.log("mongo db connection established");
});

class Database {
  constructor() {
    this.dbURI = process.env.MONGODB_URI;
    mongoose.Promise = global.Promise;
  }

  connect() {
    const options = {
      autoIndex: false,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 500,
      bufferMaxEntries: 0
    };

    const promiseRetryOptions = {
      retries: 60,
      factor: 1.5,
      minTimeout: 1000,
      maxTimeout: 5000,
    };

    return promiseRetry(
      (retry) =>
        mongoose.connect(this.dbURI, options).catch((e) => {
          console.error(e);
          retry(e);
        }),
      promiseRetryOptions
    );
  }
}

module.exports = Database;
