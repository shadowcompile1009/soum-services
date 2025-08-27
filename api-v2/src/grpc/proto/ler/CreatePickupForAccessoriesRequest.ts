// Original file: node_modules/soum-proto/proto/ler.proto

import type {
  SkuDetails as _ler_SkuDetails,
  SkuDetails__Output as _ler_SkuDetails__Output,
} from '../ler/SkuDetails';

export interface CreatePickupForAccessoriesRequest {
  referenceNo?: string;
  originCity?: string;
  destinationCity?: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  trackingNumber?: string;
  description?: string;
  skudetails?: _ler_SkuDetails[];
}

export interface CreatePickupForAccessoriesRequest__Output {
  referenceNo: string;
  originCity: string;
  destinationCity: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  trackingNumber: string;
  description: string;
  skudetails: _ler_SkuDetails__Output[];
}
