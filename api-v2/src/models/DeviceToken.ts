// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export interface DeviceTokenInput {
  id?: any;
  user_id?: any;
  device_id?: string;
  fcm_token: string;
  platform?: string;

  lang?: string;
  app_version?: string;
  status?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface DeviceTokenDocument extends Document {
  id?: any;
  user_id?: any;
  device_id: string;
  fcm_token: string;
  platform?: string;

  lang?: string;
  app_version?: string;
  status?: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

const deviceTokenSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'LegacyUser' },
  device_id: { type: String, require: true },
  fcm_token: { type: String, require: true },
  platform: { type: String, enum: ['ios', 'android'], default: 'android' },
  lang: { type: String, default: 'ar' },
  app_version: { type: String },
  status: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});

export const DeviceToken = model<DeviceTokenDocument>(
  'DeviceToken',
  deviceTokenSchema,
  'DeviceToken'
);
