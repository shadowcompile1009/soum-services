const { MongoClient, ObjectId } = require("mongodb");
const sha512 = require("crypto-js/sha512");
const hexEncoder = require("crypto-js/enc-hex");
const flatObj = require("flat-obj");
const merge = require("deepmerge");
const unflatten = require("unflatten");

const productionClient = new MongoClient(
  process.env["PRODUCTION_MONGO_CONNECTION_STRING"],
  {
    readPreference: "secondary",
  }
);

const analyticsClient = new MongoClient(
  process.env["ANALYTICS_MONGO_ATLAS_MONGO_CONNECTION_STRING"]
);

const portalClient = new MongoClient(
  process.env["PORTAL_MONGO_CONNECTION_STRING"]
);

const databaseToSync = [
  "soum-prod",
  "soum-production-wallet",
  "soum-production-sa-commission",
  "soum-production-sa-bid",
  "soum-production-sa-homepage",
  "soum-production-sa-merchant",
  "soum-production-sa-review",
];

const collectionsToIgnore = {
  "soum-prod": [
    "paymentLogs",
    "sessions",
    "DeviceToken",
    "errorLog",
    "infoLog",
    "paymentLogs",
    "referralLog",
    "VariantMap",
  ],
};

const isDateValid = (dateStr) => {
  return /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/.test(
    dateStr
  );
};

const syncChanges = async () => {
  try {
    console.log("Connecting to production database ...");
    await productionClient.connect();
    console.log("Connected to production database");

    console.log("Connecting to analytics database ...");
    await analyticsClient.connect();
    console.log("Connected to analytics database");

    console.log("Connecting to portal database ...");
    await portalClient.connect();
    console.log("Connected to portal database");

    const portalDB = portalClient.db("soum-web-portal");

    const lastAnalyticsSyncCollection = portalDB.collection("AnalyticsSync");

    const result = await lastAnalyticsSyncCollection.findOne(
      {},
      {
        sort: {
          lastSync: -1,
        },
      }
    );

    const now = new Date();

    let lastSync = result
      ? result.lastSync
      : new Date(
          now.getUTCFullYear(),
          now.getUTCMonth(),
          now.getUTCDate(),
          now.getUTCHours(),
          now.getUTCMinutes(),
          0,
          0
        );

    console.log("last analytics sync", lastSync.toISOString());

    const productionDB = productionClient.db("local");

    const oplogRSCollection = productionDB.collection("oplog.rs");

    const replicationEvents = await oplogRSCollection
      .aggregate(
        [
          {
            $match: {
              $and: [
                {
                  $or: databaseToSync.map((database) => {
                    return {
                      ns: { $regex: `${database}.*`, $options: "i" },
                    };
                  }),
                },
                {
                  wall: {
                    $gte: lastSync,
                  },
                },
                {
                  $or: [
                    {
                      op: "i",
                    },
                    {
                      op: "u",
                    },
                    {
                      op: "d",
                    },
                  ],
                },
              ],
            },
          },
          {
            $project: {
              _id: 0,
              op: 1,
              wall: 1,
              o: 1,
              ns: 1,
              o2: 1,
            },
          },
          {
            $sort: {
              wall: 1,
            },
          },
        ],
        {
          allowDiskUse: true,
        }
      )
      .toArray();

    const parseReplicationObject = (replicationEvent) => {
      if (["i", "d"].includes(replicationEvent.op)) {
        return replicationEvent;
      }

      const { o, ...restReplicationEvent } = replicationEvent;

      const { diff, ...restO } = o;

      const obj = flatObj(diff, ".");

      const u = {},
        d = {};

      for (const key in obj) {
        const value = obj[key];

        if (key.startsWith("i.") || key.startsWith("u.")) {
          u[key.replace("i.", "").replace("u.", "")] = value;
        } else if (key.startsWith("d.")) {
          d[key.replace("d.", "")] = value;
        } else {
          if (key.endsWith(".a")) {
            continue;
          }

          const type = key.includes(".i.") || key.includes(".u.") ? "u" : "d";

          const [toReplace, okay] = key.includes(".i.")
            ? key.split(".i.")
            : key.includes(".u.")
            ? key.split(".u.")
            : key.split(".d.");

          const parsedKey = `${toReplace
            .split(".")
            .map((subKey) => {
              if (subKey.startsWith("s")) {
                const letters = subKey.split("");

                letters.shift();

                return letters.join("");
              }

              return subKey;
            })
            .join(".")}.${okay}`;

          if (type === "u") {
            u[parsedKey] = value;
          } else {
            d[parsedKey] = value;
          }
        }
      }

      return {
        ...restReplicationEvent,
        o: {
          ...restO,
          diff: {
            ...(u ? { u } : {}),
            ...(d ? { d } : {}),
          },
        },
      };
    };

    const parseValue = (value) => {
      if (typeof value === "string") {
        if (ObjectId.isValid(value)) {
          return new ObjectId(value.toString());
        } else if (isDateValid(value)) {
          return new Date(value);
        } else {
          return value;
        }
      } else if (typeof value === "object") {
        if (Array.isArray(value)) {
          return parseArr(value);
        } else {
          return parseObj(value);
        }
      } else {
        return value;
      }
    };

    const parseObj = (obj) => {
      const parsedReplicationEventObject = {};

      for (const prop in obj) {
        parsedReplicationEventObject[prop] = parseValue(obj[prop]);
      }

      return parsedReplicationEventObject;
    };

    const parseArr = (arr) => {
      return arr.map((item) => parseValue(item));
    };

    const defaultOperation = async (replicationEvent) => {
      try {
        const [databaseName, collectionName] = replicationEvent.ns.split(".");

        const collection = analyticsClient
          .db(databaseName)
          .collection(collectionName);

        if (replicationEvent.op === "i") {
          const { _id, ...rest } = replicationEvent.o;

          const result = await collection
            .insertOne({ _id, ...rest })
            .catch(() => {
              return undefined;
            });

          if (!result) {
            await collection.updateOne(
              {
                _id,
              },
              {
                $set: rest,
              }
            );
          }
        } else if (replicationEvent.op === "u") {
          const { i, u, d } = replicationEvent.o.diff;

          if (d) {
            await collection.updateOne(
              {
                _id: replicationEvent.o2._id,
              },
              {
                $unset: d,
              }
            );
          }

          if (i || u) {
            const result = await collection.findOne({
              _id: replicationEvent.o2._id,
            });

            const obj = parseObj(
              merge(
                JSON.parse(JSON.stringify(result)),
                JSON.parse(
                  JSON.stringify(
                    unflatten({
                      ...(i ?? {}),
                      ...(u ?? {}),
                    })
                  )
                )
              )
            );

            const { _id, ...data } = obj;

            await collection.updateOne(
              {
                _id,
              },
              {
                $set: data,
              }
            );
          }
        } else {
          const { _id } = replicationEvent.o;

          await collection.deleteOne({
            _id,
          });
        }
      } catch (error) {
        console.log("replicationEvent", JSON.stringify(replicationEvent));

        throw error;
      }
    };

    const operationMapping = {
      "soum-prod.admins": {
        i: {
          operation: (replicationEvent) => {
            const { o, ...rest } = replicationEvent;

            return {
              ...rest,
              o: {
                ...o,
                ...(o.password ? { password: "" } : {}),
                ...(o.token ? { token: "" } : {}),
              },
            };
          },
        },
        u: {
          operation: (replicationEvent) => {
            const { o, ...restReplicationEvent } = replicationEvent;

            const { diff, ...restO } = o;

            const parsedDiff = {};

            const keys = Object.keys(diff);

            for (const key of keys) {
              let value = diff[key];

              if (!["i", "u"].includes(key)) {
                parsedDiff[key] = value;
                continue;
              }

              if ("password" in value) {
                value = {
                  ...value,
                  password: "",
                };
              }

              if ("token" in value) {
                value = {
                  ...value,
                  token: "",
                };
              }

              parsedDiff[key] = value;
            }

            return {
              ...restReplicationEvent,
              o: {
                ...restO,
                diff: parsedDiff,
              },
            };
          },
        },
      },
      "soum-prod.PayoutHistory": {
        i: {
          operation: (replicationEvent) => {
            const { o, ...rest } = replicationEvent;

            return {
              ...rest,
              o: {
                ...o,
                ...(o.iban
                  ? { iban: hexEncoder.stringify(sha512(o.iban)) }
                  : {}),
              },
            };
          },
        },
        u: {
          operation: (replicationEvent) => {
            const { o, ...restReplicationEvent } = replicationEvent;

            const { diff, ...restO } = o;

            const parsedDiff = {};

            const keys = Object.keys(diff);

            for (const key of keys) {
              let value = diff[key];

              if (!["i", "u"].includes(key)) {
                parsedDiff[key] = value;
                continue;
              }

              if ("iban" in value) {
                value = {
                  ...value,
                  iban: hexEncoder.stringify(sha512(value.iban)),
                };
              }

              parsedDiff[key] = value;
            }

            return {
              ...restReplicationEvent,
              o: {
                ...restO,
                diff: parsedDiff,
              },
            };
          },
        },
      },
      "soum-prod.users": {
        i: {
          operation: (replicationEvent) => {
            const { o, ...rest } = replicationEvent;

            return {
              ...rest,
              o: {
                ...o,
                ...(o.mobileNumber
                  ? {
                      mobileNumber: hexEncoder.stringify(
                        sha512(o.mobileNumber)
                      ),
                    }
                  : {}),
                ...(o.token
                  ? { token: hexEncoder.stringify(sha512(o.token)) }
                  : {}),
              },
            };
          },
        },
        u: {
          operation: (replicationEvent) => {
            const { o, ...restReplicationEvent } = replicationEvent;

            const { diff, ...restO } = o;

            const parsedDiff = {};

            const keys = Object.keys(diff);

            for (const key of keys) {
              let value = diff[key];

              if (!["i", "u"].includes(key)) {
                parsedDiff[key] = value;
                continue;
              }

              if ("mobileNumber" in value) {
                value = {
                  ...value,
                  mobileNumber: hexEncoder.stringify(
                    sha512(value.mobileNumber)
                  ),
                };
              }

              if ("token" in value) {
                value = {
                  ...value,
                  [key]: [],
                };
              }

              parsedDiff[key] = value;
            }

            return {
              ...restReplicationEvent,
              o: {
                ...restO,
                diff: parsedDiff,
              },
            };
          },
        },
      },
    };

    for (const replicationEvent of replicationEvents) {
      lastSync = replicationEvent.wall;

      try {
        const [databaseName, collectionName] = replicationEvent.ns.split(".");

        if (!databaseName.startsWith("soum-")) {
          continue;
        }

        if (
          collectionsToIgnore[databaseName] &&
          collectionsToIgnore[databaseName].includes(collectionName)
        ) {
          continue;
        }

        let copyOfReplicationEvent = parseObj(
          parseReplicationObject(JSON.parse(JSON.stringify(replicationEvent)))
        );

        if (
          operationMapping[replicationEvent.ns] &&
          operationMapping[replicationEvent.ns][replicationEvent.op]
        ) {
          copyOfReplicationEvent = operationMapping[replicationEvent.ns][
            replicationEvent.op
          ].operation(copyOfReplicationEvent);
        }

        await defaultOperation(copyOfReplicationEvent);
      } catch (error) {
        console.warn("Failed to sync event", error);
      }
    }

    console.log("Updating last sync to", lastSync.toISOString());

    await lastAnalyticsSyncCollection.insertOne({
      lastSync,
    });
  } catch (error) {
    console.error(error);

    throw error;
  }
};

syncChanges().then(() => {
  return process.exit(0);
});
