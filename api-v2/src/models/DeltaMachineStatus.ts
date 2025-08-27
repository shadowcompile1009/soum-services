// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
import { DeltaMachineStatusSubmodule } from '../enums/DeltaMachineStatusSubmodule';

export interface DeltaMachineStatusDocument extends Document {
  name: string;
  displayName: string;
  submodule: string;
  sequence: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const deltaMachineStatusSchema = new Schema<DeltaMachineStatusDocument>({
  name: { type: String, unique: true },
  displayName: { type: String },
  sequence: { type: Number },
  submodule: { type: DeltaMachineStatusSubmodule },
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

deltaMachineStatusSchema.set('toJSON', {
  virtuals: true,
});
deltaMachineStatusSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
deltaMachineStatusSchema.plugin(mongooseHidden());

export const DeltaMachineStatus: Model<DeltaMachineStatusDocument> = model(
  'DeltaMachineStatuses',
  deltaMachineStatusSchema,
  'DeltaMachineStatuses'
);
