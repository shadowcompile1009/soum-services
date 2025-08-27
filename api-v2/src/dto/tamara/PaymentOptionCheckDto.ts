export class PaymentOptionCheckDto {
  has_available_payment_options: boolean;
  single_checkout_enabled: boolean;
  available_payment_labels: AvailablePaymentLabels[];
}

export class AvailablePaymentLabels {
  payment_type: string;
  instalment: number;
  description: string;
  description_ar: string;
}

export class TamaraPaymentTypes {
  name: string;
  description: string;
  description_ar: string;
  min_limit: {
    amount: number;
    currency: string;
  };
  max_limit: {
    amount: number;
    currency: string;
  };
  supported_instalments: TamaraInstallments[];
}
export class TamaraInstallments {
  instalments: number;
  min_limit: {
    amount: number;
    currency: string;
  };
  max_limit: {
    amount: number;
    currency: string;
  };
}

export class CustomerVerificationCheckDto {
  is_id_verified: boolean;
}
