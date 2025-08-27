const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    creatorId: { type: Schema.Types.ObjectId, required: false, ref: "user" },
    productId: { type: Schema.Types.ObjectId, required: false, ref: "Product" },
    activityType: { type: String, enum: ['BuyerBidAccepted', 'Bidding', 'AnswerQuestion', 'AskQuestion', 'ProductExpired', "BuyerBidRejected", "BuyerPaymentCompleted"] },
    bidValue: { type: Number, default: 0 },
    questionId : { type: Schema.Types.ObjectId, required: false, ref: "product_questions" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
})

const activityModel = mongoose.model('activity', activitySchema, 'activities')
module.exports = activityModel;