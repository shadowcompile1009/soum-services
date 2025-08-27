// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
export interface NCTReasonsDocument extends Document {
  name: string;
  displayName: string;
  displayNameAR: string;
  sellerWithdrawal: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const nctReasonsSchema = new Schema<NCTReasonsDocument>({
  name: { type: String, unique: true },
  displayName: { type: String },
  displayNameAR: { type: String },
  sellerWithdrawal: { type: Boolean },
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

nctReasonsSchema.set('toJSON', {
  virtuals: true,
});
nctReasonsSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
nctReasonsSchema.plugin(mongooseHidden());

export const NCTReasons: Model<NCTReasonsDocument> = model(
  'NCTReasons',
  nctReasonsSchema,
  'NCTReasons'
);
