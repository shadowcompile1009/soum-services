// @ts-nocheck
import { model, Schema } from 'mongoose';

const subscriptionSchema = new Schema({
  creatorId: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
  userId: { type: Schema.Types.ObjectId, required: false, ref: 'user' },
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
  questionId: {
    type: Schema.Types.ObjectId,
    required: false,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const Subscription = model(
  'subscription',
  subscriptionSchema,
  'subscriptions'
);
