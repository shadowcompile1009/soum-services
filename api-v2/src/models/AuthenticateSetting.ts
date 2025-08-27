// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';

export interface AuthenticateSettingDocument extends Document {
  userId: string;
  isMFAEnabled: boolean;
  mfaSecret: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const authenticateSettingSchema = new Schema<AuthenticateSettingDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  isMFAEnabled: { type: Boolean, default: false },
  mfaSecret: { type: String },
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

export const AuthenticateSetting: Model<AuthenticateSettingDocument> = model(
  'AuthenticateSetting',
  authenticateSettingSchema,
  'AuthenticateSetting'
);
