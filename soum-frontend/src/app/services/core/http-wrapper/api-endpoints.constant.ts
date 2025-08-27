export const ApiEndpoints = {
  category: 'category',
  brand: (category_id: string) => {
    return `brand/${category_id}`;
  },
  model: (category_id: string, brandId: string) => {
    return `model/${category_id}/${brandId}`;
  },
  products: (categoryId: string) => {
    return `product/list${categoryId ? `/` + categoryId : ''}`;
  },
  productsV2: (categoryId: string, payload) => {
    
    if (Object.keys(payload).length === 0) {
      return `v1/model/summary${categoryId ? `/` + categoryId : ''}`;
    }
    return `v1/model/summary${categoryId ? `/` + categoryId : ''}${
      payload.price && payload.price.to ? `?priceMax=${payload.price.to}` : ``
    }${
      payload.price && payload.price.from
        ? `&priceMin=${payload.price.from}`
        : ``
    }${payload.brand.length ? `&brands=${payload.brand}` : ``}${
      payload.model.length ? `&models=${payload.model}` : ``
    }`;   
  },
  exploreProducts: (payload) => {
    if (Object.keys(payload).length === 0) {
      return `v1/product/explore?page=${1}&size=${12}`;
    }
    return `v1/product/explore?page=${payload.page}${payload.size ? `&size=${payload.size}` : `12`}`;
  },
  UserCity: (payload) => {
    return `v1/delivery/coordinate-to-city?latitude=${payload.latitude}&longitude=${payload.longitude}`;
  },
  AllProducts: (size, page) => {
    return `v1/user/my-sell-products?page=${page}&size=${size}`;
  },
  AllExpiredProducts: (size, page) => {
    return `v1/user/my-expired-products?page=${page}&size=${size}`;
  },
  AllActiveBids: () => {
    return `v1/user/active-bids`;
  },
  productListByModel: (model_id: string, sum, page, payload) => {
    return `v1/product/get-mpp-products/${model_id}?page=${page}&size=${sum}${
      payload.price && payload.price.from
        ? `&minPrice=${payload.price.from}`
        : ``
    }${
      payload.price && payload.price.to ? `&maxPrice=${payload.price.to}` : ``
    }${
      payload.capacities && payload.capacities.length
        ? `&capacities=${payload.capacities}`
        : ``
    }${
      payload.grade && payload.grade.length ? `&grades=${payload.grade}` : ``
    }${
      payload.sort
        ? `&sortDirection=${payload.sort}`
        : ``
    }${
      payload.userCity
        ? `&userCity=${payload.userCity}`
        : ``
    }`;
  },
  productListByCategory: (category_id: string, limit, page) => {
    return `product/get-products-by-category/${category_id}?limit=${limit}&page=${page}`;
  },
  productDetail: (product_id: string) => {
    return `v1/product/${product_id}/preview`;
  },
  login: 'auth/login',
  logout: 'auth/logout',
  signup: 'auth/signup',
  uploadProduct: 'product',
  sendOtp: 'auth/send_code',
  signInUpOtp: 'auth/send-otp',
  login_signup: 'auth/login-signup',
  resendOtp: 'auth/resend_code',
  verifyOtp: 'auth/otp_verify',
  registration: 'auth/complete_registration',
  setPassword: 'auth/complete-registration',
  forgotPassword: 'auth/forgot_password',
  resetPassword: 'auth/reset_password',
  changePassword: 'auth/change_password',
  appSetting: 'setting',
  appSettingV2: 'v1/setting',
  profile: 'user/profile',
  getAddress: 'user/address',
  addAddress: 'user/address',
  editAddress: (address_id: string) => {
    return `user/address/${address_id}`;
  },
  deleteAddress: (address_id: string) => {
    return `user/address/${address_id}`;
  },
  getHotDealsv2: (hotDealsId: string) => `v1/feed/preview/${hotDealsId}`,
  getNewAddressv2: (userId: string) => `v1/user/${userId}/address`,
  addNewAddressv2: (userId: string) => `v1/user/${userId}/address`,
  updateAddressv2: (userId: string, addressId: string) =>
    `v1/user/${userId}/address/${addressId}`,
  deleteAddressv2: (userId: string, addressId: string) =>
    `v1/user/${userId}/address/${addressId}`,
  getCards: 'user/cards',
  addCard: 'user/card',
  editCard: (card_id: string) => {
    return `user/card/${card_id}`;
  },
  deleteCard: (card_id: string) => {
    return `user/card/${card_id}`;
  },
  favoriteProduct: 'product/favourite',
  unfavoriteProduct: 'product/unfavourite',
  favoritedProductList: 'product/favourite/list',
  bid: 'product/bidding',
  myBidProducts: 'user/my-bid-products',
  mySellProducts: 'user/my-sell-products',
  boughtProducts: 'user/bought-sold',
  SoldProducts: 'user/sell-sold',
  askQuestion: 'product/question',
  postAnswer: 'product/answer',
  removeBid: 'product/remove-bid',
  editProfile: 'user/profile',
  buyProduct: 'product/buy',
  buyProductnew: 'product/purchase',
  transactionSave: 'order/transaction/save',
  shippingDetail: (order_id: string) => {
    return `order/ship-detail/${order_id}`;
  },
  orderDetail: (order_id: string) => {
    return `order/detail/${order_id}`;
  },
  orderDetails: (orderId: string, userType: string) => {
    return `v1/order/detail/${orderId}?type=${userType}`;
  },
  deleteProduct: (product_id: string) => {
    return `product/${product_id}`;
  },
  cancelOrder: 'order/cancel',
  notifyUserWithOrder: 'order/user-notify',
  cardList: 'user/cards',
  renewProduct: (product_id: string, days: number) => {
    return `product/renew/${product_id}/days/${days}`;
  },
  cancelTransaction: 'order/transaction/cancel',
  bidTransactionDone: 'order/bid-transaction/save',
  bidTransactionCancel: 'order/bid-transaction/cancel',
  acceptBid: 'product/accept-bid',
  rejectBid: 'product/reject-bid',
  buyProductWhenBidAccepted: 'product/buy-from-bid',
  bankList: 'banks', // /banks?like=NCB
  addBank: 'user/bank-account',
  confirmDelivery: 'order/delivered',
  deleteBankDetail: 'user/bank-account',
  updateAddress: (address_id: string) => {
    return `user/address/${address_id}`;
  },
  trackOrder: 'order/track',
  validatePromoCode: (code: string, userType: string, productId: string) => {
    return `promo/validate?code=${code}&userType=${userType}&productId=${productId}`;
  },
  getNotificationCount: 'notification/count',
  getNotificationList: 'notification',
  markNotificationAsRead: (notificationId) => {
    return `notification/read?notificationId=${notificationId}`;
  },
  clearAllNotification: 'notification/clear',
  getModelVarientsById: (modelId: any) => {
    return `varients/${modelId}`;
  },
  getProductCalculationPrice: (
    bidId: any,
    productId: any,
    promoId: any,
    actionType: any,
    bidValue: any
  ) => {
    return `product/calculate?bidId=${bidId}&productId=${productId}&promocodeId=${promoId}&actionType=${actionType}&bidValue=${bidValue}`;
  },
  validateMobileNumber: 'auth/login',
  //validateMobileNumber: "auth/check-mobile",
  setLanguage: 'user/profile/set-lang',
  validateBidPrice: 'product/validate-bid',
  generateReferralCode: 'promo/referral-code',
  getQuestionnaires: 'v1/questionnaire/filter',
  postAnswersToProduct: 'v1/response',
  putAnswersToProduct: (response_id: string) => {
    return `v1/response/${response_id}`;
  },
  getConditionPriceNudging: (varientID) => {
    return `condition/${varientID}`;
  },
  getInvoiceOrderLink: (orderId, typeUser) => {
    return `v1/order/${orderId}?type=${typeUser}`;
  },
  getAnswersToProduct: (product_id: string) => {
    return `v1/response/filter/${product_id}`;
  },
  saveAsDraftProduct: 'v1/product',
  specificProduct: (product_id: string) => {
    return `v1/product/${product_id}/preview`;
  },
  specificCategory: (category_id: string) => {
    return `v1/category/${category_id}`;
  },
  specificBrand: (brand_id: string) => {
    return `v1/brand/${brand_id}`;
  },
  specificModel: (model_id: string) => {
    return `v1/model/${model_id}`;
  },
  specificVariant: (variant_id: string) => {
    return `v1/variant/${variant_id}`;
  },
  validateListing: (userId: any) => {
    return `v1/product/prerequisite?userId=${userId}`;
  },
  checkUserListedBefore: 'v1/user/preferences',
  modelSummaryById: (categoryID: any) => {
    return `v1/model/summary/${categoryID}`;
  },
  getBaseAttributesByModelID: (modelID: string) => {return `v1/variant/attribute?modelId=${modelID}`},
  getNextAttributeVariant: (modelID: string, baseAttributeID: string, baseAttributeOptionID: string,nextAttributeID: string, previousOptions: any[]) => {return `v1/variant/filter/attribute?modelId=${modelID}&filterId=${baseAttributeID}&optionId=${baseAttributeOptionID}&attributeId=${nextAttributeID}&previousOptions=${previousOptions}`},
  getVariantDetails: (modelID: string, baseAttributeID: string, baseAttributeOptionID: string,selectedAttributesID: any[]) => { return `v1/variant/attributes?modelId=${modelID}&attributeId=${baseAttributeID}&optionId=${baseAttributeOptionID}&filterIds=${selectedAttributesID}`}
};

export const DHLendpoints = {
  shippingDetail: (tracking_number: number) => {
    return `/shipments?trackingNumber=${tracking_number}`;
  }
};
