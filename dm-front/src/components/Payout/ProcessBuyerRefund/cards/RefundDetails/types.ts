import { IPaymentMethod } from '@src/models/OrderDetails';

export interface RefundFormValues {
  refundPaymentMethod: IPaymentMethod;
  orderStatus: {
    id: string;
    name: string;
    displayName: string;
  };
  refundToPay: string | number;
}
