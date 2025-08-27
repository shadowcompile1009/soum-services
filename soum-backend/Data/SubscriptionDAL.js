const subscriptionModel = require('../models/SubscriptionModel');
const mongoose = require('mongoose');

async function CreateSubscribtion(subscription) {
    return await subscriptionModel.create(subscription);
}

async function GetByProdId(prodId, activityType, questionId) {
    const aggre = [
        {
            $match: { productId: mongoose.Types.ObjectId(prodId), isActive: true, activityType }
        },
        { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "subscription" } },
        { $unwind: '$subscription' },
    ]

    if(questionId)
        aggre[0].$match.questionId = mongoose.Types.ObjectId(questionId);

    return await subscriptionModel.aggregate(aggre);
}

async function CloseSubscription(ids) {

    return await subscriptionModel.updateMany({
        _id: { $in: ids.map(x => mongoose.Types.ObjectId(x)) }
    }, { $set: { isActive: false } });
}

async function DeactivateOthersSubscribtion(prodId, activityType) {
    return await subscriptionModel.updateMany({
        productId: mongoose.Types.ObjectId(prodId), isActive: true, activityType
    }, { $set: { isActive: false } });
}
module.exports = {
    GetByProdId,
    CloseSubscription,
    CreateSubscribtion,
    DeactivateOthersSubscribtion,
}
