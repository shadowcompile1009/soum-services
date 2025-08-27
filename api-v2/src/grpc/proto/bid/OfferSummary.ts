// Original file: node_modules/soum-proto/proto/bid.proto

export interface OfferSummary {
  commission?: number | string;
  commissionVat?: number | string;
  grandTotal?: number | string;
}

export interface OfferSummary__Output {
  commission: number;
  commissionVat: number;
  grandTotal: number;
}
