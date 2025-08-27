// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export interface SettingInput {
  id?: any;
  name?: string;
  description?: string;
  type?: string;
  setting_category?: string | string[];
  value?: any;
  possible_values?: any;
  status?: string;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface CalculatePriceData {
  buyerCommissionPercentage: number;
  vatPercentage: number;
  applyDeliveryFee: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFeeSPPs: boolean;
  deliveryThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  deliveryRules: any;
  promoCodeData?: any;
}

export interface SettingDocument extends Document {
  id?: any;
  name: string;
  description?: string;
  type?: string;
  setting_category: string;
  value: any;
  possible_values?: any;
  status?: string;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

const settingSchema = new Schema({
  name: { type: String },
  description: { type: String },
  type: {
    type: String,
    enum: ['number', 'string', 'boolean', 'option', 'json'],
  },
  setting_category: { type: String },
  value: { type: Schema.Types.Mixed, default: '' },
  possible_values: { type: Schema.Types.Mixed, default: '' },
  status: { type: String, default: 'Enabled' },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});

export const Setting = model<SettingDocument>(
  'Setting',
  settingSchema,
  'Setting'
);
