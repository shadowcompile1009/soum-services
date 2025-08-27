const mongoose = require('mongoose');
const ProductModel = require('../models/ProductModel');
const helper = require('../config/helper');
const { ProductSortBy } = require('../constants/product');
const { lookup, unwind } = require('../utils/queryHelper.js')

async function FilterProductByCategory(cateId, nameMatch, brandIds, modelIds, sizeList, price, grade, priceSortDirectoin, sortProp) {
    let currentDate = new Date().toISOString();
    let aggregate = [
        {
            $match: {
                status: 'Active',
                isApproved: true,
                category_id: mongoose.Types.ObjectId(cateId),
                sell_status: "Available",
                sell_price: { $gt: 0 },
                expiryDate: { $gte: new Date(currentDate) },
                // model_name: { $regex: nameMatch, $options: 'i' },
            }
        },
    ]

    if (brandIds && brandIds.length > 0) aggregate[0].$match.brand_id = { $in: brandIds.map(x => mongoose.Types.ObjectId(x)) };
    if (sizeList && sizeList.length > 0) aggregate[0].$match.varient = { $in: sizeList };
    if (nameMatch) aggregate[0].$match.model_name = { $regex: nameMatch, $options: 'i' };
    if (modelIds && modelIds.length > 0) aggregate[0].$match.model_id = { $in: modelIds.map(x => mongoose.Types.ObjectId(x)) };
    if (price) aggregate[0].$match.sell_price = { $gt: price.from, $lte: price.to };
    if (grade && grade.length > 0) {
        let mappedGrade = [];
        grade.map(function (item) {
            if (item.toLowerCase() == "excellent") {
                mappedGrade.push({ "score": { "$gte": 95 } })
            } else if (item.toLowerCase() == "great") {
                mappedGrade.push({ "score": { "$gte": 70, "$lt": 95 } })
            } else if (item.toLowerCase() == "good") {
                mappedGrade.push({ "score": { "$gte": 45, "$lt": 70 } })
            } else if (item.toLowerCase() == "usable") {
                mappedGrade.push({ "score": { "$gte": 30, "$lt": 45 } })
            } else if (item.toLowerCase() == "extensive") {
                mappedGrade.push({ "score": { "$gte": 0, "$lt": 30 } })
            }
        })
        aggregate[0].$match.$and = [{ $or: mappedGrade }];
    }
    aggregate = [
        ...aggregate,
        lookup("brands", "brand_id", "_id", "brands"),
        unwind("$brands"),
        lookup("device_models", "model_id", "_id", "models"),
        unwind("$models"),
        lookup("categories", "category_id", "_id", "category"),
        unwind("$category"),
        lookup("users", "user_id", "_id", "seller"),
        unwind("$seller"),
        { $sort: { sell_price: 1, current_bid_price: 1 } },
        {
            $group: {
                _id: { model_id: "$model_id" },
                product_id: { $first: '$_id' },
                category_id: { $first: '$category_id' },
                brand_id: { $first: '$brand_id' },
                model_id: { $first: '$model_id' },
                position: { $first: "$models.position" },
                brands_position: { $first: "$brands.position" },
                user_id: { $first: '$user_id' },
                varient: { $first: '$varient' },
                sell_price: { $first: "$sell_price" },
                bid_price: { $first: "$bid_price" },
                current_bid_price: { $first: "$current_bid_price" },
                score: { $first: "$score" },
                grade: { $first: "$grade" },
                grade_ar: { $first: "$grade_ar" },
                brand_name: { $first: "$brands.brand_name" },
                brand_name_ar: { $first: "$brands.brand_name_ar" },
                brand_icon: { $first: "$brands.brand_icon" },
                model_name: { $first: "$models.model_name" },
                model_name_ar: { $first: "$models.model_name_ar" },
                model_icon: { $first: "$models.model_icon" },
                current_price: { $first: "$models.current_price" },
                seller_id: { $first: "$seller._id" },

                // seller_mobileNumber: { $first: "$seller.mobileNumber" },
                seller_name: { $first: "$seller.name" },
                total: { $sum: 1 },
                code: { $first: "$code" },
                expiryDate: { $first: "$expiryDate" },
                isListedBefore: { $first: "$isListedBefore" },
                createdDate: { $first: "$createdDate" },
            }
        },
        // brands_position: 1, position: 1 was removed as munira wanted
        // { $sort: { "sell_price": priceSortDirectoin } }
    ]
    sortProp.forEach(elem => {
        if(elem == 'sellPrice')
            aggregate.push( { $sort: { "sell_price": priceSortDirectoin } });
        else if(elem == 'modelPosition')
            aggregate.push( { $sort: { "position":  1} });

    });
    return await ProductModel.aggregate(aggregate);
}

async function CreateNewProduct(productData) {
    return await ProductModel.create(productData);
}

async function GetDeepLoadProductById(prodId, userId) {
    let aggregate = getAggregateForProductFilter(null, null, null, null, null, -1);

    aggregate[0].$match._id = mongoose.Types.ObjectId(prodId);
    aggregate[0].$match.$or.push({ sell_status: "Locked" });
    let productList = await ProductModel.aggregate(aggregate);

    if (productList && productList.length > 0) {
        productList[0].isReportedByUser = false;
        if (userId && productList[0].reportedBy) {
            productList[0].reportedBy.forEach((report) => {
                if (report.userId === userId) {
                    productList[0].isReportedByUser = true;
                }
            })
        }
        productList[0].reportedBy = null;
        return productList[0];
    }

    return null;
}

function getAggregateForProductFilter(brandIds, modelIds, sizeList, price, grade, sort) {
    let aggregate = [{
        $match: {
            status: 'Active',
            isApproved: true,
            sell_price: { $gt: 0 },
            // category_id: mongoose.Types.ObjectId(cateId),
            //sell_status: "Available",
            $or: [{ sell_status: "Available" }],
        }
    }]

    // if (nameMatch) aggregate[0].$match.model_name = { $regex: nameMatch, $options: 'i' };
    if (brandIds && brandIds.length > 0) aggregate[0].$match.brand_id = { $in: brandIds.map(x => mongoose.Types.ObjectId(x)) };
    if (modelIds && modelIds.length > 0) aggregate[0].$match.model_id = { $in: modelIds.map(x => mongoose.Types.ObjectId(x)) };
    if (sizeList && sizeList.length > 0) aggregate[0].$match.varient = { $in: sizeList };
    if (price) aggregate[0].$match.sell_price = { $gt: price.from, $lte: price.to };
    if (grade && grade.length > 0) {
        let mappedGrade = [];
        grade.map(function (gradeItem) {
            if (gradeItem.toLowerCase() == "excellent") {
                mappedGrade.push({ "score": { "$gte": 95 } })
            } else if (gradeItem.toLowerCase() == "great") {
                mappedGrade.push({ "score": { "$gte": 70, "$lt": 95 } })
            } else if (gradeItem.toLowerCase() == "good") {
                mappedGrade.push({ "score": { "$gte": 45, "$lt": 70 } })
            } else if (gradeItem.toLowerCase() == "usable") {
                mappedGrade.push({ "score": { "$gte": 30, "$lt": 45 } })
            } else if (gradeItem.toLowerCase() == "extensive") {
                mappedGrade.push({ "score": { "$gte": 0, "$lt": 30 } })
            }
        })
        aggregate[0].$match.$and = [{ $or: mappedGrade }];
    }
    aggregate = [
        ...aggregate,
        lookup("categories", "category_id", "_id", "category"),
        unwind("$category"),
        lookup("brands", "brand_id", "_id", "brands"),
        unwind("$brands"),
        lookup("device_models", "model_id", "_id", "models"),
        unwind("$models"),
        lookup("varients", "varient_id", "_id", "varients"),
        unwind("$varients"),
        lookup("users", "user_id", "_id", "seller"),
        unwind("$seller"),
        {
            $project: {
                // _id: 0,
                product_id: '$_id',
                user_id: 1,
                category_id: 1,
                brand_id: 1,
                model_id: 1,
                varient_id: 1,
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
                grade_ar: 1,
                current_bid_price: 1,
                favourited_by: 1,
                code: 1,
                sell_status: 1,
                status: 1,
                expiryDate: 1,
                isListedBefore: 1,
                createdDate: 1,
                "category.category_name": 1,
                "category.category_name_ar": 1,
                "brands.brand_name": 1,
                "brands.brand_name_ar": 1,
                "brands.brand_icon": 1,
                "models.model_name": 1,
                "models.model_name_ar": 1,
                "models.model_icon": 1,
                "models.current_price": 1,
                "seller_id": "$seller._id",
                "seller_name": "$seller.name",
                // "seller_mobileNumber": "$seller.mobileNumber",
                "varients.varient": 1,
                "varients.current_price": 1,
                answer_to_questions_migration: 1,
                answer_to_questions_ar_migration: 1,
                reportedBy: 1,
            }
        }
    ]

    const productSortBy = ((productSort) => {
      switch (productSort) {
        case ProductSortBy.LOW_TO_HIGH: {
          return { sell_price: 1 };
        }
        case ProductSortBy.HIGH_TO_LOW: {
          return { sell_price: -1 };
        }
        case ProductSortBy.NEW_ARRIVALS: {
          return { createdDate: -1 };
        }
        default:
          return null;
      }
    })(sort);

    if (productSortBy) {
      aggregate.push({
        $sort: productSortBy,
      });
    }

    return aggregate;
}

async function FilterProductByCategoryDirect(userId, CategoryId, nameMatch, brandIds, modelIds, sizeList, price, grade, sort, limit, page) {
    let aggregate = getAggregateForProductFilter(brandIds, modelIds, sizeList, price, grade, sort);
    let currentDate = new Date().toISOString();
    aggregate[0].$match.category_id = mongoose.Types.ObjectId(CategoryId);
    aggregate[0].$match.expiryDate = { $gte: new Date(currentDate) };
    if (userId) {
        aggregate.push({
            $addFields: {
                "bidding": {
                    $filter: {
                        input: "$bidding",
                        as: "bidding",
                        cond: { $eq: ["$$bidding.user_id", mongoose.Types.ObjectId(userId)] }
                    }
                }
            }
        })
    }
    return await ProductModel.aggregate(aggregate).skip(page * limit).limit(limit);
}

async function FilterProductByModel(userId, ModelId, nameMatch, brandIds, modelIds, sizeList, price, grade, priceSortDirectoin) {
    let aggregate = getAggregateForProductFilter(brandIds, modelIds, sizeList, price, grade, priceSortDirectoin);

    let currentDate = new Date().toISOString();
    aggregate[0].$match.model_id = mongoose.Types.ObjectId(ModelId);
    aggregate[0].$match.expiryDate = { $gte: new Date(currentDate) };
    if (userId) {
        aggregate.push({
            $addFields: {
                "bidding": {
                    $filter: {
                        input: "$bidding",
                        as: "bidding",
                        cond: { $eq: ["$$bidding.user_id", mongoose.Types.ObjectId(userId)] }
                    }
                }
            }
        })
    }
    return await ProductModel.aggregate(aggregate);
}

async function FilterProductByUserId(user_id) {
    return await ProductModel.find(
        {   user_id: mongoose.Types.ObjectId(user_id),
            status: {$ne: "Delete"} 
        },
        { lean: true }
    );
}

async function GetLatestBid(productId, skip = 0, limit = 1) {
    var aggregate = [
        { $match: { _id: mongoose.Types.ObjectId(productId) } },
        { $project: { "bidding.bid_price": 1, "bidding.user_id": 1, "bidding.bid_id": 1, "bidding.transaction_id": 1, "bidding.payment_type": 1, "bidding.pay_bid_amount": 1, "bid_price": 1 } },
        { $unwind: "$bidding" },
        { $sort: { "bidding.bid_price": -1 } },
        { $skip: skip },
        { $limit: limit },
        {
            $project: {
                _id: 0,
                bidding: 1
            }
        }
    ]

    let biddingList = await ProductModel.aggregate(aggregate);
    if (biddingList && biddingList.length > 0) return biddingList[0]
    else return null;
}

async function UpdateProduct(productData) {
    await ProductModel.updateOne(
      { _id: productData._id },
      {
        $set: productData,
      }
    );
  
    return await ProductModel.updateOne(
      { _id: productData._id },
      {
        $unset: { search_sync: "" },
      }
    );
}

async function GetProductWithBid(productId, bidId) {
    return await ProductModel.findOne(
        { _id: mongoose.Types.ObjectId(productId), "bidding.bid_id": mongoose.Types.ObjectId(bidId) },
        { '_id': 0, user_id: 1, bidding: { $elemMatch: { bid_id: mongoose.Types.ObjectId(bidId) } } },
        { lean: true }
    );
}

async function RejectBid(productId, bidId) {
    const today = new Date();
    return await ProductModel.updateOne(
        { _id: mongoose.Types.ObjectId(productId), "bidding.bid_id": mongoose.Types.ObjectId(bidId) },
        { $set: { "bidding.$.bid_status": helper.bidStatus.REJECTED, 'bidding.$.reject_date': today } }
    );
}

async function SetProductBidAccepted(productId, bidId) {
    const today = new Date();
    return await ProductModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(productId), "bidding.bid_id": mongoose.Types.ObjectId(bidId) }
        , { $set: { "bidding.$.bid_status": helper.bidStatus.ACCEPTED, sell_status: "Locked", 'bidding.$.accept_date': today } })
}

async function GetFavList(userId) {
    var aggregate = [
        { "$match": { status: "Active", sell_status: "Available", isApproved: true, favourited_by: mongoose.Types.ObjectId(userId) } },
        lookup("categories", "category_id", "_id", "category"),
        unwind("$category"),
        lookup("brands", "brand_id", "_id", "brands"),
        unwind("$brands"),
        lookup("device_models", "model_id", "_id", "models"),
        unwind("$models"),
        lookup("users", "user_id", "_id", "seller"),
        unwind("$seller"),
        {
            $project: {
                product_id: '$_id',
                user_id: 1,
                category_id: 1,
                brand_id: 1,
                model_id: 1,
                varient: 1,
                sell_price: 1,
                bid_price: 1,
                product_images: 1,
                defected_images: 1,
                body_cracks: 1,
                description: 1,
                grade: 1,
                grade_ar: 1,
                score: 1,
                current_bid_price: 1,
                "brands.brand_name": 1,
                "brands.brand_name_ar": 1,
                "brands.brand_icon": 1,
                "models.model_name": 1,
                "models.model_name_ar": 1,
                "models.model_icon": 1,
                "models.current_price": 1,
                "seller_id": "$seller._id",
                "seller_name": "$seller.name",
            }
        }
    ];
    return await ProductModel.aggregate(aggregate);
}

async function GetFullProductById(productId) {
    return await ProductModel.findById(productId).lean();
}

async function GetProdToBeNotified() {
    const from = new Date();
    const today = new Date();
    from.setDate(from.getDate() - 1);
    console.log(from, today)
    let prods = await ProductModel.find({
        sell_status: "Available",
        status: 'Active',
        isApproved: true,
        $or: [{ isUserNotifiedForExpiry: false }, { isUserNotifiedForExpiry: null }],
        expiryDate: { $gte: from, $lte: today },
    })

    await ProductModel.updateMany({
        sell_status: "Available",
        status: 'Active',
        isApproved: true,
        $or: [{ isUserNotifiedForExpiry: false }, { isUserNotifiedForExpiry: null }],
        expiryDate: { $gte: from, $lte: today },
    }, { $set: { isUserNotifiedForExpiry: true } })

    return prods;
}

async function changeProductStatus(product_id, sell_status) {
    return await ProductModel.findOneAndUpdate({ _id: mongoose.Types.ObjectId(product_id) }, { $set: { "sell_status": sell_status } })
}

// this function is not in use and should be removed
async function UpdateProductAvailability() {
    const today = new Date();
    const expiryDate = new Date(today);
    expiryDate.setDate(expiryDate.getDate() - 30);

    return await ProductModel.updateMany({
        sell_status: "Available",
        status: 'Active',
        isApproved: true,
        $or: [{ isExpired: false, isExpired: null }],
        createdDate: { $lte: new Date(expiryDate) },
    }, { $set: { isExpired: true } });
}

async function UpdateExpiredProducts(arrOfProductsToBeRenewed, days) {
    let bulk = [];
    for (let i = 0; i < arrOfProductsToBeRenewed.length; i++) {
        var date = new Date();
        date.setDate(Number(new Date().getDate()) + Number(days));
        arrOfProductsToBeRenewed[i].expiryDate = date;
        if (arrOfProductsToBeRenewed[i].actionDates) {
            arrOfProductsToBeRenewed[i].actionDates.push({ 'createdDate': new Date(), 'expiryDate': date });
        } else {
            arrOfProductsToBeRenewed[i].actionDates = [{ 'createdDate': new Date(), 'expiryDate': date }];
        }

        bulk.push(
            {
                updateOne: {
                    filter: {
                        _id: arrOfProductsToBeRenewed[i]._id
                    },
                    update: {
                        $set: { expiryDate: arrOfProductsToBeRenewed[i].expiryDate, actionDates: arrOfProductsToBeRenewed[i].actionDates, updatedDate: new Date() },
                        $unset: { search_sync : "" }
                    }
                },
            },
        );
    }
    return await ProductModel.bulkWrite(bulk);
}

async function GetUserSellProduct(userId) {

    var aggr = [
        {
            $match: {
                user_id: userId,
                status: "Active",
                $or: [
                    { sell_status: "Locked" },
                    { sell_status: "Available" },
                    { sell_status: "Draft" }
                ]
            }
        },
        lookup("categories", "category_id", "_id", "category_id"),
        unwind("$category_id"),
        lookup("brands", "brand_id", "_id", "brand_id"),
        unwind("$brand_id"),
        lookup("device_models", "model_id", "_id", "model_id"),
        unwind("$model_id"),
        lookup("varients", "varient_id", "_id", "varient_id"),
        unwind("$varient_id"),
        lookup("promocodes", "promocode", "_id", "promocode"),
        {
            $project: {
                _id: 1,
                user_id: 1,
                category_id: 1,
                brand_id: 1,
                model_id: 1,
                varient_id: 1,
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
                grade_ar: 1,
                current_bid_price: 1,
                sell_status: 1,
                save_as_draft_step: 1,
                createdDate: 1,
                expiryDate: 1,
                promocode: 1,
                bidding: { $slice: ["$bidding", -1] },
            }
        }
    ]

    return await ProductModel.aggregate(aggr)
}

async function GetLastProduct(userId) {

    let result = await ProductModel.find({
        user_id: userId,
        status: "Active",
        sell_status: { $ne: "Sold" },
    }).sort({ "createdDate": -1 }).limit(1)

    return result
}

async function ListProductsForAdmin(page, limit, mobileNumber, productTypes) {

    let aggr = [
        {
            $match: {
                status: { $ne: "Delete" }
            }
        },
        lookup("categories", "category_id", "_id", "categoryData"),
        unwind("$categoryData"),
        lookup("brands", "brand_id", "_id", "brandData"),
        unwind("$brandData"),
        lookup("device_models", "model_id", "_id", "modelData"),
        unwind("$modelData"),
        lookup("users", "user_id", "_id", "sellerData"),
        unwind("$sellerData"),
        {
            $project: {
                "_id": 1,
                "product_id": "$_id",
                "categoryData._id": 1,
                "createdDate": 1,
                "expiryDate": 1,
                "categoryData.category_id": "$categoryData._id",
                "categoryData.category_name": 1,
                "brandData._id": 1,
                "brandData.brand_id": "$brandData._id",
                "brandData.brand_name": 1,
                "modelData._id": 1,
                "modelData.model_id": "$modelData._id",
                "modelData.model_name": 1,
                "modelData.current_price": 1,
                "sellerData._id": 1,
                "sellerData.user_id": "$sellerData._id",
                "sellerData.name": 1,
                "sellerData.mobileNumber": 1,
                "bid_price": 1,
                "sell_price": 1,
                "current_bid_price": 1,
                "varient": 1,
                "status": 1,
                "isApproved": 1,
                "product_images": 1,
                "defected_images": 1,
                "bidding": 1,
                "sell_status": 1
            }
        },
    ];

    if (mobileNumber) {
        mobileNumber = mobileNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const orArray = [
            { 'modelData.model_name': { $regex: new RegExp(`^${mobileNumber}$`, 'gi') }},
        ];
        const splitNumberArray = mobileNumber.split(/[ -]+/g);
        const phoneNumber = splitNumberArray.slice(-1)[0];
        // Try to search phone number when at least 5 chars in length
        // When searching model 'iphone 12' 12 is not used to search for phone number
        if (phoneNumber && phoneNumber.length >= 5) {
            orArray.push({ 'sellerData.mobileNumber': { $regex: new RegExp(`.*${phoneNumber}.*`, 'gi') }});
        }

        if (mongoose.isValidObjectId(mobileNumber)) {
            orArray.push({ _id: mongoose.Types.ObjectId(mobileNumber) });
        }

        aggr.push({ $match: {
            $or: orArray
        }});
    }

    let allResults = await ProductModel.aggregate(aggr);
    if (productTypes.length > 0) {
        let Ors = [];
        let currentDate = new Date().toISOString();
        for (const productType of productTypes) {
            if (productType == 'Sold') {
                Ors.push({ sell_status: { $eq: 'Sold' } });
            }
            if (productType == 'Available') {
                Ors.push({ sell_status: { $eq: 'Available' }, expiryDate: { $gte: new Date(currentDate) } });
            }
            if (productType == 'Locked') {
                Ors.push({ sell_status: { $eq: 'Locked' } });
            }
            if (productType == 'Expired') {
                Ors.push({ sell_status: { $eq: 'Available' }, expiryDate: { $lt: new Date(currentDate) } });
            }
            if (productType == 'Refunded') {
                Ors.push({ sell_status: { $eq: 'Refunded' }});
            }
        }
        aggr.push({ $match: { $or: Ors } });
    }

    let total = await ProductModel.aggregate(aggr.concat([{ $count: "rCount" }]))

    aggr = aggr.concat([
        { $skip: (page - 1) * limit },
        { $limit: limit }
    ])

    let docs = await ProductModel.aggregate(aggr)
    return { total: total[0] ? total[0].rCount : 0, docs, limit, allResults }
}

// This function is created for optimization purposes. Old function avobe is being used multiple places so didn't remove it
async function ListProductsForAdminNew(page, limit, mobileNumber, productTypes) {
    let matchCondition = {
        status: { $ne: "Delete" }
    };

    let aggr = [
        {
            $match: matchCondition
        },
        lookup("categories", "category_id", "_id", "categoryData"),
        unwind("$categoryData"),
        lookup("brands", "brand_id", "_id", "brandData"),
        unwind("$brandData"),
        lookup("device_models", "model_id", "_id", "modelData"),
        unwind("$modelData"),
        lookup("users", "user_id", "_id", "sellerData"),
        unwind("$sellerData"),
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
            $project: {
                "_id": 1,
                "product_id": "$_id",
                "categoryData._id": 1,
                "createdDate": 1,
                "expiryDate": 1,
                "categoryData.category_id": "$categoryData._id",
                "categoryData.category_name": 1,
                "brandData._id": 1,
                "brandData.brand_id": "$brandData._id",
                "brandData.brand_name": 1,
                "modelData._id": 1,
                "modelData.model_id": "$modelData._id",
                "modelData.model_name": 1,
                "modelData.current_price": 1,
                "sellerData._id": 1,
                "sellerData.user_id": "$sellerData._id",
                "sellerData.name": 1,
                "sellerData.mobileNumber": 1,
                "bid_price": 1,
                "sell_price": 1,
                "current_bid_price": 1,
                "varient": 1,
                "status": 1,
                "isApproved": 1,
                "product_images": 1,
                "defected_images": 1,
                "bidding": 1,
                "sell_status": 1,
                "isBiddingProduct": 1
            }
        },
    ];

    if (mobileNumber) {
        mobileNumber = mobileNumber.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const orArray = [
            { 'modelData.model_name': { $regex: new RegExp(`^${mobileNumber}$`, 'gi') }},
        ];
        const splitNumberArray = mobileNumber.split(/[ -]+/g);
        const phoneNumber = splitNumberArray.slice(-1)[0];
        // Try to search phone number when at least 5 chars in length
        // When searching model 'iphone 12' 12 is not used to search for phone number
        if (phoneNumber && phoneNumber.length >= 5) {
            orArray.push({ 'sellerData.mobileNumber': { $regex: new RegExp(`.*${phoneNumber}.*`, 'gi') }});
            // orArray.push({ 'sellerData.mobileNumber': { $regex: `.*${phoneNumber}.*`, $options:'i' }});
        }

        if (mongoose.isValidObjectId(mobileNumber)) {
            orArray.push({ _id: mongoose.Types.ObjectId(mobileNumber) });
        }
        matchCondition = {
            $or: orArray,
        };

        aggr.push({ $match: {
            $or: orArray
        }});
    }

    if (productTypes.length > 0) {
        let Ors = [];
        let currentDate = new Date().toISOString();
        for (const productType of productTypes) {
            if (productType == 'Sold') {
                Ors.push({ sell_status: { $eq: 'Sold' } });
            }
            if (productType == 'Available') {
                Ors.push({ sell_status: { $eq: 'Available' }, expiryDate: { $gte: new Date(currentDate) } });
            }
            if (productType == 'Locked') {
                Ors.push({ sell_status: { $eq: 'Locked' } });
            }
            if (productType == 'Expired') {
                Ors.push({ sell_status: { $eq: 'Available' }, expiryDate: { $lt: new Date(currentDate) } });
            }
            if (productType == 'Refunded') {
                Ors.push({ sell_status: { $eq: 'Refunded' }});
            }
        }
        aggr.push({ $match: { $or: Ors } });
        matchCondition = { $or: Ors };
    }

    
    let docs = await ProductModel.aggregate(aggr)
    if (docs.length > 0) {
        docs.map(async function (item) {
          if(item.expiryDate < new Date().toISOString() && item.sell_status == 'Available'){
            item.sell_status = 'Expired';
          }
          item.listingType = 'Direct';
          if(item.isBiddingProduct){
            item.listingType = 'Bid';
          }
        })
      }
    const count = await ProductModel.estimatedDocumentCount(matchCondition).exec();

    return { total: count, docs, limit }
}

async function getProductByUserId(productId, userId) {
    return await ProductModel.exists({
        _id: mongoose.Types.ObjectId(productId),
        user_id: mongoose.Types.ObjectId(userId)
    })
}
// Admin extract
async function GetAllBids(date) {
    var aggr = [
        {
            $unwind: "$bidding"
        },
        // {
        //     $match : {
        //         'bidding.bid_date' : {
        //             $gte : date.toISOString()
        //         }
        //     }
        // },
        { $lookup: { from: "users", localField: "bidding.user_id", foreignField: "_id", as: "buyer" } },
        { $unwind: '$buyer' },
        {
            $project: {
                _id: 0,
                buyer_name: 1,
                productId: "$_id",
                biddId: "$bidding.bid_id",
                buyer_name: '$buyer.name',
                buyer_mobile: '$buyer.mobileNumber',
                pay_bid_amount: "$bidding.pay_bid_amount",
                payment_type: "$bidding.payment_type",
                remaining_bid_amount: "$bidding.remaining_bid_amount",
                grand_total: "$bidding.grand_total",
                vat: "$bidding.vat",
                commission: "$bidding.commission",
                shipping_charge: "$bidding.shipping_charge",
                bid_amount: "$bidding.buy_amount",
                bid_status: "$bidding.bid_status",
                transaction_status: "$bidding.transaction_status",
                payment_take: "$bidding.payment_take",
                bid_date: "$bidding.bid_date",
                order_number: "$bidding.order_number",
                buynow_price: "$sell_price",
            }
        }
    ];
    return await ProductModel.aggregate(aggr)
}

async function GetAllProduct(date) {
    var aggrProd = [
        // {
        //     $match : {
        //         'createdDate' : {
        //             $gte : date
        //         }
        //     }
        // },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "user" } },
        { $unwind: "$user" },
        { $lookup: { from: "device_models", localField: "model_id", foreignField: "_id", as: "model" } },
        { $unwind: "$model" },
        {
            $project: {
                userPhone: '$user.name',
                mobileNumber: '$user.mobileNumber',
                modelName: "$model.model_name",
                user_id: 1,
                category_id: 1,
                brand_id: 1,
                model_id: 1,
                varient: 1,
                sell_price: 1,
                bid_price: 1,
                description: 1,
                grade: 1,
                grade_ar: 1,
                score: 1,
                current_bid_price: 1,
                status: 1,
                sell_status: 1,
                isApproved: 1,
                isExpired: 1,
                expiryDate: 1,
                updatedDate: 1,
                createdDate: 1,
                deletedDate: 1,
                actionDates: 1,
                deletedBy: 1
            }
        },
        { $sort: { createdDate: -1 } }
    ]
    let products = await ProductModel.aggregate(aggrProd).allowDiskUse(true);;
    //get max length of actionDates
    let maxActionDates = 0;
    for (let index = 0; index < products.length; index++) {
        const element = products[index];
        if (element.actionDates) {
            if (element.actionDates.length > maxActionDates) {
                maxActionDates = element.actionDates.length;
            }
        }
    }

    for (let index = 0; index < products.length; index++) {
        const element = products[index];

        for (let i = 0; i < maxActionDates; i++) {
            let num = Number(i) + 1;
            element['(' + num + ') Created Date'] = " ";
            element['(' + num + ') Expiry Date'] = " ";
        }

        if (element.actionDates && element.actionDates.length > 0) {
            for (let index2 = 0; index2 < element.actionDates.length; index2++) {
                let num = Number(index2) + 1;
                element['(' + num + ') Created Date'] = (element.actionDates[index2].createdDate).toISOString();
                element['(' + num + ') Expiry Date'] = (element.actionDates[index2].expiryDate).toISOString();
            }
        }
        delete element.actionDates;
    }
    return products;
}

async function ExpireOutDatedBidding(arrOfBids) {

    let bulk = [];
    var saveobj = { "bidding.$.bid_status": helper.bidStatus.EXPIRED};

    for (let i = 0; i < arrOfBids.length; i++) {
        bulk.push(
            {
                updateOne: {
                    filter: {
                        _id: mongoose.Types.ObjectId(arrOfBids[i].productId.toString()),
                        "bidding.bid_id": mongoose.Types.ObjectId(arrOfBids[i]._id.toString())
                    },
                    update: { $set: saveobj }
                },
            },
        );
    }
    console.log(bulk);
    return await ProductModel.bulkWrite(bulk);
}

// start to fix on bug SGSE-596
async function GetPromoSellerUsageCountFromProduct(promoId) {
    let aggrProd = [
        { "$match": {
            promocode: new mongoose.Types.ObjectId(promoId),
            $or: [{'sell_status': 'Sold'}, {'sell_status': 'Available'}] 
          } 
        },
        {
          $group: {
            _id: "$promocode",
            count: { $sum: 1 },
          }
        },
        {
          $project: {
              numberOfUse: "$count"
          }
        }
      ];
    let dataCount = await ProductModel.aggregate(aggrProd);
    let numberOfSellerPromoCodeUsage = 0;
    if ((dataCount || []).length > 0) {
        numberOfSellerPromoCodeUsage = dataCount[0].numberOfUse;
    }
    return numberOfSellerPromoCodeUsage;
}
// end 

async function getFullProductDetail(productId) {
    let aggr = [
        {
            $match: {
                _id: mongoose.Types.ObjectId(productId),
                status: 'Active',
                isApproved: true,
                sell_price: { $gt: 0 },
                $and: [
                    {
                        $or: [{ sell_status: 'Available' }, { sell_status: 'Locked' }],
                    },
                    { $or: [{ isPriceUpdating: false }, { isPriceUpdating: null }] },
                ],
            },
        },
        lookup('brands', 'brand_id', '_id', 'brands'),
        unwind('$brands'),
        lookup('varients', 'varient_id', '_id', 'varients'),
        unwind('$varients'),
        lookup('device_models', 'model_id', '_id', 'models'),
        unwind('$models'),
        lookup('categories', 'category_id', '_id', 'category'),
        unwind('$category'),
        lookup('users', 'user_id', '_id', 'seller'),
        unwind('$seller'),
        {
            $project: {
                product_id: '$_id',
                user_id: 1,
                brand_id: 1,
                model_id: 1,
                varient_id: 1,
                varient: 1,
                sell_price: 1,
                product_images: 1,
                defected_images: 1,
                bid_price: 1,
                code: 1,
                sell_status: 1,
                body_cracks: 1,
                description: 1,
                answer_to_questions: 1,
                expiryDate: 1,
                isListedBefore: 1,
                answer_to_questions_ar: 1,
                score: 1,
                grade: 1,
                grade_ar: 1,
                current_bid_price: 1,
                favourited_by: 1,
                status: 1,
                createdDate: 1,
                category_id: 1,
                'category.category_name': 1,
                'category.category_name_ar': 1,
                'models.model_name': 1,
                'models.model_name_ar': 1,
                'models.model_icon': 1,
                'brands.brand_name': 1,
                'brands.brand_name_ar': 1,
                'brands.brand_icon': 1,
                'models.current_price': 1,
                seller_id: '$seller._id',
                seller_name: '$seller.name',
                'varients.varient': 1,
                'varients.current_price': 1,
                answer_to_questions_migration: 1,
                answer_to_questions_ar_migration: 1,
                attributes: 1,
                conditions: 1,
            },
        },
    ];
    let data = await ProductModel.aggregate(aggr);
    return data;
}

module.exports = {
    UpdateProductAvailability,
    FilterProductByCategory,
    GetDeepLoadProductById,
    SetProductBidAccepted,
    ListProductsForAdmin,
    ListProductsForAdminNew,
    FilterProductByModel,
    FilterProductByCategoryDirect,
    changeProductStatus,
    GetUserSellProduct,
    GetFullProductById,
    GetProductWithBid,
    CreateNewProduct,
    GetLastProduct,
    UpdateProduct,
    GetAllProduct,
    ExpireOutDatedBidding,
    GetLatestBid,
    GetFavList,
    GetAllBids,
    RejectBid,
    UpdateExpiredProducts,
    GetProdToBeNotified,
    getProductByUserId,
    GetPromoSellerUsageCountFromProduct,
    FilterProductByUserId,
    getFullProductDetail
}
