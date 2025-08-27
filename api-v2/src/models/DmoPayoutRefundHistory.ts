// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';

export interface PayoutRefundHistoryInput {
  dmoTransactionId: string;
  orderId: string;
  transactionType: string;
  transactionStatus: string;
  paymentMethod: string;
  amount: number;
  paymentGatewayTransactionId: string;
  transactionTimestamp: string;
  transactionTimestampFromHyperpay?: string;
  createdAt?: Date;
  doneBy: string;
  swift?: number;
}
export interface DmoPayoutRefundHistoryDocument extends Document {
  dmoTransactionId: string;
  orderId: any;
  transactionType: string;
  transactionStatus: string;
  paymentMethod: string;
  amount: number;
  paymentGatewayTransactionId: string;
  transactionTimestamp: Date;
  transactionTimestampFromHyperpay: string;
  createdAt?: Date;
  doneBy: string;
  swift?: number;
}

const dmoPayoutRefundHistorySchema = new Schema<DmoPayoutRefundHistoryDocument>(
  {
    dmoTransactionId: { type: String },
    orderId: { type: Schema.Types.ObjectId, ref: 'orders' },
    transactionType: { type: String },
    transactionStatus: { type: String },
    paymentMethod: { type: String },
    amount: { type: Number },
    paymentGatewayTransactionId: { type: String },
    transactionTimestamp: { type: Date },
    transactionTimestampFromHyperpay: { type: String },
    createdAt: {
      type: Date,
      default: () => {
        return new Date();
      },
    },
    doneBy: { type: String },
    swift: { type: Number },
  }
);

export const DmoPayoutRefundHistory: Model<DmoPayoutRefundHistoryDocument> =
  model<DmoPayoutRefundHistoryDocument>(
    'DmoPayoutRefundHistory',
    dmoPayoutRefundHistorySchema,
    'DmoPayoutRefundHistory'
  );
