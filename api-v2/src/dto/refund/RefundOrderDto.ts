import { DisplayName } from '../../enums/PaymentMethod.Enum';
import { RefundMethod } from '../../enums/RefundMethod';

export class RefundOrderDto {
  orderId: string;
  refundAmount: number;
  refundMethod: RefundMethod | DisplayName | any;
}
