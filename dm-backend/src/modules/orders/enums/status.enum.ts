export enum DeltaMachineBNPLStatuses {
  CAPTURED = 'Captured',
  NOT_CAPTURED = 'Not Captured',
  CLOSED = 'Closed',
}

export enum DeltaMachineFEStatus {
  NOT_REQUESTED = 'Not Requested',
  REQUESTED = 'Requested',
  COMPLETED = 'Completed',
  NO_DISPUTE = 'No Dispute',
  OPEN_DISPUTE = 'Open Dispute',
  CAPTURED = 'captured',
  NOT_CAPTURED = 'not-captured',
  CANT_BE_PROCESSED = 'Cannot be Processed',
}

export enum StatusSubmodule {
  NEW = 'new',
  ACTIVE = 'active',
  REFUND = 'refund',
  PAYOUT = 'payout',
  CLOSED = 'closed',
  BNPL = 'bnpl',
  CONFIRMATION = 'confirmation',
  DELIVERY = 'delivery',
  SHIPPING = 'shipping',
  DISPUTE = 'dispute',
  NEW_DISPUTE = 'new-dispute',
  NEW_PAYOUT = 'new-payout',
  NEW_REFUND = 'new-refund',
  BACKLOG = 'backlog',
  RESERVATION = 'reservation',
  FINANCE = 'finance',
  ALL = 'all',
  REPLACEMENT = 'replacement',
}

export enum FinanceReasoningForPendingPayout {
  NO_BANK_DETAIL = 'No bank details',
  INVALID_IBAN = 'Invalid IBAN',
  RESTRICTED = 'Restricted',
  PROCESS_MANUALLY = 'Amount above SAR 7k (Process manually)',
}
