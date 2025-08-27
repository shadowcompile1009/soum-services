const { MongoClient } = require("mongodb");
const url = process.env["MONGO_CONNECTION_STRING"],
  cleanUpDB = process.env["CLEAN_UP_DB"];
const client = new MongoClient(url);
const sha512 = require("crypto-js/sha512");
const hexEncoder = require("crypto-js/enc-hex");

const cleanCollections = async () => {
  try {
    console.log("Started cleaning Collections");

    await client.connect();

    const db = client.db(cleanUpDB);

    const collections = [
      "paymentLogs",
      "sessions",
      "DeviceToken",
      "errorLog",
      "infoLog",
      "paymentLogs",
      "referralLog",
      "VariantMap",
    ];

    for (const collection of collections) {
      await db.collection(collection).deleteMany({});
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const cleanIBANs = async () => {
  try {
    console.log("Started cleaning IBANs");

    await client.connect();

    const db = client.db(cleanUpDB);

    const collection = db.collection("PayoutHistory");

    let skip = 0,
      results;

    while (true) {
      results = await collection
        .aggregate(
          [
            { $skip: skip },
            { $limit: 1000 },
            { $project: { _id: 1, iban: 1 } },
          ],
          {
            allowDiskUse: true,
          }
        )
        .toArray();

      if (results.length === 0) break;

      for (let i = 0; i < results.length; i++) {
        await collection.updateOne(
          {
            _id: results[i]._id,
          },
          {
            $set: {
              iban: hexEncoder.stringify(sha512(results[i].iban)),
            },
          }
        );
      }

      skip += 1000;
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const cleanUsers = async () => {
  try {
    console.log("Started cleaning users");

    await client.connect();

    const db = client.db(cleanUpDB);

    const collection = db.collection("users");

    let skip = 0,
      results;

    while (true) {
      results = await collection
        .aggregate(
          [
            { $skip: skip },
            { $limit: 1000 },
            { $project: { _id: 1, mobileNumber: 1 } },
          ],
          {
            allowDiskUse: true,
          }
        )
        .toArray();

      if (results.length === 0) break;

      for (let i = 0; i < results.length; i++) {
        await collection.updateOne(
          {
            _id: results[i]._id,
          },
          {
            $set: {
              mobileNumber: hexEncoder.stringify(
                sha512(results[i].mobileNumber)
              ),
              token: [],
            },
          }
        );
      }

      skip += 1000;
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const cleanAdminPasswords = async () => {
  try {
    console.log("Started cleaning admin passwords");

    await client.connect();

    await client
      .db(cleanUpDB)
      .collection("admins")
      .updateMany(
        {},
        {
          $set: {
            password: "",
            token: "",
          },
        }
      );
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const cleanDB = async () => {
  await cleanAdminPasswords();
  console.log("Finished Cleaning Admin Passwords");

  await cleanUsers();

  console.log("Finished Cleaning Users");

  await cleanIBANs();

  console.log("Finished Cleaning IBANs");

  await cleanCollections();

  console.log("Finished Cleaning Collections");
};

cleanDB().then(() => {
  return process.exit(0);
});
