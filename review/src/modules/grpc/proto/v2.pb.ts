/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "v2";

export interface GetPromoCodeRequest {
  id: string;
}

export interface GetPromoCodeResponse {
  promoLimit: number;
  type: string;
  generator: string;
  discount: number;
  percentage: number;
}

export interface GetProductsForProductServiceResponse {
  products: ProductForProductService[];
}

export interface ProductForProductService {
  id: string;
  description: string;
  categories: Category[];
  imagesUrl: string[];
  score: number;
  sellPrice: number;
  status: string;
  sellType: string;
  userId: string;
  groupListingId: string;
  statusSummary: StatusSummary | undefined;
}

export interface Category {
  id: string;
  type: string;
  name?: string | undefined;
  nameAr?: string | undefined;
}

export interface StatusSummary {
  isApproved: boolean;
  isExpired: boolean;
  isDeleted: boolean;
  isReported: boolean;
  isVerifiedByAdmin: boolean;
  isFraudDetected: boolean;
  isSearchSync: boolean;
}

export interface GetCountdownValInHoursRequest {
  modelId: string;
}

export interface GetCountdownValInHoursResponse {
  countdownValInHours: number;
}

export interface ValidateSellerDetectionNudgeRequest {
}

export interface ValidateSellerDetectionNudgeResponse {
  isActiveSellerDetectionNudge: boolean;
}

export interface GetVariantsRequest {
  categoryId: string;
}

export interface GetVariantsResponse {
  variants: Variant[];
}

export interface Variant {
  id: string;
  name: string;
  nameAr: string;
}

export interface MigrateCategoryCondition {
  id: string;
  categoryId: string;
  priceNudgeMin: number;
  priceNudgeMax: number;
  fairPrice: number;
  fairTTL: number;
  excellentPrice: number;
  excellentTTL: number;
  expensivePrice: number;
  expensiveTTL: number;
}

export interface GetOrderDetailResponse {
  buyerId: string;
  sellerId: string;
  sellerOrderDetail: SellerOrderDetail | undefined;
  buyerOrderDetail: BuyerOrderDetail | undefined;
  productName: string;
  orderNumber: string;
  orderId: string;
  productId: string;
  sellerPhoneNumber: string;
  buyerPhoneNumber: string;
}

export interface GetOrderDetailRequest {
  orderId: string;
}

export interface GetUserRequest {
  id: string;
}

export interface GetDmUserRequest {
  userId: string;
}

export interface GetPermissionsRequest {
  serviceName: string;
}

export interface GetUserResponse {
  id: string;
  name: string;
  phoneNumber: string;
  bankDetail: Bank | undefined;
  address: Address | undefined;
  email: string;
  isKeySeller: boolean;
  isMerchant: boolean;
  activeListings: number;
  soldListings: number;
  avatar: string;
  activatedDate: string;
  bio: string;
}

export interface GetDmUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  status: string;
  email: string;
  phoneNumber: string;
}

export interface SellerOrderDetail {
  payoutAmount: number;
  sellPrice: number;
}

export interface BuyerOrderDetail {
  grandTotal: number;
}

export interface Bank {
  accountHolderName: string;
  accountId: string;
  bankBIC: string;
  bankName: string;
  isNonSaudiBank: boolean;
}

export interface Address {
  street: string;
  district: string;
  city: string;
  postalCode: string;
  latitude: string;
  longitude: string;
}

export interface Permission {
  key: string;
  description: string;
}

export interface GetUsersRequest {
  userIds: string[];
  limitUsersWithBank: boolean;
}

export interface GetPermissionsResponse {
  permissions: Permission[];
}

export interface GetUsersResponse {
  users: GetUsersResponse_User[];
}

export interface GetUsersResponse_User {
  id: string;
  name: string;
  phoneNumber: string;
  bankDetail: Bank | undefined;
  isKeySeller: boolean;
  isMerchant: boolean;
}

export interface GetDmUsersRequest {
  userIds: string[];
}

export interface GetDmUsersResponse {
  users: GetDmUsersResponse_DmUser[];
}

export interface GetDmUsersResponse_DmUser {
  id: string;
  username: string;
  phoneNumber: string;
}

export interface GetUsersByPhoneRequest {
  phoneNumber: string;
}

export interface GetUsersByPhoneResponse {
  users: GetUsersByPhoneResponse_User[];
}

export interface GetUsersByPhoneResponse_User {
  id: string;
  name: string;
  phoneNumber: string;
  bankDetail: Bank | undefined;
}

export interface UpdateHighestBidRequest {
  productId: string;
  bid: number;
}

export interface UpdateHighestBidResponse {
}

export interface GetProductsRequest {
  productIds: string[];
  getAttributes?: boolean | undefined;
}

export interface GetProductForCommissionRequest {
  productId: string;
  promoCodeId: string;
}

export interface PromoCode {
  promoLimit: number;
  type: string;
  generator: string;
  discount: number;
  percentage: number;
}

export interface Product {
  id: string;
  sellPrice: number;
  priceQuality: string;
  source: string;
}

export interface GetProductForCommissionResponse {
  product: Product | undefined;
  userType: string;
  priceQuality: string;
  calculationSettings: CalculationSettings | undefined;
  promoCode: PromoCode | undefined;
}

export interface GetProductsResponse {
  products: GetProductsResponse_Product[];
}

export interface GetProductsResponse_Product {
  productId: string;
  sellerId: string;
  productName: string;
  startBid: number;
  sellerName: string;
  productNameAr: string;
  commission: number;
  shipping: number;
  availablePayment: string;
  isExpired: boolean;
  vat: number;
  productImg: string;
  isDeleted: boolean;
  isSold: boolean;
  sellPrice: number;
  sellerCity: string;
  vatPercentage: number;
  sellDate?: string | undefined;
  attributes: Attribute[];
}

export interface CalculationSettings {
  vatPercentage: number;
  applyDeliveryFeeSPPs: boolean;
  applyDeliveryFeeMPPs: boolean;
  applyDeliveryFee: boolean;
  deliveryFeeThreshold: number;
  deliveryFee: number;
  referralFixedAmount: number;
  buyerCommissionPercentage: number;
  sellerCommissionPercentage: number;
  priceQualityExtraCommission: number;
}

export interface GetMarketPriceByVariantIdRequest {
  variantId: string;
  grade: string;
}

export interface GetMarketPriceByVariantIdResponse {
  minPrice: number;
  maxPrice: number;
}

export interface CreateOrderRequest {
  productId: string;
  paymentOptionId: string;
  userId: string;
  amount: number;
  soumTransactionNumber: string;
  clientType: string;
}

export interface CreateOrderResponse {
  orderId: string;
  dmOrderId: string;
}

export interface GetProductStatusesRequest {
  productId: string;
}

export interface GetProductStatusesResponse {
  deleted: boolean;
  expired: boolean;
  sold: boolean;
}

export interface UpdateLogisticServiceRequest {
  serviceId: string;
  vendorId: string;
  dmoId: string;
  serviceName: string;
}

export interface UpdateLogisticServiceResponse {
}

export interface GetBidSummaryRequest {
  productId: string;
  bidPrice: number;
  userId: string;
  allPayments: boolean;
  paymentOptionId: string;
}

export interface BidProduct {
  productId: string;
  sellerId: string;
  productName: string;
  startBid: number;
  sellerName: string;
  productNameAr: string;
  isExpired: boolean;
  productImg: string;
  isDeleted: boolean;
  isSold: boolean;
}

export interface GetBidSummaryResponse {
  product: BidProduct | undefined;
  commissionSummaries: BreakDownResponse[];
}

export interface BreakDownResponse {
  withPromo: CommissionSummaryResponse | undefined;
  withoutPromo: CommissionSummaryResponse | undefined;
}

export interface CommissionAnalysis {
  commissionTotalPercentage: number;
  commissionTotalFixed: number;
  paymentCommissionExtraFees: number;
  paymentCommission: number;
  paymentCommissionVat: number;
  nonPaymentCommission: number;
  nonPaymentCommissionVat: number;
  paymentCommissionWithVat: number;
  nonPaymentCommissionWithVat: number;
}

export interface CommissionSummaryResponse {
  id: string;
  commission: number;
  commissionVat: number;
  deliveryFee: number;
  deliveryFeeVat: number;
  totalVat: number;
  discount: number;
  grandTotal: number;
  commissionDiscount: number;
  sellPrice: number;
  commissionAnalysis: CommissionAnalysis | undefined;
  paymentId: string;
}

export interface GetViewedProductsRequest {
  productIds: string[];
}

export interface GetLegacyUserViaLocalPhoneRequest {
  mobileNumber: string;
}

export interface GetLegacyUserViaLocalPhoneResponse {
  isValid: boolean;
  countryCode: string;
  mobileNumber: string;
  userType: string;
  userId: string;
  userStatus: string;
  otpVerification: boolean;
  isActive: boolean;
  isDeleted: boolean;
  isMerchant: boolean;
  language: string;
  ratesScan: boolean;
  profilePic: string;
  listings: GetLegacyUserViaLocalPhoneResponse_Listings | undefined;
  name: string;
  cards: string[];
  isAllowedMobileNumber: boolean;
  region: string;
}

export interface GetLegacyUserViaLocalPhoneResponse_Listings {
  activeListings: number;
  completedSales: number;
  purchasedProducts: number;
  soldListings: number;
}

export interface CreateNewUserRequest {
  mobileNumber: string;
  countryCode: string;
}

export interface CreateNewUserResponse {
  userId: string;
  userStatus: string;
  language: string;
  ratesScan: boolean;
  profilePic: string;
  listings: CreateNewUserResponse_Listings | undefined;
}

export interface CreateNewUserResponse_Listings {
  activeListings: number;
  completedSales: number;
  purchasedProducts: number;
  soldListings: number;
}

export interface UpdateInactiveUserRequest {
  userId: string;
  otpVerification: boolean;
}

export interface UpdateInactiveUserResponse {
}

export interface CancelOrderRequest {
  userId: string;
  orderId: string;
}

export interface CancelOrderResponse {
}

export interface Banner {
  position: number;
  id: string;
  bannerName: string;
  bannerImage: string;
  bannerPage: string;
  bannerPosition: string;
  bannerType: string;
  bannerValue: string;
  lang: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetBannersResponse {
  banners: Banner[];
}

export interface GetBannersRequest {
  bannerPage: string[];
  bannerPosition: string;
  region: string;
  lang: string;
}

export interface GetFeedRequest {
  size: number;
  feedTypes: string[];
  brands: string[];
  models: string[];
  categories: string[];
}

export interface FeedProductAttribute {
  title: Title | undefined;
  value: Value | undefined;
}

export interface Title {
  arName: string;
  enName: string;
}

export interface Value {
  arName: string;
  enName: string;
}

export interface Attribute {
  title: Title | undefined;
  value: Value | undefined;
}

export interface GetViewedProductsResponse {
  products: GetViewedProductsResponse_Product[];
}

export interface GetViewedProductsResponse_Product {
  id: string;
  grade: string;
  gradeAr: string;
  deviceModel: DeviceModel | undefined;
  variant: Variant | undefined;
  attributes: Attribute[];
  isGreatDeal: boolean;
  isMerchant: boolean;
  originalPrice: number;
  productImage: string;
  productImages: string[];
  sellPrice: number;
  tags: string;
  sellStatus: string;
  sellDate: string;
  condition: Condition | undefined;
  showSecurityBadge: boolean;
  brand: Category | undefined;
  category: Category | undefined;
}

export interface DeviceModel {
  name: string;
  nameAr: string;
}

export interface FeedProduct {
  originalPrice: number;
  modelName: string;
  arModelName: string;
  productId: string;
  sellPrice: number;
  grade: string;
  arGrade: string;
  productImage: string;
  variantName: string;
  arVariantName: string;
  discount: number;
  attributes: FeedProductAttribute[];
  productImages: string[];
  condition: Condition | undefined;
  showSecurityBadge: boolean;
}

export interface FeedItem {
  id: string;
  arName: string;
  enName: string;
  items: FeedProduct[];
  arTitle: string;
  enTitle: string;
  expiryDate: string;
  feedType: string;
}

export interface Model {
  id: string;
  arName: string;
  enName: string;
  modelIcon: string;
}

export interface GetFeedsResponse {
  feeds: FeedItem[];
  mostSoldModels: Model[];
}

export interface Condition {
  id: string;
  name: string;
  nameAr: string;
  labelColor: string;
  textColor: string;
}

export interface UpdatePenaltyFlagRequest {
  sellerId: string;
}

export interface UpdatePenaltyFlagResponse {
}

export interface GetInvoiceGenerationFlagRequest {
  dmoId: string;
}

export interface GetInvoiceGenerationFlagResponse {
  isGenerated: boolean;
}

export interface UpdatePaymentStatusOfOrderRequest {
  paymentId: string;
  paymentNumber: string;
  paymentProvider: string;
}

export interface UpdatePaymentStatusOfOrderResponse {
}

export interface GetRecentlySoldProductsRequest {
  hours: number;
  limit: number;
  offset: number;
}

export interface GetSellerBadgeRequest {
  userId: string;
}

export interface GetSellerBadgeResponse {
  activateTenDaysGuarantee: boolean;
  isSFPaid: boolean;
  hasHighFRate: boolean;
}

export interface GetOrderSaleAnalyticsRequest {
  merchantId: string;
  range: string;
}

export interface GetOrderSaleAnalyticsResponse {
  data: GetOrderSaleAnalyticsResponse_TotalsByStatusResponse[];
  totalTransactions: number;
  totalAmountOverall: number;
}

export interface GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
  statusName: string;
  totalAmount: number;
  transaction: number;
}

export interface GetPendingPayoutAnalyticsRequest {
  merchantId: string;
}

export interface GetPendingPayoutAnalyticsResponse {
  merchantId: string;
  totalAmount: number;
}

export interface GetPendingPayoutPaginationRequest {
  merchantId: string;
  search: string;
  page: number;
  size: number;
}

export interface GetPendingPayoutPaginationResponse {
  payouts: GetPendingPayoutPaginationResponse_PayoutDetails[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface GetPendingPayoutPaginationResponse_PayoutDetails {
  productName: string;
  productNameAR: string;
  payoutAmount: string;
  orderNumber: string;
}

export interface GetPenalizedOrdersRequest {
  dmoIds: string[];
  page: number;
  size: number;
  range: string;
}

export interface GetPenalizedOrdersResponse {
  orders: GetPenalizedOrdersResponse_PenalizedOrders[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetPenalizedOrdersResponse_PenalizedOrders {
  productName: string;
  orderNumber: string;
  payoutAmount: number;
  penalty: number;
  finalPayout: number;
  nctReason: string;
  nctReasonAR: string;
  dmoId: string;
}

export interface GetCompletionRateUserRequest {
  userId: string;
  range: string;
}

export interface GetCompletionRateUserResponse {
  completionRate: number;
}

export interface GetTopSellingProductModelsRequest {
  merchantId: string;
  range: string;
  sorting: string;
  page: number;
  size: number;
}

export interface GetTopSellingProductModelsResponse {
  products: GetTopSellingProductModelsResponse_TopSellingProduct[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface GetTopSellingProductModelsResponse_TopSellingProduct {
  modelName: string;
  varient: string;
  totalSales: number;
  modelIcon: string;
  modelNameAR: string;
  totalAmount: number;
  varientAR: string;
}

export interface SetUserOTPRequest {
  countryCode: string;
  mobileNumber: string;
  otp: string;
}

export interface SetUserOTPResponse {
  status: boolean;
}

export interface CheckUserOTPRequest {
  userId: string;
  otp: string;
}

export interface CheckUserOTPResponse {
  status: boolean;
}

export interface SMSATracking {
  id: string;
  inspectionStatus: string;
  inspectionCenter: string;
  trackingNumber: string;
}

export interface CreateSMSATracking {
  trackingData: SMSATracking[];
}

export const V2_PACKAGE_NAME = "v2";

export interface V2ServiceClient {
  getUser(request: GetUserRequest): Observable<GetUserResponse>;

  getUsers(request: GetUsersRequest): Observable<GetUsersResponse>;

  getPermissions(request: GetPermissionsRequest): Observable<GetPermissionsResponse>;

  getOrderDetail(request: GetOrderDetailRequest): Observable<GetOrderDetailResponse>;

  getDmUser(request: GetDmUserRequest): Observable<GetDmUserResponse>;

  getDmUsers(request: GetDmUsersRequest): Observable<GetDmUsersResponse>;

  getUsersByPhone(request: GetUsersByPhoneRequest): Observable<GetUsersByPhoneResponse>;

  updateHighestBid(request: UpdateHighestBidRequest): Observable<UpdateHighestBidResponse>;

  getProducts(request: GetProductsRequest): Observable<GetProductsResponse>;

  getProductForCommission(request: GetProductForCommissionRequest): Observable<GetProductForCommissionResponse>;

  getMarketPriceByVariantId(request: GetMarketPriceByVariantIdRequest): Observable<GetMarketPriceByVariantIdResponse>;

  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse>;

  getProductStatuses(request: GetProductStatusesRequest): Observable<GetProductStatusesResponse>;

  updateLogisticService(request: UpdateLogisticServiceRequest): Observable<UpdateLogisticServiceResponse>;

  getBidSummary(request: GetBidSummaryRequest): Observable<GetBidSummaryResponse>;

  getViewedProducts(request: GetViewedProductsRequest): Observable<GetViewedProductsResponse>;

  getLegacyUserViaLocalPhone(
    request: GetLegacyUserViaLocalPhoneRequest,
  ): Observable<GetLegacyUserViaLocalPhoneResponse>;

  createNewUser(request: CreateNewUserRequest): Observable<CreateNewUserResponse>;

  updateInactiveUser(request: UpdateInactiveUserRequest): Observable<UpdateInactiveUserResponse>;

  cancelOrder(request: CancelOrderRequest): Observable<CancelOrderResponse>;

  getBanners(request: GetBannersRequest): Observable<GetBannersResponse>;

  getFeeds(request: GetFeedRequest): Observable<GetFeedsResponse>;

  updatePenaltyFlag(request: UpdatePenaltyFlagRequest): Observable<UpdatePenaltyFlagResponse>;

  getInvoiceGenerationFlag(request: GetInvoiceGenerationFlagRequest): Observable<GetInvoiceGenerationFlagResponse>;

  getVariants(request: GetVariantsRequest): Observable<GetVariantsResponse>;

  getCountdownValInHours(request: GetCountdownValInHoursRequest): Observable<GetCountdownValInHoursResponse>;

  validateSellerDetectionNudge(
    request: ValidateSellerDetectionNudgeRequest,
  ): Observable<ValidateSellerDetectionNudgeResponse>;

  getProductsForProductService(request: GetProductsRequest): Observable<GetProductsForProductServiceResponse>;

  updatePaymentStatusOfOrder(
    request: UpdatePaymentStatusOfOrderRequest,
  ): Observable<UpdatePaymentStatusOfOrderResponse>;

  getRecentlySoldProducts(request: GetRecentlySoldProductsRequest): Observable<GetViewedProductsResponse>;

  getSellerBadge(request: GetSellerBadgeRequest): Observable<GetSellerBadgeResponse>;

  getPromoCode(request: GetPromoCodeRequest): Observable<GetPromoCodeResponse>;

  getOrderSaleAnalytics(request: GetOrderSaleAnalyticsRequest): Observable<GetOrderSaleAnalyticsResponse>;

  getPendingPayoutAnalytics(request: GetPendingPayoutAnalyticsRequest): Observable<GetPendingPayoutAnalyticsResponse>;

  getPendingPayoutPagination(
    request: GetPendingPayoutPaginationRequest,
  ): Observable<GetPendingPayoutPaginationResponse>;

  getPenalizedOrders(request: GetPenalizedOrdersRequest): Observable<GetPenalizedOrdersResponse>;

  getCompletionRateUser(request: GetCompletionRateUserRequest): Observable<GetCompletionRateUserResponse>;

  getTopSellingProductModels(
    request: GetTopSellingProductModelsRequest,
  ): Observable<GetTopSellingProductModelsResponse>;

  setUserOtp(request: SetUserOTPRequest): Observable<SetUserOTPResponse>;

  checkUserOtp(request: CheckUserOTPRequest): Observable<CheckUserOTPResponse>;

  createSmsaTracking(request: CreateSMSATracking): Observable<CreateSMSATracking>;
}

export interface V2ServiceController {
  getUser(request: GetUserRequest): Promise<GetUserResponse> | Observable<GetUserResponse> | GetUserResponse;

  getUsers(request: GetUsersRequest): Promise<GetUsersResponse> | Observable<GetUsersResponse> | GetUsersResponse;

  getPermissions(
    request: GetPermissionsRequest,
  ): Promise<GetPermissionsResponse> | Observable<GetPermissionsResponse> | GetPermissionsResponse;

  getOrderDetail(
    request: GetOrderDetailRequest,
  ): Promise<GetOrderDetailResponse> | Observable<GetOrderDetailResponse> | GetOrderDetailResponse;

  getDmUser(request: GetDmUserRequest): Promise<GetDmUserResponse> | Observable<GetDmUserResponse> | GetDmUserResponse;

  getDmUsers(
    request: GetDmUsersRequest,
  ): Promise<GetDmUsersResponse> | Observable<GetDmUsersResponse> | GetDmUsersResponse;

  getUsersByPhone(
    request: GetUsersByPhoneRequest,
  ): Promise<GetUsersByPhoneResponse> | Observable<GetUsersByPhoneResponse> | GetUsersByPhoneResponse;

  updateHighestBid(
    request: UpdateHighestBidRequest,
  ): Promise<UpdateHighestBidResponse> | Observable<UpdateHighestBidResponse> | UpdateHighestBidResponse;

  getProducts(
    request: GetProductsRequest,
  ): Promise<GetProductsResponse> | Observable<GetProductsResponse> | GetProductsResponse;

  getProductForCommission(
    request: GetProductForCommissionRequest,
  ):
    | Promise<GetProductForCommissionResponse>
    | Observable<GetProductForCommissionResponse>
    | GetProductForCommissionResponse;

  getMarketPriceByVariantId(
    request: GetMarketPriceByVariantIdRequest,
  ):
    | Promise<GetMarketPriceByVariantIdResponse>
    | Observable<GetMarketPriceByVariantIdResponse>
    | GetMarketPriceByVariantIdResponse;

  createOrder(
    request: CreateOrderRequest,
  ): Promise<CreateOrderResponse> | Observable<CreateOrderResponse> | CreateOrderResponse;

  getProductStatuses(
    request: GetProductStatusesRequest,
  ): Promise<GetProductStatusesResponse> | Observable<GetProductStatusesResponse> | GetProductStatusesResponse;

  updateLogisticService(
    request: UpdateLogisticServiceRequest,
  ): Promise<UpdateLogisticServiceResponse> | Observable<UpdateLogisticServiceResponse> | UpdateLogisticServiceResponse;

  getBidSummary(
    request: GetBidSummaryRequest,
  ): Promise<GetBidSummaryResponse> | Observable<GetBidSummaryResponse> | GetBidSummaryResponse;

  getViewedProducts(
    request: GetViewedProductsRequest,
  ): Promise<GetViewedProductsResponse> | Observable<GetViewedProductsResponse> | GetViewedProductsResponse;

  getLegacyUserViaLocalPhone(
    request: GetLegacyUserViaLocalPhoneRequest,
  ):
    | Promise<GetLegacyUserViaLocalPhoneResponse>
    | Observable<GetLegacyUserViaLocalPhoneResponse>
    | GetLegacyUserViaLocalPhoneResponse;

  createNewUser(
    request: CreateNewUserRequest,
  ): Promise<CreateNewUserResponse> | Observable<CreateNewUserResponse> | CreateNewUserResponse;

  updateInactiveUser(
    request: UpdateInactiveUserRequest,
  ): Promise<UpdateInactiveUserResponse> | Observable<UpdateInactiveUserResponse> | UpdateInactiveUserResponse;

  cancelOrder(
    request: CancelOrderRequest,
  ): Promise<CancelOrderResponse> | Observable<CancelOrderResponse> | CancelOrderResponse;

  getBanners(
    request: GetBannersRequest,
  ): Promise<GetBannersResponse> | Observable<GetBannersResponse> | GetBannersResponse;

  getFeeds(request: GetFeedRequest): Promise<GetFeedsResponse> | Observable<GetFeedsResponse> | GetFeedsResponse;

  updatePenaltyFlag(
    request: UpdatePenaltyFlagRequest,
  ): Promise<UpdatePenaltyFlagResponse> | Observable<UpdatePenaltyFlagResponse> | UpdatePenaltyFlagResponse;

  getInvoiceGenerationFlag(
    request: GetInvoiceGenerationFlagRequest,
  ):
    | Promise<GetInvoiceGenerationFlagResponse>
    | Observable<GetInvoiceGenerationFlagResponse>
    | GetInvoiceGenerationFlagResponse;

  getVariants(
    request: GetVariantsRequest,
  ): Promise<GetVariantsResponse> | Observable<GetVariantsResponse> | GetVariantsResponse;

  getCountdownValInHours(
    request: GetCountdownValInHoursRequest,
  ):
    | Promise<GetCountdownValInHoursResponse>
    | Observable<GetCountdownValInHoursResponse>
    | GetCountdownValInHoursResponse;

  validateSellerDetectionNudge(
    request: ValidateSellerDetectionNudgeRequest,
  ):
    | Promise<ValidateSellerDetectionNudgeResponse>
    | Observable<ValidateSellerDetectionNudgeResponse>
    | ValidateSellerDetectionNudgeResponse;

  getProductsForProductService(
    request: GetProductsRequest,
  ):
    | Promise<GetProductsForProductServiceResponse>
    | Observable<GetProductsForProductServiceResponse>
    | GetProductsForProductServiceResponse;

  updatePaymentStatusOfOrder(
    request: UpdatePaymentStatusOfOrderRequest,
  ):
    | Promise<UpdatePaymentStatusOfOrderResponse>
    | Observable<UpdatePaymentStatusOfOrderResponse>
    | UpdatePaymentStatusOfOrderResponse;

  getRecentlySoldProducts(
    request: GetRecentlySoldProductsRequest,
  ): Promise<GetViewedProductsResponse> | Observable<GetViewedProductsResponse> | GetViewedProductsResponse;

  getSellerBadge(
    request: GetSellerBadgeRequest,
  ): Promise<GetSellerBadgeResponse> | Observable<GetSellerBadgeResponse> | GetSellerBadgeResponse;

  getPromoCode(
    request: GetPromoCodeRequest,
  ): Promise<GetPromoCodeResponse> | Observable<GetPromoCodeResponse> | GetPromoCodeResponse;

  getOrderSaleAnalytics(
    request: GetOrderSaleAnalyticsRequest,
  ): Promise<GetOrderSaleAnalyticsResponse> | Observable<GetOrderSaleAnalyticsResponse> | GetOrderSaleAnalyticsResponse;

  getPendingPayoutAnalytics(
    request: GetPendingPayoutAnalyticsRequest,
  ):
    | Promise<GetPendingPayoutAnalyticsResponse>
    | Observable<GetPendingPayoutAnalyticsResponse>
    | GetPendingPayoutAnalyticsResponse;

  getPendingPayoutPagination(
    request: GetPendingPayoutPaginationRequest,
  ):
    | Promise<GetPendingPayoutPaginationResponse>
    | Observable<GetPendingPayoutPaginationResponse>
    | GetPendingPayoutPaginationResponse;

  getPenalizedOrders(
    request: GetPenalizedOrdersRequest,
  ): Promise<GetPenalizedOrdersResponse> | Observable<GetPenalizedOrdersResponse> | GetPenalizedOrdersResponse;

  getCompletionRateUser(
    request: GetCompletionRateUserRequest,
  ): Promise<GetCompletionRateUserResponse> | Observable<GetCompletionRateUserResponse> | GetCompletionRateUserResponse;

  getTopSellingProductModels(
    request: GetTopSellingProductModelsRequest,
  ):
    | Promise<GetTopSellingProductModelsResponse>
    | Observable<GetTopSellingProductModelsResponse>
    | GetTopSellingProductModelsResponse;

  setUserOtp(
    request: SetUserOTPRequest,
  ): Promise<SetUserOTPResponse> | Observable<SetUserOTPResponse> | SetUserOTPResponse;

  checkUserOtp(
    request: CheckUserOTPRequest,
  ): Promise<CheckUserOTPResponse> | Observable<CheckUserOTPResponse> | CheckUserOTPResponse;

  createSmsaTracking(
    request: CreateSMSATracking,
  ): Promise<CreateSMSATracking> | Observable<CreateSMSATracking> | CreateSMSATracking;
}

export function V2ServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getUser",
      "getUsers",
      "getPermissions",
      "getOrderDetail",
      "getDmUser",
      "getDmUsers",
      "getUsersByPhone",
      "updateHighestBid",
      "getProducts",
      "getProductForCommission",
      "getMarketPriceByVariantId",
      "createOrder",
      "getProductStatuses",
      "updateLogisticService",
      "getBidSummary",
      "getViewedProducts",
      "getLegacyUserViaLocalPhone",
      "createNewUser",
      "updateInactiveUser",
      "cancelOrder",
      "getBanners",
      "getFeeds",
      "updatePenaltyFlag",
      "getInvoiceGenerationFlag",
      "getVariants",
      "getCountdownValInHours",
      "validateSellerDetectionNudge",
      "getProductsForProductService",
      "updatePaymentStatusOfOrder",
      "getRecentlySoldProducts",
      "getSellerBadge",
      "getPromoCode",
      "getOrderSaleAnalytics",
      "getPendingPayoutAnalytics",
      "getPendingPayoutPagination",
      "getPenalizedOrders",
      "getCompletionRateUser",
      "getTopSellingProductModels",
      "setUserOtp",
      "checkUserOtp",
      "createSmsaTracking",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("V2Service", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("V2Service", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const V2_SERVICE_NAME = "V2Service";
