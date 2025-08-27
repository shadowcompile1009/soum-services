// @ts-nocheck
import { Document, Model, model, Schema } from 'mongoose';
import mongooseHidden from 'mongoose-hidden';

export class CommissionSettingDocument {
  excellentCommission: number;
  fairCommission: number;
  expensiveLBCommission: number;
  expensiveUBCommission: number;
  toggleStatus: boolean;

  constructor(
    excellentCommission?: number,
    fairCommission?: number,
    expensiveLBCommission?: number,
    expensiveUBCommission?: number
  ) {
    this.excellentCommission = excellentCommission;
    this.fairCommission = fairCommission;
    this.expensiveLBCommission = expensiveLBCommission;
    this.expensiveUBCommission = expensiveUBCommission;
    this.toggleStatus = false;
  }
}

export interface ModelSettingDocument extends Document {
  commissionSettings: CommissionSettingDocument;
  keySellerCommissionSettings: CommissionSettingDocument;
  priceNudgingSettings: boolean;
  tradeInSettings: boolean;
  modelId: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  categoryId?: string;
}

const modelSettingSchema = new Schema<ModelSettingDocument>({
  commissionSettings: {
    type: Object,
    default: new CommissionSettingDocument(),
  },
  keySellerCommissionSettings: {
    type: Object,
    default: new CommissionSettingDocument(),
  },
  priceNudgingSettings: { type: Boolean, default: false },
  tradeInSettings: { type: Boolean, default: false },
  modelId: { type: Schema.Types.ObjectId, ref: 'DeviceModel' },
  status: { type: Boolean, default: true },
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

modelSettingSchema.set('toJSON', {
  virtuals: true,
});
modelSettingSchema.set('toObject', {
  virtuals: true,
});

// This will remove `_id` and `__v`
modelSettingSchema.plugin(mongooseHidden());

export const ModelSetting: Model<ModelSettingDocument> = model(
  'ModelSettings',
  modelSettingSchema,
  'ModelSettings'
);
