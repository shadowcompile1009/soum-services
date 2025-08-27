// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
export interface EditPriceProductInput {
  product_id: string;
  sell_price: number;
  bid_price: number;
  user_id: string;
}

export interface IAdminChangePriceHistoryModel extends Document {
  userId: any;
  productId: any;
  description: string;
  createdDate: Date;
}

const adminChangePriceHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    default: Schema.Types.ObjectId,
    ref: 'admins',
  },
  productId: {
    type: Schema.Types.ObjectId,
    default: Schema.Types.ObjectId,
    ref: 'products',
  },
  description: { type: String, default: '' },
  createdDate: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const AdminChangePriceHistoryModel: Model<IAdminChangePriceHistoryModel> =
  model<IAdminChangePriceHistoryModel>(
    'AdminChangePriceHistory',
    adminChangePriceHistorySchema,
    'AdminChangePriceHistory'
  );
