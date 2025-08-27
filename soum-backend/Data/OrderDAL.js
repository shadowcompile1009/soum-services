const mongoose = require("mongoose");
const OrderModel = require("../models/OrderModel");

async function CreateNewOrder(order) {
  return await OrderModel.create(order);
}

async function GetAllOrdersForAdminListing(page, limit, searchValue, filter) {
  let orQuery = [];
  if (searchValue) {
    orQuery.push({ order_number: { $regex: searchValue } });
    if (mongoose.Types.ObjectId.isValid(searchValue)) {
      orQuery = orQuery.concat([
        { product: mongoose.Types.ObjectId(searchValue) },
        { seller: mongoose.Types.ObjectId(searchValue) },
        { buyer: mongoose.Types.ObjectId(searchValue) },
      ]);
    }
  }
  if (filter) {
    orQuery = orQuery.concat([
      { dispute: filter },
      { transaction_status: filter },
    ]);
  }
  const query = orQuery.length > 0 ? { $or: orQuery } : {};
  let orderList = await OrderModel.paginate(query, {
    offset: (page - 1) * limit,
    limit: limit,
    lean: true,
    sort: { created_at: -1 },
    populate: [
      {
        path: "product",
        select: ["_id", "varient_id", "brand_id", "category_id", "model_id"],
        populate: [
          { path: "varient_id", select: ["_id", "varient"] },
          { path: "model_id", select: ["_id", "model_name"] },
          { path: "category_id", select: ["_id", "category_name"] },
          { path: "brand_id", select: ["_id", "brand_name"] },
        ],
      },
      { path: "seller", select: ["_id", "name", "mobileNumber"] },
      { path: "buyer", select: ["_id", "name", "mobileNumber"] },
    ],
    select: [
      "_id",
      "order_number",
      "product",
      "seller",
      "buyer",
      "grand_total",
      "status",
      "created_at",
      "delivery_time",
      "commission",
      "dispute",
      "buy_amount",
      "buy_type",
      "shipping_charge",
      "transaction_id",
      "transaction_status",
      "sourcePlatform",
      "paymentReceivedFromBuyer",
      "paymentMadeToSeller",
      "payment_type",
      "dispute",
      "transaction_detail",
      "order_refund_status",
      "last_payout",
      "down_payment_details",
    ],
  });
  return {
    total: orderList ? orderList.totalDocs : 0,
    docs: orderList.docs,
    limit,
  };
}

async function GetPromoSellerUsageCount(promoId) {
  let orders = await OrderModel.find({ "promos.sellerPromocodeId": promoId });
  return orders.length;
}

async function GetPromoBuyerUsageCount(promoId) {
  let orders = await OrderModel.find({
    "promos.buyerPromocodeId": promoId,
    transaction_status: "Success",
  });
  return orders.length;
}

async function getUserOrderWithPromo(promoId, userId) {
  const order = await OrderModel.findOne({
    buyer: mongoose.Types.ObjectId(userId),
    "promos.buyerPromocodeId": promoId,
    transaction_status: "Success",
  });
  return order;
}

async function GetAllRuinedOrders() {
  var aggregate = [
    {
      $match: {
        transaction_status: { $ne: "Success" },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    {
      $lookup: {
        from: "device_models",
        localField: "product.model_id",
        foreignField: "_id",
        as: "model",
      },
    },
    { $unwind: "$model" },
    {
      $project: {
        _id: 0,
        order_id: "$_id",
        seller_city: "$seller.address.city",
        seller_id: "$seller._id",
        seller_name: "$seller.name",
        seller_countryCode: "$seller.countryCode",
        seller_mobile: "$seller.mobileNumber",
        buyer_id: "$buyer._id",
        buyer_name: "$buyer.name",
        buyer_countryCode: "$buyer.countryCode",
        buyer_mobile: "$buyer.mobileNumber",
        buyer_city: "$buyer.address.city",
        product_id: "$product._id",
        product_sell_price: "$product.sell_price",
        product_name: "$model.model_name",
        transaction_detail: 1,
        buy_amount: 1,
        grand_total: 1,
        promos: 1,
        created_at: 1,
        updated_at: 1,
      },
    },
  ];
  return await OrderModel.aggregate(aggregate);
}

async function GetFinishedOrders() {
  var aggregate = [
    {
      $match: {
        transaction_status: "Success",
        dispute: "No",
        // 'status': 'Delivered',
        paymentMadeToSeller: "No",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    {
      $project: {
        _id: 1,
        "seller._id": 1,
        "seller.name": 1,
        "seller.countryCode": 1,
        "seller.mobileNumber": 1,
        "buyer._id": 1,
        "buyer.name": 1,
        "buyer.countryCode": 1,
        "buyer.mobileNumber": 1,
        "product._id": 1,
        "product.sell_price": 1,
        order_number: 1,
        payment_type: 1,
        created_at: 1,
      },
    },
  ];
  return await OrderModel.aggregate(aggregate);
}

async function GetByIds(orders_Ids) {
  var aggregate = [
    {
      $match: {
        _id: { $in: orders_Ids.map((x) => mongoose.Types.ObjectId(x)) },
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    // {
    //     $project: {
    //         _id: 1,
    //         'seller._id': 1,
    //         'seller.name': 1,
    //         'seller.countryCode': 1,
    //         'seller.mobileNumber': 1,
    //         'seller.bankDetail' : 1,
    //         'seller.address' :1,
    //         'buyer._id': 1,
    //         'buyer.name': 1,
    //         'buyer.countryCode': 1,
    //         'buyer.mobileNumber': 1,
    //         'product._id': 1,
    //         'product.pick_up_address': 1,
    //         'product.sell_price': 1,
    //         'order_number': 1,
    //         'payment_type': 1,
    //         'created_at': 1,
    //     }
    // }
  ];
  return await OrderModel.aggregate(aggregate);
}

async function GetById(id) {
  var aggregate = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    // {
    //     $project: {
    //         _id: 1,
    //         'seller._id': 1,
    //         'seller.name': 1,
    //         'seller.countryCode': 1,
    //         'seller.mobileNumber': 1,
    //         'seller.bankDetail' : 1,
    //         'seller.address' :1,
    //         'buyer._id': 1,
    //         'buyer.name': 1,
    //         'buyer.countryCode': 1,
    //         'buyer.mobileNumber': 1,
    //         'product._id': 1,
    //         'product.pick_up_address': 1,
    //         'product.sell_price': 1,
    //         'order_number': 1,
    //         'payment_type': 1,
    //         'created_at': 1,
    //     }
    // }
  ];
  let orders = await OrderModel.aggregate(aggregate);

  if (orders && orders.length) return orders[0];
  else return null;
}

async function GetPayOutInfo(id) {
  var aggregate = [
    {
      $match: {
        _id: mongoose.Types.ObjectId(id),
      },
    },
    // { $lookup: { from: "products", localField: "product", foreignField: "_id", as: "product" } },
    // { $unwind: '$product' },
    // { $lookup: { from: "users", localField: "seller", foreignField: "_id", as: "seller" } },
    // { $unwind: '$seller' },
    // { $lookup: { from: "users", localField: "buyer", foreignField: "_id", as: "buyer" } },
    // { $unwind: '$buyer' },
    {
      $addFields: {
        isReadyToPayout: {
          $cond: {
            if: {
              $and: [
                { $eq: ["$transaction_status", "Success"] },
                { $eq: ["$dispute", "No"] },
                { $eq: ["$paymentMadeToSeller", "No"] },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        buy_amount: 1,
        commission_percentage: 1,
        isReadyToPayout: 1,
      },
    },
  ];
  let orders = await OrderModel.aggregate(aggregate);

  if (orders && orders.length) return orders[0];
  else return null;
}

async function MarkAllAsNotified(userId) {
  return await OrderModel.updateMany(
    {
      $or: [
        { buyer: mongoose.Types.ObjectId(userId) },
        { seller: mongoose.Types.ObjectId(userId) },
      ],
    },
    { $set: { isUserNotified: true } }
  );
}
// Admin export
async function GetAllOrders(date) {
  var aggrOrder = [
    // {
    //     $match : {
    //         'created_at' : {
    //             $gte : new Date('2021-08-01T00:00:00')
    //         }
    //     }
    // },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
      },
    },
    { $unwind: "$seller" },
    {
      $lookup: {
        from: "users",
        localField: "buyer",
        foreignField: "_id",
        as: "buyer",
      },
    },
    { $unwind: "$buyer" },
    {
      $lookup: {
        from: "device_models",
        localField: "product.model_id",
        foreignField: "_id",
        as: "model",
      },
    },
    { $unwind: "$model" },
    {
      $project: {
        _id: 0,
        order_id: "$_id",
        product_id: "$product._id",
        buyer_name: "$buyer.name",
        buyer_mobile: "$buyer.mobileNumber",
        buyer_city: "$buyer.address.city",
        seller_name: "$seller.name",
        seller_mobile: "$seller.mobileNumber",
        seller_city: "$seller.address.city",
        buy_amount: 1,
        shipping_charge: 1,
        vat: 1,
        commission: 1,
        grand_total: 1,
        checkout_id: 1,
        order_number: 1,
        payment_type: 1,
        transaction_id: 1,
        return_reason: 1,
        dispute_comment: 1,
        dispute_validity: 1,
        transaction_detail: 1,
        transaction_time_stamp: "",
        buy_amount: 1,
        split_payout_detail: 1,
        transaction_status: 1,
        paymentReceivedFromBuyer: 1,
        paymentMadeToSeller: 1,
        buy_type: 1,
        dispute: 1,
        status: 1,
        created_at: 1,
        sourcePlatform: 1,
        promos: 1,
        product_sell_price: "$product.sell_price",
        product_name: "$model.model_name",
      },
    },
  ];
  return OrderModel.aggregate(aggrOrder);
}

async function GetLastOrder(productId) {
  const agg = [
    {
      $match: {
        product: mongoose.Types.ObjectId(productId),
      },
    },
    {
      $sort: { created_at: -1 },
    },
    {
      $limit: 1,
    },
  ];
  const orders = await OrderModel.aggregate(agg);
  return orders.length > 0 ? orders[0] : null;
}

async function GetSuccessOrder(productId) {
  const order = await OrderModel.findOne({
    product: mongoose.Types.ObjectId(productId),
    transaction_status: "Success",
  });
  return order;
}

async function CheckSoldProduct(productId) {
  const agg = [
    {
      $match: {
        product: mongoose.Types.ObjectId(productId),
        transaction_status: "Success",
      },
    },
  ];
  return await OrderModel.aggregate(agg);
}

module.exports = {
  GetAllOrdersForAdminListing,
  MarkAllAsNotified,
  GetFinishedOrders,
  GetAllRuinedOrders,
  CreateNewOrder,
  GetPayOutInfo,
  GetAllOrders,
  GetByIds,
  GetById,
  GetPromoSellerUsageCount,
  GetPromoBuyerUsageCount,
  GetLastOrder,
  CheckSoldProduct,
  getUserOrderWithPromo,
  GetSuccessOrder,
};
