// Original file: node_modules/soum-proto/proto/ler.proto

export interface CreatePickupRequest {
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
}

export interface CreatePickupRequest__Output {
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
}
