// @ts-nocheck
import { model, Schema } from 'mongoose';

const messageSchema = new Schema({
  client_type: { type: String },
  message: { type: Schema.Types.Mixed, unique: true },
  deleted_date: { type: Date },
});

export const Message = model('Message', messageSchema, 'Message');
