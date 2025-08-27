// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
export interface FavoriteDocument extends Document {
  userId: string;
  productId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

const favoriteSchema: Schema<FavoriteDocument> = new Schema<FavoriteDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'user' },
  productId: { type: Schema.Types.ObjectId, required: true, ref: 'products' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});
export const FavoriteModel: Model<FavoriteDocument> = model<FavoriteDocument>(
  'Favorite',
  favoriteSchema,
  'Favorite'
);
