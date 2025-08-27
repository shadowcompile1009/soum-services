/* eslint-disable */
import _m0 from "protobufjs/minimal";

export const protobufPackage = "v2";

export interface UpdateProductRequest {
  productId: string;
  updateProduct: UpdateProduct | undefined;
}

export interface UpdateProduct {
  status: string;
  sellStatus: string;
  isApproved: boolean;
  consignment: Consignment | undefined;
  conditionId: string;
  sellPrice: number;
}

export interface Consignment {
  orderNumber: string;
  payoutAmount: number;
  payoutStatus: string;
}

export interface UpdateProductResponse {
  status: boolean;
}

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
  isFinancingEmailSent: boolean;
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
  isCompliant: boolean;
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
  shouldSkipExpire?: boolean | undefined;
  categoryId?: string | undefined;
  getSpecificCategory?: boolean | undefined;
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
  isKeySeller?: boolean | undefined;
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
  type?: string | undefined;
}

export interface GetFeedRequest {
  size: number;
  feedTypes: string[];
  brands: string[];
  models: string[];
  categories: string[];
  category?: string | undefined;
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
  iconURL?: string | undefined;
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
  grandTotal: number;
  vat: number;
  shippingCharge: number;
  buyAmount: number;
  expressDeliveryBadge?: boolean | undefined;
  year?: string | undefined;
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
  maxBudget: number;
  imgURL: string;
  position: number;
  totalActiveProducts: number;
  totalProducts: number;
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

export interface PaymentOption {
  id: string;
  paymentProvider: string;
  paymentCardType: string;
  displayName: string;
}

export interface TransactionResponse {
  transactionId: string;
  checkoutId: string;
  checkoutURL: string;
  soumTransactionNumber: string;
  transactionStatusId: string;
  transactionType: string;
  paymentOptionId: string;
  operationId?: string | undefined;
  totalAmount: number;
  paymentOption:
    | PaymentOption
    | undefined;
  /** big number, will delete it soon */
  providerResponse?: string | undefined;
}

export interface UpdatePaymentStatusOfOrderRequest {
  paymentId: string;
  paymentNumber: string;
  paymentProvider: string;
  transaction: TransactionResponse | undefined;
}

export interface UpdatePaymentStatusOfOrderResponse {
  orderTransactionStatus: string;
}

export interface GetRecentlySoldProductsRequest {
  hours: number;
  limit: number;
  offset: number;
  categoryId?: string | undefined;
  getSpecificCategory?: boolean | undefined;
}

export interface GetSellerBadgeRequest {
  userId: string;
}

export interface GetSellerBadgeResponse {
  activateTenDaysGuarantee: boolean;
  isSFPaid: boolean;
  hasHighFRate: boolean;
}

export interface FetchInvoiceGenerationDataRequest {
  orderId: string;
  type: string;
}

export interface FetchInvoiceGenerationDataResponse {
  billType: string;
  issueDate: string;
  billTo: string;
  billedByCOR: string;
  billedBySeller: string;
  ZATCAInvoiceNo: string;
  dateOfSupply: string;
  seller: FetchInvoiceGenerationDataResponse_User | undefined;
  buyer: FetchInvoiceGenerationDataResponse_User | undefined;
  order: FetchInvoiceGenerationDataResponse_OrderCalculationSumamry | undefined;
  product: FetchInvoiceGenerationDataResponse_Product | undefined;
}

export interface FetchInvoiceGenerationDataResponse_User {
  id: string;
  name: string;
  address: Address | undefined;
}

export interface FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
  commission: number;
  vat: number;
  deliveryFee: number;
  deliveryFeeVAT: number;
  penaltyFee: number;
  discount: number;
  grandTotal: number;
  orderId: string;
  orderNumber: string;
  totalVAT: number;
  totalTaxableAmount: number;
}

export interface FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
  unitPrice: number;
  commission: number;
  vat: number;
  discount: number;
  grandTotal: number;
  quantity: number;
}

export interface FetchInvoiceGenerationDataResponse_Product {
  productId: string;
  nameAR: string;
  nameEN: string;
  item: FetchInvoiceGenerationDataResponse_ItemCalculationSumamry | undefined;
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

export interface UpdateOrderAttributeRequest {
  orderId: string;
}

export interface UpdateOrderAttributeResponse {
  message: string;
}

export interface GetOrderDetailByUserTypeRequest {
  orderId: string;
  userType: string;
}

export interface GetListingFeesRequest {
}

export interface GetListingFeesResponse {
  amount: number;
  isActive: boolean;
}

export interface UpdateSecurityFeeRequest {
  userId: string;
  amount: number;
  isOptIn: boolean;
}

export interface UpdateSecurityFeeResponse {
}

export interface ValidIDsForPromoCodeRequest {
  feeds: string[];
  models: string[];
  brands: string[];
  categories: string[];
  sellers: string[];
}

export interface ValidIDsForPromoCodeResponse {
  feeds: string[];
  models: string[];
  brands: string[];
  categories: string[];
  sellers: string[];
}

export interface GetProductDetailsForPromoCodeValidationRequest {
  productId: string;
}

export interface GetProductDetailsForPromoCodeValidationResponse {
  sellPrice: number;
  detailsForScopeValidation: ValidIDsForPromoCodeResponse | undefined;
}

export interface ValidateUserUsageOfPromoCodeRequest {
  userId: string;
  promoCodeId: string;
}

export interface ValidateUserUsageOfPromoCodeResponse {
  isUsed: boolean;
}

export interface ProcessReserveFinancingPaymentRequest {
  orderNumber: string;
  status: string;
}

export interface ProcessReserveFinancingPaymentResponse {
}

export interface GenerateSmsaTrackingResponse {
  trackingNumber: string;
}

export interface Request {
  request: string;
}

export interface GetOrderDetailByIdResponse {
  response: string;
}

export interface GetUserDataRequest {
  userId: string;
}

export interface GetUserLastOrderDataResponse {
  buyerName?: string | undefined;
  productName?: string | undefined;
  orderId?: string | undefined;
  productId?: string | undefined;
  statusId?: string | undefined;
  sellPrice?: number | undefined;
  createdAt?: string | undefined;
  modelName?: string | undefined;
  arModelName?: string | undefined;
  variantName?: string | undefined;
  arVariantName?: string | undefined;
  isDelivered: boolean;
  isRated: boolean;
  attributes: Attribute[];
}

export interface SubmitRatingRequest {
  userId: string;
  notes: string;
  rating: string;
}

export interface SubmitRatingResponse {
  isRated: boolean;
}

export interface GetCategoryModelsCountResponse {
  brands: Brand[];
  showMileageFilter: boolean;
  showFinancingFilter: boolean;
  shopGreatDeals: boolean;
  carsPrice: boolean;
  showLT31: boolean;
  showGT80: boolean;
  showGT30AndLT60: boolean;
  showGT60AndLT80: boolean;
}

export interface Brand {
  id: string;
  categoryId: string;
  brandNameAr: string;
  brandName: string;
  brandIcon: string;
  status: string;
  totalAvailableProducts: number;
  models: Models[];
}

export interface Models {
  totalAvailableProducts: number;
  modelId: string;
  modelName: string;
  modelNameAr: string;
  modelIcon: string;
}

function createBaseUpdateProductRequest(): UpdateProductRequest {
  return { productId: "", updateProduct: undefined };
}

export const UpdateProductRequest = {
  encode(message: UpdateProductRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.updateProduct !== undefined) {
      UpdateProduct.encode(message.updateProduct, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateProductRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateProductRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.updateProduct = UpdateProduct.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateProductRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      updateProduct: isSet(object.updateProduct) ? UpdateProduct.fromJSON(object.updateProduct) : undefined,
    };
  },

  toJSON(message: UpdateProductRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.updateProduct !== undefined &&
      (obj.updateProduct = message.updateProduct ? UpdateProduct.toJSON(message.updateProduct) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateProductRequest>, I>>(base?: I): UpdateProductRequest {
    return UpdateProductRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateProductRequest>, I>>(object: I): UpdateProductRequest {
    const message = createBaseUpdateProductRequest();
    message.productId = object.productId ?? "";
    message.updateProduct = (object.updateProduct !== undefined && object.updateProduct !== null)
      ? UpdateProduct.fromPartial(object.updateProduct)
      : undefined;
    return message;
  },
};

function createBaseUpdateProduct(): UpdateProduct {
  return { status: "", sellStatus: "", isApproved: false, consignment: undefined, conditionId: "", sellPrice: 0 };
}

export const UpdateProduct = {
  encode(message: UpdateProduct, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status !== "") {
      writer.uint32(10).string(message.status);
    }
    if (message.sellStatus !== "") {
      writer.uint32(18).string(message.sellStatus);
    }
    if (message.isApproved === true) {
      writer.uint32(24).bool(message.isApproved);
    }
    if (message.consignment !== undefined) {
      Consignment.encode(message.consignment, writer.uint32(34).fork()).ldelim();
    }
    if (message.conditionId !== "") {
      writer.uint32(42).string(message.conditionId);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(49).double(message.sellPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateProduct {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.string();
          break;
        case 2:
          message.sellStatus = reader.string();
          break;
        case 3:
          message.isApproved = reader.bool();
          break;
        case 4:
          message.consignment = Consignment.decode(reader, reader.uint32());
          break;
        case 5:
          message.conditionId = reader.string();
          break;
        case 6:
          message.sellPrice = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateProduct {
    return {
      status: isSet(object.status) ? String(object.status) : "",
      sellStatus: isSet(object.sellStatus) ? String(object.sellStatus) : "",
      isApproved: isSet(object.isApproved) ? Boolean(object.isApproved) : false,
      consignment: isSet(object.consignment) ? Consignment.fromJSON(object.consignment) : undefined,
      conditionId: isSet(object.conditionId) ? String(object.conditionId) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
    };
  },

  toJSON(message: UpdateProduct): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    message.sellStatus !== undefined && (obj.sellStatus = message.sellStatus);
    message.isApproved !== undefined && (obj.isApproved = message.isApproved);
    message.consignment !== undefined &&
      (obj.consignment = message.consignment ? Consignment.toJSON(message.consignment) : undefined);
    message.conditionId !== undefined && (obj.conditionId = message.conditionId);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateProduct>, I>>(base?: I): UpdateProduct {
    return UpdateProduct.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateProduct>, I>>(object: I): UpdateProduct {
    const message = createBaseUpdateProduct();
    message.status = object.status ?? "";
    message.sellStatus = object.sellStatus ?? "";
    message.isApproved = object.isApproved ?? false;
    message.consignment = (object.consignment !== undefined && object.consignment !== null)
      ? Consignment.fromPartial(object.consignment)
      : undefined;
    message.conditionId = object.conditionId ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    return message;
  },
};

function createBaseConsignment(): Consignment {
  return { orderNumber: "", payoutAmount: 0, payoutStatus: "" };
}

export const Consignment = {
  encode(message: Consignment, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderNumber !== "") {
      writer.uint32(10).string(message.orderNumber);
    }
    if (message.payoutAmount !== 0) {
      writer.uint32(17).double(message.payoutAmount);
    }
    if (message.payoutStatus !== "") {
      writer.uint32(26).string(message.payoutStatus);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Consignment {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseConsignment();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderNumber = reader.string();
          break;
        case 2:
          message.payoutAmount = reader.double();
          break;
        case 3:
          message.payoutStatus = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Consignment {
    return {
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
      payoutAmount: isSet(object.payoutAmount) ? Number(object.payoutAmount) : 0,
      payoutStatus: isSet(object.payoutStatus) ? String(object.payoutStatus) : "",
    };
  },

  toJSON(message: Consignment): unknown {
    const obj: any = {};
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    message.payoutAmount !== undefined && (obj.payoutAmount = message.payoutAmount);
    message.payoutStatus !== undefined && (obj.payoutStatus = message.payoutStatus);
    return obj;
  },

  create<I extends Exact<DeepPartial<Consignment>, I>>(base?: I): Consignment {
    return Consignment.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Consignment>, I>>(object: I): Consignment {
    const message = createBaseConsignment();
    message.orderNumber = object.orderNumber ?? "";
    message.payoutAmount = object.payoutAmount ?? 0;
    message.payoutStatus = object.payoutStatus ?? "";
    return message;
  },
};

function createBaseUpdateProductResponse(): UpdateProductResponse {
  return { status: false };
}

export const UpdateProductResponse = {
  encode(message: UpdateProductResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateProductResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateProductResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateProductResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: UpdateProductResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateProductResponse>, I>>(base?: I): UpdateProductResponse {
    return UpdateProductResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateProductResponse>, I>>(object: I): UpdateProductResponse {
    const message = createBaseUpdateProductResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseGetPromoCodeRequest(): GetPromoCodeRequest {
  return { id: "" };
}

export const GetPromoCodeRequest = {
  encode(message: GetPromoCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPromoCodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPromoCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPromoCodeRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetPromoCodeRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPromoCodeRequest>, I>>(base?: I): GetPromoCodeRequest {
    return GetPromoCodeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPromoCodeRequest>, I>>(object: I): GetPromoCodeRequest {
    const message = createBaseGetPromoCodeRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetPromoCodeResponse(): GetPromoCodeResponse {
  return { promoLimit: 0, type: "", generator: "", discount: 0, percentage: 0 };
}

export const GetPromoCodeResponse = {
  encode(message: GetPromoCodeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoLimit !== 0) {
      writer.uint32(8).int32(message.promoLimit);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.generator !== "") {
      writer.uint32(26).string(message.generator);
    }
    if (message.discount !== 0) {
      writer.uint32(32).int32(message.discount);
    }
    if (message.percentage !== 0) {
      writer.uint32(40).int32(message.percentage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPromoCodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPromoCodeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoLimit = reader.int32();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.generator = reader.string();
          break;
        case 4:
          message.discount = reader.int32();
          break;
        case 5:
          message.percentage = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPromoCodeResponse {
    return {
      promoLimit: isSet(object.promoLimit) ? Number(object.promoLimit) : 0,
      type: isSet(object.type) ? String(object.type) : "",
      generator: isSet(object.generator) ? String(object.generator) : "",
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      percentage: isSet(object.percentage) ? Number(object.percentage) : 0,
    };
  },

  toJSON(message: GetPromoCodeResponse): unknown {
    const obj: any = {};
    message.promoLimit !== undefined && (obj.promoLimit = Math.round(message.promoLimit));
    message.type !== undefined && (obj.type = message.type);
    message.generator !== undefined && (obj.generator = message.generator);
    message.discount !== undefined && (obj.discount = Math.round(message.discount));
    message.percentage !== undefined && (obj.percentage = Math.round(message.percentage));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPromoCodeResponse>, I>>(base?: I): GetPromoCodeResponse {
    return GetPromoCodeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPromoCodeResponse>, I>>(object: I): GetPromoCodeResponse {
    const message = createBaseGetPromoCodeResponse();
    message.promoLimit = object.promoLimit ?? 0;
    message.type = object.type ?? "";
    message.generator = object.generator ?? "";
    message.discount = object.discount ?? 0;
    message.percentage = object.percentage ?? 0;
    return message;
  },
};

function createBaseGetProductsForProductServiceResponse(): GetProductsForProductServiceResponse {
  return { products: [] };
}

export const GetProductsForProductServiceResponse = {
  encode(message: GetProductsForProductServiceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.products) {
      ProductForProductService.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductsForProductServiceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductsForProductServiceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.products.push(ProductForProductService.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductsForProductServiceResponse {
    return {
      products: Array.isArray(object?.products)
        ? object.products.map((e: any) => ProductForProductService.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetProductsForProductServiceResponse): unknown {
    const obj: any = {};
    if (message.products) {
      obj.products = message.products.map((e) => e ? ProductForProductService.toJSON(e) : undefined);
    } else {
      obj.products = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductsForProductServiceResponse>, I>>(
    base?: I,
  ): GetProductsForProductServiceResponse {
    return GetProductsForProductServiceResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductsForProductServiceResponse>, I>>(
    object: I,
  ): GetProductsForProductServiceResponse {
    const message = createBaseGetProductsForProductServiceResponse();
    message.products = object.products?.map((e) => ProductForProductService.fromPartial(e)) || [];
    return message;
  },
};

function createBaseProductForProductService(): ProductForProductService {
  return {
    id: "",
    description: "",
    categories: [],
    imagesUrl: [],
    score: 0,
    sellPrice: 0,
    status: "",
    sellType: "",
    userId: "",
    groupListingId: "",
    statusSummary: undefined,
  };
}

export const ProductForProductService = {
  encode(message: ProductForProductService, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.categories) {
      Category.encode(v!, writer.uint32(26).fork()).ldelim();
    }
    for (const v of message.imagesUrl) {
      writer.uint32(34).string(v!);
    }
    if (message.score !== 0) {
      writer.uint32(41).double(message.score);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(49).double(message.sellPrice);
    }
    if (message.status !== "") {
      writer.uint32(58).string(message.status);
    }
    if (message.sellType !== "") {
      writer.uint32(66).string(message.sellType);
    }
    if (message.userId !== "") {
      writer.uint32(74).string(message.userId);
    }
    if (message.groupListingId !== "") {
      writer.uint32(82).string(message.groupListingId);
    }
    if (message.statusSummary !== undefined) {
      StatusSummary.encode(message.statusSummary, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProductForProductService {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProductForProductService();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        case 3:
          message.categories.push(Category.decode(reader, reader.uint32()));
          break;
        case 4:
          message.imagesUrl.push(reader.string());
          break;
        case 5:
          message.score = reader.double();
          break;
        case 6:
          message.sellPrice = reader.double();
          break;
        case 7:
          message.status = reader.string();
          break;
        case 8:
          message.sellType = reader.string();
          break;
        case 9:
          message.userId = reader.string();
          break;
        case 10:
          message.groupListingId = reader.string();
          break;
        case 11:
          message.statusSummary = StatusSummary.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProductForProductService {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      description: isSet(object.description) ? String(object.description) : "",
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => Category.fromJSON(e)) : [],
      imagesUrl: Array.isArray(object?.imagesUrl) ? object.imagesUrl.map((e: any) => String(e)) : [],
      score: isSet(object.score) ? Number(object.score) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      status: isSet(object.status) ? String(object.status) : "",
      sellType: isSet(object.sellType) ? String(object.sellType) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      groupListingId: isSet(object.groupListingId) ? String(object.groupListingId) : "",
      statusSummary: isSet(object.statusSummary) ? StatusSummary.fromJSON(object.statusSummary) : undefined,
    };
  },

  toJSON(message: ProductForProductService): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.description !== undefined && (obj.description = message.description);
    if (message.categories) {
      obj.categories = message.categories.map((e) => e ? Category.toJSON(e) : undefined);
    } else {
      obj.categories = [];
    }
    if (message.imagesUrl) {
      obj.imagesUrl = message.imagesUrl.map((e) => e);
    } else {
      obj.imagesUrl = [];
    }
    message.score !== undefined && (obj.score = message.score);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.status !== undefined && (obj.status = message.status);
    message.sellType !== undefined && (obj.sellType = message.sellType);
    message.userId !== undefined && (obj.userId = message.userId);
    message.groupListingId !== undefined && (obj.groupListingId = message.groupListingId);
    message.statusSummary !== undefined &&
      (obj.statusSummary = message.statusSummary ? StatusSummary.toJSON(message.statusSummary) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<ProductForProductService>, I>>(base?: I): ProductForProductService {
    return ProductForProductService.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProductForProductService>, I>>(object: I): ProductForProductService {
    const message = createBaseProductForProductService();
    message.id = object.id ?? "";
    message.description = object.description ?? "";
    message.categories = object.categories?.map((e) => Category.fromPartial(e)) || [];
    message.imagesUrl = object.imagesUrl?.map((e) => e) || [];
    message.score = object.score ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    message.status = object.status ?? "";
    message.sellType = object.sellType ?? "";
    message.userId = object.userId ?? "";
    message.groupListingId = object.groupListingId ?? "";
    message.statusSummary = (object.statusSummary !== undefined && object.statusSummary !== null)
      ? StatusSummary.fromPartial(object.statusSummary)
      : undefined;
    return message;
  },
};

function createBaseCategory(): Category {
  return { id: "", type: "", name: undefined, nameAr: undefined };
}

export const Category = {
  encode(message: Category, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.name !== undefined) {
      writer.uint32(26).string(message.name);
    }
    if (message.nameAr !== undefined) {
      writer.uint32(34).string(message.nameAr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Category {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCategory();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.name = reader.string();
          break;
        case 4:
          message.nameAr = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Category {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      type: isSet(object.type) ? String(object.type) : "",
      name: isSet(object.name) ? String(object.name) : undefined,
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : undefined,
    };
  },

  toJSON(message: Category): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.type !== undefined && (obj.type = message.type);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    return obj;
  },

  create<I extends Exact<DeepPartial<Category>, I>>(base?: I): Category {
    return Category.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Category>, I>>(object: I): Category {
    const message = createBaseCategory();
    message.id = object.id ?? "";
    message.type = object.type ?? "";
    message.name = object.name ?? undefined;
    message.nameAr = object.nameAr ?? undefined;
    return message;
  },
};

function createBaseStatusSummary(): StatusSummary {
  return {
    isApproved: false,
    isExpired: false,
    isDeleted: false,
    isReported: false,
    isVerifiedByAdmin: false,
    isFraudDetected: false,
    isSearchSync: false,
  };
}

export const StatusSummary = {
  encode(message: StatusSummary, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isApproved === true) {
      writer.uint32(8).bool(message.isApproved);
    }
    if (message.isExpired === true) {
      writer.uint32(16).bool(message.isExpired);
    }
    if (message.isDeleted === true) {
      writer.uint32(24).bool(message.isDeleted);
    }
    if (message.isReported === true) {
      writer.uint32(32).bool(message.isReported);
    }
    if (message.isVerifiedByAdmin === true) {
      writer.uint32(40).bool(message.isVerifiedByAdmin);
    }
    if (message.isFraudDetected === true) {
      writer.uint32(48).bool(message.isFraudDetected);
    }
    if (message.isSearchSync === true) {
      writer.uint32(56).bool(message.isSearchSync);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): StatusSummary {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseStatusSummary();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isApproved = reader.bool();
          break;
        case 2:
          message.isExpired = reader.bool();
          break;
        case 3:
          message.isDeleted = reader.bool();
          break;
        case 4:
          message.isReported = reader.bool();
          break;
        case 5:
          message.isVerifiedByAdmin = reader.bool();
          break;
        case 6:
          message.isFraudDetected = reader.bool();
          break;
        case 7:
          message.isSearchSync = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): StatusSummary {
    return {
      isApproved: isSet(object.isApproved) ? Boolean(object.isApproved) : false,
      isExpired: isSet(object.isExpired) ? Boolean(object.isExpired) : false,
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
      isReported: isSet(object.isReported) ? Boolean(object.isReported) : false,
      isVerifiedByAdmin: isSet(object.isVerifiedByAdmin) ? Boolean(object.isVerifiedByAdmin) : false,
      isFraudDetected: isSet(object.isFraudDetected) ? Boolean(object.isFraudDetected) : false,
      isSearchSync: isSet(object.isSearchSync) ? Boolean(object.isSearchSync) : false,
    };
  },

  toJSON(message: StatusSummary): unknown {
    const obj: any = {};
    message.isApproved !== undefined && (obj.isApproved = message.isApproved);
    message.isExpired !== undefined && (obj.isExpired = message.isExpired);
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    message.isReported !== undefined && (obj.isReported = message.isReported);
    message.isVerifiedByAdmin !== undefined && (obj.isVerifiedByAdmin = message.isVerifiedByAdmin);
    message.isFraudDetected !== undefined && (obj.isFraudDetected = message.isFraudDetected);
    message.isSearchSync !== undefined && (obj.isSearchSync = message.isSearchSync);
    return obj;
  },

  create<I extends Exact<DeepPartial<StatusSummary>, I>>(base?: I): StatusSummary {
    return StatusSummary.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<StatusSummary>, I>>(object: I): StatusSummary {
    const message = createBaseStatusSummary();
    message.isApproved = object.isApproved ?? false;
    message.isExpired = object.isExpired ?? false;
    message.isDeleted = object.isDeleted ?? false;
    message.isReported = object.isReported ?? false;
    message.isVerifiedByAdmin = object.isVerifiedByAdmin ?? false;
    message.isFraudDetected = object.isFraudDetected ?? false;
    message.isSearchSync = object.isSearchSync ?? false;
    return message;
  },
};

function createBaseGetCountdownValInHoursRequest(): GetCountdownValInHoursRequest {
  return { modelId: "" };
}

export const GetCountdownValInHoursRequest = {
  encode(message: GetCountdownValInHoursRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.modelId !== "") {
      writer.uint32(10).string(message.modelId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCountdownValInHoursRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCountdownValInHoursRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modelId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCountdownValInHoursRequest {
    return { modelId: isSet(object.modelId) ? String(object.modelId) : "" };
  },

  toJSON(message: GetCountdownValInHoursRequest): unknown {
    const obj: any = {};
    message.modelId !== undefined && (obj.modelId = message.modelId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCountdownValInHoursRequest>, I>>(base?: I): GetCountdownValInHoursRequest {
    return GetCountdownValInHoursRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCountdownValInHoursRequest>, I>>(
    object: I,
  ): GetCountdownValInHoursRequest {
    const message = createBaseGetCountdownValInHoursRequest();
    message.modelId = object.modelId ?? "";
    return message;
  },
};

function createBaseGetCountdownValInHoursResponse(): GetCountdownValInHoursResponse {
  return { countdownValInHours: 0 };
}

export const GetCountdownValInHoursResponse = {
  encode(message: GetCountdownValInHoursResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.countdownValInHours !== 0) {
      writer.uint32(8).int32(message.countdownValInHours);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCountdownValInHoursResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCountdownValInHoursResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.countdownValInHours = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCountdownValInHoursResponse {
    return { countdownValInHours: isSet(object.countdownValInHours) ? Number(object.countdownValInHours) : 0 };
  },

  toJSON(message: GetCountdownValInHoursResponse): unknown {
    const obj: any = {};
    message.countdownValInHours !== undefined && (obj.countdownValInHours = Math.round(message.countdownValInHours));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCountdownValInHoursResponse>, I>>(base?: I): GetCountdownValInHoursResponse {
    return GetCountdownValInHoursResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCountdownValInHoursResponse>, I>>(
    object: I,
  ): GetCountdownValInHoursResponse {
    const message = createBaseGetCountdownValInHoursResponse();
    message.countdownValInHours = object.countdownValInHours ?? 0;
    return message;
  },
};

function createBaseValidateSellerDetectionNudgeRequest(): ValidateSellerDetectionNudgeRequest {
  return {};
}

export const ValidateSellerDetectionNudgeRequest = {
  encode(_: ValidateSellerDetectionNudgeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateSellerDetectionNudgeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateSellerDetectionNudgeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ValidateSellerDetectionNudgeRequest {
    return {};
  },

  toJSON(_: ValidateSellerDetectionNudgeRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateSellerDetectionNudgeRequest>, I>>(
    base?: I,
  ): ValidateSellerDetectionNudgeRequest {
    return ValidateSellerDetectionNudgeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateSellerDetectionNudgeRequest>, I>>(
    _: I,
  ): ValidateSellerDetectionNudgeRequest {
    const message = createBaseValidateSellerDetectionNudgeRequest();
    return message;
  },
};

function createBaseValidateSellerDetectionNudgeResponse(): ValidateSellerDetectionNudgeResponse {
  return { isActiveSellerDetectionNudge: false };
}

export const ValidateSellerDetectionNudgeResponse = {
  encode(message: ValidateSellerDetectionNudgeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isActiveSellerDetectionNudge === true) {
      writer.uint32(8).bool(message.isActiveSellerDetectionNudge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateSellerDetectionNudgeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateSellerDetectionNudgeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isActiveSellerDetectionNudge = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidateSellerDetectionNudgeResponse {
    return {
      isActiveSellerDetectionNudge: isSet(object.isActiveSellerDetectionNudge)
        ? Boolean(object.isActiveSellerDetectionNudge)
        : false,
    };
  },

  toJSON(message: ValidateSellerDetectionNudgeResponse): unknown {
    const obj: any = {};
    message.isActiveSellerDetectionNudge !== undefined &&
      (obj.isActiveSellerDetectionNudge = message.isActiveSellerDetectionNudge);
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateSellerDetectionNudgeResponse>, I>>(
    base?: I,
  ): ValidateSellerDetectionNudgeResponse {
    return ValidateSellerDetectionNudgeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateSellerDetectionNudgeResponse>, I>>(
    object: I,
  ): ValidateSellerDetectionNudgeResponse {
    const message = createBaseValidateSellerDetectionNudgeResponse();
    message.isActiveSellerDetectionNudge = object.isActiveSellerDetectionNudge ?? false;
    return message;
  },
};

function createBaseGetVariantsRequest(): GetVariantsRequest {
  return { categoryId: "" };
}

export const GetVariantsRequest = {
  encode(message: GetVariantsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.categoryId !== "") {
      writer.uint32(10).string(message.categoryId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVariantsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVariantsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.categoryId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVariantsRequest {
    return { categoryId: isSet(object.categoryId) ? String(object.categoryId) : "" };
  },

  toJSON(message: GetVariantsRequest): unknown {
    const obj: any = {};
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetVariantsRequest>, I>>(base?: I): GetVariantsRequest {
    return GetVariantsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetVariantsRequest>, I>>(object: I): GetVariantsRequest {
    const message = createBaseGetVariantsRequest();
    message.categoryId = object.categoryId ?? "";
    return message;
  },
};

function createBaseGetVariantsResponse(): GetVariantsResponse {
  return { variants: [] };
}

export const GetVariantsResponse = {
  encode(message: GetVariantsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.variants) {
      Variant.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetVariantsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetVariantsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.variants.push(Variant.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetVariantsResponse {
    return { variants: Array.isArray(object?.variants) ? object.variants.map((e: any) => Variant.fromJSON(e)) : [] };
  },

  toJSON(message: GetVariantsResponse): unknown {
    const obj: any = {};
    if (message.variants) {
      obj.variants = message.variants.map((e) => e ? Variant.toJSON(e) : undefined);
    } else {
      obj.variants = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetVariantsResponse>, I>>(base?: I): GetVariantsResponse {
    return GetVariantsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetVariantsResponse>, I>>(object: I): GetVariantsResponse {
    const message = createBaseGetVariantsResponse();
    message.variants = object.variants?.map((e) => Variant.fromPartial(e)) || [];
    return message;
  },
};

function createBaseVariant(): Variant {
  return { id: "", name: "", nameAr: "" };
}

export const Variant = {
  encode(message: Variant, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Variant {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVariant();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.nameAr = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Variant {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
    };
  },

  toJSON(message: Variant): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    return obj;
  },

  create<I extends Exact<DeepPartial<Variant>, I>>(base?: I): Variant {
    return Variant.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Variant>, I>>(object: I): Variant {
    const message = createBaseVariant();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    return message;
  },
};

function createBaseMigrateCategoryCondition(): MigrateCategoryCondition {
  return {
    id: "",
    categoryId: "",
    priceNudgeMin: 0,
    priceNudgeMax: 0,
    fairPrice: 0,
    fairTTL: 0,
    excellentPrice: 0,
    excellentTTL: 0,
    expensivePrice: 0,
    expensiveTTL: 0,
  };
}

export const MigrateCategoryCondition = {
  encode(message: MigrateCategoryCondition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.categoryId !== "") {
      writer.uint32(18).string(message.categoryId);
    }
    if (message.priceNudgeMin !== 0) {
      writer.uint32(24).int32(message.priceNudgeMin);
    }
    if (message.priceNudgeMax !== 0) {
      writer.uint32(32).int32(message.priceNudgeMax);
    }
    if (message.fairPrice !== 0) {
      writer.uint32(40).int32(message.fairPrice);
    }
    if (message.fairTTL !== 0) {
      writer.uint32(48).int32(message.fairTTL);
    }
    if (message.excellentPrice !== 0) {
      writer.uint32(56).int32(message.excellentPrice);
    }
    if (message.excellentTTL !== 0) {
      writer.uint32(64).int32(message.excellentTTL);
    }
    if (message.expensivePrice !== 0) {
      writer.uint32(72).int32(message.expensivePrice);
    }
    if (message.expensiveTTL !== 0) {
      writer.uint32(80).int32(message.expensiveTTL);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MigrateCategoryCondition {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMigrateCategoryCondition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.categoryId = reader.string();
          break;
        case 3:
          message.priceNudgeMin = reader.int32();
          break;
        case 4:
          message.priceNudgeMax = reader.int32();
          break;
        case 5:
          message.fairPrice = reader.int32();
          break;
        case 6:
          message.fairTTL = reader.int32();
          break;
        case 7:
          message.excellentPrice = reader.int32();
          break;
        case 8:
          message.excellentTTL = reader.int32();
          break;
        case 9:
          message.expensivePrice = reader.int32();
          break;
        case 10:
          message.expensiveTTL = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MigrateCategoryCondition {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : "",
      priceNudgeMin: isSet(object.priceNudgeMin) ? Number(object.priceNudgeMin) : 0,
      priceNudgeMax: isSet(object.priceNudgeMax) ? Number(object.priceNudgeMax) : 0,
      fairPrice: isSet(object.fairPrice) ? Number(object.fairPrice) : 0,
      fairTTL: isSet(object.fairTTL) ? Number(object.fairTTL) : 0,
      excellentPrice: isSet(object.excellentPrice) ? Number(object.excellentPrice) : 0,
      excellentTTL: isSet(object.excellentTTL) ? Number(object.excellentTTL) : 0,
      expensivePrice: isSet(object.expensivePrice) ? Number(object.expensivePrice) : 0,
      expensiveTTL: isSet(object.expensiveTTL) ? Number(object.expensiveTTL) : 0,
    };
  },

  toJSON(message: MigrateCategoryCondition): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    message.priceNudgeMin !== undefined && (obj.priceNudgeMin = Math.round(message.priceNudgeMin));
    message.priceNudgeMax !== undefined && (obj.priceNudgeMax = Math.round(message.priceNudgeMax));
    message.fairPrice !== undefined && (obj.fairPrice = Math.round(message.fairPrice));
    message.fairTTL !== undefined && (obj.fairTTL = Math.round(message.fairTTL));
    message.excellentPrice !== undefined && (obj.excellentPrice = Math.round(message.excellentPrice));
    message.excellentTTL !== undefined && (obj.excellentTTL = Math.round(message.excellentTTL));
    message.expensivePrice !== undefined && (obj.expensivePrice = Math.round(message.expensivePrice));
    message.expensiveTTL !== undefined && (obj.expensiveTTL = Math.round(message.expensiveTTL));
    return obj;
  },

  create<I extends Exact<DeepPartial<MigrateCategoryCondition>, I>>(base?: I): MigrateCategoryCondition {
    return MigrateCategoryCondition.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<MigrateCategoryCondition>, I>>(object: I): MigrateCategoryCondition {
    const message = createBaseMigrateCategoryCondition();
    message.id = object.id ?? "";
    message.categoryId = object.categoryId ?? "";
    message.priceNudgeMin = object.priceNudgeMin ?? 0;
    message.priceNudgeMax = object.priceNudgeMax ?? 0;
    message.fairPrice = object.fairPrice ?? 0;
    message.fairTTL = object.fairTTL ?? 0;
    message.excellentPrice = object.excellentPrice ?? 0;
    message.excellentTTL = object.excellentTTL ?? 0;
    message.expensivePrice = object.expensivePrice ?? 0;
    message.expensiveTTL = object.expensiveTTL ?? 0;
    return message;
  },
};

function createBaseGetOrderDetailResponse(): GetOrderDetailResponse {
  return {
    buyerId: "",
    sellerId: "",
    sellerOrderDetail: undefined,
    buyerOrderDetail: undefined,
    productName: "",
    orderNumber: "",
    orderId: "",
    productId: "",
    sellerPhoneNumber: "",
    buyerPhoneNumber: "",
    isFinancingEmailSent: false,
  };
}

export const GetOrderDetailResponse = {
  encode(message: GetOrderDetailResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.buyerId !== "") {
      writer.uint32(10).string(message.buyerId);
    }
    if (message.sellerId !== "") {
      writer.uint32(18).string(message.sellerId);
    }
    if (message.sellerOrderDetail !== undefined) {
      SellerOrderDetail.encode(message.sellerOrderDetail, writer.uint32(26).fork()).ldelim();
    }
    if (message.buyerOrderDetail !== undefined) {
      BuyerOrderDetail.encode(message.buyerOrderDetail, writer.uint32(34).fork()).ldelim();
    }
    if (message.productName !== "") {
      writer.uint32(42).string(message.productName);
    }
    if (message.orderNumber !== "") {
      writer.uint32(50).string(message.orderNumber);
    }
    if (message.orderId !== "") {
      writer.uint32(58).string(message.orderId);
    }
    if (message.productId !== "") {
      writer.uint32(66).string(message.productId);
    }
    if (message.sellerPhoneNumber !== "") {
      writer.uint32(74).string(message.sellerPhoneNumber);
    }
    if (message.buyerPhoneNumber !== "") {
      writer.uint32(82).string(message.buyerPhoneNumber);
    }
    if (message.isFinancingEmailSent === true) {
      writer.uint32(88).bool(message.isFinancingEmailSent);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderDetailResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderDetailResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.buyerId = reader.string();
          break;
        case 2:
          message.sellerId = reader.string();
          break;
        case 3:
          message.sellerOrderDetail = SellerOrderDetail.decode(reader, reader.uint32());
          break;
        case 4:
          message.buyerOrderDetail = BuyerOrderDetail.decode(reader, reader.uint32());
          break;
        case 5:
          message.productName = reader.string();
          break;
        case 6:
          message.orderNumber = reader.string();
          break;
        case 7:
          message.orderId = reader.string();
          break;
        case 8:
          message.productId = reader.string();
          break;
        case 9:
          message.sellerPhoneNumber = reader.string();
          break;
        case 10:
          message.buyerPhoneNumber = reader.string();
          break;
        case 11:
          message.isFinancingEmailSent = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderDetailResponse {
    return {
      buyerId: isSet(object.buyerId) ? String(object.buyerId) : "",
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
      sellerOrderDetail: isSet(object.sellerOrderDetail)
        ? SellerOrderDetail.fromJSON(object.sellerOrderDetail)
        : undefined,
      buyerOrderDetail: isSet(object.buyerOrderDetail) ? BuyerOrderDetail.fromJSON(object.buyerOrderDetail) : undefined,
      productName: isSet(object.productName) ? String(object.productName) : "",
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      sellerPhoneNumber: isSet(object.sellerPhoneNumber) ? String(object.sellerPhoneNumber) : "",
      buyerPhoneNumber: isSet(object.buyerPhoneNumber) ? String(object.buyerPhoneNumber) : "",
      isFinancingEmailSent: isSet(object.isFinancingEmailSent) ? Boolean(object.isFinancingEmailSent) : false,
    };
  },

  toJSON(message: GetOrderDetailResponse): unknown {
    const obj: any = {};
    message.buyerId !== undefined && (obj.buyerId = message.buyerId);
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    message.sellerOrderDetail !== undefined && (obj.sellerOrderDetail = message.sellerOrderDetail
      ? SellerOrderDetail.toJSON(message.sellerOrderDetail)
      : undefined);
    message.buyerOrderDetail !== undefined &&
      (obj.buyerOrderDetail = message.buyerOrderDetail ? BuyerOrderDetail.toJSON(message.buyerOrderDetail) : undefined);
    message.productName !== undefined && (obj.productName = message.productName);
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.productId !== undefined && (obj.productId = message.productId);
    message.sellerPhoneNumber !== undefined && (obj.sellerPhoneNumber = message.sellerPhoneNumber);
    message.buyerPhoneNumber !== undefined && (obj.buyerPhoneNumber = message.buyerPhoneNumber);
    message.isFinancingEmailSent !== undefined && (obj.isFinancingEmailSent = message.isFinancingEmailSent);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderDetailResponse>, I>>(base?: I): GetOrderDetailResponse {
    return GetOrderDetailResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderDetailResponse>, I>>(object: I): GetOrderDetailResponse {
    const message = createBaseGetOrderDetailResponse();
    message.buyerId = object.buyerId ?? "";
    message.sellerId = object.sellerId ?? "";
    message.sellerOrderDetail = (object.sellerOrderDetail !== undefined && object.sellerOrderDetail !== null)
      ? SellerOrderDetail.fromPartial(object.sellerOrderDetail)
      : undefined;
    message.buyerOrderDetail = (object.buyerOrderDetail !== undefined && object.buyerOrderDetail !== null)
      ? BuyerOrderDetail.fromPartial(object.buyerOrderDetail)
      : undefined;
    message.productName = object.productName ?? "";
    message.orderNumber = object.orderNumber ?? "";
    message.orderId = object.orderId ?? "";
    message.productId = object.productId ?? "";
    message.sellerPhoneNumber = object.sellerPhoneNumber ?? "";
    message.buyerPhoneNumber = object.buyerPhoneNumber ?? "";
    message.isFinancingEmailSent = object.isFinancingEmailSent ?? false;
    return message;
  },
};

function createBaseGetOrderDetailRequest(): GetOrderDetailRequest {
  return { orderId: "" };
}

export const GetOrderDetailRequest = {
  encode(message: GetOrderDetailRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderDetailRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderDetailRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderDetailRequest {
    return { orderId: isSet(object.orderId) ? String(object.orderId) : "" };
  },

  toJSON(message: GetOrderDetailRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderDetailRequest>, I>>(base?: I): GetOrderDetailRequest {
    return GetOrderDetailRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderDetailRequest>, I>>(object: I): GetOrderDetailRequest {
    const message = createBaseGetOrderDetailRequest();
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseGetUserRequest(): GetUserRequest {
  return { id: "" };
}

export const GetUserRequest = {
  encode(message: GetUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserRequest {
    return { id: isSet(object.id) ? String(object.id) : "" };
  },

  toJSON(message: GetUserRequest): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserRequest>, I>>(base?: I): GetUserRequest {
    return GetUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserRequest>, I>>(object: I): GetUserRequest {
    const message = createBaseGetUserRequest();
    message.id = object.id ?? "";
    return message;
  },
};

function createBaseGetDmUserRequest(): GetDmUserRequest {
  return { userId: "" };
}

export const GetDmUserRequest = {
  encode(message: GetDmUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDmUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDmUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDmUserRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: GetDmUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDmUserRequest>, I>>(base?: I): GetDmUserRequest {
    return GetDmUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetDmUserRequest>, I>>(object: I): GetDmUserRequest {
    const message = createBaseGetDmUserRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetPermissionsRequest(): GetPermissionsRequest {
  return { serviceName: "" };
}

export const GetPermissionsRequest = {
  encode(message: GetPermissionsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceName !== "") {
      writer.uint32(10).string(message.serviceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPermissionsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPermissionsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serviceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPermissionsRequest {
    return { serviceName: isSet(object.serviceName) ? String(object.serviceName) : "" };
  },

  toJSON(message: GetPermissionsRequest): unknown {
    const obj: any = {};
    message.serviceName !== undefined && (obj.serviceName = message.serviceName);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPermissionsRequest>, I>>(base?: I): GetPermissionsRequest {
    return GetPermissionsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPermissionsRequest>, I>>(object: I): GetPermissionsRequest {
    const message = createBaseGetPermissionsRequest();
    message.serviceName = object.serviceName ?? "";
    return message;
  },
};

function createBaseGetUserResponse(): GetUserResponse {
  return {
    id: "",
    name: "",
    phoneNumber: "",
    bankDetail: undefined,
    address: undefined,
    email: "",
    isKeySeller: false,
    isMerchant: false,
    activeListings: 0,
    soldListings: 0,
    avatar: "",
    activatedDate: "",
    bio: "",
    isCompliant: false,
  };
}

export const GetUserResponse = {
  encode(message: GetUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(26).string(message.phoneNumber);
    }
    if (message.bankDetail !== undefined) {
      Bank.encode(message.bankDetail, writer.uint32(34).fork()).ldelim();
    }
    if (message.address !== undefined) {
      Address.encode(message.address, writer.uint32(42).fork()).ldelim();
    }
    if (message.email !== "") {
      writer.uint32(50).string(message.email);
    }
    if (message.isKeySeller === true) {
      writer.uint32(56).bool(message.isKeySeller);
    }
    if (message.isMerchant === true) {
      writer.uint32(64).bool(message.isMerchant);
    }
    if (message.activeListings !== 0) {
      writer.uint32(73).double(message.activeListings);
    }
    if (message.soldListings !== 0) {
      writer.uint32(81).double(message.soldListings);
    }
    if (message.avatar !== "") {
      writer.uint32(90).string(message.avatar);
    }
    if (message.activatedDate !== "") {
      writer.uint32(98).string(message.activatedDate);
    }
    if (message.bio !== "") {
      writer.uint32(106).string(message.bio);
    }
    if (message.isCompliant === true) {
      writer.uint32(112).bool(message.isCompliant);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.phoneNumber = reader.string();
          break;
        case 4:
          message.bankDetail = Bank.decode(reader, reader.uint32());
          break;
        case 5:
          message.address = Address.decode(reader, reader.uint32());
          break;
        case 6:
          message.email = reader.string();
          break;
        case 7:
          message.isKeySeller = reader.bool();
          break;
        case 8:
          message.isMerchant = reader.bool();
          break;
        case 9:
          message.activeListings = reader.double();
          break;
        case 10:
          message.soldListings = reader.double();
          break;
        case 11:
          message.avatar = reader.string();
          break;
        case 12:
          message.activatedDate = reader.string();
          break;
        case 13:
          message.bio = reader.string();
          break;
        case 14:
          message.isCompliant = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      phoneNumber: isSet(object.phoneNumber) ? String(object.phoneNumber) : "",
      bankDetail: isSet(object.bankDetail) ? Bank.fromJSON(object.bankDetail) : undefined,
      address: isSet(object.address) ? Address.fromJSON(object.address) : undefined,
      email: isSet(object.email) ? String(object.email) : "",
      isKeySeller: isSet(object.isKeySeller) ? Boolean(object.isKeySeller) : false,
      isMerchant: isSet(object.isMerchant) ? Boolean(object.isMerchant) : false,
      activeListings: isSet(object.activeListings) ? Number(object.activeListings) : 0,
      soldListings: isSet(object.soldListings) ? Number(object.soldListings) : 0,
      avatar: isSet(object.avatar) ? String(object.avatar) : "",
      activatedDate: isSet(object.activatedDate) ? String(object.activatedDate) : "",
      bio: isSet(object.bio) ? String(object.bio) : "",
      isCompliant: isSet(object.isCompliant) ? Boolean(object.isCompliant) : false,
    };
  },

  toJSON(message: GetUserResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.phoneNumber !== undefined && (obj.phoneNumber = message.phoneNumber);
    message.bankDetail !== undefined &&
      (obj.bankDetail = message.bankDetail ? Bank.toJSON(message.bankDetail) : undefined);
    message.address !== undefined && (obj.address = message.address ? Address.toJSON(message.address) : undefined);
    message.email !== undefined && (obj.email = message.email);
    message.isKeySeller !== undefined && (obj.isKeySeller = message.isKeySeller);
    message.isMerchant !== undefined && (obj.isMerchant = message.isMerchant);
    message.activeListings !== undefined && (obj.activeListings = message.activeListings);
    message.soldListings !== undefined && (obj.soldListings = message.soldListings);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.activatedDate !== undefined && (obj.activatedDate = message.activatedDate);
    message.bio !== undefined && (obj.bio = message.bio);
    message.isCompliant !== undefined && (obj.isCompliant = message.isCompliant);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserResponse>, I>>(base?: I): GetUserResponse {
    return GetUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserResponse>, I>>(object: I): GetUserResponse {
    const message = createBaseGetUserResponse();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    message.bankDetail = (object.bankDetail !== undefined && object.bankDetail !== null)
      ? Bank.fromPartial(object.bankDetail)
      : undefined;
    message.address = (object.address !== undefined && object.address !== null)
      ? Address.fromPartial(object.address)
      : undefined;
    message.email = object.email ?? "";
    message.isKeySeller = object.isKeySeller ?? false;
    message.isMerchant = object.isMerchant ?? false;
    message.activeListings = object.activeListings ?? 0;
    message.soldListings = object.soldListings ?? 0;
    message.avatar = object.avatar ?? "";
    message.activatedDate = object.activatedDate ?? "";
    message.bio = object.bio ?? "";
    message.isCompliant = object.isCompliant ?? false;
    return message;
  },
};

function createBaseGetDmUserResponse(): GetDmUserResponse {
  return { id: "", firstName: "", lastName: "", username: "", status: "", email: "", phoneNumber: "" };
}

export const GetDmUserResponse = {
  encode(message: GetDmUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.firstName !== "") {
      writer.uint32(18).string(message.firstName);
    }
    if (message.lastName !== "") {
      writer.uint32(26).string(message.lastName);
    }
    if (message.username !== "") {
      writer.uint32(34).string(message.username);
    }
    if (message.status !== "") {
      writer.uint32(42).string(message.status);
    }
    if (message.email !== "") {
      writer.uint32(50).string(message.email);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(58).string(message.phoneNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDmUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDmUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.firstName = reader.string();
          break;
        case 3:
          message.lastName = reader.string();
          break;
        case 4:
          message.username = reader.string();
          break;
        case 5:
          message.status = reader.string();
          break;
        case 6:
          message.email = reader.string();
          break;
        case 7:
          message.phoneNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDmUserResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      firstName: isSet(object.firstName) ? String(object.firstName) : "",
      lastName: isSet(object.lastName) ? String(object.lastName) : "",
      username: isSet(object.username) ? String(object.username) : "",
      status: isSet(object.status) ? String(object.status) : "",
      email: isSet(object.email) ? String(object.email) : "",
      phoneNumber: isSet(object.phoneNumber) ? String(object.phoneNumber) : "",
    };
  },

  toJSON(message: GetDmUserResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.firstName !== undefined && (obj.firstName = message.firstName);
    message.lastName !== undefined && (obj.lastName = message.lastName);
    message.username !== undefined && (obj.username = message.username);
    message.status !== undefined && (obj.status = message.status);
    message.email !== undefined && (obj.email = message.email);
    message.phoneNumber !== undefined && (obj.phoneNumber = message.phoneNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDmUserResponse>, I>>(base?: I): GetDmUserResponse {
    return GetDmUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetDmUserResponse>, I>>(object: I): GetDmUserResponse {
    const message = createBaseGetDmUserResponse();
    message.id = object.id ?? "";
    message.firstName = object.firstName ?? "";
    message.lastName = object.lastName ?? "";
    message.username = object.username ?? "";
    message.status = object.status ?? "";
    message.email = object.email ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    return message;
  },
};

function createBaseSellerOrderDetail(): SellerOrderDetail {
  return { payoutAmount: 0, sellPrice: 0 };
}

export const SellerOrderDetail = {
  encode(message: SellerOrderDetail, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.payoutAmount !== 0) {
      writer.uint32(13).float(message.payoutAmount);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(21).float(message.sellPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SellerOrderDetail {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSellerOrderDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payoutAmount = reader.float();
          break;
        case 2:
          message.sellPrice = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SellerOrderDetail {
    return {
      payoutAmount: isSet(object.payoutAmount) ? Number(object.payoutAmount) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
    };
  },

  toJSON(message: SellerOrderDetail): unknown {
    const obj: any = {};
    message.payoutAmount !== undefined && (obj.payoutAmount = message.payoutAmount);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    return obj;
  },

  create<I extends Exact<DeepPartial<SellerOrderDetail>, I>>(base?: I): SellerOrderDetail {
    return SellerOrderDetail.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SellerOrderDetail>, I>>(object: I): SellerOrderDetail {
    const message = createBaseSellerOrderDetail();
    message.payoutAmount = object.payoutAmount ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    return message;
  },
};

function createBaseBuyerOrderDetail(): BuyerOrderDetail {
  return { grandTotal: 0 };
}

export const BuyerOrderDetail = {
  encode(message: BuyerOrderDetail, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.grandTotal !== 0) {
      writer.uint32(13).float(message.grandTotal);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BuyerOrderDetail {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBuyerOrderDetail();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.grandTotal = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BuyerOrderDetail {
    return { grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0 };
  },

  toJSON(message: BuyerOrderDetail): unknown {
    const obj: any = {};
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    return obj;
  },

  create<I extends Exact<DeepPartial<BuyerOrderDetail>, I>>(base?: I): BuyerOrderDetail {
    return BuyerOrderDetail.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BuyerOrderDetail>, I>>(object: I): BuyerOrderDetail {
    const message = createBaseBuyerOrderDetail();
    message.grandTotal = object.grandTotal ?? 0;
    return message;
  },
};

function createBaseBank(): Bank {
  return { accountHolderName: "", accountId: "", bankBIC: "", bankName: "", isNonSaudiBank: false };
}

export const Bank = {
  encode(message: Bank, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.accountHolderName !== "") {
      writer.uint32(10).string(message.accountHolderName);
    }
    if (message.accountId !== "") {
      writer.uint32(18).string(message.accountId);
    }
    if (message.bankBIC !== "") {
      writer.uint32(26).string(message.bankBIC);
    }
    if (message.bankName !== "") {
      writer.uint32(34).string(message.bankName);
    }
    if (message.isNonSaudiBank === true) {
      writer.uint32(40).bool(message.isNonSaudiBank);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Bank {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBank();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.accountHolderName = reader.string();
          break;
        case 2:
          message.accountId = reader.string();
          break;
        case 3:
          message.bankBIC = reader.string();
          break;
        case 4:
          message.bankName = reader.string();
          break;
        case 5:
          message.isNonSaudiBank = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Bank {
    return {
      accountHolderName: isSet(object.accountHolderName) ? String(object.accountHolderName) : "",
      accountId: isSet(object.accountId) ? String(object.accountId) : "",
      bankBIC: isSet(object.bankBIC) ? String(object.bankBIC) : "",
      bankName: isSet(object.bankName) ? String(object.bankName) : "",
      isNonSaudiBank: isSet(object.isNonSaudiBank) ? Boolean(object.isNonSaudiBank) : false,
    };
  },

  toJSON(message: Bank): unknown {
    const obj: any = {};
    message.accountHolderName !== undefined && (obj.accountHolderName = message.accountHolderName);
    message.accountId !== undefined && (obj.accountId = message.accountId);
    message.bankBIC !== undefined && (obj.bankBIC = message.bankBIC);
    message.bankName !== undefined && (obj.bankName = message.bankName);
    message.isNonSaudiBank !== undefined && (obj.isNonSaudiBank = message.isNonSaudiBank);
    return obj;
  },

  create<I extends Exact<DeepPartial<Bank>, I>>(base?: I): Bank {
    return Bank.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Bank>, I>>(object: I): Bank {
    const message = createBaseBank();
    message.accountHolderName = object.accountHolderName ?? "";
    message.accountId = object.accountId ?? "";
    message.bankBIC = object.bankBIC ?? "";
    message.bankName = object.bankName ?? "";
    message.isNonSaudiBank = object.isNonSaudiBank ?? false;
    return message;
  },
};

function createBaseAddress(): Address {
  return { street: "", district: "", city: "", postalCode: "", latitude: "", longitude: "" };
}

export const Address = {
  encode(message: Address, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.street !== "") {
      writer.uint32(10).string(message.street);
    }
    if (message.district !== "") {
      writer.uint32(18).string(message.district);
    }
    if (message.city !== "") {
      writer.uint32(26).string(message.city);
    }
    if (message.postalCode !== "") {
      writer.uint32(34).string(message.postalCode);
    }
    if (message.latitude !== "") {
      writer.uint32(42).string(message.latitude);
    }
    if (message.longitude !== "") {
      writer.uint32(50).string(message.longitude);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Address {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddress();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.street = reader.string();
          break;
        case 2:
          message.district = reader.string();
          break;
        case 3:
          message.city = reader.string();
          break;
        case 4:
          message.postalCode = reader.string();
          break;
        case 5:
          message.latitude = reader.string();
          break;
        case 6:
          message.longitude = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Address {
    return {
      street: isSet(object.street) ? String(object.street) : "",
      district: isSet(object.district) ? String(object.district) : "",
      city: isSet(object.city) ? String(object.city) : "",
      postalCode: isSet(object.postalCode) ? String(object.postalCode) : "",
      latitude: isSet(object.latitude) ? String(object.latitude) : "",
      longitude: isSet(object.longitude) ? String(object.longitude) : "",
    };
  },

  toJSON(message: Address): unknown {
    const obj: any = {};
    message.street !== undefined && (obj.street = message.street);
    message.district !== undefined && (obj.district = message.district);
    message.city !== undefined && (obj.city = message.city);
    message.postalCode !== undefined && (obj.postalCode = message.postalCode);
    message.latitude !== undefined && (obj.latitude = message.latitude);
    message.longitude !== undefined && (obj.longitude = message.longitude);
    return obj;
  },

  create<I extends Exact<DeepPartial<Address>, I>>(base?: I): Address {
    return Address.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Address>, I>>(object: I): Address {
    const message = createBaseAddress();
    message.street = object.street ?? "";
    message.district = object.district ?? "";
    message.city = object.city ?? "";
    message.postalCode = object.postalCode ?? "";
    message.latitude = object.latitude ?? "";
    message.longitude = object.longitude ?? "";
    return message;
  },
};

function createBasePermission(): Permission {
  return { key: "", description: "" };
}

export const Permission = {
  encode(message: Permission, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Permission {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePermission();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.description = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Permission {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      description: isSet(object.description) ? String(object.description) : "",
    };
  },

  toJSON(message: Permission): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.description !== undefined && (obj.description = message.description);
    return obj;
  },

  create<I extends Exact<DeepPartial<Permission>, I>>(base?: I): Permission {
    return Permission.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Permission>, I>>(object: I): Permission {
    const message = createBasePermission();
    message.key = object.key ?? "";
    message.description = object.description ?? "";
    return message;
  },
};

function createBaseGetUsersRequest(): GetUsersRequest {
  return { userIds: [], limitUsersWithBank: false };
}

export const GetUsersRequest = {
  encode(message: GetUsersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.userIds) {
      writer.uint32(10).string(v!);
    }
    if (message.limitUsersWithBank === true) {
      writer.uint32(16).bool(message.limitUsersWithBank);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userIds.push(reader.string());
          break;
        case 2:
          message.limitUsersWithBank = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUsersRequest {
    return {
      userIds: Array.isArray(object?.userIds) ? object.userIds.map((e: any) => String(e)) : [],
      limitUsersWithBank: isSet(object.limitUsersWithBank) ? Boolean(object.limitUsersWithBank) : false,
    };
  },

  toJSON(message: GetUsersRequest): unknown {
    const obj: any = {};
    if (message.userIds) {
      obj.userIds = message.userIds.map((e) => e);
    } else {
      obj.userIds = [];
    }
    message.limitUsersWithBank !== undefined && (obj.limitUsersWithBank = message.limitUsersWithBank);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersRequest>, I>>(base?: I): GetUsersRequest {
    return GetUsersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUsersRequest>, I>>(object: I): GetUsersRequest {
    const message = createBaseGetUsersRequest();
    message.userIds = object.userIds?.map((e) => e) || [];
    message.limitUsersWithBank = object.limitUsersWithBank ?? false;
    return message;
  },
};

function createBaseGetPermissionsResponse(): GetPermissionsResponse {
  return { permissions: [] };
}

export const GetPermissionsResponse = {
  encode(message: GetPermissionsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.permissions) {
      Permission.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPermissionsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPermissionsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.permissions.push(Permission.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPermissionsResponse {
    return {
      permissions: Array.isArray(object?.permissions) ? object.permissions.map((e: any) => Permission.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetPermissionsResponse): unknown {
    const obj: any = {};
    if (message.permissions) {
      obj.permissions = message.permissions.map((e) => e ? Permission.toJSON(e) : undefined);
    } else {
      obj.permissions = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPermissionsResponse>, I>>(base?: I): GetPermissionsResponse {
    return GetPermissionsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPermissionsResponse>, I>>(object: I): GetPermissionsResponse {
    const message = createBaseGetPermissionsResponse();
    message.permissions = object.permissions?.map((e) => Permission.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetUsersResponse(): GetUsersResponse {
  return { users: [] };
}

export const GetUsersResponse = {
  encode(message: GetUsersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.users) {
      GetUsersResponse_User.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(GetUsersResponse_User.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUsersResponse {
    return {
      users: Array.isArray(object?.users) ? object.users.map((e: any) => GetUsersResponse_User.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetUsersResponse): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map((e) => e ? GetUsersResponse_User.toJSON(e) : undefined);
    } else {
      obj.users = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersResponse>, I>>(base?: I): GetUsersResponse {
    return GetUsersResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUsersResponse>, I>>(object: I): GetUsersResponse {
    const message = createBaseGetUsersResponse();
    message.users = object.users?.map((e) => GetUsersResponse_User.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetUsersResponse_User(): GetUsersResponse_User {
  return { id: "", name: "", phoneNumber: "", bankDetail: undefined, isKeySeller: false, isMerchant: false };
}

export const GetUsersResponse_User = {
  encode(message: GetUsersResponse_User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(26).string(message.phoneNumber);
    }
    if (message.bankDetail !== undefined) {
      Bank.encode(message.bankDetail, writer.uint32(34).fork()).ldelim();
    }
    if (message.isKeySeller === true) {
      writer.uint32(56).bool(message.isKeySeller);
    }
    if (message.isMerchant === true) {
      writer.uint32(64).bool(message.isMerchant);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersResponse_User {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersResponse_User();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.phoneNumber = reader.string();
          break;
        case 4:
          message.bankDetail = Bank.decode(reader, reader.uint32());
          break;
        case 7:
          message.isKeySeller = reader.bool();
          break;
        case 8:
          message.isMerchant = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUsersResponse_User {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      phoneNumber: isSet(object.phoneNumber) ? String(object.phoneNumber) : "",
      bankDetail: isSet(object.bankDetail) ? Bank.fromJSON(object.bankDetail) : undefined,
      isKeySeller: isSet(object.isKeySeller) ? Boolean(object.isKeySeller) : false,
      isMerchant: isSet(object.isMerchant) ? Boolean(object.isMerchant) : false,
    };
  },

  toJSON(message: GetUsersResponse_User): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.phoneNumber !== undefined && (obj.phoneNumber = message.phoneNumber);
    message.bankDetail !== undefined &&
      (obj.bankDetail = message.bankDetail ? Bank.toJSON(message.bankDetail) : undefined);
    message.isKeySeller !== undefined && (obj.isKeySeller = message.isKeySeller);
    message.isMerchant !== undefined && (obj.isMerchant = message.isMerchant);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersResponse_User>, I>>(base?: I): GetUsersResponse_User {
    return GetUsersResponse_User.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUsersResponse_User>, I>>(object: I): GetUsersResponse_User {
    const message = createBaseGetUsersResponse_User();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    message.bankDetail = (object.bankDetail !== undefined && object.bankDetail !== null)
      ? Bank.fromPartial(object.bankDetail)
      : undefined;
    message.isKeySeller = object.isKeySeller ?? false;
    message.isMerchant = object.isMerchant ?? false;
    return message;
  },
};

function createBaseGetDmUsersRequest(): GetDmUsersRequest {
  return { userIds: [] };
}

export const GetDmUsersRequest = {
  encode(message: GetDmUsersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.userIds) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDmUsersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDmUsersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDmUsersRequest {
    return { userIds: Array.isArray(object?.userIds) ? object.userIds.map((e: any) => String(e)) : [] };
  },

  toJSON(message: GetDmUsersRequest): unknown {
    const obj: any = {};
    if (message.userIds) {
      obj.userIds = message.userIds.map((e) => e);
    } else {
      obj.userIds = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDmUsersRequest>, I>>(base?: I): GetDmUsersRequest {
    return GetDmUsersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetDmUsersRequest>, I>>(object: I): GetDmUsersRequest {
    const message = createBaseGetDmUsersRequest();
    message.userIds = object.userIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetDmUsersResponse(): GetDmUsersResponse {
  return { users: [] };
}

export const GetDmUsersResponse = {
  encode(message: GetDmUsersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.users) {
      GetDmUsersResponse_DmUser.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDmUsersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDmUsersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(GetDmUsersResponse_DmUser.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDmUsersResponse {
    return {
      users: Array.isArray(object?.users) ? object.users.map((e: any) => GetDmUsersResponse_DmUser.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetDmUsersResponse): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map((e) => e ? GetDmUsersResponse_DmUser.toJSON(e) : undefined);
    } else {
      obj.users = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDmUsersResponse>, I>>(base?: I): GetDmUsersResponse {
    return GetDmUsersResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetDmUsersResponse>, I>>(object: I): GetDmUsersResponse {
    const message = createBaseGetDmUsersResponse();
    message.users = object.users?.map((e) => GetDmUsersResponse_DmUser.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetDmUsersResponse_DmUser(): GetDmUsersResponse_DmUser {
  return { id: "", username: "", phoneNumber: "" };
}

export const GetDmUsersResponse_DmUser = {
  encode(message: GetDmUsersResponse_DmUser, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.username !== "") {
      writer.uint32(18).string(message.username);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(26).string(message.phoneNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDmUsersResponse_DmUser {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDmUsersResponse_DmUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.username = reader.string();
          break;
        case 3:
          message.phoneNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDmUsersResponse_DmUser {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      username: isSet(object.username) ? String(object.username) : "",
      phoneNumber: isSet(object.phoneNumber) ? String(object.phoneNumber) : "",
    };
  },

  toJSON(message: GetDmUsersResponse_DmUser): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.username !== undefined && (obj.username = message.username);
    message.phoneNumber !== undefined && (obj.phoneNumber = message.phoneNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDmUsersResponse_DmUser>, I>>(base?: I): GetDmUsersResponse_DmUser {
    return GetDmUsersResponse_DmUser.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetDmUsersResponse_DmUser>, I>>(object: I): GetDmUsersResponse_DmUser {
    const message = createBaseGetDmUsersResponse_DmUser();
    message.id = object.id ?? "";
    message.username = object.username ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    return message;
  },
};

function createBaseGetUsersByPhoneRequest(): GetUsersByPhoneRequest {
  return { phoneNumber: "" };
}

export const GetUsersByPhoneRequest = {
  encode(message: GetUsersByPhoneRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.phoneNumber !== "") {
      writer.uint32(10).string(message.phoneNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersByPhoneRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersByPhoneRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.phoneNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUsersByPhoneRequest {
    return { phoneNumber: isSet(object.phoneNumber) ? String(object.phoneNumber) : "" };
  },

  toJSON(message: GetUsersByPhoneRequest): unknown {
    const obj: any = {};
    message.phoneNumber !== undefined && (obj.phoneNumber = message.phoneNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersByPhoneRequest>, I>>(base?: I): GetUsersByPhoneRequest {
    return GetUsersByPhoneRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUsersByPhoneRequest>, I>>(object: I): GetUsersByPhoneRequest {
    const message = createBaseGetUsersByPhoneRequest();
    message.phoneNumber = object.phoneNumber ?? "";
    return message;
  },
};

function createBaseGetUsersByPhoneResponse(): GetUsersByPhoneResponse {
  return { users: [] };
}

export const GetUsersByPhoneResponse = {
  encode(message: GetUsersByPhoneResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.users) {
      GetUsersByPhoneResponse_User.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersByPhoneResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersByPhoneResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(GetUsersByPhoneResponse_User.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUsersByPhoneResponse {
    return {
      users: Array.isArray(object?.users) ? object.users.map((e: any) => GetUsersByPhoneResponse_User.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetUsersByPhoneResponse): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map((e) => e ? GetUsersByPhoneResponse_User.toJSON(e) : undefined);
    } else {
      obj.users = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersByPhoneResponse>, I>>(base?: I): GetUsersByPhoneResponse {
    return GetUsersByPhoneResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUsersByPhoneResponse>, I>>(object: I): GetUsersByPhoneResponse {
    const message = createBaseGetUsersByPhoneResponse();
    message.users = object.users?.map((e) => GetUsersByPhoneResponse_User.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetUsersByPhoneResponse_User(): GetUsersByPhoneResponse_User {
  return { id: "", name: "", phoneNumber: "", bankDetail: undefined };
}

export const GetUsersByPhoneResponse_User = {
  encode(message: GetUsersByPhoneResponse_User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.phoneNumber !== "") {
      writer.uint32(26).string(message.phoneNumber);
    }
    if (message.bankDetail !== undefined) {
      Bank.encode(message.bankDetail, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUsersByPhoneResponse_User {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUsersByPhoneResponse_User();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.phoneNumber = reader.string();
          break;
        case 4:
          message.bankDetail = Bank.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUsersByPhoneResponse_User {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      phoneNumber: isSet(object.phoneNumber) ? String(object.phoneNumber) : "",
      bankDetail: isSet(object.bankDetail) ? Bank.fromJSON(object.bankDetail) : undefined,
    };
  },

  toJSON(message: GetUsersByPhoneResponse_User): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.phoneNumber !== undefined && (obj.phoneNumber = message.phoneNumber);
    message.bankDetail !== undefined &&
      (obj.bankDetail = message.bankDetail ? Bank.toJSON(message.bankDetail) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUsersByPhoneResponse_User>, I>>(base?: I): GetUsersByPhoneResponse_User {
    return GetUsersByPhoneResponse_User.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUsersByPhoneResponse_User>, I>>(object: I): GetUsersByPhoneResponse_User {
    const message = createBaseGetUsersByPhoneResponse_User();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.phoneNumber = object.phoneNumber ?? "";
    message.bankDetail = (object.bankDetail !== undefined && object.bankDetail !== null)
      ? Bank.fromPartial(object.bankDetail)
      : undefined;
    return message;
  },
};

function createBaseUpdateHighestBidRequest(): UpdateHighestBidRequest {
  return { productId: "", bid: 0 };
}

export const UpdateHighestBidRequest = {
  encode(message: UpdateHighestBidRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.bid !== 0) {
      writer.uint32(17).double(message.bid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateHighestBidRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateHighestBidRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.bid = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateHighestBidRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      bid: isSet(object.bid) ? Number(object.bid) : 0,
    };
  },

  toJSON(message: UpdateHighestBidRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.bid !== undefined && (obj.bid = message.bid);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateHighestBidRequest>, I>>(base?: I): UpdateHighestBidRequest {
    return UpdateHighestBidRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateHighestBidRequest>, I>>(object: I): UpdateHighestBidRequest {
    const message = createBaseUpdateHighestBidRequest();
    message.productId = object.productId ?? "";
    message.bid = object.bid ?? 0;
    return message;
  },
};

function createBaseUpdateHighestBidResponse(): UpdateHighestBidResponse {
  return {};
}

export const UpdateHighestBidResponse = {
  encode(_: UpdateHighestBidResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateHighestBidResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateHighestBidResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateHighestBidResponse {
    return {};
  },

  toJSON(_: UpdateHighestBidResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateHighestBidResponse>, I>>(base?: I): UpdateHighestBidResponse {
    return UpdateHighestBidResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateHighestBidResponse>, I>>(_: I): UpdateHighestBidResponse {
    const message = createBaseUpdateHighestBidResponse();
    return message;
  },
};

function createBaseGetProductsRequest(): GetProductsRequest {
  return { productIds: [], getAttributes: undefined };
}

export const GetProductsRequest = {
  encode(message: GetProductsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.productIds) {
      writer.uint32(10).string(v!);
    }
    if (message.getAttributes !== undefined) {
      writer.uint32(16).bool(message.getAttributes);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productIds.push(reader.string());
          break;
        case 2:
          message.getAttributes = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductsRequest {
    return {
      productIds: Array.isArray(object?.productIds) ? object.productIds.map((e: any) => String(e)) : [],
      getAttributes: isSet(object.getAttributes) ? Boolean(object.getAttributes) : undefined,
    };
  },

  toJSON(message: GetProductsRequest): unknown {
    const obj: any = {};
    if (message.productIds) {
      obj.productIds = message.productIds.map((e) => e);
    } else {
      obj.productIds = [];
    }
    message.getAttributes !== undefined && (obj.getAttributes = message.getAttributes);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductsRequest>, I>>(base?: I): GetProductsRequest {
    return GetProductsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductsRequest>, I>>(object: I): GetProductsRequest {
    const message = createBaseGetProductsRequest();
    message.productIds = object.productIds?.map((e) => e) || [];
    message.getAttributes = object.getAttributes ?? undefined;
    return message;
  },
};

function createBaseGetProductForCommissionRequest(): GetProductForCommissionRequest {
  return { productId: "", promoCodeId: "" };
}

export const GetProductForCommissionRequest = {
  encode(message: GetProductForCommissionRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.promoCodeId !== "") {
      writer.uint32(18).string(message.promoCodeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductForCommissionRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductForCommissionRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.promoCodeId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductForCommissionRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      promoCodeId: isSet(object.promoCodeId) ? String(object.promoCodeId) : "",
    };
  },

  toJSON(message: GetProductForCommissionRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.promoCodeId !== undefined && (obj.promoCodeId = message.promoCodeId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductForCommissionRequest>, I>>(base?: I): GetProductForCommissionRequest {
    return GetProductForCommissionRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductForCommissionRequest>, I>>(
    object: I,
  ): GetProductForCommissionRequest {
    const message = createBaseGetProductForCommissionRequest();
    message.productId = object.productId ?? "";
    message.promoCodeId = object.promoCodeId ?? "";
    return message;
  },
};

function createBasePromoCode(): PromoCode {
  return { promoLimit: 0, type: "", generator: "", discount: 0, percentage: 0 };
}

export const PromoCode = {
  encode(message: PromoCode, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.promoLimit !== 0) {
      writer.uint32(8).int32(message.promoLimit);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.generator !== "") {
      writer.uint32(26).string(message.generator);
    }
    if (message.discount !== 0) {
      writer.uint32(32).int32(message.discount);
    }
    if (message.percentage !== 0) {
      writer.uint32(40).int32(message.percentage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PromoCode {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePromoCode();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.promoLimit = reader.int32();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.generator = reader.string();
          break;
        case 4:
          message.discount = reader.int32();
          break;
        case 5:
          message.percentage = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PromoCode {
    return {
      promoLimit: isSet(object.promoLimit) ? Number(object.promoLimit) : 0,
      type: isSet(object.type) ? String(object.type) : "",
      generator: isSet(object.generator) ? String(object.generator) : "",
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      percentage: isSet(object.percentage) ? Number(object.percentage) : 0,
    };
  },

  toJSON(message: PromoCode): unknown {
    const obj: any = {};
    message.promoLimit !== undefined && (obj.promoLimit = Math.round(message.promoLimit));
    message.type !== undefined && (obj.type = message.type);
    message.generator !== undefined && (obj.generator = message.generator);
    message.discount !== undefined && (obj.discount = Math.round(message.discount));
    message.percentage !== undefined && (obj.percentage = Math.round(message.percentage));
    return obj;
  },

  create<I extends Exact<DeepPartial<PromoCode>, I>>(base?: I): PromoCode {
    return PromoCode.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PromoCode>, I>>(object: I): PromoCode {
    const message = createBasePromoCode();
    message.promoLimit = object.promoLimit ?? 0;
    message.type = object.type ?? "";
    message.generator = object.generator ?? "";
    message.discount = object.discount ?? 0;
    message.percentage = object.percentage ?? 0;
    return message;
  },
};

function createBaseProduct(): Product {
  return { id: "", sellPrice: 0, priceQuality: "", source: "" };
}

export const Product = {
  encode(message: Product, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(16).int32(message.sellPrice);
    }
    if (message.priceQuality !== "") {
      writer.uint32(26).string(message.priceQuality);
    }
    if (message.source !== "") {
      writer.uint32(34).string(message.source);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.sellPrice = reader.int32();
          break;
        case 3:
          message.priceQuality = reader.string();
          break;
        case 4:
          message.source = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Product {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      priceQuality: isSet(object.priceQuality) ? String(object.priceQuality) : "",
      source: isSet(object.source) ? String(object.source) : "",
    };
  },

  toJSON(message: Product): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.sellPrice !== undefined && (obj.sellPrice = Math.round(message.sellPrice));
    message.priceQuality !== undefined && (obj.priceQuality = message.priceQuality);
    message.source !== undefined && (obj.source = message.source);
    return obj;
  },

  create<I extends Exact<DeepPartial<Product>, I>>(base?: I): Product {
    return Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Product>, I>>(object: I): Product {
    const message = createBaseProduct();
    message.id = object.id ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    message.priceQuality = object.priceQuality ?? "";
    message.source = object.source ?? "";
    return message;
  },
};

function createBaseGetProductForCommissionResponse(): GetProductForCommissionResponse {
  return { product: undefined, userType: "", priceQuality: "", calculationSettings: undefined, promoCode: undefined };
}

export const GetProductForCommissionResponse = {
  encode(message: GetProductForCommissionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.product !== undefined) {
      Product.encode(message.product, writer.uint32(10).fork()).ldelim();
    }
    if (message.userType !== "") {
      writer.uint32(18).string(message.userType);
    }
    if (message.priceQuality !== "") {
      writer.uint32(26).string(message.priceQuality);
    }
    if (message.calculationSettings !== undefined) {
      CalculationSettings.encode(message.calculationSettings, writer.uint32(34).fork()).ldelim();
    }
    if (message.promoCode !== undefined) {
      PromoCode.encode(message.promoCode, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductForCommissionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductForCommissionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.product = Product.decode(reader, reader.uint32());
          break;
        case 2:
          message.userType = reader.string();
          break;
        case 3:
          message.priceQuality = reader.string();
          break;
        case 4:
          message.calculationSettings = CalculationSettings.decode(reader, reader.uint32());
          break;
        case 5:
          message.promoCode = PromoCode.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductForCommissionResponse {
    return {
      product: isSet(object.product) ? Product.fromJSON(object.product) : undefined,
      userType: isSet(object.userType) ? String(object.userType) : "",
      priceQuality: isSet(object.priceQuality) ? String(object.priceQuality) : "",
      calculationSettings: isSet(object.calculationSettings)
        ? CalculationSettings.fromJSON(object.calculationSettings)
        : undefined,
      promoCode: isSet(object.promoCode) ? PromoCode.fromJSON(object.promoCode) : undefined,
    };
  },

  toJSON(message: GetProductForCommissionResponse): unknown {
    const obj: any = {};
    message.product !== undefined && (obj.product = message.product ? Product.toJSON(message.product) : undefined);
    message.userType !== undefined && (obj.userType = message.userType);
    message.priceQuality !== undefined && (obj.priceQuality = message.priceQuality);
    message.calculationSettings !== undefined && (obj.calculationSettings = message.calculationSettings
      ? CalculationSettings.toJSON(message.calculationSettings)
      : undefined);
    message.promoCode !== undefined &&
      (obj.promoCode = message.promoCode ? PromoCode.toJSON(message.promoCode) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductForCommissionResponse>, I>>(base?: I): GetProductForCommissionResponse {
    return GetProductForCommissionResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductForCommissionResponse>, I>>(
    object: I,
  ): GetProductForCommissionResponse {
    const message = createBaseGetProductForCommissionResponse();
    message.product = (object.product !== undefined && object.product !== null)
      ? Product.fromPartial(object.product)
      : undefined;
    message.userType = object.userType ?? "";
    message.priceQuality = object.priceQuality ?? "";
    message.calculationSettings = (object.calculationSettings !== undefined && object.calculationSettings !== null)
      ? CalculationSettings.fromPartial(object.calculationSettings)
      : undefined;
    message.promoCode = (object.promoCode !== undefined && object.promoCode !== null)
      ? PromoCode.fromPartial(object.promoCode)
      : undefined;
    return message;
  },
};

function createBaseGetProductsResponse(): GetProductsResponse {
  return { products: [] };
}

export const GetProductsResponse = {
  encode(message: GetProductsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.products) {
      GetProductsResponse_Product.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.products.push(GetProductsResponse_Product.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductsResponse {
    return {
      products: Array.isArray(object?.products)
        ? object.products.map((e: any) => GetProductsResponse_Product.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetProductsResponse): unknown {
    const obj: any = {};
    if (message.products) {
      obj.products = message.products.map((e) => e ? GetProductsResponse_Product.toJSON(e) : undefined);
    } else {
      obj.products = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductsResponse>, I>>(base?: I): GetProductsResponse {
    return GetProductsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductsResponse>, I>>(object: I): GetProductsResponse {
    const message = createBaseGetProductsResponse();
    message.products = object.products?.map((e) => GetProductsResponse_Product.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetProductsResponse_Product(): GetProductsResponse_Product {
  return {
    productId: "",
    sellerId: "",
    productName: "",
    startBid: 0,
    sellerName: "",
    productNameAr: "",
    commission: 0,
    shipping: 0,
    availablePayment: "",
    isExpired: false,
    vat: 0,
    productImg: "",
    isDeleted: false,
    isSold: false,
    sellPrice: 0,
    sellerCity: "",
    vatPercentage: 0,
    sellDate: undefined,
    attributes: [],
  };
}

export const GetProductsResponse_Product = {
  encode(message: GetProductsResponse_Product, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.sellerId !== "") {
      writer.uint32(18).string(message.sellerId);
    }
    if (message.productName !== "") {
      writer.uint32(26).string(message.productName);
    }
    if (message.startBid !== 0) {
      writer.uint32(33).double(message.startBid);
    }
    if (message.sellerName !== "") {
      writer.uint32(42).string(message.sellerName);
    }
    if (message.productNameAr !== "") {
      writer.uint32(50).string(message.productNameAr);
    }
    if (message.commission !== 0) {
      writer.uint32(61).float(message.commission);
    }
    if (message.shipping !== 0) {
      writer.uint32(69).float(message.shipping);
    }
    if (message.availablePayment !== "") {
      writer.uint32(74).string(message.availablePayment);
    }
    if (message.isExpired === true) {
      writer.uint32(80).bool(message.isExpired);
    }
    if (message.vat !== 0) {
      writer.uint32(93).float(message.vat);
    }
    if (message.productImg !== "") {
      writer.uint32(98).string(message.productImg);
    }
    if (message.isDeleted === true) {
      writer.uint32(104).bool(message.isDeleted);
    }
    if (message.isSold === true) {
      writer.uint32(112).bool(message.isSold);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(125).float(message.sellPrice);
    }
    if (message.sellerCity !== "") {
      writer.uint32(130).string(message.sellerCity);
    }
    if (message.vatPercentage !== 0) {
      writer.uint32(141).float(message.vatPercentage);
    }
    if (message.sellDate !== undefined) {
      writer.uint32(146).string(message.sellDate);
    }
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(154).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductsResponse_Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductsResponse_Product();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.sellerId = reader.string();
          break;
        case 3:
          message.productName = reader.string();
          break;
        case 4:
          message.startBid = reader.double();
          break;
        case 5:
          message.sellerName = reader.string();
          break;
        case 6:
          message.productNameAr = reader.string();
          break;
        case 7:
          message.commission = reader.float();
          break;
        case 8:
          message.shipping = reader.float();
          break;
        case 9:
          message.availablePayment = reader.string();
          break;
        case 10:
          message.isExpired = reader.bool();
          break;
        case 11:
          message.vat = reader.float();
          break;
        case 12:
          message.productImg = reader.string();
          break;
        case 13:
          message.isDeleted = reader.bool();
          break;
        case 14:
          message.isSold = reader.bool();
          break;
        case 15:
          message.sellPrice = reader.float();
          break;
        case 16:
          message.sellerCity = reader.string();
          break;
        case 17:
          message.vatPercentage = reader.float();
          break;
        case 18:
          message.sellDate = reader.string();
          break;
        case 19:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductsResponse_Product {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
      productName: isSet(object.productName) ? String(object.productName) : "",
      startBid: isSet(object.startBid) ? Number(object.startBid) : 0,
      sellerName: isSet(object.sellerName) ? String(object.sellerName) : "",
      productNameAr: isSet(object.productNameAr) ? String(object.productNameAr) : "",
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      shipping: isSet(object.shipping) ? Number(object.shipping) : 0,
      availablePayment: isSet(object.availablePayment) ? String(object.availablePayment) : "",
      isExpired: isSet(object.isExpired) ? Boolean(object.isExpired) : false,
      vat: isSet(object.vat) ? Number(object.vat) : 0,
      productImg: isSet(object.productImg) ? String(object.productImg) : "",
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
      isSold: isSet(object.isSold) ? Boolean(object.isSold) : false,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      sellerCity: isSet(object.sellerCity) ? String(object.sellerCity) : "",
      vatPercentage: isSet(object.vatPercentage) ? Number(object.vatPercentage) : 0,
      sellDate: isSet(object.sellDate) ? String(object.sellDate) : undefined,
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetProductsResponse_Product): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    message.productName !== undefined && (obj.productName = message.productName);
    message.startBid !== undefined && (obj.startBid = message.startBid);
    message.sellerName !== undefined && (obj.sellerName = message.sellerName);
    message.productNameAr !== undefined && (obj.productNameAr = message.productNameAr);
    message.commission !== undefined && (obj.commission = message.commission);
    message.shipping !== undefined && (obj.shipping = message.shipping);
    message.availablePayment !== undefined && (obj.availablePayment = message.availablePayment);
    message.isExpired !== undefined && (obj.isExpired = message.isExpired);
    message.vat !== undefined && (obj.vat = message.vat);
    message.productImg !== undefined && (obj.productImg = message.productImg);
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    message.isSold !== undefined && (obj.isSold = message.isSold);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.sellerCity !== undefined && (obj.sellerCity = message.sellerCity);
    message.vatPercentage !== undefined && (obj.vatPercentage = message.vatPercentage);
    message.sellDate !== undefined && (obj.sellDate = message.sellDate);
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductsResponse_Product>, I>>(base?: I): GetProductsResponse_Product {
    return GetProductsResponse_Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductsResponse_Product>, I>>(object: I): GetProductsResponse_Product {
    const message = createBaseGetProductsResponse_Product();
    message.productId = object.productId ?? "";
    message.sellerId = object.sellerId ?? "";
    message.productName = object.productName ?? "";
    message.startBid = object.startBid ?? 0;
    message.sellerName = object.sellerName ?? "";
    message.productNameAr = object.productNameAr ?? "";
    message.commission = object.commission ?? 0;
    message.shipping = object.shipping ?? 0;
    message.availablePayment = object.availablePayment ?? "";
    message.isExpired = object.isExpired ?? false;
    message.vat = object.vat ?? 0;
    message.productImg = object.productImg ?? "";
    message.isDeleted = object.isDeleted ?? false;
    message.isSold = object.isSold ?? false;
    message.sellPrice = object.sellPrice ?? 0;
    message.sellerCity = object.sellerCity ?? "";
    message.vatPercentage = object.vatPercentage ?? 0;
    message.sellDate = object.sellDate ?? undefined;
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCalculationSettings(): CalculationSettings {
  return {
    vatPercentage: 0,
    applyDeliveryFeeSPPs: false,
    applyDeliveryFeeMPPs: false,
    applyDeliveryFee: false,
    deliveryFeeThreshold: 0,
    deliveryFee: 0,
    referralFixedAmount: 0,
    buyerCommissionPercentage: 0,
    sellerCommissionPercentage: 0,
    priceQualityExtraCommission: 0,
  };
}

export const CalculationSettings = {
  encode(message: CalculationSettings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.vatPercentage !== 0) {
      writer.uint32(8).int32(message.vatPercentage);
    }
    if (message.applyDeliveryFeeSPPs === true) {
      writer.uint32(16).bool(message.applyDeliveryFeeSPPs);
    }
    if (message.applyDeliveryFeeMPPs === true) {
      writer.uint32(24).bool(message.applyDeliveryFeeMPPs);
    }
    if (message.applyDeliveryFee === true) {
      writer.uint32(32).bool(message.applyDeliveryFee);
    }
    if (message.deliveryFeeThreshold !== 0) {
      writer.uint32(40).int32(message.deliveryFeeThreshold);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(48).int32(message.deliveryFee);
    }
    if (message.referralFixedAmount !== 0) {
      writer.uint32(56).int32(message.referralFixedAmount);
    }
    if (message.buyerCommissionPercentage !== 0) {
      writer.uint32(64).int32(message.buyerCommissionPercentage);
    }
    if (message.sellerCommissionPercentage !== 0) {
      writer.uint32(72).int32(message.sellerCommissionPercentage);
    }
    if (message.priceQualityExtraCommission !== 0) {
      writer.uint32(80).int32(message.priceQualityExtraCommission);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CalculationSettings {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCalculationSettings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.vatPercentage = reader.int32();
          break;
        case 2:
          message.applyDeliveryFeeSPPs = reader.bool();
          break;
        case 3:
          message.applyDeliveryFeeMPPs = reader.bool();
          break;
        case 4:
          message.applyDeliveryFee = reader.bool();
          break;
        case 5:
          message.deliveryFeeThreshold = reader.int32();
          break;
        case 6:
          message.deliveryFee = reader.int32();
          break;
        case 7:
          message.referralFixedAmount = reader.int32();
          break;
        case 8:
          message.buyerCommissionPercentage = reader.int32();
          break;
        case 9:
          message.sellerCommissionPercentage = reader.int32();
          break;
        case 10:
          message.priceQualityExtraCommission = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CalculationSettings {
    return {
      vatPercentage: isSet(object.vatPercentage) ? Number(object.vatPercentage) : 0,
      applyDeliveryFeeSPPs: isSet(object.applyDeliveryFeeSPPs) ? Boolean(object.applyDeliveryFeeSPPs) : false,
      applyDeliveryFeeMPPs: isSet(object.applyDeliveryFeeMPPs) ? Boolean(object.applyDeliveryFeeMPPs) : false,
      applyDeliveryFee: isSet(object.applyDeliveryFee) ? Boolean(object.applyDeliveryFee) : false,
      deliveryFeeThreshold: isSet(object.deliveryFeeThreshold) ? Number(object.deliveryFeeThreshold) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      referralFixedAmount: isSet(object.referralFixedAmount) ? Number(object.referralFixedAmount) : 0,
      buyerCommissionPercentage: isSet(object.buyerCommissionPercentage) ? Number(object.buyerCommissionPercentage) : 0,
      sellerCommissionPercentage: isSet(object.sellerCommissionPercentage)
        ? Number(object.sellerCommissionPercentage)
        : 0,
      priceQualityExtraCommission: isSet(object.priceQualityExtraCommission)
        ? Number(object.priceQualityExtraCommission)
        : 0,
    };
  },

  toJSON(message: CalculationSettings): unknown {
    const obj: any = {};
    message.vatPercentage !== undefined && (obj.vatPercentage = Math.round(message.vatPercentage));
    message.applyDeliveryFeeSPPs !== undefined && (obj.applyDeliveryFeeSPPs = message.applyDeliveryFeeSPPs);
    message.applyDeliveryFeeMPPs !== undefined && (obj.applyDeliveryFeeMPPs = message.applyDeliveryFeeMPPs);
    message.applyDeliveryFee !== undefined && (obj.applyDeliveryFee = message.applyDeliveryFee);
    message.deliveryFeeThreshold !== undefined && (obj.deliveryFeeThreshold = Math.round(message.deliveryFeeThreshold));
    message.deliveryFee !== undefined && (obj.deliveryFee = Math.round(message.deliveryFee));
    message.referralFixedAmount !== undefined && (obj.referralFixedAmount = Math.round(message.referralFixedAmount));
    message.buyerCommissionPercentage !== undefined &&
      (obj.buyerCommissionPercentage = Math.round(message.buyerCommissionPercentage));
    message.sellerCommissionPercentage !== undefined &&
      (obj.sellerCommissionPercentage = Math.round(message.sellerCommissionPercentage));
    message.priceQualityExtraCommission !== undefined &&
      (obj.priceQualityExtraCommission = Math.round(message.priceQualityExtraCommission));
    return obj;
  },

  create<I extends Exact<DeepPartial<CalculationSettings>, I>>(base?: I): CalculationSettings {
    return CalculationSettings.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CalculationSettings>, I>>(object: I): CalculationSettings {
    const message = createBaseCalculationSettings();
    message.vatPercentage = object.vatPercentage ?? 0;
    message.applyDeliveryFeeSPPs = object.applyDeliveryFeeSPPs ?? false;
    message.applyDeliveryFeeMPPs = object.applyDeliveryFeeMPPs ?? false;
    message.applyDeliveryFee = object.applyDeliveryFee ?? false;
    message.deliveryFeeThreshold = object.deliveryFeeThreshold ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.referralFixedAmount = object.referralFixedAmount ?? 0;
    message.buyerCommissionPercentage = object.buyerCommissionPercentage ?? 0;
    message.sellerCommissionPercentage = object.sellerCommissionPercentage ?? 0;
    message.priceQualityExtraCommission = object.priceQualityExtraCommission ?? 0;
    return message;
  },
};

function createBaseGetMarketPriceByVariantIdRequest(): GetMarketPriceByVariantIdRequest {
  return { variantId: "", grade: "" };
}

export const GetMarketPriceByVariantIdRequest = {
  encode(message: GetMarketPriceByVariantIdRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.variantId !== "") {
      writer.uint32(10).string(message.variantId);
    }
    if (message.grade !== "") {
      writer.uint32(18).string(message.grade);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMarketPriceByVariantIdRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMarketPriceByVariantIdRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.variantId = reader.string();
          break;
        case 2:
          message.grade = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetMarketPriceByVariantIdRequest {
    return {
      variantId: isSet(object.variantId) ? String(object.variantId) : "",
      grade: isSet(object.grade) ? String(object.grade) : "",
    };
  },

  toJSON(message: GetMarketPriceByVariantIdRequest): unknown {
    const obj: any = {};
    message.variantId !== undefined && (obj.variantId = message.variantId);
    message.grade !== undefined && (obj.grade = message.grade);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetMarketPriceByVariantIdRequest>, I>>(
    base?: I,
  ): GetMarketPriceByVariantIdRequest {
    return GetMarketPriceByVariantIdRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetMarketPriceByVariantIdRequest>, I>>(
    object: I,
  ): GetMarketPriceByVariantIdRequest {
    const message = createBaseGetMarketPriceByVariantIdRequest();
    message.variantId = object.variantId ?? "";
    message.grade = object.grade ?? "";
    return message;
  },
};

function createBaseGetMarketPriceByVariantIdResponse(): GetMarketPriceByVariantIdResponse {
  return { minPrice: 0, maxPrice: 0 };
}

export const GetMarketPriceByVariantIdResponse = {
  encode(message: GetMarketPriceByVariantIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.minPrice !== 0) {
      writer.uint32(9).double(message.minPrice);
    }
    if (message.maxPrice !== 0) {
      writer.uint32(17).double(message.maxPrice);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetMarketPriceByVariantIdResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetMarketPriceByVariantIdResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.minPrice = reader.double();
          break;
        case 2:
          message.maxPrice = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetMarketPriceByVariantIdResponse {
    return {
      minPrice: isSet(object.minPrice) ? Number(object.minPrice) : 0,
      maxPrice: isSet(object.maxPrice) ? Number(object.maxPrice) : 0,
    };
  },

  toJSON(message: GetMarketPriceByVariantIdResponse): unknown {
    const obj: any = {};
    message.minPrice !== undefined && (obj.minPrice = message.minPrice);
    message.maxPrice !== undefined && (obj.maxPrice = message.maxPrice);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetMarketPriceByVariantIdResponse>, I>>(
    base?: I,
  ): GetMarketPriceByVariantIdResponse {
    return GetMarketPriceByVariantIdResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetMarketPriceByVariantIdResponse>, I>>(
    object: I,
  ): GetMarketPriceByVariantIdResponse {
    const message = createBaseGetMarketPriceByVariantIdResponse();
    message.minPrice = object.minPrice ?? 0;
    message.maxPrice = object.maxPrice ?? 0;
    return message;
  },
};

function createBaseCreateOrderRequest(): CreateOrderRequest {
  return { productId: "", paymentOptionId: "", userId: "", amount: 0, soumTransactionNumber: "", clientType: "" };
}

export const CreateOrderRequest = {
  encode(message: CreateOrderRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.paymentOptionId !== "") {
      writer.uint32(18).string(message.paymentOptionId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.amount !== 0) {
      writer.uint32(37).float(message.amount);
    }
    if (message.soumTransactionNumber !== "") {
      writer.uint32(42).string(message.soumTransactionNumber);
    }
    if (message.clientType !== "") {
      writer.uint32(50).string(message.clientType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateOrderRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateOrderRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.paymentOptionId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.amount = reader.float();
          break;
        case 5:
          message.soumTransactionNumber = reader.string();
          break;
        case 6:
          message.clientType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOrderRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      paymentOptionId: isSet(object.paymentOptionId) ? String(object.paymentOptionId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      clientType: isSet(object.clientType) ? String(object.clientType) : "",
    };
  },

  toJSON(message: CreateOrderRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.paymentOptionId !== undefined && (obj.paymentOptionId = message.paymentOptionId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.amount !== undefined && (obj.amount = message.amount);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.clientType !== undefined && (obj.clientType = message.clientType);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateOrderRequest>, I>>(base?: I): CreateOrderRequest {
    return CreateOrderRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateOrderRequest>, I>>(object: I): CreateOrderRequest {
    const message = createBaseCreateOrderRequest();
    message.productId = object.productId ?? "";
    message.paymentOptionId = object.paymentOptionId ?? "";
    message.userId = object.userId ?? "";
    message.amount = object.amount ?? 0;
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.clientType = object.clientType ?? "";
    return message;
  },
};

function createBaseCreateOrderResponse(): CreateOrderResponse {
  return { orderId: "", dmOrderId: "" };
}

export const CreateOrderResponse = {
  encode(message: CreateOrderResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    if (message.dmOrderId !== "") {
      writer.uint32(18).string(message.dmOrderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateOrderResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateOrderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        case 2:
          message.dmOrderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateOrderResponse {
    return {
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      dmOrderId: isSet(object.dmOrderId) ? String(object.dmOrderId) : "",
    };
  },

  toJSON(message: CreateOrderResponse): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.dmOrderId !== undefined && (obj.dmOrderId = message.dmOrderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateOrderResponse>, I>>(base?: I): CreateOrderResponse {
    return CreateOrderResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateOrderResponse>, I>>(object: I): CreateOrderResponse {
    const message = createBaseCreateOrderResponse();
    message.orderId = object.orderId ?? "";
    message.dmOrderId = object.dmOrderId ?? "";
    return message;
  },
};

function createBaseGetProductStatusesRequest(): GetProductStatusesRequest {
  return { productId: "" };
}

export const GetProductStatusesRequest = {
  encode(message: GetProductStatusesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductStatusesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductStatusesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductStatusesRequest {
    return { productId: isSet(object.productId) ? String(object.productId) : "" };
  },

  toJSON(message: GetProductStatusesRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductStatusesRequest>, I>>(base?: I): GetProductStatusesRequest {
    return GetProductStatusesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductStatusesRequest>, I>>(object: I): GetProductStatusesRequest {
    const message = createBaseGetProductStatusesRequest();
    message.productId = object.productId ?? "";
    return message;
  },
};

function createBaseGetProductStatusesResponse(): GetProductStatusesResponse {
  return { deleted: false, expired: false, sold: false };
}

export const GetProductStatusesResponse = {
  encode(message: GetProductStatusesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.deleted === true) {
      writer.uint32(8).bool(message.deleted);
    }
    if (message.expired === true) {
      writer.uint32(16).bool(message.expired);
    }
    if (message.sold === true) {
      writer.uint32(24).bool(message.sold);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductStatusesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductStatusesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deleted = reader.bool();
          break;
        case 2:
          message.expired = reader.bool();
          break;
        case 3:
          message.sold = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductStatusesResponse {
    return {
      deleted: isSet(object.deleted) ? Boolean(object.deleted) : false,
      expired: isSet(object.expired) ? Boolean(object.expired) : false,
      sold: isSet(object.sold) ? Boolean(object.sold) : false,
    };
  },

  toJSON(message: GetProductStatusesResponse): unknown {
    const obj: any = {};
    message.deleted !== undefined && (obj.deleted = message.deleted);
    message.expired !== undefined && (obj.expired = message.expired);
    message.sold !== undefined && (obj.sold = message.sold);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductStatusesResponse>, I>>(base?: I): GetProductStatusesResponse {
    return GetProductStatusesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductStatusesResponse>, I>>(object: I): GetProductStatusesResponse {
    const message = createBaseGetProductStatusesResponse();
    message.deleted = object.deleted ?? false;
    message.expired = object.expired ?? false;
    message.sold = object.sold ?? false;
    return message;
  },
};

function createBaseUpdateLogisticServiceRequest(): UpdateLogisticServiceRequest {
  return { serviceId: "", vendorId: "", dmoId: "", serviceName: "" };
}

export const UpdateLogisticServiceRequest = {
  encode(message: UpdateLogisticServiceRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.serviceId !== "") {
      writer.uint32(10).string(message.serviceId);
    }
    if (message.vendorId !== "") {
      writer.uint32(18).string(message.vendorId);
    }
    if (message.dmoId !== "") {
      writer.uint32(26).string(message.dmoId);
    }
    if (message.serviceName !== "") {
      writer.uint32(34).string(message.serviceName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateLogisticServiceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateLogisticServiceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.serviceId = reader.string();
          break;
        case 2:
          message.vendorId = reader.string();
          break;
        case 3:
          message.dmoId = reader.string();
          break;
        case 4:
          message.serviceName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateLogisticServiceRequest {
    return {
      serviceId: isSet(object.serviceId) ? String(object.serviceId) : "",
      vendorId: isSet(object.vendorId) ? String(object.vendorId) : "",
      dmoId: isSet(object.dmoId) ? String(object.dmoId) : "",
      serviceName: isSet(object.serviceName) ? String(object.serviceName) : "",
    };
  },

  toJSON(message: UpdateLogisticServiceRequest): unknown {
    const obj: any = {};
    message.serviceId !== undefined && (obj.serviceId = message.serviceId);
    message.vendorId !== undefined && (obj.vendorId = message.vendorId);
    message.dmoId !== undefined && (obj.dmoId = message.dmoId);
    message.serviceName !== undefined && (obj.serviceName = message.serviceName);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateLogisticServiceRequest>, I>>(base?: I): UpdateLogisticServiceRequest {
    return UpdateLogisticServiceRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateLogisticServiceRequest>, I>>(object: I): UpdateLogisticServiceRequest {
    const message = createBaseUpdateLogisticServiceRequest();
    message.serviceId = object.serviceId ?? "";
    message.vendorId = object.vendorId ?? "";
    message.dmoId = object.dmoId ?? "";
    message.serviceName = object.serviceName ?? "";
    return message;
  },
};

function createBaseUpdateLogisticServiceResponse(): UpdateLogisticServiceResponse {
  return {};
}

export const UpdateLogisticServiceResponse = {
  encode(_: UpdateLogisticServiceResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateLogisticServiceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateLogisticServiceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateLogisticServiceResponse {
    return {};
  },

  toJSON(_: UpdateLogisticServiceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateLogisticServiceResponse>, I>>(base?: I): UpdateLogisticServiceResponse {
    return UpdateLogisticServiceResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateLogisticServiceResponse>, I>>(_: I): UpdateLogisticServiceResponse {
    const message = createBaseUpdateLogisticServiceResponse();
    return message;
  },
};

function createBaseGetBidSummaryRequest(): GetBidSummaryRequest {
  return { productId: "", bidPrice: 0, userId: "", allPayments: false, paymentOptionId: "" };
}

export const GetBidSummaryRequest = {
  encode(message: GetBidSummaryRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.bidPrice !== 0) {
      writer.uint32(17).double(message.bidPrice);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.allPayments === true) {
      writer.uint32(32).bool(message.allPayments);
    }
    if (message.paymentOptionId !== "") {
      writer.uint32(42).string(message.paymentOptionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBidSummaryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBidSummaryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.bidPrice = reader.double();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.allPayments = reader.bool();
          break;
        case 5:
          message.paymentOptionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBidSummaryRequest {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      bidPrice: isSet(object.bidPrice) ? Number(object.bidPrice) : 0,
      userId: isSet(object.userId) ? String(object.userId) : "",
      allPayments: isSet(object.allPayments) ? Boolean(object.allPayments) : false,
      paymentOptionId: isSet(object.paymentOptionId) ? String(object.paymentOptionId) : "",
    };
  },

  toJSON(message: GetBidSummaryRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.bidPrice !== undefined && (obj.bidPrice = message.bidPrice);
    message.userId !== undefined && (obj.userId = message.userId);
    message.allPayments !== undefined && (obj.allPayments = message.allPayments);
    message.paymentOptionId !== undefined && (obj.paymentOptionId = message.paymentOptionId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBidSummaryRequest>, I>>(base?: I): GetBidSummaryRequest {
    return GetBidSummaryRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetBidSummaryRequest>, I>>(object: I): GetBidSummaryRequest {
    const message = createBaseGetBidSummaryRequest();
    message.productId = object.productId ?? "";
    message.bidPrice = object.bidPrice ?? 0;
    message.userId = object.userId ?? "";
    message.allPayments = object.allPayments ?? false;
    message.paymentOptionId = object.paymentOptionId ?? "";
    return message;
  },
};

function createBaseBidProduct(): BidProduct {
  return {
    productId: "",
    sellerId: "",
    productName: "",
    startBid: 0,
    sellerName: "",
    productNameAr: "",
    isExpired: false,
    productImg: "",
    isDeleted: false,
    isSold: false,
  };
}

export const BidProduct = {
  encode(message: BidProduct, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.sellerId !== "") {
      writer.uint32(18).string(message.sellerId);
    }
    if (message.productName !== "") {
      writer.uint32(26).string(message.productName);
    }
    if (message.startBid !== 0) {
      writer.uint32(33).double(message.startBid);
    }
    if (message.sellerName !== "") {
      writer.uint32(42).string(message.sellerName);
    }
    if (message.productNameAr !== "") {
      writer.uint32(50).string(message.productNameAr);
    }
    if (message.isExpired === true) {
      writer.uint32(56).bool(message.isExpired);
    }
    if (message.productImg !== "") {
      writer.uint32(66).string(message.productImg);
    }
    if (message.isDeleted === true) {
      writer.uint32(72).bool(message.isDeleted);
    }
    if (message.isSold === true) {
      writer.uint32(80).bool(message.isSold);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BidProduct {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBidProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.sellerId = reader.string();
          break;
        case 3:
          message.productName = reader.string();
          break;
        case 4:
          message.startBid = reader.double();
          break;
        case 5:
          message.sellerName = reader.string();
          break;
        case 6:
          message.productNameAr = reader.string();
          break;
        case 7:
          message.isExpired = reader.bool();
          break;
        case 8:
          message.productImg = reader.string();
          break;
        case 9:
          message.isDeleted = reader.bool();
          break;
        case 10:
          message.isSold = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BidProduct {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      sellerId: isSet(object.sellerId) ? String(object.sellerId) : "",
      productName: isSet(object.productName) ? String(object.productName) : "",
      startBid: isSet(object.startBid) ? Number(object.startBid) : 0,
      sellerName: isSet(object.sellerName) ? String(object.sellerName) : "",
      productNameAr: isSet(object.productNameAr) ? String(object.productNameAr) : "",
      isExpired: isSet(object.isExpired) ? Boolean(object.isExpired) : false,
      productImg: isSet(object.productImg) ? String(object.productImg) : "",
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
      isSold: isSet(object.isSold) ? Boolean(object.isSold) : false,
    };
  },

  toJSON(message: BidProduct): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    message.productName !== undefined && (obj.productName = message.productName);
    message.startBid !== undefined && (obj.startBid = message.startBid);
    message.sellerName !== undefined && (obj.sellerName = message.sellerName);
    message.productNameAr !== undefined && (obj.productNameAr = message.productNameAr);
    message.isExpired !== undefined && (obj.isExpired = message.isExpired);
    message.productImg !== undefined && (obj.productImg = message.productImg);
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    message.isSold !== undefined && (obj.isSold = message.isSold);
    return obj;
  },

  create<I extends Exact<DeepPartial<BidProduct>, I>>(base?: I): BidProduct {
    return BidProduct.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BidProduct>, I>>(object: I): BidProduct {
    const message = createBaseBidProduct();
    message.productId = object.productId ?? "";
    message.sellerId = object.sellerId ?? "";
    message.productName = object.productName ?? "";
    message.startBid = object.startBid ?? 0;
    message.sellerName = object.sellerName ?? "";
    message.productNameAr = object.productNameAr ?? "";
    message.isExpired = object.isExpired ?? false;
    message.productImg = object.productImg ?? "";
    message.isDeleted = object.isDeleted ?? false;
    message.isSold = object.isSold ?? false;
    return message;
  },
};

function createBaseGetBidSummaryResponse(): GetBidSummaryResponse {
  return { product: undefined, commissionSummaries: [] };
}

export const GetBidSummaryResponse = {
  encode(message: GetBidSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.product !== undefined) {
      BidProduct.encode(message.product, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.commissionSummaries) {
      BreakDownResponse.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBidSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBidSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.product = BidProduct.decode(reader, reader.uint32());
          break;
        case 2:
          message.commissionSummaries.push(BreakDownResponse.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBidSummaryResponse {
    return {
      product: isSet(object.product) ? BidProduct.fromJSON(object.product) : undefined,
      commissionSummaries: Array.isArray(object?.commissionSummaries)
        ? object.commissionSummaries.map((e: any) => BreakDownResponse.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetBidSummaryResponse): unknown {
    const obj: any = {};
    message.product !== undefined && (obj.product = message.product ? BidProduct.toJSON(message.product) : undefined);
    if (message.commissionSummaries) {
      obj.commissionSummaries = message.commissionSummaries.map((e) => e ? BreakDownResponse.toJSON(e) : undefined);
    } else {
      obj.commissionSummaries = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBidSummaryResponse>, I>>(base?: I): GetBidSummaryResponse {
    return GetBidSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetBidSummaryResponse>, I>>(object: I): GetBidSummaryResponse {
    const message = createBaseGetBidSummaryResponse();
    message.product = (object.product !== undefined && object.product !== null)
      ? BidProduct.fromPartial(object.product)
      : undefined;
    message.commissionSummaries = object.commissionSummaries?.map((e) => BreakDownResponse.fromPartial(e)) || [];
    return message;
  },
};

function createBaseBreakDownResponse(): BreakDownResponse {
  return { withPromo: undefined, withoutPromo: undefined };
}

export const BreakDownResponse = {
  encode(message: BreakDownResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.withPromo !== undefined) {
      CommissionSummaryResponse.encode(message.withPromo, writer.uint32(10).fork()).ldelim();
    }
    if (message.withoutPromo !== undefined) {
      CommissionSummaryResponse.encode(message.withoutPromo, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): BreakDownResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBreakDownResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.withPromo = CommissionSummaryResponse.decode(reader, reader.uint32());
          break;
        case 2:
          message.withoutPromo = CommissionSummaryResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): BreakDownResponse {
    return {
      withPromo: isSet(object.withPromo) ? CommissionSummaryResponse.fromJSON(object.withPromo) : undefined,
      withoutPromo: isSet(object.withoutPromo) ? CommissionSummaryResponse.fromJSON(object.withoutPromo) : undefined,
    };
  },

  toJSON(message: BreakDownResponse): unknown {
    const obj: any = {};
    message.withPromo !== undefined &&
      (obj.withPromo = message.withPromo ? CommissionSummaryResponse.toJSON(message.withPromo) : undefined);
    message.withoutPromo !== undefined &&
      (obj.withoutPromo = message.withoutPromo ? CommissionSummaryResponse.toJSON(message.withoutPromo) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<BreakDownResponse>, I>>(base?: I): BreakDownResponse {
    return BreakDownResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<BreakDownResponse>, I>>(object: I): BreakDownResponse {
    const message = createBaseBreakDownResponse();
    message.withPromo = (object.withPromo !== undefined && object.withPromo !== null)
      ? CommissionSummaryResponse.fromPartial(object.withPromo)
      : undefined;
    message.withoutPromo = (object.withoutPromo !== undefined && object.withoutPromo !== null)
      ? CommissionSummaryResponse.fromPartial(object.withoutPromo)
      : undefined;
    return message;
  },
};

function createBaseCommissionAnalysis(): CommissionAnalysis {
  return {
    commissionTotalPercentage: 0,
    commissionTotalFixed: 0,
    paymentCommissionExtraFees: 0,
    paymentCommission: 0,
    paymentCommissionVat: 0,
    nonPaymentCommission: 0,
    nonPaymentCommissionVat: 0,
    paymentCommissionWithVat: 0,
    nonPaymentCommissionWithVat: 0,
  };
}

export const CommissionAnalysis = {
  encode(message: CommissionAnalysis, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.commissionTotalPercentage !== 0) {
      writer.uint32(9).double(message.commissionTotalPercentage);
    }
    if (message.commissionTotalFixed !== 0) {
      writer.uint32(17).double(message.commissionTotalFixed);
    }
    if (message.paymentCommissionExtraFees !== 0) {
      writer.uint32(25).double(message.paymentCommissionExtraFees);
    }
    if (message.paymentCommission !== 0) {
      writer.uint32(33).double(message.paymentCommission);
    }
    if (message.paymentCommissionVat !== 0) {
      writer.uint32(41).double(message.paymentCommissionVat);
    }
    if (message.nonPaymentCommission !== 0) {
      writer.uint32(49).double(message.nonPaymentCommission);
    }
    if (message.nonPaymentCommissionVat !== 0) {
      writer.uint32(57).double(message.nonPaymentCommissionVat);
    }
    if (message.paymentCommissionWithVat !== 0) {
      writer.uint32(65).double(message.paymentCommissionWithVat);
    }
    if (message.nonPaymentCommissionWithVat !== 0) {
      writer.uint32(73).double(message.nonPaymentCommissionWithVat);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommissionAnalysis {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionAnalysis();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commissionTotalPercentage = reader.double();
          break;
        case 2:
          message.commissionTotalFixed = reader.double();
          break;
        case 3:
          message.paymentCommissionExtraFees = reader.double();
          break;
        case 4:
          message.paymentCommission = reader.double();
          break;
        case 5:
          message.paymentCommissionVat = reader.double();
          break;
        case 6:
          message.nonPaymentCommission = reader.double();
          break;
        case 7:
          message.nonPaymentCommissionVat = reader.double();
          break;
        case 8:
          message.paymentCommissionWithVat = reader.double();
          break;
        case 9:
          message.nonPaymentCommissionWithVat = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommissionAnalysis {
    return {
      commissionTotalPercentage: isSet(object.commissionTotalPercentage) ? Number(object.commissionTotalPercentage) : 0,
      commissionTotalFixed: isSet(object.commissionTotalFixed) ? Number(object.commissionTotalFixed) : 0,
      paymentCommissionExtraFees: isSet(object.paymentCommissionExtraFees)
        ? Number(object.paymentCommissionExtraFees)
        : 0,
      paymentCommission: isSet(object.paymentCommission) ? Number(object.paymentCommission) : 0,
      paymentCommissionVat: isSet(object.paymentCommissionVat) ? Number(object.paymentCommissionVat) : 0,
      nonPaymentCommission: isSet(object.nonPaymentCommission) ? Number(object.nonPaymentCommission) : 0,
      nonPaymentCommissionVat: isSet(object.nonPaymentCommissionVat) ? Number(object.nonPaymentCommissionVat) : 0,
      paymentCommissionWithVat: isSet(object.paymentCommissionWithVat) ? Number(object.paymentCommissionWithVat) : 0,
      nonPaymentCommissionWithVat: isSet(object.nonPaymentCommissionWithVat)
        ? Number(object.nonPaymentCommissionWithVat)
        : 0,
    };
  },

  toJSON(message: CommissionAnalysis): unknown {
    const obj: any = {};
    message.commissionTotalPercentage !== undefined &&
      (obj.commissionTotalPercentage = message.commissionTotalPercentage);
    message.commissionTotalFixed !== undefined && (obj.commissionTotalFixed = message.commissionTotalFixed);
    message.paymentCommissionExtraFees !== undefined &&
      (obj.paymentCommissionExtraFees = message.paymentCommissionExtraFees);
    message.paymentCommission !== undefined && (obj.paymentCommission = message.paymentCommission);
    message.paymentCommissionVat !== undefined && (obj.paymentCommissionVat = message.paymentCommissionVat);
    message.nonPaymentCommission !== undefined && (obj.nonPaymentCommission = message.nonPaymentCommission);
    message.nonPaymentCommissionVat !== undefined && (obj.nonPaymentCommissionVat = message.nonPaymentCommissionVat);
    message.paymentCommissionWithVat !== undefined && (obj.paymentCommissionWithVat = message.paymentCommissionWithVat);
    message.nonPaymentCommissionWithVat !== undefined &&
      (obj.nonPaymentCommissionWithVat = message.nonPaymentCommissionWithVat);
    return obj;
  },

  create<I extends Exact<DeepPartial<CommissionAnalysis>, I>>(base?: I): CommissionAnalysis {
    return CommissionAnalysis.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommissionAnalysis>, I>>(object: I): CommissionAnalysis {
    const message = createBaseCommissionAnalysis();
    message.commissionTotalPercentage = object.commissionTotalPercentage ?? 0;
    message.commissionTotalFixed = object.commissionTotalFixed ?? 0;
    message.paymentCommissionExtraFees = object.paymentCommissionExtraFees ?? 0;
    message.paymentCommission = object.paymentCommission ?? 0;
    message.paymentCommissionVat = object.paymentCommissionVat ?? 0;
    message.nonPaymentCommission = object.nonPaymentCommission ?? 0;
    message.nonPaymentCommissionVat = object.nonPaymentCommissionVat ?? 0;
    message.paymentCommissionWithVat = object.paymentCommissionWithVat ?? 0;
    message.nonPaymentCommissionWithVat = object.nonPaymentCommissionWithVat ?? 0;
    return message;
  },
};

function createBaseCommissionSummaryResponse(): CommissionSummaryResponse {
  return {
    id: "",
    commission: 0,
    commissionVat: 0,
    deliveryFee: 0,
    deliveryFeeVat: 0,
    totalVat: 0,
    discount: 0,
    grandTotal: 0,
    commissionDiscount: 0,
    sellPrice: 0,
    commissionAnalysis: undefined,
    paymentId: "",
  };
}

export const CommissionSummaryResponse = {
  encode(message: CommissionSummaryResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.commission !== 0) {
      writer.uint32(17).double(message.commission);
    }
    if (message.commissionVat !== 0) {
      writer.uint32(25).double(message.commissionVat);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(33).double(message.deliveryFee);
    }
    if (message.deliveryFeeVat !== 0) {
      writer.uint32(41).double(message.deliveryFeeVat);
    }
    if (message.totalVat !== 0) {
      writer.uint32(49).double(message.totalVat);
    }
    if (message.discount !== 0) {
      writer.uint32(57).double(message.discount);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(65).double(message.grandTotal);
    }
    if (message.commissionDiscount !== 0) {
      writer.uint32(73).double(message.commissionDiscount);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(81).double(message.sellPrice);
    }
    if (message.commissionAnalysis !== undefined) {
      CommissionAnalysis.encode(message.commissionAnalysis, writer.uint32(90).fork()).ldelim();
    }
    if (message.paymentId !== "") {
      writer.uint32(98).string(message.paymentId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CommissionSummaryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCommissionSummaryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.commission = reader.double();
          break;
        case 3:
          message.commissionVat = reader.double();
          break;
        case 4:
          message.deliveryFee = reader.double();
          break;
        case 5:
          message.deliveryFeeVat = reader.double();
          break;
        case 6:
          message.totalVat = reader.double();
          break;
        case 7:
          message.discount = reader.double();
          break;
        case 8:
          message.grandTotal = reader.double();
          break;
        case 9:
          message.commissionDiscount = reader.double();
          break;
        case 10:
          message.sellPrice = reader.double();
          break;
        case 11:
          message.commissionAnalysis = CommissionAnalysis.decode(reader, reader.uint32());
          break;
        case 12:
          message.paymentId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CommissionSummaryResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      commissionVat: isSet(object.commissionVat) ? Number(object.commissionVat) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      deliveryFeeVat: isSet(object.deliveryFeeVat) ? Number(object.deliveryFeeVat) : 0,
      totalVat: isSet(object.totalVat) ? Number(object.totalVat) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      commissionDiscount: isSet(object.commissionDiscount) ? Number(object.commissionDiscount) : 0,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      commissionAnalysis: isSet(object.commissionAnalysis)
        ? CommissionAnalysis.fromJSON(object.commissionAnalysis)
        : undefined,
      paymentId: isSet(object.paymentId) ? String(object.paymentId) : "",
    };
  },

  toJSON(message: CommissionSummaryResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.commission !== undefined && (obj.commission = message.commission);
    message.commissionVat !== undefined && (obj.commissionVat = message.commissionVat);
    message.deliveryFee !== undefined && (obj.deliveryFee = message.deliveryFee);
    message.deliveryFeeVat !== undefined && (obj.deliveryFeeVat = message.deliveryFeeVat);
    message.totalVat !== undefined && (obj.totalVat = message.totalVat);
    message.discount !== undefined && (obj.discount = message.discount);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.commissionDiscount !== undefined && (obj.commissionDiscount = message.commissionDiscount);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.commissionAnalysis !== undefined && (obj.commissionAnalysis = message.commissionAnalysis
      ? CommissionAnalysis.toJSON(message.commissionAnalysis)
      : undefined);
    message.paymentId !== undefined && (obj.paymentId = message.paymentId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CommissionSummaryResponse>, I>>(base?: I): CommissionSummaryResponse {
    return CommissionSummaryResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CommissionSummaryResponse>, I>>(object: I): CommissionSummaryResponse {
    const message = createBaseCommissionSummaryResponse();
    message.id = object.id ?? "";
    message.commission = object.commission ?? 0;
    message.commissionVat = object.commissionVat ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.deliveryFeeVat = object.deliveryFeeVat ?? 0;
    message.totalVat = object.totalVat ?? 0;
    message.discount = object.discount ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    message.commissionDiscount = object.commissionDiscount ?? 0;
    message.sellPrice = object.sellPrice ?? 0;
    message.commissionAnalysis = (object.commissionAnalysis !== undefined && object.commissionAnalysis !== null)
      ? CommissionAnalysis.fromPartial(object.commissionAnalysis)
      : undefined;
    message.paymentId = object.paymentId ?? "";
    return message;
  },
};

function createBaseGetViewedProductsRequest(): GetViewedProductsRequest {
  return { productIds: [], shouldSkipExpire: undefined, categoryId: undefined, getSpecificCategory: undefined };
}

export const GetViewedProductsRequest = {
  encode(message: GetViewedProductsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.productIds) {
      writer.uint32(10).string(v!);
    }
    if (message.shouldSkipExpire !== undefined) {
      writer.uint32(16).bool(message.shouldSkipExpire);
    }
    if (message.categoryId !== undefined) {
      writer.uint32(26).string(message.categoryId);
    }
    if (message.getSpecificCategory !== undefined) {
      writer.uint32(32).bool(message.getSpecificCategory);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetViewedProductsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetViewedProductsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productIds.push(reader.string());
          break;
        case 2:
          message.shouldSkipExpire = reader.bool();
          break;
        case 3:
          message.categoryId = reader.string();
          break;
        case 4:
          message.getSpecificCategory = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetViewedProductsRequest {
    return {
      productIds: Array.isArray(object?.productIds) ? object.productIds.map((e: any) => String(e)) : [],
      shouldSkipExpire: isSet(object.shouldSkipExpire) ? Boolean(object.shouldSkipExpire) : undefined,
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : undefined,
      getSpecificCategory: isSet(object.getSpecificCategory) ? Boolean(object.getSpecificCategory) : undefined,
    };
  },

  toJSON(message: GetViewedProductsRequest): unknown {
    const obj: any = {};
    if (message.productIds) {
      obj.productIds = message.productIds.map((e) => e);
    } else {
      obj.productIds = [];
    }
    message.shouldSkipExpire !== undefined && (obj.shouldSkipExpire = message.shouldSkipExpire);
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    message.getSpecificCategory !== undefined && (obj.getSpecificCategory = message.getSpecificCategory);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetViewedProductsRequest>, I>>(base?: I): GetViewedProductsRequest {
    return GetViewedProductsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetViewedProductsRequest>, I>>(object: I): GetViewedProductsRequest {
    const message = createBaseGetViewedProductsRequest();
    message.productIds = object.productIds?.map((e) => e) || [];
    message.shouldSkipExpire = object.shouldSkipExpire ?? undefined;
    message.categoryId = object.categoryId ?? undefined;
    message.getSpecificCategory = object.getSpecificCategory ?? undefined;
    return message;
  },
};

function createBaseGetLegacyUserViaLocalPhoneRequest(): GetLegacyUserViaLocalPhoneRequest {
  return { mobileNumber: "" };
}

export const GetLegacyUserViaLocalPhoneRequest = {
  encode(message: GetLegacyUserViaLocalPhoneRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mobileNumber !== "") {
      writer.uint32(10).string(message.mobileNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLegacyUserViaLocalPhoneRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLegacyUserViaLocalPhoneRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mobileNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLegacyUserViaLocalPhoneRequest {
    return { mobileNumber: isSet(object.mobileNumber) ? String(object.mobileNumber) : "" };
  },

  toJSON(message: GetLegacyUserViaLocalPhoneRequest): unknown {
    const obj: any = {};
    message.mobileNumber !== undefined && (obj.mobileNumber = message.mobileNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLegacyUserViaLocalPhoneRequest>, I>>(
    base?: I,
  ): GetLegacyUserViaLocalPhoneRequest {
    return GetLegacyUserViaLocalPhoneRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLegacyUserViaLocalPhoneRequest>, I>>(
    object: I,
  ): GetLegacyUserViaLocalPhoneRequest {
    const message = createBaseGetLegacyUserViaLocalPhoneRequest();
    message.mobileNumber = object.mobileNumber ?? "";
    return message;
  },
};

function createBaseGetLegacyUserViaLocalPhoneResponse(): GetLegacyUserViaLocalPhoneResponse {
  return {
    isValid: false,
    countryCode: "",
    mobileNumber: "",
    userType: "",
    userId: "",
    userStatus: "",
    otpVerification: false,
    isActive: false,
    isDeleted: false,
    isMerchant: false,
    language: "",
    ratesScan: false,
    profilePic: "",
    listings: undefined,
    name: "",
    cards: [],
    isAllowedMobileNumber: false,
    region: "",
    isKeySeller: undefined,
  };
}

export const GetLegacyUserViaLocalPhoneResponse = {
  encode(message: GetLegacyUserViaLocalPhoneResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isValid === true) {
      writer.uint32(8).bool(message.isValid);
    }
    if (message.countryCode !== "") {
      writer.uint32(18).string(message.countryCode);
    }
    if (message.mobileNumber !== "") {
      writer.uint32(26).string(message.mobileNumber);
    }
    if (message.userType !== "") {
      writer.uint32(34).string(message.userType);
    }
    if (message.userId !== "") {
      writer.uint32(42).string(message.userId);
    }
    if (message.userStatus !== "") {
      writer.uint32(50).string(message.userStatus);
    }
    if (message.otpVerification === true) {
      writer.uint32(56).bool(message.otpVerification);
    }
    if (message.isActive === true) {
      writer.uint32(64).bool(message.isActive);
    }
    if (message.isDeleted === true) {
      writer.uint32(72).bool(message.isDeleted);
    }
    if (message.isMerchant === true) {
      writer.uint32(80).bool(message.isMerchant);
    }
    if (message.language !== "") {
      writer.uint32(90).string(message.language);
    }
    if (message.ratesScan === true) {
      writer.uint32(96).bool(message.ratesScan);
    }
    if (message.profilePic !== "") {
      writer.uint32(106).string(message.profilePic);
    }
    if (message.listings !== undefined) {
      GetLegacyUserViaLocalPhoneResponse_Listings.encode(message.listings, writer.uint32(114).fork()).ldelim();
    }
    if (message.name !== "") {
      writer.uint32(122).string(message.name);
    }
    for (const v of message.cards) {
      writer.uint32(130).string(v!);
    }
    if (message.isAllowedMobileNumber === true) {
      writer.uint32(136).bool(message.isAllowedMobileNumber);
    }
    if (message.region !== "") {
      writer.uint32(146).string(message.region);
    }
    if (message.isKeySeller !== undefined) {
      writer.uint32(152).bool(message.isKeySeller);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLegacyUserViaLocalPhoneResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLegacyUserViaLocalPhoneResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isValid = reader.bool();
          break;
        case 2:
          message.countryCode = reader.string();
          break;
        case 3:
          message.mobileNumber = reader.string();
          break;
        case 4:
          message.userType = reader.string();
          break;
        case 5:
          message.userId = reader.string();
          break;
        case 6:
          message.userStatus = reader.string();
          break;
        case 7:
          message.otpVerification = reader.bool();
          break;
        case 8:
          message.isActive = reader.bool();
          break;
        case 9:
          message.isDeleted = reader.bool();
          break;
        case 10:
          message.isMerchant = reader.bool();
          break;
        case 11:
          message.language = reader.string();
          break;
        case 12:
          message.ratesScan = reader.bool();
          break;
        case 13:
          message.profilePic = reader.string();
          break;
        case 14:
          message.listings = GetLegacyUserViaLocalPhoneResponse_Listings.decode(reader, reader.uint32());
          break;
        case 15:
          message.name = reader.string();
          break;
        case 16:
          message.cards.push(reader.string());
          break;
        case 17:
          message.isAllowedMobileNumber = reader.bool();
          break;
        case 18:
          message.region = reader.string();
          break;
        case 19:
          message.isKeySeller = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLegacyUserViaLocalPhoneResponse {
    return {
      isValid: isSet(object.isValid) ? Boolean(object.isValid) : false,
      countryCode: isSet(object.countryCode) ? String(object.countryCode) : "",
      mobileNumber: isSet(object.mobileNumber) ? String(object.mobileNumber) : "",
      userType: isSet(object.userType) ? String(object.userType) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      userStatus: isSet(object.userStatus) ? String(object.userStatus) : "",
      otpVerification: isSet(object.otpVerification) ? Boolean(object.otpVerification) : false,
      isActive: isSet(object.isActive) ? Boolean(object.isActive) : false,
      isDeleted: isSet(object.isDeleted) ? Boolean(object.isDeleted) : false,
      isMerchant: isSet(object.isMerchant) ? Boolean(object.isMerchant) : false,
      language: isSet(object.language) ? String(object.language) : "",
      ratesScan: isSet(object.ratesScan) ? Boolean(object.ratesScan) : false,
      profilePic: isSet(object.profilePic) ? String(object.profilePic) : "",
      listings: isSet(object.listings)
        ? GetLegacyUserViaLocalPhoneResponse_Listings.fromJSON(object.listings)
        : undefined,
      name: isSet(object.name) ? String(object.name) : "",
      cards: Array.isArray(object?.cards) ? object.cards.map((e: any) => String(e)) : [],
      isAllowedMobileNumber: isSet(object.isAllowedMobileNumber) ? Boolean(object.isAllowedMobileNumber) : false,
      region: isSet(object.region) ? String(object.region) : "",
      isKeySeller: isSet(object.isKeySeller) ? Boolean(object.isKeySeller) : undefined,
    };
  },

  toJSON(message: GetLegacyUserViaLocalPhoneResponse): unknown {
    const obj: any = {};
    message.isValid !== undefined && (obj.isValid = message.isValid);
    message.countryCode !== undefined && (obj.countryCode = message.countryCode);
    message.mobileNumber !== undefined && (obj.mobileNumber = message.mobileNumber);
    message.userType !== undefined && (obj.userType = message.userType);
    message.userId !== undefined && (obj.userId = message.userId);
    message.userStatus !== undefined && (obj.userStatus = message.userStatus);
    message.otpVerification !== undefined && (obj.otpVerification = message.otpVerification);
    message.isActive !== undefined && (obj.isActive = message.isActive);
    message.isDeleted !== undefined && (obj.isDeleted = message.isDeleted);
    message.isMerchant !== undefined && (obj.isMerchant = message.isMerchant);
    message.language !== undefined && (obj.language = message.language);
    message.ratesScan !== undefined && (obj.ratesScan = message.ratesScan);
    message.profilePic !== undefined && (obj.profilePic = message.profilePic);
    message.listings !== undefined && (obj.listings = message.listings
      ? GetLegacyUserViaLocalPhoneResponse_Listings.toJSON(message.listings)
      : undefined);
    message.name !== undefined && (obj.name = message.name);
    if (message.cards) {
      obj.cards = message.cards.map((e) => e);
    } else {
      obj.cards = [];
    }
    message.isAllowedMobileNumber !== undefined && (obj.isAllowedMobileNumber = message.isAllowedMobileNumber);
    message.region !== undefined && (obj.region = message.region);
    message.isKeySeller !== undefined && (obj.isKeySeller = message.isKeySeller);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLegacyUserViaLocalPhoneResponse>, I>>(
    base?: I,
  ): GetLegacyUserViaLocalPhoneResponse {
    return GetLegacyUserViaLocalPhoneResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLegacyUserViaLocalPhoneResponse>, I>>(
    object: I,
  ): GetLegacyUserViaLocalPhoneResponse {
    const message = createBaseGetLegacyUserViaLocalPhoneResponse();
    message.isValid = object.isValid ?? false;
    message.countryCode = object.countryCode ?? "";
    message.mobileNumber = object.mobileNumber ?? "";
    message.userType = object.userType ?? "";
    message.userId = object.userId ?? "";
    message.userStatus = object.userStatus ?? "";
    message.otpVerification = object.otpVerification ?? false;
    message.isActive = object.isActive ?? false;
    message.isDeleted = object.isDeleted ?? false;
    message.isMerchant = object.isMerchant ?? false;
    message.language = object.language ?? "";
    message.ratesScan = object.ratesScan ?? false;
    message.profilePic = object.profilePic ?? "";
    message.listings = (object.listings !== undefined && object.listings !== null)
      ? GetLegacyUserViaLocalPhoneResponse_Listings.fromPartial(object.listings)
      : undefined;
    message.name = object.name ?? "";
    message.cards = object.cards?.map((e) => e) || [];
    message.isAllowedMobileNumber = object.isAllowedMobileNumber ?? false;
    message.region = object.region ?? "";
    message.isKeySeller = object.isKeySeller ?? undefined;
    return message;
  },
};

function createBaseGetLegacyUserViaLocalPhoneResponse_Listings(): GetLegacyUserViaLocalPhoneResponse_Listings {
  return { activeListings: 0, completedSales: 0, purchasedProducts: 0, soldListings: 0 };
}

export const GetLegacyUserViaLocalPhoneResponse_Listings = {
  encode(message: GetLegacyUserViaLocalPhoneResponse_Listings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeListings !== 0) {
      writer.uint32(9).double(message.activeListings);
    }
    if (message.completedSales !== 0) {
      writer.uint32(17).double(message.completedSales);
    }
    if (message.purchasedProducts !== 0) {
      writer.uint32(25).double(message.purchasedProducts);
    }
    if (message.soldListings !== 0) {
      writer.uint32(33).double(message.soldListings);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetLegacyUserViaLocalPhoneResponse_Listings {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetLegacyUserViaLocalPhoneResponse_Listings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activeListings = reader.double();
          break;
        case 2:
          message.completedSales = reader.double();
          break;
        case 3:
          message.purchasedProducts = reader.double();
          break;
        case 4:
          message.soldListings = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetLegacyUserViaLocalPhoneResponse_Listings {
    return {
      activeListings: isSet(object.activeListings) ? Number(object.activeListings) : 0,
      completedSales: isSet(object.completedSales) ? Number(object.completedSales) : 0,
      purchasedProducts: isSet(object.purchasedProducts) ? Number(object.purchasedProducts) : 0,
      soldListings: isSet(object.soldListings) ? Number(object.soldListings) : 0,
    };
  },

  toJSON(message: GetLegacyUserViaLocalPhoneResponse_Listings): unknown {
    const obj: any = {};
    message.activeListings !== undefined && (obj.activeListings = message.activeListings);
    message.completedSales !== undefined && (obj.completedSales = message.completedSales);
    message.purchasedProducts !== undefined && (obj.purchasedProducts = message.purchasedProducts);
    message.soldListings !== undefined && (obj.soldListings = message.soldListings);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetLegacyUserViaLocalPhoneResponse_Listings>, I>>(
    base?: I,
  ): GetLegacyUserViaLocalPhoneResponse_Listings {
    return GetLegacyUserViaLocalPhoneResponse_Listings.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetLegacyUserViaLocalPhoneResponse_Listings>, I>>(
    object: I,
  ): GetLegacyUserViaLocalPhoneResponse_Listings {
    const message = createBaseGetLegacyUserViaLocalPhoneResponse_Listings();
    message.activeListings = object.activeListings ?? 0;
    message.completedSales = object.completedSales ?? 0;
    message.purchasedProducts = object.purchasedProducts ?? 0;
    message.soldListings = object.soldListings ?? 0;
    return message;
  },
};

function createBaseCreateNewUserRequest(): CreateNewUserRequest {
  return { mobileNumber: "", countryCode: "" };
}

export const CreateNewUserRequest = {
  encode(message: CreateNewUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.mobileNumber !== "") {
      writer.uint32(10).string(message.mobileNumber);
    }
    if (message.countryCode !== "") {
      writer.uint32(18).string(message.countryCode);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateNewUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateNewUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.mobileNumber = reader.string();
          break;
        case 2:
          message.countryCode = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateNewUserRequest {
    return {
      mobileNumber: isSet(object.mobileNumber) ? String(object.mobileNumber) : "",
      countryCode: isSet(object.countryCode) ? String(object.countryCode) : "",
    };
  },

  toJSON(message: CreateNewUserRequest): unknown {
    const obj: any = {};
    message.mobileNumber !== undefined && (obj.mobileNumber = message.mobileNumber);
    message.countryCode !== undefined && (obj.countryCode = message.countryCode);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateNewUserRequest>, I>>(base?: I): CreateNewUserRequest {
    return CreateNewUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateNewUserRequest>, I>>(object: I): CreateNewUserRequest {
    const message = createBaseCreateNewUserRequest();
    message.mobileNumber = object.mobileNumber ?? "";
    message.countryCode = object.countryCode ?? "";
    return message;
  },
};

function createBaseCreateNewUserResponse(): CreateNewUserResponse {
  return { userId: "", userStatus: "", language: "", ratesScan: false, profilePic: "", listings: undefined };
}

export const CreateNewUserResponse = {
  encode(message: CreateNewUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.userStatus !== "") {
      writer.uint32(18).string(message.userStatus);
    }
    if (message.language !== "") {
      writer.uint32(26).string(message.language);
    }
    if (message.ratesScan === true) {
      writer.uint32(32).bool(message.ratesScan);
    }
    if (message.profilePic !== "") {
      writer.uint32(42).string(message.profilePic);
    }
    if (message.listings !== undefined) {
      CreateNewUserResponse_Listings.encode(message.listings, writer.uint32(50).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateNewUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateNewUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.userStatus = reader.string();
          break;
        case 3:
          message.language = reader.string();
          break;
        case 4:
          message.ratesScan = reader.bool();
          break;
        case 5:
          message.profilePic = reader.string();
          break;
        case 6:
          message.listings = CreateNewUserResponse_Listings.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateNewUserResponse {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      userStatus: isSet(object.userStatus) ? String(object.userStatus) : "",
      language: isSet(object.language) ? String(object.language) : "",
      ratesScan: isSet(object.ratesScan) ? Boolean(object.ratesScan) : false,
      profilePic: isSet(object.profilePic) ? String(object.profilePic) : "",
      listings: isSet(object.listings) ? CreateNewUserResponse_Listings.fromJSON(object.listings) : undefined,
    };
  },

  toJSON(message: CreateNewUserResponse): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.userStatus !== undefined && (obj.userStatus = message.userStatus);
    message.language !== undefined && (obj.language = message.language);
    message.ratesScan !== undefined && (obj.ratesScan = message.ratesScan);
    message.profilePic !== undefined && (obj.profilePic = message.profilePic);
    message.listings !== undefined &&
      (obj.listings = message.listings ? CreateNewUserResponse_Listings.toJSON(message.listings) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateNewUserResponse>, I>>(base?: I): CreateNewUserResponse {
    return CreateNewUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateNewUserResponse>, I>>(object: I): CreateNewUserResponse {
    const message = createBaseCreateNewUserResponse();
    message.userId = object.userId ?? "";
    message.userStatus = object.userStatus ?? "";
    message.language = object.language ?? "";
    message.ratesScan = object.ratesScan ?? false;
    message.profilePic = object.profilePic ?? "";
    message.listings = (object.listings !== undefined && object.listings !== null)
      ? CreateNewUserResponse_Listings.fromPartial(object.listings)
      : undefined;
    return message;
  },
};

function createBaseCreateNewUserResponse_Listings(): CreateNewUserResponse_Listings {
  return { activeListings: 0, completedSales: 0, purchasedProducts: 0, soldListings: 0 };
}

export const CreateNewUserResponse_Listings = {
  encode(message: CreateNewUserResponse_Listings, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeListings !== 0) {
      writer.uint32(9).double(message.activeListings);
    }
    if (message.completedSales !== 0) {
      writer.uint32(17).double(message.completedSales);
    }
    if (message.purchasedProducts !== 0) {
      writer.uint32(25).double(message.purchasedProducts);
    }
    if (message.soldListings !== 0) {
      writer.uint32(33).double(message.soldListings);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateNewUserResponse_Listings {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateNewUserResponse_Listings();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activeListings = reader.double();
          break;
        case 2:
          message.completedSales = reader.double();
          break;
        case 3:
          message.purchasedProducts = reader.double();
          break;
        case 4:
          message.soldListings = reader.double();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateNewUserResponse_Listings {
    return {
      activeListings: isSet(object.activeListings) ? Number(object.activeListings) : 0,
      completedSales: isSet(object.completedSales) ? Number(object.completedSales) : 0,
      purchasedProducts: isSet(object.purchasedProducts) ? Number(object.purchasedProducts) : 0,
      soldListings: isSet(object.soldListings) ? Number(object.soldListings) : 0,
    };
  },

  toJSON(message: CreateNewUserResponse_Listings): unknown {
    const obj: any = {};
    message.activeListings !== undefined && (obj.activeListings = message.activeListings);
    message.completedSales !== undefined && (obj.completedSales = message.completedSales);
    message.purchasedProducts !== undefined && (obj.purchasedProducts = message.purchasedProducts);
    message.soldListings !== undefined && (obj.soldListings = message.soldListings);
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateNewUserResponse_Listings>, I>>(base?: I): CreateNewUserResponse_Listings {
    return CreateNewUserResponse_Listings.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateNewUserResponse_Listings>, I>>(
    object: I,
  ): CreateNewUserResponse_Listings {
    const message = createBaseCreateNewUserResponse_Listings();
    message.activeListings = object.activeListings ?? 0;
    message.completedSales = object.completedSales ?? 0;
    message.purchasedProducts = object.purchasedProducts ?? 0;
    message.soldListings = object.soldListings ?? 0;
    return message;
  },
};

function createBaseUpdateInactiveUserRequest(): UpdateInactiveUserRequest {
  return { userId: "", otpVerification: false };
}

export const UpdateInactiveUserRequest = {
  encode(message: UpdateInactiveUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.otpVerification === true) {
      writer.uint32(16).bool(message.otpVerification);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateInactiveUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateInactiveUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.otpVerification = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateInactiveUserRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      otpVerification: isSet(object.otpVerification) ? Boolean(object.otpVerification) : false,
    };
  },

  toJSON(message: UpdateInactiveUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.otpVerification !== undefined && (obj.otpVerification = message.otpVerification);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateInactiveUserRequest>, I>>(base?: I): UpdateInactiveUserRequest {
    return UpdateInactiveUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateInactiveUserRequest>, I>>(object: I): UpdateInactiveUserRequest {
    const message = createBaseUpdateInactiveUserRequest();
    message.userId = object.userId ?? "";
    message.otpVerification = object.otpVerification ?? false;
    return message;
  },
};

function createBaseUpdateInactiveUserResponse(): UpdateInactiveUserResponse {
  return {};
}

export const UpdateInactiveUserResponse = {
  encode(_: UpdateInactiveUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateInactiveUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateInactiveUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateInactiveUserResponse {
    return {};
  },

  toJSON(_: UpdateInactiveUserResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateInactiveUserResponse>, I>>(base?: I): UpdateInactiveUserResponse {
    return UpdateInactiveUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateInactiveUserResponse>, I>>(_: I): UpdateInactiveUserResponse {
    const message = createBaseUpdateInactiveUserResponse();
    return message;
  },
};

function createBaseCancelOrderRequest(): CancelOrderRequest {
  return { userId: "", orderId: "" };
}

export const CancelOrderRequest = {
  encode(message: CancelOrderRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.orderId !== "") {
      writer.uint32(18).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelOrderRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelOrderRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CancelOrderRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
    };
  },

  toJSON(message: CancelOrderRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<CancelOrderRequest>, I>>(base?: I): CancelOrderRequest {
    return CancelOrderRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CancelOrderRequest>, I>>(object: I): CancelOrderRequest {
    const message = createBaseCancelOrderRequest();
    message.userId = object.userId ?? "";
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseCancelOrderResponse(): CancelOrderResponse {
  return {};
}

export const CancelOrderResponse = {
  encode(_: CancelOrderResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CancelOrderResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCancelOrderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): CancelOrderResponse {
    return {};
  },

  toJSON(_: CancelOrderResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<CancelOrderResponse>, I>>(base?: I): CancelOrderResponse {
    return CancelOrderResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CancelOrderResponse>, I>>(_: I): CancelOrderResponse {
    const message = createBaseCancelOrderResponse();
    return message;
  },
};

function createBaseBanner(): Banner {
  return {
    position: 0,
    id: "",
    bannerName: "",
    bannerImage: "",
    bannerPage: "",
    bannerPosition: "",
    bannerType: "",
    bannerValue: "",
    lang: "",
    createdAt: "",
    updatedAt: "",
  };
}

export const Banner = {
  encode(message: Banner, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.position !== 0) {
      writer.uint32(8).int32(message.position);
    }
    if (message.id !== "") {
      writer.uint32(18).string(message.id);
    }
    if (message.bannerName !== "") {
      writer.uint32(26).string(message.bannerName);
    }
    if (message.bannerImage !== "") {
      writer.uint32(34).string(message.bannerImage);
    }
    if (message.bannerPage !== "") {
      writer.uint32(42).string(message.bannerPage);
    }
    if (message.bannerPosition !== "") {
      writer.uint32(50).string(message.bannerPosition);
    }
    if (message.bannerType !== "") {
      writer.uint32(58).string(message.bannerType);
    }
    if (message.bannerValue !== "") {
      writer.uint32(66).string(message.bannerValue);
    }
    if (message.lang !== "") {
      writer.uint32(74).string(message.lang);
    }
    if (message.createdAt !== "") {
      writer.uint32(82).string(message.createdAt);
    }
    if (message.updatedAt !== "") {
      writer.uint32(90).string(message.updatedAt);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Banner {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBanner();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.position = reader.int32();
          break;
        case 2:
          message.id = reader.string();
          break;
        case 3:
          message.bannerName = reader.string();
          break;
        case 4:
          message.bannerImage = reader.string();
          break;
        case 5:
          message.bannerPage = reader.string();
          break;
        case 6:
          message.bannerPosition = reader.string();
          break;
        case 7:
          message.bannerType = reader.string();
          break;
        case 8:
          message.bannerValue = reader.string();
          break;
        case 9:
          message.lang = reader.string();
          break;
        case 10:
          message.createdAt = reader.string();
          break;
        case 11:
          message.updatedAt = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Banner {
    return {
      position: isSet(object.position) ? Number(object.position) : 0,
      id: isSet(object.id) ? String(object.id) : "",
      bannerName: isSet(object.bannerName) ? String(object.bannerName) : "",
      bannerImage: isSet(object.bannerImage) ? String(object.bannerImage) : "",
      bannerPage: isSet(object.bannerPage) ? String(object.bannerPage) : "",
      bannerPosition: isSet(object.bannerPosition) ? String(object.bannerPosition) : "",
      bannerType: isSet(object.bannerType) ? String(object.bannerType) : "",
      bannerValue: isSet(object.bannerValue) ? String(object.bannerValue) : "",
      lang: isSet(object.lang) ? String(object.lang) : "",
      createdAt: isSet(object.createdAt) ? String(object.createdAt) : "",
      updatedAt: isSet(object.updatedAt) ? String(object.updatedAt) : "",
    };
  },

  toJSON(message: Banner): unknown {
    const obj: any = {};
    message.position !== undefined && (obj.position = Math.round(message.position));
    message.id !== undefined && (obj.id = message.id);
    message.bannerName !== undefined && (obj.bannerName = message.bannerName);
    message.bannerImage !== undefined && (obj.bannerImage = message.bannerImage);
    message.bannerPage !== undefined && (obj.bannerPage = message.bannerPage);
    message.bannerPosition !== undefined && (obj.bannerPosition = message.bannerPosition);
    message.bannerType !== undefined && (obj.bannerType = message.bannerType);
    message.bannerValue !== undefined && (obj.bannerValue = message.bannerValue);
    message.lang !== undefined && (obj.lang = message.lang);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    message.updatedAt !== undefined && (obj.updatedAt = message.updatedAt);
    return obj;
  },

  create<I extends Exact<DeepPartial<Banner>, I>>(base?: I): Banner {
    return Banner.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Banner>, I>>(object: I): Banner {
    const message = createBaseBanner();
    message.position = object.position ?? 0;
    message.id = object.id ?? "";
    message.bannerName = object.bannerName ?? "";
    message.bannerImage = object.bannerImage ?? "";
    message.bannerPage = object.bannerPage ?? "";
    message.bannerPosition = object.bannerPosition ?? "";
    message.bannerType = object.bannerType ?? "";
    message.bannerValue = object.bannerValue ?? "";
    message.lang = object.lang ?? "";
    message.createdAt = object.createdAt ?? "";
    message.updatedAt = object.updatedAt ?? "";
    return message;
  },
};

function createBaseGetBannersResponse(): GetBannersResponse {
  return { banners: [] };
}

export const GetBannersResponse = {
  encode(message: GetBannersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.banners) {
      Banner.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBannersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBannersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.banners.push(Banner.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBannersResponse {
    return { banners: Array.isArray(object?.banners) ? object.banners.map((e: any) => Banner.fromJSON(e)) : [] };
  },

  toJSON(message: GetBannersResponse): unknown {
    const obj: any = {};
    if (message.banners) {
      obj.banners = message.banners.map((e) => e ? Banner.toJSON(e) : undefined);
    } else {
      obj.banners = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBannersResponse>, I>>(base?: I): GetBannersResponse {
    return GetBannersResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetBannersResponse>, I>>(object: I): GetBannersResponse {
    const message = createBaseGetBannersResponse();
    message.banners = object.banners?.map((e) => Banner.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetBannersRequest(): GetBannersRequest {
  return { bannerPage: [], bannerPosition: "", region: "", lang: "", type: undefined };
}

export const GetBannersRequest = {
  encode(message: GetBannersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.bannerPage) {
      writer.uint32(10).string(v!);
    }
    if (message.bannerPosition !== "") {
      writer.uint32(18).string(message.bannerPosition);
    }
    if (message.region !== "") {
      writer.uint32(26).string(message.region);
    }
    if (message.lang !== "") {
      writer.uint32(34).string(message.lang);
    }
    if (message.type !== undefined) {
      writer.uint32(42).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetBannersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetBannersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bannerPage.push(reader.string());
          break;
        case 2:
          message.bannerPosition = reader.string();
          break;
        case 3:
          message.region = reader.string();
          break;
        case 4:
          message.lang = reader.string();
          break;
        case 5:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetBannersRequest {
    return {
      bannerPage: Array.isArray(object?.bannerPage) ? object.bannerPage.map((e: any) => String(e)) : [],
      bannerPosition: isSet(object.bannerPosition) ? String(object.bannerPosition) : "",
      region: isSet(object.region) ? String(object.region) : "",
      lang: isSet(object.lang) ? String(object.lang) : "",
      type: isSet(object.type) ? String(object.type) : undefined,
    };
  },

  toJSON(message: GetBannersRequest): unknown {
    const obj: any = {};
    if (message.bannerPage) {
      obj.bannerPage = message.bannerPage.map((e) => e);
    } else {
      obj.bannerPage = [];
    }
    message.bannerPosition !== undefined && (obj.bannerPosition = message.bannerPosition);
    message.region !== undefined && (obj.region = message.region);
    message.lang !== undefined && (obj.lang = message.lang);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetBannersRequest>, I>>(base?: I): GetBannersRequest {
    return GetBannersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetBannersRequest>, I>>(object: I): GetBannersRequest {
    const message = createBaseGetBannersRequest();
    message.bannerPage = object.bannerPage?.map((e) => e) || [];
    message.bannerPosition = object.bannerPosition ?? "";
    message.region = object.region ?? "";
    message.lang = object.lang ?? "";
    message.type = object.type ?? undefined;
    return message;
  },
};

function createBaseGetFeedRequest(): GetFeedRequest {
  return { size: 0, feedTypes: [], brands: [], models: [], categories: [], category: undefined };
}

export const GetFeedRequest = {
  encode(message: GetFeedRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.size !== 0) {
      writer.uint32(8).int32(message.size);
    }
    for (const v of message.feedTypes) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.brands) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.models) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.categories) {
      writer.uint32(42).string(v!);
    }
    if (message.category !== undefined) {
      writer.uint32(50).string(message.category);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFeedRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFeedRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.size = reader.int32();
          break;
        case 2:
          message.feedTypes.push(reader.string());
          break;
        case 3:
          message.brands.push(reader.string());
          break;
        case 4:
          message.models.push(reader.string());
          break;
        case 5:
          message.categories.push(reader.string());
          break;
        case 6:
          message.category = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFeedRequest {
    return {
      size: isSet(object.size) ? Number(object.size) : 0,
      feedTypes: Array.isArray(object?.feedTypes) ? object.feedTypes.map((e: any) => String(e)) : [],
      brands: Array.isArray(object?.brands) ? object.brands.map((e: any) => String(e)) : [],
      models: Array.isArray(object?.models) ? object.models.map((e: any) => String(e)) : [],
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => String(e)) : [],
      category: isSet(object.category) ? String(object.category) : undefined,
    };
  },

  toJSON(message: GetFeedRequest): unknown {
    const obj: any = {};
    message.size !== undefined && (obj.size = Math.round(message.size));
    if (message.feedTypes) {
      obj.feedTypes = message.feedTypes.map((e) => e);
    } else {
      obj.feedTypes = [];
    }
    if (message.brands) {
      obj.brands = message.brands.map((e) => e);
    } else {
      obj.brands = [];
    }
    if (message.models) {
      obj.models = message.models.map((e) => e);
    } else {
      obj.models = [];
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    message.category !== undefined && (obj.category = message.category);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFeedRequest>, I>>(base?: I): GetFeedRequest {
    return GetFeedRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFeedRequest>, I>>(object: I): GetFeedRequest {
    const message = createBaseGetFeedRequest();
    message.size = object.size ?? 0;
    message.feedTypes = object.feedTypes?.map((e) => e) || [];
    message.brands = object.brands?.map((e) => e) || [];
    message.models = object.models?.map((e) => e) || [];
    message.categories = object.categories?.map((e) => e) || [];
    message.category = object.category ?? undefined;
    return message;
  },
};

function createBaseFeedProductAttribute(): FeedProductAttribute {
  return { title: undefined, value: undefined };
}

export const FeedProductAttribute = {
  encode(message: FeedProductAttribute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== undefined) {
      Title.encode(message.title, writer.uint32(10).fork()).ldelim();
    }
    if (message.value !== undefined) {
      Value.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeedProductAttribute {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeedProductAttribute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = Title.decode(reader, reader.uint32());
          break;
        case 2:
          message.value = Value.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeedProductAttribute {
    return {
      title: isSet(object.title) ? Title.fromJSON(object.title) : undefined,
      value: isSet(object.value) ? Value.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: FeedProductAttribute): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title ? Title.toJSON(message.title) : undefined);
    message.value !== undefined && (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FeedProductAttribute>, I>>(base?: I): FeedProductAttribute {
    return FeedProductAttribute.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FeedProductAttribute>, I>>(object: I): FeedProductAttribute {
    const message = createBaseFeedProductAttribute();
    message.title = (object.title !== undefined && object.title !== null) ? Title.fromPartial(object.title) : undefined;
    message.value = (object.value !== undefined && object.value !== null) ? Value.fromPartial(object.value) : undefined;
    return message;
  },
};

function createBaseTitle(): Title {
  return { arName: "", enName: "" };
}

export const Title = {
  encode(message: Title, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arName !== "") {
      writer.uint32(10).string(message.arName);
    }
    if (message.enName !== "") {
      writer.uint32(18).string(message.enName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Title {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTitle();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arName = reader.string();
          break;
        case 2:
          message.enName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Title {
    return {
      arName: isSet(object.arName) ? String(object.arName) : "",
      enName: isSet(object.enName) ? String(object.enName) : "",
    };
  },

  toJSON(message: Title): unknown {
    const obj: any = {};
    message.arName !== undefined && (obj.arName = message.arName);
    message.enName !== undefined && (obj.enName = message.enName);
    return obj;
  },

  create<I extends Exact<DeepPartial<Title>, I>>(base?: I): Title {
    return Title.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Title>, I>>(object: I): Title {
    const message = createBaseTitle();
    message.arName = object.arName ?? "";
    message.enName = object.enName ?? "";
    return message;
  },
};

function createBaseValue(): Value {
  return { arName: "", enName: "" };
}

export const Value = {
  encode(message: Value, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.arName !== "") {
      writer.uint32(10).string(message.arName);
    }
    if (message.enName !== "") {
      writer.uint32(18).string(message.enName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Value {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValue();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.arName = reader.string();
          break;
        case 2:
          message.enName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Value {
    return {
      arName: isSet(object.arName) ? String(object.arName) : "",
      enName: isSet(object.enName) ? String(object.enName) : "",
    };
  },

  toJSON(message: Value): unknown {
    const obj: any = {};
    message.arName !== undefined && (obj.arName = message.arName);
    message.enName !== undefined && (obj.enName = message.enName);
    return obj;
  },

  create<I extends Exact<DeepPartial<Value>, I>>(base?: I): Value {
    return Value.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Value>, I>>(object: I): Value {
    const message = createBaseValue();
    message.arName = object.arName ?? "";
    message.enName = object.enName ?? "";
    return message;
  },
};

function createBaseAttribute(): Attribute {
  return { title: undefined, value: undefined, iconURL: undefined };
}

export const Attribute = {
  encode(message: Attribute, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.title !== undefined) {
      Title.encode(message.title, writer.uint32(10).fork()).ldelim();
    }
    if (message.value !== undefined) {
      Value.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    if (message.iconURL !== undefined) {
      writer.uint32(26).string(message.iconURL);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Attribute {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttribute();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.title = Title.decode(reader, reader.uint32());
          break;
        case 2:
          message.value = Value.decode(reader, reader.uint32());
          break;
        case 3:
          message.iconURL = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Attribute {
    return {
      title: isSet(object.title) ? Title.fromJSON(object.title) : undefined,
      value: isSet(object.value) ? Value.fromJSON(object.value) : undefined,
      iconURL: isSet(object.iconURL) ? String(object.iconURL) : undefined,
    };
  },

  toJSON(message: Attribute): unknown {
    const obj: any = {};
    message.title !== undefined && (obj.title = message.title ? Title.toJSON(message.title) : undefined);
    message.value !== undefined && (obj.value = message.value ? Value.toJSON(message.value) : undefined);
    message.iconURL !== undefined && (obj.iconURL = message.iconURL);
    return obj;
  },

  create<I extends Exact<DeepPartial<Attribute>, I>>(base?: I): Attribute {
    return Attribute.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Attribute>, I>>(object: I): Attribute {
    const message = createBaseAttribute();
    message.title = (object.title !== undefined && object.title !== null) ? Title.fromPartial(object.title) : undefined;
    message.value = (object.value !== undefined && object.value !== null) ? Value.fromPartial(object.value) : undefined;
    message.iconURL = object.iconURL ?? undefined;
    return message;
  },
};

function createBaseGetViewedProductsResponse(): GetViewedProductsResponse {
  return { products: [] };
}

export const GetViewedProductsResponse = {
  encode(message: GetViewedProductsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.products) {
      GetViewedProductsResponse_Product.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetViewedProductsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetViewedProductsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.products.push(GetViewedProductsResponse_Product.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetViewedProductsResponse {
    return {
      products: Array.isArray(object?.products)
        ? object.products.map((e: any) => GetViewedProductsResponse_Product.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetViewedProductsResponse): unknown {
    const obj: any = {};
    if (message.products) {
      obj.products = message.products.map((e) => e ? GetViewedProductsResponse_Product.toJSON(e) : undefined);
    } else {
      obj.products = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetViewedProductsResponse>, I>>(base?: I): GetViewedProductsResponse {
    return GetViewedProductsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetViewedProductsResponse>, I>>(object: I): GetViewedProductsResponse {
    const message = createBaseGetViewedProductsResponse();
    message.products = object.products?.map((e) => GetViewedProductsResponse_Product.fromPartial(e)) || [];
    return message;
  },
};

function createBaseGetViewedProductsResponse_Product(): GetViewedProductsResponse_Product {
  return {
    id: "",
    grade: "",
    gradeAr: "",
    deviceModel: undefined,
    variant: undefined,
    attributes: [],
    isGreatDeal: false,
    isMerchant: false,
    originalPrice: 0,
    productImage: "",
    productImages: [],
    sellPrice: 0,
    tags: "",
    sellStatus: "",
    sellDate: "",
    condition: undefined,
    showSecurityBadge: false,
    brand: undefined,
    category: undefined,
    grandTotal: 0,
    vat: 0,
    shippingCharge: 0,
    buyAmount: 0,
    expressDeliveryBadge: undefined,
    year: undefined,
  };
}

export const GetViewedProductsResponse_Product = {
  encode(message: GetViewedProductsResponse_Product, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.grade !== "") {
      writer.uint32(18).string(message.grade);
    }
    if (message.gradeAr !== "") {
      writer.uint32(26).string(message.gradeAr);
    }
    if (message.deviceModel !== undefined) {
      DeviceModel.encode(message.deviceModel, writer.uint32(34).fork()).ldelim();
    }
    if (message.variant !== undefined) {
      Variant.encode(message.variant, writer.uint32(42).fork()).ldelim();
    }
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(50).fork()).ldelim();
    }
    if (message.isGreatDeal === true) {
      writer.uint32(56).bool(message.isGreatDeal);
    }
    if (message.isMerchant === true) {
      writer.uint32(64).bool(message.isMerchant);
    }
    if (message.originalPrice !== 0) {
      writer.uint32(72).int32(message.originalPrice);
    }
    if (message.productImage !== "") {
      writer.uint32(82).string(message.productImage);
    }
    for (const v of message.productImages) {
      writer.uint32(90).string(v!);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(101).float(message.sellPrice);
    }
    if (message.tags !== "") {
      writer.uint32(106).string(message.tags);
    }
    if (message.sellStatus !== "") {
      writer.uint32(114).string(message.sellStatus);
    }
    if (message.sellDate !== "") {
      writer.uint32(122).string(message.sellDate);
    }
    if (message.condition !== undefined) {
      Condition.encode(message.condition, writer.uint32(130).fork()).ldelim();
    }
    if (message.showSecurityBadge === true) {
      writer.uint32(136).bool(message.showSecurityBadge);
    }
    if (message.brand !== undefined) {
      Category.encode(message.brand, writer.uint32(146).fork()).ldelim();
    }
    if (message.category !== undefined) {
      Category.encode(message.category, writer.uint32(154).fork()).ldelim();
    }
    if (message.grandTotal !== 0) {
      writer.uint32(165).float(message.grandTotal);
    }
    if (message.vat !== 0) {
      writer.uint32(173).float(message.vat);
    }
    if (message.shippingCharge !== 0) {
      writer.uint32(181).float(message.shippingCharge);
    }
    if (message.buyAmount !== 0) {
      writer.uint32(189).float(message.buyAmount);
    }
    if (message.expressDeliveryBadge !== undefined) {
      writer.uint32(192).bool(message.expressDeliveryBadge);
    }
    if (message.year !== undefined) {
      writer.uint32(202).string(message.year);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetViewedProductsResponse_Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetViewedProductsResponse_Product();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.grade = reader.string();
          break;
        case 3:
          message.gradeAr = reader.string();
          break;
        case 4:
          message.deviceModel = DeviceModel.decode(reader, reader.uint32());
          break;
        case 5:
          message.variant = Variant.decode(reader, reader.uint32());
          break;
        case 6:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        case 7:
          message.isGreatDeal = reader.bool();
          break;
        case 8:
          message.isMerchant = reader.bool();
          break;
        case 9:
          message.originalPrice = reader.int32();
          break;
        case 10:
          message.productImage = reader.string();
          break;
        case 11:
          message.productImages.push(reader.string());
          break;
        case 12:
          message.sellPrice = reader.float();
          break;
        case 13:
          message.tags = reader.string();
          break;
        case 14:
          message.sellStatus = reader.string();
          break;
        case 15:
          message.sellDate = reader.string();
          break;
        case 16:
          message.condition = Condition.decode(reader, reader.uint32());
          break;
        case 17:
          message.showSecurityBadge = reader.bool();
          break;
        case 18:
          message.brand = Category.decode(reader, reader.uint32());
          break;
        case 19:
          message.category = Category.decode(reader, reader.uint32());
          break;
        case 20:
          message.grandTotal = reader.float();
          break;
        case 21:
          message.vat = reader.float();
          break;
        case 22:
          message.shippingCharge = reader.float();
          break;
        case 23:
          message.buyAmount = reader.float();
          break;
        case 24:
          message.expressDeliveryBadge = reader.bool();
          break;
        case 25:
          message.year = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetViewedProductsResponse_Product {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      grade: isSet(object.grade) ? String(object.grade) : "",
      gradeAr: isSet(object.gradeAr) ? String(object.gradeAr) : "",
      deviceModel: isSet(object.deviceModel) ? DeviceModel.fromJSON(object.deviceModel) : undefined,
      variant: isSet(object.variant) ? Variant.fromJSON(object.variant) : undefined,
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
      isGreatDeal: isSet(object.isGreatDeal) ? Boolean(object.isGreatDeal) : false,
      isMerchant: isSet(object.isMerchant) ? Boolean(object.isMerchant) : false,
      originalPrice: isSet(object.originalPrice) ? Number(object.originalPrice) : 0,
      productImage: isSet(object.productImage) ? String(object.productImage) : "",
      productImages: Array.isArray(object?.productImages) ? object.productImages.map((e: any) => String(e)) : [],
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      tags: isSet(object.tags) ? String(object.tags) : "",
      sellStatus: isSet(object.sellStatus) ? String(object.sellStatus) : "",
      sellDate: isSet(object.sellDate) ? String(object.sellDate) : "",
      condition: isSet(object.condition) ? Condition.fromJSON(object.condition) : undefined,
      showSecurityBadge: isSet(object.showSecurityBadge) ? Boolean(object.showSecurityBadge) : false,
      brand: isSet(object.brand) ? Category.fromJSON(object.brand) : undefined,
      category: isSet(object.category) ? Category.fromJSON(object.category) : undefined,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      vat: isSet(object.vat) ? Number(object.vat) : 0,
      shippingCharge: isSet(object.shippingCharge) ? Number(object.shippingCharge) : 0,
      buyAmount: isSet(object.buyAmount) ? Number(object.buyAmount) : 0,
      expressDeliveryBadge: isSet(object.expressDeliveryBadge) ? Boolean(object.expressDeliveryBadge) : undefined,
      year: isSet(object.year) ? String(object.year) : undefined,
    };
  },

  toJSON(message: GetViewedProductsResponse_Product): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.grade !== undefined && (obj.grade = message.grade);
    message.gradeAr !== undefined && (obj.gradeAr = message.gradeAr);
    message.deviceModel !== undefined &&
      (obj.deviceModel = message.deviceModel ? DeviceModel.toJSON(message.deviceModel) : undefined);
    message.variant !== undefined && (obj.variant = message.variant ? Variant.toJSON(message.variant) : undefined);
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    message.isGreatDeal !== undefined && (obj.isGreatDeal = message.isGreatDeal);
    message.isMerchant !== undefined && (obj.isMerchant = message.isMerchant);
    message.originalPrice !== undefined && (obj.originalPrice = Math.round(message.originalPrice));
    message.productImage !== undefined && (obj.productImage = message.productImage);
    if (message.productImages) {
      obj.productImages = message.productImages.map((e) => e);
    } else {
      obj.productImages = [];
    }
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.tags !== undefined && (obj.tags = message.tags);
    message.sellStatus !== undefined && (obj.sellStatus = message.sellStatus);
    message.sellDate !== undefined && (obj.sellDate = message.sellDate);
    message.condition !== undefined &&
      (obj.condition = message.condition ? Condition.toJSON(message.condition) : undefined);
    message.showSecurityBadge !== undefined && (obj.showSecurityBadge = message.showSecurityBadge);
    message.brand !== undefined && (obj.brand = message.brand ? Category.toJSON(message.brand) : undefined);
    message.category !== undefined && (obj.category = message.category ? Category.toJSON(message.category) : undefined);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.vat !== undefined && (obj.vat = message.vat);
    message.shippingCharge !== undefined && (obj.shippingCharge = message.shippingCharge);
    message.buyAmount !== undefined && (obj.buyAmount = message.buyAmount);
    message.expressDeliveryBadge !== undefined && (obj.expressDeliveryBadge = message.expressDeliveryBadge);
    message.year !== undefined && (obj.year = message.year);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetViewedProductsResponse_Product>, I>>(
    base?: I,
  ): GetViewedProductsResponse_Product {
    return GetViewedProductsResponse_Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetViewedProductsResponse_Product>, I>>(
    object: I,
  ): GetViewedProductsResponse_Product {
    const message = createBaseGetViewedProductsResponse_Product();
    message.id = object.id ?? "";
    message.grade = object.grade ?? "";
    message.gradeAr = object.gradeAr ?? "";
    message.deviceModel = (object.deviceModel !== undefined && object.deviceModel !== null)
      ? DeviceModel.fromPartial(object.deviceModel)
      : undefined;
    message.variant = (object.variant !== undefined && object.variant !== null)
      ? Variant.fromPartial(object.variant)
      : undefined;
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    message.isGreatDeal = object.isGreatDeal ?? false;
    message.isMerchant = object.isMerchant ?? false;
    message.originalPrice = object.originalPrice ?? 0;
    message.productImage = object.productImage ?? "";
    message.productImages = object.productImages?.map((e) => e) || [];
    message.sellPrice = object.sellPrice ?? 0;
    message.tags = object.tags ?? "";
    message.sellStatus = object.sellStatus ?? "";
    message.sellDate = object.sellDate ?? "";
    message.condition = (object.condition !== undefined && object.condition !== null)
      ? Condition.fromPartial(object.condition)
      : undefined;
    message.showSecurityBadge = object.showSecurityBadge ?? false;
    message.brand = (object.brand !== undefined && object.brand !== null)
      ? Category.fromPartial(object.brand)
      : undefined;
    message.category = (object.category !== undefined && object.category !== null)
      ? Category.fromPartial(object.category)
      : undefined;
    message.grandTotal = object.grandTotal ?? 0;
    message.vat = object.vat ?? 0;
    message.shippingCharge = object.shippingCharge ?? 0;
    message.buyAmount = object.buyAmount ?? 0;
    message.expressDeliveryBadge = object.expressDeliveryBadge ?? undefined;
    message.year = object.year ?? undefined;
    return message;
  },
};

function createBaseDeviceModel(): DeviceModel {
  return { name: "", nameAr: "" };
}

export const DeviceModel = {
  encode(message: DeviceModel, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(18).string(message.nameAr);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeviceModel {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeviceModel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.nameAr = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeviceModel {
    return {
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
    };
  },

  toJSON(message: DeviceModel): unknown {
    const obj: any = {};
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    return obj;
  },

  create<I extends Exact<DeepPartial<DeviceModel>, I>>(base?: I): DeviceModel {
    return DeviceModel.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<DeviceModel>, I>>(object: I): DeviceModel {
    const message = createBaseDeviceModel();
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    return message;
  },
};

function createBaseFeedProduct(): FeedProduct {
  return {
    originalPrice: 0,
    modelName: "",
    arModelName: "",
    productId: "",
    sellPrice: 0,
    grade: "",
    arGrade: "",
    productImage: "",
    variantName: "",
    arVariantName: "",
    discount: 0,
    attributes: [],
    productImages: [],
    condition: undefined,
    showSecurityBadge: false,
  };
}

export const FeedProduct = {
  encode(message: FeedProduct, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.originalPrice !== 0) {
      writer.uint32(8).int32(message.originalPrice);
    }
    if (message.modelName !== "") {
      writer.uint32(18).string(message.modelName);
    }
    if (message.arModelName !== "") {
      writer.uint32(26).string(message.arModelName);
    }
    if (message.productId !== "") {
      writer.uint32(34).string(message.productId);
    }
    if (message.sellPrice !== 0) {
      writer.uint32(40).int32(message.sellPrice);
    }
    if (message.grade !== "") {
      writer.uint32(50).string(message.grade);
    }
    if (message.arGrade !== "") {
      writer.uint32(58).string(message.arGrade);
    }
    if (message.productImage !== "") {
      writer.uint32(66).string(message.productImage);
    }
    if (message.variantName !== "") {
      writer.uint32(74).string(message.variantName);
    }
    if (message.arVariantName !== "") {
      writer.uint32(82).string(message.arVariantName);
    }
    if (message.discount !== 0) {
      writer.uint32(93).float(message.discount);
    }
    for (const v of message.attributes) {
      FeedProductAttribute.encode(v!, writer.uint32(98).fork()).ldelim();
    }
    for (const v of message.productImages) {
      writer.uint32(106).string(v!);
    }
    if (message.condition !== undefined) {
      Condition.encode(message.condition, writer.uint32(114).fork()).ldelim();
    }
    if (message.showSecurityBadge === true) {
      writer.uint32(120).bool(message.showSecurityBadge);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeedProduct {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeedProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.originalPrice = reader.int32();
          break;
        case 2:
          message.modelName = reader.string();
          break;
        case 3:
          message.arModelName = reader.string();
          break;
        case 4:
          message.productId = reader.string();
          break;
        case 5:
          message.sellPrice = reader.int32();
          break;
        case 6:
          message.grade = reader.string();
          break;
        case 7:
          message.arGrade = reader.string();
          break;
        case 8:
          message.productImage = reader.string();
          break;
        case 9:
          message.variantName = reader.string();
          break;
        case 10:
          message.arVariantName = reader.string();
          break;
        case 11:
          message.discount = reader.float();
          break;
        case 12:
          message.attributes.push(FeedProductAttribute.decode(reader, reader.uint32()));
          break;
        case 13:
          message.productImages.push(reader.string());
          break;
        case 14:
          message.condition = Condition.decode(reader, reader.uint32());
          break;
        case 15:
          message.showSecurityBadge = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeedProduct {
    return {
      originalPrice: isSet(object.originalPrice) ? Number(object.originalPrice) : 0,
      modelName: isSet(object.modelName) ? String(object.modelName) : "",
      arModelName: isSet(object.arModelName) ? String(object.arModelName) : "",
      productId: isSet(object.productId) ? String(object.productId) : "",
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      grade: isSet(object.grade) ? String(object.grade) : "",
      arGrade: isSet(object.arGrade) ? String(object.arGrade) : "",
      productImage: isSet(object.productImage) ? String(object.productImage) : "",
      variantName: isSet(object.variantName) ? String(object.variantName) : "",
      arVariantName: isSet(object.arVariantName) ? String(object.arVariantName) : "",
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      attributes: Array.isArray(object?.attributes)
        ? object.attributes.map((e: any) => FeedProductAttribute.fromJSON(e))
        : [],
      productImages: Array.isArray(object?.productImages) ? object.productImages.map((e: any) => String(e)) : [],
      condition: isSet(object.condition) ? Condition.fromJSON(object.condition) : undefined,
      showSecurityBadge: isSet(object.showSecurityBadge) ? Boolean(object.showSecurityBadge) : false,
    };
  },

  toJSON(message: FeedProduct): unknown {
    const obj: any = {};
    message.originalPrice !== undefined && (obj.originalPrice = Math.round(message.originalPrice));
    message.modelName !== undefined && (obj.modelName = message.modelName);
    message.arModelName !== undefined && (obj.arModelName = message.arModelName);
    message.productId !== undefined && (obj.productId = message.productId);
    message.sellPrice !== undefined && (obj.sellPrice = Math.round(message.sellPrice));
    message.grade !== undefined && (obj.grade = message.grade);
    message.arGrade !== undefined && (obj.arGrade = message.arGrade);
    message.productImage !== undefined && (obj.productImage = message.productImage);
    message.variantName !== undefined && (obj.variantName = message.variantName);
    message.arVariantName !== undefined && (obj.arVariantName = message.arVariantName);
    message.discount !== undefined && (obj.discount = message.discount);
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? FeedProductAttribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    if (message.productImages) {
      obj.productImages = message.productImages.map((e) => e);
    } else {
      obj.productImages = [];
    }
    message.condition !== undefined &&
      (obj.condition = message.condition ? Condition.toJSON(message.condition) : undefined);
    message.showSecurityBadge !== undefined && (obj.showSecurityBadge = message.showSecurityBadge);
    return obj;
  },

  create<I extends Exact<DeepPartial<FeedProduct>, I>>(base?: I): FeedProduct {
    return FeedProduct.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FeedProduct>, I>>(object: I): FeedProduct {
    const message = createBaseFeedProduct();
    message.originalPrice = object.originalPrice ?? 0;
    message.modelName = object.modelName ?? "";
    message.arModelName = object.arModelName ?? "";
    message.productId = object.productId ?? "";
    message.sellPrice = object.sellPrice ?? 0;
    message.grade = object.grade ?? "";
    message.arGrade = object.arGrade ?? "";
    message.productImage = object.productImage ?? "";
    message.variantName = object.variantName ?? "";
    message.arVariantName = object.arVariantName ?? "";
    message.discount = object.discount ?? 0;
    message.attributes = object.attributes?.map((e) => FeedProductAttribute.fromPartial(e)) || [];
    message.productImages = object.productImages?.map((e) => e) || [];
    message.condition = (object.condition !== undefined && object.condition !== null)
      ? Condition.fromPartial(object.condition)
      : undefined;
    message.showSecurityBadge = object.showSecurityBadge ?? false;
    return message;
  },
};

function createBaseFeedItem(): FeedItem {
  return {
    id: "",
    arName: "",
    enName: "",
    items: [],
    arTitle: "",
    enTitle: "",
    expiryDate: "",
    feedType: "",
    maxBudget: 0,
    imgURL: "",
    position: 0,
    totalActiveProducts: 0,
    totalProducts: 0,
  };
}

export const FeedItem = {
  encode(message: FeedItem, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.arName !== "") {
      writer.uint32(18).string(message.arName);
    }
    if (message.enName !== "") {
      writer.uint32(26).string(message.enName);
    }
    for (const v of message.items) {
      FeedProduct.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    if (message.arTitle !== "") {
      writer.uint32(42).string(message.arTitle);
    }
    if (message.enTitle !== "") {
      writer.uint32(50).string(message.enTitle);
    }
    if (message.expiryDate !== "") {
      writer.uint32(58).string(message.expiryDate);
    }
    if (message.feedType !== "") {
      writer.uint32(66).string(message.feedType);
    }
    if (message.maxBudget !== 0) {
      writer.uint32(72).int32(message.maxBudget);
    }
    if (message.imgURL !== "") {
      writer.uint32(82).string(message.imgURL);
    }
    if (message.position !== 0) {
      writer.uint32(88).int32(message.position);
    }
    if (message.totalActiveProducts !== 0) {
      writer.uint32(96).int32(message.totalActiveProducts);
    }
    if (message.totalProducts !== 0) {
      writer.uint32(104).int32(message.totalProducts);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FeedItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFeedItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.arName = reader.string();
          break;
        case 3:
          message.enName = reader.string();
          break;
        case 4:
          message.items.push(FeedProduct.decode(reader, reader.uint32()));
          break;
        case 5:
          message.arTitle = reader.string();
          break;
        case 6:
          message.enTitle = reader.string();
          break;
        case 7:
          message.expiryDate = reader.string();
          break;
        case 8:
          message.feedType = reader.string();
          break;
        case 9:
          message.maxBudget = reader.int32();
          break;
        case 10:
          message.imgURL = reader.string();
          break;
        case 11:
          message.position = reader.int32();
          break;
        case 12:
          message.totalActiveProducts = reader.int32();
          break;
        case 13:
          message.totalProducts = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FeedItem {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      arName: isSet(object.arName) ? String(object.arName) : "",
      enName: isSet(object.enName) ? String(object.enName) : "",
      items: Array.isArray(object?.items) ? object.items.map((e: any) => FeedProduct.fromJSON(e)) : [],
      arTitle: isSet(object.arTitle) ? String(object.arTitle) : "",
      enTitle: isSet(object.enTitle) ? String(object.enTitle) : "",
      expiryDate: isSet(object.expiryDate) ? String(object.expiryDate) : "",
      feedType: isSet(object.feedType) ? String(object.feedType) : "",
      maxBudget: isSet(object.maxBudget) ? Number(object.maxBudget) : 0,
      imgURL: isSet(object.imgURL) ? String(object.imgURL) : "",
      position: isSet(object.position) ? Number(object.position) : 0,
      totalActiveProducts: isSet(object.totalActiveProducts) ? Number(object.totalActiveProducts) : 0,
      totalProducts: isSet(object.totalProducts) ? Number(object.totalProducts) : 0,
    };
  },

  toJSON(message: FeedItem): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.arName !== undefined && (obj.arName = message.arName);
    message.enName !== undefined && (obj.enName = message.enName);
    if (message.items) {
      obj.items = message.items.map((e) => e ? FeedProduct.toJSON(e) : undefined);
    } else {
      obj.items = [];
    }
    message.arTitle !== undefined && (obj.arTitle = message.arTitle);
    message.enTitle !== undefined && (obj.enTitle = message.enTitle);
    message.expiryDate !== undefined && (obj.expiryDate = message.expiryDate);
    message.feedType !== undefined && (obj.feedType = message.feedType);
    message.maxBudget !== undefined && (obj.maxBudget = Math.round(message.maxBudget));
    message.imgURL !== undefined && (obj.imgURL = message.imgURL);
    message.position !== undefined && (obj.position = Math.round(message.position));
    message.totalActiveProducts !== undefined && (obj.totalActiveProducts = Math.round(message.totalActiveProducts));
    message.totalProducts !== undefined && (obj.totalProducts = Math.round(message.totalProducts));
    return obj;
  },

  create<I extends Exact<DeepPartial<FeedItem>, I>>(base?: I): FeedItem {
    return FeedItem.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FeedItem>, I>>(object: I): FeedItem {
    const message = createBaseFeedItem();
    message.id = object.id ?? "";
    message.arName = object.arName ?? "";
    message.enName = object.enName ?? "";
    message.items = object.items?.map((e) => FeedProduct.fromPartial(e)) || [];
    message.arTitle = object.arTitle ?? "";
    message.enTitle = object.enTitle ?? "";
    message.expiryDate = object.expiryDate ?? "";
    message.feedType = object.feedType ?? "";
    message.maxBudget = object.maxBudget ?? 0;
    message.imgURL = object.imgURL ?? "";
    message.position = object.position ?? 0;
    message.totalActiveProducts = object.totalActiveProducts ?? 0;
    message.totalProducts = object.totalProducts ?? 0;
    return message;
  },
};

function createBaseModel(): Model {
  return { id: "", arName: "", enName: "", modelIcon: "" };
}

export const Model = {
  encode(message: Model, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.arName !== "") {
      writer.uint32(18).string(message.arName);
    }
    if (message.enName !== "") {
      writer.uint32(26).string(message.enName);
    }
    if (message.modelIcon !== "") {
      writer.uint32(34).string(message.modelIcon);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Model {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModel();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.arName = reader.string();
          break;
        case 3:
          message.enName = reader.string();
          break;
        case 4:
          message.modelIcon = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Model {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      arName: isSet(object.arName) ? String(object.arName) : "",
      enName: isSet(object.enName) ? String(object.enName) : "",
      modelIcon: isSet(object.modelIcon) ? String(object.modelIcon) : "",
    };
  },

  toJSON(message: Model): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.arName !== undefined && (obj.arName = message.arName);
    message.enName !== undefined && (obj.enName = message.enName);
    message.modelIcon !== undefined && (obj.modelIcon = message.modelIcon);
    return obj;
  },

  create<I extends Exact<DeepPartial<Model>, I>>(base?: I): Model {
    return Model.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Model>, I>>(object: I): Model {
    const message = createBaseModel();
    message.id = object.id ?? "";
    message.arName = object.arName ?? "";
    message.enName = object.enName ?? "";
    message.modelIcon = object.modelIcon ?? "";
    return message;
  },
};

function createBaseGetFeedsResponse(): GetFeedsResponse {
  return { feeds: [], mostSoldModels: [] };
}

export const GetFeedsResponse = {
  encode(message: GetFeedsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.feeds) {
      FeedItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.mostSoldModels) {
      Model.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetFeedsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetFeedsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.feeds.push(FeedItem.decode(reader, reader.uint32()));
          break;
        case 2:
          message.mostSoldModels.push(Model.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetFeedsResponse {
    return {
      feeds: Array.isArray(object?.feeds) ? object.feeds.map((e: any) => FeedItem.fromJSON(e)) : [],
      mostSoldModels: Array.isArray(object?.mostSoldModels)
        ? object.mostSoldModels.map((e: any) => Model.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetFeedsResponse): unknown {
    const obj: any = {};
    if (message.feeds) {
      obj.feeds = message.feeds.map((e) => e ? FeedItem.toJSON(e) : undefined);
    } else {
      obj.feeds = [];
    }
    if (message.mostSoldModels) {
      obj.mostSoldModels = message.mostSoldModels.map((e) => e ? Model.toJSON(e) : undefined);
    } else {
      obj.mostSoldModels = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetFeedsResponse>, I>>(base?: I): GetFeedsResponse {
    return GetFeedsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetFeedsResponse>, I>>(object: I): GetFeedsResponse {
    const message = createBaseGetFeedsResponse();
    message.feeds = object.feeds?.map((e) => FeedItem.fromPartial(e)) || [];
    message.mostSoldModels = object.mostSoldModels?.map((e) => Model.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCondition(): Condition {
  return { id: "", name: "", nameAr: "", labelColor: "", textColor: "" };
}

export const Condition = {
  encode(message: Condition, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.nameAr !== "") {
      writer.uint32(26).string(message.nameAr);
    }
    if (message.labelColor !== "") {
      writer.uint32(34).string(message.labelColor);
    }
    if (message.textColor !== "") {
      writer.uint32(42).string(message.textColor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Condition {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCondition();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.nameAr = reader.string();
          break;
        case 4:
          message.labelColor = reader.string();
          break;
        case 5:
          message.textColor = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Condition {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      nameAr: isSet(object.nameAr) ? String(object.nameAr) : "",
      labelColor: isSet(object.labelColor) ? String(object.labelColor) : "",
      textColor: isSet(object.textColor) ? String(object.textColor) : "",
    };
  },

  toJSON(message: Condition): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.nameAr !== undefined && (obj.nameAr = message.nameAr);
    message.labelColor !== undefined && (obj.labelColor = message.labelColor);
    message.textColor !== undefined && (obj.textColor = message.textColor);
    return obj;
  },

  create<I extends Exact<DeepPartial<Condition>, I>>(base?: I): Condition {
    return Condition.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Condition>, I>>(object: I): Condition {
    const message = createBaseCondition();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.nameAr = object.nameAr ?? "";
    message.labelColor = object.labelColor ?? "";
    message.textColor = object.textColor ?? "";
    return message;
  },
};

function createBaseUpdatePenaltyFlagRequest(): UpdatePenaltyFlagRequest {
  return { sellerId: "" };
}

export const UpdatePenaltyFlagRequest = {
  encode(message: UpdatePenaltyFlagRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.sellerId !== "") {
      writer.uint32(10).string(message.sellerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePenaltyFlagRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePenaltyFlagRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellerId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePenaltyFlagRequest {
    return { sellerId: isSet(object.sellerId) ? String(object.sellerId) : "" };
  },

  toJSON(message: UpdatePenaltyFlagRequest): unknown {
    const obj: any = {};
    message.sellerId !== undefined && (obj.sellerId = message.sellerId);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdatePenaltyFlagRequest>, I>>(base?: I): UpdatePenaltyFlagRequest {
    return UpdatePenaltyFlagRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePenaltyFlagRequest>, I>>(object: I): UpdatePenaltyFlagRequest {
    const message = createBaseUpdatePenaltyFlagRequest();
    message.sellerId = object.sellerId ?? "";
    return message;
  },
};

function createBaseUpdatePenaltyFlagResponse(): UpdatePenaltyFlagResponse {
  return {};
}

export const UpdatePenaltyFlagResponse = {
  encode(_: UpdatePenaltyFlagResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePenaltyFlagResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePenaltyFlagResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdatePenaltyFlagResponse {
    return {};
  },

  toJSON(_: UpdatePenaltyFlagResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdatePenaltyFlagResponse>, I>>(base?: I): UpdatePenaltyFlagResponse {
    return UpdatePenaltyFlagResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePenaltyFlagResponse>, I>>(_: I): UpdatePenaltyFlagResponse {
    const message = createBaseUpdatePenaltyFlagResponse();
    return message;
  },
};

function createBaseGetInvoiceGenerationFlagRequest(): GetInvoiceGenerationFlagRequest {
  return { dmoId: "" };
}

export const GetInvoiceGenerationFlagRequest = {
  encode(message: GetInvoiceGenerationFlagRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.dmoId !== "") {
      writer.uint32(10).string(message.dmoId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInvoiceGenerationFlagRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInvoiceGenerationFlagRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dmoId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInvoiceGenerationFlagRequest {
    return { dmoId: isSet(object.dmoId) ? String(object.dmoId) : "" };
  },

  toJSON(message: GetInvoiceGenerationFlagRequest): unknown {
    const obj: any = {};
    message.dmoId !== undefined && (obj.dmoId = message.dmoId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetInvoiceGenerationFlagRequest>, I>>(base?: I): GetInvoiceGenerationFlagRequest {
    return GetInvoiceGenerationFlagRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetInvoiceGenerationFlagRequest>, I>>(
    object: I,
  ): GetInvoiceGenerationFlagRequest {
    const message = createBaseGetInvoiceGenerationFlagRequest();
    message.dmoId = object.dmoId ?? "";
    return message;
  },
};

function createBaseGetInvoiceGenerationFlagResponse(): GetInvoiceGenerationFlagResponse {
  return { isGenerated: false };
}

export const GetInvoiceGenerationFlagResponse = {
  encode(message: GetInvoiceGenerationFlagResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isGenerated === true) {
      writer.uint32(8).bool(message.isGenerated);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInvoiceGenerationFlagResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInvoiceGenerationFlagResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isGenerated = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInvoiceGenerationFlagResponse {
    return { isGenerated: isSet(object.isGenerated) ? Boolean(object.isGenerated) : false };
  },

  toJSON(message: GetInvoiceGenerationFlagResponse): unknown {
    const obj: any = {};
    message.isGenerated !== undefined && (obj.isGenerated = message.isGenerated);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetInvoiceGenerationFlagResponse>, I>>(
    base?: I,
  ): GetInvoiceGenerationFlagResponse {
    return GetInvoiceGenerationFlagResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetInvoiceGenerationFlagResponse>, I>>(
    object: I,
  ): GetInvoiceGenerationFlagResponse {
    const message = createBaseGetInvoiceGenerationFlagResponse();
    message.isGenerated = object.isGenerated ?? false;
    return message;
  },
};

function createBasePaymentOption(): PaymentOption {
  return { id: "", paymentProvider: "", paymentCardType: "", displayName: "" };
}

export const PaymentOption = {
  encode(message: PaymentOption, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.paymentProvider !== "") {
      writer.uint32(18).string(message.paymentProvider);
    }
    if (message.paymentCardType !== "") {
      writer.uint32(26).string(message.paymentCardType);
    }
    if (message.displayName !== "") {
      writer.uint32(34).string(message.displayName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PaymentOption {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePaymentOption();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.paymentProvider = reader.string();
          break;
        case 3:
          message.paymentCardType = reader.string();
          break;
        case 4:
          message.displayName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): PaymentOption {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      paymentProvider: isSet(object.paymentProvider) ? String(object.paymentProvider) : "",
      paymentCardType: isSet(object.paymentCardType) ? String(object.paymentCardType) : "",
      displayName: isSet(object.displayName) ? String(object.displayName) : "",
    };
  },

  toJSON(message: PaymentOption): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.paymentProvider !== undefined && (obj.paymentProvider = message.paymentProvider);
    message.paymentCardType !== undefined && (obj.paymentCardType = message.paymentCardType);
    message.displayName !== undefined && (obj.displayName = message.displayName);
    return obj;
  },

  create<I extends Exact<DeepPartial<PaymentOption>, I>>(base?: I): PaymentOption {
    return PaymentOption.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<PaymentOption>, I>>(object: I): PaymentOption {
    const message = createBasePaymentOption();
    message.id = object.id ?? "";
    message.paymentProvider = object.paymentProvider ?? "";
    message.paymentCardType = object.paymentCardType ?? "";
    message.displayName = object.displayName ?? "";
    return message;
  },
};

function createBaseTransactionResponse(): TransactionResponse {
  return {
    transactionId: "",
    checkoutId: "",
    checkoutURL: "",
    soumTransactionNumber: "",
    transactionStatusId: "",
    transactionType: "",
    paymentOptionId: "",
    operationId: undefined,
    totalAmount: 0,
    paymentOption: undefined,
    providerResponse: undefined,
  };
}

export const TransactionResponse = {
  encode(message: TransactionResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.transactionId !== "") {
      writer.uint32(10).string(message.transactionId);
    }
    if (message.checkoutId !== "") {
      writer.uint32(18).string(message.checkoutId);
    }
    if (message.checkoutURL !== "") {
      writer.uint32(26).string(message.checkoutURL);
    }
    if (message.soumTransactionNumber !== "") {
      writer.uint32(34).string(message.soumTransactionNumber);
    }
    if (message.transactionStatusId !== "") {
      writer.uint32(42).string(message.transactionStatusId);
    }
    if (message.transactionType !== "") {
      writer.uint32(50).string(message.transactionType);
    }
    if (message.paymentOptionId !== "") {
      writer.uint32(58).string(message.paymentOptionId);
    }
    if (message.operationId !== undefined) {
      writer.uint32(66).string(message.operationId);
    }
    if (message.totalAmount !== 0) {
      writer.uint32(73).double(message.totalAmount);
    }
    if (message.paymentOption !== undefined) {
      PaymentOption.encode(message.paymentOption, writer.uint32(82).fork()).ldelim();
    }
    if (message.providerResponse !== undefined) {
      writer.uint32(242).string(message.providerResponse);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TransactionResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTransactionResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.transactionId = reader.string();
          break;
        case 2:
          message.checkoutId = reader.string();
          break;
        case 3:
          message.checkoutURL = reader.string();
          break;
        case 4:
          message.soumTransactionNumber = reader.string();
          break;
        case 5:
          message.transactionStatusId = reader.string();
          break;
        case 6:
          message.transactionType = reader.string();
          break;
        case 7:
          message.paymentOptionId = reader.string();
          break;
        case 8:
          message.operationId = reader.string();
          break;
        case 9:
          message.totalAmount = reader.double();
          break;
        case 10:
          message.paymentOption = PaymentOption.decode(reader, reader.uint32());
          break;
        case 30:
          message.providerResponse = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TransactionResponse {
    return {
      transactionId: isSet(object.transactionId) ? String(object.transactionId) : "",
      checkoutId: isSet(object.checkoutId) ? String(object.checkoutId) : "",
      checkoutURL: isSet(object.checkoutURL) ? String(object.checkoutURL) : "",
      soumTransactionNumber: isSet(object.soumTransactionNumber) ? String(object.soumTransactionNumber) : "",
      transactionStatusId: isSet(object.transactionStatusId) ? String(object.transactionStatusId) : "",
      transactionType: isSet(object.transactionType) ? String(object.transactionType) : "",
      paymentOptionId: isSet(object.paymentOptionId) ? String(object.paymentOptionId) : "",
      operationId: isSet(object.operationId) ? String(object.operationId) : undefined,
      totalAmount: isSet(object.totalAmount) ? Number(object.totalAmount) : 0,
      paymentOption: isSet(object.paymentOption) ? PaymentOption.fromJSON(object.paymentOption) : undefined,
      providerResponse: isSet(object.providerResponse) ? String(object.providerResponse) : undefined,
    };
  },

  toJSON(message: TransactionResponse): unknown {
    const obj: any = {};
    message.transactionId !== undefined && (obj.transactionId = message.transactionId);
    message.checkoutId !== undefined && (obj.checkoutId = message.checkoutId);
    message.checkoutURL !== undefined && (obj.checkoutURL = message.checkoutURL);
    message.soumTransactionNumber !== undefined && (obj.soumTransactionNumber = message.soumTransactionNumber);
    message.transactionStatusId !== undefined && (obj.transactionStatusId = message.transactionStatusId);
    message.transactionType !== undefined && (obj.transactionType = message.transactionType);
    message.paymentOptionId !== undefined && (obj.paymentOptionId = message.paymentOptionId);
    message.operationId !== undefined && (obj.operationId = message.operationId);
    message.totalAmount !== undefined && (obj.totalAmount = message.totalAmount);
    message.paymentOption !== undefined &&
      (obj.paymentOption = message.paymentOption ? PaymentOption.toJSON(message.paymentOption) : undefined);
    message.providerResponse !== undefined && (obj.providerResponse = message.providerResponse);
    return obj;
  },

  create<I extends Exact<DeepPartial<TransactionResponse>, I>>(base?: I): TransactionResponse {
    return TransactionResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<TransactionResponse>, I>>(object: I): TransactionResponse {
    const message = createBaseTransactionResponse();
    message.transactionId = object.transactionId ?? "";
    message.checkoutId = object.checkoutId ?? "";
    message.checkoutURL = object.checkoutURL ?? "";
    message.soumTransactionNumber = object.soumTransactionNumber ?? "";
    message.transactionStatusId = object.transactionStatusId ?? "";
    message.transactionType = object.transactionType ?? "";
    message.paymentOptionId = object.paymentOptionId ?? "";
    message.operationId = object.operationId ?? undefined;
    message.totalAmount = object.totalAmount ?? 0;
    message.paymentOption = (object.paymentOption !== undefined && object.paymentOption !== null)
      ? PaymentOption.fromPartial(object.paymentOption)
      : undefined;
    message.providerResponse = object.providerResponse ?? undefined;
    return message;
  },
};

function createBaseUpdatePaymentStatusOfOrderRequest(): UpdatePaymentStatusOfOrderRequest {
  return { paymentId: "", paymentNumber: "", paymentProvider: "", transaction: undefined };
}

export const UpdatePaymentStatusOfOrderRequest = {
  encode(message: UpdatePaymentStatusOfOrderRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.paymentId !== "") {
      writer.uint32(10).string(message.paymentId);
    }
    if (message.paymentNumber !== "") {
      writer.uint32(18).string(message.paymentNumber);
    }
    if (message.paymentProvider !== "") {
      writer.uint32(26).string(message.paymentProvider);
    }
    if (message.transaction !== undefined) {
      TransactionResponse.encode(message.transaction, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePaymentStatusOfOrderRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePaymentStatusOfOrderRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.paymentId = reader.string();
          break;
        case 2:
          message.paymentNumber = reader.string();
          break;
        case 3:
          message.paymentProvider = reader.string();
          break;
        case 4:
          message.transaction = TransactionResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePaymentStatusOfOrderRequest {
    return {
      paymentId: isSet(object.paymentId) ? String(object.paymentId) : "",
      paymentNumber: isSet(object.paymentNumber) ? String(object.paymentNumber) : "",
      paymentProvider: isSet(object.paymentProvider) ? String(object.paymentProvider) : "",
      transaction: isSet(object.transaction) ? TransactionResponse.fromJSON(object.transaction) : undefined,
    };
  },

  toJSON(message: UpdatePaymentStatusOfOrderRequest): unknown {
    const obj: any = {};
    message.paymentId !== undefined && (obj.paymentId = message.paymentId);
    message.paymentNumber !== undefined && (obj.paymentNumber = message.paymentNumber);
    message.paymentProvider !== undefined && (obj.paymentProvider = message.paymentProvider);
    message.transaction !== undefined &&
      (obj.transaction = message.transaction ? TransactionResponse.toJSON(message.transaction) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdatePaymentStatusOfOrderRequest>, I>>(
    base?: I,
  ): UpdatePaymentStatusOfOrderRequest {
    return UpdatePaymentStatusOfOrderRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePaymentStatusOfOrderRequest>, I>>(
    object: I,
  ): UpdatePaymentStatusOfOrderRequest {
    const message = createBaseUpdatePaymentStatusOfOrderRequest();
    message.paymentId = object.paymentId ?? "";
    message.paymentNumber = object.paymentNumber ?? "";
    message.paymentProvider = object.paymentProvider ?? "";
    message.transaction = (object.transaction !== undefined && object.transaction !== null)
      ? TransactionResponse.fromPartial(object.transaction)
      : undefined;
    return message;
  },
};

function createBaseUpdatePaymentStatusOfOrderResponse(): UpdatePaymentStatusOfOrderResponse {
  return { orderTransactionStatus: "" };
}

export const UpdatePaymentStatusOfOrderResponse = {
  encode(message: UpdatePaymentStatusOfOrderResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderTransactionStatus !== "") {
      writer.uint32(10).string(message.orderTransactionStatus);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdatePaymentStatusOfOrderResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdatePaymentStatusOfOrderResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderTransactionStatus = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdatePaymentStatusOfOrderResponse {
    return {
      orderTransactionStatus: isSet(object.orderTransactionStatus) ? String(object.orderTransactionStatus) : "",
    };
  },

  toJSON(message: UpdatePaymentStatusOfOrderResponse): unknown {
    const obj: any = {};
    message.orderTransactionStatus !== undefined && (obj.orderTransactionStatus = message.orderTransactionStatus);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdatePaymentStatusOfOrderResponse>, I>>(
    base?: I,
  ): UpdatePaymentStatusOfOrderResponse {
    return UpdatePaymentStatusOfOrderResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdatePaymentStatusOfOrderResponse>, I>>(
    object: I,
  ): UpdatePaymentStatusOfOrderResponse {
    const message = createBaseUpdatePaymentStatusOfOrderResponse();
    message.orderTransactionStatus = object.orderTransactionStatus ?? "";
    return message;
  },
};

function createBaseGetRecentlySoldProductsRequest(): GetRecentlySoldProductsRequest {
  return { hours: 0, limit: 0, offset: 0, categoryId: undefined, getSpecificCategory: undefined };
}

export const GetRecentlySoldProductsRequest = {
  encode(message: GetRecentlySoldProductsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.hours !== 0) {
      writer.uint32(8).int32(message.hours);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.offset !== 0) {
      writer.uint32(24).int32(message.offset);
    }
    if (message.categoryId !== undefined) {
      writer.uint32(34).string(message.categoryId);
    }
    if (message.getSpecificCategory !== undefined) {
      writer.uint32(40).bool(message.getSpecificCategory);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetRecentlySoldProductsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetRecentlySoldProductsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.hours = reader.int32();
          break;
        case 2:
          message.limit = reader.int32();
          break;
        case 3:
          message.offset = reader.int32();
          break;
        case 4:
          message.categoryId = reader.string();
          break;
        case 5:
          message.getSpecificCategory = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetRecentlySoldProductsRequest {
    return {
      hours: isSet(object.hours) ? Number(object.hours) : 0,
      limit: isSet(object.limit) ? Number(object.limit) : 0,
      offset: isSet(object.offset) ? Number(object.offset) : 0,
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : undefined,
      getSpecificCategory: isSet(object.getSpecificCategory) ? Boolean(object.getSpecificCategory) : undefined,
    };
  },

  toJSON(message: GetRecentlySoldProductsRequest): unknown {
    const obj: any = {};
    message.hours !== undefined && (obj.hours = Math.round(message.hours));
    message.limit !== undefined && (obj.limit = Math.round(message.limit));
    message.offset !== undefined && (obj.offset = Math.round(message.offset));
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    message.getSpecificCategory !== undefined && (obj.getSpecificCategory = message.getSpecificCategory);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetRecentlySoldProductsRequest>, I>>(base?: I): GetRecentlySoldProductsRequest {
    return GetRecentlySoldProductsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetRecentlySoldProductsRequest>, I>>(
    object: I,
  ): GetRecentlySoldProductsRequest {
    const message = createBaseGetRecentlySoldProductsRequest();
    message.hours = object.hours ?? 0;
    message.limit = object.limit ?? 0;
    message.offset = object.offset ?? 0;
    message.categoryId = object.categoryId ?? undefined;
    message.getSpecificCategory = object.getSpecificCategory ?? undefined;
    return message;
  },
};

function createBaseGetSellerBadgeRequest(): GetSellerBadgeRequest {
  return { userId: "" };
}

export const GetSellerBadgeRequest = {
  encode(message: GetSellerBadgeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetSellerBadgeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSellerBadgeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSellerBadgeRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: GetSellerBadgeRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetSellerBadgeRequest>, I>>(base?: I): GetSellerBadgeRequest {
    return GetSellerBadgeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetSellerBadgeRequest>, I>>(object: I): GetSellerBadgeRequest {
    const message = createBaseGetSellerBadgeRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetSellerBadgeResponse(): GetSellerBadgeResponse {
  return { activateTenDaysGuarantee: false, isSFPaid: false, hasHighFRate: false };
}

export const GetSellerBadgeResponse = {
  encode(message: GetSellerBadgeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activateTenDaysGuarantee === true) {
      writer.uint32(8).bool(message.activateTenDaysGuarantee);
    }
    if (message.isSFPaid === true) {
      writer.uint32(16).bool(message.isSFPaid);
    }
    if (message.hasHighFRate === true) {
      writer.uint32(24).bool(message.hasHighFRate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetSellerBadgeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSellerBadgeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activateTenDaysGuarantee = reader.bool();
          break;
        case 2:
          message.isSFPaid = reader.bool();
          break;
        case 3:
          message.hasHighFRate = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSellerBadgeResponse {
    return {
      activateTenDaysGuarantee: isSet(object.activateTenDaysGuarantee)
        ? Boolean(object.activateTenDaysGuarantee)
        : false,
      isSFPaid: isSet(object.isSFPaid) ? Boolean(object.isSFPaid) : false,
      hasHighFRate: isSet(object.hasHighFRate) ? Boolean(object.hasHighFRate) : false,
    };
  },

  toJSON(message: GetSellerBadgeResponse): unknown {
    const obj: any = {};
    message.activateTenDaysGuarantee !== undefined && (obj.activateTenDaysGuarantee = message.activateTenDaysGuarantee);
    message.isSFPaid !== undefined && (obj.isSFPaid = message.isSFPaid);
    message.hasHighFRate !== undefined && (obj.hasHighFRate = message.hasHighFRate);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetSellerBadgeResponse>, I>>(base?: I): GetSellerBadgeResponse {
    return GetSellerBadgeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetSellerBadgeResponse>, I>>(object: I): GetSellerBadgeResponse {
    const message = createBaseGetSellerBadgeResponse();
    message.activateTenDaysGuarantee = object.activateTenDaysGuarantee ?? false;
    message.isSFPaid = object.isSFPaid ?? false;
    message.hasHighFRate = object.hasHighFRate ?? false;
    return message;
  },
};

function createBaseFetchInvoiceGenerationDataRequest(): FetchInvoiceGenerationDataRequest {
  return { orderId: "", type: "" };
}

export const FetchInvoiceGenerationDataRequest = {
  encode(message: FetchInvoiceGenerationDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchInvoiceGenerationDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchInvoiceGenerationDataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FetchInvoiceGenerationDataRequest {
    return {
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      type: isSet(object.type) ? String(object.type) : "",
    };
  },

  toJSON(message: FetchInvoiceGenerationDataRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.type !== undefined && (obj.type = message.type);
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchInvoiceGenerationDataRequest>, I>>(
    base?: I,
  ): FetchInvoiceGenerationDataRequest {
    return FetchInvoiceGenerationDataRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchInvoiceGenerationDataRequest>, I>>(
    object: I,
  ): FetchInvoiceGenerationDataRequest {
    const message = createBaseFetchInvoiceGenerationDataRequest();
    message.orderId = object.orderId ?? "";
    message.type = object.type ?? "";
    return message;
  },
};

function createBaseFetchInvoiceGenerationDataResponse(): FetchInvoiceGenerationDataResponse {
  return {
    billType: "",
    issueDate: "",
    billTo: "",
    billedByCOR: "",
    billedBySeller: "",
    ZATCAInvoiceNo: "",
    dateOfSupply: "",
    seller: undefined,
    buyer: undefined,
    order: undefined,
    product: undefined,
  };
}

export const FetchInvoiceGenerationDataResponse = {
  encode(message: FetchInvoiceGenerationDataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.billType !== "") {
      writer.uint32(10).string(message.billType);
    }
    if (message.issueDate !== "") {
      writer.uint32(18).string(message.issueDate);
    }
    if (message.billTo !== "") {
      writer.uint32(26).string(message.billTo);
    }
    if (message.billedByCOR !== "") {
      writer.uint32(34).string(message.billedByCOR);
    }
    if (message.billedBySeller !== "") {
      writer.uint32(42).string(message.billedBySeller);
    }
    if (message.ZATCAInvoiceNo !== "") {
      writer.uint32(50).string(message.ZATCAInvoiceNo);
    }
    if (message.dateOfSupply !== "") {
      writer.uint32(58).string(message.dateOfSupply);
    }
    if (message.seller !== undefined) {
      FetchInvoiceGenerationDataResponse_User.encode(message.seller, writer.uint32(66).fork()).ldelim();
    }
    if (message.buyer !== undefined) {
      FetchInvoiceGenerationDataResponse_User.encode(message.buyer, writer.uint32(74).fork()).ldelim();
    }
    if (message.order !== undefined) {
      FetchInvoiceGenerationDataResponse_OrderCalculationSumamry.encode(message.order, writer.uint32(82).fork())
        .ldelim();
    }
    if (message.product !== undefined) {
      FetchInvoiceGenerationDataResponse_Product.encode(message.product, writer.uint32(90).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchInvoiceGenerationDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchInvoiceGenerationDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.billType = reader.string();
          break;
        case 2:
          message.issueDate = reader.string();
          break;
        case 3:
          message.billTo = reader.string();
          break;
        case 4:
          message.billedByCOR = reader.string();
          break;
        case 5:
          message.billedBySeller = reader.string();
          break;
        case 6:
          message.ZATCAInvoiceNo = reader.string();
          break;
        case 7:
          message.dateOfSupply = reader.string();
          break;
        case 8:
          message.seller = FetchInvoiceGenerationDataResponse_User.decode(reader, reader.uint32());
          break;
        case 9:
          message.buyer = FetchInvoiceGenerationDataResponse_User.decode(reader, reader.uint32());
          break;
        case 10:
          message.order = FetchInvoiceGenerationDataResponse_OrderCalculationSumamry.decode(reader, reader.uint32());
          break;
        case 11:
          message.product = FetchInvoiceGenerationDataResponse_Product.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FetchInvoiceGenerationDataResponse {
    return {
      billType: isSet(object.billType) ? String(object.billType) : "",
      issueDate: isSet(object.issueDate) ? String(object.issueDate) : "",
      billTo: isSet(object.billTo) ? String(object.billTo) : "",
      billedByCOR: isSet(object.billedByCOR) ? String(object.billedByCOR) : "",
      billedBySeller: isSet(object.billedBySeller) ? String(object.billedBySeller) : "",
      ZATCAInvoiceNo: isSet(object.ZATCAInvoiceNo) ? String(object.ZATCAInvoiceNo) : "",
      dateOfSupply: isSet(object.dateOfSupply) ? String(object.dateOfSupply) : "",
      seller: isSet(object.seller) ? FetchInvoiceGenerationDataResponse_User.fromJSON(object.seller) : undefined,
      buyer: isSet(object.buyer) ? FetchInvoiceGenerationDataResponse_User.fromJSON(object.buyer) : undefined,
      order: isSet(object.order)
        ? FetchInvoiceGenerationDataResponse_OrderCalculationSumamry.fromJSON(object.order)
        : undefined,
      product: isSet(object.product) ? FetchInvoiceGenerationDataResponse_Product.fromJSON(object.product) : undefined,
    };
  },

  toJSON(message: FetchInvoiceGenerationDataResponse): unknown {
    const obj: any = {};
    message.billType !== undefined && (obj.billType = message.billType);
    message.issueDate !== undefined && (obj.issueDate = message.issueDate);
    message.billTo !== undefined && (obj.billTo = message.billTo);
    message.billedByCOR !== undefined && (obj.billedByCOR = message.billedByCOR);
    message.billedBySeller !== undefined && (obj.billedBySeller = message.billedBySeller);
    message.ZATCAInvoiceNo !== undefined && (obj.ZATCAInvoiceNo = message.ZATCAInvoiceNo);
    message.dateOfSupply !== undefined && (obj.dateOfSupply = message.dateOfSupply);
    message.seller !== undefined &&
      (obj.seller = message.seller ? FetchInvoiceGenerationDataResponse_User.toJSON(message.seller) : undefined);
    message.buyer !== undefined &&
      (obj.buyer = message.buyer ? FetchInvoiceGenerationDataResponse_User.toJSON(message.buyer) : undefined);
    message.order !== undefined && (obj.order = message.order
      ? FetchInvoiceGenerationDataResponse_OrderCalculationSumamry.toJSON(message.order)
      : undefined);
    message.product !== undefined &&
      (obj.product = message.product ? FetchInvoiceGenerationDataResponse_Product.toJSON(message.product) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse>, I>>(
    base?: I,
  ): FetchInvoiceGenerationDataResponse {
    return FetchInvoiceGenerationDataResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse>, I>>(
    object: I,
  ): FetchInvoiceGenerationDataResponse {
    const message = createBaseFetchInvoiceGenerationDataResponse();
    message.billType = object.billType ?? "";
    message.issueDate = object.issueDate ?? "";
    message.billTo = object.billTo ?? "";
    message.billedByCOR = object.billedByCOR ?? "";
    message.billedBySeller = object.billedBySeller ?? "";
    message.ZATCAInvoiceNo = object.ZATCAInvoiceNo ?? "";
    message.dateOfSupply = object.dateOfSupply ?? "";
    message.seller = (object.seller !== undefined && object.seller !== null)
      ? FetchInvoiceGenerationDataResponse_User.fromPartial(object.seller)
      : undefined;
    message.buyer = (object.buyer !== undefined && object.buyer !== null)
      ? FetchInvoiceGenerationDataResponse_User.fromPartial(object.buyer)
      : undefined;
    message.order = (object.order !== undefined && object.order !== null)
      ? FetchInvoiceGenerationDataResponse_OrderCalculationSumamry.fromPartial(object.order)
      : undefined;
    message.product = (object.product !== undefined && object.product !== null)
      ? FetchInvoiceGenerationDataResponse_Product.fromPartial(object.product)
      : undefined;
    return message;
  },
};

function createBaseFetchInvoiceGenerationDataResponse_User(): FetchInvoiceGenerationDataResponse_User {
  return { id: "", name: "", address: undefined };
}

export const FetchInvoiceGenerationDataResponse_User = {
  encode(message: FetchInvoiceGenerationDataResponse_User, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.name !== "") {
      writer.uint32(18).string(message.name);
    }
    if (message.address !== undefined) {
      Address.encode(message.address, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchInvoiceGenerationDataResponse_User {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchInvoiceGenerationDataResponse_User();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.name = reader.string();
          break;
        case 3:
          message.address = Address.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FetchInvoiceGenerationDataResponse_User {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      name: isSet(object.name) ? String(object.name) : "",
      address: isSet(object.address) ? Address.fromJSON(object.address) : undefined,
    };
  },

  toJSON(message: FetchInvoiceGenerationDataResponse_User): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.name !== undefined && (obj.name = message.name);
    message.address !== undefined && (obj.address = message.address ? Address.toJSON(message.address) : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_User>, I>>(
    base?: I,
  ): FetchInvoiceGenerationDataResponse_User {
    return FetchInvoiceGenerationDataResponse_User.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_User>, I>>(
    object: I,
  ): FetchInvoiceGenerationDataResponse_User {
    const message = createBaseFetchInvoiceGenerationDataResponse_User();
    message.id = object.id ?? "";
    message.name = object.name ?? "";
    message.address = (object.address !== undefined && object.address !== null)
      ? Address.fromPartial(object.address)
      : undefined;
    return message;
  },
};

function createBaseFetchInvoiceGenerationDataResponse_OrderCalculationSumamry(): FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
  return {
    commission: 0,
    vat: 0,
    deliveryFee: 0,
    deliveryFeeVAT: 0,
    penaltyFee: 0,
    discount: 0,
    grandTotal: 0,
    orderId: "",
    orderNumber: "",
    totalVAT: 0,
    totalTaxableAmount: 0,
  };
}

export const FetchInvoiceGenerationDataResponse_OrderCalculationSumamry = {
  encode(
    message: FetchInvoiceGenerationDataResponse_OrderCalculationSumamry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.commission !== 0) {
      writer.uint32(13).float(message.commission);
    }
    if (message.vat !== 0) {
      writer.uint32(21).float(message.vat);
    }
    if (message.deliveryFee !== 0) {
      writer.uint32(29).float(message.deliveryFee);
    }
    if (message.deliveryFeeVAT !== 0) {
      writer.uint32(37).float(message.deliveryFeeVAT);
    }
    if (message.penaltyFee !== 0) {
      writer.uint32(45).float(message.penaltyFee);
    }
    if (message.discount !== 0) {
      writer.uint32(53).float(message.discount);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(61).float(message.grandTotal);
    }
    if (message.orderId !== "") {
      writer.uint32(66).string(message.orderId);
    }
    if (message.orderNumber !== "") {
      writer.uint32(74).string(message.orderNumber);
    }
    if (message.totalVAT !== 0) {
      writer.uint32(85).float(message.totalVAT);
    }
    if (message.totalTaxableAmount !== 0) {
      writer.uint32(93).float(message.totalTaxableAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchInvoiceGenerationDataResponse_OrderCalculationSumamry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.commission = reader.float();
          break;
        case 2:
          message.vat = reader.float();
          break;
        case 3:
          message.deliveryFee = reader.float();
          break;
        case 4:
          message.deliveryFeeVAT = reader.float();
          break;
        case 5:
          message.penaltyFee = reader.float();
          break;
        case 6:
          message.discount = reader.float();
          break;
        case 7:
          message.grandTotal = reader.float();
          break;
        case 8:
          message.orderId = reader.string();
          break;
        case 9:
          message.orderNumber = reader.string();
          break;
        case 10:
          message.totalVAT = reader.float();
          break;
        case 11:
          message.totalTaxableAmount = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
    return {
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      vat: isSet(object.vat) ? Number(object.vat) : 0,
      deliveryFee: isSet(object.deliveryFee) ? Number(object.deliveryFee) : 0,
      deliveryFeeVAT: isSet(object.deliveryFeeVAT) ? Number(object.deliveryFeeVAT) : 0,
      penaltyFee: isSet(object.penaltyFee) ? Number(object.penaltyFee) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
      totalVAT: isSet(object.totalVAT) ? Number(object.totalVAT) : 0,
      totalTaxableAmount: isSet(object.totalTaxableAmount) ? Number(object.totalTaxableAmount) : 0,
    };
  },

  toJSON(message: FetchInvoiceGenerationDataResponse_OrderCalculationSumamry): unknown {
    const obj: any = {};
    message.commission !== undefined && (obj.commission = message.commission);
    message.vat !== undefined && (obj.vat = message.vat);
    message.deliveryFee !== undefined && (obj.deliveryFee = message.deliveryFee);
    message.deliveryFeeVAT !== undefined && (obj.deliveryFeeVAT = message.deliveryFeeVAT);
    message.penaltyFee !== undefined && (obj.penaltyFee = message.penaltyFee);
    message.discount !== undefined && (obj.discount = message.discount);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    message.totalVAT !== undefined && (obj.totalVAT = message.totalVAT);
    message.totalTaxableAmount !== undefined && (obj.totalTaxableAmount = message.totalTaxableAmount);
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_OrderCalculationSumamry>, I>>(
    base?: I,
  ): FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
    return FetchInvoiceGenerationDataResponse_OrderCalculationSumamry.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_OrderCalculationSumamry>, I>>(
    object: I,
  ): FetchInvoiceGenerationDataResponse_OrderCalculationSumamry {
    const message = createBaseFetchInvoiceGenerationDataResponse_OrderCalculationSumamry();
    message.commission = object.commission ?? 0;
    message.vat = object.vat ?? 0;
    message.deliveryFee = object.deliveryFee ?? 0;
    message.deliveryFeeVAT = object.deliveryFeeVAT ?? 0;
    message.penaltyFee = object.penaltyFee ?? 0;
    message.discount = object.discount ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    message.orderId = object.orderId ?? "";
    message.orderNumber = object.orderNumber ?? "";
    message.totalVAT = object.totalVAT ?? 0;
    message.totalTaxableAmount = object.totalTaxableAmount ?? 0;
    return message;
  },
};

function createBaseFetchInvoiceGenerationDataResponse_ItemCalculationSumamry(): FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
  return { unitPrice: 0, commission: 0, vat: 0, discount: 0, grandTotal: 0, quantity: 0 };
}

export const FetchInvoiceGenerationDataResponse_ItemCalculationSumamry = {
  encode(
    message: FetchInvoiceGenerationDataResponse_ItemCalculationSumamry,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.unitPrice !== 0) {
      writer.uint32(13).float(message.unitPrice);
    }
    if (message.commission !== 0) {
      writer.uint32(21).float(message.commission);
    }
    if (message.vat !== 0) {
      writer.uint32(29).float(message.vat);
    }
    if (message.discount !== 0) {
      writer.uint32(37).float(message.discount);
    }
    if (message.grandTotal !== 0) {
      writer.uint32(45).float(message.grandTotal);
    }
    if (message.quantity !== 0) {
      writer.uint32(48).int32(message.quantity);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchInvoiceGenerationDataResponse_ItemCalculationSumamry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.unitPrice = reader.float();
          break;
        case 2:
          message.commission = reader.float();
          break;
        case 3:
          message.vat = reader.float();
          break;
        case 4:
          message.discount = reader.float();
          break;
        case 5:
          message.grandTotal = reader.float();
          break;
        case 6:
          message.quantity = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
    return {
      unitPrice: isSet(object.unitPrice) ? Number(object.unitPrice) : 0,
      commission: isSet(object.commission) ? Number(object.commission) : 0,
      vat: isSet(object.vat) ? Number(object.vat) : 0,
      discount: isSet(object.discount) ? Number(object.discount) : 0,
      grandTotal: isSet(object.grandTotal) ? Number(object.grandTotal) : 0,
      quantity: isSet(object.quantity) ? Number(object.quantity) : 0,
    };
  },

  toJSON(message: FetchInvoiceGenerationDataResponse_ItemCalculationSumamry): unknown {
    const obj: any = {};
    message.unitPrice !== undefined && (obj.unitPrice = message.unitPrice);
    message.commission !== undefined && (obj.commission = message.commission);
    message.vat !== undefined && (obj.vat = message.vat);
    message.discount !== undefined && (obj.discount = message.discount);
    message.grandTotal !== undefined && (obj.grandTotal = message.grandTotal);
    message.quantity !== undefined && (obj.quantity = Math.round(message.quantity));
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_ItemCalculationSumamry>, I>>(
    base?: I,
  ): FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
    return FetchInvoiceGenerationDataResponse_ItemCalculationSumamry.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_ItemCalculationSumamry>, I>>(
    object: I,
  ): FetchInvoiceGenerationDataResponse_ItemCalculationSumamry {
    const message = createBaseFetchInvoiceGenerationDataResponse_ItemCalculationSumamry();
    message.unitPrice = object.unitPrice ?? 0;
    message.commission = object.commission ?? 0;
    message.vat = object.vat ?? 0;
    message.discount = object.discount ?? 0;
    message.grandTotal = object.grandTotal ?? 0;
    message.quantity = object.quantity ?? 0;
    return message;
  },
};

function createBaseFetchInvoiceGenerationDataResponse_Product(): FetchInvoiceGenerationDataResponse_Product {
  return { productId: "", nameAR: "", nameEN: "", item: undefined };
}

export const FetchInvoiceGenerationDataResponse_Product = {
  encode(message: FetchInvoiceGenerationDataResponse_Product, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    if (message.nameAR !== "") {
      writer.uint32(18).string(message.nameAR);
    }
    if (message.nameEN !== "") {
      writer.uint32(26).string(message.nameEN);
    }
    if (message.item !== undefined) {
      FetchInvoiceGenerationDataResponse_ItemCalculationSumamry.encode(message.item, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FetchInvoiceGenerationDataResponse_Product {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchInvoiceGenerationDataResponse_Product();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        case 2:
          message.nameAR = reader.string();
          break;
        case 3:
          message.nameEN = reader.string();
          break;
        case 4:
          message.item = FetchInvoiceGenerationDataResponse_ItemCalculationSumamry.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FetchInvoiceGenerationDataResponse_Product {
    return {
      productId: isSet(object.productId) ? String(object.productId) : "",
      nameAR: isSet(object.nameAR) ? String(object.nameAR) : "",
      nameEN: isSet(object.nameEN) ? String(object.nameEN) : "",
      item: isSet(object.item)
        ? FetchInvoiceGenerationDataResponse_ItemCalculationSumamry.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: FetchInvoiceGenerationDataResponse_Product): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    message.nameAR !== undefined && (obj.nameAR = message.nameAR);
    message.nameEN !== undefined && (obj.nameEN = message.nameEN);
    message.item !== undefined && (obj.item = message.item
      ? FetchInvoiceGenerationDataResponse_ItemCalculationSumamry.toJSON(message.item)
      : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_Product>, I>>(
    base?: I,
  ): FetchInvoiceGenerationDataResponse_Product {
    return FetchInvoiceGenerationDataResponse_Product.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<FetchInvoiceGenerationDataResponse_Product>, I>>(
    object: I,
  ): FetchInvoiceGenerationDataResponse_Product {
    const message = createBaseFetchInvoiceGenerationDataResponse_Product();
    message.productId = object.productId ?? "";
    message.nameAR = object.nameAR ?? "";
    message.nameEN = object.nameEN ?? "";
    message.item = (object.item !== undefined && object.item !== null)
      ? FetchInvoiceGenerationDataResponse_ItemCalculationSumamry.fromPartial(object.item)
      : undefined;
    return message;
  },
};

function createBaseGetOrderSaleAnalyticsRequest(): GetOrderSaleAnalyticsRequest {
  return { merchantId: "", range: "" };
}

export const GetOrderSaleAnalyticsRequest = {
  encode(message: GetOrderSaleAnalyticsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merchantId !== "") {
      writer.uint32(10).string(message.merchantId);
    }
    if (message.range !== "") {
      writer.uint32(18).string(message.range);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderSaleAnalyticsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderSaleAnalyticsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.merchantId = reader.string();
          break;
        case 2:
          message.range = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderSaleAnalyticsRequest {
    return {
      merchantId: isSet(object.merchantId) ? String(object.merchantId) : "",
      range: isSet(object.range) ? String(object.range) : "",
    };
  },

  toJSON(message: GetOrderSaleAnalyticsRequest): unknown {
    const obj: any = {};
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    message.range !== undefined && (obj.range = message.range);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderSaleAnalyticsRequest>, I>>(base?: I): GetOrderSaleAnalyticsRequest {
    return GetOrderSaleAnalyticsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderSaleAnalyticsRequest>, I>>(object: I): GetOrderSaleAnalyticsRequest {
    const message = createBaseGetOrderSaleAnalyticsRequest();
    message.merchantId = object.merchantId ?? "";
    message.range = object.range ?? "";
    return message;
  },
};

function createBaseGetOrderSaleAnalyticsResponse(): GetOrderSaleAnalyticsResponse {
  return { data: [], totalTransactions: 0, totalAmountOverall: 0 };
}

export const GetOrderSaleAnalyticsResponse = {
  encode(message: GetOrderSaleAnalyticsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.data) {
      GetOrderSaleAnalyticsResponse_TotalsByStatusResponse.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalTransactions !== 0) {
      writer.uint32(21).float(message.totalTransactions);
    }
    if (message.totalAmountOverall !== 0) {
      writer.uint32(29).float(message.totalAmountOverall);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderSaleAnalyticsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderSaleAnalyticsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(GetOrderSaleAnalyticsResponse_TotalsByStatusResponse.decode(reader, reader.uint32()));
          break;
        case 2:
          message.totalTransactions = reader.float();
          break;
        case 3:
          message.totalAmountOverall = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderSaleAnalyticsResponse {
    return {
      data: Array.isArray(object?.data)
        ? object.data.map((e: any) => GetOrderSaleAnalyticsResponse_TotalsByStatusResponse.fromJSON(e))
        : [],
      totalTransactions: isSet(object.totalTransactions) ? Number(object.totalTransactions) : 0,
      totalAmountOverall: isSet(object.totalAmountOverall) ? Number(object.totalAmountOverall) : 0,
    };
  },

  toJSON(message: GetOrderSaleAnalyticsResponse): unknown {
    const obj: any = {};
    if (message.data) {
      obj.data = message.data.map((e) =>
        e ? GetOrderSaleAnalyticsResponse_TotalsByStatusResponse.toJSON(e) : undefined
      );
    } else {
      obj.data = [];
    }
    message.totalTransactions !== undefined && (obj.totalTransactions = message.totalTransactions);
    message.totalAmountOverall !== undefined && (obj.totalAmountOverall = message.totalAmountOverall);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderSaleAnalyticsResponse>, I>>(base?: I): GetOrderSaleAnalyticsResponse {
    return GetOrderSaleAnalyticsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderSaleAnalyticsResponse>, I>>(
    object: I,
  ): GetOrderSaleAnalyticsResponse {
    const message = createBaseGetOrderSaleAnalyticsResponse();
    message.data = object.data?.map((e) => GetOrderSaleAnalyticsResponse_TotalsByStatusResponse.fromPartial(e)) || [];
    message.totalTransactions = object.totalTransactions ?? 0;
    message.totalAmountOverall = object.totalAmountOverall ?? 0;
    return message;
  },
};

function createBaseGetOrderSaleAnalyticsResponse_TotalsByStatusResponse(): GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
  return { statusName: "", totalAmount: 0, transaction: 0 };
}

export const GetOrderSaleAnalyticsResponse_TotalsByStatusResponse = {
  encode(
    message: GetOrderSaleAnalyticsResponse_TotalsByStatusResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.statusName !== "") {
      writer.uint32(10).string(message.statusName);
    }
    if (message.totalAmount !== 0) {
      writer.uint32(21).float(message.totalAmount);
    }
    if (message.transaction !== 0) {
      writer.uint32(29).float(message.transaction);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderSaleAnalyticsResponse_TotalsByStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.statusName = reader.string();
          break;
        case 2:
          message.totalAmount = reader.float();
          break;
        case 3:
          message.transaction = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
    return {
      statusName: isSet(object.statusName) ? String(object.statusName) : "",
      totalAmount: isSet(object.totalAmount) ? Number(object.totalAmount) : 0,
      transaction: isSet(object.transaction) ? Number(object.transaction) : 0,
    };
  },

  toJSON(message: GetOrderSaleAnalyticsResponse_TotalsByStatusResponse): unknown {
    const obj: any = {};
    message.statusName !== undefined && (obj.statusName = message.statusName);
    message.totalAmount !== undefined && (obj.totalAmount = message.totalAmount);
    message.transaction !== undefined && (obj.transaction = message.transaction);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderSaleAnalyticsResponse_TotalsByStatusResponse>, I>>(
    base?: I,
  ): GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
    return GetOrderSaleAnalyticsResponse_TotalsByStatusResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderSaleAnalyticsResponse_TotalsByStatusResponse>, I>>(
    object: I,
  ): GetOrderSaleAnalyticsResponse_TotalsByStatusResponse {
    const message = createBaseGetOrderSaleAnalyticsResponse_TotalsByStatusResponse();
    message.statusName = object.statusName ?? "";
    message.totalAmount = object.totalAmount ?? 0;
    message.transaction = object.transaction ?? 0;
    return message;
  },
};

function createBaseGetPendingPayoutAnalyticsRequest(): GetPendingPayoutAnalyticsRequest {
  return { merchantId: "" };
}

export const GetPendingPayoutAnalyticsRequest = {
  encode(message: GetPendingPayoutAnalyticsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merchantId !== "") {
      writer.uint32(10).string(message.merchantId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPendingPayoutAnalyticsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPendingPayoutAnalyticsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.merchantId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPendingPayoutAnalyticsRequest {
    return { merchantId: isSet(object.merchantId) ? String(object.merchantId) : "" };
  },

  toJSON(message: GetPendingPayoutAnalyticsRequest): unknown {
    const obj: any = {};
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPendingPayoutAnalyticsRequest>, I>>(
    base?: I,
  ): GetPendingPayoutAnalyticsRequest {
    return GetPendingPayoutAnalyticsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPendingPayoutAnalyticsRequest>, I>>(
    object: I,
  ): GetPendingPayoutAnalyticsRequest {
    const message = createBaseGetPendingPayoutAnalyticsRequest();
    message.merchantId = object.merchantId ?? "";
    return message;
  },
};

function createBaseGetPendingPayoutAnalyticsResponse(): GetPendingPayoutAnalyticsResponse {
  return { merchantId: "", totalAmount: 0 };
}

export const GetPendingPayoutAnalyticsResponse = {
  encode(message: GetPendingPayoutAnalyticsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merchantId !== "") {
      writer.uint32(10).string(message.merchantId);
    }
    if (message.totalAmount !== 0) {
      writer.uint32(21).float(message.totalAmount);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPendingPayoutAnalyticsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPendingPayoutAnalyticsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.merchantId = reader.string();
          break;
        case 2:
          message.totalAmount = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPendingPayoutAnalyticsResponse {
    return {
      merchantId: isSet(object.merchantId) ? String(object.merchantId) : "",
      totalAmount: isSet(object.totalAmount) ? Number(object.totalAmount) : 0,
    };
  },

  toJSON(message: GetPendingPayoutAnalyticsResponse): unknown {
    const obj: any = {};
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    message.totalAmount !== undefined && (obj.totalAmount = message.totalAmount);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPendingPayoutAnalyticsResponse>, I>>(
    base?: I,
  ): GetPendingPayoutAnalyticsResponse {
    return GetPendingPayoutAnalyticsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPendingPayoutAnalyticsResponse>, I>>(
    object: I,
  ): GetPendingPayoutAnalyticsResponse {
    const message = createBaseGetPendingPayoutAnalyticsResponse();
    message.merchantId = object.merchantId ?? "";
    message.totalAmount = object.totalAmount ?? 0;
    return message;
  },
};

function createBaseGetPendingPayoutPaginationRequest(): GetPendingPayoutPaginationRequest {
  return { merchantId: "", search: "", page: 0, size: 0 };
}

export const GetPendingPayoutPaginationRequest = {
  encode(message: GetPendingPayoutPaginationRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merchantId !== "") {
      writer.uint32(10).string(message.merchantId);
    }
    if (message.search !== "") {
      writer.uint32(18).string(message.search);
    }
    if (message.page !== 0) {
      writer.uint32(24).int32(message.page);
    }
    if (message.size !== 0) {
      writer.uint32(32).int32(message.size);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPendingPayoutPaginationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPendingPayoutPaginationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.merchantId = reader.string();
          break;
        case 2:
          message.search = reader.string();
          break;
        case 3:
          message.page = reader.int32();
          break;
        case 4:
          message.size = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPendingPayoutPaginationRequest {
    return {
      merchantId: isSet(object.merchantId) ? String(object.merchantId) : "",
      search: isSet(object.search) ? String(object.search) : "",
      page: isSet(object.page) ? Number(object.page) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
    };
  },

  toJSON(message: GetPendingPayoutPaginationRequest): unknown {
    const obj: any = {};
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    message.search !== undefined && (obj.search = message.search);
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.size !== undefined && (obj.size = Math.round(message.size));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPendingPayoutPaginationRequest>, I>>(
    base?: I,
  ): GetPendingPayoutPaginationRequest {
    return GetPendingPayoutPaginationRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPendingPayoutPaginationRequest>, I>>(
    object: I,
  ): GetPendingPayoutPaginationRequest {
    const message = createBaseGetPendingPayoutPaginationRequest();
    message.merchantId = object.merchantId ?? "";
    message.search = object.search ?? "";
    message.page = object.page ?? 0;
    message.size = object.size ?? 0;
    return message;
  },
};

function createBaseGetPendingPayoutPaginationResponse(): GetPendingPayoutPaginationResponse {
  return { payouts: [], totalItems: 0, totalPages: 0, currentPage: 0 };
}

export const GetPendingPayoutPaginationResponse = {
  encode(message: GetPendingPayoutPaginationResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.payouts) {
      GetPendingPayoutPaginationResponse_PayoutDetails.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalItems !== 0) {
      writer.uint32(16).int32(message.totalItems);
    }
    if (message.totalPages !== 0) {
      writer.uint32(24).int32(message.totalPages);
    }
    if (message.currentPage !== 0) {
      writer.uint32(32).int32(message.currentPage);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPendingPayoutPaginationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPendingPayoutPaginationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.payouts.push(GetPendingPayoutPaginationResponse_PayoutDetails.decode(reader, reader.uint32()));
          break;
        case 2:
          message.totalItems = reader.int32();
          break;
        case 3:
          message.totalPages = reader.int32();
          break;
        case 4:
          message.currentPage = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPendingPayoutPaginationResponse {
    return {
      payouts: Array.isArray(object?.payouts)
        ? object.payouts.map((e: any) => GetPendingPayoutPaginationResponse_PayoutDetails.fromJSON(e))
        : [],
      totalItems: isSet(object.totalItems) ? Number(object.totalItems) : 0,
      totalPages: isSet(object.totalPages) ? Number(object.totalPages) : 0,
      currentPage: isSet(object.currentPage) ? Number(object.currentPage) : 0,
    };
  },

  toJSON(message: GetPendingPayoutPaginationResponse): unknown {
    const obj: any = {};
    if (message.payouts) {
      obj.payouts = message.payouts.map((e) =>
        e ? GetPendingPayoutPaginationResponse_PayoutDetails.toJSON(e) : undefined
      );
    } else {
      obj.payouts = [];
    }
    message.totalItems !== undefined && (obj.totalItems = Math.round(message.totalItems));
    message.totalPages !== undefined && (obj.totalPages = Math.round(message.totalPages));
    message.currentPage !== undefined && (obj.currentPage = Math.round(message.currentPage));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPendingPayoutPaginationResponse>, I>>(
    base?: I,
  ): GetPendingPayoutPaginationResponse {
    return GetPendingPayoutPaginationResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPendingPayoutPaginationResponse>, I>>(
    object: I,
  ): GetPendingPayoutPaginationResponse {
    const message = createBaseGetPendingPayoutPaginationResponse();
    message.payouts = object.payouts?.map((e) => GetPendingPayoutPaginationResponse_PayoutDetails.fromPartial(e)) || [];
    message.totalItems = object.totalItems ?? 0;
    message.totalPages = object.totalPages ?? 0;
    message.currentPage = object.currentPage ?? 0;
    return message;
  },
};

function createBaseGetPendingPayoutPaginationResponse_PayoutDetails(): GetPendingPayoutPaginationResponse_PayoutDetails {
  return { productName: "", productNameAR: "", payoutAmount: "", orderNumber: "" };
}

export const GetPendingPayoutPaginationResponse_PayoutDetails = {
  encode(
    message: GetPendingPayoutPaginationResponse_PayoutDetails,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.productName !== "") {
      writer.uint32(10).string(message.productName);
    }
    if (message.productNameAR !== "") {
      writer.uint32(18).string(message.productNameAR);
    }
    if (message.payoutAmount !== "") {
      writer.uint32(26).string(message.payoutAmount);
    }
    if (message.orderNumber !== "") {
      writer.uint32(34).string(message.orderNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPendingPayoutPaginationResponse_PayoutDetails {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPendingPayoutPaginationResponse_PayoutDetails();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productName = reader.string();
          break;
        case 2:
          message.productNameAR = reader.string();
          break;
        case 3:
          message.payoutAmount = reader.string();
          break;
        case 4:
          message.orderNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPendingPayoutPaginationResponse_PayoutDetails {
    return {
      productName: isSet(object.productName) ? String(object.productName) : "",
      productNameAR: isSet(object.productNameAR) ? String(object.productNameAR) : "",
      payoutAmount: isSet(object.payoutAmount) ? String(object.payoutAmount) : "",
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
    };
  },

  toJSON(message: GetPendingPayoutPaginationResponse_PayoutDetails): unknown {
    const obj: any = {};
    message.productName !== undefined && (obj.productName = message.productName);
    message.productNameAR !== undefined && (obj.productNameAR = message.productNameAR);
    message.payoutAmount !== undefined && (obj.payoutAmount = message.payoutAmount);
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPendingPayoutPaginationResponse_PayoutDetails>, I>>(
    base?: I,
  ): GetPendingPayoutPaginationResponse_PayoutDetails {
    return GetPendingPayoutPaginationResponse_PayoutDetails.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPendingPayoutPaginationResponse_PayoutDetails>, I>>(
    object: I,
  ): GetPendingPayoutPaginationResponse_PayoutDetails {
    const message = createBaseGetPendingPayoutPaginationResponse_PayoutDetails();
    message.productName = object.productName ?? "";
    message.productNameAR = object.productNameAR ?? "";
    message.payoutAmount = object.payoutAmount ?? "";
    message.orderNumber = object.orderNumber ?? "";
    return message;
  },
};

function createBaseGetPenalizedOrdersRequest(): GetPenalizedOrdersRequest {
  return { dmoIds: [], page: 0, size: 0, range: "" };
}

export const GetPenalizedOrdersRequest = {
  encode(message: GetPenalizedOrdersRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.dmoIds) {
      writer.uint32(10).string(v!);
    }
    if (message.page !== 0) {
      writer.uint32(16).int32(message.page);
    }
    if (message.size !== 0) {
      writer.uint32(24).int32(message.size);
    }
    if (message.range !== "") {
      writer.uint32(34).string(message.range);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPenalizedOrdersRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPenalizedOrdersRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.dmoIds.push(reader.string());
          break;
        case 2:
          message.page = reader.int32();
          break;
        case 3:
          message.size = reader.int32();
          break;
        case 4:
          message.range = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPenalizedOrdersRequest {
    return {
      dmoIds: Array.isArray(object?.dmoIds) ? object.dmoIds.map((e: any) => String(e)) : [],
      page: isSet(object.page) ? Number(object.page) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
      range: isSet(object.range) ? String(object.range) : "",
    };
  },

  toJSON(message: GetPenalizedOrdersRequest): unknown {
    const obj: any = {};
    if (message.dmoIds) {
      obj.dmoIds = message.dmoIds.map((e) => e);
    } else {
      obj.dmoIds = [];
    }
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.size !== undefined && (obj.size = Math.round(message.size));
    message.range !== undefined && (obj.range = message.range);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPenalizedOrdersRequest>, I>>(base?: I): GetPenalizedOrdersRequest {
    return GetPenalizedOrdersRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPenalizedOrdersRequest>, I>>(object: I): GetPenalizedOrdersRequest {
    const message = createBaseGetPenalizedOrdersRequest();
    message.dmoIds = object.dmoIds?.map((e) => e) || [];
    message.page = object.page ?? 0;
    message.size = object.size ?? 0;
    message.range = object.range ?? "";
    return message;
  },
};

function createBaseGetPenalizedOrdersResponse(): GetPenalizedOrdersResponse {
  return { orders: [], totalItems: 0, totalPages: 0, currentPage: 0, pageSize: 0 };
}

export const GetPenalizedOrdersResponse = {
  encode(message: GetPenalizedOrdersResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.orders) {
      GetPenalizedOrdersResponse_PenalizedOrders.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalItems !== 0) {
      writer.uint32(16).int32(message.totalItems);
    }
    if (message.totalPages !== 0) {
      writer.uint32(24).int32(message.totalPages);
    }
    if (message.currentPage !== 0) {
      writer.uint32(32).int32(message.currentPage);
    }
    if (message.pageSize !== 0) {
      writer.uint32(40).int32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPenalizedOrdersResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPenalizedOrdersResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orders.push(GetPenalizedOrdersResponse_PenalizedOrders.decode(reader, reader.uint32()));
          break;
        case 2:
          message.totalItems = reader.int32();
          break;
        case 3:
          message.totalPages = reader.int32();
          break;
        case 4:
          message.currentPage = reader.int32();
          break;
        case 5:
          message.pageSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPenalizedOrdersResponse {
    return {
      orders: Array.isArray(object?.orders)
        ? object.orders.map((e: any) => GetPenalizedOrdersResponse_PenalizedOrders.fromJSON(e))
        : [],
      totalItems: isSet(object.totalItems) ? Number(object.totalItems) : 0,
      totalPages: isSet(object.totalPages) ? Number(object.totalPages) : 0,
      currentPage: isSet(object.currentPage) ? Number(object.currentPage) : 0,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
    };
  },

  toJSON(message: GetPenalizedOrdersResponse): unknown {
    const obj: any = {};
    if (message.orders) {
      obj.orders = message.orders.map((e) => e ? GetPenalizedOrdersResponse_PenalizedOrders.toJSON(e) : undefined);
    } else {
      obj.orders = [];
    }
    message.totalItems !== undefined && (obj.totalItems = Math.round(message.totalItems));
    message.totalPages !== undefined && (obj.totalPages = Math.round(message.totalPages));
    message.currentPage !== undefined && (obj.currentPage = Math.round(message.currentPage));
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPenalizedOrdersResponse>, I>>(base?: I): GetPenalizedOrdersResponse {
    return GetPenalizedOrdersResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPenalizedOrdersResponse>, I>>(object: I): GetPenalizedOrdersResponse {
    const message = createBaseGetPenalizedOrdersResponse();
    message.orders = object.orders?.map((e) => GetPenalizedOrdersResponse_PenalizedOrders.fromPartial(e)) || [];
    message.totalItems = object.totalItems ?? 0;
    message.totalPages = object.totalPages ?? 0;
    message.currentPage = object.currentPage ?? 0;
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseGetPenalizedOrdersResponse_PenalizedOrders(): GetPenalizedOrdersResponse_PenalizedOrders {
  return {
    productName: "",
    orderNumber: "",
    payoutAmount: 0,
    penalty: 0,
    finalPayout: 0,
    nctReason: "",
    nctReasonAR: "",
    dmoId: "",
  };
}

export const GetPenalizedOrdersResponse_PenalizedOrders = {
  encode(message: GetPenalizedOrdersResponse_PenalizedOrders, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.productName !== "") {
      writer.uint32(10).string(message.productName);
    }
    if (message.orderNumber !== "") {
      writer.uint32(18).string(message.orderNumber);
    }
    if (message.payoutAmount !== 0) {
      writer.uint32(29).float(message.payoutAmount);
    }
    if (message.penalty !== 0) {
      writer.uint32(37).float(message.penalty);
    }
    if (message.finalPayout !== 0) {
      writer.uint32(45).float(message.finalPayout);
    }
    if (message.nctReason !== "") {
      writer.uint32(50).string(message.nctReason);
    }
    if (message.nctReasonAR !== "") {
      writer.uint32(58).string(message.nctReasonAR);
    }
    if (message.dmoId !== "") {
      writer.uint32(66).string(message.dmoId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetPenalizedOrdersResponse_PenalizedOrders {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetPenalizedOrdersResponse_PenalizedOrders();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productName = reader.string();
          break;
        case 2:
          message.orderNumber = reader.string();
          break;
        case 3:
          message.payoutAmount = reader.float();
          break;
        case 4:
          message.penalty = reader.float();
          break;
        case 5:
          message.finalPayout = reader.float();
          break;
        case 6:
          message.nctReason = reader.string();
          break;
        case 7:
          message.nctReasonAR = reader.string();
          break;
        case 8:
          message.dmoId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetPenalizedOrdersResponse_PenalizedOrders {
    return {
      productName: isSet(object.productName) ? String(object.productName) : "",
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
      payoutAmount: isSet(object.payoutAmount) ? Number(object.payoutAmount) : 0,
      penalty: isSet(object.penalty) ? Number(object.penalty) : 0,
      finalPayout: isSet(object.finalPayout) ? Number(object.finalPayout) : 0,
      nctReason: isSet(object.nctReason) ? String(object.nctReason) : "",
      nctReasonAR: isSet(object.nctReasonAR) ? String(object.nctReasonAR) : "",
      dmoId: isSet(object.dmoId) ? String(object.dmoId) : "",
    };
  },

  toJSON(message: GetPenalizedOrdersResponse_PenalizedOrders): unknown {
    const obj: any = {};
    message.productName !== undefined && (obj.productName = message.productName);
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    message.payoutAmount !== undefined && (obj.payoutAmount = message.payoutAmount);
    message.penalty !== undefined && (obj.penalty = message.penalty);
    message.finalPayout !== undefined && (obj.finalPayout = message.finalPayout);
    message.nctReason !== undefined && (obj.nctReason = message.nctReason);
    message.nctReasonAR !== undefined && (obj.nctReasonAR = message.nctReasonAR);
    message.dmoId !== undefined && (obj.dmoId = message.dmoId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetPenalizedOrdersResponse_PenalizedOrders>, I>>(
    base?: I,
  ): GetPenalizedOrdersResponse_PenalizedOrders {
    return GetPenalizedOrdersResponse_PenalizedOrders.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetPenalizedOrdersResponse_PenalizedOrders>, I>>(
    object: I,
  ): GetPenalizedOrdersResponse_PenalizedOrders {
    const message = createBaseGetPenalizedOrdersResponse_PenalizedOrders();
    message.productName = object.productName ?? "";
    message.orderNumber = object.orderNumber ?? "";
    message.payoutAmount = object.payoutAmount ?? 0;
    message.penalty = object.penalty ?? 0;
    message.finalPayout = object.finalPayout ?? 0;
    message.nctReason = object.nctReason ?? "";
    message.nctReasonAR = object.nctReasonAR ?? "";
    message.dmoId = object.dmoId ?? "";
    return message;
  },
};

function createBaseGetCompletionRateUserRequest(): GetCompletionRateUserRequest {
  return { userId: "", range: "" };
}

export const GetCompletionRateUserRequest = {
  encode(message: GetCompletionRateUserRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.range !== "") {
      writer.uint32(18).string(message.range);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCompletionRateUserRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCompletionRateUserRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.range = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCompletionRateUserRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      range: isSet(object.range) ? String(object.range) : "",
    };
  },

  toJSON(message: GetCompletionRateUserRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.range !== undefined && (obj.range = message.range);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCompletionRateUserRequest>, I>>(base?: I): GetCompletionRateUserRequest {
    return GetCompletionRateUserRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCompletionRateUserRequest>, I>>(object: I): GetCompletionRateUserRequest {
    const message = createBaseGetCompletionRateUserRequest();
    message.userId = object.userId ?? "";
    message.range = object.range ?? "";
    return message;
  },
};

function createBaseGetCompletionRateUserResponse(): GetCompletionRateUserResponse {
  return { completionRate: 0 };
}

export const GetCompletionRateUserResponse = {
  encode(message: GetCompletionRateUserResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.completionRate !== 0) {
      writer.uint32(13).float(message.completionRate);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCompletionRateUserResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCompletionRateUserResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.completionRate = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCompletionRateUserResponse {
    return { completionRate: isSet(object.completionRate) ? Number(object.completionRate) : 0 };
  },

  toJSON(message: GetCompletionRateUserResponse): unknown {
    const obj: any = {};
    message.completionRate !== undefined && (obj.completionRate = message.completionRate);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCompletionRateUserResponse>, I>>(base?: I): GetCompletionRateUserResponse {
    return GetCompletionRateUserResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCompletionRateUserResponse>, I>>(
    object: I,
  ): GetCompletionRateUserResponse {
    const message = createBaseGetCompletionRateUserResponse();
    message.completionRate = object.completionRate ?? 0;
    return message;
  },
};

function createBaseGetTopSellingProductModelsRequest(): GetTopSellingProductModelsRequest {
  return { merchantId: "", range: "", sorting: "", page: 0, size: 0 };
}

export const GetTopSellingProductModelsRequest = {
  encode(message: GetTopSellingProductModelsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.merchantId !== "") {
      writer.uint32(10).string(message.merchantId);
    }
    if (message.range !== "") {
      writer.uint32(18).string(message.range);
    }
    if (message.sorting !== "") {
      writer.uint32(26).string(message.sorting);
    }
    if (message.page !== 0) {
      writer.uint32(32).int32(message.page);
    }
    if (message.size !== 0) {
      writer.uint32(40).int32(message.size);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTopSellingProductModelsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTopSellingProductModelsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.merchantId = reader.string();
          break;
        case 2:
          message.range = reader.string();
          break;
        case 3:
          message.sorting = reader.string();
          break;
        case 4:
          message.page = reader.int32();
          break;
        case 5:
          message.size = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTopSellingProductModelsRequest {
    return {
      merchantId: isSet(object.merchantId) ? String(object.merchantId) : "",
      range: isSet(object.range) ? String(object.range) : "",
      sorting: isSet(object.sorting) ? String(object.sorting) : "",
      page: isSet(object.page) ? Number(object.page) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
    };
  },

  toJSON(message: GetTopSellingProductModelsRequest): unknown {
    const obj: any = {};
    message.merchantId !== undefined && (obj.merchantId = message.merchantId);
    message.range !== undefined && (obj.range = message.range);
    message.sorting !== undefined && (obj.sorting = message.sorting);
    message.page !== undefined && (obj.page = Math.round(message.page));
    message.size !== undefined && (obj.size = Math.round(message.size));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTopSellingProductModelsRequest>, I>>(
    base?: I,
  ): GetTopSellingProductModelsRequest {
    return GetTopSellingProductModelsRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTopSellingProductModelsRequest>, I>>(
    object: I,
  ): GetTopSellingProductModelsRequest {
    const message = createBaseGetTopSellingProductModelsRequest();
    message.merchantId = object.merchantId ?? "";
    message.range = object.range ?? "";
    message.sorting = object.sorting ?? "";
    message.page = object.page ?? 0;
    message.size = object.size ?? 0;
    return message;
  },
};

function createBaseGetTopSellingProductModelsResponse(): GetTopSellingProductModelsResponse {
  return { products: [], totalItems: 0, totalPages: 0, currentPage: 0, pageSize: 0 };
}

export const GetTopSellingProductModelsResponse = {
  encode(message: GetTopSellingProductModelsResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.products) {
      GetTopSellingProductModelsResponse_TopSellingProduct.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.totalItems !== 0) {
      writer.uint32(16).int32(message.totalItems);
    }
    if (message.totalPages !== 0) {
      writer.uint32(24).int32(message.totalPages);
    }
    if (message.currentPage !== 0) {
      writer.uint32(32).int32(message.currentPage);
    }
    if (message.pageSize !== 0) {
      writer.uint32(40).int32(message.pageSize);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTopSellingProductModelsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTopSellingProductModelsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.products.push(GetTopSellingProductModelsResponse_TopSellingProduct.decode(reader, reader.uint32()));
          break;
        case 2:
          message.totalItems = reader.int32();
          break;
        case 3:
          message.totalPages = reader.int32();
          break;
        case 4:
          message.currentPage = reader.int32();
          break;
        case 5:
          message.pageSize = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTopSellingProductModelsResponse {
    return {
      products: Array.isArray(object?.products)
        ? object.products.map((e: any) => GetTopSellingProductModelsResponse_TopSellingProduct.fromJSON(e))
        : [],
      totalItems: isSet(object.totalItems) ? Number(object.totalItems) : 0,
      totalPages: isSet(object.totalPages) ? Number(object.totalPages) : 0,
      currentPage: isSet(object.currentPage) ? Number(object.currentPage) : 0,
      pageSize: isSet(object.pageSize) ? Number(object.pageSize) : 0,
    };
  },

  toJSON(message: GetTopSellingProductModelsResponse): unknown {
    const obj: any = {};
    if (message.products) {
      obj.products = message.products.map((e) =>
        e ? GetTopSellingProductModelsResponse_TopSellingProduct.toJSON(e) : undefined
      );
    } else {
      obj.products = [];
    }
    message.totalItems !== undefined && (obj.totalItems = Math.round(message.totalItems));
    message.totalPages !== undefined && (obj.totalPages = Math.round(message.totalPages));
    message.currentPage !== undefined && (obj.currentPage = Math.round(message.currentPage));
    message.pageSize !== undefined && (obj.pageSize = Math.round(message.pageSize));
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTopSellingProductModelsResponse>, I>>(
    base?: I,
  ): GetTopSellingProductModelsResponse {
    return GetTopSellingProductModelsResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTopSellingProductModelsResponse>, I>>(
    object: I,
  ): GetTopSellingProductModelsResponse {
    const message = createBaseGetTopSellingProductModelsResponse();
    message.products =
      object.products?.map((e) => GetTopSellingProductModelsResponse_TopSellingProduct.fromPartial(e)) || [];
    message.totalItems = object.totalItems ?? 0;
    message.totalPages = object.totalPages ?? 0;
    message.currentPage = object.currentPage ?? 0;
    message.pageSize = object.pageSize ?? 0;
    return message;
  },
};

function createBaseGetTopSellingProductModelsResponse_TopSellingProduct(): GetTopSellingProductModelsResponse_TopSellingProduct {
  return { modelName: "", varient: "", totalSales: 0, modelIcon: "", modelNameAR: "", totalAmount: 0, varientAR: "" };
}

export const GetTopSellingProductModelsResponse_TopSellingProduct = {
  encode(
    message: GetTopSellingProductModelsResponse_TopSellingProduct,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.modelName !== "") {
      writer.uint32(10).string(message.modelName);
    }
    if (message.varient !== "") {
      writer.uint32(18).string(message.varient);
    }
    if (message.totalSales !== 0) {
      writer.uint32(24).int32(message.totalSales);
    }
    if (message.modelIcon !== "") {
      writer.uint32(34).string(message.modelIcon);
    }
    if (message.modelNameAR !== "") {
      writer.uint32(42).string(message.modelNameAR);
    }
    if (message.totalAmount !== 0) {
      writer.uint32(53).float(message.totalAmount);
    }
    if (message.varientAR !== "") {
      writer.uint32(58).string(message.varientAR);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTopSellingProductModelsResponse_TopSellingProduct {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTopSellingProductModelsResponse_TopSellingProduct();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.modelName = reader.string();
          break;
        case 2:
          message.varient = reader.string();
          break;
        case 3:
          message.totalSales = reader.int32();
          break;
        case 4:
          message.modelIcon = reader.string();
          break;
        case 5:
          message.modelNameAR = reader.string();
          break;
        case 6:
          message.totalAmount = reader.float();
          break;
        case 7:
          message.varientAR = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTopSellingProductModelsResponse_TopSellingProduct {
    return {
      modelName: isSet(object.modelName) ? String(object.modelName) : "",
      varient: isSet(object.varient) ? String(object.varient) : "",
      totalSales: isSet(object.totalSales) ? Number(object.totalSales) : 0,
      modelIcon: isSet(object.modelIcon) ? String(object.modelIcon) : "",
      modelNameAR: isSet(object.modelNameAR) ? String(object.modelNameAR) : "",
      totalAmount: isSet(object.totalAmount) ? Number(object.totalAmount) : 0,
      varientAR: isSet(object.varientAR) ? String(object.varientAR) : "",
    };
  },

  toJSON(message: GetTopSellingProductModelsResponse_TopSellingProduct): unknown {
    const obj: any = {};
    message.modelName !== undefined && (obj.modelName = message.modelName);
    message.varient !== undefined && (obj.varient = message.varient);
    message.totalSales !== undefined && (obj.totalSales = Math.round(message.totalSales));
    message.modelIcon !== undefined && (obj.modelIcon = message.modelIcon);
    message.modelNameAR !== undefined && (obj.modelNameAR = message.modelNameAR);
    message.totalAmount !== undefined && (obj.totalAmount = message.totalAmount);
    message.varientAR !== undefined && (obj.varientAR = message.varientAR);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetTopSellingProductModelsResponse_TopSellingProduct>, I>>(
    base?: I,
  ): GetTopSellingProductModelsResponse_TopSellingProduct {
    return GetTopSellingProductModelsResponse_TopSellingProduct.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetTopSellingProductModelsResponse_TopSellingProduct>, I>>(
    object: I,
  ): GetTopSellingProductModelsResponse_TopSellingProduct {
    const message = createBaseGetTopSellingProductModelsResponse_TopSellingProduct();
    message.modelName = object.modelName ?? "";
    message.varient = object.varient ?? "";
    message.totalSales = object.totalSales ?? 0;
    message.modelIcon = object.modelIcon ?? "";
    message.modelNameAR = object.modelNameAR ?? "";
    message.totalAmount = object.totalAmount ?? 0;
    message.varientAR = object.varientAR ?? "";
    return message;
  },
};

function createBaseSetUserOTPRequest(): SetUserOTPRequest {
  return { countryCode: "", mobileNumber: "", otp: "" };
}

export const SetUserOTPRequest = {
  encode(message: SetUserOTPRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.countryCode !== "") {
      writer.uint32(10).string(message.countryCode);
    }
    if (message.mobileNumber !== "") {
      writer.uint32(18).string(message.mobileNumber);
    }
    if (message.otp !== "") {
      writer.uint32(26).string(message.otp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetUserOTPRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetUserOTPRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.countryCode = reader.string();
          break;
        case 2:
          message.mobileNumber = reader.string();
          break;
        case 3:
          message.otp = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SetUserOTPRequest {
    return {
      countryCode: isSet(object.countryCode) ? String(object.countryCode) : "",
      mobileNumber: isSet(object.mobileNumber) ? String(object.mobileNumber) : "",
      otp: isSet(object.otp) ? String(object.otp) : "",
    };
  },

  toJSON(message: SetUserOTPRequest): unknown {
    const obj: any = {};
    message.countryCode !== undefined && (obj.countryCode = message.countryCode);
    message.mobileNumber !== undefined && (obj.mobileNumber = message.mobileNumber);
    message.otp !== undefined && (obj.otp = message.otp);
    return obj;
  },

  create<I extends Exact<DeepPartial<SetUserOTPRequest>, I>>(base?: I): SetUserOTPRequest {
    return SetUserOTPRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetUserOTPRequest>, I>>(object: I): SetUserOTPRequest {
    const message = createBaseSetUserOTPRequest();
    message.countryCode = object.countryCode ?? "";
    message.mobileNumber = object.mobileNumber ?? "";
    message.otp = object.otp ?? "";
    return message;
  },
};

function createBaseSetUserOTPResponse(): SetUserOTPResponse {
  return { status: false };
}

export const SetUserOTPResponse = {
  encode(message: SetUserOTPResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SetUserOTPResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSetUserOTPResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SetUserOTPResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: SetUserOTPResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<SetUserOTPResponse>, I>>(base?: I): SetUserOTPResponse {
    return SetUserOTPResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SetUserOTPResponse>, I>>(object: I): SetUserOTPResponse {
    const message = createBaseSetUserOTPResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseCheckUserOTPRequest(): CheckUserOTPRequest {
  return { userId: "", otp: "" };
}

export const CheckUserOTPRequest = {
  encode(message: CheckUserOTPRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.otp !== "") {
      writer.uint32(18).string(message.otp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckUserOTPRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckUserOTPRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.otp = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckUserOTPRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      otp: isSet(object.otp) ? String(object.otp) : "",
    };
  },

  toJSON(message: CheckUserOTPRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.otp !== undefined && (obj.otp = message.otp);
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckUserOTPRequest>, I>>(base?: I): CheckUserOTPRequest {
    return CheckUserOTPRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CheckUserOTPRequest>, I>>(object: I): CheckUserOTPRequest {
    const message = createBaseCheckUserOTPRequest();
    message.userId = object.userId ?? "";
    message.otp = object.otp ?? "";
    return message;
  },
};

function createBaseCheckUserOTPResponse(): CheckUserOTPResponse {
  return { status: false };
}

export const CheckUserOTPResponse = {
  encode(message: CheckUserOTPResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.status === true) {
      writer.uint32(8).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CheckUserOTPResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCheckUserOTPResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CheckUserOTPResponse {
    return { status: isSet(object.status) ? Boolean(object.status) : false };
  },

  toJSON(message: CheckUserOTPResponse): unknown {
    const obj: any = {};
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<CheckUserOTPResponse>, I>>(base?: I): CheckUserOTPResponse {
    return CheckUserOTPResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CheckUserOTPResponse>, I>>(object: I): CheckUserOTPResponse {
    const message = createBaseCheckUserOTPResponse();
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseSMSATracking(): SMSATracking {
  return { id: "", inspectionStatus: "", inspectionCenter: "", trackingNumber: "" };
}

export const SMSATracking = {
  encode(message: SMSATracking, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.inspectionStatus !== "") {
      writer.uint32(18).string(message.inspectionStatus);
    }
    if (message.inspectionCenter !== "") {
      writer.uint32(26).string(message.inspectionCenter);
    }
    if (message.trackingNumber !== "") {
      writer.uint32(34).string(message.trackingNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SMSATracking {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSMSATracking();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.inspectionStatus = reader.string();
          break;
        case 3:
          message.inspectionCenter = reader.string();
          break;
        case 4:
          message.trackingNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SMSATracking {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      inspectionStatus: isSet(object.inspectionStatus) ? String(object.inspectionStatus) : "",
      inspectionCenter: isSet(object.inspectionCenter) ? String(object.inspectionCenter) : "",
      trackingNumber: isSet(object.trackingNumber) ? String(object.trackingNumber) : "",
    };
  },

  toJSON(message: SMSATracking): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.inspectionStatus !== undefined && (obj.inspectionStatus = message.inspectionStatus);
    message.inspectionCenter !== undefined && (obj.inspectionCenter = message.inspectionCenter);
    message.trackingNumber !== undefined && (obj.trackingNumber = message.trackingNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<SMSATracking>, I>>(base?: I): SMSATracking {
    return SMSATracking.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SMSATracking>, I>>(object: I): SMSATracking {
    const message = createBaseSMSATracking();
    message.id = object.id ?? "";
    message.inspectionStatus = object.inspectionStatus ?? "";
    message.inspectionCenter = object.inspectionCenter ?? "";
    message.trackingNumber = object.trackingNumber ?? "";
    return message;
  },
};

function createBaseCreateSMSATracking(): CreateSMSATracking {
  return { trackingData: [] };
}

export const CreateSMSATracking = {
  encode(message: CreateSMSATracking, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.trackingData) {
      SMSATracking.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateSMSATracking {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateSMSATracking();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.trackingData.push(SMSATracking.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateSMSATracking {
    return {
      trackingData: Array.isArray(object?.trackingData)
        ? object.trackingData.map((e: any) => SMSATracking.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CreateSMSATracking): unknown {
    const obj: any = {};
    if (message.trackingData) {
      obj.trackingData = message.trackingData.map((e) => e ? SMSATracking.toJSON(e) : undefined);
    } else {
      obj.trackingData = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<CreateSMSATracking>, I>>(base?: I): CreateSMSATracking {
    return CreateSMSATracking.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<CreateSMSATracking>, I>>(object: I): CreateSMSATracking {
    const message = createBaseCreateSMSATracking();
    message.trackingData = object.trackingData?.map((e) => SMSATracking.fromPartial(e)) || [];
    return message;
  },
};

function createBaseUpdateOrderAttributeRequest(): UpdateOrderAttributeRequest {
  return { orderId: "" };
}

export const UpdateOrderAttributeRequest = {
  encode(message: UpdateOrderAttributeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateOrderAttributeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateOrderAttributeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateOrderAttributeRequest {
    return { orderId: isSet(object.orderId) ? String(object.orderId) : "" };
  },

  toJSON(message: UpdateOrderAttributeRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateOrderAttributeRequest>, I>>(base?: I): UpdateOrderAttributeRequest {
    return UpdateOrderAttributeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateOrderAttributeRequest>, I>>(object: I): UpdateOrderAttributeRequest {
    const message = createBaseUpdateOrderAttributeRequest();
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseUpdateOrderAttributeResponse(): UpdateOrderAttributeResponse {
  return { message: "" };
}

export const UpdateOrderAttributeResponse = {
  encode(message: UpdateOrderAttributeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.message !== "") {
      writer.uint32(10).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateOrderAttributeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateOrderAttributeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.message = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateOrderAttributeResponse {
    return { message: isSet(object.message) ? String(object.message) : "" };
  },

  toJSON(message: UpdateOrderAttributeResponse): unknown {
    const obj: any = {};
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateOrderAttributeResponse>, I>>(base?: I): UpdateOrderAttributeResponse {
    return UpdateOrderAttributeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateOrderAttributeResponse>, I>>(object: I): UpdateOrderAttributeResponse {
    const message = createBaseUpdateOrderAttributeResponse();
    message.message = object.message ?? "";
    return message;
  },
};

function createBaseGetOrderDetailByUserTypeRequest(): GetOrderDetailByUserTypeRequest {
  return { orderId: "", userType: "" };
}

export const GetOrderDetailByUserTypeRequest = {
  encode(message: GetOrderDetailByUserTypeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderId !== "") {
      writer.uint32(10).string(message.orderId);
    }
    if (message.userType !== "") {
      writer.uint32(18).string(message.userType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderDetailByUserTypeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderDetailByUserTypeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderId = reader.string();
          break;
        case 2:
          message.userType = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderDetailByUserTypeRequest {
    return {
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
      userType: isSet(object.userType) ? String(object.userType) : "",
    };
  },

  toJSON(message: GetOrderDetailByUserTypeRequest): unknown {
    const obj: any = {};
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.userType !== undefined && (obj.userType = message.userType);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderDetailByUserTypeRequest>, I>>(base?: I): GetOrderDetailByUserTypeRequest {
    return GetOrderDetailByUserTypeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderDetailByUserTypeRequest>, I>>(
    object: I,
  ): GetOrderDetailByUserTypeRequest {
    const message = createBaseGetOrderDetailByUserTypeRequest();
    message.orderId = object.orderId ?? "";
    message.userType = object.userType ?? "";
    return message;
  },
};

function createBaseGetListingFeesRequest(): GetListingFeesRequest {
  return {};
}

export const GetListingFeesRequest = {
  encode(_: GetListingFeesRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetListingFeesRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetListingFeesRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetListingFeesRequest {
    return {};
  },

  toJSON(_: GetListingFeesRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<GetListingFeesRequest>, I>>(base?: I): GetListingFeesRequest {
    return GetListingFeesRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetListingFeesRequest>, I>>(_: I): GetListingFeesRequest {
    const message = createBaseGetListingFeesRequest();
    return message;
  },
};

function createBaseGetListingFeesResponse(): GetListingFeesResponse {
  return { amount: 0, isActive: false };
}

export const GetListingFeesResponse = {
  encode(message: GetListingFeesResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.amount !== 0) {
      writer.uint32(13).float(message.amount);
    }
    if (message.isActive === true) {
      writer.uint32(16).bool(message.isActive);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetListingFeesResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetListingFeesResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.amount = reader.float();
          break;
        case 2:
          message.isActive = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetListingFeesResponse {
    return {
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      isActive: isSet(object.isActive) ? Boolean(object.isActive) : false,
    };
  },

  toJSON(message: GetListingFeesResponse): unknown {
    const obj: any = {};
    message.amount !== undefined && (obj.amount = message.amount);
    message.isActive !== undefined && (obj.isActive = message.isActive);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetListingFeesResponse>, I>>(base?: I): GetListingFeesResponse {
    return GetListingFeesResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetListingFeesResponse>, I>>(object: I): GetListingFeesResponse {
    const message = createBaseGetListingFeesResponse();
    message.amount = object.amount ?? 0;
    message.isActive = object.isActive ?? false;
    return message;
  },
};

function createBaseUpdateSecurityFeeRequest(): UpdateSecurityFeeRequest {
  return { userId: "", amount: 0, isOptIn: false };
}

export const UpdateSecurityFeeRequest = {
  encode(message: UpdateSecurityFeeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.amount !== 0) {
      writer.uint32(21).float(message.amount);
    }
    if (message.isOptIn === true) {
      writer.uint32(24).bool(message.isOptIn);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateSecurityFeeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateSecurityFeeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.amount = reader.float();
          break;
        case 3:
          message.isOptIn = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateSecurityFeeRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      amount: isSet(object.amount) ? Number(object.amount) : 0,
      isOptIn: isSet(object.isOptIn) ? Boolean(object.isOptIn) : false,
    };
  },

  toJSON(message: UpdateSecurityFeeRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.amount !== undefined && (obj.amount = message.amount);
    message.isOptIn !== undefined && (obj.isOptIn = message.isOptIn);
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateSecurityFeeRequest>, I>>(base?: I): UpdateSecurityFeeRequest {
    return UpdateSecurityFeeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateSecurityFeeRequest>, I>>(object: I): UpdateSecurityFeeRequest {
    const message = createBaseUpdateSecurityFeeRequest();
    message.userId = object.userId ?? "";
    message.amount = object.amount ?? 0;
    message.isOptIn = object.isOptIn ?? false;
    return message;
  },
};

function createBaseUpdateSecurityFeeResponse(): UpdateSecurityFeeResponse {
  return {};
}

export const UpdateSecurityFeeResponse = {
  encode(_: UpdateSecurityFeeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateSecurityFeeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateSecurityFeeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateSecurityFeeResponse {
    return {};
  },

  toJSON(_: UpdateSecurityFeeResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<UpdateSecurityFeeResponse>, I>>(base?: I): UpdateSecurityFeeResponse {
    return UpdateSecurityFeeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<UpdateSecurityFeeResponse>, I>>(_: I): UpdateSecurityFeeResponse {
    const message = createBaseUpdateSecurityFeeResponse();
    return message;
  },
};

function createBaseValidIDsForPromoCodeRequest(): ValidIDsForPromoCodeRequest {
  return { feeds: [], models: [], brands: [], categories: [], sellers: [] };
}

export const ValidIDsForPromoCodeRequest = {
  encode(message: ValidIDsForPromoCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.feeds) {
      writer.uint32(10).string(v!);
    }
    for (const v of message.models) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.brands) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.categories) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.sellers) {
      writer.uint32(42).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidIDsForPromoCodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidIDsForPromoCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.feeds.push(reader.string());
          break;
        case 2:
          message.models.push(reader.string());
          break;
        case 3:
          message.brands.push(reader.string());
          break;
        case 4:
          message.categories.push(reader.string());
          break;
        case 5:
          message.sellers.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidIDsForPromoCodeRequest {
    return {
      feeds: Array.isArray(object?.feeds) ? object.feeds.map((e: any) => String(e)) : [],
      models: Array.isArray(object?.models) ? object.models.map((e: any) => String(e)) : [],
      brands: Array.isArray(object?.brands) ? object.brands.map((e: any) => String(e)) : [],
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => String(e)) : [],
      sellers: Array.isArray(object?.sellers) ? object.sellers.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: ValidIDsForPromoCodeRequest): unknown {
    const obj: any = {};
    if (message.feeds) {
      obj.feeds = message.feeds.map((e) => e);
    } else {
      obj.feeds = [];
    }
    if (message.models) {
      obj.models = message.models.map((e) => e);
    } else {
      obj.models = [];
    }
    if (message.brands) {
      obj.brands = message.brands.map((e) => e);
    } else {
      obj.brands = [];
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    if (message.sellers) {
      obj.sellers = message.sellers.map((e) => e);
    } else {
      obj.sellers = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidIDsForPromoCodeRequest>, I>>(base?: I): ValidIDsForPromoCodeRequest {
    return ValidIDsForPromoCodeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidIDsForPromoCodeRequest>, I>>(object: I): ValidIDsForPromoCodeRequest {
    const message = createBaseValidIDsForPromoCodeRequest();
    message.feeds = object.feeds?.map((e) => e) || [];
    message.models = object.models?.map((e) => e) || [];
    message.brands = object.brands?.map((e) => e) || [];
    message.categories = object.categories?.map((e) => e) || [];
    message.sellers = object.sellers?.map((e) => e) || [];
    return message;
  },
};

function createBaseValidIDsForPromoCodeResponse(): ValidIDsForPromoCodeResponse {
  return { feeds: [], models: [], brands: [], categories: [], sellers: [] };
}

export const ValidIDsForPromoCodeResponse = {
  encode(message: ValidIDsForPromoCodeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.feeds) {
      writer.uint32(10).string(v!);
    }
    for (const v of message.models) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.brands) {
      writer.uint32(26).string(v!);
    }
    for (const v of message.categories) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.sellers) {
      writer.uint32(42).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidIDsForPromoCodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidIDsForPromoCodeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.feeds.push(reader.string());
          break;
        case 2:
          message.models.push(reader.string());
          break;
        case 3:
          message.brands.push(reader.string());
          break;
        case 4:
          message.categories.push(reader.string());
          break;
        case 5:
          message.sellers.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidIDsForPromoCodeResponse {
    return {
      feeds: Array.isArray(object?.feeds) ? object.feeds.map((e: any) => String(e)) : [],
      models: Array.isArray(object?.models) ? object.models.map((e: any) => String(e)) : [],
      brands: Array.isArray(object?.brands) ? object.brands.map((e: any) => String(e)) : [],
      categories: Array.isArray(object?.categories) ? object.categories.map((e: any) => String(e)) : [],
      sellers: Array.isArray(object?.sellers) ? object.sellers.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: ValidIDsForPromoCodeResponse): unknown {
    const obj: any = {};
    if (message.feeds) {
      obj.feeds = message.feeds.map((e) => e);
    } else {
      obj.feeds = [];
    }
    if (message.models) {
      obj.models = message.models.map((e) => e);
    } else {
      obj.models = [];
    }
    if (message.brands) {
      obj.brands = message.brands.map((e) => e);
    } else {
      obj.brands = [];
    }
    if (message.categories) {
      obj.categories = message.categories.map((e) => e);
    } else {
      obj.categories = [];
    }
    if (message.sellers) {
      obj.sellers = message.sellers.map((e) => e);
    } else {
      obj.sellers = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidIDsForPromoCodeResponse>, I>>(base?: I): ValidIDsForPromoCodeResponse {
    return ValidIDsForPromoCodeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidIDsForPromoCodeResponse>, I>>(object: I): ValidIDsForPromoCodeResponse {
    const message = createBaseValidIDsForPromoCodeResponse();
    message.feeds = object.feeds?.map((e) => e) || [];
    message.models = object.models?.map((e) => e) || [];
    message.brands = object.brands?.map((e) => e) || [];
    message.categories = object.categories?.map((e) => e) || [];
    message.sellers = object.sellers?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetProductDetailsForPromoCodeValidationRequest(): GetProductDetailsForPromoCodeValidationRequest {
  return { productId: "" };
}

export const GetProductDetailsForPromoCodeValidationRequest = {
  encode(
    message: GetProductDetailsForPromoCodeValidationRequest,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.productId !== "") {
      writer.uint32(10).string(message.productId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductDetailsForPromoCodeValidationRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductDetailsForPromoCodeValidationRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.productId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductDetailsForPromoCodeValidationRequest {
    return { productId: isSet(object.productId) ? String(object.productId) : "" };
  },

  toJSON(message: GetProductDetailsForPromoCodeValidationRequest): unknown {
    const obj: any = {};
    message.productId !== undefined && (obj.productId = message.productId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductDetailsForPromoCodeValidationRequest>, I>>(
    base?: I,
  ): GetProductDetailsForPromoCodeValidationRequest {
    return GetProductDetailsForPromoCodeValidationRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductDetailsForPromoCodeValidationRequest>, I>>(
    object: I,
  ): GetProductDetailsForPromoCodeValidationRequest {
    const message = createBaseGetProductDetailsForPromoCodeValidationRequest();
    message.productId = object.productId ?? "";
    return message;
  },
};

function createBaseGetProductDetailsForPromoCodeValidationResponse(): GetProductDetailsForPromoCodeValidationResponse {
  return { sellPrice: 0, detailsForScopeValidation: undefined };
}

export const GetProductDetailsForPromoCodeValidationResponse = {
  encode(
    message: GetProductDetailsForPromoCodeValidationResponse,
    writer: _m0.Writer = _m0.Writer.create(),
  ): _m0.Writer {
    if (message.sellPrice !== 0) {
      writer.uint32(13).float(message.sellPrice);
    }
    if (message.detailsForScopeValidation !== undefined) {
      ValidIDsForPromoCodeResponse.encode(message.detailsForScopeValidation, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetProductDetailsForPromoCodeValidationResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetProductDetailsForPromoCodeValidationResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.sellPrice = reader.float();
          break;
        case 2:
          message.detailsForScopeValidation = ValidIDsForPromoCodeResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetProductDetailsForPromoCodeValidationResponse {
    return {
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : 0,
      detailsForScopeValidation: isSet(object.detailsForScopeValidation)
        ? ValidIDsForPromoCodeResponse.fromJSON(object.detailsForScopeValidation)
        : undefined,
    };
  },

  toJSON(message: GetProductDetailsForPromoCodeValidationResponse): unknown {
    const obj: any = {};
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.detailsForScopeValidation !== undefined &&
      (obj.detailsForScopeValidation = message.detailsForScopeValidation
        ? ValidIDsForPromoCodeResponse.toJSON(message.detailsForScopeValidation)
        : undefined);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetProductDetailsForPromoCodeValidationResponse>, I>>(
    base?: I,
  ): GetProductDetailsForPromoCodeValidationResponse {
    return GetProductDetailsForPromoCodeValidationResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetProductDetailsForPromoCodeValidationResponse>, I>>(
    object: I,
  ): GetProductDetailsForPromoCodeValidationResponse {
    const message = createBaseGetProductDetailsForPromoCodeValidationResponse();
    message.sellPrice = object.sellPrice ?? 0;
    message.detailsForScopeValidation =
      (object.detailsForScopeValidation !== undefined && object.detailsForScopeValidation !== null)
        ? ValidIDsForPromoCodeResponse.fromPartial(object.detailsForScopeValidation)
        : undefined;
    return message;
  },
};

function createBaseValidateUserUsageOfPromoCodeRequest(): ValidateUserUsageOfPromoCodeRequest {
  return { userId: "", promoCodeId: "" };
}

export const ValidateUserUsageOfPromoCodeRequest = {
  encode(message: ValidateUserUsageOfPromoCodeRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.promoCodeId !== "") {
      writer.uint32(18).string(message.promoCodeId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateUserUsageOfPromoCodeRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateUserUsageOfPromoCodeRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.promoCodeId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidateUserUsageOfPromoCodeRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      promoCodeId: isSet(object.promoCodeId) ? String(object.promoCodeId) : "",
    };
  },

  toJSON(message: ValidateUserUsageOfPromoCodeRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.promoCodeId !== undefined && (obj.promoCodeId = message.promoCodeId);
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateUserUsageOfPromoCodeRequest>, I>>(
    base?: I,
  ): ValidateUserUsageOfPromoCodeRequest {
    return ValidateUserUsageOfPromoCodeRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateUserUsageOfPromoCodeRequest>, I>>(
    object: I,
  ): ValidateUserUsageOfPromoCodeRequest {
    const message = createBaseValidateUserUsageOfPromoCodeRequest();
    message.userId = object.userId ?? "";
    message.promoCodeId = object.promoCodeId ?? "";
    return message;
  },
};

function createBaseValidateUserUsageOfPromoCodeResponse(): ValidateUserUsageOfPromoCodeResponse {
  return { isUsed: false };
}

export const ValidateUserUsageOfPromoCodeResponse = {
  encode(message: ValidateUserUsageOfPromoCodeResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isUsed === true) {
      writer.uint32(8).bool(message.isUsed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ValidateUserUsageOfPromoCodeResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseValidateUserUsageOfPromoCodeResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isUsed = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ValidateUserUsageOfPromoCodeResponse {
    return { isUsed: isSet(object.isUsed) ? Boolean(object.isUsed) : false };
  },

  toJSON(message: ValidateUserUsageOfPromoCodeResponse): unknown {
    const obj: any = {};
    message.isUsed !== undefined && (obj.isUsed = message.isUsed);
    return obj;
  },

  create<I extends Exact<DeepPartial<ValidateUserUsageOfPromoCodeResponse>, I>>(
    base?: I,
  ): ValidateUserUsageOfPromoCodeResponse {
    return ValidateUserUsageOfPromoCodeResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ValidateUserUsageOfPromoCodeResponse>, I>>(
    object: I,
  ): ValidateUserUsageOfPromoCodeResponse {
    const message = createBaseValidateUserUsageOfPromoCodeResponse();
    message.isUsed = object.isUsed ?? false;
    return message;
  },
};

function createBaseProcessReserveFinancingPaymentRequest(): ProcessReserveFinancingPaymentRequest {
  return { orderNumber: "", status: "" };
}

export const ProcessReserveFinancingPaymentRequest = {
  encode(message: ProcessReserveFinancingPaymentRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.orderNumber !== "") {
      writer.uint32(10).string(message.orderNumber);
    }
    if (message.status !== "") {
      writer.uint32(18).string(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProcessReserveFinancingPaymentRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessReserveFinancingPaymentRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.orderNumber = reader.string();
          break;
        case 2:
          message.status = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProcessReserveFinancingPaymentRequest {
    return {
      orderNumber: isSet(object.orderNumber) ? String(object.orderNumber) : "",
      status: isSet(object.status) ? String(object.status) : "",
    };
  },

  toJSON(message: ProcessReserveFinancingPaymentRequest): unknown {
    const obj: any = {};
    message.orderNumber !== undefined && (obj.orderNumber = message.orderNumber);
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  create<I extends Exact<DeepPartial<ProcessReserveFinancingPaymentRequest>, I>>(
    base?: I,
  ): ProcessReserveFinancingPaymentRequest {
    return ProcessReserveFinancingPaymentRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProcessReserveFinancingPaymentRequest>, I>>(
    object: I,
  ): ProcessReserveFinancingPaymentRequest {
    const message = createBaseProcessReserveFinancingPaymentRequest();
    message.orderNumber = object.orderNumber ?? "";
    message.status = object.status ?? "";
    return message;
  },
};

function createBaseProcessReserveFinancingPaymentResponse(): ProcessReserveFinancingPaymentResponse {
  return {};
}

export const ProcessReserveFinancingPaymentResponse = {
  encode(_: ProcessReserveFinancingPaymentResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProcessReserveFinancingPaymentResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProcessReserveFinancingPaymentResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): ProcessReserveFinancingPaymentResponse {
    return {};
  },

  toJSON(_: ProcessReserveFinancingPaymentResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<ProcessReserveFinancingPaymentResponse>, I>>(
    base?: I,
  ): ProcessReserveFinancingPaymentResponse {
    return ProcessReserveFinancingPaymentResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<ProcessReserveFinancingPaymentResponse>, I>>(
    _: I,
  ): ProcessReserveFinancingPaymentResponse {
    const message = createBaseProcessReserveFinancingPaymentResponse();
    return message;
  },
};

function createBaseGenerateSmsaTrackingResponse(): GenerateSmsaTrackingResponse {
  return { trackingNumber: "" };
}

export const GenerateSmsaTrackingResponse = {
  encode(message: GenerateSmsaTrackingResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.trackingNumber !== "") {
      writer.uint32(10).string(message.trackingNumber);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenerateSmsaTrackingResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenerateSmsaTrackingResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.trackingNumber = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GenerateSmsaTrackingResponse {
    return { trackingNumber: isSet(object.trackingNumber) ? String(object.trackingNumber) : "" };
  },

  toJSON(message: GenerateSmsaTrackingResponse): unknown {
    const obj: any = {};
    message.trackingNumber !== undefined && (obj.trackingNumber = message.trackingNumber);
    return obj;
  },

  create<I extends Exact<DeepPartial<GenerateSmsaTrackingResponse>, I>>(base?: I): GenerateSmsaTrackingResponse {
    return GenerateSmsaTrackingResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GenerateSmsaTrackingResponse>, I>>(object: I): GenerateSmsaTrackingResponse {
    const message = createBaseGenerateSmsaTrackingResponse();
    message.trackingNumber = object.trackingNumber ?? "";
    return message;
  },
};

function createBaseRequest(): Request {
  return { request: "" };
}

export const Request = {
  encode(message: Request, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.request !== "") {
      writer.uint32(10).string(message.request);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Request {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.request = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Request {
    return { request: isSet(object.request) ? String(object.request) : "" };
  },

  toJSON(message: Request): unknown {
    const obj: any = {};
    message.request !== undefined && (obj.request = message.request);
    return obj;
  },

  create<I extends Exact<DeepPartial<Request>, I>>(base?: I): Request {
    return Request.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Request>, I>>(object: I): Request {
    const message = createBaseRequest();
    message.request = object.request ?? "";
    return message;
  },
};

function createBaseGetOrderDetailByIdResponse(): GetOrderDetailByIdResponse {
  return { response: "" };
}

export const GetOrderDetailByIdResponse = {
  encode(message: GetOrderDetailByIdResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.response !== "") {
      writer.uint32(10).string(message.response);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetOrderDetailByIdResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetOrderDetailByIdResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.response = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetOrderDetailByIdResponse {
    return { response: isSet(object.response) ? String(object.response) : "" };
  },

  toJSON(message: GetOrderDetailByIdResponse): unknown {
    const obj: any = {};
    message.response !== undefined && (obj.response = message.response);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetOrderDetailByIdResponse>, I>>(base?: I): GetOrderDetailByIdResponse {
    return GetOrderDetailByIdResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetOrderDetailByIdResponse>, I>>(object: I): GetOrderDetailByIdResponse {
    const message = createBaseGetOrderDetailByIdResponse();
    message.response = object.response ?? "";
    return message;
  },
};

function createBaseGetUserDataRequest(): GetUserDataRequest {
  return { userId: "" };
}

export const GetUserDataRequest = {
  encode(message: GetUserDataRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserDataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserDataRequest {
    return { userId: isSet(object.userId) ? String(object.userId) : "" };
  },

  toJSON(message: GetUserDataRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserDataRequest>, I>>(base?: I): GetUserDataRequest {
    return GetUserDataRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserDataRequest>, I>>(object: I): GetUserDataRequest {
    const message = createBaseGetUserDataRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetUserLastOrderDataResponse(): GetUserLastOrderDataResponse {
  return {
    buyerName: undefined,
    productName: undefined,
    orderId: undefined,
    productId: undefined,
    statusId: undefined,
    sellPrice: undefined,
    createdAt: undefined,
    modelName: undefined,
    arModelName: undefined,
    variantName: undefined,
    arVariantName: undefined,
    isDelivered: false,
    isRated: false,
    attributes: [],
  };
}

export const GetUserLastOrderDataResponse = {
  encode(message: GetUserLastOrderDataResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.buyerName !== undefined) {
      writer.uint32(10).string(message.buyerName);
    }
    if (message.productName !== undefined) {
      writer.uint32(18).string(message.productName);
    }
    if (message.orderId !== undefined) {
      writer.uint32(26).string(message.orderId);
    }
    if (message.productId !== undefined) {
      writer.uint32(34).string(message.productId);
    }
    if (message.statusId !== undefined) {
      writer.uint32(42).string(message.statusId);
    }
    if (message.sellPrice !== undefined) {
      writer.uint32(53).float(message.sellPrice);
    }
    if (message.createdAt !== undefined) {
      writer.uint32(58).string(message.createdAt);
    }
    if (message.modelName !== undefined) {
      writer.uint32(66).string(message.modelName);
    }
    if (message.arModelName !== undefined) {
      writer.uint32(74).string(message.arModelName);
    }
    if (message.variantName !== undefined) {
      writer.uint32(82).string(message.variantName);
    }
    if (message.arVariantName !== undefined) {
      writer.uint32(90).string(message.arVariantName);
    }
    if (message.isDelivered === true) {
      writer.uint32(96).bool(message.isDelivered);
    }
    if (message.isRated === true) {
      writer.uint32(104).bool(message.isRated);
    }
    for (const v of message.attributes) {
      Attribute.encode(v!, writer.uint32(114).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserLastOrderDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetUserLastOrderDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.buyerName = reader.string();
          break;
        case 2:
          message.productName = reader.string();
          break;
        case 3:
          message.orderId = reader.string();
          break;
        case 4:
          message.productId = reader.string();
          break;
        case 5:
          message.statusId = reader.string();
          break;
        case 6:
          message.sellPrice = reader.float();
          break;
        case 7:
          message.createdAt = reader.string();
          break;
        case 8:
          message.modelName = reader.string();
          break;
        case 9:
          message.arModelName = reader.string();
          break;
        case 10:
          message.variantName = reader.string();
          break;
        case 11:
          message.arVariantName = reader.string();
          break;
        case 12:
          message.isDelivered = reader.bool();
          break;
        case 13:
          message.isRated = reader.bool();
          break;
        case 14:
          message.attributes.push(Attribute.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserLastOrderDataResponse {
    return {
      buyerName: isSet(object.buyerName) ? String(object.buyerName) : undefined,
      productName: isSet(object.productName) ? String(object.productName) : undefined,
      orderId: isSet(object.orderId) ? String(object.orderId) : undefined,
      productId: isSet(object.productId) ? String(object.productId) : undefined,
      statusId: isSet(object.statusId) ? String(object.statusId) : undefined,
      sellPrice: isSet(object.sellPrice) ? Number(object.sellPrice) : undefined,
      createdAt: isSet(object.createdAt) ? String(object.createdAt) : undefined,
      modelName: isSet(object.modelName) ? String(object.modelName) : undefined,
      arModelName: isSet(object.arModelName) ? String(object.arModelName) : undefined,
      variantName: isSet(object.variantName) ? String(object.variantName) : undefined,
      arVariantName: isSet(object.arVariantName) ? String(object.arVariantName) : undefined,
      isDelivered: isSet(object.isDelivered) ? Boolean(object.isDelivered) : false,
      isRated: isSet(object.isRated) ? Boolean(object.isRated) : false,
      attributes: Array.isArray(object?.attributes) ? object.attributes.map((e: any) => Attribute.fromJSON(e)) : [],
    };
  },

  toJSON(message: GetUserLastOrderDataResponse): unknown {
    const obj: any = {};
    message.buyerName !== undefined && (obj.buyerName = message.buyerName);
    message.productName !== undefined && (obj.productName = message.productName);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    message.productId !== undefined && (obj.productId = message.productId);
    message.statusId !== undefined && (obj.statusId = message.statusId);
    message.sellPrice !== undefined && (obj.sellPrice = message.sellPrice);
    message.createdAt !== undefined && (obj.createdAt = message.createdAt);
    message.modelName !== undefined && (obj.modelName = message.modelName);
    message.arModelName !== undefined && (obj.arModelName = message.arModelName);
    message.variantName !== undefined && (obj.variantName = message.variantName);
    message.arVariantName !== undefined && (obj.arVariantName = message.arVariantName);
    message.isDelivered !== undefined && (obj.isDelivered = message.isDelivered);
    message.isRated !== undefined && (obj.isRated = message.isRated);
    if (message.attributes) {
      obj.attributes = message.attributes.map((e) => e ? Attribute.toJSON(e) : undefined);
    } else {
      obj.attributes = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetUserLastOrderDataResponse>, I>>(base?: I): GetUserLastOrderDataResponse {
    return GetUserLastOrderDataResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetUserLastOrderDataResponse>, I>>(object: I): GetUserLastOrderDataResponse {
    const message = createBaseGetUserLastOrderDataResponse();
    message.buyerName = object.buyerName ?? undefined;
    message.productName = object.productName ?? undefined;
    message.orderId = object.orderId ?? undefined;
    message.productId = object.productId ?? undefined;
    message.statusId = object.statusId ?? undefined;
    message.sellPrice = object.sellPrice ?? undefined;
    message.createdAt = object.createdAt ?? undefined;
    message.modelName = object.modelName ?? undefined;
    message.arModelName = object.arModelName ?? undefined;
    message.variantName = object.variantName ?? undefined;
    message.arVariantName = object.arVariantName ?? undefined;
    message.isDelivered = object.isDelivered ?? false;
    message.isRated = object.isRated ?? false;
    message.attributes = object.attributes?.map((e) => Attribute.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSubmitRatingRequest(): SubmitRatingRequest {
  return { userId: "", notes: "", rating: "" };
}

export const SubmitRatingRequest = {
  encode(message: SubmitRatingRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.notes !== "") {
      writer.uint32(18).string(message.notes);
    }
    if (message.rating !== "") {
      writer.uint32(26).string(message.rating);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitRatingRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitRatingRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.notes = reader.string();
          break;
        case 3:
          message.rating = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitRatingRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      notes: isSet(object.notes) ? String(object.notes) : "",
      rating: isSet(object.rating) ? String(object.rating) : "",
    };
  },

  toJSON(message: SubmitRatingRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.notes !== undefined && (obj.notes = message.notes);
    message.rating !== undefined && (obj.rating = message.rating);
    return obj;
  },

  create<I extends Exact<DeepPartial<SubmitRatingRequest>, I>>(base?: I): SubmitRatingRequest {
    return SubmitRatingRequest.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubmitRatingRequest>, I>>(object: I): SubmitRatingRequest {
    const message = createBaseSubmitRatingRequest();
    message.userId = object.userId ?? "";
    message.notes = object.notes ?? "";
    message.rating = object.rating ?? "";
    return message;
  },
};

function createBaseSubmitRatingResponse(): SubmitRatingResponse {
  return { isRated: false };
}

export const SubmitRatingResponse = {
  encode(message: SubmitRatingResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.isRated === true) {
      writer.uint32(8).bool(message.isRated);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SubmitRatingResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubmitRatingResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.isRated = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SubmitRatingResponse {
    return { isRated: isSet(object.isRated) ? Boolean(object.isRated) : false };
  },

  toJSON(message: SubmitRatingResponse): unknown {
    const obj: any = {};
    message.isRated !== undefined && (obj.isRated = message.isRated);
    return obj;
  },

  create<I extends Exact<DeepPartial<SubmitRatingResponse>, I>>(base?: I): SubmitRatingResponse {
    return SubmitRatingResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<SubmitRatingResponse>, I>>(object: I): SubmitRatingResponse {
    const message = createBaseSubmitRatingResponse();
    message.isRated = object.isRated ?? false;
    return message;
  },
};

function createBaseGetCategoryModelsCountResponse(): GetCategoryModelsCountResponse {
  return {
    brands: [],
    showMileageFilter: false,
    showFinancingFilter: false,
    shopGreatDeals: false,
    carsPrice: false,
    showLT31: false,
    showGT80: false,
    showGT30AndLT60: false,
    showGT60AndLT80: false,
  };
}

export const GetCategoryModelsCountResponse = {
  encode(message: GetCategoryModelsCountResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.brands) {
      Brand.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    if (message.showMileageFilter === true) {
      writer.uint32(16).bool(message.showMileageFilter);
    }
    if (message.showFinancingFilter === true) {
      writer.uint32(24).bool(message.showFinancingFilter);
    }
    if (message.shopGreatDeals === true) {
      writer.uint32(32).bool(message.shopGreatDeals);
    }
    if (message.carsPrice === true) {
      writer.uint32(40).bool(message.carsPrice);
    }
    if (message.showLT31 === true) {
      writer.uint32(48).bool(message.showLT31);
    }
    if (message.showGT80 === true) {
      writer.uint32(56).bool(message.showGT80);
    }
    if (message.showGT30AndLT60 === true) {
      writer.uint32(64).bool(message.showGT30AndLT60);
    }
    if (message.showGT60AndLT80 === true) {
      writer.uint32(72).bool(message.showGT60AndLT80);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCategoryModelsCountResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetCategoryModelsCountResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.brands.push(Brand.decode(reader, reader.uint32()));
          break;
        case 2:
          message.showMileageFilter = reader.bool();
          break;
        case 3:
          message.showFinancingFilter = reader.bool();
          break;
        case 4:
          message.shopGreatDeals = reader.bool();
          break;
        case 5:
          message.carsPrice = reader.bool();
          break;
        case 6:
          message.showLT31 = reader.bool();
          break;
        case 7:
          message.showGT80 = reader.bool();
          break;
        case 8:
          message.showGT30AndLT60 = reader.bool();
          break;
        case 9:
          message.showGT60AndLT80 = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCategoryModelsCountResponse {
    return {
      brands: Array.isArray(object?.brands) ? object.brands.map((e: any) => Brand.fromJSON(e)) : [],
      showMileageFilter: isSet(object.showMileageFilter) ? Boolean(object.showMileageFilter) : false,
      showFinancingFilter: isSet(object.showFinancingFilter) ? Boolean(object.showFinancingFilter) : false,
      shopGreatDeals: isSet(object.shopGreatDeals) ? Boolean(object.shopGreatDeals) : false,
      carsPrice: isSet(object.carsPrice) ? Boolean(object.carsPrice) : false,
      showLT31: isSet(object.showLT31) ? Boolean(object.showLT31) : false,
      showGT80: isSet(object.showGT80) ? Boolean(object.showGT80) : false,
      showGT30AndLT60: isSet(object.showGT30AndLT60) ? Boolean(object.showGT30AndLT60) : false,
      showGT60AndLT80: isSet(object.showGT60AndLT80) ? Boolean(object.showGT60AndLT80) : false,
    };
  },

  toJSON(message: GetCategoryModelsCountResponse): unknown {
    const obj: any = {};
    if (message.brands) {
      obj.brands = message.brands.map((e) => e ? Brand.toJSON(e) : undefined);
    } else {
      obj.brands = [];
    }
    message.showMileageFilter !== undefined && (obj.showMileageFilter = message.showMileageFilter);
    message.showFinancingFilter !== undefined && (obj.showFinancingFilter = message.showFinancingFilter);
    message.shopGreatDeals !== undefined && (obj.shopGreatDeals = message.shopGreatDeals);
    message.carsPrice !== undefined && (obj.carsPrice = message.carsPrice);
    message.showLT31 !== undefined && (obj.showLT31 = message.showLT31);
    message.showGT80 !== undefined && (obj.showGT80 = message.showGT80);
    message.showGT30AndLT60 !== undefined && (obj.showGT30AndLT60 = message.showGT30AndLT60);
    message.showGT60AndLT80 !== undefined && (obj.showGT60AndLT80 = message.showGT60AndLT80);
    return obj;
  },

  create<I extends Exact<DeepPartial<GetCategoryModelsCountResponse>, I>>(base?: I): GetCategoryModelsCountResponse {
    return GetCategoryModelsCountResponse.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<GetCategoryModelsCountResponse>, I>>(
    object: I,
  ): GetCategoryModelsCountResponse {
    const message = createBaseGetCategoryModelsCountResponse();
    message.brands = object.brands?.map((e) => Brand.fromPartial(e)) || [];
    message.showMileageFilter = object.showMileageFilter ?? false;
    message.showFinancingFilter = object.showFinancingFilter ?? false;
    message.shopGreatDeals = object.shopGreatDeals ?? false;
    message.carsPrice = object.carsPrice ?? false;
    message.showLT31 = object.showLT31 ?? false;
    message.showGT80 = object.showGT80 ?? false;
    message.showGT30AndLT60 = object.showGT30AndLT60 ?? false;
    message.showGT60AndLT80 = object.showGT60AndLT80 ?? false;
    return message;
  },
};

function createBaseBrand(): Brand {
  return {
    id: "",
    categoryId: "",
    brandNameAr: "",
    brandName: "",
    brandIcon: "",
    status: "",
    totalAvailableProducts: 0,
    models: [],
  };
}

export const Brand = {
  encode(message: Brand, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.categoryId !== "") {
      writer.uint32(18).string(message.categoryId);
    }
    if (message.brandNameAr !== "") {
      writer.uint32(26).string(message.brandNameAr);
    }
    if (message.brandName !== "") {
      writer.uint32(34).string(message.brandName);
    }
    if (message.brandIcon !== "") {
      writer.uint32(42).string(message.brandIcon);
    }
    if (message.status !== "") {
      writer.uint32(50).string(message.status);
    }
    if (message.totalAvailableProducts !== 0) {
      writer.uint32(56).int32(message.totalAvailableProducts);
    }
    for (const v of message.models) {
      Models.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Brand {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseBrand();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.categoryId = reader.string();
          break;
        case 3:
          message.brandNameAr = reader.string();
          break;
        case 4:
          message.brandName = reader.string();
          break;
        case 5:
          message.brandIcon = reader.string();
          break;
        case 6:
          message.status = reader.string();
          break;
        case 7:
          message.totalAvailableProducts = reader.int32();
          break;
        case 8:
          message.models.push(Models.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Brand {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      categoryId: isSet(object.categoryId) ? String(object.categoryId) : "",
      brandNameAr: isSet(object.brandNameAr) ? String(object.brandNameAr) : "",
      brandName: isSet(object.brandName) ? String(object.brandName) : "",
      brandIcon: isSet(object.brandIcon) ? String(object.brandIcon) : "",
      status: isSet(object.status) ? String(object.status) : "",
      totalAvailableProducts: isSet(object.totalAvailableProducts) ? Number(object.totalAvailableProducts) : 0,
      models: Array.isArray(object?.models) ? object.models.map((e: any) => Models.fromJSON(e)) : [],
    };
  },

  toJSON(message: Brand): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.categoryId !== undefined && (obj.categoryId = message.categoryId);
    message.brandNameAr !== undefined && (obj.brandNameAr = message.brandNameAr);
    message.brandName !== undefined && (obj.brandName = message.brandName);
    message.brandIcon !== undefined && (obj.brandIcon = message.brandIcon);
    message.status !== undefined && (obj.status = message.status);
    message.totalAvailableProducts !== undefined &&
      (obj.totalAvailableProducts = Math.round(message.totalAvailableProducts));
    if (message.models) {
      obj.models = message.models.map((e) => e ? Models.toJSON(e) : undefined);
    } else {
      obj.models = [];
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Brand>, I>>(base?: I): Brand {
    return Brand.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Brand>, I>>(object: I): Brand {
    const message = createBaseBrand();
    message.id = object.id ?? "";
    message.categoryId = object.categoryId ?? "";
    message.brandNameAr = object.brandNameAr ?? "";
    message.brandName = object.brandName ?? "";
    message.brandIcon = object.brandIcon ?? "";
    message.status = object.status ?? "";
    message.totalAvailableProducts = object.totalAvailableProducts ?? 0;
    message.models = object.models?.map((e) => Models.fromPartial(e)) || [];
    return message;
  },
};

function createBaseModels(): Models {
  return { totalAvailableProducts: 0, modelId: "", modelName: "", modelNameAr: "", modelIcon: "" };
}

export const Models = {
  encode(message: Models, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.totalAvailableProducts !== 0) {
      writer.uint32(8).int32(message.totalAvailableProducts);
    }
    if (message.modelId !== "") {
      writer.uint32(18).string(message.modelId);
    }
    if (message.modelName !== "") {
      writer.uint32(26).string(message.modelName);
    }
    if (message.modelNameAr !== "") {
      writer.uint32(34).string(message.modelNameAr);
    }
    if (message.modelIcon !== "") {
      writer.uint32(42).string(message.modelIcon);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Models {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseModels();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.totalAvailableProducts = reader.int32();
          break;
        case 2:
          message.modelId = reader.string();
          break;
        case 3:
          message.modelName = reader.string();
          break;
        case 4:
          message.modelNameAr = reader.string();
          break;
        case 5:
          message.modelIcon = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Models {
    return {
      totalAvailableProducts: isSet(object.totalAvailableProducts) ? Number(object.totalAvailableProducts) : 0,
      modelId: isSet(object.modelId) ? String(object.modelId) : "",
      modelName: isSet(object.modelName) ? String(object.modelName) : "",
      modelNameAr: isSet(object.modelNameAr) ? String(object.modelNameAr) : "",
      modelIcon: isSet(object.modelIcon) ? String(object.modelIcon) : "",
    };
  },

  toJSON(message: Models): unknown {
    const obj: any = {};
    message.totalAvailableProducts !== undefined &&
      (obj.totalAvailableProducts = Math.round(message.totalAvailableProducts));
    message.modelId !== undefined && (obj.modelId = message.modelId);
    message.modelName !== undefined && (obj.modelName = message.modelName);
    message.modelNameAr !== undefined && (obj.modelNameAr = message.modelNameAr);
    message.modelIcon !== undefined && (obj.modelIcon = message.modelIcon);
    return obj;
  },

  create<I extends Exact<DeepPartial<Models>, I>>(base?: I): Models {
    return Models.fromPartial(base ?? {});
  },

  fromPartial<I extends Exact<DeepPartial<Models>, I>>(object: I): Models {
    const message = createBaseModels();
    message.totalAvailableProducts = object.totalAvailableProducts ?? 0;
    message.modelId = object.modelId ?? "";
    message.modelName = object.modelName ?? "";
    message.modelNameAr = object.modelNameAr ?? "";
    message.modelIcon = object.modelIcon ?? "";
    return message;
  },
};

export interface V2Service {
  GetUser(request: GetUserRequest): Promise<GetUserResponse>;
  GetUsers(request: GetUsersRequest): Promise<GetUsersResponse>;
  GetPermissions(request: GetPermissionsRequest): Promise<GetPermissionsResponse>;
  GetOrderDetail(request: GetOrderDetailRequest): Promise<GetOrderDetailResponse>;
  GetDmUser(request: GetDmUserRequest): Promise<GetDmUserResponse>;
  GetDmUsers(request: GetDmUsersRequest): Promise<GetDmUsersResponse>;
  GetUsersByPhone(request: GetUsersByPhoneRequest): Promise<GetUsersByPhoneResponse>;
  UpdateHighestBid(request: UpdateHighestBidRequest): Promise<UpdateHighestBidResponse>;
  GetProducts(request: GetProductsRequest): Promise<GetProductsResponse>;
  GetProductForCommission(request: GetProductForCommissionRequest): Promise<GetProductForCommissionResponse>;
  GetMarketPriceByVariantId(request: GetMarketPriceByVariantIdRequest): Promise<GetMarketPriceByVariantIdResponse>;
  CreateOrder(request: CreateOrderRequest): Promise<CreateOrderResponse>;
  GetProductStatuses(request: GetProductStatusesRequest): Promise<GetProductStatusesResponse>;
  UpdateLogisticService(request: UpdateLogisticServiceRequest): Promise<UpdateLogisticServiceResponse>;
  GetBidSummary(request: GetBidSummaryRequest): Promise<GetBidSummaryResponse>;
  GetViewedProducts(request: GetViewedProductsRequest): Promise<GetViewedProductsResponse>;
  GetLegacyUserViaLocalPhone(request: GetLegacyUserViaLocalPhoneRequest): Promise<GetLegacyUserViaLocalPhoneResponse>;
  CreateNewUser(request: CreateNewUserRequest): Promise<CreateNewUserResponse>;
  UpdateInactiveUser(request: UpdateInactiveUserRequest): Promise<UpdateInactiveUserResponse>;
  CancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse>;
  GetBanners(request: GetBannersRequest): Promise<GetBannersResponse>;
  GetFeeds(request: GetFeedRequest): Promise<GetFeedsResponse>;
  UpdatePenaltyFlag(request: UpdatePenaltyFlagRequest): Promise<UpdatePenaltyFlagResponse>;
  GetInvoiceGenerationFlag(request: GetInvoiceGenerationFlagRequest): Promise<GetInvoiceGenerationFlagResponse>;
  GetVariants(request: GetVariantsRequest): Promise<GetVariantsResponse>;
  GetCountdownValInHours(request: GetCountdownValInHoursRequest): Promise<GetCountdownValInHoursResponse>;
  ValidateSellerDetectionNudge(
    request: ValidateSellerDetectionNudgeRequest,
  ): Promise<ValidateSellerDetectionNudgeResponse>;
  GetProductsForProductService(request: GetProductsRequest): Promise<GetProductsForProductServiceResponse>;
  UpdatePaymentStatusOfOrder(request: UpdatePaymentStatusOfOrderRequest): Promise<UpdatePaymentStatusOfOrderResponse>;
  GetRecentlySoldProducts(request: GetRecentlySoldProductsRequest): Promise<GetViewedProductsResponse>;
  GetSellerBadge(request: GetSellerBadgeRequest): Promise<GetSellerBadgeResponse>;
  GetPromoCode(request: GetPromoCodeRequest): Promise<GetPromoCodeResponse>;
  FetchInvoiceGenerationData(request: FetchInvoiceGenerationDataRequest): Promise<FetchInvoiceGenerationDataResponse>;
  GetOrderSaleAnalytics(request: GetOrderSaleAnalyticsRequest): Promise<GetOrderSaleAnalyticsResponse>;
  GetPendingPayoutAnalytics(request: GetPendingPayoutAnalyticsRequest): Promise<GetPendingPayoutAnalyticsResponse>;
  GetPendingPayoutPagination(request: GetPendingPayoutPaginationRequest): Promise<GetPendingPayoutPaginationResponse>;
  GetPenalizedOrders(request: GetPenalizedOrdersRequest): Promise<GetPenalizedOrdersResponse>;
  GetCompletionRateUser(request: GetCompletionRateUserRequest): Promise<GetCompletionRateUserResponse>;
  GetTopSellingProductModels(request: GetTopSellingProductModelsRequest): Promise<GetTopSellingProductModelsResponse>;
  SetUserOTP(request: SetUserOTPRequest): Promise<SetUserOTPResponse>;
  CheckUserOTP(request: CheckUserOTPRequest): Promise<CheckUserOTPResponse>;
  CreateSmsaTracking(request: CreateSMSATracking): Promise<CreateSMSATracking>;
  UpdateOrderAttribute(request: UpdateOrderAttributeRequest): Promise<UpdateOrderAttributeResponse>;
  UpdateProduct(request: UpdateProductRequest): Promise<UpdateProductResponse>;
  GetListingFees(request: GetListingFeesRequest): Promise<GetListingFeesResponse>;
  UpdateSecurityFee(request: UpdateSecurityFeeRequest): Promise<UpdateSecurityFeeResponse>;
  ValidIdsForPromoCode(request: ValidIDsForPromoCodeRequest): Promise<ValidIDsForPromoCodeResponse>;
  GetProductDetailsForPromoCodeValidation(
    request: GetProductDetailsForPromoCodeValidationRequest,
  ): Promise<GetProductDetailsForPromoCodeValidationResponse>;
  ValidateUserUsageOfPromoCode(
    request: ValidateUserUsageOfPromoCodeRequest,
  ): Promise<ValidateUserUsageOfPromoCodeResponse>;
  ProcessReserveFinancingPayment(
    request: ProcessReserveFinancingPaymentRequest,
  ): Promise<ProcessReserveFinancingPaymentResponse>;
  GenerateSmsaTracking(request: Request): Promise<GenerateSmsaTrackingResponse>;
  GetOrderDetailById(request: GetOrderDetailRequest): Promise<GetOrderDetailByIdResponse>;
  GetOrderDetailByUserType(request: GetOrderDetailByUserTypeRequest): Promise<GetOrderDetailByIdResponse>;
  CreateDmOrder(request: Request): Promise<GetOrderDetailByIdResponse>;
  UpdateDmOrder(request: Request): Promise<GetOrderDetailByIdResponse>;
  GetUserProfile(request: GetUserDataRequest): Promise<GetOrderDetailByIdResponse>;
  GetUserLastOrderData(request: GetUserDataRequest): Promise<GetUserLastOrderDataResponse>;
  SubmitRating(request: SubmitRatingRequest): Promise<SubmitRatingResponse>;
  GetCategoryModelsCount(request: GetVariantsRequest): Promise<GetCategoryModelsCountResponse>;
}

export class V2ServiceClientImpl implements V2Service {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "v2.V2Service";
    this.rpc = rpc;
    this.GetUser = this.GetUser.bind(this);
    this.GetUsers = this.GetUsers.bind(this);
    this.GetPermissions = this.GetPermissions.bind(this);
    this.GetOrderDetail = this.GetOrderDetail.bind(this);
    this.GetDmUser = this.GetDmUser.bind(this);
    this.GetDmUsers = this.GetDmUsers.bind(this);
    this.GetUsersByPhone = this.GetUsersByPhone.bind(this);
    this.UpdateHighestBid = this.UpdateHighestBid.bind(this);
    this.GetProducts = this.GetProducts.bind(this);
    this.GetProductForCommission = this.GetProductForCommission.bind(this);
    this.GetMarketPriceByVariantId = this.GetMarketPriceByVariantId.bind(this);
    this.CreateOrder = this.CreateOrder.bind(this);
    this.GetProductStatuses = this.GetProductStatuses.bind(this);
    this.UpdateLogisticService = this.UpdateLogisticService.bind(this);
    this.GetBidSummary = this.GetBidSummary.bind(this);
    this.GetViewedProducts = this.GetViewedProducts.bind(this);
    this.GetLegacyUserViaLocalPhone = this.GetLegacyUserViaLocalPhone.bind(this);
    this.CreateNewUser = this.CreateNewUser.bind(this);
    this.UpdateInactiveUser = this.UpdateInactiveUser.bind(this);
    this.CancelOrder = this.CancelOrder.bind(this);
    this.GetBanners = this.GetBanners.bind(this);
    this.GetFeeds = this.GetFeeds.bind(this);
    this.UpdatePenaltyFlag = this.UpdatePenaltyFlag.bind(this);
    this.GetInvoiceGenerationFlag = this.GetInvoiceGenerationFlag.bind(this);
    this.GetVariants = this.GetVariants.bind(this);
    this.GetCountdownValInHours = this.GetCountdownValInHours.bind(this);
    this.ValidateSellerDetectionNudge = this.ValidateSellerDetectionNudge.bind(this);
    this.GetProductsForProductService = this.GetProductsForProductService.bind(this);
    this.UpdatePaymentStatusOfOrder = this.UpdatePaymentStatusOfOrder.bind(this);
    this.GetRecentlySoldProducts = this.GetRecentlySoldProducts.bind(this);
    this.GetSellerBadge = this.GetSellerBadge.bind(this);
    this.GetPromoCode = this.GetPromoCode.bind(this);
    this.FetchInvoiceGenerationData = this.FetchInvoiceGenerationData.bind(this);
    this.GetOrderSaleAnalytics = this.GetOrderSaleAnalytics.bind(this);
    this.GetPendingPayoutAnalytics = this.GetPendingPayoutAnalytics.bind(this);
    this.GetPendingPayoutPagination = this.GetPendingPayoutPagination.bind(this);
    this.GetPenalizedOrders = this.GetPenalizedOrders.bind(this);
    this.GetCompletionRateUser = this.GetCompletionRateUser.bind(this);
    this.GetTopSellingProductModels = this.GetTopSellingProductModels.bind(this);
    this.SetUserOTP = this.SetUserOTP.bind(this);
    this.CheckUserOTP = this.CheckUserOTP.bind(this);
    this.CreateSmsaTracking = this.CreateSmsaTracking.bind(this);
    this.UpdateOrderAttribute = this.UpdateOrderAttribute.bind(this);
    this.UpdateProduct = this.UpdateProduct.bind(this);
    this.GetListingFees = this.GetListingFees.bind(this);
    this.UpdateSecurityFee = this.UpdateSecurityFee.bind(this);
    this.ValidIdsForPromoCode = this.ValidIdsForPromoCode.bind(this);
    this.GetProductDetailsForPromoCodeValidation = this.GetProductDetailsForPromoCodeValidation.bind(this);
    this.ValidateUserUsageOfPromoCode = this.ValidateUserUsageOfPromoCode.bind(this);
    this.ProcessReserveFinancingPayment = this.ProcessReserveFinancingPayment.bind(this);
    this.GenerateSmsaTracking = this.GenerateSmsaTracking.bind(this);
    this.GetOrderDetailById = this.GetOrderDetailById.bind(this);
    this.GetOrderDetailByUserType = this.GetOrderDetailByUserType.bind(this);
    this.CreateDmOrder = this.CreateDmOrder.bind(this);
    this.UpdateDmOrder = this.UpdateDmOrder.bind(this);
    this.GetUserProfile = this.GetUserProfile.bind(this);
    this.GetUserLastOrderData = this.GetUserLastOrderData.bind(this);
    this.SubmitRating = this.SubmitRating.bind(this);
    this.GetCategoryModelsCount = this.GetCategoryModelsCount.bind(this);
  }
  GetUser(request: GetUserRequest): Promise<GetUserResponse> {
    const data = GetUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUser", data);
    return promise.then((data) => GetUserResponse.decode(new _m0.Reader(data)));
  }

  GetUsers(request: GetUsersRequest): Promise<GetUsersResponse> {
    const data = GetUsersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUsers", data);
    return promise.then((data) => GetUsersResponse.decode(new _m0.Reader(data)));
  }

  GetPermissions(request: GetPermissionsRequest): Promise<GetPermissionsResponse> {
    const data = GetPermissionsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPermissions", data);
    return promise.then((data) => GetPermissionsResponse.decode(new _m0.Reader(data)));
  }

  GetOrderDetail(request: GetOrderDetailRequest): Promise<GetOrderDetailResponse> {
    const data = GetOrderDetailRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetOrderDetail", data);
    return promise.then((data) => GetOrderDetailResponse.decode(new _m0.Reader(data)));
  }

  GetDmUser(request: GetDmUserRequest): Promise<GetDmUserResponse> {
    const data = GetDmUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetDmUser", data);
    return promise.then((data) => GetDmUserResponse.decode(new _m0.Reader(data)));
  }

  GetDmUsers(request: GetDmUsersRequest): Promise<GetDmUsersResponse> {
    const data = GetDmUsersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetDmUsers", data);
    return promise.then((data) => GetDmUsersResponse.decode(new _m0.Reader(data)));
  }

  GetUsersByPhone(request: GetUsersByPhoneRequest): Promise<GetUsersByPhoneResponse> {
    const data = GetUsersByPhoneRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUsersByPhone", data);
    return promise.then((data) => GetUsersByPhoneResponse.decode(new _m0.Reader(data)));
  }

  UpdateHighestBid(request: UpdateHighestBidRequest): Promise<UpdateHighestBidResponse> {
    const data = UpdateHighestBidRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateHighestBid", data);
    return promise.then((data) => UpdateHighestBidResponse.decode(new _m0.Reader(data)));
  }

  GetProducts(request: GetProductsRequest): Promise<GetProductsResponse> {
    const data = GetProductsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProducts", data);
    return promise.then((data) => GetProductsResponse.decode(new _m0.Reader(data)));
  }

  GetProductForCommission(request: GetProductForCommissionRequest): Promise<GetProductForCommissionResponse> {
    const data = GetProductForCommissionRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProductForCommission", data);
    return promise.then((data) => GetProductForCommissionResponse.decode(new _m0.Reader(data)));
  }

  GetMarketPriceByVariantId(request: GetMarketPriceByVariantIdRequest): Promise<GetMarketPriceByVariantIdResponse> {
    const data = GetMarketPriceByVariantIdRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetMarketPriceByVariantId", data);
    return promise.then((data) => GetMarketPriceByVariantIdResponse.decode(new _m0.Reader(data)));
  }

  CreateOrder(request: CreateOrderRequest): Promise<CreateOrderResponse> {
    const data = CreateOrderRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateOrder", data);
    return promise.then((data) => CreateOrderResponse.decode(new _m0.Reader(data)));
  }

  GetProductStatuses(request: GetProductStatusesRequest): Promise<GetProductStatusesResponse> {
    const data = GetProductStatusesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProductStatuses", data);
    return promise.then((data) => GetProductStatusesResponse.decode(new _m0.Reader(data)));
  }

  UpdateLogisticService(request: UpdateLogisticServiceRequest): Promise<UpdateLogisticServiceResponse> {
    const data = UpdateLogisticServiceRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateLogisticService", data);
    return promise.then((data) => UpdateLogisticServiceResponse.decode(new _m0.Reader(data)));
  }

  GetBidSummary(request: GetBidSummaryRequest): Promise<GetBidSummaryResponse> {
    const data = GetBidSummaryRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBidSummary", data);
    return promise.then((data) => GetBidSummaryResponse.decode(new _m0.Reader(data)));
  }

  GetViewedProducts(request: GetViewedProductsRequest): Promise<GetViewedProductsResponse> {
    const data = GetViewedProductsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetViewedProducts", data);
    return promise.then((data) => GetViewedProductsResponse.decode(new _m0.Reader(data)));
  }

  GetLegacyUserViaLocalPhone(request: GetLegacyUserViaLocalPhoneRequest): Promise<GetLegacyUserViaLocalPhoneResponse> {
    const data = GetLegacyUserViaLocalPhoneRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetLegacyUserViaLocalPhone", data);
    return promise.then((data) => GetLegacyUserViaLocalPhoneResponse.decode(new _m0.Reader(data)));
  }

  CreateNewUser(request: CreateNewUserRequest): Promise<CreateNewUserResponse> {
    const data = CreateNewUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateNewUser", data);
    return promise.then((data) => CreateNewUserResponse.decode(new _m0.Reader(data)));
  }

  UpdateInactiveUser(request: UpdateInactiveUserRequest): Promise<UpdateInactiveUserResponse> {
    const data = UpdateInactiveUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateInactiveUser", data);
    return promise.then((data) => UpdateInactiveUserResponse.decode(new _m0.Reader(data)));
  }

  CancelOrder(request: CancelOrderRequest): Promise<CancelOrderResponse> {
    const data = CancelOrderRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CancelOrder", data);
    return promise.then((data) => CancelOrderResponse.decode(new _m0.Reader(data)));
  }

  GetBanners(request: GetBannersRequest): Promise<GetBannersResponse> {
    const data = GetBannersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetBanners", data);
    return promise.then((data) => GetBannersResponse.decode(new _m0.Reader(data)));
  }

  GetFeeds(request: GetFeedRequest): Promise<GetFeedsResponse> {
    const data = GetFeedRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetFeeds", data);
    return promise.then((data) => GetFeedsResponse.decode(new _m0.Reader(data)));
  }

  UpdatePenaltyFlag(request: UpdatePenaltyFlagRequest): Promise<UpdatePenaltyFlagResponse> {
    const data = UpdatePenaltyFlagRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdatePenaltyFlag", data);
    return promise.then((data) => UpdatePenaltyFlagResponse.decode(new _m0.Reader(data)));
  }

  GetInvoiceGenerationFlag(request: GetInvoiceGenerationFlagRequest): Promise<GetInvoiceGenerationFlagResponse> {
    const data = GetInvoiceGenerationFlagRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetInvoiceGenerationFlag", data);
    return promise.then((data) => GetInvoiceGenerationFlagResponse.decode(new _m0.Reader(data)));
  }

  GetVariants(request: GetVariantsRequest): Promise<GetVariantsResponse> {
    const data = GetVariantsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetVariants", data);
    return promise.then((data) => GetVariantsResponse.decode(new _m0.Reader(data)));
  }

  GetCountdownValInHours(request: GetCountdownValInHoursRequest): Promise<GetCountdownValInHoursResponse> {
    const data = GetCountdownValInHoursRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCountdownValInHours", data);
    return promise.then((data) => GetCountdownValInHoursResponse.decode(new _m0.Reader(data)));
  }

  ValidateSellerDetectionNudge(
    request: ValidateSellerDetectionNudgeRequest,
  ): Promise<ValidateSellerDetectionNudgeResponse> {
    const data = ValidateSellerDetectionNudgeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ValidateSellerDetectionNudge", data);
    return promise.then((data) => ValidateSellerDetectionNudgeResponse.decode(new _m0.Reader(data)));
  }

  GetProductsForProductService(request: GetProductsRequest): Promise<GetProductsForProductServiceResponse> {
    const data = GetProductsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProductsForProductService", data);
    return promise.then((data) => GetProductsForProductServiceResponse.decode(new _m0.Reader(data)));
  }

  UpdatePaymentStatusOfOrder(request: UpdatePaymentStatusOfOrderRequest): Promise<UpdatePaymentStatusOfOrderResponse> {
    const data = UpdatePaymentStatusOfOrderRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdatePaymentStatusOfOrder", data);
    return promise.then((data) => UpdatePaymentStatusOfOrderResponse.decode(new _m0.Reader(data)));
  }

  GetRecentlySoldProducts(request: GetRecentlySoldProductsRequest): Promise<GetViewedProductsResponse> {
    const data = GetRecentlySoldProductsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetRecentlySoldProducts", data);
    return promise.then((data) => GetViewedProductsResponse.decode(new _m0.Reader(data)));
  }

  GetSellerBadge(request: GetSellerBadgeRequest): Promise<GetSellerBadgeResponse> {
    const data = GetSellerBadgeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetSellerBadge", data);
    return promise.then((data) => GetSellerBadgeResponse.decode(new _m0.Reader(data)));
  }

  GetPromoCode(request: GetPromoCodeRequest): Promise<GetPromoCodeResponse> {
    const data = GetPromoCodeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPromoCode", data);
    return promise.then((data) => GetPromoCodeResponse.decode(new _m0.Reader(data)));
  }

  FetchInvoiceGenerationData(request: FetchInvoiceGenerationDataRequest): Promise<FetchInvoiceGenerationDataResponse> {
    const data = FetchInvoiceGenerationDataRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "FetchInvoiceGenerationData", data);
    return promise.then((data) => FetchInvoiceGenerationDataResponse.decode(new _m0.Reader(data)));
  }

  GetOrderSaleAnalytics(request: GetOrderSaleAnalyticsRequest): Promise<GetOrderSaleAnalyticsResponse> {
    const data = GetOrderSaleAnalyticsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetOrderSaleAnalytics", data);
    return promise.then((data) => GetOrderSaleAnalyticsResponse.decode(new _m0.Reader(data)));
  }

  GetPendingPayoutAnalytics(request: GetPendingPayoutAnalyticsRequest): Promise<GetPendingPayoutAnalyticsResponse> {
    const data = GetPendingPayoutAnalyticsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPendingPayoutAnalytics", data);
    return promise.then((data) => GetPendingPayoutAnalyticsResponse.decode(new _m0.Reader(data)));
  }

  GetPendingPayoutPagination(request: GetPendingPayoutPaginationRequest): Promise<GetPendingPayoutPaginationResponse> {
    const data = GetPendingPayoutPaginationRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPendingPayoutPagination", data);
    return promise.then((data) => GetPendingPayoutPaginationResponse.decode(new _m0.Reader(data)));
  }

  GetPenalizedOrders(request: GetPenalizedOrdersRequest): Promise<GetPenalizedOrdersResponse> {
    const data = GetPenalizedOrdersRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetPenalizedOrders", data);
    return promise.then((data) => GetPenalizedOrdersResponse.decode(new _m0.Reader(data)));
  }

  GetCompletionRateUser(request: GetCompletionRateUserRequest): Promise<GetCompletionRateUserResponse> {
    const data = GetCompletionRateUserRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCompletionRateUser", data);
    return promise.then((data) => GetCompletionRateUserResponse.decode(new _m0.Reader(data)));
  }

  GetTopSellingProductModels(request: GetTopSellingProductModelsRequest): Promise<GetTopSellingProductModelsResponse> {
    const data = GetTopSellingProductModelsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetTopSellingProductModels", data);
    return promise.then((data) => GetTopSellingProductModelsResponse.decode(new _m0.Reader(data)));
  }

  SetUserOTP(request: SetUserOTPRequest): Promise<SetUserOTPResponse> {
    const data = SetUserOTPRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SetUserOTP", data);
    return promise.then((data) => SetUserOTPResponse.decode(new _m0.Reader(data)));
  }

  CheckUserOTP(request: CheckUserOTPRequest): Promise<CheckUserOTPResponse> {
    const data = CheckUserOTPRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "CheckUserOTP", data);
    return promise.then((data) => CheckUserOTPResponse.decode(new _m0.Reader(data)));
  }

  CreateSmsaTracking(request: CreateSMSATracking): Promise<CreateSMSATracking> {
    const data = CreateSMSATracking.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateSmsaTracking", data);
    return promise.then((data) => CreateSMSATracking.decode(new _m0.Reader(data)));
  }

  UpdateOrderAttribute(request: UpdateOrderAttributeRequest): Promise<UpdateOrderAttributeResponse> {
    const data = UpdateOrderAttributeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateOrderAttribute", data);
    return promise.then((data) => UpdateOrderAttributeResponse.decode(new _m0.Reader(data)));
  }

  UpdateProduct(request: UpdateProductRequest): Promise<UpdateProductResponse> {
    const data = UpdateProductRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateProduct", data);
    return promise.then((data) => UpdateProductResponse.decode(new _m0.Reader(data)));
  }

  GetListingFees(request: GetListingFeesRequest): Promise<GetListingFeesResponse> {
    const data = GetListingFeesRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetListingFees", data);
    return promise.then((data) => GetListingFeesResponse.decode(new _m0.Reader(data)));
  }

  UpdateSecurityFee(request: UpdateSecurityFeeRequest): Promise<UpdateSecurityFeeResponse> {
    const data = UpdateSecurityFeeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateSecurityFee", data);
    return promise.then((data) => UpdateSecurityFeeResponse.decode(new _m0.Reader(data)));
  }

  ValidIdsForPromoCode(request: ValidIDsForPromoCodeRequest): Promise<ValidIDsForPromoCodeResponse> {
    const data = ValidIDsForPromoCodeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ValidIdsForPromoCode", data);
    return promise.then((data) => ValidIDsForPromoCodeResponse.decode(new _m0.Reader(data)));
  }

  GetProductDetailsForPromoCodeValidation(
    request: GetProductDetailsForPromoCodeValidationRequest,
  ): Promise<GetProductDetailsForPromoCodeValidationResponse> {
    const data = GetProductDetailsForPromoCodeValidationRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetProductDetailsForPromoCodeValidation", data);
    return promise.then((data) => GetProductDetailsForPromoCodeValidationResponse.decode(new _m0.Reader(data)));
  }

  ValidateUserUsageOfPromoCode(
    request: ValidateUserUsageOfPromoCodeRequest,
  ): Promise<ValidateUserUsageOfPromoCodeResponse> {
    const data = ValidateUserUsageOfPromoCodeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ValidateUserUsageOfPromoCode", data);
    return promise.then((data) => ValidateUserUsageOfPromoCodeResponse.decode(new _m0.Reader(data)));
  }

  ProcessReserveFinancingPayment(
    request: ProcessReserveFinancingPaymentRequest,
  ): Promise<ProcessReserveFinancingPaymentResponse> {
    const data = ProcessReserveFinancingPaymentRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "ProcessReserveFinancingPayment", data);
    return promise.then((data) => ProcessReserveFinancingPaymentResponse.decode(new _m0.Reader(data)));
  }

  GenerateSmsaTracking(request: Request): Promise<GenerateSmsaTrackingResponse> {
    const data = Request.encode(request).finish();
    const promise = this.rpc.request(this.service, "GenerateSmsaTracking", data);
    return promise.then((data) => GenerateSmsaTrackingResponse.decode(new _m0.Reader(data)));
  }

  GetOrderDetailById(request: GetOrderDetailRequest): Promise<GetOrderDetailByIdResponse> {
    const data = GetOrderDetailRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetOrderDetailById", data);
    return promise.then((data) => GetOrderDetailByIdResponse.decode(new _m0.Reader(data)));
  }

  GetOrderDetailByUserType(request: GetOrderDetailByUserTypeRequest): Promise<GetOrderDetailByIdResponse> {
    const data = GetOrderDetailByUserTypeRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetOrderDetailByUserType", data);
    return promise.then((data) => GetOrderDetailByIdResponse.decode(new _m0.Reader(data)));
  }

  CreateDmOrder(request: Request): Promise<GetOrderDetailByIdResponse> {
    const data = Request.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateDmOrder", data);
    return promise.then((data) => GetOrderDetailByIdResponse.decode(new _m0.Reader(data)));
  }

  UpdateDmOrder(request: Request): Promise<GetOrderDetailByIdResponse> {
    const data = Request.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateDmOrder", data);
    return promise.then((data) => GetOrderDetailByIdResponse.decode(new _m0.Reader(data)));
  }

  GetUserProfile(request: GetUserDataRequest): Promise<GetOrderDetailByIdResponse> {
    const data = GetUserDataRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUserProfile", data);
    return promise.then((data) => GetOrderDetailByIdResponse.decode(new _m0.Reader(data)));
  }

  GetUserLastOrderData(request: GetUserDataRequest): Promise<GetUserLastOrderDataResponse> {
    const data = GetUserDataRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetUserLastOrderData", data);
    return promise.then((data) => GetUserLastOrderDataResponse.decode(new _m0.Reader(data)));
  }

  SubmitRating(request: SubmitRatingRequest): Promise<SubmitRatingResponse> {
    const data = SubmitRatingRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubmitRating", data);
    return promise.then((data) => SubmitRatingResponse.decode(new _m0.Reader(data)));
  }

  GetCategoryModelsCount(request: GetVariantsRequest): Promise<GetCategoryModelsCountResponse> {
    const data = GetVariantsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetCategoryModelsCount", data);
    return promise.then((data) => GetCategoryModelsCountResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
