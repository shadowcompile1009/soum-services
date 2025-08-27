// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
export interface DmoNCTReasonsDto {
  userId?: string;
  nctReasonId?: string;
  dmoId?: string;
  orderId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface DmoNCTReasonsDocument extends Document {
  userId: string;
  nctReasonId: string;
  dmoId: string;
  orderId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const dmoNCTReasonsSchema = new Schema<DmoNCTReasonsDocument>({
  userId: { type: String },
  nctReasonId: { type: Schema.Types.ObjectId, ref: 'NCTReasons' },
  dmoId: { type: Schema.Types.ObjectId, ref: 'DeltaMachineOrders' },
  orderId: { type: Schema.Types.ObjectId, ref: 'orders' },
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

dmoNCTReasonsSchema.set('toJSON', {
  virtuals: true,
});
dmoNCTReasonsSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
dmoNCTReasonsSchema.plugin(mongooseHidden());

export const DmoNCTReasons: Model<DmoNCTReasonsDocument> =
  model<DmoNCTReasonsDocument>(
    'DmoNCTReasons',
    dmoNCTReasonsSchema,
    'DmoNCTReasons'
  );
