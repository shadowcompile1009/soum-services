export interface DisputeData {
  disputeDate?: Date;
  isDisputeRaised?: boolean;
  hasDisputeRaisedBefore?: boolean;
  disputeReason?: DisputeReason[];
  description?: string;
  preferredContactNumber?: number;
  images?: any[];
}

export interface DisputeReason {
  question?: Reason;
  answer?: Reason;
}

export interface Reason {
  en?: string;
  ar: string;
}
