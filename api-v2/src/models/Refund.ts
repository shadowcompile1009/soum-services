// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
import { RefundMethod } from '../enums/RefundMethod';
import { TransactionStatus } from '../enums/TransactionStatus';
export interface RefundDocument extends Document {
  order: Schema.Types.ObjectId;
  transaction_status: string;
  transaction_id: string;
  transaction_response: any;
  created_at: Date;
  refund_method: RefundMethod;
  refund_amount: number;
  refund_reason: string;
  made_by: string;
  transaction_timestamp: Date;
  refund_soum_number: string;
  refund_status: TransactionStatus;
}

const refundSchema: Schema = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'orders' },
  transaction_id: { type: String },
  transaction_response: { type: Object },
  transaction_status: { type: String },
  refund_status: {
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  },
  refund_soum_number: { type: String },
  refund_amount: { type: Number },
  refund_reason: { type: String },
  refund_method: {
    type: String,
    enum: RefundMethod,
  },
  transaction_timestamp: {
    type: Date,
  },
  made_by: { type: String },
  created_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const Refund: Model<RefundDocument> = model<RefundDocument>(
  'Refund',
  refundSchema,
  'Refund'
);
