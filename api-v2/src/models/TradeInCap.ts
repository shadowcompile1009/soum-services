// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
export interface TradeInCapDocument extends Document {
  userIds: string[];
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
}

const tradeInCapSchema = new Schema<TradeInCapDocument>({
  userIds: {
    type: [String],
    required: true,
  },
  modelId: {
    type: String,
    required: true,
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

tradeInCapSchema.set('toJSON', {
  virtuals: true,
});
tradeInCapSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
tradeInCapSchema.plugin(mongooseHidden());

export const TradeInCap: Model<TradeInCapDocument> = model(
  'TradeInCap',
  tradeInCapSchema,
  'TradeInCap'
);
