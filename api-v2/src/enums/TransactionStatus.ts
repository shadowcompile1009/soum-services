export enum TransactionStatus {
  PENDING = 'Pending',
  AUTHORISED = 'Authorised',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
  CLOSED = 'Closed',
}

export enum WalletTransactionStatus {
  SUCCESS = 'Success',
  PENDING = 'Pending',
  FAILED = 'Failed',
  CANCELED = 'Canceled',
}

// same as the one before but for old cases
export enum TransactionOrderStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Fail',
  CANCELED = 'Canceled/Reversed',
  AUTHORISED = 'Authorised',
}

export enum TransactionType {
  WITHDRAWAL = 'Withdrawal',
  DEPOSIT = 'Deposit',
  CREDIT = 'Credit',
}

export enum TabbyStatusEnum {
  CLOSED = 'CLOSED',
  AUTHORISED = 'AUTHORIZED',
  CREATED = 'created',
  APPROVED = 'approved',
}
