// Original file: node_modules/soum-proto/proto/bid.proto

import type {
  OfferSummary as _bid_OfferSummary,
  OfferSummary__Output as _bid_OfferSummary__Output,
} from '../bid/OfferSummary';

export interface OfferResponse {
  id?: string;
  status?: string;
  sellPrice?: number;
  buyerOfferSummary?: _bid_OfferSummary | null;
}

export interface OfferResponse__Output {
  id: string;
  status: string;
  sellPrice: number;
  buyerOfferSummary: _bid_OfferSummary__Output | null;
}
