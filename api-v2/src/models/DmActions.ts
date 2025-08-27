// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export type CreateDmActionsDto = {
  statusName: string;
  actions: string[];
};

export type DmActionsDto = {
  statusId: string;
  name: string;
};

export interface DmActionsDocument extends Document {
  id?: string;
  statusId: string;
  name: string;
}

const dmActionsSchema = new Schema<DmActionsDocument>({
  name: { type: String, required: true },
  statusId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'DeltaMachineStatuses',
  },
});

dmActionsSchema.set('toJSON', {
  virtuals: true,
});
dmActionsSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
dmActionsSchema.plugin(mongooseHidden());

export const DmActions = model<DmActionsDocument>(
  'DmActions',
  dmActionsSchema,
  'DmActions'
);
