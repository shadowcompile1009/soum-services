// @ts-nocheck
import { Document, model, Schema } from 'mongoose';

export enum SequenceType {
  ZATCA_INVOICE_NUMBER = 'ZATCA_invoice_number',
  CREDIT_NOTE_INVOICE_NUMBER = 'credit_invoice_number',
}
export type SequenceDocument = Document & {
  type: string;
  description: string;
  sequence_value: number;
  created_date: Date;
  updated_date: Date;
  deleted_date: Date;
};

const sequenceSchema: Schema = new Schema({
  type: { type: String },
  description: { type: String },
  sequence_value: { type: Number },
  created_date: { type: Date, default: Date.now },
  updated_date: { type: Date, default: Date.now },
  deleted_date: { type: Date },
});
export const Sequence = model<SequenceDocument>(
  'Sequence',
  sequenceSchema,
  'Sequence'
);
