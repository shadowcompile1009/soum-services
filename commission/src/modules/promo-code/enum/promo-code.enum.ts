export enum UserType {
  SELLER = 'Seller',
  BUYER = 'Buyer',
}

export enum PromoType {
  FIXED = 'Fixed',
  PERCENTAGE = 'Percentage',
}

export enum PromoGenerator {
  ADMIN = 'Admin',
  REFERRAL = 'Referral',
}

export enum PromoCodeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PromoCodeScopeTypeEnum {
  FEEDS = 'feeds',
  MODELS = 'models',
  BRANDS = 'brands',
  CATEGORIES = 'categories',
  SELLERS = 'sellers',
}

export class PromoCodeScope {
  promoCodeScopeType: PromoCodeScopeTypeEnum;
  ids: string[];
}

export enum PaymentProvider {
  HyperPay = 'hyperPay',
  Tabby = 'tabby',
  TAMARA = 'tamara',
  TAMAM = 'tamam',
  MOYASAR = 'moyasar',
  MADFU = 'madfu',
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
  MADFU = 'MADFU',
}

export class PromoCodePayment {
  paymentProvider: PaymentProvider;
  paymentProviderType: PaymentProviderType;
}
