const OrderModel = require("../../../models/OrderModel.js");
const Helper = require("../../../config/helper.js");
const Messages = require("../../../config/messages.js");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const ProductModel = require("../../../models/ProductModel");
const UserDAL = require("../../../Data/UserDAL");
const ProductDAL = require("../../../Data/ProductDAL");
const moment = require("moment");
const ibantools = require("ibantools");
const BankModel = require("../../../models/BankModel.js");

const getNewConditionName = (product) => {
  if (!product || !product.grade) {
    return product;
  }
  const old_condition_en = ["like new", "lightly used", "fair"];
  const new_condition_en = [
    "Excellent condition",
    "Good condition",
    "Noticeably used",
  ];
  const new_condition_ar = ["حالة ممتازة", "حالة جيدة", "إستخدام ملحوظ"];
  const condition_index_en = old_condition_en.indexOf(
    product.grade.toLowerCase()
  );

  if (condition_index_en > -1) {
    product.grade = new_condition_en[condition_index_en];
    product.grade_ar = new_condition_ar[condition_index_en];
    if (product.arGrade) {
      product.arGrade = product.grade_ar;
    }
  }

  return product;
};

async function GetProfile(req, res) {
  try {
    const userId = req.user._id;
    let profile = await UserDAL.GetUserProfileById(userId);
    if (!profile) {
      Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    } else {
      if (
        profile.bankDetail &&
        !ibantools.isValidIBAN(profile.bankDetail.accountId)
      ) {
        profile.bankDetail.accountId = profile.bankDetail.hasOwnProperty(
          "accountId"
        )
          ? Helper.maskString(
              Helper.decrypt(profile.bankDetail.accountId, profile.secretKey),
              4
            )
          : "";
        profile.bankDetail.bankBIC = profile.bankDetail.bankBIC
          ? Helper.maskString(
              Helper.decrypt(profile.bankDetail.bankBIC, profile.secretKey),
              3
            )
          : "";
        const bankResult = await BankModel.findOne({
          bankCode: profile.bankDetail.bankBIC,
        });
        profile.bankDetail.isNonSaudiBank = !bankResult
          ? false
          : bankResult.isNonSaudiBank;
      }
      const result = { UserData: profile };
      Helper.response(res, 200, Messages.user.details[LOCALE], result);
    }
  } catch (err) {
    console.log(err);
    Helper.response(res, 500, Messages.api.error[LOCALE]);
  }
}

async function EditProfile(req, res) {
  try {
    const userId = req.user._id;
    let userData = await UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    if (req.body && req.body.name) {
      userData.name = req.body.name;
    }
    if (req.body && req.body.hasOwnProperty("lastName")) {
      userData.lastName = req.body.lastName;
    }
    if (req.body && req.body.email) {
      userData.email = req.body.email;
    }
    if (req.body && req.body.hasOwnProperty("bio")) {
      userData.bio = req.body.bio;
    }
    if (req.body && req.body.hasOwnProperty("profilePic")) {
      userData.profilePic = req.body.profilePic;
    }
    await UserDAL.UpdateUser(userData);
    Helper.response(res, 200, Messages.user.updated[LOCALE]);
  } catch (error) {
    console.log(error);
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function SetLanguauge(req, res) {
  try {
    const userId = req.user._id;
    let userData = await UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    userData.language = req.body.language;
    await UserDAL.UpdateUser(userData);
    Helper.response(res, 200, Messages.language.updated[LOCALE]);
  } catch (error) {
    console.log(error);
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function GetAddressList(req, res) {
  try {
    const userId = req.user._id;
    const result = UserDAL.FilterUser(userId, { address: 1 });
    var addressList = { addressList: result.address };
    Helper.response(res, 200, "Address list get successfully", addressList);
  } catch (error) {
    console.log(error);
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function SetAddress(req, res, isUpdate) {
  try {
    // have no idea why ?
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    const userId = req.user._id;
    const userData = await UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    userData.address = {
      address_id: isUpdate
        ? mongoose.Types.ObjectId(req.params.address_id)
        : mongoose.Types.ObjectId(),
      address: req.body.address,
      city: req.body.city,
      postal_code: req.body.postal_code,
      address_type: req.body.address_type ? req.body.address_type : "",
      latitude: req.body.latitude ? req.body.latitude : "",
      longitude: req.body.longitude ? req.body.longitude : "",
    };
    await UserDAL.UpdateUser(userData);
    var returnData = { address_id: userData.address.address_id };
    return Helper.response(
      res,
      200,
      req.params.address_id
        ? Messages.address.updated[LOCALE]
        : Messages.address.added[LOCALE],
      returnData
    );
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AddAddress(req, res) {
  SetAddress(req, res, false);
}

async function EditAddress(req, res) {
  SetAddress(req, res, true);
}

async function DeleteAddress(req, res) {
  try {
    // have no idea why ?
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    const userId = req.user._id;
    let userData = await UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    userData.address = null;
    await UserDAL.UpdateUser(userData);
    return Helper.response(res, 200, Messages.address.deleted[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function GetCardList(req, res) {
  try {
    const userId = req.user._id;
    const result = UserDAL.FilterUser(userId, { cards: 1 });
    var cardList = { cardList: result.cards };
    Helper.response(res, 200, "Card list get successfully", cardList);
  } catch (error) {
    console.log(error);
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function SetCard(req, res, isUpdate) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    const userId = req.user._id;
    let userData = UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    if (IsUpdate) {
      userData = userData.cards.filter(
        (card) => card.cardId != req.params.cardId
      );
    }
    userData.cards.push({
      cardId: IsUpdate
        ? mongoose.Types.ObjectId(req.params.cardId)
        : mongoose.Types.ObjectId(),
      cardHolderName: cardHolderName,
      cardNumber: cardNumber,
      cardType: cardType,
      expiryDate: expiryDate,
    });
    await UserDAL.UpdateUser(userData);
    return Helper.response(
      res,
      200,
      IsUpdate ? "Card updated successfully" : "Card added successfully"
    );
  } catch (error) {
    console.log(error);
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AddCard(req, res) {
  SetCard(req, res, false);
}

async function EditCard(req, res) {
  SetCard(req, res, true);
}

async function DeleteCard(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    const userId = req.user._id;
    let userData = UserDAL.GetFullUser(userId);
    if (IsUpdate) {
      userData = userData.cards.filter(
        (card) => card.cardId != req.params.cardId
      );
    }
    await UserDAL.UpdateUser(userData);
    return Helper.response(res, 200, "Card removed successfully");
  } catch (error) {
    console.log(error);
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function SetBank(req, res, isUpdate) {
  try {
    // have no idea why ?
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    const userId = req.user._id;
    const userData = await UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    const { bankBIC, accountId } = req.body;

    let updatedAccountId = !accountId.startsWith("*") ? accountId: null;
    if (updatedAccountId && !ibantools.isValidIBAN(updatedAccountId)) {
      return Helper.response(res, 400, Messages.bank.invalid[LOCALE]);
    }

    let updatedBankBIC = null;
    if (bankBIC && !bankBIC.startsWith("*")) {
      updatedBankBIC = bankBIC;
    }

    if (req.body.hasVatRegisteredStore) {
      if (!req.body.vatRegisteredName || !req.body.storeVatNumber) {
        return Helper.response(
          res,
          400,
          Messages.bank.missingStoreDetail[LOCALE]
        );
      }
    }
    if (!userData?.secretKey) {
      userData.secretKey = Helper.generateRandomSecretKey(10);
    }
    
    userData.bankDetail = {
      accountHolderName: req.body.accountHolderName,
      accountId: updatedAccountId ? Helper.encrypt(updatedAccountId, userData.secretKey) : userData.bankDetail.accountId,
      bankBIC: updatedBankBIC ? Helper.encrypt(updatedBankBIC, userData.secretKey) : userData.bankDetail.bankBIC,
      bankName: req.body.bankName,
      hasVatRegisteredStore: req.body.hasVatRegisteredStore,
      storeVatNumber: req.body.hasVatRegisteredStore
        ? req.body.storeVatNumber
        : null,
      vatRegisteredName: req.body.hasVatRegisteredStore
        ? req.body.vatRegisteredName
        : null,
    };
    userData.updatedDate = new Date();
    await UserDAL.UpdateUser(userData);
    return Helper.response(
      res,
      200,
      isUpdate ? Messages.bank.updated[LOCALE] : Messages.bank.added[LOCALE]
    );
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AddBankDetail(req, res) {
  SetBank(req, res, false);
}

async function EditBankDetail(req, res) {
  SetAddress(req, res, true);
}

async function DeleteBankDetail(req, res) {
  try {
    // have no idea why ?
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    const userId = req.user._id;
    const userData = await UserDAL.GetFullUser(userId);
    if (!userData) Helper.response(res, 400, Messages.user.not_exists[LOCALE]);
    userData.bankDetail = null;
    userData.updatedDate = new Date();
    await UserDAL.UpdateUser(userData);
    Helper.response(res, 200, Messages.bank.deleted[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

module.exports = {
  //profile route
  GetProfile,
  EditProfile,
  SetLanguauge,
  GetAddressList,
  AddAddress,
  EditAddress,
  DeleteAddress,
  GetCardList,
  AddCard,
  EditCard,
  DeleteCard,
  AddBankDetail,
  DeleteBankDetail,
  GetBoughtSoldProducts: (req, res) => {
    let user_id = req.user._id;
    var date = moment().subtract(10, "minute").toDate();
    let query = {
      $or: [
        { transaction_status: "Success" },
        {
          $and: [
            { transaction_status: "Pending" },
            {
              created_at: {
                $gte: date,
              },
            },
          ],
        },
      ],
      buyer: user_id,
    };
    let col = {};
    OrderModel.find(query, col)
      .lean()
      .populate("seller", "name mobileNumber countryCode profilePic")
      .populate("buyer", "name mobileNumber countryCode profilePic")
      .populate({
        path: "product",
        populate: {
          path: "category_id", // in blogs, populate comments
          select: "category_name category_name_ar",
        },
      })
      .populate({
        path: "product",
        populate: {
          path: "brand_id", // in blogs, populate comments
          select: "brand_name brand_name_ar",
        },
      })
      .populate({
        path: "product",
        populate: {
          path: "model_id", // in blogs, populate comments
          select: "model_name model_name_ar current_price",
        },
      })
      .lean()
      .exec(function (err, result) {
        console.log(err);
        if (err) {
          Helper.response(res, 500, Messages.api.error[LOCALE]);
        } else {
          var returnArr = [];
          if (result.length > 0) {
            result.map(function (item) {
              item.isUserNotified = item.isUserNotified
                ? item.isUserNotified
                : false;
              if (LOCALE == "ar" && item && item.product) {
                item.product.category_id.category_name =
                  item.product.category_id.category_name_ar;
                item.product.brand_id.brand_name =
                  item.product.brand_id.brand_name_ar;
                item.product.model_id.model_name =
                  item.product.model_id.model_name_ar;
              }
            });
            //returnArr = result;
          }
          var List = { productList: result };
          Helper.response(res, 200, Messages.product.list[LOCALE], List);
        }
      });
  },

  GetSellSoldProducts: (req, res) => {
    let user_id = req.user._id;
    let query = { transaction_status: "Success", seller: user_id };
    let col = {};
    OrderModel.find(query, col)
      .lean()
      .sort({
        updated_at: -1,
      })
      .limit(40)
      .populate("seller", "name mobileNumber countryCode profilePic")
      .populate("buyer", "name mobileNumber countryCode profilePic")
      .populate({
        path: "product",
        populate: {
          path: "category_id", // in blogs, populate comments
          select: "category_name category_name_ar",
        },
      })
      .populate({
        path: "product",
        populate: {
          path: "brand_id", // in blogs, populate comments
          select: "brand_name brand_name_ar",
        },
      })
      .populate({
        path: "product",
        populate: {
          path: "model_id", // in blogs, populate comments
          select: "model_name model_name_ar current_price",
        },
      })

      .lean()
      .exec(function (err, result) {
        console.log(err);
        if (err) {
          Helper.response(res, 500, Messages.api.error[LOCALE]);
        } else {
          var returnArr = [];
          if (result.length > 0) {
            result.map(function (item) {
              item.isUserNotified = item.isUserNotified
                ? item.isUserNotified
                : false;
              if (LOCALE == "ar" && item && item.product) {
                item.product.category_id.category_name =
                  item.product.category_id.category_name_ar;
                item.product.brand_id.brand_name =
                  item.product.brand_id.brand_name_ar;
                item.product.model_id.model_name =
                  item.product.model_id.model_name_ar;
              }
              item.product = getNewConditionName(item.product);
            });
            //returnArr = result;
          }
          var List = { productList: result };
          Helper.response(res, 200, Messages.product.list[LOCALE], List);
        }
      });
  },

  GetMyBidProducts_old: (req, res) => {
    let user_id = req.user._id;
    //let query = { $or: [{ buyer: user_id }, { seller: user_id }] };
    let query = { "bidding.user_id": user_id };
    let col = {
      _id: 1,
      category_id: 1,
      brand_id: 1,
      model_id: 1,
      varient: 1,
      sell_price: 1,
      bid_price: 1,
      product_images: 1,
      defected_images: 1,
      varient_id: 1,
      body_cracks: 1,
      description: 1,
      answer_to_questions: 1,
      answer_to_questions_ar: 1,
      score: 1,
      grade: 1,
      current_bid_price: 1,
      bidding: { $slice: -1 },
    }; //my_bid: {"$arrayElemAt": ["$bidding.bid_price", -1]}
    ProductModel.find(query, col)
      .lean()
      .populate("category_id", "category_name category_name_ar")
      .populate("brand_id", "brand_name brand_name_ar")
      .populate("model_id", "model_name model_name_ar current_price")
      .populate("varient_id", "varient current_price")
      .exec(function (err, result) {
        if (err) {
          Helper.response(res, 500, Messages.api.error[LOCALE]);
        } else {
          //let newResult = JSON.parse(JSON.stringify(result));
          //console.log(newResult.model_id.current_price)
          result.map((item) => {
            //console.log(item.bidding);
            //item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
            let discount =
              100 - (item.sell_price * 100) / item.varient_id.current_price;
            item.discount = discount.toFixed();
            item.current_price = item.varient_id.current_price;
            if (item.current_bid_price == item.my_bid) {
              //item.bid_text = "Your bid is the highest bid";
              item.bid_text = Messages.bid.highest[LOCALE];
            } else if (item.current_bid_price > item.my_bid) {
              //item.bid_text = "Your bid " + item.my_bid + " SAR is no longer highest bid";
              item.bid_text = Messages.bid.lower[LOCALE];
            }

            if (LOCALE == "ar" && item) {
              item.category_id.category_name =
                item.category_id.category_name_ar;
              item.brand_id.brand_name = item.brand_id.brand_name_ar;
              item.model_id.model_name = item.model_id.model_name_ar;
            }
          });
          //let discount = 100 - (result.sell_price * 100 / result.model_id.current_price);
          //result.discount = discount.toFixed();
          //result.current_price = result.model_id.current_price;

          var List = { productList: result };
          Helper.response(res, 200, Messages.product.list[LOCALE], List);
        }
      });
  },

  GetMyBidProducts: (req, res) => {
    let user_id = req.user._id;
    //let query = { $or: [{ buyer: user_id }, { seller: user_id }] };
    //let query = {'bidding.user_id' : user_id}
    //let col = { _id:1, category_id:1, brand_id:1, model_id:1, varient: 1, sell_price: 1, bid_price: 1, product_images: 1, defected_images: 1, body_cracks: 1, description: 1, answer_to_questions: 1, current_bid_price:1, bidding: { $slice: -1 } }; //my_bid: {"$arrayElemAt": ["$bidding.bid_price", -1]}
    var aggr = [
      {
        $match: {
          "bidding.user_id": mongoose.Types.ObjectId(user_id),
          status: "Active",
          $or: [{ sell_status: "Locked" }, { sell_status: "Available" }],
        },
      },
      {
        $addFields: {
          bidding: {
            $filter: {
              input: "$bidding",
              as: "bidding",
              cond: {
                $eq: ["$$bidding.user_id", mongoose.Types.ObjectId(user_id)],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category_id",
          foreignField: "_id",
          as: "category_id",
        },
      },
      { $unwind: "$category_id" },
      {
        $lookup: {
          from: "brands",
          localField: "brand_id",
          foreignField: "_id",
          as: "brand_id",
        },
      },
      { $unwind: "$brand_id" },
      {
        $lookup: {
          from: "device_models",
          localField: "model_id",
          foreignField: "_id",
          as: "model_id",
        },
      },
      { $unwind: "$model_id" },
      {
        $lookup: {
          from: "varients",
          localField: "varient_id",
          foreignField: "_id",
          as: "varient_id",
        },
      },
      { $unwind: "$varient_id" },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      { $unwind: "$seller" },
      {
        $project: {
          _id: 1,
          product_id: "$_id",
          user_id: 1,
          bidding: 1,
          varient: 1,
          sell_price: 1,
          bid_price: 1,
          product_images: 1,
          defected_images: 1,
          body_cracks: 1,
          description: 1,
          answer_to_questions: 1,
          answer_to_questions_ar: 1,
          score: 1,
          grade: 1,
          current_bid_price: 1,
          my_bid: { $arrayElemAt: ["$bidding.bid_price", -1] },
          bid_status: { $arrayElemAt: ["$bidding.bid_status", -1] },
          bid_id: { $arrayElemAt: ["$bidding.bid_id", -1] },
          payment_take: { $arrayElemAt: ["$bidding.payment_take", -1] },
          remaining_bid_amount: {
            $arrayElemAt: ["$bidding.remaining_bid_amount", -1],
          },
          grand_total: { $arrayElemAt: ["$bidding.grand_total", -1] },
          "category_id.category_name": 1,
          "category_id.category_name_ar": 1,
          "brand_id.brand_name": 1,
          "brand_id.brand_name_ar": 1,
          "model_id.model_name": 1,
          "model_id.model_name_ar": 1,
          "model_id.current_price": 1,
          seller_id: "$seller._id",
          seller_name: "$seller.name",
          "varient_id.varient": 1,
          "varient_id.current_price": 1,
        },
      },
    ];
    ProductModel.aggregate(aggr).exec(function (err, result) {
      if (err) {
        Helper.response(res, 500, Messages.api.fail[LOCALE]);
      } else {
        //let newResult = JSON.parse(JSON.stringify(result));
        //console.log(newResult.model_id.current_price)
        result.map((item) => {
          //console.log(item.bidding);
          //item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
          let discount =
            100 - (item.sell_price * 100) / item.varient_id.current_price;
          item.discount = discount.toFixed();
          item.current_price = item.varient_id.current_price;
          //item.bid_price = item.current_bid_price;
          var pay_amount = "";
          if (
            typeof item.payment_take !== "undefined" &&
            item.payment_take == "partial"
          ) {
            pay_amount = item.remaining_bid_amount;
          } else if (
            typeof item.payment_take !== "undefined" &&
            item.payment_take == "full"
          ) {
            pay_amount = item.grand_total;
          }
          item.pay_amount = pay_amount;
          if (item.bid_status == Helper.bidStatus.ACCEPTED) {
            //item.bid_text = "Your bid has been accepted";
            item.bid_text = Messages.bid.accepted[LOCALE].replace(
              "_BIDVALUE_",
              item.current_bid_price
            );
          } else if (
            item.bid_status == Helper.bidStatus.REJECTED &&
            item.current_bid_price == item.my_bid
          ) {
            item.bid_text = Messages.bid.reject[LOCALE].replace(
              "_BIDVALUE_",
              item.my_bid
            );
          } else {
            if (
              item.current_bid_price == item.my_bid &&
              item.bid_status == Helper.bidStatus.ACTIVE
            ) {
              //item.bid_text = "Your bid is the highest bid";
              item.bid_text = Messages.bid.highest[LOCALE].replace(
                "_BIDVALUE_",
                item.current_bid_price
              );
            } else if (item.current_bid_price > item.my_bid) {
              //item.bid_text = "Your bid " + item.my_bid + " SAR is no longer highest bid";
              item.bid_text = Messages.bid.lower[LOCALE].replace(
                "_BIDVALUE_",
                item.my_bid
              );
            }
          }
          if (LOCALE == "ar" && item) {
            item.category_id.category_name = item.category_id.category_name_ar;
            item.brand_id.brand_name = item.brand_id.brand_name_ar;
            item.model_id.model_name = item.model_id.model_name_ar;
          }
          item = getNewConditionName(item);
        });
        //let discount = 100 - (result.sell_price * 100 / result.model_id.current_price);
        //result.discount = discount.toFixed();
        //result.current_price = result.model_id.current_price;

        var List = { productList: result };
        Helper.response(res, 200, Messages.product.list[LOCALE], List);
      }
    });
  },

  GetMySellProducts: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
          errors: errors.array(),
        });
      }

      let user_id = req.user._id;

      let result = await ProductDAL.GetUserSellProduct(user_id);
      result.map((item) => {
        //item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
        //console.log(item.model_id)
        let discount =
          100 - (item.sell_price * 100) / item.varient_id.current_price;
        item.discount = discount.toFixed();
        item.current_price = item.varient_id.current_price;
        item.bid_price = item.current_bid_price;
        item.bid_data =
          item.bidding && item.bidding.length > 0 ? item.bidding[0] : {};

        item.promocode =
          item.promocode && item.promocode.length > 0 ? item.promocode[0] : {};
        if (LOCALE == "ar" && item) {
          item.category_id.category_name = item.category_id.category_name_ar;
          item.brand_id.brand_name = item.brand_id.brand_name_ar;
          item.model_id.model_name = item.model_id.model_name_ar;
        }
        item = getNewConditionName(item);
      });
      //let discount = 100 - (result.sell_price * 100 / result.model_id.current_price);
      //result.discount = discount.toFixed();
      //result.current_price = result.model_id.current_price;

      var List_Product_Bidding = [];
      var List_Product_Not_Bidding = [];
      var List_Reject_Accept_Bidding = [];

      result.filter((product) => {
        if (
          product.bidding.length > 0 &&
          product.bid_data.bid_status == Helper.bidStatus.ACTIVE
        ) {
          List_Product_Bidding.push(product);
        } else if (product.bidding.length == 0) {
          List_Product_Not_Bidding.push(product);
        } else if (
          product.bidding.length > 0 &&
          (product.bid_data.bid_status == Helper.bidStatus.REJECTED ||
            product.bid_data.bid_status == Helper.bidStatus.ACCEPTED)
        ) {
          List_Reject_Accept_Bidding.push(product);
        }
      });

      List_Product_Bidding.length > 0 &&
        List_Product_Bidding.sort(function (a, b) {
          if (
            new Date(a.bid_data.bid_date).getTime() >
            new Date(b.bid_data.bid_date).getTime()
          ) {
            return -1;
          } else if (
            new Date(a.bid_data.bid_date).getTime() <
            new Date(b.bid_data.bid_date).getTime()
          ) {
            return 1;
          } else {
            return 0;
          }
        });

      List_Reject_Accept_Bidding.length > 0 &&
        List_Reject_Accept_Bidding.sort(function (a, b) {
          const dateA =
            a.bid_data.accept_date || a.bid_data.reject_date
              ? new Date(
                  a.bid_data.accept_date || a.bid_data.reject_date
                ).getTime()
              : new Date(a.bid_data.bid_date).getTime();
          const dateB =
            b.bid_data.accept_date || b.bid_data.reject_date
              ? new Date(
                  b.bid_data.accept_date || b.bid_data.reject_date
                ).getTime()
              : new Date(a.bid_data.bid_date).getTime();
          if (dateA > dateB) {
            return -1;
          } else if (dateA < dateB) {
            return 1;
          } else {
            return 0;
          }
        });

      List_Product_Not_Bidding.reverse();
      var products_result = [
        ...List_Product_Bidding,
        ...List_Product_Not_Bidding,
        ...List_Reject_Accept_Bidding,
      ];

      var List = { productList: products_result };
      Helper.response(res, 200, Messages.product.list[LOCALE], List);
    } catch (error) {
      console.log(error);
      Helper.response(res, 500, Messages.api.fail);
    }
    //let query = { $or: [{ buyer: user_id }, { seller: user_id }] };
    // let query = { 'user_id': user_id, status: "Active", sell_status: { "$ne": "Sold" } }
    // let col = { _id: 1, category_id: 1, brand_id: 1, model_id: 1, varient: 1, sell_price: 1, bid_price: 1, product_images: 1, defected_images: 1, body_cracks: 1, description: 1, answer_to_questions: 1, answer_to_questions_ar: 1, score: 1, grade: 1, current_bid_price: 1, createdDate: 1, bidding: { $slice: -1 } };
    // ProductModel.find(query, col)
    //     .lean()
    //     .populate('category_id', 'category_name category_name_ar')
    //     .populate('brand_id', 'brand_name brand_name_ar')
    //     .populate('model_id', 'model_name model_name_ar current_price')
    //     .exec(function (err, result) {
    //         if (err) {
    //             Helper.response(res, 500, Messages.api.error[LOCALE]);
    //         } else {
    //             //let newResult = JSON.parse(JSON.stringify(result));
    //             result.map((item) => {
    //                 //item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
    //                 //console.log(item.model_id)
    //                 let discount = 100 - (item.sell_price * 100 / item.model_id.current_price);
    //                 item.discount = discount.toFixed();
    //                 item.current_price = item.model_id.current_price;
    //                 item.bid_price = item.current_bid_price;
    //                 item.bid_data = (item.bidding && (item.bidding.length) > 0) ? item.bidding[0] : {};
    //                 if (LOCALE == "ar") {
    //                     item.category_id.category_name = item.category_id.category_name_ar;
    //                     item.brand_id.brand_name = item.brand_id.brand_name_ar;
    //                     item.model_id.model_name = item.model_id.model_name_ar;
    //                 }
    //             })
    //             //let discount = 100 - (result.sell_price * 100 / result.model_id.current_price);
    //             //result.discount = discount.toFixed();
    //             //result.current_price = result.model_id.current_price;

    //             var List = { "productList": result };
    //             Helper.response(res, 200, Messages.product.list[LOCALE], List);
    //         }
    //     })
  },
};
