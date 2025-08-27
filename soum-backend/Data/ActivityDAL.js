const activityModel = require('../models/ActivityModel');
const mongoose = require('mongoose');

async function CreateActivity(activity) {
    return await activityModel.create(activity);
}

async function GetAllActiveActivity() {
    const aggr = [
        {
            $match: { isActive: true }
        },
        { $lookup: { from: "products", localField: "productId", foreignField: "_id", as: "product" } },
        { $unwind: '$product' },
        { $lookup: { from: "users", localField: "creatorId", foreignField: "_id", as: "creator" } },
        { $unwind: '$creator' },
        { $lookup: { from: "users", localField: "product.user_id", foreignField: "_id", as: "seller" } },
        { $unwind: '$seller' },
        { $lookup: { from: "categories", localField: "product.category_id", foreignField: "_id", as: "category" } },
        { $unwind: "$category" },
        { $lookup: { from: "brands", localField: "product.brand_id", foreignField: "_id", as: "brand" } },
        { $unwind: "$brand" },
        { $lookup: { from: "device_models", localField: "product.model_id", foreignField: "_id", as: "model" } },
        { $unwind: "$model" },
        { $lookup: { from: "AskSeller", localField: "questionId", foreignField: "_id", as: "askSeller" } },
        { $unwind: "$askSeller" },
        { $lookup: { from: "users", localField: "askSeller.questioner_id", foreignField: "_id", as: "questioner" } },
        { $unwind: "$questioner" },
    ]
    return await activityModel.aggregate(aggr);
}

async function CloseActivity(ids) {

    return await activityModel.updateMany({
        _id: { $in: ids.map(x => mongoose.Types.ObjectId(x)) }
    }, { $set: { isActive: false } });
}
module.exports = {
    CreateActivity,
    CloseActivity,
    GetAllActiveActivity,
}
