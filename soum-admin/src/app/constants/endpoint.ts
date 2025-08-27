export const endpoint = {
  login: 'admin/login',
  twoFALogin: 'v1/dm-auth/login',
  getTwoFAQrCode: 'v1/dm-auth/mfa/enable',
  verifyEnableMfa: 'v1/dm-auth/mfa/enable/auth',
  loginEnableMfa: 'v1/dm-auth/mfa/auth',
  loginv2: 'v1/authentication/login',
  category: 'admin/category',
  getCategoriesV2: 'v1/category',
  getSuperCategoriesV2: 'v1/category?isSuperCategory=true',
  brand: 'admin/brand?category_id=',
  model: 'admin/model?brand_id=',
  addCotegory: 'admin/category',
  addCategoryV2: 'v1/category',
  addBrand: 'admin/brand',
  addModel: 'admin/model',
  bannersArray: (page: string, lang, position) => {
    return page === 'cars' ? `v1/banner/?type=${page}&lang=${lang}&bannerPosition=${position}` : `v1/banner/?bannerPage=${page}&lang=${lang}&bannerPosition=${position}`;
  },
  getCategoryBySuperCategoryId: (super_category_id: string) => {
    return `v1/category/super/${super_category_id}`;
  },
  editCategory: (category_id: string) => {
    return `admin/category/${category_id}`;
  },
  editCategoryV2: (category_id: string) => {
    return `v1/category/${category_id}`;
  },
  changeCollectionStatus: () => {
    return `v1/feed/status`;
  },
  addYesNoQuestions: (quesId: string) => {
    return `v1/questionnaire/${quesId}/questions`;
  },
  sendQuestions: (quesId: string) => {
    return `v1/response/${quesId}`;
  },
  sendQuestionsAdd: () => {
    return `v1/response`;
  },
  addYesNoQuestionsDelete: (questionnId: string, quesId: string) => {
    return `v1/questionnaire/${questionnId}/question/${quesId}`;
  },
  updateQuestionQ: (questionnId: string, quesId: string) => {
    console.log(questionnId, quesId);
    return `v1/questionnaire/${questionnId}/question/${quesId}`;
  },
  getQuestionDetails: (quesId: string) => {
    return `v1/question/${quesId}`;
  },
  addYesNoAnswersDelete: (questionnId: string, quesId: string) => {
    return `v1/question/${questionnId}/choice/${quesId}`;
  },
  getQuestionnairesList: (category_id: string) => {
    return `admin/category/${category_id}`;
  },
  deleteCategory: (category_id: string) => {
    return `v1/category/${category_id}`;
  },

  uploadImg: 'v1/questionnaire/single/upload',
  editBrand: (brand_id: string) => {
    return `admin/brand/${brand_id}`;
  },
  deleteBrand: (brand_id: string) => {
    return `admin/brand/${brand_id}`;
  },
  editModel: (model_id: string) => {
    return `admin/model/${model_id}`;
  },
  editModelCommission: (modal_id: string) => {
    return `v1/model/${modal_id}/commission`;
  },
  editModelV2: (modal_id: string) => {
    return `v1/model/${modal_id}/commission`;
  },
  deleteModel: (model_id: string) => {
    return `admin/model/${model_id}`;
  },
  getVarients: (model_id: string) => {
    return `admin/varient?model_id=${model_id}`;
  },
  getVarients2: (model_id: string) => {
    return `v1/variant?modelId=${model_id}`;
  },
  getPaginatedVariants: (model_id: string, offset: number, limit: number) => {
    return `v1/variant?modelId=${model_id}&offset=${offset}&limit=${limit}`;
  },
  addVarient: 'admin/varient',
  editVarient: (varient_id: string) => {
    return `admin/varient/${varient_id}`;
  },
  deleteVarient: (varient_id: string) => {
    return `admin/varient/${varient_id}`;
  },
  users: (
    current_page: number,
    limit: number,
    mobileNumber: string,
    filterParams: any
  ) => {
    return `v1/user?page=${current_page}&limit=${limit}&mobileNumber=${mobileNumber}&${filterParams}`;
  },
  bidsListing: (current_page: number, limit: number, mobileNumber: string) => {
    return `admin/bid/?page=${current_page}&limit=${limit}&mobileNumber=${mobileNumber}`;
  },
  bidsLogs: (current_page: number, limit: number, bidID: string) => {
    //  return `bid`;
    return `bid/?offset=${current_page}&limit=${limit}`;
  },
  bidLogDetails: (bidId: string) => {
    return `bid/detail/${bidId}`;
  },
  bidsRefeances: () => {
    return `bid/bid-settings/bid-reference`;
  },
  bidSettings: () => {
    return `bid/bid-settings`;
  },
  bidSettingsUpdate: (id: string) => {
    return `bid/bid-settings/${id}`;
  },
  commentsListing: (current_page: number, limit: number, params: string = '') => {
    return `v1/askSeller/?page=${current_page}&size=${limit}&${params}`;
  },
  referralReportsListing: (
    current_page: number,
    limit: number,
    searchValue: string
  ) => {
    return `admin/promo/referral/?page=${current_page}&limit=${limit}&searchValue=${searchValue}`;
  },
  referralLogs: (current_page: number, limit: number, searchValue: string) => {
    return `admin/promo/referral/log/?page=${current_page}&limit=${limit}&searchValue=${searchValue}`;
  },
  getCommissionList: () => {
    //  return `activity-log/commission?page=${current_page}&limit=${limit}`;
    return 'activity-log/commission?offset=0&limit=500';
  },
  changeUserStatus: (user_id: string) => {
    return `admin/user/change-status/${user_id}`;
  },
  changeUserStatusV2: (user_id: string) => {
    return `v1/user/change-status/${user_id}`;
  },
  editUser: (user_id: string) => {
    return `admin/user/${user_id}`;
  },
  editUserV2: (user_id: string) => {
    return `v1/user/${user_id}/details`;
  },
  deleteUser: (user_id: string) => {
    return `admin/user/${user_id}`;
  },
  getCollectionsList: (category) => {
    return category ? `v1/feed?category=${category}` : `v1/feed`;
  },
  getCommissionsTypes: () => {
    return `commission`;
  },
  postCommission: () => {
    return `commission`;
  },
  saveCommission: (id) => {
    return `commission/${id}`;
  },
  getCommissions: (tab, sellerType) => {
    return `commission?isBuyer=${tab}&userType=${sellerType}`;
  },
  deleteComissionbyID: (id: string) => {
    return `commission/${id}`;
  },
  getSellerArrayTypes: () => {
    return `commission/sellers-type`;
  },

  getCollectionsTypes: () => {
    return `v1/feed/collection-type`;
  },
  getCollectionsTypeList: (feedType, category?: string) => {
    return category ? `v1/feed?type=${feedType}&category=${category}` : `v1/feed?type=${feedType}`;
  },
  editCollectionsList: () => {
    return `v1/feed`;
  },
  getCollectionById: (id) => {
    return `v1/feed/${id}`;
  },
  deleteAttribute: (id: string) => {
    return `v1/Attribute/${id}`;
  },
  getAttributesList: () => {
    return `v1/attribute`;
  },
  getNewAttributesList: (
    size: number,
    page: number,
    optionsIncluded: boolean
  ) =>
    `category/attribute?size=${size}&page=${page}&optionsIncluded=${optionsIncluded}`,
  AddNewAttribut: () => {
    return `category/attribute`;
  },
  addNewAttributeOption: () => {
    return `category/option`;
  },
  updateNewAttributeOption: (optionId: string) => {
    return `category/option/${optionId}`;
  },
  updateNewAttribute: (attributeId: string) => {
    return `category/attribute/${attributeId}`;
  },
  getAttributeOptionsList: (
    attributeId: string,
    size: number,
    page: number,
    search
  ) =>
    `category/option?attributeId=${attributeId}&size=${size}&page=${page}&search=${search}`,
  deleteAttributeOption: (optionId) => `category/option/${optionId}`,
  deleteNewAttribute: (attributeId) => `category/attribute/${attributeId}`,
  addBanner: 'v1/banner',
  editBanner: (id) => `v1/banner/${id}`,
  editBannerPosition: () => `v1/banner/position`,
  editAttributesList: (id) => {
    return `v1/attribute/${id}`;
  },
  getAttributeById: (id) => {
    return `v1/attribute/${id}`;
  },
  getVarientList: (id) => {
    return `v1/variant?modelId=${id}`;
  },
  editVarientList: (id) => {
    return `v1/variant/${id}`;
  },
  getVarientById: (id) => {
    return `v1/variant/${id}`;
  },
  deleteVarientById: (id) => {
    return `v1/variant/${id}`;
  },

  productValidation: () => {
    return `v1/feed/products/validate`;
  },
  userDetail: (user_id: String) => {
    return `admin/user/${user_id}`;
  },
  systemSettings: 'admin/system-settings',
  v2SystemSettings: 'setting',

  productList: (
    current_page: number,
    limit: number,
    productType: string,
    mobileNumber: string
  ) => {
    return `admin/products?page=${current_page}&limit=${limit}&${productType}&mobileNumber=${mobileNumber}`;
  },

  tradeInProductList: (offset: number, limit: number, searchValue: string) => {
    if (searchValue) {
      return `v1/tradein?limit=${limit}&productId=${searchValue}`;
    }
    return `v1/tradein?offset=${offset}&limit=${limit}`;
  },

  productDetail: (product_id: string) => {
    return `admin/product/${product_id}`;
  },
  tradeInProductDetails: (product_id: string) => {
    return `v1/tradein/${product_id}`;
  },
  tradeInProductStatus: (product_id: string) => {
    return `v1/tradein/${product_id}/status`;
  },
  downloadBuyer: (order_id: string) => {
    return `v1/order/${order_id}?type=buyer&formate=zatca`;
  },
  downloadBuyerCredit: (order_id: string) => {
    return `v1/order/${order_id}?type=buyer&formate=zatcaCreditNote`;
  },
  downloadSellerCredit: (order_id: string) => {
    return `v1/order/${order_id}?type=seller&formate=zatcaCreditNote`;
  },
  downloadSeller: (order_id: string) => {
    return `v1/order/${order_id}?type=seller&formate=zatca`;
  },
  updateProductPrice: (productID: string) => {
    return `v1/product/${productID}/price`;
  },
  logsProductPrice: (productID: string) => {
    return `v1/product/${productID}/log`;
  },

  deleteProduct: (product_id: string) => {
    return `admin/product/${product_id}`;
  },
  deleteQ: (comment_id: string) => {
    return `v1/askSeller/delete/${comment_id}`;
  },
  updateComment: (commentId: string) => `v1/askSeller/${commentId}`,
  logout: 'v1/dm-auth/logout',
  approveProduct: (product_id: string) => {
    return `v1/product/${product_id}/approve`;
  },
  editSystemSettings: (id: string) => {
    return `admin/system-settings/${id}`;
  },
  adminList: (current_page: number, limit: number) => {
    return `admin?page=${current_page}&limit=${limit}`;
  },
  deleteAdmin: (admin_id) => {
    return `admin/${admin_id}`;
  },
  deleteBanner: (id) => {
    return `v1/banner/${id}`;
  },
  addAdmin: 'admin/add',
  editAdmin: (admin_id: string) => {
    return `admin/${admin_id}`;
  },
  masterQuestions: (category_id: string) => {
    return `admin/questions?category_id=${category_id}`;
  },
  linkQuestionToModel: (model_id: string) => {
    return `admin/model/assign-question/${model_id}`;
  },
  updateQuestion: (question_id: string) => {
    return `admin/question/update-question/${question_id}`;
  },
  updateAnswer: (question_id: string, answerID) => {
    return `v1/question/${question_id}/answer/${answerID}`;
  },
  updateAnswerChoice: (question_id: string, answerID) => {
    return `v1/question/${question_id}/choice/${answerID}`;
  },
  forgetPassword: `admin/forgot-password`,
  resetPassword: `admin/reset-password`,
  ChangePassword: 'admin/change-password',
  orderList: (
    page: number,
    limit: number,
    dispute: string,
    searchValue: string
  ) => {
    return `admin/orders?page=${page}&limit=${limit}${
      dispute ? `&dispute=${dispute}` : ``
    }${searchValue ? `&searchValue=${searchValue}` : ``}`;
  },
  disputeClosure: 'admin/order/dispute-status',
  refundOrder: 'v1/refund/',

  orderDetail: (order_id: string) => {
    return `admin/order/detail/${order_id}`;
  },
  orderDetails: (orderId: string, userType: string) => {
    return `v1/order/detail/${orderId}?type=${userType}`;
  },

  getOrderPayout: (order_id: string) => {
    return `admin/order/payout-order-info/${order_id}`;
  },

  getPayoutOrder: (order_id: string) => {
    return `v1/order/payout/${order_id}`;
  },
  payForSeller: (order_id: string) => {
    return `v1/order/payout/${order_id}`;
  },
  updatePayout: (order_id: string) => {
    return `v1/order/payout/${order_id}`;
  },
  getHistoryPayout: (order_id: string) => {
    return `v1/order/${order_id}/payout/history`;
  },

  addQuestionnaire: 'v1/questionnaire',
  getQuestionnaires: 'v1/questionnaire/filter',
  getQuestionsPerProduct: (product_id: string) => {
    return `v1/response/filter/${product_id}`;
  },
  readyPayout: 'admin/order/payout',
  addQuestion: 'admin/question',
  deleteQuestion: (question_id: string) => {
    return `admin/question/delete-question/${question_id}`;
  },
  deleteAnswer: (question_id: string, answer_id: string) => {
    return `admin/question/delete-answer/${question_id}/${answer_id}`;
  },
  renewProduct: (productID: string, days: string) => {
    return `admin/renew/${productID}/days/${days}`;
  },
  renewAll: (
    page: string,
    limit: string,
    mobileNumber: string,
    days: string
  ) => {
    return `admin/renewAll/page/${page}/limit/${limit}/days/${days}?mobileNumber=${mobileNumber}`;
  },
  changeCategoryOrder: 'admin/category/change-order',
  changeBrandOrder: 'admin/brand/change-order',
  changeModelOrder: 'admin/model/change-order',
  changeVariantOrder: 'admin/varient/change-order',
  changeCollectionOrder: 'v1/feed/change-order',
  uploadPriceNudge: 'v1/model/price-nudge',
  deleteBid: (bidID: string, productID: string) => {
    return `admin/product/${productID}/remove-bid/${bidID}`;
  },

  // promo code add || retrieve
  addPromoCode: 'admin/promo',
  getListPromoCode: (page: number, limit: number, searchValue) => {
    return `admin/promo?page=${page}&limit=${limit}&searchValue=${searchValue}`;
  },

  updatePromoCode: (promoID: string) => `admin/promo/update/${promoID}`,

  deletePromoCode: (promoID: string) => `admin/promo/delete/${promoID}`,

  getConditionsByVariantId: (variantId: string) =>
    `category/category-condition?variantId=${variantId}`,

  updateConditionsByID: (condition_id: string) =>
    `category/category-condition/${condition_id}`,
  getConditions: (catID: string, current_page, limit) =>
    `category/condition?categoryId=${catID}&offset=${current_page}&limit=${limit}`,
  addNewCondition: 'v1/condition/add',
  addNewConditionV2: 'category/condition',
  uploadCondition: 'category/condition/upload',
  deleteConditionById: (conditionId: string) =>
    `category/condition/${conditionId}`,
  updateConditionById: (conditionId: string) =>
    `category/condition/${conditionId}`,
  banks: `api/v1/banks`,
  getAddressFromV2: (userId: string) => `v1/user/${userId}/address`,

  // active / inActive promoCode
  activeInactivePromoCode: (promoId: any) => {
    return `admin/promo/change-status/${promoId}`;
  },
  getSettings: 'v1/setting',
  getRegion: 'v1/setting/region/value',
  filterSettings: 'v1/setting/filter',
  getSetting: (settingId: string) => {
    return `v1/setting/${settingId}`;
  },
  getAllDeletedListingProducts: (limit: number, page: number) =>
    `v1/product/deleted-listings?size=${limit}&page=${page}`,
  getAllMisMtachListingProducts: (
    limit: number,
    page: number,
    productID?: string,
    paramsType?: string
  ) =>
    `v1/product/mismatched-listings?size=${limit}&page=${page}&id=${productID}&${paramsType}`,
  getAllFlaggedListings: (limit: number, page: number, sortBy?: any) =>
    `v1/product/flagged-listings?size=${limit}&page=${page}&sortBy=${sortBy}`,
  getPendingFlaggedListings: (limit: number, page: number, sortBy?: any) =>
    `v1/product/pending-listings?size=${limit}&page=${page}&sortBy=${sortBy}`,
  getAllOnholdListingProducts: (limit: number, page: number) =>
    `v1/product/on-hold?size=${limit}&page=${page}`,
  getAllReportedListingProducts: (limit: number, page: number) =>
    `v1/product/reported-listings?size=${limit}&page=${page}`,
  // deleteProductV2: (productId: string) => `v1/product/delete/${productId}`,
  deleteOrRejectListingProduct: (productId: string, actionType: string) =>
    actionType === 'delete'
      ? `v1/product/delete/${productId}`
      : `v1/product/${productId}/reject`,
  betaUsers: (page: number, limit: number, phoneNumber?: string) =>
    `admin/users?page=${page}&limit=${limit}&mobileNumber=${phoneNumber}&isGetBetaUser=true`,
  sellerFees: (limit: number, page: number, isGetSuccess: boolean) =>
    `v1/product/listings-transactions?size=${limit}&page=${page}&isGetSuccess=${isGetSuccess}`,
  updateFraudProductStatus: (productID: string) =>
    `v1/product/verify-product/${productID}`,
  deleteProductImage: (productId: string) => `v1/product/images/${productId}`,
  updateEnableBrandAccesories: (brandId: string) => `v1/addon/${brandId}`,
  deleteBrandAccessories: (accID: string) => `v1/addon/${accID}`,
  addBrandAccessories: (brandID: string) => `v1/addon/${brandID}`,
  updateBrandAccessories: (accID: string) => `v1/addon/${accID}/addon`,
  saveRegaQrRealStateProduct: (productId: string) => `product/${productId}`,
  getImageGategorySections: (
    catId: string,
    limit: number,
    page: number,
    sectionType
  ) =>
    `product/image-section?categoryId=${catId}&limit=${limit}&offset=${page}&section=${sectionType}`,
  requestUrlToUploadImage: (
    countImage: number,
    extension: string,
    imageModule: string
  ) =>
    `product/aws/pre-signed-url?count=${countImage}&fileExtention=${extension}&imageModule=${imageModule}`,
  requestCategoryUrlToUploadImage: (
    countImage: number,
    extension: string,
    imageModule: string
  ) =>
    `category/aws/pre-signed-url?count=${countImage}&fileExtention=${extension}&imageModule=${imageModule}`,
  saveImageSection: `product/image-section`,
  updateImageSectionActive: (sectionId: string) =>
    `product/image-section/${sectionId}`,
  getDummySectionsImages: (productId: string) =>
    `product/${productId}/deepload?isGetImages=true`,
  updateImageSection: (productId: string) => `product/${productId}`,
  getAddonsByModel: (model_id: string) => `addon?modelId=${model_id}`,
  deleteAddonById: (addon_id: string) => `addon/${addon_id}`,
  updateAddons: (addon_id: string) => `addon/${addon_id}`,
  addNewAddons: () => `addon`,
};
