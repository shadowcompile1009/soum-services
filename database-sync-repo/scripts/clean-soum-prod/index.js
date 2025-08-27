const { MongoClient } = require("mongodb");
const url = process.env["MONGO_CONNECTION_STRING"],
  cleanUpDB = process.env["CLEAN_UP_DB"];
const client = new MongoClient(url);
const sha512 = require("crypto-js/sha512");
const hexEncoder = require("crypto-js/enc-hex");

const cleanCollections = async () => {
  try {
    console.log("Started cleaning Collections");

    const db = client.db(cleanUpDB);

    const collections = [
      "paymentLogs",
      "sessions",
      "DeviceToken",
      "referralLog",
      "errorLog",
      "infoLog",
      "notifications",
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

const cleanAdmins = async () => {
  try {
    console.log("Started cleaning admins");

    const testAdminsCollection = client.db("soum-test").collection("admins");

    const testAdminResults = await testAdminsCollection.aggregate([]).toArray();

    const cleanUpDBAdminsCollection = client.db(cleanUpDB).collection("admins");

    await cleanUpDBAdminsCollection.deleteMany({});

    for (let i = 0; i < testAdminResults.length; i++) {
      await cleanUpDBAdminsCollection.insertOne(testAdminResults[i]);
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const cleanUsers = async () => {
  try {
    console.log("Started cleaning users");

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
        let x = skip + i + 11111;

        let mobileNumber = ["505594790", "505594790"].includes(
          results[i].mobileNumber
        )
          ? results[i].mobileNumber
          : `111111${x.toString().padStart(6 - x.toString().length, "0")}`;

        if (mobileNumber === "11111111123") {
          mobileNumber = "1111111123";
        }

        await collection.updateOne(
          {
            _id: results[i]._id,
          },
          {
            $set: {
              mobileNumber,
              userType: "Dummy",
              token: "",
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

const cleanDeltaMachineUsers = async () => {
  try {
    console.log("Started cleaning delta machine users");

    const collection = client.db(cleanUpDB).collection("DeltaMachineUsers");

    await collection.insertOne({
      status: "Active",
      createdAt: new Date(1667980579444),
      updatedAt: new Date(1667980579444),
      username: "test-automation-user",
      phoneNumber: "",
      email: "",
      roleId: "83ba4948-2422-4f31-b6c5-28bfd77852bf",
      password: "$2b$10$KJQuTYrFb/zkb/dALcoDTuf6.B3n5AALmg9vYzXxpnolgJSNSKEoy",
      createdBy: "",
      __v: 0,
      refreshToken: "",
      token: "",
    });
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const cleanUnneededData = async () => {
  try {
    console.log("Started cleaning Unneeded data");

    const oneMonthAgo = new Date(new Date().setDate(new Date().getDate() - 31));

    // await client
    //   .db(cleanUpDB)
    //   .collection("Response")
    //   .deleteMany({
    //     created_date: {
    //       $lte: oneMonthAgo,
    //     },
    //   });

    await client
      .db(cleanUpDB)
      .collection("fraudproducts")
      .deleteMany({
        created_date: {
          $lte: oneMonthAgo,
        },
      });

    await client
      .db(cleanUpDB)
      .collection("Invoice")
      .deleteMany({
        created_at: {
          $lte: oneMonthAgo,
        },
      });

    await client
      .db(cleanUpDB)
      .collection("orders")
      .deleteMany({
        created_at: {
          $lte: oneMonthAgo,
        },
      });

    // await client
    //   .db(cleanUpDB)
    //   .collection("Payment")
    //   .deleteMany({
    //     created_date: {
    //       $lte: oneMonthAgo,
    //     },
    //   });
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateSettings = async () => {
  await client
    .db(cleanUpDB)
    .collection("Setting")
    .updateOne(
      { name: "ENV_PREFIX" },
      {
        $set: {
          value: "staging-sa",
          status: "Enabled",
          name: "ENV_PREFIX",
          description: "Current environment",
          type: "string",
          setting_category: "Global",
        },
      },
      { upsert: true }
    );

  await client
    .db(cleanUpDB)
    .collection("Setting")
    .updateOne(
      { name: "ALGOLIA_PRODUCTS_INDEX" },
      {
        $set: {
          value: `products_staging-sa`,
          status: "Enabled",
          name: "ALGOLIA_PRODUCTS_INDEX",
          description: "products index",
          type: "string",
          setting_category: "Global",
        },
      },
      { upsert: true }
    );

  await client
    .db(cleanUpDB)
    .collection("Setting")
    .updateOne(
      { name: "ALGOLIA_SUGGEST_INDEX" },
      {
        $set: {
          value: `suggest_staging-sa`,
          status: "Enabled",
          name: "ALGOLIA_SUGGEST_INDEX",
          description: "product suggestions",
          type: "string",
          setting_category: "Global",
        },
      },
      { upsert: true }
    );
};

const cleanDB = async () => {
  console.log("Connecting ...");

  await client.connect();
  console.log("Connected");

  await cleanUnneededData();
  console.log("Cleaned Unneeded Data");

  await cleanCollections();

  console.log("Finished Cleaning Collections");

  await cleanUsers();

  console.log("Finished Cleaning Users");

  await cleanAdmins();

  console.log("Finished Cleaning Admins");

  await cleanIBANs();

  console.log("Finished Cleaning IBANs");

  await cleanDeltaMachineUsers();

  console.log("Finished Cleaning Collections");

  await updateSettings();

  console.log("Finished Updating Settings");
};

cleanDB().then(() => {
  return process.exit(0);
});
