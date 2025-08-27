// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export type LegacySettingDocument = Document & {
  skip_defect_photos: boolean;
  product_approval: boolean;
  theme_color: string;
  buyer_commission_percentage: number;
  seller_commission_percentage: number;
  shipping_charge_percentage: number;
  start_bid_percentage: number;
  vat_percentage: number;
  bidding_amount: number;
  created_at: Date;
  updated_at: Date;
};

const legacySettingSchema = new Schema<LegacySettingDocument>(
  {
    skip_defect_photos: { type: Boolean, default: false },
    product_approval: { type: Boolean, default: true },
    theme_color: { type: String, default: '01B9FF' },
    buyer_commission_percentage: { type: Number, default: 10 },
    seller_commission_percentage: { type: Number, default: 10 },
    shipping_charge_percentage: { type: Number, default: 10 },
    start_bid_percentage: { type: Number, default: 75 },
    vat_percentage: { type: Number, default: 10 },
    bidding_amount: { type: Number, default: 20 },
    created_at: { type: Date, default: Date.now() },
    updated_at: { type: Date, default: Date.now() },
  },
  {
    collection: 'settings',
  }
);

export const LegacySetting = model<LegacySettingDocument>(
  'LegacySetting',
  legacySettingSchema,
  'setting'
);
