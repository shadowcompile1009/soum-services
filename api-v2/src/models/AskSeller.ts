// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export interface AskSellerType extends Document {
  id: any;
  product_id: string;
  questioner_id: string;
  seller_id?: string;
  question: string;
  answer?: string;
  created_date: Date;
  updated_date?: Date;
  deleted_date?: Date;
  deleted_by?: string;
  deleted_reason?: string;
  status?: string;
  buyer_name?: string;
}

const askSellerSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  question: { type: String },
  questioner_id: { type: Schema.Types.ObjectId, ref: 'User' },
  seller_id: { type: Schema.Types.ObjectId, ref: 'User' },
  answer: { type: String },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
  deleted_by: { type: String },
  status: {
    type: String,
    enum: ['Active', 'Delete'],
    default: 'Active',
  },
  deleted_reason: { type: String },
});

export const AskSeller = model('AskSeller', askSellerSchema, 'AskSeller');
