import ExcelJS from 'exceljs';
import moment from 'moment';
import { formatTimeZone } from './common';
import logger from './logger';
import { WhatsAppMsgReportDto } from '../dto/whatsappMsg/whatsAppMsgDto';

export async function generatePayoutSheet(
  payouts: any[],
  title?: string
): Promise<[boolean, any]> {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.calcProperties.fullCalcOnLoad = true;

    // Enhance: Orders from dd/MM/YYY to dd/MM/YYYY
    const payoutSheet = workbook.addWorksheet(title, {
      properties: {
        tabColor: {
          argb: '#058dc5cc',
        },
      },
      views: [
        {
          state: 'frozen',
          xSplit: 1,
          ySplit: 1,
        },
      ],
    });

    const columnStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    payoutSheet.columns = [
      { header: 'Order ID', key: 'order_id', width: 20, style: columnStyle },
      {
        header: 'HyperSplits ID',
        key: 'hyper_splits_id',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Transaction Timestamp',
        key: 'transaction_timestamp',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Payout made by',
        key: 'made_by',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Product ID',
        key: 'product_id',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Product Name',
        key: 'product_name',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Variant',
        key: 'variant',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Seller Name',
        key: 'seller_name',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Seller Phone Number',
        key: 'seller_mobile',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Base Buy Price',
        key: 'product_sell_price',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Seller Commission %',
        key: 'commission',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Seller Commission Amount',
        key: 'commission_amount',
        width: 20,
        style: columnStyle,
      },
      { header: 'VAT Amount', key: 'vat', width: 20, style: columnStyle },
      {
        header: 'Shipping Charges',
        key: 'shipping_charge',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Net for seller',
        key: 'pay_amount',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Seller IBAN',
        key: 'iban',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Seller Bank Name',
        key: 'bank_name',
        width: 20,
        style: columnStyle,
      },
    ];

    const rows: any[] = [];
    payouts.forEach((payout: any) => {
      rows.push({
        order_id: payout.order_id,
        hyper_splits_id: payout.hyper_splits_id,
        transaction_timestamp: payout.transaction_timestamp,
        made_by: payout.made_by,
        product_id: payout.product_id.toString(),
        product_name: payout.product_name,
        variant: payout.variant[0],
        seller_name: payout.seller_name,
        seller_mobile: payout.seller_mobile,
        product_sell_price: payout.product_sell_price,
        commission: payout.commission,
        commission_amount: payout.commission_amount,
        vat: payout.vat,
        shipping_charge: payout.shipping_charge,
        pay_amount: payout.pay_amount,
        iban: payout.iban,
        bank_name: payout.bank_name,
      });
    });
    payoutSheet.addRows(rows);
    payoutSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00b4d8' },
    };
    payoutSheet.getRow(1).font = {
      color: { argb: 'ffffff' },
      bold: true,
      size: 13,
    };
    const buffer = await workbook.xlsx.writeBuffer();

    return [false, buffer];
  } catch (exception) {
    return [true, { message: exception.message, stack: exception.stack }];
  }
}

export function getDMOCSVExportFields() {
  return [
    {
      label: 'Order ID',
      value: 'orderNumber',
    },
    {
      label: 'Date',
      value: 'createdAt',
    },
    {
      label: 'Product ID',
      value: 'productId',
    },
    {
      label: 'Order - Type',
      value: 'orderType',
    },
    {
      label: 'Status',
      value: 'orderStatus',
    },
    {
      label: 'Seller Name',
      value: 'sellerName',
    },
    {
      label: 'Seller phone',
      value: 'sellerPhone',
    },
    {
      label: 'Seller Address',
      value: 'sellerAddress',
    },
    {
      label: 'Seller Street',
      value: 'sellerStreet',
    },
    {
      label: 'Buyer District',
      value: 'buyerDistrict',
    },
    {
      label: 'Seller City',
      value: 'sellerCity',
    },
    {
      label: 'Seller Postal Code',
      value: 'sellerPostalCode',
    },
    {
      label: 'Buyer Name',
      value: 'buyerName',
    },
    {
      label: 'Buyer Phone',
      value: 'buyerPhone',
    },
    {
      label: 'Buyer Address',
      value: 'buyerAddress',
    },
    {
      label: 'Buyer Street',
      value: 'buyerStreet',
    },
    {
      label: 'Buyer District',
      value: 'buyerDistrict',
    },
    {
      label: 'Buyer city',
      value: 'buyerCity',
    },
    {
      label: 'Buyer Postal Code',
      value: 'buyerPostalCode',
    },
    {
      label: 'Product Name',
      value: 'productName',
    },
    {
      label: 'Buyer Promo Code',
      value: 'buyerPromoCode',
    },
    {
      label: 'Buyer Grand Total',
      value: 'grandTotal',
    },
    {
      label: 'Sell Price',
      value: 'sellPrice',
    },
    {
      label: 'Payout - Seller',
      value: 'payoutAmount',
    },
    {
      label: 'Tracking Number',
      value: 'trackingNumber',
    },
    {
      label: 'Payment Status',
      value: 'paymentStatus',
    },
    {
      label: 'Buy Type',
      value: 'buyType',
    },
    {
      label: 'Source Platform',
      value: 'sourcePlatform',
    },
    {
      label: 'Payment Type',
      value: 'paymentType',
    },
    {
      label: 'Seller Promo Code',
      value: 'sellerPromoCode',
    },
    {
      label: 'Varient',
      value: 'varient',
    },
    {
      label: 'Seller Account Name',
      value: 'sellerAcountName',
    },
    {
      label: 'Seller Bank Name',
      value: 'sellerBankName',
    },
    {
      label: 'Seller IBAN',
      value: 'sellerIBAN',
    },
    {
      label: 'Seller Bank BIC',
      value: 'sellerBankBIC',
    },
    {
      label: 'Product Pictures',
      value: 'productPictures',
    },
    {
      label: 'VAT Amount',
      value: 'vatAmount',
    },
    {
      label: 'Commission Amount',
      value: 'commissionAmount',
    },
    {
      label: 'Shipping Amount',
      value: 'shippingAmount',
    },
  ];
}

export async function generateMismatchReport(
  mismatchedListing: any,
  title?: string
): Promise<[boolean, any]> {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.calcProperties.fullCalcOnLoad = true;

    // Enhance: Orders from dd/MM/YYY to dd/MM/YYYY
    const payoutSheet = workbook.addWorksheet(title, {
      properties: {
        tabColor: {
          argb: '#058dc5cc',
        },
      },
      views: [
        {
          state: 'frozen',
          xSplit: 1,
          ySplit: 1,
        },
      ],
    });

    const columnStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    payoutSheet.columns = [
      { header: 'No', key: 'no', width: 5, style: columnStyle },
      {
        header: 'Link To Pictures',
        key: 'link_to_pictures',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Product ID',
        key: 'product_id',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Phone Number',
        key: 'phone_number',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Model',
        key: 'model',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Buy Now Price',
        key: 'buy_now_price',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'New Device Price',
        key: 'new_device_price',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Discount',
        key: 'discount',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Listing Date',
        key: 'listing_date',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Product Link',
        key: 'product_link',
        width: 20,
        style: columnStyle,
      },
    ];

    const rows: any[] = [];
    mismatchedListing.result.data.forEach((product: any, index: number) => {
      rows.push({
        no: index + 1,
        link_to_pictures: product.pictures,
        product_id: product.product_id,
        phone_number: product.phone_number,
        model: product.model.model_name,
        buy_now_price: product.buy_now_price,
        new_device_price: product.new_device_price,
        discount: `${product.discount} %`,
        listing_date: moment(new Date(product.listing_date)).format(
          'DD-MM-YYYY'
        ),
        product_link: `${process.env.PRODUCT_LINK}${product.product_id}`,
      });
    });
    payoutSheet.addRows(rows);
    payoutSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00b4d8' },
    };
    payoutSheet.getRow(1).font = {
      color: { argb: 'ffffff' },
      bold: true,
      size: 13,
    };
    const buffer = await workbook.xlsx.writeBuffer();

    return [false, buffer];
  } catch (exception) {
    return [true, { message: exception.message, stack: exception.stack }];
  }
}

export async function generateUserSheet(
  users: any[],
  title?: string
): Promise<[boolean, any]> {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.calcProperties.fullCalcOnLoad = true;

    // Enhance: Orders from dd/MM/YYY to dd/MM/YYYY
    const userSheet = workbook.addWorksheet(title, {
      properties: {
        tabColor: {
          argb: '#058dc5cc',
        },
      },
      views: [
        {
          state: 'frozen',
          xSplit: 1,
          ySplit: 1,
        },
      ],
    });

    const columnStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    userSheet.columns = [
      {
        header: 'User Id',
        key: 'id',
        width: 20,
        style: columnStyle,
      },

      {
        header: 'Language',
        key: 'language',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Login With',
        key: 'loginWith',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Status',
        key: 'status',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Mobile Number',
        key: 'mobileNumber',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Country Code',
        key: 'countryCode',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Created Date',
        key: 'createdDate',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Last Login Date',
        key: 'lastLoginDate',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Name',
        key: 'name',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'User Type',
        key: 'userType',
        width: 20,
        style: columnStyle,
      },
    ];

    const rows: any[] = [];
    users.forEach((user: any) => {
      rows.push({
        id: user._id,
        language: user.language,
        loginWith: user.loginWith,
        status: user.status,
        mobileNumber: user.mobileNumber,
        countryCode: user.countryCode,
        createdDate: formatTimeZone(user.createdDate),
        lastLoginDate: formatTimeZone(user.lastLoginDate),
        name: user.name,
        userType: user.userType,
      });
    });
    userSheet.addRows(rows);
    userSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00b4d8' },
    };
    userSheet.getRow(1).font = {
      color: { argb: 'ffffff' },
      bold: true,
      size: 13,
    };
    const buffer = await workbook.xlsx.writeBuffer();

    return [false, buffer];
  } catch (exception) {
    return [true, { message: exception.message, stack: exception.stack }];
  }
}

export async function generateAdminPromosSheet(
  adminPromos: any[],
  title?: string
): Promise<[boolean, any]> {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.calcProperties.fullCalcOnLoad = true;

    // Enhance: Orders from dd/MM/YYY to dd/MM/YYYY
    const adminPromosSheet = workbook.addWorksheet(title, {
      properties: {
        tabColor: {
          argb: '#058dc5cc',
        },
      },
      views: [
        {
          state: 'frozen',
          xSplit: 1,
          ySplit: 1,
        },
      ],
    });

    const columnStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    adminPromosSheet.columns = [
      {
        header: 'Id',
        key: '_id',
        width: 20,
        style: columnStyle,
      },

      {
        header: 'Total Usage',
        key: 'totalUsage',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Code',
        key: 'code',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'User',
        key: 'user',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Type',
        key: 'type',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Amount',
        key: 'amount',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Percentage',
        key: 'percentage',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Minimum Spend Limit',
        key: 'minimumSpendLimit',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Start Date',
        key: 'startDate',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'End Date',
        key: 'endDate',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Active/ Inactive',
        key: 'activeOrInactive',
        width: 20,
        style: columnStyle,
      },
    ];

    const rows: any[] = [];
    adminPromos.forEach((adminPromo: any) => {
      rows.push({
        _id: adminPromo._id,
        totalUsage: adminPromo.totalUsage,
        code: adminPromo.code,
        user: adminPromo.user,
        type: adminPromo.Type,
        amount: adminPromo.Amount,
        percentage: adminPromo.Percentage,
        minimumSpendLimit: adminPromo.MinimumSpendLimit,
        startDate: formatTimeZone(adminPromo.StartDate),
        endDate: formatTimeZone(adminPromo.EndDate),
        activeOrInactive: adminPromo['Active/Inactive'],
      });
    });
    adminPromosSheet.addRows(rows);
    adminPromosSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00b4d8' },
    };
    adminPromosSheet.getRow(1).font = {
      color: { argb: 'ffffff' },
      bold: true,
      size: 13,
    };
    const buffer = await workbook.xlsx.writeBuffer();

    return [false, buffer];
  } catch (exception) {
    return [true, { message: exception.message, stack: exception.stack }];
  }
}

export async function generateDelectionMessageSellerResponseSheet(
  whatsAppMsgs: WhatsAppMsgReportDto[],
  title?: string
): Promise<[boolean, any]> {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.calcProperties.fullCalcOnLoad = true;

    // Enhance: Orders from dd/MM/YYY to dd/MM/YYYY
    const templateSheet = workbook.addWorksheet(title, {
      properties: {
        tabColor: {
          argb: '#058dc5cc',
        },
      },
      views: [
        {
          state: 'frozen',
          xSplit: 1,
          ySplit: 1,
        },
      ],
    });

    const columnStyle: Partial<ExcelJS.Style> = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      },
    };
    templateSheet.columns = [
      {
        header: 'Phone Number',
        key: 'phoneNumber',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Message Delivered Timestamp',
        key: 'updatedAt',
        width: 20,
        style: columnStyle,
      },
      {
        header: 'Button Clicked on the WhatsApp Message',
        key: 'userResponse',
        width: 40,
        style: columnStyle,
      },
    ];

    const rows: any[] = [];
    whatsAppMsgs.forEach((wam: any) => {
      rows.push({
        phoneNumber: wam?.phoneNumber,
        updatedAt: formatTimeZone(wam?.updatedAt),
        userResponse: wam?.userResponse,
      });
    });
    templateSheet.addRows(rows);
    templateSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '00b4d8' },
    };
    templateSheet.getRow(1).font = {
      color: { argb: 'ffffff' },
      bold: true,
      size: 13,
    };
    const buffer = await workbook.xlsx.writeBuffer();

    return [false, buffer];
  } catch (exception) {
    logger.error('🚀 ~ file: excel.ts:296 ~ exception:', exception.stack);
    return [true, { message: exception.message, stack: exception.stack }];
  }
}
