const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');


const subscriptionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: false, ref: "user" },
    productId: { type: Schema.Types.ObjectId, required: false, ref: "Product" },
    activityType : { type: String,  enum: ['BuyerBidAccepted', 'Bidding', 'AnswerQuestion', 'AskQuestion', 'ProductExpired', "BuyerBidRejected", "BuyerPaymentCompleted"]},
    questionId : { type: Schema.Types.ObjectId, required: false, ref: "product_questions" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() }
})

subscriptionSchema.plugin(mongoosePaginate);

const subscriptionModel = mongoose.model('subscription', subscriptionSchema, 'subscriptions')
module.exports = subscriptionModel;