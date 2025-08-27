// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import { SecurityFeeStatus } from '../enums/DMSecurityFeeStatus';

export interface DMSecurityFeeDocument extends Document {
  transactionId: string;
  userId: string;
  status: SecurityFeeStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const dmSecurityFeeSchema = new Schema<DMSecurityFeeDocument>({
  transactionId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'DeltaMachineUsers' },
  status: { type: String, enum: SecurityFeeStatus },
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() },
});

export const DMSecurityFee: Model<DMSecurityFeeDocument> = model(
  'DMSecurityFee',
  dmSecurityFeeSchema,
  'DMSecurityFee'
);
