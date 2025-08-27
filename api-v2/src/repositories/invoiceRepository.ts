import moment from 'moment';
import mongoose from 'mongoose';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import {
  InvoiceDocument,
  InvoiceModel,
  InvoiceTypeInput,
  InvoiceUrl,
} from '../models/Invoice';
import { BaseRepository } from './BaseRepository';

@Service()
export class InvoiceRepository extends BaseRepository {
  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: InvoiceDocument | string; message?: string }
    ]
  > {
    try {
      const data = await InvoiceModel.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async getInvoiceWithOrderId(
    orderId: string,
    invoiceType: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: InvoiceDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await InvoiceModel.findOne({
        order: new mongoose.Types.ObjectId(orderId),
        bill_type: invoiceType,
      }).exec();

      if (!data) {
        return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: null }];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async addNewInvoice(
    request: InvoiceTypeInput
  ): Promise<
    [boolean, { code: number; result: InvoiceDocument; message?: string }]
  > {
    try {
      const invoice = new InvoiceModel({
        order: request.order
          ? new mongoose.Types.ObjectId(request.order)
          : null,
        bill_type: request.bill_type,
        tax_invoice_number: request.tax_invoice_number,
        invoice_number: request.invoice_number,
        issue_date: request.issue_date,
        bill_to: request.bill_to,
        billed_by_cor: request.billed_by_cor,
        billed_by_seller: request.billed_by_seller,
        address: request.address,
        order_detail: request.order_detail
          ? JSON.stringify(request.order_detail)
          : null,
        commission_detail: request.commission_detail
          ? JSON.stringify(request.commission_detail)
          : null,
        total_taxable_amount: request.total_taxable_amount,
        total_vat: request.total_vat,
        total_amount_due: request.total_amount_due,
        total_amount_due_device: request.total_amount_due_device || 0,
        total_discount: request.total_discount,
        net_amount: request.net_amount || 0,
        commission: request.commission || 0,
        vat: request.vat || 0,
        shipping_charge: request.shipping_charge || 0,
        delivery_fee: request.delivery_fee || 0,
        penalty_fee: request?.penalty_fee || 0,
        ZATCA_invoice_number: request.ZATCA_invoice_number,
        credit_note_invoice_number: request.credit_note_invoice_number,
        invoice_migrated: true,
        mobile_number: request.mobile_number,
        order_number: request.order_number,
        qr_code: request.qr_code,
        product: request.product,
        date_of_supply: request.date_of_supply,
        addOnsSummary: request?.addOnsSummary || null,
        storeVatNumber: request?.storeVatNumber || 'NA',
      });
      const data = await invoice.save();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: null,
          message: exception.message,
        },
      ];
    }
  }

  async updateInvoice(
    invoiceId: string,
    request: InvoiceTypeInput
  ): Promise<
    [
      boolean,
      { code: number; result: InvoiceDocument | string; message?: string }
    ]
  > {
    try {
      const invoice = await InvoiceModel.findByIdAndUpdate(
        invoiceId,
        {
          $set: {
            order_detail: request.order_detail
              ? JSON.stringify(request.order_detail)
              : null,
            commission_detail: request.commission_detail
              ? JSON.stringify(request.commission_detail)
              : null,
            total_taxable_amount: request.total_taxable_amount,
            total_vat: request.total_vat,
            total_amount_due: request.total_amount_due,
            total_amount_due_device: request.total_amount_due_device || 0,
            total_discount: request.total_discount,
            net_amount: request.net_amount || 0,
            commission: request.commission || 0,
            vat: request.vat || 0,
            shipping_charge: request.shipping_charge || 0,
            delivery_fee: request.delivery_fee || 0,
            ZATCA_invoice_number: request.ZATCA_invoice_number,
            credit_note_invoice_number: request.credit_note_invoice_number,
            invoice_migrated: request.invoice_migrated,
            mobile_number: request.mobile_number,
            order_number: request.order_number,
            qr_code: request.qr_code,
            product: request.product,
            date_of_supply: request.date_of_supply,
            invoice_urls: request.invoice_urls,
            updated_at: moment().toDate(),
          },
        },
        { new: true }
      ).exec();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: invoice }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async updateInvoiceUrl(
    invoiceId: string,
    invoiceUrls: string[]
  ): Promise<
    [
      boolean,
      { code: number; result: InvoiceDocument | string; message?: string }
    ]
  > {
    try {
      const urls: any = invoiceUrls.map((url: string) => {
        const urlPath = new URL(url)?.pathname;
        return <InvoiceUrl>{
          version: 1,
          url: `${process.env.INVOICES_AWS_S3_ENDPOINT}${urlPath}`,
          create_at: new Date(),
          invoice_format: InvoiceFormats.SOUM,
        };
      });

      const invoice = await InvoiceModel.findByIdAndUpdate(
        invoiceId,
        {
          $push: {
            invoice_urls: urls,
          },
          $set: {
            updated_at: moment().toDate(),
          },
        },
        { new: true }
      ).exec();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: invoice }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async removeInvoice(
    invoiceId: string
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      await InvoiceModel.findByIdAndRemove(invoiceId).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Done to remove invoice',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_REMOVE_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async updateInvoiceViaId(
    invoiceId: string,
    updatedInvoice: InvoiceTypeInput,
    regeneratePDF: any
  ): Promise<
    [
      boolean,
      { code: number; result: InvoiceDocument | string; message?: string }
    ]
  > {
    try {
      const invoice = await InvoiceModel.findById(invoiceId).exec();

      if (!invoice) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          },
        ];
      }

      invoice.issue_date = updatedInvoice.issue_date;
      invoice.bill_type = updatedInvoice.bill_type;
      invoice.billed_by_cor = updatedInvoice.billed_by_cor;
      invoice.billed_by_seller = updatedInvoice.billed_by_seller;
      invoice.order_detail = updatedInvoice.order_detail
        ? JSON.stringify(updatedInvoice.order_detail)
        : null;
      invoice.commission_detail = updatedInvoice.commission_detail
        ? JSON.stringify(updatedInvoice.commission_detail)
        : null;
      invoice.total_taxable_amount = updatedInvoice.total_taxable_amount;
      invoice.total_vat = updatedInvoice.total_vat;
      invoice.total_amount_due = updatedInvoice.total_amount_due;
      invoice.total_amount_due_device =
        updatedInvoice.total_amount_due_device || 0;
      invoice.total_discount = updatedInvoice.total_discount;
      invoice.net_amount = updatedInvoice.net_amount || 0;
      invoice.shipping_charge = updatedInvoice.shipping_charge || 0;
      invoice.delivery_fee = updatedInvoice.delivery_fee || 0;

      // regenerate invoice from seller to buyer - buyer invoice has invoiceNo device
      if (regeneratePDF && updatedInvoice.bill_type === 'buyer') {
        invoice.invoice_number = updatedInvoice.invoice_number;
        // reformat prefix of buyer tax invoice number with B- instead S-
        const currentTaxNo = invoice.tax_invoice_number;
        invoice.tax_invoice_number = currentTaxNo.includes('S-')
          ? currentTaxNo.replace('S-', 'B-')
          : currentTaxNo;
      }
      // regenerate invoice from buyer to seller - seller invoice has no invoiceNo
      if (regeneratePDF && updatedInvoice.bill_type === 'seller') {
        invoice.invoice_number = null;
        // reformat prefix of seller tax invoice number with S- instead B-
        const renewTaxNo = invoice.tax_invoice_number;
        invoice.tax_invoice_number = renewTaxNo.includes('B-')
          ? renewTaxNo.replace('B-', 'S-')
          : renewTaxNo;
      }

      const newInvoice = await invoice.save();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: newInvoice },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async getExistingInvoiceNo(
    invoiceNo: string,
    invoiceType: string
  ): Promise<
    [boolean, { code: number; result: boolean | string; message?: string }]
  > {
    try {
      const condition =
        invoiceType === 'seller' || invoiceType == 'listing-fee'
          ? { tax_invoice_number: invoiceNo }
          : {
              $or: [
                { tax_invoice_number: invoiceNo },
                { invoice_number: invoiceNo },
              ],
            };
      const data = await InvoiceModel.findOne(condition)
        .select('_id')
        .lean()
        .exec();
      if (!data) {
        return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: false }];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: true }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async updateSDInvoiceUrl(
    invoiceId: string,
    invoiceUrl: InvoiceUrl
  ): Promise<
    [
      boolean,
      { code: number; result: InvoiceDocument | string; message?: string }
    ]
  > {
    try {
      const invoice = await InvoiceModel.findByIdAndUpdate(
        invoiceId,
        {
          $push: {
            invoice_urls: invoiceUrl,
          },
          $set: {
            updated_at: moment().toDate(),
          },
        },
        { new: true }
      ).exec();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: invoice }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_INVOICE,
          message: exception.message,
        },
      ];
    }
  }
  async updateCDInvoiceUrl(
    invoiceId: string,
    invoiceUrl: InvoiceUrl
  ): Promise<
    [
      boolean,
      { code: number; result: InvoiceDocument | string; message?: string }
    ]
  > {
    try {
      const invoice = await InvoiceModel.findByIdAndUpdate(
        invoiceId,
        {
          $push: {
            invoice_urls: invoiceUrl,
          },
          $set: {
            updated_at: moment().toDate(),
          },
        },
        { new: true }
      ).exec();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: invoice }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_INVOICE,
          message: exception.message,
        },
      ];
    }
  }

  async getInvoiceWithProductIds(
    productIds: string[],
    invoiceType: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: InvoiceDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await InvoiceModel.find({
        product: {
          $in: productIds.map(
            (productId: string) => new mongoose.Types.ObjectId(productId)
          ),
        },
        bill_type: invoiceType,
      }).exec();
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          message: exception.message,
        },
      ];
    }
  }
}
