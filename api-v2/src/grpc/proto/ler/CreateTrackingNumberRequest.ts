// Original file: node_modules/soum-proto/proto/ler.proto

export interface CreateTrackingNumberRequest {
  referenceNo?: string;
  originCity?: string;
  destinationCity?: string;
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  senderEmail?: string;
  senderZip?: string;
  receiverName?: string;
  receiverPhone?: string;
  receiverAddress?: string;
  buyerEmail?: string;
  buyerZip?: string;
  senderDistrict?: string;
  buyerDistrict?: string;
  description?: string;
  weight?: string;
  orderTotal?: string;
  sellerTorodAddress?: string;
  buyerTorodAddress?: string;
}

export interface CreateTrackingNumberRequest__Output {
  referenceNo: string;
  originCity: string;
  destinationCity: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  senderEmail: string;
  senderZip: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  buyerEmail: string;
  buyerZip: string;
  senderDistrict: string;
  buyerDistrict: string;
  description: string;
  weight: string;
  orderTotal: string;
  sellerTorodAddress: string;
  buyerTorodAddress: string;
}
