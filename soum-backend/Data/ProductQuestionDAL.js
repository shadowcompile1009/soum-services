const ProductQuestionModel = require('../models/ProductQuestionModel');
const mongoose = require('mongoose')

async function AddNewQuestion(quesData) {
    return await ProductQuestionModel.create(quesData);
}

async function QetProductQuestion(productId, questionId) {
    return await ProductQuestionModel.findOne({ _id: mongoose.Types.ObjectId(questionId), product_id: mongoose.Types.ObjectId(productId) });
}

async function UpdateProductQuestion(questionData) {
    return await ProductQuestionModel.updateOne({ _id: questionData._id }, questionData);
}

async function QetProductQuestions(productId) {
    return await ProductQuestionModel.find({ product_id: mongoose.Types.ObjectId(productId), status: 'Active' }, {
        question: 1,
        answer: 1,
        status: 1,
        user_id: 1,
        created_at: 1
    })
        .lean()
        .populate('user_id', '_id name profilePic');
}

async function InActiveQuestion(questionId) {
    return await ProductQuestionModel.updateOne({ _id: mongoose.Types.ObjectId(questionId) }, { $set: { status: 'InActive' } });
}

async function listComments(page, limit) {
    let aggr = [];

    let total = await ProductQuestionModel.aggregate(aggr.concat([{ $count: "rCount" }])).allowDiskUse(true);

    aggr = aggr.concat([
        { $skip: (page - 1) * limit },
        { $limit: limit },
        { $lookup: { from: "users", localField: "user_id", foreignField: "_id", as: "buyer" } },
        { $unwind: '$buyer' },
        { $lookup: { from: "products", localField: "product_id", foreignField: "_id", as: "product" } },
        { $unwind: '$product' },
        { $lookup: { from: "users", localField: "product.user_id", foreignField: "_id", as: "seller" } },
        { $unwind: '$seller' },
        {
            $sort: {
                created_at: -1 //Sort by Date DESC
            }
        },
        {
            $project: {
                _id: 1,
                product_id: 1,
                question: 1,
                answer: 1,
                status: 1,
                created_at: 1,
                'buyer._id': 1,
                'buyer.name': 1,
                'buyer.mobileNumber': 1,
                'seller._id': 1,
                'seller.name': 1,
                'seller.mobileNumber': 1
            }
        }

    ])
    let docs = await ProductQuestionModel.aggregate(aggr);
    return { totalDocs: total[0].rCount, docs, limit }
}
module.exports = {
    AddNewQuestion,
    QetProductQuestion,
    UpdateProductQuestion,
    QetProductQuestions,
    InActiveQuestion,
    listComments
}