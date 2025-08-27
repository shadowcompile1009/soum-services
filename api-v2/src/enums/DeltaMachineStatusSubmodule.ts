export enum DeltaMachineStatusSubmodule {
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
  BACKLOG = 'backlog',
  RESERVATION = 'reservation',
  FINANCE = 'finance',
  REPLACEMENT = 'replacement',
}

export enum DeltaMachineBNPLStatuses {
  CAPTURED = 'Captured',
  NOT_CAPTURED = 'Not Captured',
  CLOSED = 'Closed',
}

export enum DeltaMachineReplacementStatuses {
  REPLACED = 'replaced',
  NOT_REPLACED = 'not-replaced',
}

export enum DeltaMachineBNPLFEStatuses {
  CAPTURED = 'captured',
  NOT_CAPTURED = 'not-captured',
}
