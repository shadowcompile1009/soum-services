// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export type FraudProductDocument = Document & {
  productId: any;
  productImage: string;
  visionResponse: any;
  detectText: any;
  status: string;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

const fraudProductSchema = new Schema<FraudProductDocument>({
  productId: { type: Schema.Types.ObjectId, required: false, ref: 'products' },
  productImage: {
    type: String,
  },
  visionResponse: {
    type: String,
  },
  detectText: {
    type: String,
  },
  status: { type: String, default: 'Unconfirmed' },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const FraudProduct: Model<FraudProductDocument> = model(
  'FraudProduct',
  fraudProductSchema
);
