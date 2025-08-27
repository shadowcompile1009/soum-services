// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import { AddOnSummary } from './Brand';
export interface IQRCode {
  issuer_name: string;
  vat: string;
  timeStamp: string;
  total_vat: string;
  total_amount_due: string;
}

export interface DeviceCommissionInvoice {
  unit_price: number;
  discount: number;
  unit_price_after_discount: number;
  quantity: number;
  tax: number;
  sub_total: number;
}
export interface DeviceInvoice extends DeviceCommissionInvoice {
  device_en: string;
  device_ar: string;
}

export interface CommissionInvoice extends DeviceCommissionInvoice {
  commission_en: string;
  commission_ar: string;
}
export interface SecurityDeductionInvoice extends DeviceCommissionInvoice {
  device_en: string;
  device_ar: string;
  vat: string;
}
export interface CreditDeductionInvoice extends DeviceCommissionInvoice {
  device_en: string;
  device_ar: string;
  vat: string;
}
export interface ListingFeeInput {
  seller_id: string;
  service_en: string;
  service_ar: string;
  unit_price: number;
  discount: number;
  unit_price_after_discount: number;
  quantity: number;
  tax: number;
  item_subtotal: number;
  total_taxable_amount: number;
  total_vat: number;
  total_discount: number;
  total_amount_due: number;
}

export interface InvoiceTypeInput {
  id?: string;
  order?: string;
  product?: string;
  bill_type: string;
  invoice_number?: string;
  tax_invoice_number?: string;
  issue_date?: string;
  bill_to: string;
  billed_by_cor: string;
  billed_by_seller: string;
  address: string;
  city?: string;
  postalCode?: string;
  addr?: string;
  commission_detail: any;
  order_detail: any;
  total_taxable_amount: number;
  total_vat: number;
  total_amount_due: number;
  total_amount_due_device: number;
  total_discount: number;
  net_amount: number;
  shipping_charge: number;
  delivery_fee?: number;
  penalty_fee?: number;
  commission?: number;
  vat?: number;
  qr_code?: any;
  mobile_number?: string;
  ZATCA_invoice_number: string;
  credit_note_invoice_number: string;
  date_of_supply?: string;
  order_number?: string;
  soum_logo?: string;
  invoice_migrated?: boolean;
  invoice_urls: InvoiceUrl[];
  totalTaxable?: number; // addOns total + device taxable
  grandVatTotal?: number; // device vat + addOns vat
  grandTotal?: number; // device grand total + addOns grand total
  totalTaxableAfterDiscount?: number; // total taxable + addOns total
  addOnsSummary?: AddOnSummary;
  addOns?: string[];
  commissionAnalysis?: any;
  storeVatNumber?: string;
}
export class InvoiceUrl {
  version: number;
  url: string;
  create_at: Date;
  invoice_format: InvoiceFormats;
}
export interface InvoiceDocument extends Document {
  order: any;
  bill_type: string;
  invoice_number: string;
  tax_invoice_number: string;
  issue_date: string;
  bill_to: string;
  billed_by_cor: string;
  billed_by_seller: string;
  address: string;
  order_detail: string;
  commission_detail: string;
  total_taxable_amount: number;
  total_vat: number;
  total_amount_due: number;
  total_amount_due_device: number;
  total_discount: number;
  net_amount: number;
  shipping_charge: number;
  delivery_fee: number;
  penalty_fee: number;
  commission: number;
  vat: number;
  order_number: string;
  mobile_number: string;
  qr_code: string;
  date_of_supply: string;
  product: any;
  ZATCA_invoice_number: string;
  credit_note_invoice_number: string;
  issued_before_ZATCA: boolean; // this to mark all invoices before ZATCA system
  invoice_migrated?: boolean;
  invoice_urls?: InvoiceUrl[];
  addOnsSummary?: AddOnSummary;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  storeVatNumber?: string;
}

const invoiceSchema = new Schema<InvoiceDocument>({
  order: { type: Schema.Types.ObjectId, ref: 'orders' },
  bill_type: { type: String, default: '' },
  storeVatNumber: { type: String, default: 'NA' },
  invoice_number: { type: String, default: '' },
  tax_invoice_number: { type: String, default: '' },
  issue_date: { type: String, default: '' },
  bill_to: { type: String, default: '' },
  billed_by_cor: { type: String, default: '' },
  billed_by_seller: { type: String, default: '' },
  address: { type: String, default: '' },
  commission_detail: { type: String, default: '' },
  order_detail: { type: String, default: '' },
  total_taxable_amount: { type: Number },
  total_vat: { type: Number },
  total_amount_due: { type: Number },
  total_amount_due_device: { type: Number },
  total_discount: { type: Number },
  net_amount: { type: Number },
  shipping_charge: { type: Number },
  delivery_fee: { type: Number },
  penalty_fee: { type: Number },
  commission: { type: Number },
  vat: { type: Number },
  qr_code: { type: String, default: '' },
  mobile_number: { type: String, default: '' },
  order_number: { type: String, default: '' },
  product: { type: Schema.Types.ObjectId, default: '' },
  date_of_supply: { type: String, default: '' },
  invoice_urls: { type: Array, default: [], Element: InvoiceUrl },
  addOnsSummary: { type: Object, default: null },
  ZATCA_invoice_number: { type: String, default: '' },
  credit_note_invoice_number: { type: String, default: '' },
  issued_before_ZATCA: { type: Boolean, default: false },
  invoice_migrated: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
});

export const InvoiceModel: Model<InvoiceDocument> = model(
  'Invoice',
  invoiceSchema,
  'Invoice'
);
