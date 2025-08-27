const mongoose = require("mongoose");
const { check, validationResult } = require("express-validator");
const ProductModel = require("../../../models/ProductModel.js");
const ProductQuestionModel = require("../../../models/ProductQuestionModel.js");
const UserModel = require("../../../models/UserModel");
const OrderModel = require("../../../models/OrderModel.js");
const Payment = require("../../../models/PaymentModel");
const Helper = require("../../../config/helper.js");
const Messages = require("../../../config/messages.js");
const _ = require("lodash");

const ProductDAL = require("../../../Data/ProductDAL");
// const ProductHistoryDAL = require('../../../Data/log/ProductHistoryDAL');
const UserDAL = require("../../../Data/UserDAL");
const ProductQuestionDAL = require("../../../Data/ProductQuestionDAL");
const UserActionDAL = require("../../../Data/UserActionDAL");
const DeviceModelDAL = require("../../../Data/DeviceModelDAL");
const SettingDAL = require("../../../Data/SettingDAL");
const errorLogDAL = require("../../../Data/log/ErrorLogDAL");

const orderDAL = require("../../../Data/OrderDAL");

const BidDAL = require("../../../Data/BidDAL");
const BidService = require("../../../services/BidService");
const ConditionDAL = require("../../../Data/ConditionDAL");
const ConditionsService = require("../../../services/ConditionsService");

const activityDAL = require("../../../Data/ActivityDAL");
const ActivityService = require("../../../services/ActivityService");
const activityService = new ActivityService(activityDAL);

const subscriptionDAL = require("../../../Data/SubscriptionDAL");
const SubscriptionService = require("../../../services/SubscriptionService");
const { product } = require("../../../config/messages.js");
const helper = require("../../../config/helper.js");
const { sendEventData } = require("../../../utils/webEngageEvent.js");
const { ACTIVE, IDLE } = require("../../../enums/ProductStatus.js");
const subscriptionService = new SubscriptionService(subscriptionDAL);
const PaymentModuleName = require("../../../enums/PO-module-name.js");
const dmOrderStatus = require("../../../enums/dmOrderStatus");

const SellerUserType = require("../../../enums/sellerType.enum.js");
const { isUUIDv4 } = require("../../../utils/common.js");
const { v4: uuidv4 } = require("uuid");

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

async function AllProductList(req, res) {
  const { category_id } = req.params;
  const { like } = req.query;
  let { brand, model, size, price, grade, sort } = req.body;
  try {
    sort = !sort || "low" ? 1 : -1;
    const setting = await SettingDAL.GetSetting();
    const sortProp = setting["model_order_type"]
      ? setting["model_order_type"].split(",")
      : [];
    let productList = await ProductDAL.FilterProductByCategory(
      category_id,
      like,
      brand,
      model,
      size,
      price,
      grade,
      sort,
      sortProp
    );

    for (let i = 0; i < productList.length; i++) {
      delete productList[i]._id;
      let discount =
        100 - (productList[i].sell_price * 100) / productList[i].current_price;
      productList[i].discount = discount.toFixed();
      if (LOCALE == "ar") {
        productList[i].brand_name = productList[i].brand_name_ar;
        productList[i].model_name = productList[i].model_name_ar;
      }
      productList[i] = getNewConditionName(productList[i]);
    }
    var result = { productList: productList };
    return Helper.response(res, 200, Messages.product.list[LOCALE], result);
  } catch (error) {
    console.log(error);
    await errorLogDAL.Log(error, "User-Product", "AllProductList", 500, {
      category_id,
      like,
      brand,
      model,
      size,
      price,
      grade,
      sort,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AddProduct(req, res) {
  try {
    var product_image_arr =
      req.files["product_images"] && req.files["product_images"].length > 0
        ? (product_image_arr = await uploadPictureFileName(
            req.files["product_images"]
          ))
        : [];
    var defected_images_arr =
      req.files["defected_images"] && req.files["defected_images"].length > 0
        ? (defected_images_arr = await uploadPictureFileName(
            req.files["defected_images"]
          ))
        : [];

    let user_id = req.user._id;
    if (req.body.product_images_url) {
      product_image_arr = product_image_arr.concat(
        req.body.product_images_url || []
      );
    }

    let lastproduct = await ProductDAL.GetLastProduct(user_id);
    if (
      lastproduct.length > 0 &&
      new Date().getTime() - lastproduct[0].createdDate.getTime() < 10 * 1000
    )
      return Helper.response(
        res,
        400,
        Messages.product.invalide_listing_interval[LOCALE]
      );
    let {
      category_id,
      brand_id,
      model_id,
      pick_up_address,
      varient,
      varient_ar,
      body_cracks,
      sell_price,
      bid_price,
      description,
      answer_to_questions,
      answer_to_questions_ar,
      score,
      expiryAfterInDays,
      isListedBefore,
      sellerPromocodeId,
      sellerDiscount = 0,
      varient_id,
      start_bid,
      isBiddingProduct,
      trade_in,
      condition_id,
    } = req.body;
    if (sell_price <= 0)
      return Helper.response(
        res,
        400,
        Messages.product.zero_sell_price[LOCALE]
      );
    if (model_id == "" || model_id == null) {
      return Helper.response(
        res,
        400,
        Messages.model.missingParameters[LOCALE]
      );
    }

    if ((condition_id || "") !== "" && !isUUIDv4(condition_id || "")) {
      return Helper.response(
        res,
        400,
        Messages.bank.invalidConditionId[LOCALE]
      );
    }
    const deviceModel = await DeviceModelDAL.GetById(model_id);
    const settings = await SettingDAL.GetSetting();
    let commission =
      (sell_price * settings.seller_commission_percentage) / 100 -
      sellerDiscount;
    let vat = (commission * settings.vat_percentage) / 100;
    let total = Number(sell_price) + commission + vat;
    if (total >= deviceModel.current_price)
      return Helper.response(
        res,
        400,
        Messages.product.above_sell_price[LOCALE]
      );
    if (!answer_to_questions) answer_to_questions = "";
    if (!answer_to_questions_ar) answer_to_questions_ar = "";
    let { address, addresses } = await UserDAL.FilterUser(user_id, {
      _id: 0,
      address: 1,
      addresses: 1,
    });
    if (trade_in === undefined && (addresses || []).length == 0 && !address)
      return Helper.response(
        res,
        400,
        Messages.address.pick_up_not_exists[LOCALE]
      );

    var grade = "",
      grade_ar = "";
    if (score >= 98 && score <= 100) {
      grade = "Like New";
      grade_ar = "كأنه جديد";
    } else if (score >= 90 && score < 98) {
      grade = "Lightly used";
      grade_ar = "إستخدام خفيف";
    } else if (score >= 75 && score < 90) {
      grade = "Fair";
      grade_ar = "حاله جيده";
    } else if (score < 75) {
      grade = "Extensive use";
      grade_ar = "مستخدم بشده";

      return Helper.response(
        res,
        400,
        Messages.product.list_extensively[LOCALE]
      );
    }
    let status = "Active";
    let auto_approve_at = new Date();
    let isApproved = true;

    if (settings.delay_listing_time && settings.delay_listing_time > 0) {
      status = "On hold";
      auto_approve_at = new Date(
        auto_approve_at.getTime() + settings.delay_listing_time * 60 * 1000
      );
      isApproved = false;
    }
    const productId = mongoose.Types.ObjectId();
    var prodObject = {
      _id: productId,
      user_id,
      category_id,
      brand_id,
      model_id,
      product_images: product_image_arr,
      defected_images: defected_images_arr,
      status,
      auto_approve_at,
      isApproved,
      varient,
      varient_ar,
      body_cracks,
      sell_price,
      bid_price,
      current_bid_price: bid_price,
      description,
      pick_up_address,
      answer_to_questions,
      answer_to_questions_ar,
      grade,
      grade_ar,
      score: score ? parseInt(score) : 0,
      code: generateCode(7),
      isListedBefore,
      createdDate: new Date(),
      expiryDate: new Date().addDays(parseInt(expiryAfterInDays)),
      varient_id,
      actionDates: [
        {
          createdDate: new Date(),
          expiryDate: new Date().addDays(parseInt(expiryAfterInDays)),
        },
      ],
      billingSettings: {
        buyer_commission_percentage: settings.buyer_commission_percentage,
        seller_commission_percentage: settings.seller_commission_percentage,
        shipping_charge_percentage: settings.shipping_charge_percentage,
        vat_percentage: settings.vat_percentage,
        referral_discount_type: settings.referral_discount_type,
        referral_percentage: settings.referral_percentage,
        referral_fixed_amount: settings.referral_fixed_amount,
        apply_delivery_fee: settings.apply_delivery_fee,
        delivery_threshold: settings.delivery_threshold,
        delivery_fee: settings.delivery_fee,
      },
      recommended_price: 0,
      isBiddingProduct,
      trade_in: trade_in || false,
      condition_id: condition_id || "",
    };
    const user = await UserDAL.GetFullUser(user_id);

    let conditionsService = new ConditionsService(ConditionDAL);
    const condition = await conditionsService.GetConditionById(
      req.body.varient_id
    );
    const priceNudgeSetting = await Helper.get_price_nudge_settings(
      req.body.varient_id
    );

    if (condition && condition.length !== 0) {
      if (grade == "Like New") {
        prodObject.recommended_price = priceNudgeSetting
          ? condition[0].priceRange.like_new_min_excellent_price_nudge ||
            condition[0].priceRange.like_new_min_excellent
          : condition[0].priceRange.like_new_min_excellent;
      } else if (grade == "Lightly used") {
        prodObject.recommended_price = priceNudgeSetting
          ? condition[0].priceRange.lightly_used_min_excellent_price_nudge ||
            condition[0].priceRange.lightly_used_min_excellent
          : condition[0].priceRange.lightly_used_min_excellent;
      } else if (grade == "Fair") {
        prodObject.recommended_price = priceNudgeSetting
          ? condition[0].priceRange.good_condition_min_excellent_price_nudge ||
            condition[0].priceRange.good_condition_min_excellent
          : condition[0].priceRange.good_condition_min_excellent;
      } else if (grade == "Extensive use") {
        prodObject.recommended_price = priceNudgeSetting
          ? condition[0].priceRange
              .extensively_used_min_excellent_price_nudge ||
            condition[0].priceRange.extensively_used_min_excellent
          : condition[0].priceRange.extensively_used_min_excellent;
      }
    } else {
      prodObject.recommended_price = null;
    }

    prodObject.isBiddingProduct = isBiddingProduct;
    const bidSettings = await Helper.get_bid_settings();
    if (bidSettings && start_bid && isBiddingProduct) {
      prodObject.billingSettings.activate_bidding = bidSettings.value;
      prodObject.billingSettings.available_payment_bidding =
        bidSettings.availablePayment;
      prodObject.billingSettings.config_bid_settings = bidSettings.config;
      prodObject.billingSettings.start_bid = Number(req.body.start_bid);
    }

    const userType = await getSellerType(user);
    const priceRange = await getPriceRange({
      conditions: condition[0],
      grade,
      listingPrice: sell_price,
      priceNudgeSetting,
    });
    let sellerPromocode = null;
    let commissionSummaryRequest = {
      commission: {
        userType,
        isBuyer: false,
      },
      product: {
        id: productId,
        sellPrice: sell_price,
        priceRange,
        categoryId: category_id,
      },
      calculationSettings: {
        vatPercentage: settings.vat_percentage,
        applyDeliveryFeeSPPs: settings.apply_delivery_fee_spps,
        applyDeliveryFeeMPPs: settings.apply_delivery_fee_mpps,
        applyDeliveryFee: settings.apply_delivery_fee,
        deliveryFeeThreshold: settings.delivery_threshold,
        deliveryFee: settings.delivery_fee,
        referralFixedAmount: settings.referral_fixed_amount,
      },
      order: null,
    };

    const commissionSummary = await Helper.create_product_commission(
      commissionSummaryRequest
    );
    if (!commissionSummary)
      return Helper.response(res, 400, "Failed to create product commission");
    let createdProd = await ProductDAL.CreateNewProduct(prodObject);
    await Helper.send_log_to_price_nudge_history(
      createdProd._id,
      prodObject.recommended_price
    );

    // await ProductHistoryDAL.Log(createdProd._id , "Update product after bid");

    await subscriptionService.CreateSubscribtion({
      productId: createdProd._id,
      userId: user_id,
      activityType: "Bidding",
    });
    await subscriptionService.CreateSubscribtion({
      productId: createdProd._id,
      userId: user_id,
      activityType: "AskQuestion",
    });
    await subscriptionService.CreateSubscribtion({
      productId: createdProd._id,
      userId: user_id,
      activityType: "ProductExpired",
    });
    await subscriptionService.CreateSubscribtion({
      productId: createdProd._id,
      userId: user_id,
      activityType: "BuyerPaymentCompleted",
    });

    // Save payment detail
    let paymentId = req.body.paymentId;

    if (paymentId && mongoose.Types.ObjectId.isValid(paymentId)) {
      await Payment.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(paymentId) },
        {
          $set: {
            "payment_input.product_id": new mongoose.Types.ObjectId(
              createdProd._id
            ),
          },
        }
      );
    }
    var returnData = { product_id: createdProd._id };

    // //Re-calculate rates
    await UserModel.findByIdAndUpdate(user_id, { $set: { rates_scan: false } });

    return Helper.response(
      res,
      200,
      Messages.product.added[LOCALE],
      returnData
    );
  } catch (error) {
    console.log(error);
    await errorLogDAL.Log(error, "User-Product", "AddProduct", 500, req.body);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function ProductDetail(req, res) {
  let { product_id } = req.params;
  const userId = req.user ? req.user._id : "";
  try {
    let productFound = await ProductDAL.GetDeepLoadProductById(
      product_id,
      userId.toString()
    );
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    let discount =
      100 -
      (productFound.sell_price * 100) / productFound.varients.current_price;
    productFound.discount = discount.toFixed();
    productFound.current_price = productFound.varients.current_price;
    // productFound.grade = "Excellent";

    productFound.favourited = userId
      ? await checkFavStatus(productFound.product_id, userId)
      : false;
    productFound.product_questions =
      await ProductQuestionDAL.QetProductQuestions(productFound.product_id);
    //await getProductQuestions(productFound.product_id);
    if (LOCALE == "ar") {
      productFound.category.category_name =
        productFound.category.category_name_ar;
      productFound.brands.brand_name = productFound.brands.brand_name_ar;
      productFound.models.model_name = productFound.models.model_name_ar;
    }
    productFound = getNewConditionName(productFound);
    var result = { productData: productFound };
    return Helper.response(res, 200, Messages.product.list[LOCALE], result);
  } catch (error) {
    await errorLogDAL.Log(error, "User-Product", "ProductDetail", 500, {
      product_id,
      userId,
    });
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AllProductByCategoryList(req, res) {
  try {
    let { category_id } = req.params;
    let user_id = req.user ? req.user._id : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const { like } = req.query;
    let { brand, category, capacities, price, grade, sort } = req.body;

    let productList = await ProductDAL.FilterProductByCategoryDirect(
      user_id,
      category_id,
      like,
      brand,
      [],
      capacities,
      price,
      grade,
      sort,
      limit,
      page - 1
    );
    for (let i = 0; i < productList.length; i++) {
      let discount =
        100 -
        (productList[i].sell_price * 100) /
          productList[i].varients.current_price;
      productList[i].discount = discount.toFixed();
      productList[i].current_price = productList[i].varients.current_price;
      productList[i].favourited = await checkFavStatus(
        productList[i].product_id,
        user_id
      );
      if (user_id && productList[i].my_bid) {
        if (productList[i].current_bid_price == productList[i].my_bid) {
          productList[i].bid_text = Messages.bid.highest[LOCALE];
        } else if (productList[i].current_bid_price > productList[i].my_bid) {
          productList[i].bid_text = Messages.bid.lower[LOCALE];
        }
      } else {
        productList[i].bid_text = "";
      }
      if (LOCALE == "ar") {
        productList[i].brands.brand_name = productList[i].brands.brand_name_ar;
        productList[i].models.model_name = productList[i].models.model_name_ar;
      }
      productList[i] = getNewConditionName(productList[i]);
    }
    var result = { productList: productList };
    return Helper.response(res, 200, Messages.product.list[LOCALE], result);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}
async function AllProductByModelList(req, res) {
  try {
    let { model_id } = req.params;
    let user_id = req.user ? req.user._id : null;
    const { like } = req.query;
    let { brand, model, capacities, price, grade, sort } = req.body;
    // sort = !sort || "low" ? 1 : -1;
    sort = !sort || sort == "low" ? 1 : -1;

    let productList = await ProductDAL.FilterProductByModel(
      user_id,
      model_id,
      like,
      brand,
      model,
      capacities,
      price,
      grade,
      sort
    );

    for (let i = 0; i < productList.length; i++) {
      let discount =
        100 -
        (productList[i].sell_price * 100) /
          productList[i].varients.current_price;
      productList[i].discount = discount.toFixed();
      productList[i].current_price = productList[i].varients.current_price;
      productList[i].favourited = await checkFavStatus(
        productList[i].product_id,
        user_id
      );
      if (user_id && productList[i].my_bid) {
        if (productList[i].current_bid_price == productList[i].my_bid) {
          productList[i].bid_text = Messages.bid.highest[LOCALE];
        } else if (productList[i].current_bid_price > productList[i].my_bid) {
          productList[i].bid_text = Messages.bid.lower[LOCALE];
        }
      } else {
        productList[i].bid_text = "";
      }
      if (LOCALE == "ar") {
        productList[i].brands.brand_name = productList[i].brands.brand_name_ar;
        productList[i].models.model_name = productList[i].models.model_name_ar;
      }
      productList[i] = getNewConditionName(productList[i]);
      if ((productList[i].answer_to_questions_migration || "").length > 0) {
        productList[i].answer_to_questions =
          productList[i].answer_to_questions_migration;
      }
      if ((productList[i].answer_to_questions_ar_migration || "").length > 0) {
        productList[i].answer_to_questions_ar =
          productList[i].answer_to_questions_ar_migration;
      }
    }
    var result = { productList: productList };
    return Helper.response(res, 200, Messages.product.list[LOCALE], result);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AllProductByUserId(user_id) {
  try {
    return await ProductDAL.FilterProductByUserId(user_id);
  } catch (error) {
    return [];
  }
}

// get the last bid in the db and check if the currnt bid is above it or not
async function ValidateBid(req, res) {
  try {
    var {
      product_id,
      bid_price,
      bidding_amount,
      payment_type,
      vat,
      commission,
      grand_total,
      shipping_charge,
    } = req.body;
    let userId = req.user ? req.user._id : null;
    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    if (productFound.user_id.toString() == userId)
      return Helper.response(res, 400, Messages.bid.self_bid[LOCALE]);
    if (bid_price >= productFound.sell_price)
      return Helper.response(res, 400, Messages.bid.above_sell[LOCALE]);
    let lastBid = await ProductDAL.GetLatestBid(product_id);
    let latestBidPrice = lastBid ? lastBid.bidding.bid_price : 0;
    if (bid_price > latestBidPrice) {
      return Helper.response(res, 200, Messages.checkout.success[LOCALE]);
    } else {
      return Helper.response(res, 400, Messages.bid.greater[LOCALE], {
        refresh: true,
      });
    }
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

// with the bid info
// check if the user info is completed, get the last bid in db and check the given vs loaded
// canot accept less bid
// do check out with part of the pid , get the product then save the new bid
// return the previous bid status and bid price
async function Bidding(req, res) {
  try {
    var {
      product_id,
      bid_price,
      bidding_amount,
      payment_type,
      vat,
      commission,
      grand_total,
      shipping_charge,
    } = req.body;
    var user_id = req.user ? req.user._id : null;
    var actionId = mongoose.Types.ObjectId();
    let order_number = Helper.generate_order_number();

    let { address, mobileNumber } = await UserDAL.FilterUser(user_id, {
      _id: 0,
      address: 1,
      mobileNumber: 1,
    });
    let cards = await getCardIds(user_id);
    if (!address)
      return Helper.response(res, 400, Messages.address.not_exists[LOCALE]);

    let pay_bid_amount = parseFloat(bidding_amount);
    let remaining_bid_amount = parseFloat(grand_total);

    //let lastBid = await ProductDAL.GetLatestBid(product_id);
    //let latestBidPrice = lastBid ? lastBid.bidding.bid_price : 0;

    //if (bid_price <= latestBidPrice) return Helper.response(res, 400, Messages.bid.greater[LOCALE], { "refresh": true });

    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    if (bid_price <= productFound.current_bid_price)
      return Helper.response(res, 400, Messages.bid.greater[LOCALE], {
        refresh: true,
      });
    if (productFound.user_id.toString() == user_id)
      return Helper.response(res, 400, Messages.bid.self_bid[LOCALE]);

    let checkoutId = "",
      transaction_status = "Success",
      payment_take = "full";
    if (pay_bid_amount > 0) {
      const region = await SettingDAL.SettingValue("region");
      var checkoutData = await Helper.create_checkout(
        req.user,
        order_number,
        address,
        pay_bid_amount,
        "DB",
        payment_type,
        cards,
        region.currency,
        region.country
      );
      if (checkoutData && typeof checkoutData.id !== "undefined") {
        checkoutId = checkoutData.id;
        transaction_status = "Pending";
        // payment_take = 'partial';
        await UserActionDAL.PrepareActionObj(
          actionId,
          user_id,
          "BidCheckOut",
          checkoutData.id,
          true
        );
      } else {
        await UserActionDAL.PrepareActionObj(
          actionId,
          user_id,
          "BidCheckOut",
          null,
          false
        );
        console.log(
          "There is a problem with check out Data on Bidding =>",
          checkoutData
        );
        return Helper.response(res, 400, Messages.checkout.fail[LOCALE]);
      }
    }

    //if (pay_bid_amount == 0)  // it was making an issue when saving
    productFound.current_bid_price = bid_price;

    var bidObject = {
      user_id,
      bid_id: mongoose.Types.ObjectId(),
      bid_price,
      bid_date: new Date().toJSON(),
      checkout_id: checkoutId,
      pay_bid_amount: pay_bid_amount.toFixed(2),
      payment_type,
      remaining_bid_amount: remaining_bid_amount.toFixed(2),
      grand_total,
      vat,
      commission,
      shipping_charge,
      buy_amount: bid_price,
      bid_status: helper.bidStatus.PENDING,
      transaction_status,
      payment_take,
      order_number,
    };

    if (!productFound.bidding) productFound.bidding = [];
    productFound.bidding.push(bidObject);
    await ProductDAL.UpdateProduct(productFound);
    await UserActionDAL.PrepareActionObj(
      actionId,
      user_id,
      "UpdateProductBids",
      productFound._id,
      true
    );

    if (pay_bid_amount == 0) {
      // const status = await returnPreviousBidderAmount(product_id);
      var prelastBids =
        productFound.bidding.length > 2
          ? _.sortBy(productFound.bidding, [
              function (o) {
                return o.bid_price;
              },
            ])
          : null;
      // await UserActionDAL.PrepareActionObj(actionId, user_id, "returnPreviousBidderAmount", prelastBids ? prelastBids[1]._id : null, status);
      Helper.send_sms_to_seller(product_id, "", bid_price, "bid_seller");
      Helper.send_sms_to_seller(product_id, user_id, pay_bid_amount, "bidder");
      await UserActionDAL.PrepareActionObj(
        actionId,
        user_id,
        "SendsmsAfterBid",
        null,
        true
      );

      await activityService.CreateActivity({
        creatorId: user_id,
        productId: product_id,
        bidValue: bid_price,
        activityType: "Bidding",
      });
      await subscriptionService.CreateSubscribtion({
        productId: product_id,
        userId: productFound.user_id,
        activityType: "BuyerBidAccepted",
      });
      await subscriptionService.CreateSubscribtion({
        productId: product_id,
        userId: productFound.user_id,
        activityType: "BuyerBidRejected",
      });
    }

    const buyer = await UserDAL.GetFullUser(productFound.user_id);
    let bidService = new BidService(BidDAL);
    await bidService.CreateBid({
      productId: product_id,
      bidId: bidObject.bid_id,
      bidder: bidObject.user_id,
      pay_bid_amount: bidObject.pay_bid_amount,
      payment_type: bidObject.payment_type,
      grand_total: bidObject.grand_total,
      vat: bidObject.vat,
      commission: bidObject.commission,
      shipping_charge: bidObject.shipping_charge,
      buy_amount: bidObject.buy_amount,
      bid_status: bidObject.bid_status,
      transaction_status: bidObject.transaction_status,
      payment_take: bidObject.payment_take,
      bid_date: bidObject.bid_date,
      buyer_mobile_number: mobileNumber,
      seller_mobile_number: buyer.mobileNumber,
    });

    // await ProductHistoryDAL.Log(product_id , "Update product after bid");
    var returnArr = { bid_id: bidObject.bid_id, checkout_id: checkoutId };
    return Helper.response(
      res,
      200,
      Messages.checkout.success[LOCALE],
      returnArr
    );
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

// remove the bid by user id, and get the max bid in the array
// if found set as open bid and set the bit value as the max
// and mark as full payment will be taken
// else set the max bid as the start bid
async function RemoveBid(req, res) {
  try {
    let { product_id } = req.body;
    let bid_id = req.body.bid_id;
    var user_id = req.user._id;
    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    productFound.bidding = productFound.bidding.filter(
      (bid) => bid.user_id.toString() != user_id.toString()
    );

    if (productFound.bidding.length > 0) {
      // this for loop can be done better
      let lastBidIndex = 0;
      for (let index = 0; index < productFound.bidding.length; index++) {
        if (
          productFound.bidding[lastBidIndex].bid_price <
          productFound.bidding[index].bid_price
        )
          lastBidIndex = index;
      }
      productFound.current_bid_price =
        productFound.bidding[lastBidIndex].bid_price;
      //productFound.bidding[lastBidIndex].bid_status = helper.bidStatus.ACTIVE;
      productFound.bidding[lastBidIndex].payment_take = "full";
    } else {
      productFound.current_bid_price = productFound.bid_price;
    }
    await ProductDAL.UpdateProduct(productFound);
    await BidDAL.UpdateBidStatus(bid_id, Helper.bidStatus.DELETED);
    await BidDAL.SetBidDeletedBy(bid_id, req.user._id, "User");
    // await ProductHistoryDAL.Log(product_id , "Remove user bid");
    return Helper.response(res, 200, Messages.bid.remove[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function AcceptBid(req, res) {
  try {
    let { product_id, bid_id } = req.body;
    var user_id = req.user ? req.user._id : null;
    let productFound = await ProductDAL.GetProductWithBid(product_id, bid_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

    productFound.bidding[0].bid_status = helper.bidStatus.ACCEPTED;
    productFound.bidding[0].sell_status = "Locked";
    await ProductDAL.SetProductBidAccepted(
      product_id,
      bid_id,
      productFound.bidding[0]
    );

    await BidDAL.UpdateBidStatus(bid_id, helper.bidStatus.ACCEPTED);

    Helper.send_sms_to_seller(
      product_id,
      "",
      productFound.bidding[0].bid_price,
      "bid_accepet_seller"
    );
    Helper.send_sms_to_seller(
      product_id,
      productFound.bidding[0].user_id,
      productFound.bidding[0].bid_price,
      "bid_accepet_bidder"
    );

    // await ProductHistoryDAL.Log(product_id , "Accept user bid");
    activityService.CreateActivity({
      creatorId: user_id,
      productId: product_id,
      activityType: "BuyerBidAccepted",
      bidValue: productFound.bidding[0].bid_price,
    });
    return Helper.response(res, 200, Messages.bid.accept[LOCALE]);
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function RejectBid(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }

    let { productId, bidId } = req.body;
    var user_id = req.user ? req.user._id : null;
    let productFound = await ProductDAL.GetFullProductById(productId);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    await ProductDAL.RejectBid(productId, bidId);
    await BidDAL.UpdateBidStatus(bidId, helper.bidStatus.REJECTED);
    // Helper.send_sms_to_seller(product_id, '', productFound.bidding[0].bid_price, 'bid_accepet_seller');
    // Helper.send_sms_to_seller(product_id, productFound.bidding[0].user_id, productFound.bidding[0].bid_price, 'bid_accepet_bidder');

    activityService.CreateActivity({
      creatorId: user_id,
      productId: productId,
      activityType: "BuyerBidRejected",
      bidValue: productFound.bidding[0].bid_price,
    });

    return Helper.response(res, 200, Messages.bid.reject[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function FavouritedProduct(req, res) {
  try {
    var user_id = req.user._id;
    var { product_id } = req.body;

    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    if (productFound.user_id.toString() == user_id)
      return Helper.response(res, 400, Messages.product.self_favourite[LOCALE]);

    if (!productFound.favourited_by) productFound.favourited_by = [];
    productFound.favourited_by.push(user_id);

    await ProductDAL.UpdateProduct(productFound);
    // await ProductHistoryDAL.Log(product_id , "Favourited Product by user");
    return Helper.response(res, 200, Messages.product.favourite[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function UnfavouritedProduct(req, res) {
  try {
    var user_id = req.user._id;
    var { product_id } = req.body;
    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    productFound.favourited_by = productFound.favourited_by.filter(
      (id) => id.toString() != user_id.toString()
    );
    await ProductDAL.UpdateProduct(productFound);

    // await ProductHistoryDAL.Log(product_id , "Unfavourited Product by user");
    return Helper.response(res, 200, Messages.product.unfavourite[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function GetFavouritedProductList(req, res) {
  try {
    let user_id = req.user._id;
    let productList = await ProductDAL.GetFavList(user_id);
    for (let i = 0; i < productList.length; i++) {
      // let discount = 100 - (productList[i].sell_price * 100 / productList[i].varients.current_price);
      // productList[i].discount = discount.toFixed();
      // productList[i].current_price = productList[i].varients.current_price;
      let discount =
        100 -
        (productList[i].sell_price * 100) / productList[i].models.current_price;
      productList[i].discount = discount.toFixed();
      productList[i].current_price = productList[i].models.current_price;

      productList[i].favourited = true;
      if (LOCALE == "ar") {
        productList[i].brands.brand_name = productList[i].brands.brand_name_ar;
        productList[i].models.model_name = productList[i].models.model_name_ar;
      }
      productList[i] = getNewConditionName(productList[i]);
    }
    var result = { productList: productList };
    return Helper.response(res, 200, Messages.product.fav_list[LOCALE], result);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function PostQuestion(req, res) {
  try {
    let user_id = req.user._id;
    let { product_id, question } = req.body;

    let quesObject = {
      user_id: user_id,
      product_id: product_id,
      question: question,
      created_at: new Date(),
      updated_at: new Date(),
    };

    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    if (productFound.user_id.toString() == user_id)
      return Helper.response(res, 400, Messages.question.self_ask[LOCALE]);

    let questionObj = await ProductQuestionDAL.AddNewQuestion(quesObject);
    Helper.send_sms_to_seller(product_id, "", "", "question");

    await activityService.CreateActivity({
      creatorId: user_id,
      productId: product_id,
      questionId: questionObj._id,
      activityType: "AskQuestion",
    });
    await subscriptionService.CreateSubscribtion({
      productId: product_id,
      userId: user_id,
      questionId: questionObj._id,
      activityType: "AnswerQuestion",
    });

    return Helper.response(res, 200, Messages.question.added[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function PostAnswer(req, res) {
  try {
    let user_id = req.user._id;
    let { product_id, question_id, answer } = req.body;

    let quesFound = await ProductQuestionDAL.QetProductQuestion(
      product_id,
      question_id
    );
    if (!quesFound)
      return Helper.response(res, 400, Messages.question.not_exists[LOCALE]);

    quesFound.answer = answer;
    await ProductQuestionDAL.UpdateProductQuestion(quesFound);

    await activityService.CreateActivity({
      creatorId: user_id,
      productId: product_id,
      bidValue: 0,
      questionId: question_id,
      activityType: "AnswerQuestion",
    });
    Helper.send_sms_to_seller(product_id, quesFound.user_id, "", "answer");
    return Helper.response(res, 200, Messages.question.answer[LOCALE]);
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function DeleteProduct(req, res) {
  try {
    let { product_id } = req.params;
    const user_id = req.user ? req.user._id : "";
    if (user_id === "" || product_id === "")
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);
    if (["Available", "Draft", "Refunded"].includes(productFound.sell_status)) {
      productFound.status = "Delete";
      productFound.deletedDate = new Date();
      productFound.updatedDate = new Date();
      productFound.deletedBy = "Seller";

      if (String(user_id) != String(productFound.user_id))
        return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

      await ProductDAL.UpdateProduct(productFound);
      // await returnLastBidderAmount(product_id);
      // await ProductHistoryDAL.Log(product_id , "Delete Product by user");

      // Re-calculate rates
      if (productFound.user_id) {
        await UserModel.findByIdAndUpdate(productFound.user_id, {
          $set: { rates_scan: false },
        });
      }
      const user = await UserDAL.GetFullUser(productFound.user_id);

      await Helper.algolia_remove_product(product_id);

      return Helper.response(res, 200, Messages.product.delete[LOCALE]);
    } else {
      return Helper.response(res, 400, Messages.product.not_delete[LOCALE]);
    }
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

async function ProductRenew(req, res) {
  try {
    let { product_id } = req.params;
    let { days } = req.params;
    let productFound = await ProductDAL.GetFullProductById(product_id);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

    var date = new Date();
    date.setDate(Number(new Date().getDate()) + Number(days));
    productFound.expiryDate = date;
    if (productFound.status === IDLE) {
      productFound.status = ACTIVE;
    }
    // setting search_sync field to empty ensures that the product
    // will be rescanned by sync products to algolia cronjob
    productFound.search_sync = "";
    productFound.isUserNotifiedForExpiry = false;
    productFound.updatedDate = new Date();
    if (productFound.actionDates) {
      productFound.actionDates.push({
        createdDate: new Date(),
        expiryDate: date,
      });
    } else {
      productFound.actionDates = [
        { createdDate: new Date(), expiryDate: date },
      ];
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
    await ProductDAL.UpdateProduct(productFound);
    await Helper.sync_search([product_id]);
    return Helper.response(res, 200, Messages.product.renew[LOCALE]);
  } catch (error) {
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}

function calculateReservationForCategory(categoryId, settings) {
  const reservationForCategory = (
    JSON.parse(settings.categories_with_reservation) || []
  ).find((elem) => elem.categoryId === categoryId);
  const reservation = reservationForCategory
    ? {
        reservationAmount: reservationForCategory.amount,
      }
    : null;
  return reservation;
}
async function CalculateSummary(
  productFound,
  settings,
  promocodeId,
  bidId,
  actionType,
  bidValue,
  usedReferralCodeBefore = false,
  orderId,
  paymentId,
  addOns,
  paymentModule
) {
  let sellPrice = 0;
  if (actionType == "bid") {
    sellPrice = bidValue;
  } else if (actionType == "buy" || actionType == "downPayment") {
    sellPrice = productFound.sell_price;
  } else if (actionType == "buyWithBid") {
    let bid = bidId
      ? productFound.bidding.find((r) => r.bid_id.toString() == bidId)
      : null;
    sellPrice = parseFloat(bid.bid_price);
  }
  const userSeller = await UserDAL.GetFullUser(productFound.user_id);
  const userType = await getSellerType(userSeller);

  let conditionsService = new ConditionsService(ConditionDAL);
  const condition = await conditionsService.GetConditionById(
    productFound.varient_id
  );
  const priceNudgeSetting = await Helper.get_price_nudge_settings(
    productFound.varient_id
  );

  const priceRange = await getPriceRange({
    conditions: condition[0],
    grade: productFound.grade,
    listingPrice: sellPrice,
    priceNudgeSetting,
  });
  let promocode = null;
  if (promocodeId) {
    promocode = await Helper.getPromoCode(promocodeId);
    if (promocode.promoLimit > productFound.sell_price) return null;
  }
  let reservation = null;
  if (
    settings.enable_reservation &&
    paymentModule === PaymentModuleName.RESERVATION
  ) {
    reservation = calculateReservationForCategory(
      productFound.category_id.toString(),
      settings
    );
  }

  let financingRequest = null;
  if (
    settings.enable_financing &&
    paymentModule === PaymentModuleName.FINANCINGREQUEST
  ) {
    const financingForCategory = (
      JSON.parse(settings.categories_with_financing) || []
    ).find((elem) => elem.categoryId === productFound.category_id.toString());
    financingRequest = financingForCategory
      ? {
          amount: financingForCategory.amount,
        }
      : null;
    reservation = calculateReservationForCategory(
      productFound.category_id.toString(),
      settings
    );
  }

  let paymentModuleName = PaymentModuleName.GENERAL_ORDER;
  if (reservation) {
    paymentModuleName = PaymentModuleName.RESERVATION;
  }
  if (financingRequest) {
    paymentModuleName = PaymentModuleName.FINANCINGREQUEST;
  }
  const buyerCommissionSummaryRequest = {
    commission: {
      userType,
      isBuyer: true,
    },
    product: {
      id: productFound._id.toString(),
      sellPrice: sellPrice,
      priceRange,
      categoryId: productFound.category_id.toString(),
    },
    calculationSettings: {
      vatPercentage: settings.vat_percentage,
      applyDeliveryFeeSPPs: settings.apply_delivery_fee_spps,
      applyDeliveryFeeMPPs: settings.apply_delivery_fee_mpps,
      applyDeliveryFee: settings.apply_delivery_fee,
      deliveryFeeThreshold: settings.delivery_threshold,
      deliveryFee: settings.delivery_fee,
      referralFixedAmount: settings.referral_fixed_amount,
      applyReservation: reservation ? true : false,
      applyFinancing: financingRequest ? true : false,
    },
    promoCode: promocode
      ? {
          promoLimit: promocode.promoLimit,
          type: promocode.promoType,
          generator: promocode.promoGenerator,
          discount: promocode.discount,
          percentage: promocode.percentage,
        }
      : null,
    order: orderId ? { id: orderId } : null,
    addOns,
    paymentOption: paymentId
      ? {
          id: paymentId,
        }
      : null,
    paymentModuleName: paymentModuleName,
    reservation: reservation,
    financingRequest: financingRequest,
  };
  const buyerCommissionSummary = await Helper.create_product_commission(
    buyerCommissionSummaryRequest
  );
  const sellerCommissionSummary = await Helper.get_product_commission({
    productId: productFound._id.toString(),
    isBuyer: false,
  });
  return {
    actionType,
    sellData: {
      id: buyerCommissionSummary.id,
      disValue: buyerCommissionSummary.discount,
      sellPrice: buyerCommissionSummary.sellPrice,
      commission: buyerCommissionSummary.commission,
      vat: buyerCommissionSummary.totalVat,
      sellerCommission: sellerCommissionSummary.commission,
      sellerVat: sellerCommissionSummary.totalVat,
      sellerGrandTotal: sellerCommissionSummary.grandTotal,
      grandTotal: buyerCommissionSummary.grandTotal,
      shipping: buyerCommissionSummary.deliveryFee,
      reservation: buyerCommissionSummary.reservation,
      financingRequest: buyerCommissionSummary.financingRequest,
    },
  };
}

async function BuyNow(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }
    let userId = req.user._id;

    let addOnsOrder = {
      selectedAddOns: [],
      addOnsGrandTotal: 0,
      addOnsTotal: 0,
      addOnsVat: 0,
    };

    let addOns = req.body.addOns || null;
    const paymentModule = req.body.paymentModule || null;
    const extraParams = req.body.extraParams || {};

    if (addOns && addOns.selectedAddOns && addOns.selectedAddOns.length > 0) {
      addOnsOrder = {
        selectedAddOns: req.body.addOns.selectedAddOns || [],
        addOnsGrandTotal: req.body.addOns.addOnsGrandTotal || 0,
        addOnsTotal: req.body.addOns.addOnsTotal || 0,
        addOnsVat: req.body.addOns.addOnsVat || 0,
      };
      addOns = addOns.selectedAddOns.map(({ id, addOnPrice }) => ({
        id,
        addOnPrice,
      }));
    }

    // do a validation ok action type
    let {
      productId,
      buyerPromocodeId,
      bidId,
      paymentType,
      actionType,
      paymentId,
    } = req.body;
    if (actionType == "buyWithBid" && !bidId)
      return Helper.response(res, 400, "Param is missing");
    let orderNumber = Helper.generate_order_number();
    let productFound = await ProductDAL.GetFullProductById(productId);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

    if (productFound.sell_status == "Sold")
      return Helper.response(res, 400, Messages.product.sold[LOCALE]);
    if (productFound.sell_status == "Refunded")
      return Helper.response(res, 400, Messages.product.refund[LOCALE]);
    if (productFound.sell_status == "Locked")
      return Helper.response(res, 400, Messages.product.locked[LOCALE]);

    // commenting out this block as since now we can have multiple orders against a product after auto relisting
    // const orderFoundForProduct = await orderDAL.CheckSoldProduct(productId);
    // if (orderFoundForProduct && orderFoundForProduct.length > 0) {
    //   productFound.sell_status = "Sold";
    //   await ProductDAL.UpdateProduct(productFound);
    //   return Helper.response(res, 400, Messages.product.sold[LOCALE]);
    // }
    let buyer = await UserDAL.GetUserWithNewAddressFormat(userId);
    const sysSettings = await SettingDAL.GetSetting();

    if (productFound.user_id == userId)
      return Helper.response(res, 400, Messages.checkout.self_buy[LOCALE]);
    if (productFound.status != "Active")
      return Helper.response(res, 400, Messages.product.not_available[LOCALE]);
    if ((buyer.addresses || []).length === 0)
      return Helper.response(res, 400, Messages.address.not_exists[LOCALE]);

    let cardIds = await getCardIds(buyer._id);

    const settings = {
      ...sysSettings,
      ...productFound.billingSettings,
      ...{
        delivery_threshold: sysSettings.delivery_threshold,
        apply_delivery_fee: sysSettings.apply_delivery_fee,
        delivery_fee: sysSettings.delivery_fee,
      },
    };

    let sellerCommissionSummary = await Helper.get_product_commission({
      productId: productId,
      isBuyer: false,
    });

    if (!sellerCommissionSummary) {
      const userSeller = await UserDAL.GetFullUser(productFound.user_id);
      const userType = await getSellerType(userSeller);
      let sellerCommissionPercentage = settings.seller_commission_percentage;
      if (
        SellerUserType.KEY_SELLER == userType &&
        settings.business_seller_commission_percentage
      )
        sellerCommissionPercentage =
          settings.business_seller_commission_percentage;
      let commissionSummaryRequest = {
        commission: {
          userType,
          isBuyer: false,
        },
        product: {
          id: productId,
          sellPrice: productFound.sell_price,
        },
        calculationSettings: {
          vatPercentage: settings.vat_percentage,
          applyDeliveryFeeSPPs: settings.apply_delivery_fee_spps,
          applyDeliveryFeeMPPs: settings.apply_delivery_fee_mpps,
          applyDeliveryFee: settings.apply_delivery_fee,
          deliveryFeeThreshold: settings.delivery_threshold,
          deliveryFee: settings.delivery_fee,
          referralFixedAmount: settings.referral_fixed_amount,
          sellerCommissionPercentage: sellerCommissionPercentage,
          buyerCommissionPercentage: settings.buyer_commission_percentage,
          priceQualityExtraCommission: settings.price_quality_extra_commission,
        },
        promoCode: null,
        order: null,
      };
      sellerCommissionSummary = await Helper.migrate_product_commission(
        commissionSummaryRequest
      );
    }

    const orderId = new mongoose.Types.ObjectId();
    let { sellData } = await CalculateSummary(
      productFound,
      settings,
      buyerPromocodeId,
      bidId,
      actionType,
      null,
      true,
      orderId,
      paymentId,
      addOns,
      paymentModule
    );
    let paymentAmount = sellData.grandTotal;
    if (actionType === "downPayment") {
      paymentAmount = sellData.downPayment.amount;
    }
    if (
      sellData.reservation &&
      paymentModule === PaymentModuleName.RESERVATION
    ) {
      paymentAmount = sellData.reservation.reservationAmount;
    }
    if (
      sellData.financingRequest &&
      paymentModule === PaymentModuleName.FINANCINGREQUEST
    ) {
      paymentAmount = sellData.financingRequest.amount;
    }
    const region = await SettingDAL.SettingValue("region");

    var checkoutData = await Helper.create_checkout_v2(
      req.user,
      orderNumber,
      buyer.addresses[0],
      paymentAmount,
      "DB",
      paymentType,
      cardIds,
      region.currency,
      region.country,
      extraParams
    );

    if (checkoutData && typeof checkoutData.id !== "undefined") {
      let discount = 0;
      if (sellData.disValue !== "undefined") {
        discount = sellData.disValue;
      }

      let checkout_id = checkoutData.id;
      let bidIdent = "";
      if (bidId) {
        bidIdent = bidId;
      }
      const buyerAddress = {
        street: buyer.addresses[0].street,
        address: buyer.addresses[0].district,
        city: buyer.addresses[0].city,
        postal_code: buyer.addresses[0].postal_code,
        address_type: "",
        latitude: buyer.addresses[0].latitude,
        longitude: buyer.addresses[0].longitude,
      };

      var newOrder = {
        _id: orderId,
        buyer: userId,
        seller: productFound.user_id,
        product: productId,
        buyer_address: buyerAddress,
        buy_amount: sellData.sellPrice,
        shipping_charge: sellData.shipping,
        discount: discount,
        vat: sellData.vat,
        commission: sellData.commission,
        grand_total: sellData.grandTotal,
        seller_commission: sellData.sellerCommission,
        seller_vat: sellData.sellerVat,
        seller_grand_total: sellData.sellerGrandTotal,
        checkout_id: checkout_id,
        order_number: orderNumber,
        payment_type: paymentType,
        down_payment_details:
          actionType == "downPayment"
            ? {
                remaining: buySummary.downPayment.remainingDownPaymentRounded,
                payment_amount: buySummary.downPayment.amount,
              }
            : null,
        buy_type: actionType == "buyWithBid" ? "Bid" : "Direct",
        promos: {
          buyerPromocodeId,
        },
        sourcePlatform: req.headers["client-id"],
        gtmClientId: req.headers["gtm-client-id"],
        gtmSessionId: req.headers["gtm-session-id"],
        bid_id: bidIdent,
        billingSettings: {
          buyer_commission_percentage: settings.buyer_commission_percentage,
          seller_commission_percentage: settings.seller_commission_percentage,
          shipping_charge_percentage: settings.shipping_charge_percentage,
          vat_percentage: sysSettings.vat_percentage,
          referral_discount_type: sysSettings.referral_discount_type,
          referral_percentage: sysSettings.referral_percentage,
          referral_fixed_amount: sysSettings.referral_fixed_amount,
          delivery_threshold: sysSettings.delivery_threshold,
          apply_delivery_fee: sysSettings.apply_delivery_fee,
          delivery_fee: sysSettings.delivery_fee,
          price_quality_extra_commission:
            settings.price_quality_extra_commission,
        },
        addOns: addOnsOrder,
        isReservation: paymentModule === PaymentModuleName.RESERVATION,
        isFinancing: paymentModule === PaymentModuleName.FINANCINGREQUEST,
        isConsignment: productFound?.isConsignment,
      };

      let result = await orderDAL.CreateNewOrder(newOrder);

      // For financing dont marked it as locked
      if (!newOrder.isFinancing) {
        await ProductDAL.changeProductStatus(productId, "Locked");
        await Helper.algolia_remove_product(productId);
      }
      console.log("Job enquing to create dmo Order", { orderId: result._id });
      await Helper.create_dmo(result._id);
      if (buyerPromocodeId) {
        await Helper.increasePromoCodeUsageCount(buyerPromocodeId);
        await Helper.validatePromoCodeUsage(result._id);
      }
      return Helper.response(res, 200, Messages.checkout.success[LOCALE], {
        order_id: result._id,
        checkout_id: checkout_id,
      });
    } else {
      await Helper.log_payment_error({
        userName: req.user.name,
        // orderId: order_number,
        soumNumber: orderNumber,
        mobileNumber: req.user.mobileNumber,
        errorMessage: checkoutData.result.description,
        paymentErrorId: uuidv4(),
        paymentProvidor: paymentType,
        paymentProvidorType: "HyperPay",
        amount: paymentAmount,
        productId: productId,
      });
      return Helper.response(res, 400, Messages.checkout.fail[LOCALE]);
    }
  } catch (error) {
    console.log(error);
    switch (error.message) {
      case "PromoError-5":
        Helper.response(res, 400, Messages.promocode.promoLimitFail[LOCALE]);
        break;
      case "PromoError-6":
        Helper.response(res, 400, Messages.promocode.usedBefore[LOCALE]);
        break;
      default:
        Helper.response(res, 500, Messages.api.fail[LOCALE]);
        break;
    }
  }
}

async function ReserveFinancingProduct(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
        errors: errors.array(),
      });
    }

    const userId = req.user._id;
    const { orderId } = req.body;
    const order = await OrderModel.findOne({
      _id: mongoose.Types.ObjectId(orderId),
    });
    if (
      !order ||
      !order.isFinancing ||
      order.buyer.toString() !== userId.toString()
    ) {
      return Helper.response(res, 400, Messages.order.not_exists[LOCALE]);
    }

    const productId = order.product.toString();
    let productFound = await ProductDAL.GetFullProductById(productId);
    if (!productFound)
      return Helper.response(res, 400, Messages.product.not_exists[LOCALE]);

    if (productFound.sell_status == "Sold")
      return Helper.response(res, 400, Messages.product.sold[LOCALE]);
    if (productFound.sell_status == "Refunded")
      return Helper.response(res, 400, Messages.product.refund[LOCALE]);

    const dmo = await Helper.getDMO(order.id.toString());
    if (
      !dmo ||
      dmo.status?.name !== dmOrderStatus.APPROVED_BY_FINANCE_COMPANY
    ) {
      return Helper.response(
        res,
        400,
        Messages.order.financing_request_not_approved[LOCALE]
      );
    }
    const { paymentType } = req.body;

    const region = await SettingDAL.SettingValue("region");
    const sellerCommissionSummary = await Helper.get_product_commission({
      orderId: orderId,
      productId: productId,
      isBuyer: true,
    });
    const buyer = await UserDAL.GetUserWithNewAddressFormat(userId);
    const paymentAmount = sellerCommissionSummary.reservation.reservationAmount;
    const cardIds = await getCardIds(buyer._id);

    var checkoutData = await Helper.create_checkout_v2(
      req.user,
      order.orderNumber,
      buyer.addresses[0],
      paymentAmount,
      "DB",
      paymentType,
      cardIds,
      region.currency,
      region.country
    );
    if (checkoutData && typeof checkoutData.id !== "undefined") {
      const checkoutId = checkoutData.id;
      order.checkout_id = checkoutId;
      order.transaction_status = "Pending";
      order.save();

      await ProductDAL.changeProductStatus(productId, "Locked");
      await Helper.algolia_remove_product(productId);

      return Helper.response(res, 200, Messages.checkout.success[LOCALE], {
        order_id: orderId,
        checkout_id: checkoutId,
      });
    } else {
      await Helper.log_payment_error({
        userName: req.user.name,
        orderId: orderId,
        soumNumber: order.orderNumber,
        mobileNumber: req.user.mobileNumber,
        errorMessage: checkoutData.result.description,
        paymentErrorId: uuidv4(),
        paymentProvidor: paymentType,
        paymentProvidorType: "HyperPay",
        amount: paymentAmount,
        productId: productId,
      });
      return Helper.response(res, 400, Messages.checkout.fail[LOCALE]);
    }
  } catch (error) {
    console.log(error);
    return Helper.response(res, 500, Messages.api.fail[LOCALE]);
  }
}
const ProductApis = {
  AddProduct,
  AllProductList,
  AllProductByModelList,
  AllProductByCategoryList,
  ProductDetail,
  ValidateBid,
  Bidding,
  RemoveBid,
  AcceptBid,
  FavouritedProduct,
  UnfavouritedProduct,
  GetFavouritedProductList,
  PostQuestion,
  PostAnswer,
  DeleteProduct,
  ProductRenew,
  BuyNow,
  RejectBid,
  ReserveFinancingProduct,

  BuyProduct: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
          errors: errors.array(),
        });
      }

      let user_id = req.user._id;
      let product_id = req.body.product_id;
      let address_id = req.body.address_id;
      let buy_amount = req.body.buy_amount;
      let shipping_charge = req.body.shipping_charge;
      let vat = req.body.vat;
      let commission = req.body.commission;
      let grand_total = req.body.grand_total;
      let buyerPromocodeId = req.body.buyerPromocodeId;
      let buyerDiscount = req.body.buyerDiscount;
      let order_number = Helper.generate_order_number();
      let payment_type = req.body.payment_type;
      let sourcePlatform = req.headers["client-id"];
      let productStatus = await getProductStatus(product_id);
      const extraParams = req.body.extraParams;

      let productFound = await ProductDAL.GetFullProductById(product_id);
      if (productFound.user_id.toString() == user_id)
        return Helper.response(res, 400, Messages.checkout.self_buy[LOCALE]);

      if (productStatus != "Available") {
        return Helper.response(
          res,
          400,
          Messages.product.not_available[LOCALE]
        );
      }
      let address = await getBuyerAddress(user_id, address_id);
      if (address == "") {
        return Helper.response(res, 400, Messages.address.not_exists[LOCALE]);
      }
      var cardIds = await getCardIds(user_id);
      //return false;
      const region = await SettingDAL.SettingValue("region");
      var where = { _id: mongoose.Types.ObjectId(product_id) };
      ProductModel.findOne(where, async function (err, product) {
        if (product) {
          var checkoutData = await Helper.create_checkout(
            req.user,
            order_number,
            address,
            grand_total,
            "DB",
            payment_type,
            cardIds,
            region.currency,
            region.country,
            extraParams
          );
          if (checkoutData && typeof checkoutData.id !== "undefined") {
            //console.log("das", checkoutData.id); return false;
            let checkout_id = checkoutData.id;
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
              checkout_id: checkout_id,
              order_number: order_number,
              payment_type: payment_type,
              sourcePlatform: sourcePlatform,
              isUserNotified: false,
              promos: {
                buyerPromocodeId,
              },
            };
            //console.log(prodObject); return false;
            let Order = new OrderModel(prodObject);
            Order.save(async (error, result) => {
              if (error) {
                //console.log(error);return false;
                return Helper.response(res, 500, Messages.api.error[LOCALE]);
              } else {
                console.log(result);
                await changeProductStatus(product_id);
                var returnArr = {
                  order_id: result._id,
                  checkout_id: checkout_id,
                };
                console.log(product);
                return Helper.response(
                  res,
                  200,
                  Messages.checkout.success[LOCALE],
                  returnArr
                );
              }
            });
          } else {
            console.log(
              "There is a problem with check out Data on BuyProduct =>",
              checkoutData
            );
            return Helper.response(res, 400, Messages.checkout.fail[LOCALE]);
          }
        }
      });
    } catch (error) {
      console.log(error);
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },

  ProductBuyFromBid: async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return Helper.response(res, 400, Messages.api.param_missing[LOCALE], {
          errors: errors.array(),
        });
      }

      let user_id = req.user._id;
      let bid_id = req.body.bid_id;
      let product_id = req.body.product_id;
      let address_id = req.body.address_id;
      let buyerPromocodeId = req.body.buyerPromocodeId;
      let buyerDiscount = req.body.buyerDiscount;
      let order_number = Helper.generate_order_number();
      let payment_type = req.body.payment_type;

      let settings = await SettingDAL.GetSetting();
      let address = await getBuyerAddress(user_id, address_id);

      let productFound = await ProductDAL.GetFullProductById(product_id);
      if (productFound.user_id.toString() == user_id)
        return Helper.response(res, 400, Messages.checkout.self_buy[LOCALE]);

      if (address == "") {
        return Helper.response(res, 400, Messages.address.not_exists[LOCALE]);
      }
      var cardIds = await getCardIds(user_id);

      let col = {
        _id: 0,
        user_id,
        bidding: { $elemMatch: { bid_id: mongoose.Types.ObjectId(bid_id) } },
      };
      let where = {
        _id: mongoose.Types.ObjectId(product_id),
        "bidding.user_id": mongoose.Types.ObjectId(user_id),
        "bidding.bid_status": Helper.bidStatus.ACCEPTED,
        "bidding.bid_id": mongoose.Types.ObjectId(bid_id),
      };
      ProductModel.findOne(where, col, async function (err, product) {
        if (err) {
          return Helper.response(res, 500, Messages.api.error[LOCALE]);
        } else if (!product) {
          return Helper.response(res, 400, Messages.bid.not_exists[LOCALE]);
        } else {
          var biddingData = product.bidding[0];
          //console.log(biddingData);
          var payment_take = biddingData.payment_take;
          var buy_amount = parseFloat(biddingData.buy_amount);
          var shipping_charge = parseFloat(biddingData.shipping_charge);
          var vat = parseFloat(biddingData.vat);
          var commission = parseFloat(biddingData.commission);
          var grand_total = parseFloat(biddingData.grand_total);
          /*var payment_take = "partial";
					var transactionData = await Helper.get_transaction_report(biddingData.transaction_id, biddingData.payment_type);
					//console.log(transactionData); return false;
					if (transactionData) {
						var transactionStatus = Helper.check_payment_status_code(transactionData.result);
						//console.log("transactionStatus ---", transactionStatus);
						if (!transactionStatus) {
							payment_take = "full";
						}
					}*/

          if (payment_take == "partial") {
            var pay_amount = parseFloat(biddingData.remaining_bid_amount);
          } else {
            var pay_amount = parseFloat(biddingData.grand_total);
          }

          //var pay_amount = biddingData.remaining_bid_amount;

          if (buyerPromocodeId) {
            let newCommission = commission - buyerDiscount;
            let newVat = (settings.vat_percentage / 100) * newCommission;
            pay_amount =
              pay_amount + (newCommission + newVat) - (commission + vat);

            commission = newCommission;
            vat = newVat;
          }
          const region = await SettingDAL.SettingValue("region");
          var checkoutData = await Helper.create_checkout(
            req.user,
            order_number,
            address,
            pay_amount,
            "DB",
            payment_type,
            cardIds,
            region.currency,
            region.country
          );
          //console.log(checkoutData); return false;
          if (checkoutData && typeof checkoutData.id !== "undefined") {
            //console.log("das", checkoutData.id); return false;
            let checkout_id = checkoutData.id;
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
              checkout_id: checkout_id,
              order_number: order_number,
              payment_type: payment_type,
              buy_type: "Bid",
              isUserNotified: false,
              promos: {
                buyerPromocodeId,
              },
            };
            //console.log(prodObject); return false;
            let Order = new OrderModel(prodObject);
            Order.save(async (error, result) => {
              if (error) {
                //console.log(error);return false;
                return Helper.response(res, 500, Messages.api.error[LOCALE]);
              } else {
                await changeProductStatus(product_id);
                var returnArr = {
                  order_id: result._id,
                  checkout_id: checkout_id,
                };
                return Helper.response(
                  res,
                  200,
                  Messages.checkout.success[LOCALE],
                  returnArr
                );
              }
            });
          } else {
            console.log(
              "There is a problem with check out Data on ProductBuyFromBid =>",
              checkoutData
            );
            return Helper.response(res, 400, Messages.checkout.fail[LOCALE]);
          }
        }
      });
    } catch (error) {
      console.log(error);
      return Helper.response(res, 500, Messages.api.fail[LOCALE]);
    }
  },
};

async function uploadPictureFileName(files, callback) {
  return new Promise((resolve, reject) => {
    var fileNameArr = [];
    if (files.length > 0) {
      files.map(function (item) {
        var fileUrl = new URL(item.location);
        if (fileUrl && fileUrl.pathname) {
          var fn = ENV.AWS_CDN_ENDPOINT + fileUrl.pathname;
          fileNameArr.push(fn);
        }
      });
    }
    resolve(fileNameArr);
  }).catch((err) => {
    console.log("in catch block", err);
  });
}

async function checkFavStatus(product_id, user_id, callback) {
  return new Promise((resolve, reject) => {
    ProductModel.find(
      {
        _id: mongoose.Types.ObjectId(product_id),
        favourited_by: mongoose.Types.ObjectId(user_id),
      },
      function (err, favExist) {
        if (favExist.length) {
          //console.log(favExist.length);
          resolve(true);
          //resolve(favExist.length);
        } else {
          resolve(false);
        }
      }
    );
  }).catch((err) => {
    console.log("in catch block", err);
  });
}

async function getBuyerAddress(user_id, address_id, callback) {
  return new Promise((resolve, reject) => {
    //let col = { '_id': 0, address: { $elemMatch: { address_id: mongoose.Types.ObjectId(address_id) } } };
    let col = { _id: 0, address: 1 };
    //var where = { _id: mongoose.Types.ObjectId(user_id), "address.address_id": mongoose.Types.ObjectId(address_id) };
    var where = { _id: mongoose.Types.ObjectId(user_id) };
    if (address_id) {
      var where = {
        _id: mongoose.Types.ObjectId(user_id),
        "address.address_id": mongoose.Types.ObjectId(address_id),
      };
    }
    UserModel.findOne(where, col, function (err, address) {
      if (address) {
        //console.log(address.addresses[0]);
        resolve(address.address);
        //resolve(favExist.length);
      } else {
        resolve("");
      }
    });
  }).catch((err) => {
    console.log("in catch block", err);
  });
}

async function getCardIds(user_id, callback) {
  return new Promise((resolve, reject) => {
    var cards = {};
    let col = { _id: 0, cards: 1 };
    let where = { _id: mongoose.Types.ObjectId(user_id) };
    UserModel.findOne(where, col, function (err, cardArr) {
      if (cardArr.cards.length > 0) {
        cardArr.cards.map(function (item, i) {
          var obj = {};
          obj["registrations[" + i + "].id"] = item;
          Object.assign(cards, obj);
        });
        resolve(cards);
        //resolve(favExist.length);
      } else {
        resolve(cards);
      }
    });
  }).catch((err) => {
    console.log("in catch block", err);
  });
}

async function getProductStatus(product_id, callback) {
  return new Promise((resolve, reject) => {
    ProductModel.findOne(
      { _id: mongoose.Types.ObjectId(product_id) },
      function (err, product) {
        if (product) {
          //console.log(product);
          resolve(product.sell_status);
        } else {
          resolve("");
        }
      }
    );
  }).catch((err) => {
    console.log("in catch block", err);
  });
}

async function changeProductStatus(product_id, callback) {
  return new Promise((resolve, reject) => {
    ProductModel.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(product_id) },
      { $set: { sell_status: "Locked" } },
      function (err, product) {
        if (product) {
          //console.log(product);
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  }).catch((err) => {
    console.log("in catch block", err);
  });
}

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

function generateCode(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getSellerType(user) {
  if (user.isKeySeller) return SellerUserType.KEY_SELLER;
  if (user.isMerchant) return SellerUserType.MERCHANT_SELLER;

  if (user.sellerType && user.sellerType.isUAE)
    return SellerUserType.UAE_SELLER;

  return SellerUserType.INDIVIDUAL_SELLER;
}
async function getPriceRange({
  conditions,
  grade,
  listingPrice,
  priceNudgeSetting,
}) {
  // this was taken from V2
  let expensiveValue = 0;
  let excellentValue = 0;

  if (!conditions || conditions.length === 0) {
    return null;
  }
  const formatedGrade = grade.toString().toLowerCase().trim().replace(" ", "_");

  if (formatedGrade === "like_new") {
    expensiveValue =
      priceNudgeSetting && conditions.priceRange.like_new_min_fair_price_nudge
        ? conditions.priceRange.like_new_min_fair_price_nudge + 1
        : conditions.priceRange.like_new_min_fair + 1;
    excellentValue =
      priceNudgeSetting &&
      conditions.priceRange.like_new_min_excellent_price_nudge
        ? conditions.priceRange.like_new_min_excellent_price_nudge
        : conditions.priceRange.like_new_min_excellent;
  }

  if (formatedGrade === "light_use" || formatedGrade === "lightly_used") {
    expensiveValue =
      priceNudgeSetting &&
      conditions.priceRange.lightly_used_min_fair_price_nudge
        ? conditions.priceRange.lightly_used_min_fair_price_nudge + 1
        : conditions.priceRange.lightly_used_min_fair + 1;
    excellentValue =
      priceNudgeSetting &&
      conditions.priceRange.lightly_used_min_excellent_price_nudge
        ? conditions.priceRange.lightly_used_min_excellent_price_nudge
        : conditions.priceRange.lightly_used_min_excellent;
  }

  if (formatedGrade === "good_condition") {
    expensiveValue =
      priceNudgeSetting &&
      conditions.priceRange.good_condition_min_fair_price_nudge
        ? conditions.priceRange.good_condition_min_fair_price_nudge + 1
        : conditions.priceRange.good_condition_min_fair + 1;
    excellentValue =
      priceNudgeSetting &&
      conditions.priceRange.good_condition_min_excellent_price_nudge
        ? conditions.priceRange.good_condition_min_excellent_price_nudge
        : conditions.priceRange.good_condition_min_excellent;
  }

  if (formatedGrade === "fair") {
    expensiveValue =
      priceNudgeSetting &&
      conditions.priceRange.good_condition_min_fair_price_nudge
        ? conditions.priceRange.good_condition_min_fair_price_nudge + 1
        : conditions.priceRange.good_condition_min_fair + 1;
    excellentValue =
      priceNudgeSetting &&
      conditions.priceRange.good_condition_min_excellent_price_nudge
        ? conditions.priceRange.good_condition_min_excellent_price_nudge
        : conditions.priceRange.good_condition_min_excellent;
  }

  if (formatedGrade === "extensive_use") {
    expensiveValue =
      priceNudgeSetting &&
      conditions.priceRange.extensively_used_min_fair_price_nudge
        ? conditions.priceRange.extensively_used_min_fair_price_nudge + 1
        : conditions.priceRange.extensively_used_min_fair + 1;
    excellentValue =
      priceNudgeSetting &&
      conditions.priceRange.extensively_used_min_excellent_price_nudge
        ? conditions.priceRange.extensively_used_min_excellent_price_nudge
        : conditions.priceRange.extensively_used_min_excellent;
  }
  if (listingPrice > expensiveValue) {
    return "Expensive";
  }

  if (listingPrice <= excellentValue) {
    return "Excellent";
  }
  return "Fair";
}
module.exports = ProductApis;
