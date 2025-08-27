// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
import { BannerPage } from '../enums/Banner';
import { BannerStatus } from '../enums/BannerStatus';

export interface BannerInput {
  bannerName: string;
  bannerType: string;
  bannerPage: BannerPage;
  bannerPosition?: string;
  bannerValue?: string;
  bannerImage: string;
  lang: string;
  type?: string;
}
export interface BannerDocument extends Document {
  banner_image: string;
  banner_name: string;
  banner_type: string;
  banner_value?: string;
  banner_page: string;
  banner_position: string;
  position?: number;
  region: string;
  lang: string;
  type?: string;
}

const bannerSchema: Schema<BannerDocument> = new Schema<BannerDocument>({
  banner_image: { type: String },
  banner_name: { type: String },
  banner_page: { type: String },
  banner_position: { type: String },
  banner_type: { type: String },
  banner_value: { type: String },
  status: { type: String, enum: BannerStatus, default: BannerStatus.ACTIVE },
  position: { type: Number, default: 0 },
  region: { type: String },
  lang: { type: String },
  type: { type: String, default: '' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});
export const BannerModel: Model<BannerDocument> = model<BannerDocument>(
  'Banner',
  bannerSchema,
  'Banner'
);
