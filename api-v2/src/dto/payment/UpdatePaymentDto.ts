import { PaymentProvider } from '../../models/Payment';

export class UpdatePaymentDto {
  paymentId: string;
  paymentNumber: string;
  paymentProvider?: PaymentProvider;
}
