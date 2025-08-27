import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AddonType } from '../enum/addonType.enum';
import { AddonStatus } from '../enum/addonStatus.enum';
import { PriceType } from '../enum/priceType.enum';
import { ValidityType } from '../enum/validityType.enum';

export type AddonDocument = Document & Addon;

export class AddonFilter {
  modelId?: string;
  addonIds?: string[];
  price?: number;
}

@Schema({ timestamps: true })
export class Addon {
  @Prop({ required: true, default: AddonStatus.ACTIVE })
  status: AddonStatus;

  @Prop({ required: true })
  type: AddonType;

  @Prop({ required: false })
  image: string;

  @Prop({ required: false })
  nameEn: string;

  @Prop({ required: false })
  nameAr: string;

  @Prop()
  taglineAr: string[];

  @Prop()
  taglineEn: string[];

  @Prop()
  descriptionEn: string;

  @Prop()
  descriptionAr: string;

  @Prop()
  priceType: PriceType;

  @Prop({ required: true })
  price: number;

  @Prop()
  validityType: ValidityType;

  @Prop()
  validity: number;

  @Prop({ type: [String], required: true })
  modelIds: string[];

  @Prop({ type: [String], required: false, default: [] })
  sellerIds: string[];
}

export const AddonSchema = SchemaFactory.createForClass(Addon);
