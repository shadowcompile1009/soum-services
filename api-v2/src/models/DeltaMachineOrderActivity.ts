// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';

export interface DeltaMachineOrderActivityDocument extends Document {
  orderId: string;
  userId: string;
  statusFrom: string;
  statusTo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const deltaMachineOrderActivitySchema =
  new Schema<DeltaMachineOrderActivityDocument>({
    orderId: { type: Schema.Types.ObjectId, ref: 'orders' },
    userId: { type: Schema.Types.ObjectId, ref: 'LegacyUser' },
    statusFrom: { type: String, ref: 'DeltaMachineOrders' },
    statusTo: { type: String, ref: 'DeltaMachineOrders' },
    createdAt: { type: Date, default: new Date() },
    updatedAt: { type: Date, default: new Date() },
  });

export const DeltaMachineOrderActivity: Model<DeltaMachineOrderActivityDocument> =
  model(
    'DeltaMachineOrderActivities',
    deltaMachineOrderActivitySchema,
    'DeltaMachineOrderActivities'
  );
