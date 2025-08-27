import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { isString } from 'class-validator';
import { Document, isValidObjectId } from 'mongoose';

export type AppleDocument = Apple & Document;

@Schema()
export class Apple {
  @Prop({
    validate: isValidObjectId,
  })
  id: string;
  @Prop({
    validate: isString,
    required: true,
  })
  color: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop({
    required: true,
    default: () => {
      return new Date();
    },
  })
  updatedAt?: Date;
}

export const AppleSchema = SchemaFactory.createForClass(Apple)
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
  })
  .pre<Apple>('save', function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const apple = this;
    apple.price = Math.round(apple.price * 100) / 100;
    next();
  })
  .index({ '$**': 'text' });
