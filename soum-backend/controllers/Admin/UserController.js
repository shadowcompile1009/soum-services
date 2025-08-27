const UserModel = require('../../models/UserModel');
const ProductModel = require('../../models/ProductModel');
const Helper = require('../../config/helper');
const { check, validationResult } = require("express-validator");
const mongoose = require('mongoose');
const ibantools = require('ibantools');
const Messages = require('../../config/messages.js');

module.exports = {
  users: (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 20;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const isGetBetaUser = req.query.isGetBetaUser && req.query.isGetBetaUser.toString() === 'true' ? true : false;
    const isGetKeySeller = req.query.isGetKeySeller && req.query.isGetKeySeller.toString() === 'true' ? true : false;
    let mobileNumber = req.query.mobileNumber;
    let query = {};

    if (isGetBetaUser) {
      query = {
        $and: [
          { isBetaUser: true },
        ]
      }
    }

    if (isGetKeySeller) {
      query = {
        $and: [
          { isKeySeller: true },
        ]
      }
    }

    if (mobileNumber) {
      const orArray = [];
      mobileNumber = mobileNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      orArray.push({ name: { $regex: new RegExp(`.*${mobileNumber}.*`, 'i')}});

      const splitNumberArray = mobileNumber.split(/[ -]+/g);
      const phoneNumber = splitNumberArray.slice(-1)[0];
      // Try to search phone number when at least 5 chars in length
      // When searching model 'iphone 12' 12 is not used to search for phone number
      if (phoneNumber && phoneNumber.length >= 5) {
          orArray.push({ 'mobileNumber': { $regex: new RegExp(`.*${phoneNumber}.*`, 'gi') }});
      }

      if (mongoose.isValidObjectId(mobileNumber)) {
        orArray.push({ _id: mongoose.Types.ObjectId(mobileNumber) });
      }

      query.$or = orArray;
    }

    const col = {
      _id: 1,
      user_id: '$_id',
      name: 1,
      countryCode: 1,
      mobileNumber: 1,
      status: 1,
      cards: 1,
      addresses: 1,
      profilePic: 1,
      secretKey: 1,
      lastLoginDate: 1,
      updatedDate: 1,
      isBetaUser: 1,
      isKeySeller: 1,
    };

    UserModel.paginate(query, { page: page, limit: limit, select: col })
      .then((result) => {
        var userList = result.docs;
        var totalResult = result.total;
        
        if (userList.length > 0) {
          var resu = { userList: userList, totalResult: totalResult, limit: limit };
          Helper.response(res, 200, "User list fetched successfully", resu);
        } else {
          Helper.response(res, 200, "User list fetched successfully", { userList: [] });
        }
      }).catch(err => {
        Helper.response(res, 500, Messages.api.fail[LOCALE]);
      });
  },

  userStatus: (req, res) => {
    const userId = req.params.userId;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var err = { errors: errors.array() }
      Helper.response(res, 400, "Parameter missing", err);
    }
    const status = req.body.status;
    UserModel.findById(userId, { _id: 1, userId: "$_id", status: 1 }, function (err, data) {
      if (err) {
        return Helper.response(res, 500, "Internal server error.");
      } else if (!data) {
        Helper.response(res, 400, "User not found");
      } else {
        data.status = status;
        data.save()
          .then(doc => {
            Helper.response(res, 200, "Status updated successfully");
          })
          .catch(err => {
            return Helper.response(res, 500, "Internal server error.");
          })
      }
    });
  },

  deleteUser: (req, res) => {
    const userId = UserModel.findOne({ _id: req.params.userId })

    userId.exec((err, user) => {
      if (err || !user) {
        Helper.response(res, 400, "User not found");
      }
      user.status = "Delete";
      user.deleted_date = new Date();
      user.updatedDate = new Date();
      user.save()
        .then(userData => {
          Helper.response(res, 200, "User removed successfully");
        })
        .catch(err => {
          return Helper.response(res, 500, "Internal server error.");
        })

    })

  },

  editUser: (req, res) => {
    const name = req.body && req.body.name;
    const isBetaUser = req.body.isBetaUser && req.body.isBetaUser.toString() === 'true' ? true : false;
    const isKeySeller = req.body.isKeySeller && req.body.isKeySeller.toString() === 'true' ? true : false;
    const userId = UserModel.findOne({ _id: req.params.userId })
    userId.exec((err, user) => {
      if (err || !user) {
        Helper.response(res, 400, "User not found");
      }
      user.name = name;
      user.isBetaUser = isBetaUser;
      user.isKeySeller = isKeySeller;
      user.save()
        .then(result => {
          Helper.response(res, 200, "Profile updated successfully");
        })
        .catch(err => {
          return Helper.response(res, 500, "Server error.");
        })
    })

  },

  "GetUserDetail": (req, res) => {
    try {
      var user_id = req.params.userId;
      const userData = UserModel.findOne({ _id: req.params.userId }, { _id: 1, user_id: "$_id", name: 1, countryCode: 1, mobileNumber: 1, status: 1, address: 1, bankDetail: 1, secretKey: 1, lastLoginDate: 1 })
      //console.log(_id)
      userData.exec(async (err, user) => {
        if (err) {
          return Helper.response(res, 500, "Internal server error.");
        } else if (!user) {
          Helper.response(res, 400, "User not found");
        } else {
          let newResult = JSON.parse(JSON.stringify(user));
          newResult.sellProductList = await getUserSellProducts(user_id);
          newResult.bidProductList = await getUserBidProducts(user_id);
          if (newResult.bankDetail && !ibantools.isValidIBAN(newResult.bankDetail.accountId)) {
            newResult.bankDetail.accountId = newResult.bankDetail.hasOwnProperty("accountId") ?
              Helper.decrypt(newResult.bankDetail.accountId, newResult.secretKey) : '' ;
            newResult.bankDetail.bankBIC = newResult.bankDetail.hasOwnProperty("bankBIC") ?
              Helper.decrypt(newResult.bankDetail.bankBIC, newResult.secretKey) : '';
          }
          var data = { "userData": newResult };
          Helper.response(res, 200, "User detail get successfully", data);
        }
      })
    } catch (err) {
      return Helper.response(res, 500, "Server error.");
    }
  },

}

async function getUserDetail(user_id, callback) {
  return new Promise((resolve, reject) => {
    var where = { '_id': mongoose.Types.ObjectId(user_id) };
    UserModel.findOne(where, { name: 1, mobileNumber: 1 })
      .lean()
      .exec(function (err, userData) {
        if (userData) {
          resolve(userData);
        } else {
          resolve('');
        }
      })
  }).catch(err => {
    console.log("in catch block", err);
  });
}

async function getUserSellProducts(user_id, callback) {
  return new Promise((resolve, reject) => {
    let returnedData = [];
    let query = { 'user_id': user_id }
    let col = { _id: 1, category_id: 1, brand_id: 1, model_id: 1, varient_id: 1, varient: 1, sell_price: 1, bid_price: 1, product_images: 1, defected_images: 1, body_cracks: 1, description: 1, answer_to_questions: 1, current_bid_price: 1, bidding: 1, createdDate: 1 ,user_id:1};
    ProductModel.find(query, col)
      .lean()
      .populate('category_id', 'category_name')
      .populate('brand_id', 'brand_name')
      .populate('model_id', 'model_name current_price')
      .populate('varient_id', 'varient current_price')
      .exec(function (err, result) {
        if (err) {
          Helper.response(res, 500, Messages.api.fail[LOCALE]);
        } else {
          //console.log(result)
          let newResult = JSON.parse(JSON.stringify(result));
          if (newResult.length > 0) {
            newResult.map(async (item) => {
              let discount = 100 - (item.sell_price * 100 / item.varient_id.current_price);
              item.discount = discount.toFixed();
              item.current_price = item.varient_id.current_price;
              //item.current_bid_price = item.current_bid_price;
              if (item.bidding.length > 0) {
                await Promise.all(item.bidding.map(async function (bid) {
                  //console.log(item.user_id);
                  var userData = await getUserDetail(bid.user_id);
                  //console.log(userData);
                  bid.name = userData.name;
                  bid.mobileNumber = userData.mobileNumber;
                }))
              }
            })
            //console.log(newResult)
            resolve(newResult)
          } else {
            resolve(returnedData)
          }
        }
      })

  }).catch(err => {
    console.log("in catch block", err);
  });
}

async function getUserBidProducts(user_id, callback) {
  return new Promise((resolve, reject) => {
    let returnedData = [];
    var aggr = [
      {
        $match: { 'bidding.user_id': mongoose.Types.ObjectId(user_id) }
      },
      {
        $addFields: {
          "bidding": {
            $filter: {
              input: "$bidding",
              as: "bidding",
              cond: { $eq: ["$$bidding.user_id", mongoose.Types.ObjectId(user_id)] }
            }
          }
        }
      },
      { $lookup: { from: "categories", localField: "category_id", foreignField: "_id", as: "category_id" } },
      { $unwind: "$category_id" },
      { $lookup: { from: "brands", localField: "brand_id", foreignField: "_id", as: "brand_id" } },
      { $unwind: "$brand_id" },
      { $lookup: { from: "device_models", localField: "model_id", foreignField: "_id", as: "model_id" } },
      { $unwind: "$model_id" },
      { $lookup: { from: "varients", localField: "varient_id", foreignField: "_id", as: "varient_id" } },
      { $unwind: "$varient_id" },
      { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "seller" } },
      { $unwind: "$seller" },
      {
        $project:
        {
          _id: 1,
          product_id: "$_id",
          user_id: 1,
          bidding: 1,
          varient: 1, sell_price: 1, bid_price: 1, product_images: 1, defected_images: 1, varient_id: 1,
          body_cracks: 1, description: 1, answer_to_questions: 1, current_bid_price: 1, createdDate: 1,
          my_bid: { $arrayElemAt: ["$bidding.bid_price", -1] },
          "category_id.category_name": 1,
          "brand_id.brand_name": 1,
          "model_id.model_name": 1,
          "model_id.current_price": 1,
          "seller_id": "$seller._id",
          "seller_name": "$seller.name",
          "varient_id.varient":1,
          "varient_id.current_price":1

        }
      }
    ];
    ProductModel.aggregate(aggr)
      .exec(function (err, productList) {
        if (err) {
          reject(err);
          // Helper.response(res, 500, Messages.api.fail[LOCALE]);
        } else {
          if (productList.length > 0) {
            let result = JSON.parse(JSON.stringify(productList));
            //console.log(newResult.model_id.current_price)
            result.map((item) => {
              //console.log(item.bidding);
              //item.brand_icon = process.env.HOST+"/brand/"+item.brand_icon;
              let discount = 100 - (item.sell_price * 100 / item.varient_id.current_price);
              item.discount = discount.toFixed();
              item.current_price = item.varient_id.current_price;
              //item.bid_price = item.current_bid_price;
              if (item.current_bid_price == item.my_bid) {
                item.bid_text = "Your bid is the highest bid";
              } else if (item.current_bid_price > item.my_bid) {
                item.bid_text = "Your bid " + item.my_bid + " SAR is no longer highest bid";
              }
            })
            //let discount = 100 - (result.sell_price * 100 / result.model_id.current_price);
            //result.discount = discount.toFixed();
            //result.current_price = result.model_id.current_price;
            resolve(result);
          } else {
            resolve(returnedData);
          }
        }
      })

  }).catch(err => {
    console.log("in catch block", err);
  });
}


