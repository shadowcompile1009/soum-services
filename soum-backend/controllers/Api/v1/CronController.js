const mongoose = require("mongoose");
const BankModel = require("../../../models/BankModel");
const ProductModel = require("../../../models/ProductModel");
const OrderModel = require("../../../models/OrderModel");
const Helper = require("../../../config/helper.js");
const Messages = require("../../../config/messages.js");
const _ = require("lodash");
const path = require("path");
const fs = require("fs");
const express = require("express");
const archiver = require("archiver");
//const app = express();
//app.use(express.static(path.join(__dirname, 'emailTemplates')));
const multer = require("multer");
const UserDAL = require("../../../Data/UserDAL");
const OrderDAL = require("../../../Data/OrderDAL");
const BidDAL = require("../../../Data/BidDAL");
const ProductDAL = require("../../../Data/ProductDAL");
const OrderController = require("../../../controllers/Api/v1/OrderController");

const activityDAL = require("../../../Data/ActivityDAL");
const ActivityService = require("../../../services/ActivityService");
const activityService = new ActivityService(activityDAL);

const subscriptionDAL = require("../../../Data/SubscriptionDAL");
const SubscriptionService = require("../../../services/SubscriptionService");
const subscriptionService = new SubscriptionService(subscriptionDAL);

const notificationDAL = require("../../../Data/NotificationDAL");
const NotificationService = require("../../../services/NotificationService");
const notificationService = new NotificationService(notificationDAL);
const SettingDAL = require("../../../Data/SettingDAL");

var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./assets/category");
  },
  filename: function (req, file, callback) {
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
    //console.log("in data--->>>", data);
    callback(null, data);
  },
});

var Upload = multer({ storage: storage }).single("category_icon");
//var CatUpload = Helper.upload_space().array('category_icon', 1);
var CatUpload = Helper.upload_space("category").single("category_icon");

async function UpdateProductAvailability() {
  try {
    var res = await ProductDAL.UpdateProductAvailability();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
}

async function SanitizeBankDetails(req, res) {
  try {
    let profile = await UserDAL.GetUserBankDetails();
    if (!profile) {
      Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    } else {
      for (const prof of profile) {
        let accountId = "";
        let bankBIC = "";

        if (typeof prof.bankDetail != "undefined" && prof.bankDetail != null) {
          if (typeof prof.bankDetail.accountId != "undefined") {
            accountId = prof.bankDetail.accountId;
          }
          if (typeof prof.bankDetail.bankBIC != "undefined") {
            bankBIC = prof.bankDetail.bankBIC;
          }
        }

        accountIdDec1 = Helper.decrypt(accountId, prof.secretKey);
        bankBICDec1 = Helper.decrypt(bankBIC, prof.secretKey);
        const _sanitizeAcId = accountId.replace(
          /[\u200B-\u200D\u200F\uFEFF]/g,
          ""
        );
        const sanitizeAcId = _sanitizeAcId.replace(/\s/g, "");
        const notEnc = sanitizeAcId.startsWith("SA");
        const notEnc2 = sanitizeAcId.startsWith("Sa");

        // Check for non encrypted bank details
        let cleaned = "";
        if (notEnc || notEnc2 || (bankBIC.length < 20 && bankBIC.length > 0)) {
          let newBankBIC = bankBIC;
          if (bankBIC.length < 30) {
            newBankBIC = Helper.encrypt(bankBIC, prof.secretKey);
          }

          await UserDAL.UpdateUserBankdetail(prof.user_id, {
            accountHolderName: prof.bankDetail.accountHolderName,
            accountId: Helper.encrypt(accountId, prof.secretKey),
            bankBIC: newBankBIC,
            bankName: prof.bankDetail.bankName,
            accountIdOld: prof.bankDetail.accountId,
            bankBICOld: prof.bankDetail.bankBIC,
          });
          cleaned = "yes";
        }

        // check for empty encrypted bank details
        if (accountIdDec1.length === 0 || bankBICDec1.length === 0) {
          if (!notEnc && !notEnc2) {
            if (accountId.length > 27 || bankBIC.length > 12) {
              await UserDAL.UpdateUserBankdetail(prof.user_id, {});
              cleaned = "yes";
            }
          }
        }

        //Check for double encrypted bank details
        if (accountIdDec1.length > 40 || bankBICDec1.length > 30) {
          let _accountIdDec1 = accountIdDec1;
          let _bankBICDec1 = bankBICDec1;
          if (accountIdDec1.length < 40) {
            _accountIdDec1 = Helper.encrypt(accountIdDec1, prof.secretKey);
          } else if (bankBICDec1.length < 30) {
            _bankBICDec1 = Helper.encrypt(bankBICDec1, prof.secretKey);
          }

          await UserDAL.UpdateUserBankdetail(prof.user_id, {
            accountHolderName: prof.bankDetail.accountHolderName,
            accountId: _accountIdDec1,
            bankBIC: _bankBICDec1,
            bankName: prof.bankDetail.bankName,
            accountIdOld: prof.bankDetail.accountId,
            bankBICOld: prof.bankDetail.bankBIC,
          });

          cleaned = "yes";
        }

        if (cleaned === "") {
          await UserDAL.UpdateUserCleanedStatus(prof.user_id);
        }
      }

      var result = { UserData: profile };
      Helper.response(res, 200, Messages.user.details[LOCALE], result);
    }
  } catch (err) {
    console.log(err);
    Helper.response(res, 500, Messages.api.error[LOCALE]);
  }
}
async function ScanDuplicates(req, res) {
  let users = await UserDAL.GetReplicatedUsers();
  for (const user of users) {
    var duplicateUser = {
      _id: user._id,
      status: user.status,
      mobileNumber: user.mobileNumber,
      updatedDate: user.updatedDate,
      createdDate: user.createdDate,
    };
    await UserDAL.CreateTempDuplicateUser(duplicateUser);
  }
  Helper.response(res, 200, "Temp duplicates collection created", users);
}
async function CreateDuplicateUser(req, res) {
  let users = await UserDAL.GetRandomUsers();
  for (const user of users) {
    var newUser = {
      mobileNumber: user.mobileNumber,
      countryCode: user.countryCode,
      secretKey: Helper.generateRandString(),
      language: LOCALE,
    };
    await UserDAL.CreateNewUser(newUser);
  }
  Helper.response(res, 200, "Duplicate created", users);
}
async function NotifyUserForExpiredProds(req, res) {
  try {
    let prods = await ProductDAL.GetProdToBeNotified();
    console.log(prods);
    prods.forEach(async (elem) => {
      await activityService.CreateActivity({
        creatorId: elem.user_id,
        productId: elem._id,
        activityType: "ProductExpired",
      });
      Helper.send_sms_to_seller(elem._id, elem.user_id, null, "expire");
    });
    return Helper.response(res, 200, Messages.api.success[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function ExpireBids(req, res) {
  try {
    let arrOfBids = await BidDAL.GetAllOutDatedBids();
    console.log(arrOfBids);
    await BidDAL.ExpireOutDatedBids(arrOfBids);
    await ProductDAL.ExpireOutDatedBidding(arrOfBids);
    return Helper.response(res, 200, Messages.api.success[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

async function UpdateOrderStatus() {
  OrderModel.find({ transaction_status: "Pending" }, (error, results) => {
    console.log(results.length);
    results.forEach(async (element) => {
      try {
        var upper = AddMinutesToDate(element.created_at, 30);
        var lower = AddMinutesToDate(element.created_at, 10);
        if (new Date(upper) > new Date() && new Date() > new Date(lower)) {
          console.log(element.created_at, lower, upper, new Date());
          console.log(element._id);
          let user_id = element.buyer;
          let order_id = element._id;
          let product_id = element.product;

          var transactionData = await OrderController.getTransactionData(
            element.checkout_id,
            element.order_number,
            element.payment_type
          );
          if (transactionData) {
            var transactionStatus = Helper.check_payment_status_code(
              transactionData.result
            );
            if (transactionStatus) {
              var transaction_id = transactionData.id;
              var registrationId = transactionData.registrationId;
              element.transaction_id = transaction_id;
              element.transaction_status = "Success";
              element.paymentReceivedFromBuyer = "Yes";
              element.transaction_detail = JSON.stringify(transactionData);
              OrderModel.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(element._id) },
                { $set: element },
                async function (err, success) {
                  if (err) {
                    // return Helper.response(res, 500, Messages.api.error[LOCALE]);
                  } else {
                    await OrderController.changeProductStatus(
                      product_id,
                      "Sold"
                    );
                    if (typeof registrationId !== "undefined")
                      await OrderController.saveCardId(user_id, registrationId);
                    await OrderController.sendPickupRequest(order_id);
                    await OrderController.returnLastBidderAmount(
                      product_id,
                      "buy"
                    );
                    // Helper.send_sms_to_seller(product_id, '', biddingData.bid_price, 'bid_seller');
                    Helper.send_sms_to_seller(
                      product_id,
                      user_id,
                      element.grand_total,
                      "buy_buyer"
                    );
                    Helper.send_sms_to_seller(
                      product_id,
                      "",
                      element.grand_total,
                      "buy_seller"
                    );
                    Helper.send_sms(
                      "966505594790",
                      `Dear Soum admin the product ( " + ${product_id} + " )has been sold, in ${ENV.NODE_ENV} enviroment`
                    );
                    // Helper.send_sms("966552110202", `Dear Soum admin the product ( " + ${product_id} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)
                    Helper.send_sms(
                      "966557252760",
                      `Dear Soum admin the product ( " + ${product_id} + " )has been sold, in ${ENV.NODE_ENV} enviroment`
                    );
                    // Helper.send_sms("966555455078", `Dear Soum admin the product ( " + ${product_id} + " )has been sold, in ${ENV.NODE_ENV} enviroment`)

                    await Helper.sendMailWithSendGrid(
                      ENV.EMAIL_SENDER,
                      ENV.Order_Status_Inquirer.split(","),
                      `Order -${element.order_number}- Success`,
                      null,
                      OrderController.ConvertOrderToHTML(element)
                    );
                    // return Helper.response(res, 200, Messages.order.success[LOCALE])
                    // Calling v2 to create DMO API
                  }
                }
              );
            } else {
              element.transaction_status = "Fail";
              element.transaction_detail = JSON.stringify(transactionData);

              await Helper.sendMailWithSendGrid(
                ENV.EMAIL_SENDER,
                ENV.Order_Status_Inquirer.split(","),
                `Order -${element.order_number}- Fail`,
                null,
                OrderController.ConvertOrderToHTML(element)
              );

              OrderModel.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(order_id) },
                { $set: element },
                async function (err, success) {
                  if (err) {
                    // return Helper.response(res, 500, Messages.api.error[LOCALE]);
                  } else {
                    await OrderController.changeProductStatus(
                      product_id,
                      "Available"
                    );
                    // return Helper.response(res, 400, transactionData.result.description);
                  }
                }
              );
            }
          } else {
            await Helper.sendMailWithSendGrid(
              ENV.EMAIL_SENDER,
              ENV.Order_Status_Inquirer.split(","),
              `Order -${element.order_number}- Fail`,
              null,
              OrderController.ConvertOrderToHTML(element)
            );
            await OrderController.changeProductStatus(product_id, "Available");
            // return Helper.response(res, 400, Messages.order.payment_failed[LOCALE]);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  });
}

async function GenerateNotification(req, res) {
  // get all activity
  try {
    let openActivity = await activityService.GetAllActiveActivity();
    let notificationList = [];
    for (let x = 0; x < openActivity.length; x++) {
      let activity = openActivity[x];
      let toCloseSubscriptions = [];
      let activeSubscription =
        await subscriptionService.GetAllSubscriptionByProdId(
          activity.productId,
          activity.activityType,
          activity.activityType == "AnswerQuestion" ? activity.questionId : null
        );

      for (let index = 0; index < activeSubscription.length; index++) {
        let noti = {
          productData: {
            brandName: activity.brand.brand_name,
            brandNameAr: activity.brand.brand_name_ar,
            modelName: activity.model.model_name,
            modelNameAr: activity.model.model_name_ar,
            bidValue: activity.bidValue,
            productId: activity.productId,
            productImages: activity.product.product_images,
          },
          activityType: activity.activityType,
          userData: {
            userName: activity.creator ? activity.creator.name : null,
            id: activeSubscription[index].subscription._id,
          },
          askSeller: {
            questioner_id: activity.askSeller
              ? activity.askSeller.questioner_id
              : "",
            question: activity.askSeller ? activity.askSeller.question : "",
            answer: activity.askSeller ? activity.askSeller.answer : "",
            sellerName: activity.seller.name,
            questionerName: activity.questioner ? activity.questioner.name : "",
          },
        };
        if (activity.activityType == "BuyerBidAccepted")
          toCloseSubscriptions.push(activeSubscription[index]._id);

        notificationList.push(noti);
      }

      if (toCloseSubscriptions.length > 0)
        await subscriptionService.CloseSubscription(toCloseSubscriptions);
    }

    if (openActivity.length > 0)
      await activityService.CloseActivity(openActivity.map((x) => x._id));
    if (notificationList.length > 0)
      await notificationService.CreateNotificationList(notificationList);

    return Helper.response(res, 200, Messages.api.success[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

const CronApis = {
  UpdateProductAvailability,
  UpdateOrderStatus,
  GenerateNotification,
  NotifyUserForExpiredProds,
  SanitizeBankDetails,
  ScanDuplicates,
  CreateDuplicateUser,
  ExpireBids,
  AllBiddingList: async (req, res) => {
    //'sell_status': 'Available',
    let query = {
      status: "Active",
      bidding: { $exists: true },
      $where: "this.bidding.length > 0",
    };
    //db.getCollection('products').find({status: 'Active', bidding : {$exists:true}, $where:'this.bidding.length > 0'}, { bidding : {$slice : -1}})
    let col = { _id: 1, bidding: { $slice: -1 }, user_id: 1, bid_price: 1 };
    var aggr = [
      {
        $match: {
          status: "Active",
          bidding: { $exists: true },
          $expr: { $gt: [{ $size: "$bidding" }, 0] },
        },
      },
      {
        $project: {
          _id: 1,
          user_id: 1,
          bid_price: 1,
          current_bid_price: 1,
          bidding: { $arrayElemAt: ["$bidding", -1] },
        },
      },
      {
        $match: {
          "bidding.bid_status": Helper.bidStatus.ACTIVE,
          "bidding.transaction_status": "Success",
        },
      },
    ];
    const region = await SettingDAL.SettingValue("region");
    //ProductModel.find(query, col, { lean: true }, function (err, result) {
    ProductModel.aggregate(aggr, function (err, result) {
      if (err) {
        Helper.response(res, 500, Messages.api.fail[LOCALE]);
      } else {
        //console.log(result);
        result.map(function (item) {
          if (item.bidding.length > 0) {
            //console.log(item.bidding[0]['bid_date'])
            var days = Helper.getDays(item.bidding[0]["bid_date"], "");
            if (
              item.bidding[0]["bid_status"] == Helper.bidStatus.ACTIVE &&
              days > 5
            ) {
              let product_id = item._id;
              let transaction_id = item.bidding[0]["transaction_id"];
              let payment_type = item.bidding[0]["payment_type"];
              let pay_bid_amount = item.bidding[0]["pay_bid_amount"];
              //Helper.apply_transaction_operations(transaction_id, payment_type, pay_bid_amount, "reversal");
              var bid_id = item.bidding[0].bid_id;
              var user_id = item.bidding[0].user_id;
              var saveobj = {
                "bidding.$.bid_status": Helper.bidStatus.REJECTED,
                "bidding.$.transaction_status": "Refunded",
                current_bid_price: item.bid_price,
              };
              ProductModel.findOneAndUpdate(
                {
                  _id: mongoose.Types.ObjectId(product_id),
                  "bidding.bid_id": mongoose.Types.ObjectId(bid_id),
                },
                { $set: saveobj },
                async function (err, success) {
                  if (err) {
                    console.log("error");
                  } else {
                    var transactionData = await Helper.get_transaction_report(
                      transaction_id,
                      payment_type
                    );
                    var transactionStatus = Helper.check_payment_status_code(
                      transactionData.result
                    );
                    //console.log(transactionStatus);
                    if (transactionStatus) {
                      Helper.apply_transaction_operations(
                        transaction_id,
                        payment_type,
                        pay_bid_amount,
                        "reversal",
                        region.currency
                      );
                      console.log("success");
                    }
                  }
                }
              );
            }
          }
        });
        //var result = { "bankList": result };
        console.log("success");
      }
    }).catch(function (error) {
      console.log(error);
    });
  },

  SendAmountToSeller: (req, res) => {
    try {
      //'sell_status': 'Available',
      let query = {
        transaction_status: "Success",
        dispute: "No",
        status: "Delivered",
        paymentMadeToSeller: "No",
      };
      //db.getCollection('products').find({status: 'Active', bidding : {$exists:true}, $where:'this.bidding.length > 0'}, { bidding : {$slice : -1}})
      let col = {};
      OrderModel.find(query, col)
        .lean()
        .populate(
          "seller",
          "name mobileNumber countryCode profilePic bankDetail secretKey address"
        )
        .populate("buyer", "name mobileNumber countryCode profilePic")
        .populate("product", "pick_up_address")
        .exec(async function (err, result) {
          if (err) {
            console.log("error");
          } else {
            //console.log(result);
            await Promise.all(
              result.map(async function (item) {
                //console.log(item.updated_at);
                //console.log(item.bidding[0]['bid_date'])
                //var days = Helper.getDays(item.updated_at, '');
                var hours = Helper.calculateHours(item.delivery_time, "");
                if (hours > 24) {
                  //let transaction_id = item.transaction_id;
                  //let payment_type = item.payment_type;
                  //let grand_total = item.grand_total;
                  var order_id = item._id;
                  var orderData = item;
                  var sellerData = item.seller;
                  //sellerData.bankDetail.accountId = 'SA9650000000033217408001'; //Helper.decrypt(sellerData.bankDetail.accountId, sellerData.secretKey);
                  //sellerData.bankDetail.bankBIC = 'AAALSARI'; //Helper.decrypt(sellerData.bankDetail.bankBIC, sellerData.secretKey);
                  //console.log(sellerData);
                  sellerData.bankDetail.accountId = Helper.decrypt(
                    sellerData.bankDetail.accountId,
                    sellerData.secretKey
                  );
                  sellerData.bankDetail.bankBIC = Helper.decrypt(
                    sellerData.bankDetail.bankBIC,
                    sellerData.secretKey
                  );
                  //console.log(sellerData);
                  var sellerAmount = orderData.buy_amount;
                  var baderAmount =
                    orderData.grand_total - orderData.buy_amount;
                  //console.log(orderData.grand_total);

                  var tokenData = await Helper.hyper_split_login();
                  if (tokenData) {
                    var splitData = await Helper.hyper_split(
                      orderData.order_number,
                      sellerData,
                      sellerAmount,
                      baderAmount,
                      tokenData
                    );
                    if (splitData) {
                      OrderModel.updateOne(
                        { _id: mongoose.Types.ObjectId(order_id) },
                        {
                          $set: {
                            split_payout_detail: splitData,
                            paymentMadeToSeller: "Yes",
                          },
                        },
                        function (err, success) {
                          if (err) {
                            console.log("error");
                          } else {
                            console.log("delivered");
                          }
                        }
                      );
                    } else {
                      console.log("error");
                    }
                  } else {
                    console.log("error");
                  }
                }
              })
            );
            //var result = { "bankList": result };
            //Helper.response(res, 200, Messages.api.success['en']);
            console.log("success");
          }
        });
    } catch (error) {
      console.log(error);
      //Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  CheckDeliveryStatus: (req, res) => {
    try {
      //'sell_status': 'Available',
      let query = {
        transaction_status: "Success",
        dispute: "No",
        status: "Active",
        paymentMadeToSeller: "No",
      };
      //db.getCollection('products').find({status: 'Active', bidding : {$exists:true}, $where:'this.bidding.length > 0'}, { bidding : {$slice : -1}})
      let col = {};
      OrderModel.find(query, col)
        .lean()
        .populate(
          "seller",
          "name mobileNumber countryCode profilePic bankDetail secretKey"
        )
        .populate("buyer", "name mobileNumber countryCode profilePic")
        .populate("product", "pick_up_address")
        .exec(async function (err, result) {
          if (err) {
            console.log("error");
          } else {
            //console.log(result);
            await Promise.all(
              result.map(async function (item) {
                if (
                  typeof item.shipment_detail.ShipmentResponse != "undefined" &&
                  typeof item.shipment_detail.ShipmentResponse
                    .ShipmentIdentificationNumber != "undefined"
                ) {
                  let shipment_identification_number =
                    item.shipment_detail.ShipmentResponse
                      .ShipmentIdentificationNumber;
                  let order_id = item._id;
                  let today = new Date().toISOString();
                  let PickupTimestamp = today;
                  let ref = Helper.generateReferenceNumber(32);
                  //Helper.generateRandString();
                  //console.log(PickupTimestamp);
                  var trackData = await Helper.track_shipment(
                    shipment_identification_number,
                    PickupTimestamp,
                    ref
                  );
                  if (trackData) {
                    var event =
                      trackData.trackShipmentRequestResponse.trackingResponse
                        .TrackingResponse.AWBInfo.ArrayOfAWBInfoItem.Pieces
                        .PieceEvent;
                    var obj = { track_detail: trackData };
                    if (typeof event !== "undefined") {
                      var EventCode =
                        event.ArrayOfPieceEventItem[0].ServiceEvent.EventCode;
                      var Description =
                        event.ArrayOfPieceEventItem[0].ServiceEvent.Description;
                      if (EventCode == "OK") {
                        obj.status = "Delivered";
                        obj.delivery_desc = Description;
                        obj.delivery_time = new Date();
                      } else {
                        obj.delivery_desc = Description;
                      }
                    }
                    OrderModel.updateOne(
                      { _id: mongoose.Types.ObjectId(order_id) },
                      { $set: obj },
                      function (err, success) {
                        if (err) {
                          console.log("error");
                        } else {
                          console.log("delivered");
                        }
                      }
                    );
                  }
                }
              })
            );
            /*await Promise.all(result.map(async function (item) {
							//console.log(item.updated_at);
							//console.log(item.bidding[0]['bid_date'])
							//var days = Helper.getDays(item.updated_at, '');
							var hours = Helper.calculateHours(item.delivery_time, '');
							if (hours > 24) {
								//let transaction_id = item.transaction_id;
								//let payment_type = item.payment_type;
								//let grand_total = item.grand_total;
								var order_id = item._id;
								var orderData = item;
								var sellerData = item.seller;
								sellerData.bankDetail.accountId = 'SA9650000000033217408001'; //Helper.decrypt(sellerData.bankDetail.accountId, sellerData.secretKey);
								sellerData.bankDetail.bankBIC = 'AAALSARI'; //Helper.decrypt(sellerData.bankDetail.bankBIC, sellerData.secretKey);
								//console.log(sellerData);
								var sellerAmount = orderData.buy_amount;
								var baderAmount = orderData.grand_total - orderData.buy_amount;
								//console.log(orderData.grand_total);

								var tokenData = await Helper.hyper_split_login();
								if (tokenData) {
									var splitData = await Helper.hyper_split(orderData.order_number, sellerData, sellerAmount, baderAmount, tokenData);
									if (splitData) {
										OrderModel.updateOne({ _id: mongoose.Types.ObjectId(order_id) }, { $set: { "split_payout_detail": splitData, "paymentMadeToSeller": "Yes" } }, function (err, success) {
											if (err) {
												console.log("error")
											} else {
												console.log("delivered")
											}
										});
									} else {
										console.log("error")
									}
								} else {
									console.log("error")
								}
							}
						})
						);*/
            //var result = { "bankList": result };
            //Helper.response(res, 200, Messages.api.success['en']);
            console.log("success");
          }
        });
    } catch (error) {
      console.log(error);
      //Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  ProductBackToAvailable: (req, res) => {
    //'sell_status': 'Available',
    let query = { sell_status: "Locked", status: { $ne: "Delete" } };
    //db.getCollection('products').find({status: 'Active', bidding : {$exists:true}, $where:'this.bidding.length > 0'}, { bidding : {$slice : -1}})
    let col = {};
    ProductModel.find(query, col, { lean: true }, function (err, result) {
      if (err) {
        console.log("error");
      } else {
        if (result.length > 0) {
          // get all locked products
          // for each one do as follow
          // get any order for this product within the last 20 min
          // get accepted bid (if found) on the product within the last 20 min
          // if any is found this means that i will leave it locked
          // else i will make it Available again
          result.map(async function (item) {
            let foundOrder = false;
            const order = await OrderDAL.GetLastOrder(item._id);
            if (order) {
              foundOrder =
                Math.abs(new Date() - order.created_at) / (1000 * 60) < 20;
            }

            const successOrder = await OrderDAL.GetSuccessOrder(item._id);

            if (successOrder) {
              await ProductModel.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(item._id) },
                {
                  $set: { sell_status: "Sold" },
                  $unset: { search_sync: 1 },
                }
              );
            }

            if (!foundOrder && !successOrder) {
              await ProductModel.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(item._id) },
                {
                  $set: { sell_status: "Available" },
                  $unset: { search_sync: 1 },
                }
              );
            }
          });
        }
      }
    }).catch(function (error) {
      //console.log(error);
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    });
  },

  DeleteBid: (req, res) => {
    //'sell_status': 'Available',
    let query = {
      status: "Active",
      bidding: { $exists: true },
      $where: "this.bidding.length > 0",
    };
    //db.getCollection('products').find({status: 'Active', bidding : {$exists:true}, $where:'this.bidding.length > 0'}, { bidding : {$slice : -1}})
    let col = { _id: 1, bidding: { $slice: -1 }, user_id: 1, bid_price: 1 };
    var aggr = [
      {
        $match: {
          status: "Active",
          bidding: { $exists: true },
          $expr: { $gt: [{ $size: "$bidding" }, 0] },
        },
      },
      {
        $addFields: {
          bidding: {
            $filter: {
              input: "$bidding",
              as: "bidding",
              cond: { $eq: ["$$bidding.transaction_status", "Pending"] },
            },
          },
        },
      },
      //{ $project: { _id: 1, user_id: 1, bid_price: 1, current_bid_price: 1, "bidding": { $arrayElemAt: ['$bidding', -1] } } },
      {
        $project: {
          _id: 1,
          user_id: 1,
          bid_price: 1,
          current_bid_price: 1,
          bidding: 1,
        },
      },
      {
        $match: {
          "bidding.bid_status": Helper.bidStatus.ACTIVE,
          "bidding.transaction_status": "Pending",
        },
      },
    ];
    //ProductModel.find(query, col, { lean: true }, function (err, result) {
    ProductModel.aggregate(aggr, function (err, result) {
      if (err) {
        Helper.response(res, 500, Messages.api.fail[LOCALE]);
      } else {
        //console.log(result); return false;
        var result = JSON.parse(JSON.stringify(result));
        result.map(function (item) {
          if (item.bidding.length > 0) {
            item.bidding.map(async function (elem) {
              //console.log(elem);
              //var transactionData = await Helper.get_payment_status(elem.checkout_id, elem.payment_type);
              //console.log("transactionData ---", transactionData);

              elem["bid_date"] = new Date(elem["bid_date"]).toISOString();
              var minutes = Helper.calculateMinutes(elem["bid_date"], "");
              //console.log(minutes);
              if (minutes > 10) {
                //console.log(minutes);
                var saveobj = {
                  $pull: {
                    bidding: { bid_id: mongoose.Types.ObjectId(elem.bid_id) },
                  },
                };
                //console.log(saveobj); return false;
                ProductModel.findOneAndUpdate(
                  {
                    _id: mongoose.Types.ObjectId(item._id),
                    "bidding.bid_id": mongoose.Types.ObjectId(elem.bid_id),
                  },
                  saveobj,
                  async function (err, success) {
                    if (err) {
                      console.log("error");
                    } else {
                      console.log("success");
                    }
                  }
                );
              }
            });
          }
        });
        console.log("success");
      }
    }).catch(function (error) {
      console.log(error);
    });
  },

  AddBank: (req, res) => {
    try {
      // Read bank.json file
      fs.readFile("bank-list.json", function (err, data) {
        // Check for errors
        if (err) throw err;
        // Converting to JSON
        const banks = JSON.parse(data);
        //console.log(JSON.stringify(users.surveyData)); // Print users
        var bankData = banks.bankList;
        bankData.map(function (item) {
          BankModel.findOne({ bankCode: item.bankCode }, (err, bankResult) => {
            if (err) {
              Helper.response(res, 500, Messages.api.fail[LOCALE]);
            } else if (!bankResult) {
              let bank = new BankModel(item);
              bank.save((error, result) => {
                if (error) {
                  Helper.response(res, 500, Messages.api.fail[LOCALE]);
                } else {
                  //Helper.response(res, 200, "Bank added");
                  console.log("added");
                }
              });
            } else {
              //Helper.response(res, 200, "Bank already added");
              //console.log("already added")
            }
          });
        });
      });
    } catch (error) {
      //console.log(error);
      Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  HyperSplitPayout: async (req, res) => {
    try {
      var tokenData = await Helper.hyper_split_login();
      if (tokenData) {
        var splitData = await Helper.hyper_split_test(tokenData);
        if (splitData) {
          //console.log(splitData)
          //Helper.response(res, 200, "success");
          //res.send(splitData);
          res.send(splitData);
        } else {
          console.log("error");
        }
      } else {
        console.log("error1");
      }
    } catch (error) {
      console.log(error);
      //Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },
};

module.exports = CronApis;
