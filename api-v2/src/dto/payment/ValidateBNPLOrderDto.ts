import { PaymentProvider, PaymentProviderType } from '../../models/Payment';

export class ValidateBNPLOrderDto {
  productId: string;
  amount: number;
  paymentProviderType: PaymentProviderType;
  paymentProvider: PaymentProvider;
}
