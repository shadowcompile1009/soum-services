// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

type ProductData = {
  brandName: string;
  brandNameAr: string;
  modelName: string;
  modelNameAr: string;
  bidValue: number;
  productId?: any;
};

type UserData = {
  userName: string;
  id: any;
  isActivityCreator?: boolean;
};

type PushToken = {
  _id: any;
  platform: string;
  fcm_token: string;
  status: string;
  lang?: string;
};

export interface NotificationWithPushTokens {
  _id: any;
  activityType: string;
  productData: ProductData;
  userData: UserData;
  push_tokens: PushToken[];
}

export interface NotificationDocument extends Document {
  userId: any;
  seenDate?: Date;
  isRead?: boolean;
  productData: any;
  sellerData: any;
  userData: any;
  activityType: string;
  proceededByPushCron?: boolean;
  pushMessageSent?: number;
  pushMessageSentAt?: Date;
  createdDate: Date;
  updatedDate?: Date;
}

const notificationSchema = new Schema({
  userId: { type: Object },
  seenDate: { type: Date },
  isRead: { type: Boolean, default: false },
  productData: { type: Object, default: {} },
  sellerData: { type: Object, default: {} },
  userData: { type: Object, default: {} },
  activityType: {
    type: String,
    enum: [
      'BuyerBidAccepted',
      'Bidding',
      'AnswerQuestion',
      'AskQuestion',
      'ProductExpired',
      'BuyerBidRejected',
      'BuyerPaymentCompleted',
    ],
  },
  pushMessageSent: { type: Number, default: 0 },
  pushMessageSentAt: { type: Date },
  proceededByPushCron: { type: Boolean, default: false },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date },
});

notificationSchema.plugin(mongoosePaginate);

export const Notification = model<NotificationDocument>(
  'Notification',
  notificationSchema,
  'notifications'
);
