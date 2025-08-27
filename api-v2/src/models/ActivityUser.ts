// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
export type ActivityUserDocument = Document & {
  user_id: any;
  created_date: Date;
  updated_date: Date;
  scan_date: Date;
};
const activityUserSchema = new Schema<ActivityUserDocument>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    created_date: { type: Date, default: Date.now() },
    updated_date: { type: Date, default: Date.now() },
    scan_date: { type: Date },
  },
  {
    collection: 'ActivityUser',
  }
);

export const ActivityUser = model<ActivityUserDocument>(
  'ActivityUser',
  activityUserSchema,
  'ActivityUser'
);
