// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface NotificationLogDocument extends Document {
  notificationInput: any;
  messages: any;
  response: any;
  activityType: string;
  createdDate: Date;
  updatedDate?: Date;
}

const notificationLogSchema = new Schema({
  notificationInput: { type: Object },
  messages: { type: Object },
  response: { type: Object },
  activityType: { type: String },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date },
});

notificationLogSchema.plugin(mongoosePaginate);

export const NotificationLog = model<NotificationLogDocument>(
  'NotificationLog',
  notificationLogSchema,
  'notification_logs'
);
