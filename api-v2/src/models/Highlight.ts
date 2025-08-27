// @ts-nocheck
import { Document, model, Model, Schema, Types } from 'mongoose';
import { HighlightType } from '../enums/HighlightType';
import { ItemResponseInput } from './Response';

export interface HighlightDocument extends Document {
  arContent: string;
  enContent: string;
  iconUrl: string;
  highlightType: HighlightType;
  targetCategory: Types.ObjectId;
  targetResponse: ItemResponseInput;
}
const highlightSchema: Schema<HighlightDocument> =
  new Schema<HighlightDocument>({
    arContent: { type: String, default: '' },
    enContent: { type: String, default: '' },
    iconUrl: { type: String, default: '' },
    highlightType: {
      type: Number,
      enum: HighlightType,
      default: HighlightType.PRODUCT_RESPONSE,
    },
    targetCategory: { type: Types.ObjectId },
    targetResponse: { type: Object, default: {} },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date },
  });
export const Highlight: Model<HighlightDocument> = model<HighlightDocument>(
  'Highlight',
  highlightSchema,
  'Highlight'
);
