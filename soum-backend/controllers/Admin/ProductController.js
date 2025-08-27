const ProductModel = require('../../models/ProductModel');
const UserModel = require('../../models/UserModel');
const mongoose = require('mongoose');
const Helper = require('../../config/helper');
const Messages = require('../../config/messages');
const { check, validationResult } = require("express-validator");
const { user_id } = require('../../config/messages');
const ProductQuestionDAL = require('../../Data/ProductQuestionDAL');
const ProductDAL = require('../../Data/ProductDAL');
const BidDAL = require('../../Data/BidDAL');
const OrderModel = require('../../models/OrderModel.js');
const VarientModel = require('../../models/VarientModel');
const SettingDAL = require("../../Data/SettingDAL");
const _ = require('lodash');
const ProductQuestionService = require('../../services/ProductQuestionService');

async function InActiveProductComment(req, res) {
  try {
    let commentId = req.params.commentId;
    await ProductQuestionDAL.InActiveQuestion(commentId);
    Helper.response(res, 200, Messages.question.delete[LOCALE]);
  } catch (error) {
    console.log(error)
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function listProductsComments(req, res) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      let aProductQuestionService = new ProductQuestionService(ProductQuestionDAL);
      const pageInfo = await aProductQuestionService.listComments(page, limit);
      var commentsList = { commentsList: pageInfo.docs, totalResult: pageInfo.totalDocs, limit: limit };
      return Helper.response(res, 200, "Comments list", { CommentsData: commentsList });
  } catch (error) {
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
    // Helper.response(res, 500, error);
  }
}

async function ChangeProductStatus(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var err = { errors: errors.array() }
      Helper.response(res, 400, "Parameter missing", err);
    }
    let { product_id, product_status } = req.body;
    console.log(req.query)
    await ProductDAL.changeProductStatus(product_id, product_status);
    Helper.response(res, 200, Messages.product.change_status[LOCALE]);
  } catch (error) {
    console.log(error)
    Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function BuyProduct(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], { errors: errors.array() });
    }

    let user_id = req.body.buyer_id;
    let checkout_data_id = req.body.checkout_data_id;
    let product_id = req.body.product_id;
    let address_id = req.body.address_id;
    let buy_amount = req.body.buy_amount;
    let shipping_charge = req.body.shipping_charge;
    let vat = req.body.vat;
    let commission = req.body.commission;
    let grand_total = req.body.grand_total;
    let order_number = Helper.generate_order_number();
    let payment_type = req.body.payment_type;
    let productStatus = await getProductStatus(product_id)

    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (productFound.user_id.toString() == user_id) return Helper.response(res, 400, Messages.checkout.self_buy[LOCALE]);

    if (productStatus != "Available") {
      return Helper.response(res, 400, Messages.product.not_available[LOCALE]);
    }
    let address = await getBuyerAddress(user_id, address_id);
    if (address == "") {
      return Helper.response(res, 400, Messages.address.not_exists[LOCALE]);
    }
    // var cardIds = await getCardIds(user_id);
    //return false;

    var where = { '_id': mongoose.Types.ObjectId(product_id) };
    ProductModel.findOne(where, async function (err, product) {
      if (product) {

        // await Helper.create_checkout(req.user, order_number, address, grand_total, 'DB', payment_type, cardIds);
        //console.log(checkoutData); return false;
        if (checkout_data_id && typeof checkout_data_id !== "undefined") {
          //console.log("das", checkoutData.id); return false;
          var prodObject = {
            buyer: user_id,
            seller: product.user_id,
            product: product_id,
            buyer_address: address,
            buy_amount: buy_amount,
            shipping_charge: shipping_charge,
            vat: vat,
            commission: commission,
            grand_total: grand_total,
            checkout_id: checkout_data_id,
            order_number: order_number,
            payment_type: payment_type
          };
          //console.log(prodObject); return false;
          let Order = new OrderModel(prodObject);
          Order.save(async (error, result) => {
            if (error) {
              //console.log(error);return false; 
              return Helper.response(res, 500, Messages.api.error[LOCALE]);
            } else {
              await ProductDAL.changeProductStatus(product_id, "Locked");
              var returnArr = { "order_id": result._id, "checkout_id": checkout_data_id };
              return Helper.response(res, 200, Messages.checkout.success[LOCALE], returnArr);
            }
          });
        } else {
          return Helper.response(res, 400, Messages.checkout.fail[LOCALE]);
        }
      }
    });

  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }

}

async function RemoveBid(req, res) {
  try {
    var product_id = req.params.product_id;
    var bid_id = req.params.bid_id;

    let productFound = await ProductDAL.GetFullProductById(product_id);

    if (!productFound) return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

    const userBid = productFound.bidding.filter(bid => bid.bid_id.toString() == bid_id.toString());
    console.log(userBid.length)
    if (userBid.length == 0) return Helper.response(res, 400, Messages.bid.not_exists[LOCALE]);

    productFound.bidding = productFound.bidding.filter(bid => bid.bid_id.toString() != bid_id.toString());

    if (productFound.bidding.length > 0) {
      // this for loop can be done better
      let lastBidIndex = 0;
      for (let index = 0; index < productFound.bidding.length; index++) {
        if (productFound.bidding[lastBidIndex].bid_price < productFound.bidding[index].bid_price)
          lastBidIndex = index;
      }
      productFound.current_bid_price = productFound.bidding[lastBidIndex].bid_price;
      //productFound.bidding[lastBidIndex].bid_status = helper.bidStatus.ACTIVE;
      productFound.bidding[lastBidIndex].payment_take = "full";
    } else {
      productFound.current_bid_price = productFound.bid_price;
    }
    await ProductDAL.UpdateProduct(productFound);
    await BidDAL.UpdateBidStatus(bid_id,Helper.bidStatus.DELETED);
    await BidDAL.SetBidDeletedBy(bid_id,req.user._id,"Admin");

    return Helper.response(res, 200, Messages.bid.remove[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function updateBidCollection(req, res) {
	try {
		let page = 1;
		let limit = 10;
		let mobileNumber = null;
		let productFound = await ProductDAL.ListProductsForAdmin(page,limit,mobileNumber,[]);
    var allResults = productFound.allResults;
		let arrayOfBids = [];
		for(let i = 0; i< allResults.length;i++){
			arrayOfBids = arrayOfBids.concat(allResults[i].bidding);
		}
    await BidDAL.UpdateBulkBidStatus(arrayOfBids);
    return Helper.response(res, 200, 'DONE');
    
	} catch (error) {
		console.log(error);
		return Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}

async function UpdateBidsCollectionWithOpenStatus(req, res) {
	try {
    let arrayOfBids = await BidDAL.GetAllOpenBids();
    await BidDAL.UpdateBulkBidsWithOpenStatus(arrayOfBids);
    return Helper.response(res, 200, 'DONE');
	} catch (error) {
		console.log(error);
		return Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}

async function expireProduct(req, res) {
	try {
		let productId = req.params.productId;

		let productFound = await ProductDAL.GetFullProductById(productId)
		if (!productFound) return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

      let yesterday = new Date().getDate() - 1
      let yesterdayDate  =  new Date().setDate(yesterday);
      let yesterdayDateNight = new Date(yesterdayDate).setHours(23,30);

      productFound.expiryDate = new Date(yesterdayDateNight);
      console.log(productFound.expiryDate);
      await ProductDAL.UpdateProduct(productFound);

      await Helper.algolia_remove_product(productId);
      
      return Helper.response(res, 200, 'DONE');
    
	} catch (error) {
		console.log(error);
		return Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}

module.exports = {
  InActiveProductComment,

  listProductsComments,

  ChangeProductStatus,

  BuyProduct,

  RemoveBid,

  ProductRenewfromAdmin,

  ProductRenewAllfromAdmin,

  updateBidCollection,

  UpdateBidsCollectionWithOpenStatus,

  expireProduct,

  productList: async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const mobileNumber = req.query.mobileNumber;
      let productTypes;

      if(req.query.productTypes && req.query.productTypes.length > 0 && req.query.productTypes[0] != '' ){
        productTypes = req.query.productTypes;
      }else{
        productTypes = [];
      }
      const result = await ProductDAL.ListProductsForAdminNew(page, limit, mobileNumber,productTypes);
      Helper.response(res, 200, "Product list fetched successfully", result);
    } catch (err) {
      console.log(err)
      Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  // please dont use this funtion in any place this is to test only
  makeUpdatesInDatabase: async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 20;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const mobileNumber = req.query.mobileNumber;
      let productTypes;

      if(req.query.productTypes && req.query.productTypes.length > 0 && req.query.productTypes[0] != '' ){
        productTypes = req.query.productTypes;
        
      }else{
        productTypes = [];
      }
      
      if(isNaN(req.query.mobileNumber)) 
        return Helper.response(res, 200, "Product list fetched successfully", { productList: [], totalResult: 0, limit: limit});
      let result = await ProductDAL.ListProductsForAdmin(page, limit, mobileNumber,productTypes);
      var productList = result.docs;
      var totalResult = result.total;
      var allResults = result.allResults;
      if (productList.length > 0) {
        productList.map(async function (item) {
          item.bid_count = typeof item.bidding !== "undefined"  ? item.bidding.length : 0;

          // added by naeeim to add varient_id id to all products   ====> updates all variants in database => 5/10/2021
          const varients = await VarientModel.find({'model_id': mongoose.Types.ObjectId(item.modelData._id)});
          varients.map(async function(variantData) {
            if(item.varient == variantData.varient) {
              await ProductModel.updateMany({"model_id": mongoose.Types.ObjectId(item.modelData._id), 'varient': item.varient}, {$set: {'varient_id': variantData._id}})
            }
          })
        })
      }
      let currentDate = new Date().toISOString();
      let TotalCounter =  allResults.length;
      let AvailableCounter = 0;
      let SoldCounter = 0;
      let LockedCounter = 0;
      let AvailableAndExpiredCounter = 0;
      let AvailableAndNotExpiredCounter = 0;

      //count status
      
      for(let i = 0; i<allResults.length; i++){
        if(allResults[i].sell_status == 'Sold'){
          SoldCounter++;
        }
        else if (allResults[i].sell_status == 'Available'){
          AvailableCounter++;
        }
        else if (allResults[i].sell_status == 'Locked'){
          LockedCounter++;
        }
        if(allResults[i].expiryDate < new Date(currentDate) && allResults[i].sell_status == 'Available'){
          AvailableAndExpiredCounter++;
        }
        if(allResults[i].expiryDate >= new Date(currentDate) && allResults[i].sell_status == 'Available'){
          AvailableAndNotExpiredCounter++;
        }
      }

      var ret = {
        productList: productList,
        totalResult: totalResult,
        TotalCounter: TotalCounter,
        AvailableCounter: AvailableCounter,
        SoldCounter: SoldCounter,
        LockedCounter: LockedCounter,
        AvailableAndExpiredCounter: AvailableAndExpiredCounter,
        AvailableAndNotExpiredCounter: AvailableAndNotExpiredCounter,
        limit: limit
      }
      Helper.response(res, 200, "Product list fetched successfully", ret);
    } catch (err) {
      console.log(err)
      Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  ProductDetail: (req, res) => {
    try {
      var productId = req.params.productId;
      ProductModel.findOne({ _id: mongoose.Types.ObjectId(productId) })
        .populate("user_id", { "_id": 1, "user_id": "$_id", "name": 1, "mobileNumber": 1 })
        .populate("category_id", { "_id": 1, "category_id": "$_id", "category_name": 1, "category_icon": 1 })
        .populate("brand_id", { "_id": 1, "brand_id": "$_id", "brand_name": 1, "brand_icon": 1 })
        .populate("model_id", { "_id": 1, "model_id": "$_id", "model_name": 1, "model_icon": 1 })
        .then(async (result) => {
          var productData = JSON.parse(JSON.stringify(result));
          if (productData) {
            productData.categoryData = productData.category_id;
            productData.sellerData = productData.user_id;
            productData.modelData = productData.model_id;
            productData.brandData = productData.brand_id;
            delete productData.category_id;
            delete productData.user_id;
            delete productData.model_id;
            delete productData.brand_id;
            if (productData.bidding.length > 0) {
              await Promise.all(productData.bidding.map(async function (item) {
                //console.log(item.user_id);
                var userData = await getUserDetail(item.user_id);
                //console.log(userData);
                item.name = userData.name;
                item.mobileNumber = userData.mobileNumber;
              }))
            }
            productData.product_questions = await ProductQuestionDAL.QetProductQuestions(productId);
            var ret = { productData: productData }
            Helper.response(res, 200, "Product data fetched successfully", ret);
          } else {
            Helper.response(res, 400, "Product data fetched successfully");
          }
        })
    } catch (err) {
      console.log(err)
      Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  ProductBidDetail: (req, res) => {
    try {
      var productId = req.params.productId;
      ProductModel.findOne({ _id: mongoose.Types.ObjectId(productId) }, { "bidding": 1 })
        //.populate("user_id", { "_id": 1, "user_id": "$_id", "name": 1, "mobileNumber" : 1 })
        //.populate("category_id", { "_id": 1, "category_id": "$_id", "category_name": 1, "category_icon": 1 })
        //.populate("brand_id", { "_id": 1, "brand_id": "$_id", "brand_name": 1, "brand_icon": 1 })
        //.populate("model_id", { "_id": 1, "model_id": "$_id", "model_name": 1, "model_icon": 1 })
        .then(async (result) => {
          var productData = JSON.parse(JSON.stringify(result));
          if (productData) {
            await Promise.all(productData.bidding.map(async function (item) {
              //console.log(item.user_id);
              var userData = await getUserDetail(item.user_id);
              //console.log(userData);
              item.name = userData.name;
              item.mobileNumber = userData.mobileNumber;
            })
            )

            var ret = { productBidData: productData }

            Helper.response(res, 200, "Product Bid data fetched successfully", ret);
          } else {
            Helper.response(res, 400, "Product Bid data fetched successfully");
          }
        })
    } catch (err) {
      console.log(err)
      Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  approveProduct: (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      var err = { errors: errors.array() }
      Helper.response(res, 400, "Parameter missing", err);
    }
    const status = req.body.isApproved && req.body.isApproved.toString() === 'true' ? true : false;

    const productId = ProductModel.findOne({ _id: req.params.productId })
    productId.exec(async (err, product) => {
      if (err || !productId) {
        Helper.response(res, 400, "Product not found");
      }
      product.isApproved = status;
      
      if (product.isApproved) {
        product.auto_approve_at = new Date();
        product.status = 'Active';
        product.approve_source = 'admin';
      } 

      //Re-calculate rates
      if (product.user_id) {
        await UserModel.findByIdAndUpdate(product.user_id, {
          $set: { rates_scan: false },
        });
      }
      product.save()
        .then(productData => {
          Helper.response(res, 200, "Product status changed successfully");
        })
        .catch(err => {
          console.log(err)
          return Helper.response(res, 500, "Internal server error.");
        })
    })
  },

  deleteProduct: (req, res) => {
    const productId = ProductModel.findOne({ _id: req.params.productId })
    productId.exec(async (err, product) => {
      if (err || !productId) {
        Helper.response(res, 400, "Product not found");
      }
      product.status = "Delete";      
			product.deletedDate = new Date();
      product.updatedDate = new Date();
      product.deletedBy = 'Admin';

      //Re-calculate rates
      if (product.user_id) {
        await UserModel.findByIdAndUpdate(product.user_id, {
          $set: { rates_scan: false },
        });
      }
      product.save()
        .then(async productData => {
          await Helper.algolia_remove_product(productId);
          Helper.response(res, 200, "Product removed successfully");
        })
        .catch(err => {
          console.log(err)
          return Helper.response(res, 500, "Internal server error.");
        })
    })

    Helper.algolia_remove_product(productId);
    
  }
}

async function AllProductByUserId(user_id) {
  try {
    return await ProductDAL.FilterProductByUserId(user_id);
  } catch (error) {
    return [];
  }
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

async function getProductStatus(product_id, callback) {
  return new Promise((resolve, reject) => {
    ProductModel.findOne({ _id: mongoose.Types.ObjectId(product_id) }, function (err, product) {
      if (product) {
        //console.log(product);
        resolve(product.sell_status);
      } else {
        resolve('');
      }
    })
  }).catch(err => {
    console.log("in catch block", err);
  });
}

async function getBuyerAddress(user_id, address_id, callback) {
  return new Promise((resolve, reject) => {
    //let col = { '_id': 0, address: { $elemMatch: { address_id: mongoose.Types.ObjectId(address_id) } } };
    let col = { '_id': 0, address: 1 };
    //var where = { _id: mongoose.Types.ObjectId(user_id), "address.address_id": mongoose.Types.ObjectId(address_id) };
    var where = { _id: mongoose.Types.ObjectId(user_id) };
    if (address_id) {
      var where = { _id: mongoose.Types.ObjectId(user_id), "address.address_id": mongoose.Types.ObjectId(address_id) };
    }
    UserModel.findOne(where, col, function (err, address) {
      if (address) {
        //console.log(address.addresses[0]);
        resolve(address.address);
        //resolve(favExist.length);
      } else {
        resolve('');
      }
    })
  }).catch(err => {
    console.log("in catch block", err);
  });
}

async function ProductRenewfromAdmin(req, res) {
	try {
		let product_id = req.params.product_id;
		let days = req.params.days;

		let productFound = await ProductDAL.GetFullProductById(product_id)
		if (!productFound) return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

    //Re-calculate rates
    if (productFound.user_id) {
      await UserModel.findByIdAndUpdate(productFound.user_id, {
        $set: { rates_scan: false },
      });
    }

    if(new Date(productFound.expiryDate) > new Date()){
      return Helper.response(res, 403, Messages.product.renewERR[LOCALE]);
    }else{
      var date = new Date();
      date.setDate(Number(new Date().getDate()) + Number(days));
      productFound.expiryDate = date;
      if(productFound.actionDates){
			productFound.actionDates.push({'createdDate':new Date(),'expiryDate':date});
		}else{
			productFound.actionDates = [{'createdDate':new Date(),'expiryDate':date}];
		}
      const settings = await SettingDAL.GetSetting();
      if (settings) {
        productFound.billingSettings = {
          ...productFound.billingSettings,
          buyer_commission_percentage: settings.buyer_commission_percentage,
          shipping_charge_percentage: settings.shipping_charge_percentage,
          vat_percentage: settings.vat_percentage,
          referral_discount_type: settings.referral_discount_type,
          referral_percentage: settings.referral_percentage,
          referral_fixed_amount: settings.referral_fixed_amount,
          delivery_threshold: settings.delivery_threshold,
          apply_delivery_fee: settings.apply_delivery_fee,
          delivery_fee: settings.delivery_fee,
        };
      }
      productFound.updatedDate = new Date();
      await ProductDAL.UpdateProduct(productFound);
      await Helper.sync_search([product_id]);
      return Helper.response(res, 200, Messages.product.renew[LOCALE]);
    }  
	} catch (error) {
		console.log(error)
		return Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}

async function ProductRenewAllfromAdmin(req, res) {

	try {

		const page = parseInt(req.params.page);
		const limit = parseInt(req.params.limit);
    const mobileNumber = req.query.mobileNumber;
    const days = req.params.days;

    let result = await ProductDAL.ListProductsForAdmin(page, limit, mobileNumber,[]);
    var productList = result.allResults;
    let arrOfProductsToBeRenewed = [];
    for(let i = 0;i< productList.length;i++){
      if(new Date(productList[i].expiryDate) < new Date() && productList[i].sell_status == 'Available'){
        //push this in new array
        arrOfProductsToBeRenewed.push(productList[i]);
      }
    }

    if(arrOfProductsToBeRenewed.length == 0){
      return Helper.response(res, 403, Messages.product.renewAllEmpty[LOCALE]);
    }

		let output = await ProductDAL.UpdateExpiredProducts(arrOfProductsToBeRenewed,days);

		if(output){
      await Helper.sync_search(arrOfProductsToBeRenewed);
      return Helper.response(res, 200, Messages.product.renewAll[LOCALE]);
    }else{
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
    
	} catch (error) {
		console.log(error);
		return Helper.response(res, 500, Messages.api.fail[LOCALE]);
	}
}
