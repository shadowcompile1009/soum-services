export enum ConsignmentStatus {
  NEW = 'New',
  RECEIVED = 'Received',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CLOSED_FULFILLED = 'Closed-fulfilled',
  CLOSED_UNFULFILLED = 'Closed-unfulfilled',
  PAYOUT_TO_SELLER = 'Payout-to-seller',
  PAYOUT_PROCESSING = 'Payout-processing',
  TRANSFERRED = 'Transferred',
  AWAITING_SELLER_CONFIRMATION_OF_PAYOUT = 'Awaiting-seller-confirmation-of-payout',
}

export enum MySalesStatus {
  NEW = 'New',
  RECEIVED = 'Received',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CANCELLED = 'Cancelled',
  TRANSFERRED = 'Transferred',
}

export function mapConsignmentToMySalesStatus(
  status: ConsignmentStatus,
): MySalesStatus | null {
  switch (status) {
    case ConsignmentStatus.APPROVED:
    case ConsignmentStatus.PAYOUT_PROCESSING:
    case ConsignmentStatus.PAYOUT_TO_SELLER:
      return MySalesStatus.APPROVED;

    case ConsignmentStatus.CLOSED_UNFULFILLED:
      return MySalesStatus.CANCELLED;

    case ConsignmentStatus.TRANSFERRED:
    case ConsignmentStatus.CLOSED_FULFILLED:
      return MySalesStatus.TRANSFERRED;

    case ConsignmentStatus.NEW:
      return MySalesStatus.NEW;

    case ConsignmentStatus.RECEIVED:
      return MySalesStatus.RECEIVED;

    case ConsignmentStatus.REJECTED:
      return MySalesStatus.REJECTED;

    default:
      return null;
  }
}
