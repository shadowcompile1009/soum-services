// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
export type PriceNudgingHistoryDocument = Document & {
  product: any;
  recommendedPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

const priceNudgingHistorySchema: Schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  recommendedPrice: { type: Number },
  status: {
    type: String,
    enum: ['Deleted', 'Active'],
    default: 'Active',
  },
  createdAt: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updatedAt: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const PriceNudgingHistory: Model<PriceNudgingHistoryDocument> =
  model<PriceNudgingHistoryDocument>(
    'PriceNudgingHistory',
    priceNudgingHistorySchema,
    'PriceNudgingHistory'
  );
