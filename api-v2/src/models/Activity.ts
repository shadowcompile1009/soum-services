// @ts-nocheck
import { model, Schema } from 'mongoose';

const activitySchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
  productId: { type: Schema.Types.ObjectId, required: false, ref: 'Product' },
  activityType: {
    type: String,
    enum: [
      'BuyerBidAccepted',
      'Bidding',
      'AnswerQuestion',
      'AskQuestion',
      'ProductExpired',
      'BuyerBidRejected',
      'BuyerPaymentCompleted',
    ],
  },
  bidValue: { type: Number, default: 0 },
  questionId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'product_questions',
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
});

export const Activity = model('activity', activitySchema, 'activities');
