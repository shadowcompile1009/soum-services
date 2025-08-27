import axios from 'axios';
import config from 'config';
import { Kafka, Producer } from 'kafkajs';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import mongoose, { LeanDocument } from 'mongoose';
import Mustache from 'mustache';
import QRCode from 'qrcode';
import Container, { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { DailyPayoutSellerReportDto } from '../dto/order/DailyPayoutSellerReportDto';
import { PayoutSellerOrderDto } from '../dto/order/PayoutSellerOrderDto';
import {
  BoughtHistory,
  ReservationResponseDto,
} from '../dto/order/ReservationDto';
import { PaginationDto } from '../dto/paginationDto';
import { ReservationSummary } from '../dto/product/ProductCalculationSummaryDto';
import { PurchaseProductDto } from '../dto/product/PurchaseProductDto';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import { InvoiceType } from '../enums/InvoiceType';
import { ListingType } from '../enums/ListingType.Enum';
import { PaymentModuleName } from '../enums/PO-module-name.enum';
import { UpdateHoldingPenalty } from '../grpc/dmbackend';
import { CreatePaymentTransaction } from '../grpc/payment';
import { CreateTransactionResponse } from '../grpc/proto/payment/CreateTransactionResponse';
import { TransactionResponse } from '../grpc/proto/wallet/TransactionResponse';
import { GetListingFee, GetTransactionById } from '../grpc/wallet';
import { AirTable } from '../libs/airtable';
import { generatePDF } from '../libs/generatePDF';
import {
  PayoutBuyerRequest,
  PayoutSellerRequest,
  createPayoutOrder,
  getDecodeBankAndBICFunc,
  getSpecificOrder,
  getSpecificPayout,
  loginHyperSplits,
} from '../libs/hyperpay';
import { uploadInvoice } from '../libs/multer';
import { sendMail } from '../libs/sendgrid';
import { AddressDocument } from '../models/Address';
import { BankDocument } from '../models/Bank';
import { AddOnSummary } from '../models/Brand';
import { DeltaMachineOrderDocument } from '../models/DeltaMachineOrder';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import { PayoutRefundHistoryInput } from '../models/DmoPayoutRefundHistory';
import {
  CommissionInvoice,
  CreditDeductionInvoice,
  DeviceInvoice,
  IQRCode,
  InvoiceDocument,
  InvoiceTypeInput,
  InvoiceUrl,
  SecurityDeductionInvoice,
} from '../models/Invoice';
import { ILegacyProductModel } from '../models/LegacyProducts';
import { UserLegacyDocument } from '../models/LegacyUser';
import {
  OrderDocument,
  TaskGeneratedStatus,
  UpdatePayoutOrderInput,
} from '../models/Order';
import { PaymentProviderType } from '../models/Payment';
import { PayoutHistoryInput } from '../models/PayoutHistory';
import { BillingSettings } from '../models/Product';
import { SequenceType } from '../models/Sequence';
import { SettingDocument } from '../models/Setting';
import { VariantDocument } from '../models/Variant';
import { SequenceRepository } from '../repositories/SequenceRepository';
import { AddressRepository } from '../repositories/addressRepository';
import { BankRepository } from '../repositories/bankRepository';
import { DeltaMachineRepository } from '../repositories/deltaMachineRepository';
import { DmoPayoutRefundHistoryRepository } from '../repositories/dmoPayoutRefundHistoryRepository';
import { InvoiceRepository } from '../repositories/invoiceRepository';
import { OrderRepository } from '../repositories/orderRepository';
import { PaymentLogRepository } from '../repositories/paymentLogRepository';
import { PayoutHistoryRepository } from '../repositories/payoutHistoryRepository';
import { ProductRepository } from '../repositories/productRepository';
import { SettingRepository } from '../repositories/settingRepository';
import { UserRepository } from '../repositories/userRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { creditDeductionInvoicePDF } from '../templates/creditDeductionInvoice';
import { securityDeductionInvoicePDF } from '../templates/securityDeductionInvoice';
import { mapAttributes } from '../util/attributes';
import {
  _get,
  decrypt,
  encrypt,
  formatPriceInDecimalPoints,
  generateRandomNumberInRange,
  generateRandomOperationNumber,
  getHtmlContentAndConfig,
} from '../util/common';
import { generatePayoutSheet } from '../util/excel';
import { DeltaMachineService } from './deltaMachineService';
import { LookupService } from './lookupService';
import { ProductService } from './productService';
import { SettingService } from './settingService';
import { VariantService } from './variantService';
import { DeltaMachineStatusName } from '../enums/DeltaMachineStatusName';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import {
  getProductSummaryCommission,
  getPromoCodeDetailsById,
  updatePromoCodeUsageCount,
} from '../grpc/commission';
import { DetailedPromoCode } from '../grpc/proto/commission/DetailedPromoCode';
import { JobTypes } from '../libs/bull.util';
import { BullMQService, Queues } from '../libs/bullmq.util';
import { SearchService } from './searchService';
import { getCache, setCache } from '../libs/redis';
import { AljufClient } from '../libs/aljufClient';
import { body } from 'express-validator/src';

const activityLogConfig: { [key: string]: string } = config.get('activitylog');

export interface MerchantMessage {
  eventType: string;
  userId: string;
  userName: string;
  orderId: string;
  orderNumber: string;
  dmOrderId: string;
  description: string;
  productId: string;
  productName: string;
  modelName: string;
  productGroupId: string;
  grandTotal: number;
}

@Service()
export class OrderService {
  constructor(
    public deltaMachineRepository: DeltaMachineRepository,
    public settingRepository?: SettingRepository,
    public invoiceRepository?: InvoiceRepository,
    public orderRepository?: OrderRepository,
    public userRepository?: UserRepository,
    public paymentLogRepository?: PaymentLogRepository,
    public payoutHistoryRepository?: PayoutHistoryRepository,
    public addressRepository?: AddressRepository,
    public dmoPayoutRefundHistoryRepository?: DmoPayoutRefundHistoryRepository,
    public bankRepository?: BankRepository,
    public productRepository?: ProductRepository,
    public lookupService?: LookupService,
    public sequenceRepository?: SequenceRepository,
    public deltaMachineService?: DeltaMachineService,
    public productService?: ProductService,
    public error?: ErrorResponseDto,
    public settingService?: SettingService,
    public variantService?: VariantService,
    public variantRepository?: VariantRepository,
    public bullMQService?: BullMQService,
    public searchService?: SearchService
  ) {
    this.productService = Container.get(ProductService);
    this.deltaMachineService = Container.get(DeltaMachineService);
    this.searchService = Container.get(SearchService);
  }

  async createUniqueRandomInvoiceNo(invoiceType: string) {
    try {
      let isExist = false;
      let invoiceNo = '';
      do {
        invoiceNo = generateRandomNumberInRange(1, 999999).toString();
        const [err, data] = await this.invoiceRepository.getExistingInvoiceNo(
          invoiceNo,
          invoiceType
        );
        if (err) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.toString();
          this.error.message = data.message;
          throw this.error;
        }
        isExist = data.result as boolean;
      } while (isExist);

      return invoiceNo;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_BILL_NO,
          exception.message
        );
      }
    }
  }

  async generateInvoiceNo(invoiceType: string) {
    try {
      const [err, data] = await this.settingRepository.getSettingByKey(
        'setting_invoice'
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const setting_invoice = JSON.parse(data.value);
      if (invoiceType === 'buyer') {
        const setting_buyer = setting_invoice.buyer;
        const number_of_digits =
          setting_buyer.invoice_length - setting_buyer.prefix.length;

        const currentNumberOfBuyerInvoice = setting_buyer.current_number + 1;
        // update current number in setting invoice
        await this.settingRepository.updateInvoiceNoSetting(
          'buyer',
          currentNumberOfBuyerInvoice
        );

        const initInvoiceNo = await this.createUniqueRandomInvoiceNo(
          invoiceType
        );
        return (
          setting_buyer.prefix +
          (initInvoiceNo + '').padStart(number_of_digits, '0')
        );
      }

      if (
        invoiceType === InvoiceType.SELLER ||
        invoiceType === InvoiceType.LISTING_FEE ||
        invoiceType === InvoiceType.SECURITY_FEE_DEDUCTION ||
        invoiceType === InvoiceType.CREDIT_DEDUCTION
      ) {
        const setting_seller = setting_invoice.seller;
        const number_of_digits =
          setting_seller.invoice_length - setting_seller.prefix.length;

        const currentNumberOfSellerInvoice = setting_seller.current_number + 1;
        // update current number in setting invoice
        await this.settingRepository.updateInvoiceNoSetting(
          'seller',
          currentNumberOfSellerInvoice
        );

        const initInvoiceNo = await this.createUniqueRandomInvoiceNo(
          invoiceType
        );
        return (
          setting_seller.prefix +
          (initInvoiceNo + '').padStart(number_of_digits, '0')
        );
      }

      return null;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_BILL_NO,
          exception.message
        );
      }
    }
  }

  mappingToInvoiceType(data: InvoiceDocument, type: string = '') {
    const invoice: InvoiceTypeInput = {
      id: data._id,
      order: data.order,
      bill_type: data.bill_type,
      invoice_number: data.invoice_number,
      tax_invoice_number: data.tax_invoice_number,
      issue_date:
        type.length > 0
          ? data.issue_date
          : moment(data.issue_date).format('DD-MMMM-yyyy'),
      bill_to: data.bill_to,
      billed_by_cor: data.billed_by_cor,
      billed_by_seller: data.billed_by_seller,
      address: data.address,
      commission_detail: JSON.parse(data.commission_detail) || null,
      order_detail: JSON.parse(data.order_detail) || null,
      total_taxable_amount: data.total_taxable_amount,
      total_vat: data.total_vat,
      total_amount_due: data.total_amount_due,
      total_amount_due_device: data.total_amount_due_device || 0,
      total_discount: data.total_discount,
      net_amount: data.net_amount || 0,
      shipping_charge: data.shipping_charge || 0,
      delivery_fee: data.delivery_fee || 0,
      penalty_fee: data?.penalty_fee || 0,
      ZATCA_invoice_number: data.ZATCA_invoice_number,
      credit_note_invoice_number: data.credit_note_invoice_number,
      mobile_number: data.mobile_number,
      order_number: data.order_number,
      qr_code: data.qr_code,
      product: data.product,
      date_of_supply: moment(
        new Date(data?.date_of_supply || new Date())
      ).format('DD-MMMM-yyyy'),
      soum_logo: process.env.INVOICES_SOUM_LOGO,
      invoice_urls: data.invoice_urls || [],
      invoice_migrated: data.invoice_migrated,
      addOnsSummary: data?.addOnsSummary || null,
      storeVatNumber: data?.storeVatNumber || 'NA',
    };
    return invoice;
  }

  getTLVForValue(tagNum: string, tagValue: string, tagLength: string = null) {
    const tagBuf = Buffer.from(tagNum, 'utf8');
    const tagValueLenBuf = Buffer.from(
      !tagLength ? tagValue.length + '' : tagLength,
      'utf8'
    );
    const tagValueBuf = Buffer.from(tagValue, 'utf8');
    const bufferArray = [tagBuf, tagValueLenBuf, tagValueBuf];
    return Buffer.concat(bufferArray);
  }

  generateQRCode(req: IQRCode) {
    try {
      const issuerName = this.getTLVForValue('1', req.issuer_name);
      const vat = this.getTLVForValue('2', req.vat, '15');
      const timeStamp = this.getTLVForValue('3', req.timeStamp, '20');
      const totalVAT = this.getTLVForValue('4', req.total_vat);
      const totalAmountDue = this.getTLVForValue('5', req.total_amount_due);

      const tagsBuffArray = [
        issuerName,
        vat,
        timeStamp,
        totalVAT,
        totalAmountDue,
      ];
      const qrCodeBuf = Buffer.concat(tagsBuffArray);
      return qrCodeBuf.toString('base64');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_QR,
          exception.message
        );
      }
    }
  }

  async checkPromoCodeInOrder(order: OrderDocument) {
    try {
      if (order.promos?.buyerPromocodeId) {
        return await getPromoCodeDetailsById(order.promos.buyerPromocodeId);
      }

      return null;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.PROMO_CODE_NOT_FOUND,
          exception.message
        );
      }
    }
  }

  getSellPrice(orderDetails: OrderDocument): number {
    try {
      let sellPrice = orderDetails?.product?.sell_price;
      if (
        orderDetails?.buy_type === 'Bid' &&
        orderDetails?.product?.bidding.length > 0
      ) {
        for (const bid of orderDetails?.product?.bidding || []) {
          if ((bid.bid_status || '') == 'accepted') {
            sellPrice = Number(bid.bid_price) || 0;
            break;
          }
        }
      }
      return sellPrice || 0;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SELL_PRICE,
        exception.message
      );
    }
  }
  async addNewCreditDeductionInvoice(unitPrice: number, order: OrderDocument) {
    const product = order.product;
    const [errVAT, settingVAT] = await this.settingRepository.getSettingByKey(
      'vat_percentage'
    );
    if (errVAT) {
      this.error.errorCode = settingVAT.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = settingVAT.toString();
      this.error.message = settingVAT.message;
      throw this.error;
    }
    const vatValue = Number(
      _get(order, 'seller_payout_detail.vat', settingVAT.value)
    );
    const VAT = formatPriceInDecimalPoints(vatValue / 100);
    const amountFee = formatPriceInDecimalPoints(unitPrice / (1 + VAT));

    const itemInvoiceSeller: CreditDeductionInvoice = {
      device_en: product.model?.model_name + '-' + product.varient,
      device_ar: product.model?.model_name_ar + '-' + product.varient_ar,
      unit_price: amountFee,
      discount: formatPriceInDecimalPoints(0),
      unit_price_after_discount: amountFee,
      quantity: 1,
      tax: formatPriceInDecimalPoints(unitPrice - amountFee),
      vat: `STD ${vatValue}%`,
      sub_total: formatPriceInDecimalPoints(unitPrice),
    };

    const totalTaxableAmount = itemInvoiceSeller.unit_price_after_discount;
    const totalVAT = itemInvoiceSeller.tax;
    const totalAmountDueSeller = formatPriceInDecimalPoints(unitPrice);
    const taxInvoiceNo = await this.generateInvoiceNo('credit-deduction');
    if (!taxInvoiceNo) {
      this.error.errorCode = Constants.ERROR_CODE.UNAUTHORIZED;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = Constants.ERROR_MAP.UNAUTHORIZED_USER;
      this.error.message =
        "Unauthorized - User try to access another invoice's user";
      throw this.error;
    }
    const issueDate = this.generateIssueDate(order);
    const [sequenceErr, sequenceResult] =
      await this.sequenceRepository.getValueForNextSequence(
        SequenceType.ZATCA_INVOICE_NUMBER
      );
    if (sequenceErr) throw new Error('Could not generate invoice number');

    const qrCode: IQRCode = {
      issuer_name: Constants.INVOICE.QR_CODE.ISSUER_NAME,
      vat: Constants.INVOICE.QR_CODE.VAT_CODE,
      timeStamp: moment().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      total_vat: totalVAT + '',
      total_amount_due: totalAmountDueSeller.toString(),
    };
    const invoice: InvoiceTypeInput = {
      order: order._id,
      bill_type: 'credit-deduction',
      invoice_number: null,
      tax_invoice_number: taxInvoiceNo,
      issue_date: issueDate,
      bill_to: order.seller.name || '',
      billed_by_cor: Constants.INVOICE.BILLED_BY_COR,
      billed_by_seller: null,
      ZATCA_invoice_number:
        process.env.INVOICES_INV_PREFIX + (sequenceResult.result as number),
      credit_note_invoice_number: null,
      address: `${order?.seller?.address?.address || 'NA'} -
          ${order?.seller?.address?.city || 'NA'} -
          ${order?.seller?.address?.postal_code || 'NA'}`,
      order_detail: itemInvoiceSeller,
      commission_detail: null,
      total_taxable_amount: totalTaxableAmount,
      total_vat: totalVAT,
      total_amount_due: totalAmountDueSeller,
      total_amount_due_device: null,
      total_discount: 0,
      net_amount: 0,
      commission: null,
      vat: vatValue,
      shipping_charge: 0,
      qr_code: await QRCode.toDataURL(this.generateQRCode(qrCode), {
        errorCorrectionLevel: 'H',
      }),
      mobile_number: order.seller.mobileNumber,
      order_number: order.order_number,
      product: order.product._id,
      date_of_supply: moment(new Date(order.product.createdDate)).format(
        'YYYY-MM-DD'
      ),
      invoice_urls: [],
    };

    // save invoice
    const [errNewInvoice, newInvoice] =
      await this.invoiceRepository.addNewInvoice(invoice);
    if (errNewInvoice) {
      this.error.errorCode = newInvoice.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = newInvoice.result.toString();
      this.error.message = newInvoice.message;
      throw this.error;
    }
    return newInvoice.result as InvoiceDocument;
  }
  async addNewInvoice(
    invoiceType: string,
    sellPrice: number,
    order: OrderDocument
  ) {
    const result = await this.calculateAmountConfigSeller(
      invoiceType,
      sellPrice,
      order
    );
    // save invoice
    const [errNewInvoice, newInvoice] =
      await this.invoiceRepository.addNewInvoice(result);
    if (errNewInvoice) {
      this.error.errorCode = newInvoice.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = newInvoice.result.toString();
      this.error.message = newInvoice.message;
      throw this.error;
    }
    return newInvoice.result as InvoiceDocument;
  }

  async getCreditDeductionInvoiceDetail(orderId: string) {
    try {
      // check if user has already invoice
      const [errInvoice, invoice] =
        await this.invoiceRepository.getInvoiceWithOrderId(
          orderId,
          'credit-deduction'
        );
      if (errInvoice) {
        this.error.errorCode = invoice.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = invoice.result.toString();
        this.error.message = invoice.message;
        throw this.error;
      }
      let currentInvoice = invoice.result as InvoiceDocument;
      if (currentInvoice)
        return [false, this.mappingToInvoiceType(currentInvoice)];

      const [err, data] =
        await this.orderRepository.getOrderDataForGeneratingInvoice(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      order.promos = null;
      // get listing fee from wallet settings
      const walletListingFeeSettings: any = await GetListingFee({
        settingKey: 'sellerDepositList',
      });
      const listingFee = Number(walletListingFeeSettings.listingFee || 0);
      currentInvoice = await this.addNewCreditDeductionInvoice(
        listingFee,
        order
      );
      const mappingInvoice = this.mappingToInvoiceType(currentInvoice);
      const output = Mustache.render(creditDeductionInvoicePDF, mappingInvoice);
      const invoiceBuffer = await generatePDF(output, {
        width: 900,
        height: 1400,
      });
      await uploadInvoice(
        `${mappingInvoice.id}-seller-CD-V1.pdf`,
        invoiceBuffer
      );
      await this.invoiceRepository.updateCDInvoiceUrl(
        mappingInvoice?.id.toString(),
        {
          version: 1,
          url: `${process.env.INVOICES_AWS_S3_ENDPOINT}/${mappingInvoice.id}-seller-CD-V1.pdf`,
          create_at: new Date(),
          invoice_format: InvoiceFormats.SOUM,
        } as InvoiceUrl
      );

      return [false, mappingInvoice];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          exception.message
        );
      }
    }
  }
  async getInvoiceDetail(invoiceType: any, orderId: string) {
    try {
      // check if user has already invoice
      const [errInvoice, invoice] =
        await this.invoiceRepository.getInvoiceWithOrderId(
          orderId,
          invoiceType
        );
      if (errInvoice) {
        this.error.errorCode = invoice.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = invoice.result.toString();
        this.error.message = invoice.message;
        throw this.error;
      }
      let currentInvoice = invoice.result as InvoiceDocument;
      if (currentInvoice)
        return [false, this.mappingToInvoiceType(currentInvoice)];
      const [err, data] =
        await this.orderRepository.getOrderDataForGeneratingInvoice(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      order.promos =
        invoiceType === 'buyer'
          ? await this.checkPromoCodeInOrder(order)
          : null;

      const sellPrice = this.getSellPrice(order);
      currentInvoice = await this.addNewInvoice(invoiceType, sellPrice, order);
      const mappingInvoice = this.mappingToInvoiceType(currentInvoice);
      return [false, mappingInvoice];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          exception.message
        );
      }
    }
  }
  async addNewSecurityDeductionInvoice(
    walletTransaction: TransactionResponse,
    order: OrderDocument
  ) {
    const unitPrice = Number(walletTransaction.amount || 0);
    const [errVAT, settingVAT] = await this.settingRepository.getSettingByKey(
      'vat_percentage'
    );
    if (errVAT) {
      this.error.errorCode = settingVAT.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = settingVAT.toString();
      this.error.message = settingVAT.message;
      throw this.error;
    }
    const vatValue = Number(
      _get(order, 'seller_payout_detail.vat', settingVAT.value)
    );
    const VAT = formatPriceInDecimalPoints(vatValue / 100);
    const amountFee = formatPriceInDecimalPoints(unitPrice / (1 + VAT));
    const itemInvoiceSeller: SecurityDeductionInvoice = {
      device_en: 'Listing Fee',
      device_ar: 'رسوم الإدراج',
      unit_price: amountFee,
      discount: 0,
      unit_price_after_discount: amountFee,
      quantity: 1,
      tax: formatPriceInDecimalPoints(unitPrice - amountFee),
      vat: `STD ${vatValue}%`,
      sub_total: formatPriceInDecimalPoints(unitPrice),
    };

    const totalTaxableAmount = itemInvoiceSeller.unit_price_after_discount;
    const totalVAT = itemInvoiceSeller.tax;
    const totalAmountDueSeller = formatPriceInDecimalPoints(unitPrice);
    const taxInvoiceNo = await this.generateInvoiceNo(
      InvoiceType.SECURITY_FEE_DEDUCTION
    );
    if (!taxInvoiceNo) {
      this.error.errorCode = Constants.ERROR_CODE.UNAUTHORIZED;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = Constants.ERROR_MAP.UNAUTHORIZED_USER;
      this.error.message =
        "Unauthorized - User try to access another invoice's user";
      throw this.error;
    }
    const issueDate = moment(
      new Date(Number(walletTransaction.createdAt)).toISOString()
    ).format('MM/DD/YYYY hh:mm:ss');
    const [sequenceErr, sequenceResult] =
      await this.sequenceRepository.getValueForNextSequence(
        SequenceType.ZATCA_INVOICE_NUMBER
      );
    if (sequenceErr) throw new Error('Could not generate invoice number');

    const qrCode: IQRCode = {
      issuer_name: Constants.INVOICE.QR_CODE.ISSUER_NAME,
      vat: Constants.INVOICE.QR_CODE.VAT_CODE,
      timeStamp: moment().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      total_vat: totalVAT + '',
      total_amount_due: totalAmountDueSeller.toString(),
    };
    const invoice: InvoiceTypeInput = {
      order: order._id,
      bill_type: InvoiceType.SECURITY_FEE_DEDUCTION,
      invoice_number: null,
      tax_invoice_number: taxInvoiceNo,
      issue_date: issueDate,
      bill_to: order.seller.name || '',
      billed_by_cor: Constants.INVOICE.BILLED_BY_COR,
      billed_by_seller: null,
      ZATCA_invoice_number:
        process.env.INVOICES_INV_PREFIX + (sequenceResult.result as number),
      credit_note_invoice_number: null,
      address: `${order?.seller?.address?.address || 'NA'} -
          ${order?.seller?.address?.city || 'NA'} -
          ${order?.seller?.address?.postal_code || 'NA'}`,
      order_detail: itemInvoiceSeller,
      commission_detail: null,
      total_taxable_amount: totalTaxableAmount,
      total_vat: totalVAT,
      total_amount_due: totalAmountDueSeller,
      total_amount_due_device: null,
      total_discount: 0,
      net_amount: 0,
      commission: null,
      vat: vatValue,
      shipping_charge: 0,
      qr_code: await QRCode.toDataURL(this.generateQRCode(qrCode), {
        errorCorrectionLevel: 'H',
      }),
      mobile_number: order.seller.mobileNumber,
      order_number: order.order_number,
      product: order.product._id,
      date_of_supply: moment(new Date(order.product.createdDate)).format(
        'YYYY-MM-DD'
      ),
      invoice_urls: [],
    };

    // save invoice
    const [errNewInvoice, newInvoice] =
      await this.invoiceRepository.addNewInvoice(invoice);
    if (errNewInvoice) {
      this.error.errorCode = newInvoice.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = newInvoice.result.toString();
      this.error.message = newInvoice.message;
      throw this.error;
    }
    return newInvoice.result as InvoiceDocument;
  }
  async getSecurityDeductionInvoiceDetail(
    transactionId: string,
    orderId: string
  ) {
    try {
      // check if user has already invoice
      const [errInvoice, invoice] =
        await this.invoiceRepository.getInvoiceWithOrderId(
          orderId,
          InvoiceType.SECURITY_FEE_DEDUCTION
        );
      if (errInvoice) {
        this.error.errorCode = invoice.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = invoice.result.toString();
        this.error.message = invoice.message;
        throw this.error;
      }
      let currentInvoice = invoice.result as InvoiceDocument;
      if (currentInvoice)
        return [
          false,
          this.mappingToInvoiceType(
            currentInvoice,
            InvoiceType.SECURITY_FEE_DEDUCTION
          ),
        ];

      const [err, data] =
        await this.orderRepository.getOrderDataForGeneratingInvoice(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      // get security fee from wallet transaction
      const walletTransaction: TransactionResponse = await GetTransactionById({
        id: transactionId,
      });
      currentInvoice = await this.addNewSecurityDeductionInvoice(
        walletTransaction,
        order
      );
      const mappingInvoice = this.mappingToInvoiceType(
        currentInvoice,
        InvoiceType.SECURITY_FEE_DEDUCTION
      );
      const output = Mustache.render(
        securityDeductionInvoicePDF,
        mappingInvoice
      );
      const invoiceBuffer = await generatePDF(output, {
        width: 900,
        height: 1400,
      });
      await uploadInvoice(
        `${mappingInvoice.id}-seller-SD-V1.pdf`,
        invoiceBuffer
      );
      await this.invoiceRepository.updateSDInvoiceUrl(
        mappingInvoice?.id.toString(),
        {
          version: 1,
          url: `${process.env.INVOICES_AWS_S3_ENDPOINT}/${mappingInvoice.id}-seller-SD-V1.pdf`,
          create_at: new Date(),
          invoice_format: InvoiceFormats.SOUM,
        } as InvoiceUrl
      );

      return [false, mappingInvoice];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          exception.message
        );
      }
    }
  }
  async getOrderDetail(
    orderId: string,
    orderOf: string = 'buyer'
  ): Promise<[boolean, { message: string; order: any }]> {
    try {
      if (orderOf !== 'seller' && orderOf !== 'buyer') {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        this.error.message = 'Invalid type of order';
        throw this.error;
      }
      const [err, data] =
        await this.orderRepository.getOrderDataWithProductDetails(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      order.promos =
        orderOf === 'buyer' ? await this.checkPromoCodeInOrder(order) : null;

      const [orderDetailsErr, orderDetails] = await this.calculateOrderDetail(
        orderOf,
        order
      );

      // remove promos to get original break down in case there was promos
      const orderWithoutPromos = Object.assign(order, { promos: null });
      const [orderDetailsWithoutPromoErr, orderDetailsWithoutPromo] =
        await this.calculateOrderDetail(orderOf, orderWithoutPromos);

      if (!orderDetailsErr && !orderDetailsWithoutPromoErr) {
        orderDetails.order.original_break_down = {
          // represent the original breakdown of order without any promo codes if found
          sell_price: orderDetailsWithoutPromo.order.sell_price,
          commission: orderDetailsWithoutPromo.order.commission,
          vat: orderDetailsWithoutPromo.order.vat,
          delivery_fee: orderDetailsWithoutPromo.order.delivery_fee,
          grand_total: orderDetailsWithoutPromo.order.grand_total,
        };
        orderDetails.order.totalDiscount =
          orderOf === 'buyer'
            ? formatPriceInDecimalPoints(
                orderDetailsWithoutPromo.order.grand_total -
                  orderDetails.order.grand_total
              )
            : 0;
        orderDetails.order.reservation =
          orderDetailsWithoutPromo.order.reservation;
        orderDetails.order.financingRequest =
          orderDetailsWithoutPromo.order.financingRequest;
        orderDetails.order.isFinancingEmailSent = order.isFinancingEmailSent;
      }
      if (order?.seller?.tags) {
        orderDetails.order.product.tags = order?.seller?.tags.pop()?.name;
      }
      orderDetails.order.isConsignment = order?.isConsignment;
      return [orderDetailsErr, orderDetails];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          exception.message
        );
      }
    }
  }

  async calculateOrderDetail(
    orderOf: string,
    order: OrderDocument
  ): Promise<[boolean, { message: string; order: any }]> {
    let commissionSummary =
      await this.productService.getProductSummaryCommission({
        orderId: orderOf == 'buyer' ? order?._id.toString() : null,
        productId: order.product?._id.toString(),
        isBuyer: orderOf == 'buyer' ? true : false,
        isOriginalBreakDown: order?.promos ? false : true,
      });
    if (!commissionSummary) {
      const [, productResult] = await this.productRepository.getProductById(
        order.product
      );
      const product: ILegacyProductModel =
        productResult.result as ILegacyProductModel;

      commissionSummary =
        await this.productService.createSummaryCommissionMigration({
          product: {
            id: order.product._id.toString(),
            sellPrice:
              order?.buy_type === 'Bid' ? order.buy_amount : product.sell_price,
            modelId: product.model_id,
            varientId: product.varient_id,
            grade: product.grade,
            categoryId: product.category_id,
          },
          promoCode: order?.promos || null,
          sellerId: product.user_id,
          isCommissionForBuyer: orderOf == 'buyer' ? true : false,
          source: null,
          sysSettings: order.billingSettings,
          orderId: order._id,
        });
    }

    const [errSettings, sysSettings] =
      await this.settingService.getSettingsObjectByKeys([
        'delivery_fee',
        'delivery_threshold',
        'apply_delivery_fee',
        'apply_referral_codes',
        'referral_discount_type',
        'referral_percentage',
        'referral_fixed_amount',
        'buyer_commission_percentage',
        'seller_commission_percentage',
        'vat_percentage',
        'apply_delivery_fee_mpps',
        'apply_delivery_fee_spps',
        'price_quality_extra_commission',
        'listing_fees',
        'shipping_charge_percentage',
      ]);

    const settings: { [key: string]: any } = {
      ...sysSettings,
      ...order.billingSettings,
    };

    if (errSettings) {
      return [
        true,
        {
          message: Constants.MESSAGE.FAILED_TO_GET_SETTING,
          order: {
            id: order._id.toString(),
            order_number: order.order_number,
            order_date: order.updated_at || order.created_at,
            commission: 0,
            vat: 0,
            sell_price: 0,
            sell_discount: 0,
            shipping_charge: 0,
            commission_discount: 0,
            grand_total: 0,
            product: order.product,
            createdAt: order.created_at,
            paymentType: order.payment_type,
            price_quality_extra_commission: null,
          },
        },
      ];
    }
    let listingFee = settings['listing_fees'];
    if (!listingFee) {
      listingFee = 0;
    }
    const threshold = settings['delivery_threshold'];
    const applyDeliveryFee = settings['apply_delivery_fee'];
    const setting_commission = formatPriceInDecimalPoints(
      (Number(commissionSummary.commission) /
        Number(commissionSummary.sellPrice)) *
        100
    );
    const vat =
      orderOf == 'buyer'
        ? formatPriceInDecimalPoints(
            order?.addOns?.addOnsVat
              ? Number(commissionSummary.totalVat) +
                  Number(order.addOns.addOnsVat)
              : commissionSummary.totalVat
          )
        : commissionSummary.totalVat;
    return [
      false,
      {
        message: Constants.MESSAGE.GET_ORDER_DETAIL_SUCCESS,
        order: {
          id: order._id.toString(),
          order_number: order.order_number,
          order_date: order.updated_at || order.created_at,
          promo_code: order.promos?.code || '',
          commission: commissionSummary.commission,
          commission_discount: commissionSummary.commissionDiscount,
          vat: vat,
          sell_price: commissionSummary.sellPrice,
          delivery_fee: commissionSummary.deliveryFee,
          shipping_charge: commissionSummary.deliveryFee || 0,
          grand_total: commissionSummary.grandTotal,
          sell_discount: formatPriceInDecimalPoints(
            Number(commissionSummary.discount) -
              Number(commissionSummary.commissionDiscount)
          ),
          commissionAnalysis: commissionSummary.commissionAnalysis || {},
          product: order.product,
          promos: order.promos,
          createdAt: order.created_at,
          paymentType: order.payment_type,
          seller: order.seller?._id,
          sellerPhoneNumber: `+${order?.seller?.countryCode || ''}${
            order?.seller?.mobileNumber || ''
          }`,
          buyerPhoneNumber: `+${order?.buyer?.countryCode || ''}${
            order?.buyer?.mobileNumber || ''
          }`,
          buyer: order.buyer?._id,
          listingFee,
          setting_commission: setting_commission,
          settings: {
            buyer_commission_percentage: settings?.buyer_commission_percentage,
            seller_commission_percentage:
              settings?.seller_commission_percentage,
            shipping_charge_percentage: settings?.shipping_charge_percentage,
            vat_percentage: settings?.vat_percentage,
            referral_discount_type: settings?.referral_discount_type,
            referral_percentage: settings?.referral_percentage,
            referral_fixed_amount: settings?.referral_fixed_amount,
            delivery_threshold: threshold,
            apply_delivery_fee: applyDeliveryFee,
            delivery_fee: commissionSummary.deliveryFee,
            price_quality_extra_commission:
              settings?.price_quality_extra_commission,
          },
          price_quality_extra_commission:
            settings?.price_quality_extra_commission,
          addOnsSummary: order.addOns,
          reservation: commissionSummary.reservation,
          financingRequest: commissionSummary.financingRequest,
        },
      },
    ];
  }
  generateIssueDate(order: OrderDocument) {
    try {
      let issueDate = moment().format('YYYY-MM-DD');
      if ((order.transaction_detail || '').length > 0) {
        const timeStamp =
          JSON.parse(order.transaction_detail || '{}')?.timestamp || null;
        if (timeStamp) {
          issueDate = moment(timeStamp).format('YYYY-MM-DD');
        }
      }
      return issueDate;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_ISSUE_DATE,
          exception.message
        );
      }
    }
  }

  async calculateAmountConfigSeller(
    invoiceType: string,
    sellPrice: number,
    order: OrderDocument,
    regeneratePDF: any = null
  ) {
    const product = order.product;
    const settingShippingCharge = 0;

    const withoutPromo = await this.productService.getProductSummaryCommission({
      orderId: invoiceType === 'buyer' ? order._id.toString() : null,
      isBuyer: invoiceType === 'buyer' ? true : false,
      isOriginalBreakDown: true,
      productId: order.product._id.toString(),
    });

    let withPromo = await this.productService.getProductSummaryCommission({
      orderId: invoiceType === 'buyer' ? order._id.toString() : null,
      isBuyer: invoiceType === 'buyer' ? true : false,
      isOriginalBreakDown: false,
      productId: order.product._id.toString(),
    });

    if (!withPromo) withPromo = withoutPromo;
    let penaltyFee = 0;
    if (invoiceType === 'seller') {
      const dmoData = await this.deltaMachineService.getDMOrderByOrderId(
        order._id.toString()
      );
      penaltyFee = dmoData?.orderData?.penalty || 0;
    }
    let deliveryFee = Number(withoutPromo.deliveryFee);
    let totalVat = Number(withoutPromo.totalVat);

    const commissionInvoice: CommissionInvoice = {
      commission_en: Constants.INVOICE.COMMISSION_TXT.EN,
      commission_ar: Constants.INVOICE.COMMISSION_TXT.AR,
      unit_price: Number(withoutPromo.commission),
      discount: 0,
      unit_price_after_discount: Number(withPromo.commission),
      quantity: 1,
      tax: Number(withoutPromo.commissionVat),
      sub_total: formatPriceInDecimalPoints(
        Number(withoutPromo.commission) + Number(withoutPromo.commissionVat)
      ),
    };
    if (penaltyFee > 0) {
      commissionInvoice.unit_price =
        Number(withoutPromo.commission) -
        Number(withoutPromo?.commissionAnalysis?.penaltyCommission || 0);
    }

    // only buyer will attach item's invoice - buying device
    const itemInvoice: DeviceInvoice = {
      device_en: product.model?.model_name + '-' + product.varient,
      device_ar: product.model?.model_name_ar + '-' + product.varient_ar,
      unit_price: Number(withoutPromo.sellPrice),
      discount: 0,
      unit_price_after_discount:
        invoiceType === 'buyer' ? Number(withPromo.sellPrice) : 0,
      quantity: 1,
      tax: 0,
      sub_total: invoiceType === 'buyer' ? Number(withPromo.sellPrice) : 0,
    };

    if (withPromo) {
      totalVat = Number(withPromo.totalVat);
      deliveryFee = Number(withPromo.deliveryFee);
      // Seller has discount
      commissionInvoice.discount = Number(withPromo.commissionDiscount);
      commissionInvoice.unit_price_after_discount = Number(
        withPromo.commission
      );
      commissionInvoice.tax = Number(withPromo.commissionVat);
      commissionInvoice.sub_total = formatPriceInDecimalPoints(
        commissionInvoice.unit_price_after_discount + commissionInvoice.tax
      );
    }
    const totalAmountDue = formatPriceInDecimalPoints(
      commissionInvoice.unit_price_after_discount + commissionInvoice.tax
    );
    const totalTaxableAmount = commissionInvoice.unit_price_after_discount;
    const totalDiscount =
      invoiceType === 'buyer'
        ? formatPriceInDecimalPoints(
            Number(withoutPromo.grandTotal) - Number(withPromo.grandTotal)
          )
        : 0;
    let taxInvoiceNo = null;
    let invoiceNo = null;
    const totalAmountDueDeviceBuyer = formatPriceInDecimalPoints(
      itemInvoice.unit_price_after_discount + itemInvoice.tax
    );
    if (!regeneratePDF) {
      taxInvoiceNo = await this.generateInvoiceNo(invoiceType);
      if (!taxInvoiceNo) {
        this.error.errorCode = Constants.ERROR_CODE.UNAUTHORIZED;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.UNAUTHORIZED_USER;
        this.error.message =
          "Unauthorized - User try to access another invoice's user";
        throw this.error;
      }
      invoiceNo =
        invoiceType === 'seller'
          ? null
          : await this.generateInvoiceNo(invoiceType);
    }
    // regenerate invoice from seller to buyer - buyer invoice has invoiceNo device
    if (regeneratePDF && invoiceType === 'buyer') {
      invoiceNo = await this.generateInvoiceNo(invoiceType);
    }

    const netAmount =
      invoiceType === 'seller'
        ? formatPriceInDecimalPoints(
            Number(withPromo.sellPrice) -
              (commissionInvoice.unit_price_after_discount +
                commissionInvoice.tax)
          )
        : formatPriceInDecimalPoints(
            itemInvoice.sub_total +
              commissionInvoice.sub_total +
              deliveryFee +
              totalVat -
              commissionInvoice.tax
          );
    const issueDate = this.generateIssueDate(order);

    const [sequenceErr, sequenceResult] =
      await this.sequenceRepository.getValueForNextSequence(
        SequenceType.ZATCA_INVOICE_NUMBER
      );
    const [creditSequenceErr, creditSequenceResult] =
      await this.sequenceRepository.getValueForNextSequence(
        SequenceType.CREDIT_NOTE_INVOICE_NUMBER
      );
    if (sequenceErr || creditSequenceErr)
      throw new Error('Could not generate invoice number');

    const qrCode: IQRCode = {
      issuer_name: Constants.INVOICE.QR_CODE.ISSUER_NAME,
      vat: Constants.INVOICE.QR_CODE.VAT_CODE,
      timeStamp: moment().format('YYYY-MM-DD[T]HH:mm:ss[Z]'),
      total_vat: commissionInvoice.tax + '',
      total_amount_due: totalAmountDue.toString(),
    };

    const invoice: InvoiceTypeInput = {
      order: order._id,
      bill_type: invoiceType,
      invoice_number: invoiceNo,
      tax_invoice_number: taxInvoiceNo,
      issue_date: issueDate,
      bill_to:
        invoiceType === 'buyer'
          ? order.buyer.name || ''
          : order.seller.name || '',
      storeVatNumber: order.seller.bankDetail?.storeVatNumber || 'NA',
      billed_by_cor: Constants.INVOICE.BILLED_BY_COR,
      billed_by_seller:
        invoiceType === 'buyer'
          ? /\s/.test(order.seller.name)
            ? order.seller.name || ''
            : (order.seller.name || '') + ' -'
          : null,
      ZATCA_invoice_number:
        process.env.INVOICES_INV_PREFIX + (sequenceResult.result as number),
      credit_note_invoice_number:
        process.env.INVOICES_CN_PREFIX +
        (creditSequenceResult.result as number),
      address:
        invoiceType === 'buyer'
          ? `${order?.buyer_address?.address} - ${order?.buyer_address?.city} - ${order?.buyer_address?.postal_code}`
          : `${order?.seller?.address?.address || 'NA'} -
          ${order?.seller?.address?.city || 'NA'} -
          ${order?.seller?.address?.postal_code || 'NA'}`,
      addOnsSummary: order?.addOns || null,
      order_detail: itemInvoice,
      commission_detail: commissionInvoice,
      total_taxable_amount: formatPriceInDecimalPoints(totalTaxableAmount),
      total_vat: formatPriceInDecimalPoints(totalVat),
      total_amount_due:
        invoiceType === 'seller'
          ? formatPriceInDecimalPoints(totalAmountDue)
          : formatPriceInDecimalPoints(totalAmountDue + deliveryFee),
      total_amount_due_device:
        invoiceType === 'buyer'
          ? formatPriceInDecimalPoints(totalAmountDueDeviceBuyer)
          : null,
      total_discount: formatPriceInDecimalPoints(totalDiscount),
      net_amount: formatPriceInDecimalPoints(netAmount),
      commission: Number(withoutPromo.commission),
      vat: formatPriceInDecimalPoints(withoutPromo.totalVat),
      shipping_charge: formatPriceInDecimalPoints(
        (settingShippingCharge * commissionInvoice.unit_price_after_discount) /
          100
      ),
      penalty_fee: formatPriceInDecimalPoints(penaltyFee),
      delivery_fee: formatPriceInDecimalPoints(deliveryFee),
      qr_code: await QRCode.toDataURL(this.generateQRCode(qrCode), {
        errorCorrectionLevel: 'H',
      }),
      mobile_number:
        invoiceType === 'buyer'
          ? order.buyer.mobileNumber
          : order.seller.mobileNumber,
      order_number: order.order_number,
      product: order.product._id,
      date_of_supply: moment(new Date(order.product.createdDate)).format(
        'YYYY-MM-DD'
      ),
      invoice_urls: [],
      invoice_migrated: true,
      city:
        invoiceType === 'buyer'
          ? order?.buyer_address?.city || 'NA'
          : order?.seller?.address?.city || 'NA',
      postalCode:
        invoiceType === 'buyer'
          ? order?.buyer_address?.postal_code || 'NA'
          : order?.seller?.address?.postal_code || 'NA',
      addr:
        invoiceType === 'buyer'
          ? order?.buyer_address?.address || 'NA'
          : order?.seller?.address?.address || 'NA',
      commissionAnalysis: withoutPromo.commissionAnalysis,
    };

    return invoice;
  }

  async removeInvoice(invoiceId: string) {
    try {
      if (!invoiceId) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_INVOICE;
        this.error.message = "Invoice id's undefined";
        throw this.error;
      }
      return await this.invoiceRepository.removeInvoice(invoiceId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_INVOICE,
          exception.message
        );
      }
    }
  }
  async getPayoutOrderInfo(orderId: string) {
    try {
      const [err, data] =
        await this.orderRepository.getOrderDataWithProductDetails(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      order.promos = null;

      const [errCal, dataCal] = await this.calculateOrderDetail(
        'seller',
        order
      );
      if (errCal) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_CALCULATE_ORDER;
        throw this.error;
      }
      const calOrder = dataCal.order;

      const start = moment(calOrder.order_date);
      const end = moment();
      const duration = Math.floor(moment.duration(end.diff(start)).asDays());
      const sellPrice = this.getSellPrice(order); // get sell_price or bid_price
      let IBAN = '';
      if ((order.seller.bankDetail || {}).hasOwnProperty('accountId')) {
        IBAN = decrypt(
          order.seller.bankDetail.accountId,
          order.seller.secretKey
        );
      }
      let bankName = '';
      if ((order.seller.bankDetail || {}).hasOwnProperty('bankName')) {
        bankName = order.seller.bankDetail.bankName;
      }

      const payout: PayoutSellerOrderDto = {
        order_id: order._id,
        product_id: order.product._id,
        product_name: order.product.model?.model_name,
        variant: order.product.varient,
        seller_name: order.seller.name,
        seller_phone: order.seller.countryCode + order.seller.mobileNumber,
        duration_of_created_order: duration,
        sell_price: formatPriceInDecimalPoints(sellPrice),
        commission: calOrder.setting_commission,
        commission_amount: calOrder.commission,
        vat: calOrder.vat,
        shipping_charge: calOrder.shipping_charge,
        net_seller: calOrder.grand_total,
        bank_name: bankName,
        iban: IBAN,
      };
      return payout;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_INVOICE,
          exception.message
        );
      }
    }
  }
  async checkExistingIBAN(
    orderId: string,
    currentIBAN: string,
    editIBAN: string
  ) {
    try {
      if (currentIBAN.length > 0 && currentIBAN !== editIBAN) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.IBAN_NOT_EXIST_FOR_USER;
        throw this.error;
      }
      const [errPayoutLog, payoutLog] =
        await this.payoutHistoryRepository.checkSuccessPayout(orderId);
      if (errPayoutLog) {
        this.error.errorCode = payoutLog.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = payoutLog.result.toString();
        throw this.error;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CHECK_EXISTING_IBAN,
          exception.message
        );
      }
    }
  }
  async updatePayoutOrderInfo(editPayoutInput: UpdatePayoutOrderInput) {
    try {
      const [err, data] =
        await this.orderRepository.getOrderDataWithProductDetails(
          editPayoutInput.order_id
        );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      const payout = await this.getPayoutOrderInfo(editPayoutInput.order_id);
      const currentCommission = Number(payout.commission);
      if (currentCommission != editPayoutInput.commission) {
        await this.productService.updateSellerCommission({
          sellerNewCommission: editPayoutInput.commission,
          product: {
            id: order.product._id.toString(),
          },
        });
        const payout = await this.getPayoutOrderInfo(editPayoutInput.order_id);
        const recordId: string = await AirTable.getAirTableRecordById(
          order.order_number
        );
        await AirTable.updateAirTableRecordCommissionAmountById(
          recordId,
          formatPriceInDecimalPoints(payout.commission_amount)
        );
      }
      const currentCommissionAmount = formatPriceInDecimalPoints(
        payout.commission_amount
      );
      if (
        editPayoutInput.commission_amount &&
        currentCommissionAmount !=
          formatPriceInDecimalPoints(editPayoutInput.commission_amount)
      ) {
        const newCommission = formatPriceInDecimalPoints(
          (editPayoutInput.commission_amount / payout.sell_price) * 100
        );
        await this.productService.updateSellerCommission({
          sellerNewCommission: newCommission,
          product: {
            id: order.product._id.toString(),
          },
        });
      }
      let currentIBAN = '';
      if ((order.seller.bankDetail || {}).hasOwnProperty('accountId')) {
        currentIBAN = decrypt(
          order.seller.bankDetail.accountId,
          order.seller.secretKey
        );
      }
      await this.checkExistingIBAN(
        editPayoutInput.order_id,
        currentIBAN,
        editPayoutInput.iban
      );
      const newIBAN = encrypt(editPayoutInput.iban, order.seller.secretKey);
      await this.userRepository.updateBankDetailUser(
        order.seller._id,
        newIBAN,
        null
      );

      let currentBankName = '';
      let currentBIC = '';
      let bankBIC = '';
      let currentAccountName = '';
      if ((order.seller.bankDetail || {}).hasOwnProperty('bankName')) {
        currentBankName = order.seller.bankDetail.bankName;
      }
      if ((order.seller.bankDetail || {}).hasOwnProperty('accountHolderName')) {
        currentAccountName = order.seller.bankDetail.accountHolderName;
      }
      if (currentBankName != editPayoutInput.bank_name) {
        await this.userRepository.updateBankDetailUser(
          order.seller._id,
          null,
          editPayoutInput.bank_name,
          null,
          null
        );
      }
      if ((order.seller.bankDetail || {}).hasOwnProperty('bankBIC')) {
        currentBIC = decrypt(
          order.seller.bankDetail.bankBIC,
          order.seller.secretKey
        );
      }
      const [, bankData] = await this.bankRepository.getBankCodeViaName(
        editPayoutInput.bank_name
      );
      const bankCode = (bankData.result as BankDocument).bankCode;
      if (currentBIC != bankCode) {
        bankBIC = encrypt(bankCode, order.seller.secretKey);
        await this.userRepository.updateBankDetailUser(
          order.seller._id,
          null,
          null,
          bankBIC,
          null
        );
      }
      if (currentAccountName != editPayoutInput.accountName) {
        await this.userRepository.updateBankDetailUser(
          order.seller._id,
          null,
          null,
          null,
          editPayoutInput.accountName
        );
      }
      return 'Update payout seller order successfully';
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SELLER_COMMISSION_ORDER,
          exception.message
        );
      }
    }
  }

  mappingPayoutStatus(status: string) {
    switch (status) {
      case 'Completed':
        return 'Successful';
      case 'Pending':
      case 'Processing':
        return 'Pending';
      case 'Failed':
      case 'Error':
      default:
        return 'Failed';
    }
  }
  async preProcessGetAccountId(userType: string, order: OrderDocument) {
    const bankBIC =
      userType === 'seller'
        ? decrypt(
            _get(order, 'seller.bankDetail.bankBIC', ''),
            _get(order, 'seller.secretKey', '')
          )
        : decrypt(
            _get(order, 'buyer.bankDetail.bankBIC', ''),
            _get(order, 'buyer.secretKey', '')
          );
    let accountId =
      userType === 'seller'
        ? decrypt(
            _get(order, 'seller.bankDetail.accountId', ''),
            _get(order, 'seller.secretKey', '')
          )
        : decrypt(
            _get(order, 'buyer.bankDetail.accountId', ''),
            _get(order, 'buyer.secretKey', '')
          );
    if (bankBIC == 'INMASARI') {
      accountId = accountId.substring(10);
    }
    return accountId;
  }
  async retrieveOrderDetailBeforeDoPayout(orderId: string, userType: string) {
    const [err, data] =
      await this.orderRepository.getOrderDataWithProductDetails(orderId);
    if (err) {
      this.error.errorCode = data.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = data.result.toString();
      this.error.message = data.message;
      throw this.error;
    }
    const order = data.result as OrderDocument;
    order.promos =
      userType === 'buyer' ? await this.checkPromoCodeInOrder(order) : null;

    const [errCal, dataCal] = await this.calculateOrderDetail(userType, order);
    if (errCal) {
      this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_CALCULATE_ORDER;
      throw this.error;
    }
    return {
      order: order,
      calOrder: dataCal.order,
    };
  }
  validateFixedAmount(payAmount: number, calOrder: any) {
    try {
      const limitMulti = Number(process.env.MULTI_GRAND_TOTAL_LIMIT);
      if (payAmount > Number(limitMulti * calOrder.grand_total)) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.INSTANT_REFUND_GREATER_THAN_GRAND_TOTAL;
        this.error.message = Constants.MESSAGE.TOTAL_REFUNDS_ABOVE_ORDER_TOTAL;
        throw this.error;
      }
      if (payAmount >= Number(process.env.FIXED_AMOUNT_PAYOUT_REFUND_LIMIT)) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey =
          Constants.ERROR_MAP.INSTANT_REFUND_GREATER_THAN_ALLOWED_PAYMENT;
        throw this.error;
      }
      return formatPriceInDecimalPoints(payAmount);
    } catch (exception) {
      console.log(exception);
      throw exception;
    }
  }

  async payoutOrderHyperSplit(
    orderId: string,
    payAmount: number,
    adName: string,
    paymentMethod: string = 'Payout',
    userType: string = 'seller'
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const regionConf = await this.settingService.getRegionConfigs();
      const { order, calOrder } = await this.retrieveOrderDetailBeforeDoPayout(
        orderId,
        userType
      );
      try {
        payAmount = this.validateFixedAmount(payAmount, calOrder);
      } catch (exception) {
        return [
          true,
          {
            code: exception.errorCode,
            result: exception.errorKey,
            message: exception.message,
          },
        ];
      }
      const [errAddress, addressResult] =
        userType === 'seller'
          ? await this.addressRepository.getUserAddress(
              _get(order, 'seller._id', '')
            )
          : await this.addressRepository.getUserAddress(
              _get(order, 'buyer._id', '')
            );
      if (errAddress) {
        this.error.errorCode = addressResult.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = addressResult.result.toString();
        this.error.message = addressResult.message;
        throw this.error;
      }
      const userAddress = (addressResult.result as AddressDocument[])[0];
      const { token, message } = await loginHyperSplits();
      if (!token) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_LOGIN_HYPER_SPLITS,
            message: message.toString(),
          },
        ];
      }
      const payoutSeller: PayoutSellerRequest = {
        orderNumber: order.order_number,
        seller: order.seller,
        sellerAmount: payAmount.toFixed(2),
        accessToken: token.toString(),
        address: userAddress,
      };
      const payoutBuyer: PayoutBuyerRequest = {
        orderNumber: order.order_number,
        buyer: order.buyer,
        buyerAmount: payAmount.toFixed(2),
        accessToken: token.toString(),
        address: userAddress,
      };
      const { bankBIC } =
        userType === 'seller'
          ? getDecodeBankAndBICFunc(userType, payoutSeller)
          : getDecodeBankAndBICFunc(userType, payoutBuyer);
      //check if bank is local or international
      const [, bankData] = await this.bankRepository.getBankDetailViaCode(
        bankBIC
      );
      const bank = bankData.result as BankDocument;
      payoutSeller.isNonSaudiBank = bank?.isNonSaudiBank;
      payoutBuyer.isNonSaudiBank = bank?.isNonSaudiBank;
      // save payment log
      const paymentLog =
        userType === 'seller'
          ? JSON.stringify({
              type: 'Payout input',
              data: {
                order_number: order.order_number,
                sellerData: order.seller,
                sellerAmount: payAmount,
                tokenData: token.toString(),
                swift: payoutSeller.isNonSaudiBank ? 1 : 0,
              },
            })
          : JSON.stringify({
              type: 'Instant refund input',
              data: {
                order_number: order.order_number,
                buyerData: order.buyer,
                buyerAmount: payAmount,
                tokenData: token.toString(),
                swift: payoutBuyer.isNonSaudiBank ? 1 : 0,
              },
            });
      await this.paymentLogRepository.addNewPaymentLogs(orderId, paymentLog);
      const [errPayout, payoutRes] =
        userType === 'seller'
          ? await createPayoutOrder(payoutSeller, userType, regionConf.currency)
          : await createPayoutOrder(payoutBuyer, userType, regionConf.currency);
      if (errPayout) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_MAKE_SELLER_PAYOUT,
            message: JSON.stringify(_get(payoutRes.splitData, 'errors', '')),
          },
        ];
      }
      const splitData = payoutRes.splitData;
      if (splitData && (splitData.errors || []).length > 0) {
        await this.paymentLogRepository.addNewPaymentLogs(
          orderId,
          JSON.stringify({
            type: 'Payout fail output',
            splitData,
          })
        );
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_PAYOUT_HYPER_SPLITS,
          },
        ];
      }
      // get specific order
      const uniqueId = _get(splitData, 'data.uniqueId', '');
      const accountId = await this.preProcessGetAccountId(userType, order);
      const [errSplitOrder, splitRes] = await this.getProcessSpecificOrder(
        orderId,
        accountId,
        uniqueId,
        token.toString()
      );
      if (errSplitOrder) {
        return [errSplitOrder, splitRes];
      }
      // get specific payout
      const batchId = splitRes.result;
      const { payoutStatus, transaction_timestamp } =
        await this.getLatestPayoutStatus(orderId, batchId, token.toString());
      const finalPayoutStatus = this.mappingPayoutStatus(payoutStatus);
      if (userType === 'seller') {
        // update payout history
        const payoutLog: PayoutHistoryInput = {
          order: orderId,
          product: _get(order, 'product._id', ''),
          seller: _get(order, 'seller._id', ''),
          hyper_splits_id: batchId,
          commission: calOrder.setting_commission,
          commission_amount: calOrder.commission,
          vat: calOrder.vat,
          shipping_charge: calOrder.shipping_charge,
          pay_amount: payAmount,
          bank_name: _get(order, 'seller.bankDetail.bankName', 'N/A'),
          iban: accountId,
          made_by: adName,
          status: finalPayoutStatus,
          transaction_timestamp: transaction_timestamp,
          swift: payoutSeller.isNonSaudiBank ? 1 : 0,
        };
        await this.payoutHistoryRepository.addNewPayoutHistory(payoutLog);
        await this.orderRepository.updateLastPayoutToSeller(
          orderId,
          finalPayoutStatus
        );
        if (finalPayoutStatus === 'Successful') {
          await this.paymentLogRepository.addNewPaymentLogs(
            orderId,
            JSON.stringify({
              type: 'Payout success output',
              splitData,
            })
          );
          const [errPayment, paymentRes] =
            await this.orderRepository.updatePaymentMadeToSeller(
              orderId,
              JSON.stringify(splitData),
              'Yes'
            );
          if (errPayment) {
            this.error.errorCode = paymentRes.code;
            this.error.errorType = Constants.ERROR_TYPE.API;
            this.error.errorKey = paymentRes.result.toString();
            this.error.message = paymentRes.message;
            throw this.error;
          }
        }
      }
      if (paymentMethod === 'Payout') {
        const payoutId = await this.generateTransactionId('payout');
        const paymentLogDmo: PayoutRefundHistoryInput = {
          dmoTransactionId: payoutId,
          orderId: orderId,
          transactionType: 'Payout',
          transactionStatus:
            finalPayoutStatus === 'Successful' ? 'Success' : finalPayoutStatus,
          paymentMethod: 'Transfer',
          amount: payAmount,
          paymentGatewayTransactionId: uniqueId,
          transactionTimestampFromHyperpay: moment(
            transaction_timestamp
          ).format('DD/MM/YYYY hh:mm:ss A'),
          transactionTimestamp: moment().toISOString(),
          doneBy: adName,
          swift: payoutSeller.isNonSaudiBank ? 1 : 0,
        };
        await this.dmoPayoutRefundHistoryRepository.addPayoutRefundHistory(
          paymentLogDmo
        );
      }

      if (paymentMethod === 'Instant Refund') {
        const payoutId = await this.generateTransactionId('refund');
        const paymentLogDmo: PayoutRefundHistoryInput = {
          dmoTransactionId: payoutId,
          orderId: orderId,
          transactionType: 'Refund',
          transactionStatus:
            finalPayoutStatus === 'Successful' ? 'Success' : finalPayoutStatus,
          paymentMethod: 'Instant Refund',
          amount: payAmount,
          paymentGatewayTransactionId: uniqueId,
          transactionTimestampFromHyperpay: moment(
            transaction_timestamp
          ).format('DD/MM/YYYY hh:mm:ss A'),
          transactionTimestamp: moment().toISOString(),
          doneBy: adName,
          swift: payoutBuyer.isNonSaudiBank ? 1 : 0,
        };
        await this.dmoPayoutRefundHistoryRepository.addPayoutRefundHistory(
          paymentLogDmo
        );
      }
      if (finalPayoutStatus !== 'Successful') {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.UNPROCESSABLE_ENTITY,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_TRANSACTION,
          'Transaction status is ' + finalPayoutStatus
        );
      }
      if (userType === 'seller') {
        // deduct holding penalty after seller payout action
        const dmoData = await this.deltaMachineService.getDMOrderByOrderId(
          orderId
        );
        await UpdateHoldingPenalty({
          sellerId: _get(order, 'seller._id', ''),
          dmoId: dmoData?._id,
          isPayout: true,
        });
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            isSuccess: finalPayoutStatus === 'Successful',
            transactionStatus: finalPayoutStatus,
            message: 'Payout action was successfully executed',
          },
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_SELLER,
          exception.message
        );
      }
    }
  }

  async getLatestPayoutStatus(orderId: string, batchId: string, token: string) {
    let payoutStatus = '';
    let transaction_timestamp = '';
    try {
      do {
        const [errSplitPayout, splitPayoutRes] = await getSpecificPayout(
          batchId,
          token.toString()
        );
        if (errSplitPayout) {
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SPECIFIC_PAYOUT,
            JSON.stringify(_get(splitPayoutRes.splitData, 'errors', ''))
          );
        }
        const splitPayout = splitPayoutRes.splitData;
        if (splitPayout && (splitPayout.errors || []).length > 0) {
          await this.paymentLogRepository.addNewPaymentLogs(
            orderId,
            JSON.stringify({
              type: 'Get specific payout fail output',
              splitPayout,
            })
          );
          throw new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_SPECIFIC_PAYOUT,
            JSON.stringify(_get(splitPayoutRes.splitData, 'errors', ''))
          );
        }
        payoutStatus = _get(splitPayout.data[0], 'PayoutStatus', '');
        transaction_timestamp = _get(splitPayout.data[0], 'created_at', '');
      } while (payoutStatus === 'Processing');
      return { payoutStatus, transaction_timestamp };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SPECIFIC_PAYOUT,
          exception.message
        );
      }
    }
  }

  async getPayoutHistory(orderId: string) {
    try {
      return await this.payoutHistoryRepository.getPayoutHistory(orderId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYOUT_HISTORY,
          exception.message
        );
      }
    }
  }

  async getProcessSpecificOrder(
    orderId: string,
    accountId: string,
    uniqueId: string,
    token: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    let batchId = 0;
    try {
      do {
        const [errSplitOrder, splitRes] = await getSpecificOrder(
          accountId,
          uniqueId,
          token.toString()
        );
        if (errSplitOrder) {
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.ERROR_MAP.FAILED_TO_GET_SPECIFIC_ORDER,
              message: JSON.stringify(_get(splitRes.splitData, 'errors', '')),
            },
          ];
        }
        const splitOrder = splitRes.splitData;
        if (splitOrder && (splitOrder.errors || []).length > 0) {
          await this.paymentLogRepository.addNewPaymentLogs(
            orderId,
            JSON.stringify({
              type: 'Get specific order fail output',
              splitOrder,
            })
          );
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.ERROR_MAP.FAILED_TO_GET_SPECIFIC_ORDER,
            },
          ];
        }
        // get specific payout
        batchId = _get(splitOrder.data[0], 'batch_id', null);
      } while (!batchId);
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: batchId,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SPECIFIC_PAYOUT,
          exception.message
        );
      }
    }
  }

  sendDailyPayoutReport = async (): Promise<
    [boolean, { result: any; message?: string }]
  > => {
    try {
      //  Get all orders within a month
      const [err, result] =
        await this.payoutHistoryRepository.getAllPayoutWithinPeriod('day');
      if (err) {
        this.error.errorCode = result.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.FAILED_TO_GET_ORDER;
        this.error.message = result.message;
        return await sendMail({
          to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
          subject: '[Alert] Daily payout report - Get Data Failed',
          text: result.message,
        });
      }

      // Create Excel file
      const title = `Payout from ${moment()
        .subtract(1, 'days')
        .format('D-MMM')} to ${moment().format('D-MMM')}`;
      const [genError, sheetContent] = await generatePayoutSheet(
        result.result as DailyPayoutSellerReportDto[],
        title
      );

      if (genError) {
        return await sendMail({
          to: (process.env.SENDGRID_NOTIFIED_USER as string).split(','),
          subject: '[Alert] Daily payout report - Generated Sheet Failed',
          text: JSON.stringify(sheetContent),
        });
      }

      // Send Email
      const sendTo: string =
        process.env.NODE_ENV === 'production'
          ? process.env.SENDGRID_TO_PROD
          : process.env.SENDGRID_TO_DEV;
      const [sendError, sendingResult] = await sendMail({
        to: sendTo.split(','),
        subject: `[Daily Payout Report]- ${title}`,
        // eslint-disable-next-line max-len
        html: '<p>Dear Soum Admin!</p><p> This is auto generated email for <strong>Daily Payout Report</strong>.</p><p>Thanks in advance</p><p>Tech Team</p>',
        fileName: `summary_orders_${new Date().toDateString()}.xlsx`,
        fileContent: sheetContent,
      });

      return [
        sendError,
        {
          message: Constants.MESSAGE.EMAIL_SENT,
          result: JSON.stringify(sendingResult),
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_SEND_PAYOUT_HISTORY_EMAIL,
          exception.message
        );
      }
    }
  };

  async getAllOrders(
    request: any
  ): Promise<
    [boolean, { orderList: any; totalResult: number; limit: number }]
  > {
    try {
      const regionConf = await this.settingService.getRegionConfigs();
      const limit = !request.query.limit ? 20 : +request.query.limit;
      const page = !request.query.page ? 1 : +request.query.page;
      let searchValue = request.query.searchValue;
      const dispute = request.query.dispute;

      const [errorUser, userData] =
        await this.userRepository.findAndGetUserViaMobilePhone(
          regionConf.code,
          searchValue
        );
      if (errorUser) {
        this.error.errorCode = userData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = userData.result.toString();
        this.error.message = userData.message;
      }
      const userFound = userData.result as LeanDocument<UserLegacyDocument>;
      if (userFound) {
        searchValue = userFound._id;
      }
      const [errorOrder, orderList] =
        await this.orderRepository.GetAllOrdersForAdminListing(
          page,
          limit,
          searchValue,
          dispute
        );
      if (errorOrder) {
        this.error.errorCode = orderList.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = orderList.result.toString();
        this.error.message = orderList.message;
      }
      const result = orderList.result[0].data;
      const total = orderList.result[0].metadata[0].total;

      result.map(async (item: any) => {
        item.isReadyToPayout =
          item.transaction_status == 'Success' &&
          item.dispute == 'No' &&
          item.paymentMadeToSeller == 'No'
            ? true
            : false;
      });

      return [
        false,
        {
          orderList: result,
          totalResult: total,
          limit: limit,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
          JSON.stringify(exception)
        );
      }
    }
  }

  async findOrdersById(orderIds: string[]): Promise<OrderDocument[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const orders: any = await this.orderRepository.findOrdersById(orderIds);
        resolve(orders);
      } catch (exception) {
        if (exception instanceof ErrorResponseDto) {
          reject(exception);
        } else {
          reject(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
              JSON.stringify(exception)
            )
          );
        }
      }
    });
  }

  async findOrdersByUserId(userId: string): Promise<OrderDocument[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const [, orders] = await this.orderRepository.getOrdersByUserId(userId);
        resolve(orders.result);
      } catch (exception) {
        if (exception instanceof ErrorResponseDto) {
          reject(exception);
        } else {
          reject(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
              JSON.stringify(exception)
            )
          );
        }
      }
    });
  }

  async findOrderById(orderId: string): Promise<OrderDocument> {
    return new Promise(async (resolve, reject) => {
      try {
        const [err, data] = await this.orderRepository.getById(orderId);
        if (err) {
          reject(err);
        } else {
          resolve(data.result as OrderDocument);
        }
      } catch (exception) {
        if (exception instanceof ErrorResponseDto) {
          reject(exception);
        } else {
          reject(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
              JSON.stringify(exception)
            )
          );
        }
      }
    });
  }

  async createUniqueRandomTransactionNo(
    prefix: string,
    numberOfDigits: number
  ) {
    try {
      let isExist = false;
      const initTransactionNo = generateRandomNumberInRange(
        1,
        9999999
      ).toString();
      const transactionId =
        prefix + (initTransactionNo + '').padStart(numberOfDigits, '0');
      do {
        const [err, data] =
          await this.dmoPayoutRefundHistoryRepository.getExistingTransactionId(
            transactionId
          );
        if (err) {
          this.error.errorCode = data.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = data.toString();
          this.error.message = data.message;
          throw this.error;
        }
        isExist = data.result as boolean;
      } while (isExist);

      return transactionId;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_BILL_NO,
          exception.message
        );
      }
    }
  }
  async generateTransactionId(transactionType: string) {
    try {
      const [err, data] = await this.settingRepository.getSettingByKey(
        'setting_transaction_dmo'
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const setting_transaction_dmo = JSON.parse(data.value);
      if (transactionType === 'payout') {
        const setting_payout = setting_transaction_dmo.payout;
        const number_of_digits =
          setting_payout.transaction_id_length - setting_payout.prefix.length;

        return await this.createUniqueRandomTransactionNo(
          setting_payout.prefix,
          number_of_digits
        );
      }
      if (transactionType === 'refund') {
        const setting_refund = setting_transaction_dmo.refund;
        const number_of_digits =
          setting_refund.transaction_id_length - setting_refund.prefix.length;
        return await this.createUniqueRandomTransactionNo(
          setting_refund.prefix,
          number_of_digits
        );
      }
      return null;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_TRANSACTION_ID_DMO,
          exception.message
        );
      }
    }
  }

  async validateOrder(
    orderGrandTotal: number,
    paymentProviderType: PaymentProviderType
  ) {
    const [errSettings, settings] =
      await this.settingRepository.getAllSettings();
    if (errSettings) throw new Error('settings was not found');

    if (!this.orderAllowedPaymentCheck(paymentProviderType, settings))
      return [true, 'Payment is not allowed'];
    if (!this.orderLimitCheck(orderGrandTotal, paymentProviderType, settings))
      return [true, 'Order grand total is higher than the limit'];

    return [false, 'Order checks was run correct'];
  }

  async orderLimitCheck(
    orderGrandTotal: number,
    paymentProviderType: PaymentProviderType,
    settings: any
  ) {
    let orderLimit = Number.MAX_VALUE;
    if (paymentProviderType == PaymentProviderType.TAMARA) {
      orderLimit =
        settings.find((elem: SettingDocument) => elem.name == 'tamara_limit')
          ?.value || orderLimit;
    }

    return orderLimit >= orderGrandTotal;
  }

  async orderAllowedPaymentCheck(
    paymentProviderType: PaymentProviderType,
    settings: any
  ) {
    if (paymentProviderType == PaymentProviderType.TAMARA) {
      return (
        settings.find(
          (elem: SettingDocument) => elem.name == 'allow_tamara_payment'
        )?.value || false
      );
    }
    return true;
  }

  calculateReservationForCategory(
    categoryId: string,
    sysSettings: { [key: string]: any }
  ) {
    let reservation = null;
    if (sysSettings.enable_reservation) {
      const reservationForCategory = (
        JSON.parse(sysSettings.categories_with_reservation) || []
      ).find((elem: any) => elem.categoryId == categoryId);
      reservation = reservationForCategory
        ? ({
            reservationAmount: reservationForCategory.amount,
          } as ReservationSummary)
        : null;
    }
    return reservation;
  }
  async createOrder(
    userInfo: any,
    purchaseProductDto: PurchaseProductDto,
    clientId: string,
    gtmClientId: string = '',
    gtmSessionId: string = ''
  ) {
    let isProductLockedForUser = false;
    const productId = purchaseProductDto.productId;
    const userId = userInfo._id.toString();
    try {
      const paymentModuleName =
        purchaseProductDto.paymentModule || PaymentModuleName.GENERAL_ORDER;

      const [errProd, productData] =
        await this.productRepository.getProductDetail(productId);
      const product =
        productData.result.length != 0 ? productData.result : null;

      if (errProd || !product)
        throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);

      const cacheKey = `${productId}_lock_for_${userId}`;

      const productAlreadyLockedForUser = await getCache(cacheKey);

      // if product locked for user then if it is not sold then user can buy.
      const productLockedForUser =
        productAlreadyLockedForUser &&
        product.sell_status !== ProductOrderStatus.Sold &&
        product.status === ProductStatus.Active;

      const productAvailableForUser =
        product.sell_status === ProductOrderStatus.Available &&
        product.status === ProductStatus.Active;
      if (!productLockedForUser && !productAvailableForUser) {
        throw new Error(Constants.MESSAGE.PRODUCT_UNAVAILABLE);
      }

      if (
        paymentModuleName !== PaymentModuleName.FINANCINGREQUEST &&
        !productAlreadyLockedForUser
      ) {
        isProductLockedForUser = await this.productRepository.lockProduct(
          productId
        );
        if (!isProductLockedForUser) {
          throw new Error(Constants.MESSAGE.PRODUCT_UNAVAILABLE);
        } else {
          await setCache(cacheKey, 1, 20 * 60); //20 minutes
        }
      }
      let promoCode = null;
      if (purchaseProductDto.promoCodeId) {
        promoCode = await getPromoCodeDetailsById(
          purchaseProductDto.promoCodeId
        );
      }
      const [errSettings, sysSettings] =
        await this.settingService.getSettingsObjectByKeys([
          'delivery_fee',
          'delivery_threshold',
          'apply_delivery_fee',
          'apply_referral_codes',
          'referral_discount_type',
          'referral_percentage',
          'referral_fixed_amount',
          'buyer_commission_percentage',
          'vat_percentage',
          'apply_delivery_fee_mpps',
          'apply_delivery_fee_spps',
          'price_quality_extra_commission',
          'categories_with_reservation',
          'enable_reservation',
          'enable_financing',
          'categories_with_financing',
        ]);
      if (errSettings) throw new Error('settings was not found');

      const orderId = new mongoose.Types.ObjectId();

      const selectedAddOns = purchaseProductDto?.addOns?.selectedAddOns || [];

      let reservation = null;
      if (
        sysSettings.enable_reservation &&
        paymentModuleName === PaymentModuleName.RESERVATION
      ) {
        reservation = this.calculateReservationForCategory(
          product.category_id.toString(),
          sysSettings
        );
        promoCode = null;
      }
      let financingRequest = null;
      if (
        sysSettings.enable_financing &&
        paymentModuleName === PaymentModuleName.FINANCINGREQUEST
      ) {
        const financingForCategory = (
          JSON.parse(sysSettings.categories_with_financing) || []
        ).find(
          (elem: any) => elem.categoryId == product.category_id.toString()
        );
        financingRequest = financingForCategory
          ? {
              amount: financingForCategory.amount,
            }
          : null;
        reservation = this.calculateReservationForCategory(
          product.category_id.toString(),
          sysSettings
        );
        if (financingRequest) promoCode = null;
      }

      const addOns =
        selectedAddOns?.length > 0
          ? selectedAddOns.map(({ id, addOnPrice }) => ({ id, addOnPrice }))
          : null;
      const buyerCommissionSummary =
        await this.productService.createSummaryCommission({
          product: {
            id: product.product_id.toString(),
            sellPrice:
              purchaseProductDto?.bidAmount > 0
                ? purchaseProductDto.bidAmount
                : product.sell_price,
            modelId: product.model_id,
            varientId: product.varient_id,
            grade: product.grade,
            categoryId: product.category_id,
            conditionId: product.condition_id,
          },
          promoCode: promoCode,
          sellerId: product.user_id,
          isCommissionForBuyer: true,
          source: null,
          sysSettings,
          orderId: orderId.toString(),
          paymentId: purchaseProductDto.paymentId,
          addOns,
          paymentModuleName: paymentModuleName,
          reservation: reservation,
          financingRequest: financingRequest,
        });
      const sellerCommissionSummary =
        await this.productService.getProductSummaryCommission({
          productId: product.product_id.toString(),
          orderId: null,
          isBuyer: false,
          isOriginalBreakDown: true,
        });

      // if found before and the order is biding then update it
      if (
        sellerCommissionSummary &&
        purchaseProductDto.actionType == 'buyWithBid' &&
        purchaseProductDto?.bidAmount > 0
      ) {
        await this.productService.updateSellPriceInCommissionSummary({
          product: {
            id: product.product_id.toString(),
            categoryId: product.category_id.toString(),
            sellPrice: purchaseProductDto?.bidAmount,
            modelId: product.model_id,
            varientId: product.varient_id,
            grade: product.grade,
            conditionId: product.conditionId,
          },
        });
      }
      // if not found before, get the correct value for sell price
      if (!sellerCommissionSummary) {
        await this.productService.createSummaryCommissionMigration({
          product: {
            id: product.product_id.toString(),
            sellPrice:
              purchaseProductDto?.bidAmount > 0
                ? purchaseProductDto?.bidAmount
                : product.sell_price,
            modelId: product.model_id,
            varientId: product.varient_id,
            grade: product.grade,
            categoryId: product.category_id,
          },
          promoCode: null,
          sellerId: product.user_id,
          isCommissionForBuyer: false,
          source: null,
          sysSettings: product.billingSettings,
          orderId: orderId.toString(),
        });
      }

      const [validateOrderError, validatorMessage] = await this.validateOrder(
        Number(buyerCommissionSummary.grandTotal) +
          (purchaseProductDto?.addOns?.addOnsGrandTotal || 0),
        purchaseProductDto.paymentType
      );
      if (validateOrderError) throw new Error(validatorMessage as string);
      const [addressErr, addressData] =
        await this.addressRepository.getUserAddress(userInfo._id.toString());
      if (
        addressErr ||
        ((addressData.result as AddressDocument[]) || []).length == 0
      )
        throw new Error(Constants.MESSAGE.ADDRESS_GET_NOT_FOUND);

      // payment part will be moved to payment service when it is merged
      let orderNumber: string;
      if (
        purchaseProductDto.orderNumber !== null &&
        purchaseProductDto.orderNumber !== undefined
      ) {
        orderNumber = purchaseProductDto.orderNumber;
      } else if (product?.consignment?.orderNumber) {
        const randomFourDigit = Math.floor(1000 + Math.random() * 9000);
        orderNumber = `${product.consignment.orderNumber}_${randomFourDigit}`;
      } else {
        orderNumber = generateRandomOperationNumber('newOrder');
      }

      // handle order creation
      const orderData = {
        _id: orderId,
        buyer: userInfo._id,
        seller: product.user_id,
        product: purchaseProductDto.productId,
        buy_amount: buyerCommissionSummary.sellPrice,
        shipping_charge: buyerCommissionSummary.deliveryFee,
        vat: buyerCommissionSummary.totalVat,
        commission: buyerCommissionSummary.commission,
        grand_total: formatPriceInDecimalPoints(
          Number(buyerCommissionSummary.grandTotal)
        ),
        // checkout_id: checkoutData.id,
        order_number: orderNumber,
        sourcePlatform: clientId,
        gtmClientId: gtmClientId,
        gtmSessionId: gtmSessionId,
        payment_provider: purchaseProductDto.paymentProvider,
        buy_type:
          purchaseProductDto.actionType == 'buyWithBid' ? 'Bid' : 'Direct',
        buyer_address: userInfo.address,
        payment_type:
          purchaseProductDto.paymentType ||
          purchaseProductDto.paymentProvider.toUpperCase(),
        promos: {
          buyerPromocodeId: promoCode ? promoCode.id : null,
        },
        addOns: {
          selectedAddOns: selectedAddOns || [],
          addOnsGrandTotal: buyerCommissionSummary?.addOnsGrandTotal || 0,
          addOnsTotal: buyerCommissionSummary?.addOnsTotal || 0,
          addOnsVat: buyerCommissionSummary?.addOnsVat || 0,
        } as AddOnSummary,
        isConsignment: product?.isConsignment,
        isReservation: paymentModuleName === PaymentModuleName.RESERVATION,
        isFinancing: paymentModuleName === PaymentModuleName.FINANCINGREQUEST,
      } as any;

      let settings = sysSettings;
      if (product.billingSettings) {
        const billingSettings: BillingSettings = {
          ...product.billingSettings,
          ...{
            delivery_fee: sysSettings.delivery_fee,
            delivery_threshold: sysSettings.delivery_threshold,
            apply_delivery_fee: sysSettings.apply_delivery_fee,
            referral_discount_type: sysSettings.referral_discount_type,
            referral_percentage: sysSettings.referral_percentage,
            referral_fixed_amount: sysSettings.referral_fixed_amount,
          },
        };
        await this.productRepository.updateBillingSettingsOfProduct(
          product.product_id.toString(),
          billingSettings
        );
        settings = {
          ...sysSettings,
          ...billingSettings,
        };
      }

      if (!errSettings) {
        orderData.billingSettings = settings as BillingSettings;
      }

      const [orderErr, orderResult] = await this.orderRepository.createNewOrder(
        orderData
      );
      if (orderErr) throw new Error(Constants.MESSAGE.FAILED_TO_CREATE_ORDER);

      if (promoCode && promoCode.id) {
        await updatePromoCodeUsageCount({
          promoCodeId: promoCode.id,
          count: 1,
        });
        await this.bullMQService.addJob(
          {
            id: orderId,
            type: JobTypes.VALIDATE_PROMO_CODE_USAGE,
          },
          { delay: 45 * 60 * 1000 }, // 45 min delay
          Queues.DEFAULT
        );
      }
      if (
        orderData.buy_type === ListingType.DIRECT &&
        purchaseProductDto.paymentId
      ) {
        let paymentAmount = orderData.grand_total;
        if (
          buyerCommissionSummary.reservation?.reservationAmount &&
          paymentModuleName === PaymentModuleName.RESERVATION
        ) {
          paymentAmount = buyerCommissionSummary.reservation?.reservationAmount;
        }
        if (
          buyerCommissionSummary.financingRequest?.amount &&
          paymentModuleName === PaymentModuleName.FINANCINGREQUEST
        ) {
          paymentAmount = buyerCommissionSummary.financingRequest.amount;
        }

        let addOnItems = [
          {
            title: product.models.model_name,
            description: `${product.grade} ${product.category.category_name}`,
            productId: purchaseProductDto.productId,
            unitPrice: orderData.buy_amount,
            vatAmount: formatPriceInDecimalPoints(
              orderData.vat + orderData.shipping_charge + orderData.commission,
              2
            ).toString(),
            quantity: 1,
            category: product.category.category_name,
          },
        ];
        if (purchaseProductDto?.addOns?.selectedAddOns) {
          addOnItems = [
            ...addOnItems,
            ...purchaseProductDto.addOns.selectedAddOns.map(addOn => {
              return {
                title: `${addOn.addOnName}`,
                description: addOn.addOnName,
                productId: addOn.id,
                quantity: 1,
                unitPrice: addOn?.addOnPrice,
                vatAmount: '0',
                category: 'addOn',
              };
            }),
          ];
        }
        // Call payment svc with gRPC
        const result: CreateTransactionResponse =
          await CreatePaymentTransaction({
            userId: orderData.buyer,
            productId: orderData.product,
            amount: formatPriceInDecimalPoints(paymentAmount),
            paymentOptionId: purchaseProductDto.paymentId,
            soumTransactionNumber: orderData.order_number,
            transactionType: ListingType.DIRECT.toLocaleUpperCase(),
            nationalId: purchaseProductDto.nationalId,
            orderId: orderId.toString(),
            items: addOnItems,
            returnUrls: purchaseProductDto.returnUrls,
          });
        if (paymentModuleName !== PaymentModuleName.FINANCINGREQUEST) {
          await this.productRepository.updateProductStatus(
            purchaseProductDto.productId,
            ProductOrderStatus.Locked
          );
          await this.searchService.deleteOneOrManyProducts([
            purchaseProductDto.productId,
          ]);
          await this.bullMQService.addJob(
            {
              id: orderId,
              type: JobTypes.UPDATE_PRODUCT_SYNC_STATUS,
            },
            { delay: 20 * 60 * 1000 }, // 20 min delay
            Queues.DM_ORDERS
          );
        }
        purchaseProductDto.paymentId = result.transactionId;
        return {
          ...purchaseProductDto,
          orderId: orderResult.result?._id,
          checkoutURL: result.checkoutURL,
          paymentNumber: orderData.order_number,
        };
      }

      return {
        ...purchaseProductDto,
        orderId: orderResult.result?._id,
        paymentNumber: orderData.order_number,
      };
    } catch (exception) {
      console.log(exception);
      if (isProductLockedForUser) {
        await this.productRepository.updateProductStatus(
          purchaseProductDto.productId,
          ProductOrderStatus.Available
        );
      }
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_BUY_PRODUCT,
          exception.message
        );
      }
    }
  }
  async updateOrderAttribute(orderId: string) {
    try {
      const [err, result] = await this.orderRepository.updateOrderAttribute(
        orderId
      );
      if (err) {
        this.error.errorCode = result.code;
        this.error.errorKey = result.result.toString();
        this.error.message = result.message;
        throw this.error;
      }
      return result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          exception.message
        );
      }
    }
  }
  async reserveFinancingOrder(
    orderId: string,
    userId: string,
    paymentOptionId: string,
    productId: string
  ) {
    const [errOrder, orderData] = await this.orderRepository.getById(orderId);
    if (errOrder) throw new Error(Constants.MESSAGE.FAILED_TO_GET_ORDER);
    const [productErr, productResult] =
      await this.productRepository.getDetailProduct(productId);
    if (productErr) throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);

    const order = orderData.result as OrderDocument;
    const product = productResult.result;
    if (
      product.sell_status === ProductOrderStatus.Sold ||
      product.sell_status === ProductOrderStatus.Locked ||
      product.status !== ProductStatus.Active
    ) {
      throw new Error(Constants.MESSAGE.PRODUCT_GET_NOT_FOUND);
    }

    const dmoStatus = await this.deltaMachineService.getDmOrderStatusByOrderId(
      orderId
    );
    if (!dmoStatus) {
      throw new Error('Financing Request is not approved.');
    }

    const dmStatus = dmoStatus.status as any;
    if (dmStatus.name !== DeltaMachineStatusName.APPROVED_BY_FINANCE_COMPANY) {
      throw new Error('Financing Request is not approved.');
    }

    const sellerCommissionSummary =
      await this.productService.getProductSummaryCommission({
        orderId: orderId,
        productId: productId,
        isBuyer: true,
        isOriginalBreakDown: true,
      });
    const paymentAmount = sellerCommissionSummary.reservation.reservationAmount;

    const paymentNumber = `Reserve-${order.order_number}`;
    const transaction: CreateTransactionResponse =
      await CreatePaymentTransaction({
        userId,
        productId,
        amount: paymentAmount,
        paymentOptionId,
        soumTransactionNumber: paymentNumber,
        transactionType: ListingType.DIRECT.toLocaleUpperCase(),
        nationalId: '',
        orderId: order.id,
        items: [
          {
            title: product.modelName,
            description: `${product.grade} ${product.categoryName}`,
            unitPrice: `${order.buy_amount}`,
            vatAmount: formatPriceInDecimalPoints(
              order.vat + order.shipping_charge + order.commission,
              2
            ).toString(),
          },
        ],
        returnUrls: null,
        transactionActionType: 'reserverFinancingOrder',
      });

    if (!transaction.transactionId) {
      throw new Error('Failed to create transaction.');
    }
    await Promise.all([
      this.productRepository.updateProductStatus(
        productId,
        ProductOrderStatus.Locked
      ),
      this.searchService.deleteOneOrManyProducts([productId]),
    ]);
    return {
      orderId: order.id,
      orderNumber: paymentNumber,
      checkoutId: transaction.checkoutId,
      transactionId: transaction.transactionId,
    };
  }
  async createAljufLead(data: any) {
    const payload = {
      QuotationSource: "22",
      IDNumber: data.nationalId,
      First_Name: data.firstName,
      Last_Name: data.lastName,
      Email_Address: data.email,
      Mobile: data.mobile,
      Gender_Code: 1,
      PreferredLanguageID: 1,
      Monthly_Income: data.basicSalary,
      Matrial_Status: "1",
      City_Name: "Riyadh",
      Period: 48,
      Product_Category: "1",
      Model_Name: "Toyota",
      Model_Year: "2020",
      Finance_Type: 1,
      MonthlyPayment: 2000,
      Downpayment: 1000,
      Retail_Price: 50000,
      Description: "Order Lead",
    };

    const res = await AljufClient.createLead(payload);
    return res.data;
  }
  async updateAljufLead(refNo: string, statusCode: number) {
    const payload = {
      RefNo: refNo,
      Description: "Updated by system",
      Statuscode: statusCode,
      // uploadFile: [],
    };

    const res = await AljufClient.updateLead(payload);
    return res.data;
  }
  async getLeadStatus(refNo: string) {
    const res = await AljufClient.getLeadStatus(refNo);
    return res.data;
  }
  async submitFeedback(refNo: string, leadId: string, comment: string) {
    const payload = {
      RefNo: refNo,
      Name: "SystemUser",
      Feedback: "Automated Feedback",
      comments: comment,
      LeadId: leadId,
    };

    const res = await AljufClient.createFeedback(payload);
    return res.data;
  }
  async getAllOrdersForUser(
    userId: string,
    ordersType: string,
    page: number,
    size: number
  ) {
    try {
      if (ordersType == 'buyer') {
        const [errUserOrders, userOrders] =
          await this.orderRepository.getUserOrderAsBuyer(userId, page, size);

        if (errUserOrders) {
          this.error.errorCode = userOrders.code;
          this.error.errorType = Constants.ERROR_TYPE.API;
          this.error.errorKey = userOrders.toString();
          this.error.message = userOrders.message;
          throw this.error;
        }
        const { docs, hasNextPage, totalDocs } = userOrders.result as any;
        const ids = ((docs as any[]) || []).map(elem => elem._id.toString());
        const ordersStatus = await this.deltaMachineService.getOrdersStatus(
          ids
        );
        let lookUps: any = null;
        await getCache(`${process.env.REDIS_ENV}_lookups`);
        if (_isEmpty(lookUps)) {
          lookUps = await this.lookupService.cashAllLookups();
        }
        const result: any = [];

        await Promise.all(
          ((docs as any[]) || []).map(async elem => {
            const variant: any = await this.variantService.getVariantViaId(
              elem.product?.varient_id
            );
            const variantEn: string[] = [];
            const variantAr: string[] = [];
            variant?.attributes.forEach((attribute: any) => {
              variantEn.push(attribute.options[0].nameEn);
              variantAr.push(attribute.options[0].nameAr);
            });
            const ordersStatusId = ((ordersStatus as any[]) || []).find(
              orderStatus => orderStatus.orderId.equals(elem._id)
            )?.statusId;
            result.push({
              order: {
                id: elem._id,
                date: elem.created_at,
                dmStatus: ((lookUps.dmOrderStatus as any[]) || []).find(
                  status => status.id == ordersStatusId?.toString()
                ),
              },
              productId: elem.product._id,
              isMerchant: elem?.seller?.isMerchant || false,
              sellerName: elem.seller.name,
              sellerId: elem.seller._id,
              model: ((lookUps.models as any[]) || []).find(
                model => model.id == elem.product.model_id.toString()
              ),
              category: ((lookUps.categories as any[]) || []).find(
                cat => cat.id == elem.product.category_id.toString()
              ),
              brand: ((lookUps.brands as any[]) || []).find(
                brand => brand.id == elem.product.brand_id.toString()
              ),
            });
          })
        );
        return {
          docs: result || [],
          hasNextPage,
          totalDocs,
        } as PaginationDto<any>;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
          exception.message
        );
      }
    }
  }

  async getOrdersToGenerateInvoices() {
    const data =
      (await this.orderRepository.getOrdersToGenerateInvoices()) || [];

    const ordersId = data.map(elem => elem._id.toString());
    const ordersUpdated = [];
    const ordersFailed = [];

    for (let index = 0; index < ordersId.length; index++) {
      const order = ordersId[index];
      try {
        await this.generatePdfInvoice(order, 'buyer');
        await this.generatePdfInvoice(order, 'seller');
        await this.orderRepository.updateOrderInvoiceGeneration(
          order,
          TaskGeneratedStatus.SUCCESS
        );
        ordersUpdated.push(order);
      } catch (exception) {
        await this.orderRepository.updateOrderInvoiceGeneration(
          order,
          TaskGeneratedStatus.FAILED
        );
        ordersFailed.push(order);
      }
    }
    return { ordersUpdated, ordersFailed };
  }

  async generatePdfInvoice(orderId: any, invoiceType: string) {
    const [err, orderDetails] = await this.getInvoiceDetail(
      invoiceType,
      orderId
    );
    if (err) {
      throw new Error(orderDetails.toString());
    }

    const invoiceInput = orderDetails as InvoiceTypeInput;

    if (!invoiceInput.invoice_migrated)
      throw new Error('Invoice should be migrate to use it in pdf generation');

    const outputAndConfigINV = getHtmlContentAndConfig(
      InvoiceFormats.ZATCA,
      invoiceType as string
    );
    // const outputAndConfigCN = getHtmlContentAndConfig(
    //   InvoiceFormats.ZATCA_CREDIT_NOTE,
    //   invoiceType as string
    // );

    const [, productResult] = await this.productRepository.getProductById(
      invoiceInput.product
    );

    const product: ILegacyProductModel =
      productResult?.result as ILegacyProductModel;

    if (product?.consignment && invoiceType === InvoiceType.SELLER) {
      const { payoutAmount } = product.consignment;
      const { sell_price: sellPrice, billingSettings } = product;
      const commissionAmount = Number(sellPrice) - Number(payoutAmount);

      const vatPercentage = Number(billingSettings?.vat_percentage);

      // Unit price after discount
      const unitPriceAfterDiscount = formatPriceInDecimalPoints(
        commissionAmount / (1 + vatPercentage / 100)
      );
      invoiceInput.commission_detail.unit_price_after_discount =
        unitPriceAfterDiscount;

      // Soum commission
      invoiceInput.commission_detail.unit_price = unitPriceAfterDiscount;

      // Tax amount
      const taxAmount = formatPriceInDecimalPoints(
        Number((vatPercentage / 100) * unitPriceAfterDiscount)
      );
      invoiceInput.commission_detail.tax = taxAmount;

      // Items Subtotal including VAT
      invoiceInput.commission_detail.sub_total = commissionAmount;

      // Listing price
      invoiceInput.order_detail.unit_price = sellPrice;

      // Total vat
      invoiceInput.total_vat = taxAmount;
    }

    const invoiceInputData = await this.invoiceInputMap(
      invoiceInput,
      InvoiceFormats.ZATCA
    );

    const output = Mustache.render(
      outputAndConfigINV.content,
      invoiceInputData
    );
    // const outputCN = Mustache.render(outputAndConfigCN.content, invoiceInput);
    const invoiceBuffer = await generatePDF(
      output,
      outputAndConfigINV.pdfConfig
    );
    // const invoiceCNbuffer = await generatePDF(
    //   outputCN,
    //   outputAndConfigCN.pdfConfig
    // );

    await uploadInvoice(
      `${invoiceInput.id}-${invoiceType}-INV-V1.pdf`,
      invoiceBuffer
    );
    // await uploadInvoice(
    //   `${invoiceInput.id}-${invoiceType}-CN-V1.pdf`,
    //   invoiceCNbuffer
    // );
    invoiceInput.invoice_urls = [
      {
        version: 1,
        url: `${process.env.INVOICES_AWS_S3_ENDPOINT}/${invoiceInput.id}-${invoiceType}-INV-V1.pdf`,
        create_at: new Date(),
        invoice_format: InvoiceFormats.ZATCA,
      } as InvoiceUrl,
      // {
      //   version: 1,
      //   url: `${process.env.INVOICES_AWS_S3_ENDPOINT}/${invoiceInput.id}-${invoiceType}-CN-V1.pdf`,
      //   create_at: new Date(),
      //   invoice_format: InvoiceFormats.ZATCA_CREDIT_NOTE,
      // } as InvoiceUrl,
    ];

    await this.invoiceRepository.updateInvoice(invoiceInput.id, invoiceInput);

    return invoiceInput;
  }

  async invoiceInputMap(
    invoiceInput: InvoiceTypeInput,
    invoiceFormat: string
  ): Promise<InvoiceTypeInput> {
    invoiceInput.totalTaxable = invoiceInput?.commission_detail.unit_price;
    invoiceInput.grandVatTotal = Number(invoiceInput.total_vat);
    invoiceInput.totalTaxableAfterDiscount =
      invoiceInput?.commission_detail.unit_price_after_discount;
    const netAmount = Number(invoiceInput?.net_amount);
    invoiceInput.grandTotal = netAmount;
    if (
      invoiceInput?.addOnsSummary &&
      invoiceInput?.addOnsSummary?.selectedAddOns.length > 0
    ) {
      const addOns = await this.renderAddOnsSection(
        invoiceInput.addOnsSummary,
        invoiceFormat
      );
      const { addOnsSummary } = invoiceInput;
      invoiceInput.addOns = addOns;
      const grandTotal = netAmount + Number(addOnsSummary.addOnsGrandTotal);
      invoiceInput.grandTotal = Number(grandTotal.toFixed(2));

      invoiceInput.grandVatTotal = Number(
        (
          Number(invoiceInput.total_vat) + Number(addOnsSummary.addOnsVat)
        ).toFixed(2)
      );

      invoiceInput.totalTaxable = (
        invoiceInput?.commission_detail?.unit_price + addOnsSummary?.addOnsTotal
      ).toFixed(2);

      const unitPriceAfterDiscount =
        Number(invoiceInput?.commission_detail.unit_price_after_discount) || 0;
      const addOnsTotal = Number(addOnsSummary.addOnsTotal) || 0;

      invoiceInput.totalTaxableAfterDiscount = parseFloat(
        (unitPriceAfterDiscount + addOnsTotal).toFixed(2)
      );
    }
    return invoiceInput;
  }

  async renderAddOnsSection(
    addOnsSummary: AddOnSummary,
    invoiceFormat: string
  ) {
    try {
      const [errSettings, sysSettings] =
        await this.settingService.getSettingsObjectByKeys(['vat_percentage']);
      if (errSettings) {
        throw new Error('vat_percentage settings not found');
      }

      return addOnsSummary.selectedAddOns.map((addOn: any) => {
        const { addOnName, addOnPrice, name, validity, price } = addOn;

        const _validity = validity ? `:${validity}` : '';
        const _addOnName = addOnName || name;

        const vatPercentage = Number(sysSettings.vat_percentage);
        const addOnPriceNum = Number(addOnPrice ? addOnPrice : price);
        const vat = (vatPercentage / 100) * addOnPriceNum;
        const taxable = vat + addOnPriceNum;
        const op =
          invoiceFormat === InvoiceFormats.ZATCA_CREDIT_NOTE ? '-' : '';
        return `
          <tr>
            <td class='model-name'>${_addOnName}${_validity}</td>
            <td class='model-name'>${op} ${addOnPrice ? addOnPrice : price}</td>
            <td class='model-name'>${op} ${addOnPrice ? addOnPrice : price}</td>
            <td class='model-name'>No discount</td>
            <td class='model-name'>${op} ${addOnPrice ? addOnPrice : price}</td>
            <td class='model-name'>${sysSettings.vat_percentage}%</td>
            <td class='model-name'>${op} ${vat.toFixed(2)}</td>
            <td class='model-name'>${op} ${taxable.toFixed(2)}</td>
          </tr>`;
      });
    } catch (error) {
      throw new Error(
        `An error occurred while processing add-ons invoice data: ${error.message}`
      );
    }
  }

  async migrateCommission() {
    const orders = await this.orderRepository.getUnMigratedCommissionOrders();
    Promise.all(
      orders.map(async order => {
        try {
          // seller commission migration
          await this.migrateOneCommission({
            isBuyer: false,
            order,
            product: order.product,
            promocode: null,
          });
          // buyer commission migration
          await this.migrateOneCommission({
            isBuyer: true,
            order,
            product: order.product,
            promocode: null,
          });
          const buyerPromo = await this.checkPromoCodeInOrder(order);
          if (buyerPromo) {
            await this.migrateOneCommission({
              isBuyer: true,
              order,
              product: order.product,
              promocode: buyerPromo,
            });
          }
          await this.orderRepository.updateOrderCommissionGeneration(
            order._id.toString(),
            TaskGeneratedStatus.SUCCESS
          );
        } catch (error) {
          await this.orderRepository.updateOrderCommissionGeneration(
            order._id.toString(),
            TaskGeneratedStatus.FAILED
          );
          console.log(
            `failed to generate commission for order ${order._id} => ${error}`
          );
        }
      })
    );
  }
  async migrateOneCommission(data: {
    isBuyer: boolean;
    order: any;
    product: any;
    promocode: DetailedPromoCode;
  }) {
    const commissionSummary =
      await this.productService.getProductSummaryCommission({
        orderId: data.isBuyer ? data.order._id.toString() : null,
        productId: data.product._id.toString(),
        isBuyer: data.isBuyer,
        isOriginalBreakDown: data.promocode ? false : true,
      });
    if (!commissionSummary) {
      await this.productService.createSummaryCommissionMigration({
        product: {
          id: data.product._id.toString(),
          sellPrice:
            data.order.buy_type === 'Bid'
              ? data.order.buy_amount
              : data.product.sell_price,
          modelId: data.product.model_id,
          varientId: data.product.varient_id,
          grade: data.product.grade,
        },
        promoCode: data.promocode,
        sellerId: data.product.user_id,
        isCommissionForBuyer: data.isBuyer,
        source: null,
        sysSettings: data.order.billingSettings,
        orderId: data.isBuyer ? data.order._id : null,
      });
    }
  }
  async generatePdfDMInvoice(
    orderId: string,
    invoiceType: string,
    requestType: string
  ) {
    const [, orderDetails] = await this.getInvoiceDetail(invoiceType, orderId);
    let invoiceInput = orderDetails as InvoiceTypeInput;
    const invoiceUrls = invoiceInput?.invoice_urls || [];
    const isGenerated = invoiceUrls?.length > 0;
    const zatCaGenerated = isGenerated
      ? invoiceUrls.find(
          (invoiceURL: InvoiceUrl) =>
            invoiceURL?.invoice_format === InvoiceFormats.ZATCA
        )
      : false;
    const zatCaCreditGenerated = isGenerated
      ? invoiceUrls.find(
          (invoiceURL: InvoiceUrl) =>
            invoiceURL?.invoice_format === InvoiceFormats.ZATCA_CREDIT_NOTE
        )
      : false;
    if (requestType === InvoiceFormats.ZATCA && !zatCaGenerated) {
      const outputAndConfigINV = getHtmlContentAndConfig(
        InvoiceFormats.ZATCA,
        invoiceType as string
      );
      const output = Mustache.render(outputAndConfigINV.content, invoiceInput);
      const invoiceBuffer = await generatePDF(
        output,
        outputAndConfigINV.pdfConfig
      );
      await uploadInvoice(
        `${invoiceInput.id}-${invoiceType}-INV-V1.pdf`,
        invoiceBuffer
      );
      invoiceInput.invoice_urls.push({
        version: 1,
        url: `${process.env.INVOICES_AWS_S3_ENDPOINT}/${invoiceInput.id}-${invoiceType}-INV-V1.pdf`,
        create_at: new Date(),
        invoice_format: InvoiceFormats.ZATCA,
      } as InvoiceUrl);
      await this.invoiceRepository.updateInvoice(invoiceInput.id, invoiceInput);
    }
    if (
      requestType === InvoiceFormats.ZATCA_CREDIT_NOTE &&
      !zatCaCreditGenerated
    ) {
      const outputAndConfigCN = getHtmlContentAndConfig(
        InvoiceFormats.ZATCA_CREDIT_NOTE,
        invoiceType as string
      );
      invoiceInput = await this.invoiceInputMap(
        invoiceInput,
        InvoiceFormats.ZATCA_CREDIT_NOTE
      );

      const outputCN = Mustache.render(outputAndConfigCN.content, invoiceInput);
      const invoiceCNbuffer = await generatePDF(
        outputCN,
        outputAndConfigCN.pdfConfig
      );
      await uploadInvoice(
        `${invoiceInput.id}-${invoiceType}-CN-V1.pdf`,
        invoiceCNbuffer
      );
      invoiceInput.invoice_urls.push({
        version: 1,
        url: `${process.env.INVOICES_AWS_S3_ENDPOINT}/${invoiceInput.id}-${invoiceType}-CN-V1.pdf`,
        create_at: new Date(),
        invoice_format: InvoiceFormats.ZATCA_CREDIT_NOTE,
      } as InvoiceUrl);
      await this.invoiceRepository.updateInvoice(invoiceInput.id, invoiceInput);
    }
    return invoiceInput;
  }
  async produceCreateOrderEvent(eventLog: MerchantMessage): Promise<void> {
    const prefix = config.has('activitylog.prefix')
      ? _get(activityLogConfig, 'prefix', '')
      : '';
    const kafka = new Kafka({
      brokers: activityLogConfig.kafka_brokers.split(','),
    });
    // eslint-disable-next-line max-len
    const producer: Producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: prefix + 'merchant-order',
      acks: 1,
      messages: [
        {
          key: eventLog.userId.toString(),
          value: JSON.stringify(eventLog),
        },
      ],
    });
    await producer.disconnect();
  }

  async getUserReservations(
    userId: string,
    page: number,
    size: number,
    orderId: string
  ): Promise<
    [boolean, { result: ReservationResponseDto[]; message?: string }]
  > {
    try {
      const reservations = await this.orderRepository.getAllReservations(
        userId,
        page,
        size,
        orderId
      );

      if (reservations?.length) {
        const summaryResult = await Promise.all(
          reservations.map(async reservedOrder => {
            const productSummary = await getProductSummaryCommission({
              orderId: reservedOrder.order_id?.toString(),
              productId: reservedOrder.product_id?.toString(),
              isBuyer: true,
              isOriginalBreakDown: reservedOrder.promo ? false : true,
            });
            let deltaMachineStatus = null;
            const dmo = await this.deltaMachineRepository.getByOrderId(
              reservedOrder.order_id,
              false
            );
            const deltaMachineOrder = dmo[1]
              .result as DeltaMachineOrderDocument;
            if (deltaMachineOrder) {
              const dmoStatus = await this.deltaMachineRepository.getStatusById(
                deltaMachineOrder.statusId
              );
              deltaMachineStatus = dmoStatus[1]
                .result as DeltaMachineStatusDocument;
            }
            return {
              productName: `${reservedOrder.brandName} ${reservedOrder.modelName}`,
              productNameAr: `${reservedOrder.brandNameAr} ${reservedOrder.modelNameAr}`,
              categoryName: reservedOrder.categoryName,
              orderId: reservedOrder.order_id?.toString(),
              imageUrl: reservedOrder.productImages?.length
                ? reservedOrder.productImages[0]
                : '',
              reservationNumber: reservedOrder.order_number,
              reservationDate: reservedOrder.created_at,
              productPriceSummary: productSummary,
              isReservation: reservedOrder.isReservation,
              isFinancing: reservedOrder.isFinancing,
              isFinancingEmailSent: reservedOrder.isFinancingEmailSent,
              deltaMachineStatus: deltaMachineStatus,
              dmOrderId: (
                dmo?.[1]?.result as DeltaMachineOrderDocument
              )?._id?.toString(),
            };
          })
        );

        return [false, { result: summaryResult }];
      }
    } catch (exception) {
      return [true, { result: exception, message: exception?.message }];
    }

    return [false, { result: [], message: Constants.MESSAGE.NO_RESERVATIONS }];
  }

  async getBoughtHistory(
    userId: string,
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: BoughtHistory[];
        message?: string;
      }
    ]
  > {
    try {
      const [err, result] = await this.orderRepository.getBoughtHistory(
        userId,
        page,
        size
      );

      if (err) {
        throw new Error(result?.message || 'Fail to get bought history');
      }

      return [
        false,
        { code: 200, result: result.result, message: result.message },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_BOUGHT_HISTORY,
          exception.message
        );
      }
    }
  }

  async checkOrderStatus(orderId: string) {
    let [, orderResult] = await this.orderRepository.getById(orderId);
    let order = orderResult.result as OrderDocument;
    if (
      [
        PaymentProviderType.ApplePay,
        PaymentProviderType.Mada,
        PaymentProviderType.StcPay,
        PaymentProviderType.VisaMaster,
        PaymentProviderType.URPAY,
      ].includes(order.payment_type as PaymentProviderType) &&
      order.transaction_status == 'Pending'
    ) {
      const postReqBody = {
        order_id: orderId,
        product_id: order.product,
      };
      let host = '0.0.0.0:3100';
      if (process.env.NODE_ENV !== 'local') {
        host = `http://soum-soum-backend-${process.env.PREFIX}-srv:3000`;
      }
      const url = host + '/api/v1/order/transaction/save';
      await axios.post(url, postReqBody, {
        headers: {
          'client-id': 'api-v2',
        },
      });
      [, orderResult] = await this.orderRepository.getById(orderId);
      order = orderResult.result as OrderDocument;
    }
    return order.transaction_status;
  }

  async getOrderDataForGeneratingInvoice(
    orderId: string
  ): Promise<OrderDocument> {
    try {
      const [, data] =
        await this.orderRepository.getOrderDataForGeneratingInvoice(orderId);
      return data.result as OrderDocument;
    } catch (exception) {
      return null;
    }
  }
  async gtmEventPayload(orderId: string) {
    try {
      const orders = await this.findOrdersById([orderId]);
      if (!orders.length) {
        return;
      }
      const order = orders[0];
      const productData = await this.productRepository.getProductDetail(
        order.product._id
      );

      const product = productData[1].result;
      const [, orderDetailBuyer] = await this.getOrderDetail(orderId, 'buyer');
      const [, variantRes] = await this.variantRepository.getById(
        product.varient_id
      );
      const varient: VariantDocument = variantRes.result as VariantDocument;

      const attributes = await mapAttributes(varient.attributes);
      return {
        attributes,
        value: orderDetailBuyer.order.grand_total,
        currency: 'SAR',
        transaction_id: order.order_number,
        items: [
          {
            item_name: product.models.model_name,
            item_id: product._id,
            item_variant: product.variant.varient,
            item_category: product.category.category_name,
            price: orderDetailBuyer.order.grand_total,
            quantity: 1,
            item_brand: product.brands.brand_name,
            discount: orderDetailBuyer.order.totalDiscount,
          },
        ],
      };
    } catch (error) {
      console.log({ error });
      throw error;
    }
  }
}
