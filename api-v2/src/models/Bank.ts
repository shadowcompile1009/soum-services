// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface BankDocument extends Document {
  bankName: string;
  bankName_ar: string;
  bankCode: string;
  status: string;
  position?: number;
  isNonSaudiBank?: boolean;
  created_at: Date;
  updated_at: Date;
}

const bankSchema: Schema<BankDocument> = new Schema<BankDocument>({
  bankName: { type: String },
  bankName_ar: { type: String },
  bankCode: { type: String },
  status: {
    type: String,
    enum: ['Inactive', 'Active', 'Delete'],
    default: 'Active',
  },
  isNonSaudiBank: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});
export const Bank: Model<BankDocument> = model<BankDocument>(
  'banks',
  bankSchema,
  'banks'
);
