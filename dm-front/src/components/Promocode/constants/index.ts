export enum PromoCodeScopeType {
  FEEDS = 'feeds',
  MODELS = 'models',
  BRANDS = 'brands',
  CATEGORIES = 'categories',
  SELLERS = 'sellers',
}

export const promoCodeScopeTypeConfig = [
  {
    label: 'Collection ID',
    value: PromoCodeScopeType.FEEDS,
  },
  {
    label: 'Models',
    value: PromoCodeScopeType.MODELS,
  },
  {
    label: 'Brands',
    value: PromoCodeScopeType.BRANDS,
  },
  {
    label: 'Categories',
    value: PromoCodeScopeType.CATEGORIES,
  },
  {
    label: 'Sellers',
    value: PromoCodeScopeType.SELLERS,
  },
];

export enum PaymentProvider {
  HyperPay = 'hyperPay',
  Tabby = 'tabby',
  TAMARA = 'tamara',
  TAMAM = 'tamam',
}
export enum PaymentProviderType {
  ApplePay = 'APPLEPAY',
  Mada = 'MADA',
  VisaMaster = 'VISA_MASTER',
  StcPay = 'STC_PAY',
  Tabby = 'TABBY',
  TAMARA = 'TAMARA',
  TAMAM = 'TAMAM',
  URPAY = 'URPAY',
}

export const paymentMethodsConfig = [
  {
    label: 'Apple Pay',
    value: {
      paymentProvider: PaymentProvider.HyperPay,
      paymentProviderType: PaymentProviderType.ApplePay,
    },
  },
  {
    label: 'VISA/MC',
    value: {
      paymentProvider: PaymentProvider.HyperPay,
      paymentProviderType: PaymentProviderType.VisaMaster,
    },
  },
  {
    label: 'Mada',
    value: {
      paymentProvider: PaymentProvider.HyperPay,
      paymentProviderType: PaymentProviderType.Mada,
    },
  },
  {
    label: 'Tabby',
    value: {
      paymentProvider: PaymentProvider.Tabby,
      paymentProviderType: PaymentProviderType.Tabby,
    },
  },
  {
    label: 'Tamara',
    value: {
      paymentProvider: PaymentProvider.TAMARA,
      paymentProviderType: PaymentProviderType.TAMARA,
    },
  },
  {
    label: 'STC Pay',
    value: {
      paymentProvider: PaymentProvider.HyperPay,
      paymentProviderType: PaymentProviderType.StcPay,
    },
  },
  {
    label: 'UrPay',
    value: {
      paymentProvider: PaymentProvider.HyperPay,
      paymentProviderType: PaymentProviderType.URPAY,
    },
  },
];
