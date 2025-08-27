import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, isValidObjectId } from 'mongoose';
import { PromoCodeGenerationTaskStatus } from '@modules/promo-code/enum';

@Schema()
export class PromoCodeGenerationTask {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;
  @Prop()
  totalPromos: number;
  @Prop({ default: 0 })
  totalGenerated: number;
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromoCode',
    required: false,
  })
  parentPromoCodeId: string;
  @Prop({
    required: true,
    default: PromoCodeGenerationTaskStatus.IN_PROGRESS,
  })
  taskStatus: PromoCodeGenerationTaskStatus;
}

export type PromoCodeGenerationTaskDocument = Document &
  PromoCodeGenerationTask;

export const PromoCodeGenerationTaskSchema = SchemaFactory.createForClass(
  PromoCodeGenerationTask,
)
  .set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toHexString();
      delete ret._id;
    },
  })
  .set('toObject', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      ret.id = ret._id.toHexString();
      delete ret._id;
    },
  });
