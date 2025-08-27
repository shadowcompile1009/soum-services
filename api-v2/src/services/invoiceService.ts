import moment from 'moment';
import { Constants } from '../constants/constant';
import { Service } from 'typedi';
import {
  InvoiceDocument,
  InvoiceTypeInput,
  ListingFeeInput,
  IQRCode,
} from '../models/Invoice';
import QRCode from 'qrcode';
import { InvoiceRepository } from '../repositories/invoiceRepository';
import { UserRepository } from '../repositories/userRepository';
import { OrderService } from './orderService';
import { SequenceRepository } from '../repositories/SequenceRepository';
import { OrderRepository } from '../repositories';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { formatPriceInDecimalPoints } from '../util/common';
import { SequenceType } from '../models/Sequence';

@Service()
export class InvoiceService {
  constructor(
    public invoiceRepository: InvoiceRepository,
    public userRepository: UserRepository,
    public orderService: OrderService,
    public orderRepository: OrderRepository,
    public sequenceRepository: SequenceRepository,
    public error: ErrorResponseDto
  ) {}

  async updateInvoiceUrls(
    invoiceId: string,
    invoiceUrls: string[]
  ): Promise<any> {
    try {
      const [err, data] = await this.invoiceRepository.updateInvoiceUrl(
        invoiceId,
        invoiceUrls
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_INVOICE
        );
      }
    }
  }
  async addListingFeeInvoice(
    params: ListingFeeInput
  ): Promise<
    [boolean, { code: number; result: InvoiceTypeInput; message?: string }]
  > {
    const seller = await this.userRepository.getUserById(params.seller_id);

    if (!seller) {
      return [true, { code: 400, result: null, message: 'Invalid seller_id' }];
    }

    const invoiceNumber = await this.orderService.generateInvoiceNo(
      'listing-fee'
    );
    const [sequenceErr, sequenceResult] =
      await this.sequenceRepository.getValueForNextSequence(
        SequenceType.ZATCA_INVOICE_NUMBER
      );
    if (sequenceErr) {
      return [
        true,
        { code: 400, result: null, message: 'Failed to get ZATCA number' },
      ];
    }
    const invoiceInput: InvoiceTypeInput = {
      address: this.userRepository.getAddress(seller),
      bill_to: seller.name,
      tax_invoice_number: invoiceNumber,
      issue_date: moment().format('YYYY-MM-DD'),
      bill_type: 'listing-fee',
      billed_by_cor: Constants.INVOICE.BILLED_BY_COR,
      billed_by_seller: '',
      commission_detail: null,
      order_detail: null,
      total_taxable_amount: formatPriceInDecimalPoints(
        params.total_taxable_amount,
        3
      ),
      total_vat: formatPriceInDecimalPoints(params.total_vat, 3),
      total_amount_due: formatPriceInDecimalPoints(params.total_amount_due, 3),
      total_amount_due_device: 0,
      total_discount: formatPriceInDecimalPoints(params.total_discount, 3),
      net_amount: 0,
      shipping_charge: 0,
      ZATCA_invoice_number: `${
        process.env.INVOICES_LISTING_PREFIX || 'KSA'
      }${String(sequenceResult.result)}`,
      credit_note_invoice_number: null,
      invoice_urls: [],
    };

    const [errNewInvoice, newInvoice] =
      await this.invoiceRepository.addNewInvoice(invoiceInput);
    const mappingInvoice = this.orderService.mappingToInvoiceType(
      newInvoice.result as InvoiceDocument
    );
    const qrCode: IQRCode = {
      issuer_name: Constants.INVOICE.QR_CODE.ISSUER_NAME,
      vat: Constants.INVOICE.QR_CODE.VAT_CODE,
      timeStamp: moment().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      total_vat: null,
      total_amount_due: null,
    };
    qrCode.total_vat = mappingInvoice.total_vat + '';
    qrCode.total_amount_due = mappingInvoice.total_amount_due + '';
    mappingInvoice.qr_code = await QRCode.toDataURL(
      this.orderService.generateQRCode(qrCode)
    );

    return [
      errNewInvoice,
      {
        code: newInvoice.code,
        result: mappingInvoice,
        message: newInvoice.message,
      },
    ];
  }
}
