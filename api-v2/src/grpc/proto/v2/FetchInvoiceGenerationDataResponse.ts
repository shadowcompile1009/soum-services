// Original file: node_modules/soum-proto/proto/v2.proto

import type { Address as _v2_Address, Address__Output as _v2_Address__Output } from '../v2/Address';

export interface _v2_FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
  'unitPrice'?: (number | string);
  'commission'?: (number | string);
  'vat'?: (number | string);
  'discount'?: (number | string);
  'grandTotal'?: (number | string);
  'quantity'?: (number);
}

export interface _v2_FetchInvoiceGenerationDataResponse_ItemCalculationSumamry__Output {
  'unitPrice': (number);
  'commission': (number);
  'vat': (number);
  'discount': (number);
  'grandTotal': (number);
  'quantity': (number);
}

export interface _v2_FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
  'commission'?: (number | string);
  'vat'?: (number | string);
  'deliveryFee'?: (number | string);
  'deliveryFeeVAT'?: (number | string);
  'penaltyFee'?: (number | string);
  'discount'?: (number | string);
  'grandTotal'?: (number | string);
  'orderId'?: (string);
  'orderNumber'?: (string);
  'totalVAT'?: (number | string);
  'totalTaxableAmount'?: (number | string);
}

export interface _v2_FetchInvoiceGenerationDataResponse_OrderCalculationSumamry__Output {
  'commission': (number);
  'vat': (number);
  'deliveryFee': (number);
  'deliveryFeeVAT': (number);
  'penaltyFee': (number);
  'discount': (number);
  'grandTotal': (number);
  'orderId': (string);
  'orderNumber': (string);
  'totalVAT': (number);
  'totalTaxableAmount': (number);
}

export interface _v2_FetchInvoiceGenerationDataResponse_Product {
  'productId'?: (string);
  'nameAR'?: (string);
  'nameEN'?: (string);
  'item'?: (_v2_FetchInvoiceGenerationDataResponse_ItemCalculationSumamry | null);
}

export interface _v2_FetchInvoiceGenerationDataResponse_Product__Output {
  'productId': (string);
  'nameAR': (string);
  'nameEN': (string);
  'item': (_v2_FetchInvoiceGenerationDataResponse_ItemCalculationSumamry__Output | null);
}

export interface _v2_FetchInvoiceGenerationDataResponse_User {
  'id'?: (string);
  'name'?: (string);
  'address'?: (_v2_Address | null);
}

export interface _v2_FetchInvoiceGenerationDataResponse_User__Output {
  'id': (string);
  'name': (string);
  'address': (_v2_Address__Output | null);
}

export interface FetchInvoiceGenerationDataResponse {
  'billType'?: (string);
  'issueDate'?: (string);
  'billTo'?: (string);
  'billedByCOR'?: (string);
  'billedBySeller'?: (string);
  'ZATCAInvoiceNo'?: (string);
  'dateOfSupply'?: (string);
  'seller'?: (_v2_FetchInvoiceGenerationDataResponse_User | null);
  'buyer'?: (_v2_FetchInvoiceGenerationDataResponse_User | null);
  'order'?: (_v2_FetchInvoiceGenerationDataResponse_OrderCalculationSumamry | null);
  'product'?: (_v2_FetchInvoiceGenerationDataResponse_Product | null);
}

export interface FetchInvoiceGenerationDataResponse__Output {
  'billType': (string);
  'issueDate': (string);
  'billTo': (string);
  'billedByCOR': (string);
  'billedBySeller': (string);
  'ZATCAInvoiceNo': (string);
  'dateOfSupply': (string);
  'seller': (_v2_FetchInvoiceGenerationDataResponse_User__Output | null);
  'buyer': (_v2_FetchInvoiceGenerationDataResponse_User__Output | null);
  'order': (_v2_FetchInvoiceGenerationDataResponse_OrderCalculationSumamry__Output | null);
  'product': (_v2_FetchInvoiceGenerationDataResponse_Product__Output | null);
}
