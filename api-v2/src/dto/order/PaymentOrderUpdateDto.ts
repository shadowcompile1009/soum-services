import { TransactionOrderStatus } from '../../enums/TransactionStatus';

export class PaymentOrderUpdateDto {
  orderId: string;
  transactionId: string;
  response: any;
  status: TransactionOrderStatus;
  sourcePlatform?: string;
  paymentReceivedFromBuyer: string;
  buyerAddress?: any;
  orderNumber?: string;
}

export class UpdateOrderAfterPayment {
  orderId: string;
  transaction_id: string;
  transaction_status: string;
  transaction_detail?: string;
  paymentReceivedFromBuyer: string;
  sourcePlatform?: string;
  buyer_address?: any;
}
