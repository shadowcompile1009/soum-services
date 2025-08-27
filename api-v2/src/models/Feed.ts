// @ts-nocheck
import { Document, model, Model, Schema, Types } from 'mongoose';
import { FeedStatus } from '../enums/FeedStatus';
import { FeedType } from '../enums/FeedType';

export interface FeedDocument extends Document {
  arName: string;
  enName: string;
  arTitle: string;
  enTitle: string;
  expiryDate: Date;
  maxBudget: number;
  imgURL: string;
  position: number;
  status: FeedStatus;
  feedType: FeedType;
  items: FeedItem[];
  feedCategory?: string;
}
export class FeedItem {
  position: number;
  productId: Types.ObjectId;
  categoryId: Types.ObjectId;
  brandId: Types.ObjectId;
  modelId: Types.ObjectId;
  status: FeedStatus;
}
const feedSchema: Schema<FeedDocument> = new Schema<FeedDocument>({
  position: { type: Number, default: 0 },
  arName: { type: String, default: '' },
  enName: { type: String, default: '' },
  arTitle: { type: String, default: '' },
  enTitle: { type: String, default: '' },
  expiryDate: { type: Date },
  maxBudget: { type: Number },
  imgURL: { type: String },
  status: { type: Number, enum: FeedStatus, default: FeedStatus.Active },
  feedType: { type: String, enum: FeedType, default: FeedType.HOME_PAGE },
  feedCategory: { type: String, default: '' },
  items: { type: Array, default: [], Element: FeedItem },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
export const FeedModel: Model<FeedDocument> = model<FeedDocument>(
  'Feed',
  feedSchema,
  'Feed'
);
