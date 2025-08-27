// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface PayoutHistoryInput {
  order: string;
  product?: string;
  seller?: string;
  hyper_splits_id: string;
  commission?: number;
  commission_amount?: number;
  vat?: number;
  shipping_charge?: number;
  pay_amount: number;
  bank_name: string;
  iban: string;
  made_by: string;
  status: string;
  transaction_timestamp: string;
  swift?: number;
}
export type PayoutHistoryDocument = Document & {
  order: any;
  product: any;
  seller: any;
  hyper_splits_id: string;
  commission: number;
  commission_amount: number;
  vat: number;
  shipping_charge: number;
  pay_amount: number;
  bank_name: string;
  iban: string;
  made_by: string;
  status: string;
  transaction_timestamp: string;
  swift: number;
  created_at: Date;
  updated_at: Date;
};

const payoutHistorySchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'orders', index: true },
  product: { type: Schema.Types.ObjectId, ref: 'products' },
  seller: { type: Schema.Types.ObjectId, ref: 'users' },
  hyper_splits_id: { type: String },
  commission: { type: Number },
  commission_amount: { type: Number },
  vat: { type: Number },
  shipping_charge: { type: Number },
  pay_amount: { type: Number },
  bank_name: { type: String },
  iban: { type: String },
  made_by: { type: String },
  status: {
    type: String,
    enum: ['Failed', 'Pending', 'Successful'],
    default: 'Pending',
  },
  transaction_timestamp: {
    type: String,
  },
  swift: { type: Number },
  created_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updated_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const PayoutHistory: Model<PayoutHistoryDocument> =
  model<PayoutHistoryDocument>(
    'PayoutHistory',
    payoutHistorySchema,
    'PayoutHistory'
  );
