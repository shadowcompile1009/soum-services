const helper = {};
var d = new Date();
var request = require("request");
var moment = require("moment");
var moment1 = require("moment-timezone");
var date = moment.utc(d).toDate();
var path = require("path");
var directories = path.dirname("views");
var ejs = require("ejs");
var jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const chalk = require("chalk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const https = require("https");
const querystring = require("querystring");
const UserModel = require("../models/UserModel");
const ProductModel = require("../models/ProductModel");
const OrderModel = require("../models/OrderModel");
const mongoose = require("mongoose");
const sgMail = require("@sendgrid/mail");
var cryptoJS = require("crypto-js");
const paymentLogs = require("../models/log/PaymentLogs");
const InfoLogDAL = require("../Data/log/InfoLogDAL");
const axios = require("axios");
const bullMQ = require("../utils/bullmq");
const { v4: uuidv4 } = require("uuid");

helper.bidStatus = {
  PENDING: "pending",
  ACTIVE: "active",
  FAILED: "failed",
  DELETED: "deleted",
  EXPIRED: "expired",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  PAID: "paid",
  REFUNDED: "refunded",
};

helper.constDays = {
  DaysToBeExpired: 7,
};

helper.paymentStatus = {
  PENDING: "Pending",
  SUCCESS: "Success",
  FAIL: "Fail",
};

helper.statusResources = {
  PAYMENT_PROVIDER: "PaymentProvider",
  REQUEST: "Request",
};

function getEntityId(cardType) {
  let entityId;
  if (cardType == "MADA") {
    entityId = ENV.MADA_ENTITY_ID;
  } else if (cardType == "APPLEPAY") {
    entityId = ENV.APPLE_ENTITY_ID;
  } else if (cardType == "STC_PAY") {
    entityId = ENV.STC_ENTITY_ID;
  } else if (cardType == "URPAY") {
    entityId = ENV.UR_PAY_ENTITY_ID;
  } else {
    entityId = ENV.VISA_ENTITY_ID;
  }
  return entityId;
}

helper.response = function (response, status_code, message, data) {
  var ret = {
    code: status_code,
    message: message,
  };
  if (data) {
    Object.assign(ret, data);
  }
  return response.status(status_code).json(ret);
};

helper.upload_space = function (filepath) {
  let s3Options = {};
  if (!ENV.AWS_WEB_IDENTITY_TOKEN_FILE) {
    s3Options = {
      accessKeyId: ENV.AWS_ACCESS_KEY,
      secretAccessKey: ENV.AWS_SECRET_KEY,
      sessionToken: ENV.AWS_SESSION_TOKEN,
    };
  }
  const s3 = new aws.S3(s3Options);

  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: ENV.AWS_BUCKET + "/" + filepath,
      acl: "private",
      contentType: multerS3.AUTO_CONTENT_TYPE,
      location: ENV.AWS_CDN_ENDPOINT,
      key: function (request, file, cb) {
        //console.log("file--->>>", file);
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        var fileExt = path.extname(file.originalname);
        var fileName = file.originalname;
        fileName = fileName.split(".");
        fileName = fileName[0];
        //fileName.splice(-1, 1);
        //fileName.join('');
        fileName = fileName.replace(" ", "-");
        fileName = fileName + "-" + new Date().getTime();
        var data = fileName + fileExt;
        cb(null, data);
      },
    }),
  });

  return upload;
};

helper.send_otp = async function (countryCode, mobileNumber, locale, cb) {
  var mobileNumber = "+" + countryCode + mobileNumber;
  var options = {
    method: "POST",
    url: `${ENV.UNIFONIC_BASE_URL}/services/api/v2/verifications/start`,
    headers: {
      "x-authenticate-app-id": ENV.UNIFONIC_APP_ID,
      Authorization: `Bearer ${ENV.UNIFONIC_AUTH_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      to: mobileNumber,
      channel: "sms",
      locale: locale,
      length: "6",
    },
  };
  request(options, async function (error, response) {
    if (error) {
      await InfoLogDAL.Log(error, "SMS_OTP_FAIL");
      cb(error);
    } else {
      console.log("response.body is::", response.body);
      await InfoLogDAL.Log(response.body, "SMS_OTP_SENT");
      cb(response.body);
    }
  });
};

helper.verify_otp = function (countryCode, mobileNumber, otp, cb) {
  var mobileNumber = "+" + countryCode + mobileNumber;
  var options = {
    method: "POST",
    url: `${ENV.UNIFONIC_BASE_URL}/services/api/v2/verifications/check`,
    headers: {
      "x-authenticate-app-id": ENV.UNIFONIC_APP_ID,
      Authorization: `Bearer ${ENV.UNIFONIC_AUTH_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    form: {
      to: mobileNumber,
      channel: "sms",
      code: otp,
    },
  };
  request(options, function (error, response) {
    if (error) {
      console.log(error);
      cb(error);
    } else {
      console.log(response.body);
      cb(response.body);
    }
  });
};

helper.create_checkout = function (
  userData,
  order_number,
  userAddress,
  buy_amount,
  payment_mode,
  card_type,
  cardIds,
  currency,
  country,
  extraParams = {}
) {
  var send_amount = parseFloat(buy_amount).toFixed(2);
  const entityId = getEntityId(card_type);

  new paymentLogs({
    data: JSON.stringify({
      type: "Checkout input ",
      userData,
      order_number,
      userAddress,
      buy_amount,
      payment_mode,
      card_type,
      cardIds,
      entityId,
      env: ENV.NODE_ENV,
      url: ENV.HYPER_PAY_URL,
    }),
  }).save((error, result) => {});

  var checkoutData = {
    entityId: entityId,
    merchantTransactionId: order_number,
    amount: send_amount,
    currency: currency,
    paymentType: payment_mode,
    "billing.street1": userAddress.address.substring(0, 99),
    "billing.city": userAddress.city.substring(0, 79),
    "billing.state": userAddress.city.substring(0, 49),
    "billing.country": country,
    "billing.postcode": userAddress.postal_code.substring(0, 15),
    "customer.givenName": userData.name,
    "customer.surname": userData.name,
  };
  if (card_type == "") {
    Object.assign(checkoutData, {
      "customParameters.SHOPPER_payment_mode": "mobile",
    });
  }
  if (
    (ENV.NODE_ENV == "development" || ENV.NODE_ENV == "staging") &&
    (card_type == "VISA_MASTER" || card_type == "MADA")
  ) {
    // checkoutData.testMode = 'EXTERNAL';
    Object.assign(checkoutData, {
      'customParameters["3DS2_enrolled"]': true,
    });
  }
  if (
    (ENV.NODE_ENV == "development" || ENV.NODE_ENV == "staging") &&
    card_type == "STC_PAY"
  ) {
    Object.assign(checkoutData, { testMode: "EXTERNAL" });
  }
  if (card_type == "MADA" || card_type == "VISA_MASTER") {
    Object.assign(checkoutData, {
      "customer.mobile": "+" + userData.countryCode + userData.mobileNumber,
    });

    if (card_type == "VISA_MASTER")
      Object.assign(checkoutData, { createRegistration: true });
    Object.assign(checkoutData, cardIds);
  }

  const path = "/v1/checkouts";
  const data = querystring.stringify(checkoutData);
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          new paymentLogs({
            data: JSON.stringify({
              type: "Checkout output ",
              jsonString,
            }),
          }).save((error, result) => {});

          var res = JSON.parse(jsonString);
          resolve(res);
        } catch (error) {
          new paymentLogs({
            data: JSON.stringify({
              type: "Checkout output error ",
              error,
            }),
          }).save((error, result) => {});
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.write(data);
    postRequest.end();
  });
};

helper.create_checkout_v2 = function (
  userData,
  order_number,
  userAddress,
  buy_amount,
  payment_mode,
  card_type,
  cardIds,
  currency,
  country,
  extraParams = {}
) {
  var send_amount = parseFloat(buy_amount).toFixed(2);
  const entityId = getEntityId(card_type);

  new paymentLogs({
    data: JSON.stringify({
      type: "Checkout input ",
      userData,
      order_number,
      userAddress,
      buy_amount,
      payment_mode,
      card_type,
      cardIds,
      entityId,
      env: ENV.NODE_ENV,
      url: ENV.HYPER_PAY_URL,
    }),
  }).save((error, result) => {});

  let street;
	if(userAddress.street && userAddress.street.length >= 5){
		street = userAddress.street.substring(0, 99);
	}else{
		street = `Street${userAddress.street}`;
	}

  var checkoutData = {
    entityId: entityId,
    merchantTransactionId: order_number,
    amount: send_amount,
    currency: currency,
    paymentType: payment_mode,
    "billing.street1": street,
    "billing.city": userAddress.city.substring(0, 79),
    "billing.state": userAddress.city.substring(0, 49),
    "billing.country": country,
    "billing.postcode": userAddress.postal_code.substring(0, 15),
    "customer.givenName": userData.name,
    "customer.surname": userData.name,
  };
  if (card_type == "") {
    Object.assign(checkoutData, {
      "customParameters.SHOPPER_payment_mode": "mobile",
    });
  }
  if (
    (ENV.NODE_ENV == "development" || ENV.NODE_ENV == "staging") &&
    (card_type == "VISA_MASTER" || card_type == "MADA")
  ) {
    // checkoutData.testMode = 'EXTERNAL';
    Object.assign(checkoutData, {
      'customParameters["3DS2_enrolled"]': true,
    });
  }
  if (
    (ENV.NODE_ENV == "development" || ENV.NODE_ENV == "staging") &&
    (card_type == "STC_PAY" || card_type == "URPAY")
  ) {
    Object.assign(checkoutData, { testMode: "EXTERNAL" });
  }
  if (card_type == "STC_PAY") {
    Object.assign(checkoutData, {
      "customer.mobile": extraParams.mobileNumber,
    });
  }
  if (card_type == "MADA" || card_type == "VISA_MASTER") {
    Object.assign(checkoutData, {
      "customer.mobile": "+" + userData.countryCode + userData.mobileNumber,
    });

    if (card_type == "VISA_MASTER")
      Object.assign(checkoutData, { createRegistration: true });
    Object.assign(checkoutData, cardIds);
  }
  if (card_type == "URPAY") {
    Object.assign(checkoutData, {
      "customParameters[SHOPPER_payment_mode]": "mobile",
    });
    Object.assign(checkoutData, {
      "customer.mobile": extraParams.mobileNumber,
    });
  }
  const path = "/v1/checkouts";
  const data = querystring.stringify(checkoutData);
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          new paymentLogs({
            data: JSON.stringify({
              type: "Checkout output ",
              jsonString,
            }),
          }).save((error, result) => {});

          var res = JSON.parse(jsonString);
          resolve(res);
        } catch (error) {
          helper.log_payment_error({
            userName: userData.name,
            // orderId: order_number,
            // productId: "PROD67890",
            soumNumber: order_number,
            mobileNumber: userData.mobileNumber,
            errorMessage: "Failed To create checkout",
            paymentErrorId: uuidv4(),
            paymentProvidor: card_type,
            paymentProvidorType: "HyperPay",
            amount: send_amount,
          });
          new paymentLogs({
            data: JSON.stringify({
              type: "Checkout output error ",
              error,
            }),
          }).save((error, result) => {});
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.write(data);
    postRequest.end();
  });
};

helper.card_payment = function (bid_amount, paymentType, cardData) {
  var send_amount = parseFloat(bid_amount).toFixed(2);
  let cardNumber = "4200000000000000"; //cardData.cardNumber;
  let cardHolder = cardData.cardHolderName;
  let cardType = cardData.cardType.toUpperCase();
  let cvv = cardData.cardCVV;
  let cardExpiryDate = cardData.expiryDate;
  let expiryDate = cardExpiryDate.split("/");
  let expiryMonth = expiryDate[0];
  let expiryYear = "20" + expiryDate[1];

  const path = "/v1/payments";
  const data1 = querystring.stringify({
    entityId: "8ac7a4c7772b58a5017733d194900911",
    amount: send_amount,
    currency: "SAR",
    paymentBrand: cardType,
    paymentType: paymentType,
    "card.number": cardNumber,
    "card.holder": cardHolder,
    "card.expiryMonth": expiryMonth,
    "card.expiryYear": expiryYear,
    "card.cvv": cvv,
  });
  const data = querystring.stringify({
    entityId: "8ac7a4c7772b58a5017733d194900911",
    amount: "92.00",
    currency: "SAR",
    paymentBrand: "VISA",
    paymentType: "PA",
    "card.number": "4111111111111111",
    "card.holder": "Jane Jones",
    "card.expiryMonth": "05",
    "card.expiryYear": "2034",
    "card.cvv": "123",
  });

  console.log(data);
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          resolve(JSON.parse(jsonString));
        } catch (error) {
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.write(data);
    postRequest.end();
  });
};

helper.get_payment_status_from_reporting = function (order_number, card_type) {
  const entityId = getEntityId(card_type);

  var path = "/v1/query";
  path += "?entityId=" + entityId;
  path += "&merchantTransactionId=" + order_number;
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "GET",
    headers: {
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  new paymentLogs({
    data: JSON.stringify({
      type: "reporting request Data",
      options,
    }),
  }).save((error, result) => {});
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          new paymentLogs({
            data: JSON.stringify({
              type: "reporting response Data",
              response: JSON.parse(jsonString),
            }),
          }).save((error, result) => {});
          resolve(JSON.parse(jsonString));
        } catch (error) {
          helper.log_payment_error({
            // userName: userData.name,
            // orderId: order_number,
            // productId: "PROD67890",
            soumNumber: order_number,
            // mobileNumber: userData.mobileNumber,
            errorMessage: "Failed To do payment reporting",
            paymentErrorId: uuidv4(),
            paymentProvidor: card_type,
            paymentProvidorType: "HyperPay",
            // amount: send_amount,
          });
          new paymentLogs({
            data: JSON.stringify({
              type: "reporting response Data",
              response: error,
            }),
          }).save((error, result) => {});
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.end();
  });
};

helper.log_payment_error = async (paymentLogs) => {
  try {
    let path = `http://soum-payment-${process.env.PREFIX}-srv:3000/error`;
    if (ENV.NODE_ENV == "development") {
      path = `http://${ENV.HOST}/error`;
    }
    const res = await axios.post(path, paymentLogs, {
      headers: {
        "client-id": "api-v1",
      },
    });
  } catch (e) {
    console.log(e);
  }
};

helper.get_payment_status_from_checkout = function (checkoutId, card_type) {
  const entityId = getEntityId(card_type);

  var path = "/v1/checkouts/" + checkoutId + "/payment";
  path += "?entityId=" + entityId;
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "GET",
    headers: {
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  new paymentLogs({
    data: JSON.stringify({
      type: "checkout status request Data",
      options,
    }),
  }).save((error, result) => {});
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          new paymentLogs({
            data: JSON.stringify({
              type: "checkout status response Data",
              response: JSON.parse(jsonString),
            }),
          }).save((error, result) => {});
          resolve(JSON.parse(jsonString));
        } catch (error) {
          helper.log_payment_error({
            // userName: userData.name,
            // orderId: order_number,
            // productId: "PROD67890",
            soumNumber: checkoutId,
            // mobileNumber: userData.mobileNumber,
            errorMessage: "Failed To do payment checkout",
            paymentErrorId: uuidv4(),
            paymentProvidor: card_type,
            paymentProvidorType: "HyperPay",
            // amount: send_amount,
          });
          new paymentLogs({
            data: JSON.stringify({
              type: "checkout status response Data",
              response: error,
            }),
          }).save((error, result) => {});
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.end();
  });
};

helper.get_transaction_report = function (transactionId, card_type) {
  const entityId = getEntityId(card_type);

  var path = "/v1/query/" + transactionId;
  path += "?entityId=" + entityId;
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "GET",
    headers: {
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          console.log(jsonString);
          resolve(JSON.parse(jsonString));
        } catch (error) {
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.end();
  });
};

helper.apply_transaction_operations = function (
  transactionId,
  card_type,
  amount,
  action,
  currency
) {
  var amount = parseFloat(amount).toFixed(2);
  const entityId = getEntityId(card_type);

  var data;
  if (action == "capture") {
    data = {
      entityId: entityId,
      amount: amount,
      currency: currency,
      paymentType: "CP",
    };
  } else if (action == "refund") {
    data = {
      entityId: entityId,
      amount: amount,
      currency: currency,
      paymentType: "RF",
    };
  } else if (action == "reversal") {
    data = {
      entityId: entityId,
      paymentType: "RV",
    };
  }
  if (
    (ENV.NODE_ENV == "development" || ENV.NODE_ENV == "staging") &&
    card_type == "VISA_MASTER"
  )
    data.testMode = "EXTERNAL";

  data = querystring.stringify(data);
  var path = "/v1/payments/" + transactionId;
  const options = {
    port: 443,
    host: ENV.HYPER_PAY_URL,
    path: path,
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": data.length,
      Authorization: ENV.HYPER_PAY_AUTH_KEY,
    },
  };
  console.log(options);
  return new Promise((resolve, reject) => {
    const postRequest = https.request(options, function (res) {
      const buf = [];
      res.on("data", (chunk) => {
        buf.push(Buffer.from(chunk));
      });
      res.on("end", () => {
        const jsonString = Buffer.concat(buf).toString("utf8");
        try {
          console.log(action, jsonString);
          resolve(JSON.parse(jsonString));
        } catch (error) {
          reject(error);
        }
      });
    });
    postRequest.on("error", reject);
    postRequest.write(data);
    postRequest.end();
  });
};

helper.check_payment_status_code = function (resultData) {
  let transactionCode = resultData.code;
  //let description = resultData.description;
  var success = /^(000\.000\.|000\.100\.1|000\.[36])/;
  var pending = /^(000\.200)/;

  var sucStatus = success.test(transactionCode);
  var pendingStatus = pending.test(transactionCode);

  if (sucStatus) {
    return helper.paymentStatus.SUCCESS;
  } else if (pendingStatus) {
    return helper.paymentStatus.PENDING;
  } else {
    return helper.paymentStatus.FAIL;
  }
};

helper.pickup_request = function (
  order_id,
  PickupTimestamp,
  seller,
  sellerAddress,
  buyer,
  buyerAddress
) {
  var ShipperAccountNumber = ENV.DHL_ACCOUNT_NUMBER;
  var username = ENV.DHL_USERNAME;
  var password = ENV.DHL_PASSWORD;
  var basicAuth =
    "Basic " + new Buffer.from(username + ":" + password).toString("base64");

  var options = {
    method: "POST",
    url: ENV.DHL_PICKUP_REQUEST_URL,
    headers: {
      Authorization: basicAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      PickUpRequest: {
        PickUpShipment: {
          ShipmentInfo: {
            ServiceType: "N",
            Billing: {
              ShipperAccountNumber: ShipperAccountNumber,
              ShippingPaymentType: "S",
            },
            UnitOfMeasurement: "SI",
          },
          PickupTimestamp: PickupTimestamp,
          PickupLocationCloseTime: "",
          SpecialPickupInstruction: "Collect at reception",
          PickupLocation: "Reception",
          InternationalDetail: {
            Commodities: {
              NumberOfPieces: "1",
              Description: "Electronic Item",
            },
          },
          Ship: {
            Shipper: {
              Contact: {
                PersonName: seller.name,
                CompanyName: seller.name,
                PhoneNumber: "+" + seller.countryCode + seller.mobileNumber,
                EmailAddress: "bader.almubarak@soumonline.com",
                MobilePhoneNumber:
                  "+" + seller.countryCode + seller.mobileNumber,
              },
              Address: {
                StreetLines: sellerAddress.address,
                City: sellerAddress.city,
                PostalCode: sellerAddress.postal_code,
                CountryCode: "SA",
              },
            },
            Recipient: {
              Contact: {
                PersonName: buyer.name,
                CompanyName: buyer.name,
                PhoneNumber: "+" + buyer.countryCode + buyer.mobileNumber,
                EmailAddress: "bader.almubarak@soumonline.com",
                MobilePhoneNumber: "+" + buyer.countryCode + buyer.mobileNumber,
              },
              Address: {
                StreetLines: buyerAddress.address,
                City: buyerAddress.city,
                PostalCode: buyerAddress.postal_code,
                CountryCode: "SA",
              },
            },
          },
          Packages: {
            RequestedPackages: {
              "@number": "1",
              Weight: "1",
              Dimensions: {
                Length: "1",
                Width: "1",
                Height: "1",
              },
              CustomerReferences: "test data",
            },
          },
        },
      },
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.body);
        var result = response.body;
        var jsonData = JSON.parse(result);
        var code = jsonData["PickUpResponse"]["Notification"][0]["@code"];
        if (code == 0) {
          var pickup_detail = jsonData;
        } else {
          var pickup_detail = {};
        }

        var saveobj = { pickup_detail: pickup_detail };
        OrderModel.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(order_id) },
          { $set: saveobj },
          function (err, success) {
            if (err) {
              console.log("error");
              resolve(true);
            } else {
              console.log("save");
              resolve(true);
            }
          }
        );
      }
    });
  });
};

helper.shipment_request = function (
  order_id,
  PickupTimestamp,
  seller,
  sellerAddress,
  buyer,
  buyerAddress
) {
  var ShipperAccountNumber = ENV.DHL_ACCOUNT_NUMBER;
  var username = ENV.DHL_USERNAME;
  var password = ENV.DHL_PASSWORD;
  var basicAuth =
    "Basic " + new Buffer.from(username + ":" + password).toString("base64");
  //console.log(moment().format('z Z'));
  //console.log(moment(PickupTimestamp).tz("ASIA/RIYADH").format('YYYY-MM-DDTHH:mm:ss'));

  var options = {
    method: "POST",
    url: ENV.DHL_SHIPMENT_REQUEST_URL,
    headers: {
      Authorization: basicAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ShipmentRequest: {
        RequestedShipment: {
          ShipmentInfo: {
            DropOffType: "REGULAR_PICKUP",
            ServiceType: "N",
            Account: ShipperAccountNumber,
            Currency: "SAR",
            UnitOfMeasurement: "SI",
            PaperlessTradeEnabled: "false",
            DocumentImages: {
              DocumentImage: [
                {
                  DocumentImageType: "INV",
                  DocumentImage:
                    "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",
                  DocumentImageFormat: "JPEG",
                },
              ],
            },
          },
          ShipTimestamp:
            moment(PickupTimestamp).format("YYYY-MM-DDTHH:mm:ss") +
            " GMT+03:00",
          PaymentInfo: "DAP",
          InternationalDetail: {
            Commodities: {
              NumberOfPieces: 1,
              Description: "Computer Parts",
            },
            Content: "DOCUMENTS",
          },
          Ship: {
            Shipper: {
              Contact: {
                PersonName: seller.name,
                CompanyName: seller.name,
                PhoneNumber: seller.countryCode + seller.mobileNumber,
                EmailAddress: "bader.almubarak@soumonline.com",
                MobilePhoneNumber: seller.countryCode + seller.mobileNumber,
              },
              Address: {
                StreetLines: sellerAddress.address,
                StreetLines2: sellerAddress.address,
                City: sellerAddress.city,
                PostalCode: sellerAddress.postal_code,
                CountryCode: "SA",
              },
            },
            Recipient: {
              Contact: {
                PersonName: buyer.name,
                CompanyName: buyer.name,
                PhoneNumber: buyer.countryCode + buyer.mobileNumber,
                EmailAddress: "bader.almubarak@soumonline.com",
                MobilePhoneNumber: buyer.countryCode + buyer.mobileNumber,
              },
              Address: {
                StreetLines: buyerAddress.address,
                StreetLines2: buyerAddress.address,
                City: buyerAddress.city,
                PostalCode: buyerAddress.postal_code,
                CountryCode: "SA",
              },
            },
          },
          Packages: {
            RequestedPackages: [
              {
                "@number": "1",
                Weight: "1",
                Dimensions: {
                  Length: "1",
                  Width: "1",
                  Height: "1",
                },
                CustomerReferences: "Electronic item",
              },
            ],
          },
        },
      },
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.body);
        var result = response.body;
        var jsonData = JSON.parse(result);
        var code = jsonData["ShipmentResponse"]["Notification"][0]["@code"];
        if (code == 0) {
          var shipment_detail = jsonData;
        } else {
          var shipment_detail = {};
        }
        var saveobj = { shipment_detail: shipment_detail };
        OrderModel.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(order_id) },
          { $set: saveobj },
          function (err, success) {
            if (err) {
              console.log("error");
              resolve(true);
            } else {
              console.log("save");
              resolve(true);
            }
          }
        );
      }
    });
  });
};

helper.track_shipment = function (
  trackNumber,
  TrackTimestamp,
  referenceNumber
) {
  var ShipperAccountNumber = ENV.DHL_ACCOUNT_NUMBER;
  var username = ENV.DHL_USERNAME;
  var password = ENV.DHL_PASSWORD;
  var basicAuth =
    "Basic " + new Buffer.from(username + ":" + password).toString("base64");

  var options = {
    method: "POST",
    url: ENV.DHL_TRACKING_REQUEST_URL,
    headers: {
      Authorization: basicAuth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trackShipmentRequest: {
        trackingRequest: {
          TrackingRequest: {
            Request: {
              ServiceHeader: {
                MessageTime: TrackTimestamp,
                MessageReference: referenceNumber,
              },
            },
            AWBNumber: {
              ArrayOfAWBNumberItem: trackNumber,
            },
            LevelOfDetails: "ALL_CHECKPOINTS",
            PiecesEnabled: "B",
          },
        },
      },
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) {
      if (error) {
        console.log(error);
      } else {
        console.log(response.body);
        var result = response.body;
        var jsonData = JSON.parse(result);
        var track_detail = jsonData;
        resolve(track_detail);
      }
    });
  });
};

helper.hyper_split_login = function () {
  var options = {
    method: "POST",
    url: ENV.HYPER_PAY_SPLIT_URL + "/api/v1/login",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email: ENV.HYPER_PAY_SPLIT_EMAIL,
      password: ENV.HYPER_PAY_SPLIT_PASS,
    }),
  };
  console.log(options);
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        var logData = JSON.parse(body);
        console.log(logData);
        if (response.statusCode == 200 && logData.status == true) {
          var token = logData.data.accessToken;
          resolve(token);
        } else {
          resolve("");
        }
      }
    });
  });
};

helper.hyper_split = function (
  order_number,
  seller,
  sellerAmount,
  baderAmount,
  accessToken
) {
  var token = "Bearer " + accessToken;
  let beneficiary = [
    {
      name: seller.bankDetail.accountHolderName,
      accountId: seller.bankDetail.accountId,
      debitCurrency: "SAR",
      transferAmount: sellerAmount.toFixed(2),
      transferCurrency: "SAR",
      bankIdBIC: seller.bankDetail.bankBIC,
      payoutBeneficiaryAddress1: seller.address.address,
      payoutBeneficiaryAddress2: seller.address.city,
      payoutBeneficiaryAddress3: seller.address.postal_code,
    },
  ];

  if (seller.bankDetail.bankBIC == "INMASARI") {
    beneficiary[0].accountId = beneficiary[0].accountId.substring(10);
    delete beneficiary[0].bankIdBIC;
  }
  var options = {
    method: "POST",
    url: ENV.HYPER_PAY_SPLIT_URL + "/api/v1/orders",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: token,
    },
    body: JSON.stringify({
      configId: ENV.HYPER_PAY_SPLIT_CONFIG_ID,
      merchantTransactionId: order_number,
      transferOption: "0",
      beneficiary,
    }),
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      var splitData = JSON.parse(body);
      console.log("Response:", splitData);
      if (response.statusCode == 200 && splitData.status == true) {
        var splitData = JSON.stringify(splitData);
        resolve(splitData);
      } else {
        resolve(false);
      }
    });
  });
};

helper.hyper_split_test = function (accessToken) {
  return new Promise((resolve, reject) => {
    var token = "Bearer " + accessToken;
    request(
      {
        method: "POST",
        url: ENV.HYPER_PAY_SPLIT_URL + "/api/v1/orders",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: token,
        },
        body: '{  "merchantTransactionId": "asdfg4194189196",  "transferOption": "0",  "configId": "1c11327d420b0590da0a9b961516c7cb",  "beneficiary": [    {      "name": "Bader",      "accountId": "68200019878000",      "debitCurrency": "SAR",      "transferAmount": "55.55",      "transferCurrency": "SAR",      "payoutBeneficiaryAddress1": "Jordan-Amman",      "payoutBeneficiaryAddress2": "Jordan-Amman",      "payoutBeneficiaryAddress3": "Jordan-Amman"    },    {      "name": "Shadi Adawi",      "accountId": "SA4280000621608010034790",      "debitCurrency": "SAR",      "transferAmount": "70.55",      "transferCurrency": "SAR",      "bankIdBIC": "RJHISARI",      "payoutBeneficiaryAddress1": "Jordan-Amman",      "payoutBeneficiaryAddress2": "Jordan-Amman",      "payoutBeneficiaryAddress3": "Jordan-Amman"    }  ]}',
      },
      function (error, response, body) {
        resolve(body);
      }
    );
  });
};

helper.send_sms = function (receiver, message) {
  var options = {
    method: "POST",
    url:
      "http://basic.unifonic.com/wrapper/sendSMS.php?appsid=QUFPEaHqZArfT38GFkglljUFlz7Vcb&msg=" +
      message +
      "&to=" +
      receiver +
      "&sender=SOUM&baseEncode=False&encoding=UCS2&responseType=JSON",
    headers: {
      Accept: "application/json",
      Authorization: "Basic QmFzaWNBdXRoVXNlck5hbWU6QmFzaWNBdXRoUGFzc3dvcmQ=",
    },
  };
  request(options, function (error, response) {
    if (error) {
      console.log(error);
    } else {
      console.log(response.body);
    }
  });
};

helper.send_sms_to_seller = function (product_id, buyer_id, amount, type) {
  //console.log(LOCALE);
  var where = { _id: mongoose.Types.ObjectId(product_id) };
  ProductModel.findOne(where)
    .populate({
      path: "category_id",
      select: "category_name category_name_ar",
    })
    .populate({
      path: "brand_id",
      select: "brand_name brand_name_ar",
    })
    .populate({
      path: "model_id",
      select: "model_name model_name_ar current_price",
    })
    .lean()
    .exec(function (error, product) {
      if (product) {
        // var bidInfo = product.bidding.filter(x => x.user_id.toString() == buyer_id.toString());
        //console.log(product);
        let seller_id = product.user_id;
        //let buyer_id = buyer_id;
        if (
          type == "question" ||
          type == "bid" ||
          type == "complaint" ||
          type == "bid_accepet_seller" ||
          type == "delivered_seller" ||
          type == "buy_seller" ||
          type == "bid_seller"
        ) {
          var user_id = seller_id;
        } else if (type == "answer") {
          var user_id = buyer_id;
        } else {
          var user_id = buyer_id;
        }
        var where = { _id: mongoose.Types.ObjectId(user_id) };
        var col = { name: 1, countryCode: 1, mobileNumber: 1, language: 1 };
        UserModel.findOne(where, col, function (err, user) {
          //console.log(user);
          if (user) {
            var lang = user.language ? user.language : "ar";
            const productLink = `${process.env.SOUM_SITE}/${lang}/product-detail?product=${product._id}`;
            const userProductsPage = `${process.env.SOUM_SITE}/${lang}/bids-and-items?tab=bought-sold`;
            const userBidsPage = `${process.env.SOUM_SITE}/${lang}/bids-and-items?tab=bid-sell&subTab=bid`;
            const productListingPage = `${process.env.SOUM_SITE}/${lang}/products`;
            var receiver = user.countryCode + user.mobileNumber;
            if (type == "question") {
              var message_en =
                "Dear " +
                user.name +
                ", a prospective buyer for your product, " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " and " +
                product.varient +
                " has asked a question. Please reply through the link below. \n" +
                productLink;
              var message_ar =
                "أهلًا " +
                user.name +
                "، يوجد مشتري محتمل قام بسؤالك عن منتجك: " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                "، يرجى الإجابة عليه من خلال الرابط التالي: " +
                "\n" +
                productLink;
            } else if (type == "answer") {
              var message_en =
                "Dear  " +
                user.name +
                ", seller of product, " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " and " +
                product.varient +
                " has responded to your query. Please view through the link below. \n" +
                productLink;
              var message_ar =
                "أهلًا " +
                user.name +
                "، البائع لمنتج " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                " قام بالإجابة على سؤالك، يرجى الإطلاع عليه من خلال الرابط التالى " +
                "\n" +
                productLink;
            } else if (type == "bid") {
              var message_en =
                "Dear " +
                user.name +
                ", a prospective buyer for your product, " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " and " +
                product.varient +
                " has placed a bid.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، يوجد مشتري محتمل قام بسوم منتجك " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                ".";
            } else if (type == "complaint") {
              var message_en =
                "Dear " +
                user.name +
                ", the buyer of the product " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " and " +
                product.varient +
                " has raised a complaint.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، المشتري لمنتجك " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                " قام برفع شكوى";
            } else if (type == "dvb") {
              var message_en =
                "Dear " +
                user.name +
                ", your dispute for the " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " is closed successfully. Your refund has been initiated.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، تم معالجة الشكوى الخاصة بمنتج " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                " وتم البدء في عملية استرجاع المبلغ";
            } else if (type == "dvs") {
              var message_en =
                "Dear " +
                user.name +
                ", dispute raised by the buyer for " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " is valid. Buyer will be refunded the amount and the product will be sent back to you.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، تم قبول الشكوى المرفوعة على منتجك " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                ". سوف يتم إعادة المبلغ للمشتري وشحن الجهاز إليك";
            } else if (type == "dib") {
              var message_en =
                "Dear " +
                user.name +
                ", your dispute for the " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " is not valid based on our conversations. Thanks for shopping on Soum.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، بناء على محادثتنا فإن الشكوى الخاصة بمنتج " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                " غير مقبولة. شكرا لتسوقك من سوم";
            } else if (type == "dis") {
              var message_en =
                "Dear " +
                user.name +
                ", dispute raised by the buyer for " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                " is invalid. Product sell amount will be credited to your account.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، تم رفض الشكوى المرفوعة على منتجك " +
                product.brand_id.brand_name_ar +
                ", " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                ". سوف يتم تحويل المبلغ كاملا لحسابك";
            } else if (type == "bid_buyer") {
              var message_en =
                "Dear " +
                user.name +
                ", Thanks for your bid on " +
                product.brand_id.brand_name +
                ", " +
                product.model_id.model_name +
                ", " +
                amount +
                " SAR has been deducted from your account.";
              var message_ar =
                "شكرا على سومتك، تم حجز " + amount + " ريال من حسابك";
            } else if (type == "bid_lower") {
              if (amount > 0) {
                var message_en = `Dear ${user.name} another bidder has placed a higher bid on the product ${product.model_id.model_name}. \n To add new bid : \n ${productLink}`;
                var message_ar = `أهلًا ${user.name} قام مشتري آخر بوضع سومة أعلى منك للمنتج ${product.model_id.model_name_ar} ${product.varient_ar}. \n لإضافة سومة أخرى: \n ${productLink}`;
              } else {
                var message_en = `Dear ${user.name} another bidder has placed a higher bid on the product " + product.brand_id.brand_name + ", " + product.model_id.model_name`;
                var message_ar = `أهلًا ${user.name} قام مشتري آخر بوضع سومة أعلى منك للمنتج ${product.model_id.model_name_ar} \n لإضافة سومة أخرى: \n ${productLink}`;
              }
            } else if (type == "buy_buyer") {
              var message_en =
                "Dear " +
                user.name +
                ", your purchase of " +
                product.model_id.model_name +
                " " +
                product.varient +
                " for " +
                amount +
                " is successful, seller has been intimated to initiate delivery.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، عملية الشراء لمنتج " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                " بسعر " +
                amount +
                " ريال. تم إشعار البائع بشحن المنتج";
            } else if (type == "bid_seller") {
              var message_en = `Dear ${user.name}, you have received a new bid for you product ${product.model_id.model_name} ${product.varient} with ${amount} \n to see the product: \n ${userProductsPage}`;
              var message_ar = `أهلًا ${user.name}، يوجد مشتري قام بسوم منتجك ${product.model_id.model_name_ar} ${product.varient_ar} بسعر ${amount} \n للاطلاع على المنتج: \n ${userProductsPage}`;
            } else if (type == "bidder") {
              if (amount > 0) {
                var message_en = `Dear ${user.name}, you have placed a bid for product ${product.model_id.model_name} and ${product.varient} , ${amount} SAR has been deducted from your account \n to see the product: \n ${productLink}`;
                var message_ar = `أهلًا ${user.name} ، لقد قمت بسوم منتج  ${product.model_id.model_name_ar} ${product.varient_ar} تم خصم ${amount} ريال من حسابك. \n للاطلاع على المنتج: \n ${productLink}`;
              } else {
                var message_en = `Dear ${user.name} , you have placed a bid for product ${product.model_id.model_name} and ${product.varient} \n to see the product: \n ${productLink}`;
                var message_ar = `أهلًا ${user.name} ، لقد قمت بسوم منتج ${product.model_id.model_name_ar} ${product.varient_ar} \n للاطلاع على المنتج: \n ${productLink}`;
              }
            } else if (type == "bid_accepet_seller") {
              var message_en =
                "Dear " +
                user.name +
                ", you have accepted a bid of " +
                " for " +
                product.model_id.model_name +
                product.varient +
                "with" +
                amount +
                ".";
              var message_ar =
                "أهلًا " +
                user.name +
                "، لقد قمت بقبول السومة لمنتجك: " +
                product.model_id.model_name_ar +
                " " +
                product.varient_ar +
                " بسعر " +
                amount +
                ".";
            } else if (type == "bid_accepet_bidder") {
              var message_en = `Dear ${user.name}, your bid for  ${product.model_id.model_name} ${product.varient} + " has been accepted by the seller with ${amount}. \n To complete the buy process please view the link below. \n ${userBidsPage}`;
              var message_ar = `أهلًا ${user.name}، تم قبول سومتك لمنتج ${product.model_id.model_name_ar} ${product.varient_ar} بسعر ${amount}. \n لإكمال عملية الشراء برجاء الاطلاع على الرابط التالى \n ${userBidsPage}`;
            } else if (type == "delivered") {
              var message_en =
                "Dear " +
                user.name +
                ", your order for " +
                product.model_id.model_name +
                " and " +
                product.varient +
                " has been delivered on " +
                helper.get_sql_current_date() +
                ". You can raise a dispute in the next 24 hours, if there are any concerns with the order.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، تم توصيل منتجك " +
                product.model_id.model_name_ar +
                ", " +
                product.varient_ar +
                " بتاريخ " +
                helper.get_sql_current_date() +
                ". يمكنك رفع شكوى على المنتج خلال ال ٢٤ ساعة القادمة اذا واجهتك أي مشاكل";
            } else if (type == "delivered_seller") {
              var message_en =
                "Dear " +
                user.name +
                ", your product " +
                product.model_id.model_name +
                " has been delivered to buyer.";
              var message_ar =
                "أهلًا " +
                user.name +
                "، تم توصيل منتجك " +
                product.model_id.model_name_ar +
                ", " +
                product.varient_ar +
                " للمشتري.";
            } else if (type == "buy_seller") {
              var message_en =
                "Dear " +
                user.name +
                ", your product " +
                product.model_id.model_name +
                " " +
                product.varient +
                " for " +
                amount +
                " SAR has been sold. We will contact you to get the product";
              var message_ar =
                "أهلًا " +
                user.name +
                "، تم بيع منتجك " +
                product.model_id.model_name_ar +
                ", " +
                product.varient_ar +
                ".سيتم التواصل معك لاستلام منتجك.";
            } else if (type == "product_sold") {
              // if (amount > 0) {
              var message_en = `Dear ${user.name} another buyer has purchased the product ${product.model_id.model_name} ${product.varient}. \n To see other products: \n ${productListingPage}`;
              var message_ar = `أهلًا ${user.name} ، قام مشتري آخر بشراء المنتج ${product.model_id.model_name_ar} ${product.varient_ar}. \n للاطلاع على منتجات اخرى: \n ${productListingPage}`;
              // } else {
              // 	var message_en = "Dear " + user.name + ", another buyer has purchased the product " + product.brand_id.brand_name + ", " + product.model_id.model_name + " and " + product.varient + ".";
              // 	var message_ar = "أهلًا " + user.name + "، قام مشتري آخر بشراء المنتج " + product.brand_id.brand_name_ar + ", " + product.model_id.model_name_ar + " " + product.varient_ar + ".";
              // }
            } else if (type == "expire") {
              var message_en = `Dear ${user.name} your listing of the ${product.model_id.model_name} ${product.varient} is expired, \n if you still want to sell it on Soum, you can renew here: \n ${userProductsPage}`;
              var message_ar = `أهلًا ${user.name} ، انتهت مدة عرض منتجك ${product.model_id.model_name_ar} ${product.varient_ar} في منصة سوم, \n في حال استمرار رغبتك في بيع المنتج من خلال المنصة، يمكنك تجديد العرض من خلال الرابط التالى: \n ${userProductsPage}`;
            }

            if (lang == "ar") {
              var message = message_ar;
            } else {
              var message = message_en;
            }
            //console.log(message);
            message = encodeURI(message);
            helper.send_sms(receiver, message);
          }
        });
      }
    });
};

helper.encrypt = (plainText, secretKey) => {
  var ciphertext = cryptoJS.AES.encrypt(plainText, secretKey).toString();
  return ciphertext;
};

helper.decryptoJS = (encryptedText, secretKey) => {
  let bytes = "";
  try {
    bytes = cryptoJS.AES.decrypt(encryptedText, secretKey).toString(
      cryptoJS.enc.Utf8
    );
  } catch (err) {
    console.log("Error while decrypting encryptedText ::", err);
  }
  return bytes;
};

helper.decrypt = (encryptedText, secretKey) => {
  const bytes = cryptoJS.AES.decrypt(encryptedText, secretKey);
  let originalText = "";
  try {
    originalText = bytes.toString(cryptoJS.enc.Utf8);
  } catch (err) {
    console.log("Error while decrypting encryptedText ::", err);
  }
  return originalText;
};

helper.maskString = (input, unmaskLength) => {
  if (!input || typeof input !== "string") {
    return "";
  }

  const length = input.length;
  if (length <= unmaskLength) {
    return input;
  }

  return "*".repeat(length - unmaskLength) + input.slice(-unmaskLength);
};

helper.doubledecrypt = (encryptedText, secretKey) => {
  var d1 = helper.decrypt(encryptedText, secretKey);
  var d2 = helper.decrypt(d1, secretKey);
  return d2;
};

helper.generate_order_number = () => {
  return (
    "SOUM" +
    Math.round(new Date().getTime() / 1000) +
    Math.floor(1000 + Math.random() * 9000)
  );
};

helper.generate_jwt = (userId, shouldRemember) => {
  if (shouldRemember) {
    return jwt.sign(
      {
        userId,
        id: userId,
      },
      process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
      {
        algorithm: "RS256",
      }
    );
  }

  return jwt.sign(
    {
      userId,
      id: userId,
    },
    process.env.JWT_ACCESS_TOKEN_PRIVATE_KEY,
    {
      algorithm: "RS256",
      expiresIn: "30d",
    }
  );
};

helper.getDays = (startDate, endDate) => {
  //console.log(startDate)
  var sd = startDate.toISOString().substring(0, 10);
  var ed = endDate;
  if (ed == "") {
    var today = new Date().toISOString();
    ed = today.substring(0, 10);
  } else {
    ed = endDate.toISOString().substring(0, 10);
  }
  var date1 = new Date(sd);
  var date2 = new Date(ed);
  // To calculate the time difference of two dates
  var Difference_In_Time = date2.getTime() - date1.getTime();
  // To calculate the no. of days between two dates
  var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  return Difference_In_Days;
};

helper.calculateMinutes = (startDate, endDate) => {
  if (endDate == "") {
    var today = new Date().toISOString();
    endDate = today;
  }
  var start_date = moment(startDate, "YYYY-MM-DD HH:mm:ss");
  var end_date = moment(endDate, "YYYY-MM-DD HH:mm:ss");
  var duration = moment.duration(end_date.diff(start_date));
  var minutes = Math.round(duration.asHours() * 60);
  return minutes;
};

helper.calculateHours = (startDate, endDate) => {
  if (endDate == "") {
    var today = new Date().toISOString();
    endDate = today;
  }
  var start_date = moment(startDate, "YYYY-MM-DD HH:mm:ss");
  var end_date = moment(endDate, "YYYY-MM-DD HH:mm:ss");
  var duration = moment.duration(end_date.diff(start_date));
  var hours = Math.round(duration.asHours());
  return hours;
};

helper.get_sql_date = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

helper.get_sql_current_date = () => {
  return moment().format("YYYY-MM-DD");
};

helper.get_sql_date_timezone = (timezone) => {
  return moment1().tz(timezone).format("YYYY-MM-DD");
};

helper.get_sql_date2 = () => {
  return moment().format("YYYY-MM-DD HH:mm:ss");
};

helper.generate_otp = () => {
  return Math.floor(1000 + Math.random() * 900000);
};

helper.ucfirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

helper.format_sql_data = (data) => {
  return JSON.parse(JSON.stringify(data));
};

helper.generate_url = (req) => {
  return req.protocol + "://" + req.hostname + ":" + req.connection.localPort;
};

helper.console = (type, output) => {
  let has_str = "-----------------------------------";
  if (type == null) {
    if (typeof output == "object") {
      console.log(chalk.blue.bold.inverse(has_str));
      console.log(output);
      console.log(chalk.blue.bold.inverse(has_str));
    } else {
      console.log(chalk.blue.bold.inverse(output));
    }
  } else if (type == true) {
    if (typeof output == "object") {
      console.log(chalk.green.bold.inverse(has_str));
      console.log(output);
      console.log(chalk.green.bold.inverse(has_str));
    } else {
      console.log(chalk.green.bold.inverse(output));
    }
  } else {
    if (typeof output == "object") {
      console.log(chalk.red.bold.inverse(has_str));
      console.log(output);
      console.log(chalk.red.bold.inverse(has_str));
    } else {
      console.log(chalk.red.bold.inverse(output));
    }
  }
};

helper.get_current_year = () => {
  return moment().format("YYYY");
};

helper.toFixedNumber = (number) => {
  const spitedValues = String(number.toLocaleString()).split(".");
  let decimalValue = spitedValues.length > 1 ? spitedValues[1] : "";
  decimalValue = decimalValue.concat("00").substr(0, 2);
  return spitedValues[0] + "." + decimalValue;
};

helper.generateRandNo = () => {
  let rand_no = Math.random();
  let num = Math.floor(rand_no * 100000000 + 1);
  return num; /*8 digit random number*/
};

helper.getPageNumber = (page, limit) => {
  if (page == 1) {
    var start = 0;
  } else {
    if (page == 0) {
      page = 1;
    }
    page = page - 1;
    var start =
      (limit == undefined || limit == ""
        ? Config.SETTING.PER_PAGE_RECORD
        : limit) * page;
  }
  return start;
};

helper.strToLowerCase = (str) => {
  return str == undefined ? "" : helper._trim(str.toLowerCase());
};

helper._replace = (str) => {
  var responce = str == undefined ? "" : str.replace(/[^a-zA-Z0-9 ]/g, "");
  return responce;
};

helper._trim = (str) => {
  var responce = str == undefined ? "" : str.trim();
  return responce;
};

helper.sendMailWithTemplate = (
  templatePath,
  emailSubject,
  email,
  dataObject
) => {
  return new Promise(function (resolve, reject) {
    ejs.renderFile(templatePath, dataObject, function (err, dataTemplate) {
      if (err) {
        console.log("In sendMailWithTemplate error >>");
        console.log(err);
      } else {
        var mainOptions = {
          from: "Chicbee Admin <" + Config.SMTP.FROM + ">",
          to: email,
          subject: emailSubject,
          html: dataTemplate,
        };

        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            console.log("transporter.sendMail >>> ", err);
          } else {
            resolve(1);
          }
        });
      }
    });
  });
};

helper.sendSms = (templatePath, emailSubject, email, dataObject) => {
  return new promise(function (resolve, reject) {
    return "";
  });
};

helper.sendMailWithSendGrid = async (from, to, subject, body, html) => {
  try {
    sgMail.setApiKey(ENV.SENDGRID_API_KEY);
    let msg = {
      to: to, // Change to your recipient
      from: from, // Change to your verified sender
      subject: subject,
    };
    if (body) msg.text = body;
    if (html) msg.html = html;

    const res = await sgMail.send(msg);
  } catch (error) {
    if (error.response && error.response.body) console.log(error.response.body);
    else console.log(error);
  }
};

helper.sendMailWithSendGridWithattachments = async (
  from,
  toList,
  subject,
  attachementContent
) => {
  // console.log(from, toList, subject);
  var options = {
    method: "POST",
    hostname: "api.sendgrid.com",
    port: null,
    path: "/v3/mail/send",
    headers: {
      authorization: "Bearer " + ENV.SENDGRID_API_KEY,
      "content-type": "application/json",
    },
  };
  return new Promise((resolve, reject) => {
    var req = https.request(options, function (res) {
      var chunks = [];

      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        const jsonString = Buffer.concat(chunks).toString("utf8");
        if (jsonString) {
          console.log("reject =>>> ", jsonString);
          reject(jsonString);
        } else {
          console.log("resolve =>>> ", jsonString);
          resolve(jsonString);
        }
      });
    });

    let mailObject = {
      from: { email: from },
      subject,
      content: [
        {
          type: "text/html",
          value:
            "<p>Dear Soum Admin!</p><p> This is auto generated email for <strong>Users</strong>, <strong>Orders</strong>, <strong>Products</strong>, <strong>Bids</strong> , <strong>Orders leads</strong> , and <strong>Bids leads</strong> </p>.<p>Thanks in advance</p><p>Tech Team</p>",
        },
      ],
    };

    mailObject.personalizations = [
      {
        to: toList.map((element) => {
          return { email: element };
        }),
      },
    ];
    mailObject.attachments = attachementContent.map((element) => {
      return {
        content: element.content,
        filename: element.filename,
        type: element.type,
        disposition: "attachment",
      };
    });
    req.on("error", reject);
    req.write(JSON.stringify(mailObject));
    req.end();
  });
};

helper.generateRandomSecretKey = function (length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

helper.generateRandString = () => {
  return Math.random().toString(36).substring(5);
};

helper.generateReferenceNumber = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

helper.generate_jwt_orderId = (orderId) => {
  var token = jwt.sign({ id: orderId }, Config.jwt_secret, {
    expiresIn: "30d",
  });
  return token;
};

helper.create_dmo = async (order_id) => {
  try {
    await bullMQ.createDMOrderJob(order_id, "v1");
  } catch (e) {
    console.log("error enqueing job", { order_id });
    console.log(e);
  }
  // try {
  // 	const path = `${ENV.V2_HOST}/rest/api/v1/dm-orders`;

  // 	await axios.post(path, {
  // 		orderId: order_id
  // 	},
  // 	{
  // 		headers: {
  // 			'client-id': 'api-v1'
  // 		}
  // 	});
  // } catch(e){
  // 	console.log(e);
  // }
};

helper.validatePromoCodeUsage = async(orderId)=>{
	try {
		await bullMQ.validatePromoCodeUsage(orderId, 'v1');
  } catch (e) {
	console.log("error enqueing job", {orderId});
    console.log(e);
  }
}

helper.getDMO = async (orderId) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-orders/order/${orderId}`;

    const result = await axios.get(path, {
      headers: {
        "client-id": "api-v1",
      },
    });
    if (result && result.data) {
      return result.data.responseData;
    }
  } catch (e) {
    console.log(e);
  }
};

helper.updateDMOStatus = async (orderId, statusName) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-orders/order/${orderId}`;

    const result = await axios.put(
      path,
      {
        statusName,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
    if (result && result.data) {
      return result.data.responseData;
    }
  } catch (e) {
    console.log(e);
  }
};

helper.check_active_orders_existance = async (userId, productsCount) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-orders/orders/check`;
    const result = await axios.post(
      path,
      {
        userId,
        productsCount,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
    if (result && result.data) {
      return result.data.responseData;
    } else {
      return true;
    }
  } catch (e) {
    return true;
  }
};

helper.update_security_fee_and_deposit = async (userId) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-securityfee/deposit`;
    await axios.put(
      path,
      {
        userId,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
    return true;
  } catch (e) {
    return false;
  }
};

helper.update_security_fee_and_withdraw = async (userId) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-securityfee/withdraw`;
    await axios.put(
      path,
      {
        userId,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
    return true;
  } catch (e) {
    return false;
  }
};

helper.check_security_fee = async (userId) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-securityfee/status/${userId}`;
    const sfObj = await axios.get(path, {
      headers: {
        "client-id": "api-v1",
      },
    });
    if (sfObj && sfObj.data && sfObj.data.responseData) {
      return sfObj.data.responseData.result;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

helper.create_product_commission = async (
  data = {
    commission,
    product,
    calculationSettings,
    promoCode,
    order,
    paymentOption,
    addOns,
  }
) => {
  try {
    const path = `${ENV.COMMISSION_HOST}/product-commission`;
    const resObj = await axios.post(path, data, {
      headers: {
        "client-id": "api-v1",
      },
    });
    if (resObj && resObj.data) {
      return resObj.data;
    }
    return false;
  } catch (e) {
    return false;
  }
};

helper.getPromoCode = async (promoCodeId) => {
	try {
	  const path = `${ENV.COMMISSION_HOST}/promo-codes/${promoCodeId}`;
	  const resObj = await axios.get(path, {
		headers: {
		  "client-id": "api-v1",
		},
	  });
	  if (resObj && resObj.data) {
		return resObj.data;
	  }
	  return null;
	} catch (e) {
	  return false;
	}
  };

  
helper.increasePromoCodeUsageCount = async (promoCodeId) => {
	try {
	  const path = `${ENV.COMMISSION_HOST}/promo-codes/increase-usage-count`;
	  const data = {
		id: promoCodeId,
	  }
	  await axios.post(path, data, {
		headers: {
		  "client-id": "api-v1",
		},
	  });
	  return null;
	} catch (e) {
	  return false;
	}
};
helper.migrate_product_commission = async (
  data = {
    commission,
    product,
    calculationSettings,
    promoCode,
    order,
  }
) => {
  try {
    const path = `${ENV.COMMISSION_HOST}/product-commission/migrate`;
    const resObj = await axios.post(path, data, {
      headers: {
        "client-id": "api-v1",
      },
    });
    if (resObj && resObj.data) {
      return resObj.data;
    }
    return false;
  } catch (e) {
    return false;
  }
};

helper.get_product_commission = async (data) => {
  try {
    const path = `${ENV.COMMISSION_HOST}/product-commission`;
    const queryData = querystring.stringify(data);

    const resObj = await axios.get(path + "?" + queryData, {
      headers: {
        "client-id": "api-v1",
      },
    });
    if (resObj && resObj.data) {
      return resObj.data && resObj.data.length ? resObj.data[0] : resObj.data;
    }
    return false;
  } catch (e) {
    return false;
  }
};

helper.send_dispute_message = async (order_id) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/dm-orders/dispue/message`;
    await axios.post(
      path,
      {
        orderId: order_id,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

helper.sync_search = async (productIds) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/search/sync/product`;
    await axios.post(
      path,
      {
        productIds: productIds,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

helper.algolia_remove_product = async (product_id) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/search/sync/product/${product_id}`;
    await axios.delete(path, {
      headers: {
        "client-id": "api-v1",
      },
    });
  } catch (e) {
    console.log(e);
  }
};

helper.get_price_nudge_settings = async (variant_id) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/model/variant/price-nudge-setting/${variant_id}`;
    const sfObj = await axios.get(path, {
      headers: {
        "client-id": "api-v1",
      },
    });
    if (sfObj && sfObj.data && sfObj.data.responseData) {
      return sfObj.data.responseData.priceNudgingSettings || false;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
};

helper.get_bid_settings = async () => {
  try {
    const path = `${ENV.BID_HOST}/bid-settings`;
    console.log(path);
    const sfObj = await axios.get(path, {
      headers: {
        "client-id": "api-v1",
      },
    });
    console.log(sfObj);
    return sfObj.data || null;
  } catch (e) {
    return false;
  }
};

helper.send_log_to_price_nudge_history = async (product_id, sell_price) => {
  try {
    const path = `${ENV.V2_HOST}/rest/api/v1/product/price-nudging-history`;
    await axios.post(
      path,
      {
        productId: product_id,
        sellPrice: sell_price,
      },
      {
        headers: {
          "client-id": "api-v1",
        },
      }
    );
  } catch (e) {
    console.log(e);
  }
};

helper.tryParseJson = async (text) => {
  try {
    return JSON.parse(text);
  } catch (exception) {
    console.log(exception);
    return text;
  }
};

helper.formatPriceInDecimalPoints = (price, decimals) => {
  return Number(
    Math.round(Math.trunc(Number(price) * 1000) / 10) / Math.pow(10, decimals)
  );
};
module.exports = helper;
