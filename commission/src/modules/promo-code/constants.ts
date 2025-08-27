export const errorMessages = {
  PROMO_CODE_NOT_FOUND: {
    en: 'Sorry! could not find this promo code.',
    ar: 'آسف! تعذر العثور على هذا الرمز الترويجي.',
  },
  USING_OWN_PROMO: {
    en: 'Sorry! could not use your own promo code.',
    ar: 'آسف! لا يمكن استخدام الرمز الترويجي الخاص بك.',
  },
  PROMO_CODE_ALREADY_EXISTS: {
    en: 'PromoCode already exists.',
    ar: 'الرمز الترويجي موجود بالفعل.',
  },
  DEFAULT_PROMO_ALREADY_EXISTS: {
    en: 'Default promo already exists.',
    ar: 'العرض الترويجي الافتراضي موجود بالفعل.',
  },
  MINIMUM_SPEND_LIMIT_SHOULD_BE_GREATER_THAN_DISCOUNT: {
    en: 'Minimum spend limit should be greater than discount.',
    ar: 'يجب أن يكون الحد الأدنى للإنفاق أكبر من الخصم.',
  },
  PROMO_LIMIT_FAILED: {
    en: 'This promo can only be applied to higher priced products',
    ar: 'لا يمكن تطبيق هذا العرض الترويجي إلا على المنتجات ذات الأسعار الأعلى.',
  },
  PROMO_CODE_NO_LONGER_VALID: {
    en: 'Sorry! promo code is no longer valid.',
    ar: 'آسف! الرمز الترويجي لم يعد صالحا.',
  },
  PROMO_CODE_NOT_APPLICABLE_TO_PRODUCT: {
    en: 'This promocode cannot be applied on this product',
    ar: 'لا يمكن تطبيق هذا الرمز الترويجي على هذا المنتج،',
  },
  CODE_CANNOT_BE_SPECIFIED_FOR_BULK_GENERATION: {
    en: 'Code should not be specified for bulk generation',
    ar: 'لا ينبغي تحديد التعليمات البرمجية للإنشاء المجمع',
  },
  PROMO_CODE_NOT_APPLICABLE_TO_PAYMENT_METHOD: {
    en: 'This promocode cannot be applied on this payment method.',
    ar: 'لا يمكن تطبيق هذا الرمز الترويجي على طريقة الدفع هذه.',
  },
  PROMO_CODE_USED_BEFORE: {
    en: 'This promo code has been used before.',
    ar: 'كود الخصم مستخدم من قبل',
  },
};

export const getErrorMessage = (key: string, lang: string = null) => {
  if (!lang) {
    return errorMessages[key]['en'];
  }
  return errorMessages[key][lang];
};
