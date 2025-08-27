// Original file: node_modules/soum-proto/proto/v2.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { CancelOrderRequest as _v2_CancelOrderRequest, CancelOrderRequest__Output as _v2_CancelOrderRequest__Output } from '../v2/CancelOrderRequest';
import type { CancelOrderResponse as _v2_CancelOrderResponse, CancelOrderResponse__Output as _v2_CancelOrderResponse__Output } from '../v2/CancelOrderResponse';
import type { CheckUserOTPRequest as _v2_CheckUserOTPRequest, CheckUserOTPRequest__Output as _v2_CheckUserOTPRequest__Output } from '../v2/CheckUserOTPRequest';
import type { CheckUserOTPResponse as _v2_CheckUserOTPResponse, CheckUserOTPResponse__Output as _v2_CheckUserOTPResponse__Output } from '../v2/CheckUserOTPResponse';
import type { CreateNewUserRequest as _v2_CreateNewUserRequest, CreateNewUserRequest__Output as _v2_CreateNewUserRequest__Output } from '../v2/CreateNewUserRequest';
import type { CreateNewUserResponse as _v2_CreateNewUserResponse, CreateNewUserResponse__Output as _v2_CreateNewUserResponse__Output } from '../v2/CreateNewUserResponse';
import type { CreateOrderRequest as _v2_CreateOrderRequest, CreateOrderRequest__Output as _v2_CreateOrderRequest__Output } from '../v2/CreateOrderRequest';
import type { CreateOrderResponse as _v2_CreateOrderResponse, CreateOrderResponse__Output as _v2_CreateOrderResponse__Output } from '../v2/CreateOrderResponse';
import type { CreateSMSATracking as _v2_CreateSMSATracking, CreateSMSATracking__Output as _v2_CreateSMSATracking__Output } from '../v2/CreateSMSATracking';
import type { FetchInvoiceGenerationDataRequest as _v2_FetchInvoiceGenerationDataRequest, FetchInvoiceGenerationDataRequest__Output as _v2_FetchInvoiceGenerationDataRequest__Output } from '../v2/FetchInvoiceGenerationDataRequest';
import type { FetchInvoiceGenerationDataResponse as _v2_FetchInvoiceGenerationDataResponse, FetchInvoiceGenerationDataResponse__Output as _v2_FetchInvoiceGenerationDataResponse__Output } from '../v2/FetchInvoiceGenerationDataResponse';
import type { GenerateSmsaTrackingResponse as _v2_GenerateSmsaTrackingResponse, GenerateSmsaTrackingResponse__Output as _v2_GenerateSmsaTrackingResponse__Output } from '../v2/GenerateSmsaTrackingResponse';
import type { GetBannersRequest as _v2_GetBannersRequest, GetBannersRequest__Output as _v2_GetBannersRequest__Output } from '../v2/GetBannersRequest';
import type { GetBannersResponse as _v2_GetBannersResponse, GetBannersResponse__Output as _v2_GetBannersResponse__Output } from '../v2/GetBannersResponse';
import type { GetBidSummaryRequest as _v2_GetBidSummaryRequest, GetBidSummaryRequest__Output as _v2_GetBidSummaryRequest__Output } from '../v2/GetBidSummaryRequest';
import type { GetBidSummaryResponse as _v2_GetBidSummaryResponse, GetBidSummaryResponse__Output as _v2_GetBidSummaryResponse__Output } from '../v2/GetBidSummaryResponse';
import type { GetCategoryModelsCountResponse as _v2_GetCategoryModelsCountResponse, GetCategoryModelsCountResponse__Output as _v2_GetCategoryModelsCountResponse__Output } from '../v2/GetCategoryModelsCountResponse';
import type { GetCompletionRateUserRequest as _v2_GetCompletionRateUserRequest, GetCompletionRateUserRequest__Output as _v2_GetCompletionRateUserRequest__Output } from '../v2/GetCompletionRateUserRequest';
import type { GetCompletionRateUserResponse as _v2_GetCompletionRateUserResponse, GetCompletionRateUserResponse__Output as _v2_GetCompletionRateUserResponse__Output } from '../v2/GetCompletionRateUserResponse';
import type { GetCountdownValInHoursRequest as _v2_GetCountdownValInHoursRequest, GetCountdownValInHoursRequest__Output as _v2_GetCountdownValInHoursRequest__Output } from '../v2/GetCountdownValInHoursRequest';
import type { GetCountdownValInHoursResponse as _v2_GetCountdownValInHoursResponse, GetCountdownValInHoursResponse__Output as _v2_GetCountdownValInHoursResponse__Output } from '../v2/GetCountdownValInHoursResponse';
import type { GetDmUserRequest as _v2_GetDmUserRequest, GetDmUserRequest__Output as _v2_GetDmUserRequest__Output } from '../v2/GetDmUserRequest';
import type { GetDmUserResponse as _v2_GetDmUserResponse, GetDmUserResponse__Output as _v2_GetDmUserResponse__Output } from '../v2/GetDmUserResponse';
import type { GetDmUsersRequest as _v2_GetDmUsersRequest, GetDmUsersRequest__Output as _v2_GetDmUsersRequest__Output } from '../v2/GetDmUsersRequest';
import type { GetDmUsersResponse as _v2_GetDmUsersResponse, GetDmUsersResponse__Output as _v2_GetDmUsersResponse__Output } from '../v2/GetDmUsersResponse';
import type { GetFeedRequest as _v2_GetFeedRequest, GetFeedRequest__Output as _v2_GetFeedRequest__Output } from '../v2/GetFeedRequest';
import type { GetFeedsResponse as _v2_GetFeedsResponse, GetFeedsResponse__Output as _v2_GetFeedsResponse__Output } from '../v2/GetFeedsResponse';
import type { GetInvoiceGenerationFlagRequest as _v2_GetInvoiceGenerationFlagRequest, GetInvoiceGenerationFlagRequest__Output as _v2_GetInvoiceGenerationFlagRequest__Output } from '../v2/GetInvoiceGenerationFlagRequest';
import type { GetInvoiceGenerationFlagResponse as _v2_GetInvoiceGenerationFlagResponse, GetInvoiceGenerationFlagResponse__Output as _v2_GetInvoiceGenerationFlagResponse__Output } from '../v2/GetInvoiceGenerationFlagResponse';
import type { GetLegacyUserViaLocalPhoneRequest as _v2_GetLegacyUserViaLocalPhoneRequest, GetLegacyUserViaLocalPhoneRequest__Output as _v2_GetLegacyUserViaLocalPhoneRequest__Output } from '../v2/GetLegacyUserViaLocalPhoneRequest';
import type { GetLegacyUserViaLocalPhoneResponse as _v2_GetLegacyUserViaLocalPhoneResponse, GetLegacyUserViaLocalPhoneResponse__Output as _v2_GetLegacyUserViaLocalPhoneResponse__Output } from '../v2/GetLegacyUserViaLocalPhoneResponse';
import type { GetListingFeesRequest as _v2_GetListingFeesRequest, GetListingFeesRequest__Output as _v2_GetListingFeesRequest__Output } from '../v2/GetListingFeesRequest';
import type { GetListingFeesResponse as _v2_GetListingFeesResponse, GetListingFeesResponse__Output as _v2_GetListingFeesResponse__Output } from '../v2/GetListingFeesResponse';
import type { GetMarketPriceByVariantIdRequest as _v2_GetMarketPriceByVariantIdRequest, GetMarketPriceByVariantIdRequest__Output as _v2_GetMarketPriceByVariantIdRequest__Output } from '../v2/GetMarketPriceByVariantIdRequest';
import type { GetMarketPriceByVariantIdResponse as _v2_GetMarketPriceByVariantIdResponse, GetMarketPriceByVariantIdResponse__Output as _v2_GetMarketPriceByVariantIdResponse__Output } from '../v2/GetMarketPriceByVariantIdResponse';
import type { GetOrderDetailByIdResponse as _v2_GetOrderDetailByIdResponse, GetOrderDetailByIdResponse__Output as _v2_GetOrderDetailByIdResponse__Output } from '../v2/GetOrderDetailByIdResponse';
import type { GetOrderDetailByUserTypeRequest as _v2_GetOrderDetailByUserTypeRequest, GetOrderDetailByUserTypeRequest__Output as _v2_GetOrderDetailByUserTypeRequest__Output } from '../v2/GetOrderDetailByUserTypeRequest';
import type { GetOrderDetailRequest as _v2_GetOrderDetailRequest, GetOrderDetailRequest__Output as _v2_GetOrderDetailRequest__Output } from '../v2/GetOrderDetailRequest';
import type { GetOrderDetailResponse as _v2_GetOrderDetailResponse, GetOrderDetailResponse__Output as _v2_GetOrderDetailResponse__Output } from '../v2/GetOrderDetailResponse';
import type { GetOrderSaleAnalyticsRequest as _v2_GetOrderSaleAnalyticsRequest, GetOrderSaleAnalyticsRequest__Output as _v2_GetOrderSaleAnalyticsRequest__Output } from '../v2/GetOrderSaleAnalyticsRequest';
import type { GetOrderSaleAnalyticsResponse as _v2_GetOrderSaleAnalyticsResponse, GetOrderSaleAnalyticsResponse__Output as _v2_GetOrderSaleAnalyticsResponse__Output } from '../v2/GetOrderSaleAnalyticsResponse';
import type { GetPenalizedOrdersRequest as _v2_GetPenalizedOrdersRequest, GetPenalizedOrdersRequest__Output as _v2_GetPenalizedOrdersRequest__Output } from '../v2/GetPenalizedOrdersRequest';
import type { GetPenalizedOrdersResponse as _v2_GetPenalizedOrdersResponse, GetPenalizedOrdersResponse__Output as _v2_GetPenalizedOrdersResponse__Output } from '../v2/GetPenalizedOrdersResponse';
import type { GetPendingPayoutAnalyticsRequest as _v2_GetPendingPayoutAnalyticsRequest, GetPendingPayoutAnalyticsRequest__Output as _v2_GetPendingPayoutAnalyticsRequest__Output } from '../v2/GetPendingPayoutAnalyticsRequest';
import type { GetPendingPayoutAnalyticsResponse as _v2_GetPendingPayoutAnalyticsResponse, GetPendingPayoutAnalyticsResponse__Output as _v2_GetPendingPayoutAnalyticsResponse__Output } from '../v2/GetPendingPayoutAnalyticsResponse';
import type { GetPendingPayoutPaginationRequest as _v2_GetPendingPayoutPaginationRequest, GetPendingPayoutPaginationRequest__Output as _v2_GetPendingPayoutPaginationRequest__Output } from '../v2/GetPendingPayoutPaginationRequest';
import type { GetPendingPayoutPaginationResponse as _v2_GetPendingPayoutPaginationResponse, GetPendingPayoutPaginationResponse__Output as _v2_GetPendingPayoutPaginationResponse__Output } from '../v2/GetPendingPayoutPaginationResponse';
import type { GetPermissionsRequest as _v2_GetPermissionsRequest, GetPermissionsRequest__Output as _v2_GetPermissionsRequest__Output } from '../v2/GetPermissionsRequest';
import type { GetPermissionsResponse as _v2_GetPermissionsResponse, GetPermissionsResponse__Output as _v2_GetPermissionsResponse__Output } from '../v2/GetPermissionsResponse';
import type { GetProductDetailsForPromoCodeValidationRequest as _v2_GetProductDetailsForPromoCodeValidationRequest, GetProductDetailsForPromoCodeValidationRequest__Output as _v2_GetProductDetailsForPromoCodeValidationRequest__Output } from '../v2/GetProductDetailsForPromoCodeValidationRequest';
import type { GetProductDetailsForPromoCodeValidationResponse as _v2_GetProductDetailsForPromoCodeValidationResponse, GetProductDetailsForPromoCodeValidationResponse__Output as _v2_GetProductDetailsForPromoCodeValidationResponse__Output } from '../v2/GetProductDetailsForPromoCodeValidationResponse';
import type { GetProductForCommissionRequest as _v2_GetProductForCommissionRequest, GetProductForCommissionRequest__Output as _v2_GetProductForCommissionRequest__Output } from '../v2/GetProductForCommissionRequest';
import type { GetProductForCommissionResponse as _v2_GetProductForCommissionResponse, GetProductForCommissionResponse__Output as _v2_GetProductForCommissionResponse__Output } from '../v2/GetProductForCommissionResponse';
import type { GetProductStatusesRequest as _v2_GetProductStatusesRequest, GetProductStatusesRequest__Output as _v2_GetProductStatusesRequest__Output } from '../v2/GetProductStatusesRequest';
import type { GetProductStatusesResponse as _v2_GetProductStatusesResponse, GetProductStatusesResponse__Output as _v2_GetProductStatusesResponse__Output } from '../v2/GetProductStatusesResponse';
import type { GetProductsForProductServiceResponse as _v2_GetProductsForProductServiceResponse, GetProductsForProductServiceResponse__Output as _v2_GetProductsForProductServiceResponse__Output } from '../v2/GetProductsForProductServiceResponse';
import type { GetProductsRequest as _v2_GetProductsRequest, GetProductsRequest__Output as _v2_GetProductsRequest__Output } from '../v2/GetProductsRequest';
import type { GetProductsResponse as _v2_GetProductsResponse, GetProductsResponse__Output as _v2_GetProductsResponse__Output } from '../v2/GetProductsResponse';
import type { GetPromoCodeRequest as _v2_GetPromoCodeRequest, GetPromoCodeRequest__Output as _v2_GetPromoCodeRequest__Output } from '../v2/GetPromoCodeRequest';
import type { GetPromoCodeResponse as _v2_GetPromoCodeResponse, GetPromoCodeResponse__Output as _v2_GetPromoCodeResponse__Output } from '../v2/GetPromoCodeResponse';
import type { GetRecentlySoldProductsRequest as _v2_GetRecentlySoldProductsRequest, GetRecentlySoldProductsRequest__Output as _v2_GetRecentlySoldProductsRequest__Output } from '../v2/GetRecentlySoldProductsRequest';
import type { GetSellerBadgeRequest as _v2_GetSellerBadgeRequest, GetSellerBadgeRequest__Output as _v2_GetSellerBadgeRequest__Output } from '../v2/GetSellerBadgeRequest';
import type { GetSellerBadgeResponse as _v2_GetSellerBadgeResponse, GetSellerBadgeResponse__Output as _v2_GetSellerBadgeResponse__Output } from '../v2/GetSellerBadgeResponse';
import type { GetTopSellingProductModelsRequest as _v2_GetTopSellingProductModelsRequest, GetTopSellingProductModelsRequest__Output as _v2_GetTopSellingProductModelsRequest__Output } from '../v2/GetTopSellingProductModelsRequest';
import type { GetTopSellingProductModelsResponse as _v2_GetTopSellingProductModelsResponse, GetTopSellingProductModelsResponse__Output as _v2_GetTopSellingProductModelsResponse__Output } from '../v2/GetTopSellingProductModelsResponse';
import type { GetUserDataRequest as _v2_GetUserDataRequest, GetUserDataRequest__Output as _v2_GetUserDataRequest__Output } from '../v2/GetUserDataRequest';
import type { GetUserLastOrderDataResponse as _v2_GetUserLastOrderDataResponse, GetUserLastOrderDataResponse__Output as _v2_GetUserLastOrderDataResponse__Output } from '../v2/GetUserLastOrderDataResponse';
import type { GetUserRequest as _v2_GetUserRequest, GetUserRequest__Output as _v2_GetUserRequest__Output } from '../v2/GetUserRequest';
import type { GetUserResponse as _v2_GetUserResponse, GetUserResponse__Output as _v2_GetUserResponse__Output } from '../v2/GetUserResponse';
import type { GetUsersByPhoneRequest as _v2_GetUsersByPhoneRequest, GetUsersByPhoneRequest__Output as _v2_GetUsersByPhoneRequest__Output } from '../v2/GetUsersByPhoneRequest';
import type { GetUsersByPhoneResponse as _v2_GetUsersByPhoneResponse, GetUsersByPhoneResponse__Output as _v2_GetUsersByPhoneResponse__Output } from '../v2/GetUsersByPhoneResponse';
import type { GetUsersRequest as _v2_GetUsersRequest, GetUsersRequest__Output as _v2_GetUsersRequest__Output } from '../v2/GetUsersRequest';
import type { GetUsersResponse as _v2_GetUsersResponse, GetUsersResponse__Output as _v2_GetUsersResponse__Output } from '../v2/GetUsersResponse';
import type { GetVariantsRequest as _v2_GetVariantsRequest, GetVariantsRequest__Output as _v2_GetVariantsRequest__Output } from '../v2/GetVariantsRequest';
import type { GetVariantsResponse as _v2_GetVariantsResponse, GetVariantsResponse__Output as _v2_GetVariantsResponse__Output } from '../v2/GetVariantsResponse';
import type { GetViewedProductsRequest as _v2_GetViewedProductsRequest, GetViewedProductsRequest__Output as _v2_GetViewedProductsRequest__Output } from '../v2/GetViewedProductsRequest';
import type { GetViewedProductsResponse as _v2_GetViewedProductsResponse, GetViewedProductsResponse__Output as _v2_GetViewedProductsResponse__Output } from '../v2/GetViewedProductsResponse';
import type { ProcessReserveFinancingPaymentRequest as _v2_ProcessReserveFinancingPaymentRequest, ProcessReserveFinancingPaymentRequest__Output as _v2_ProcessReserveFinancingPaymentRequest__Output } from '../v2/ProcessReserveFinancingPaymentRequest';
import type { ProcessReserveFinancingPaymentResponse as _v2_ProcessReserveFinancingPaymentResponse, ProcessReserveFinancingPaymentResponse__Output as _v2_ProcessReserveFinancingPaymentResponse__Output } from '../v2/ProcessReserveFinancingPaymentResponse';
import type { Request as _v2_Request, Request__Output as _v2_Request__Output } from '../v2/Request';
import type { SetUserOTPRequest as _v2_SetUserOTPRequest, SetUserOTPRequest__Output as _v2_SetUserOTPRequest__Output } from '../v2/SetUserOTPRequest';
import type { SetUserOTPResponse as _v2_SetUserOTPResponse, SetUserOTPResponse__Output as _v2_SetUserOTPResponse__Output } from '../v2/SetUserOTPResponse';
import type { SubmitRatingRequest as _v2_SubmitRatingRequest, SubmitRatingRequest__Output as _v2_SubmitRatingRequest__Output } from '../v2/SubmitRatingRequest';
import type { SubmitRatingResponse as _v2_SubmitRatingResponse, SubmitRatingResponse__Output as _v2_SubmitRatingResponse__Output } from '../v2/SubmitRatingResponse';
import type { UpdateHighestBidRequest as _v2_UpdateHighestBidRequest, UpdateHighestBidRequest__Output as _v2_UpdateHighestBidRequest__Output } from '../v2/UpdateHighestBidRequest';
import type { UpdateHighestBidResponse as _v2_UpdateHighestBidResponse, UpdateHighestBidResponse__Output as _v2_UpdateHighestBidResponse__Output } from '../v2/UpdateHighestBidResponse';
import type { UpdateInactiveUserRequest as _v2_UpdateInactiveUserRequest, UpdateInactiveUserRequest__Output as _v2_UpdateInactiveUserRequest__Output } from '../v2/UpdateInactiveUserRequest';
import type { UpdateInactiveUserResponse as _v2_UpdateInactiveUserResponse, UpdateInactiveUserResponse__Output as _v2_UpdateInactiveUserResponse__Output } from '../v2/UpdateInactiveUserResponse';
import type { UpdateLogisticServiceRequest as _v2_UpdateLogisticServiceRequest, UpdateLogisticServiceRequest__Output as _v2_UpdateLogisticServiceRequest__Output } from '../v2/UpdateLogisticServiceRequest';
import type { UpdateLogisticServiceResponse as _v2_UpdateLogisticServiceResponse, UpdateLogisticServiceResponse__Output as _v2_UpdateLogisticServiceResponse__Output } from '../v2/UpdateLogisticServiceResponse';
import type { UpdateOrderAttributeRequest as _v2_UpdateOrderAttributeRequest, UpdateOrderAttributeRequest__Output as _v2_UpdateOrderAttributeRequest__Output } from '../v2/UpdateOrderAttributeRequest';
import type { UpdateOrderAttributeResponse as _v2_UpdateOrderAttributeResponse, UpdateOrderAttributeResponse__Output as _v2_UpdateOrderAttributeResponse__Output } from '../v2/UpdateOrderAttributeResponse';
import type { UpdatePaymentStatusOfOrderRequest as _v2_UpdatePaymentStatusOfOrderRequest, UpdatePaymentStatusOfOrderRequest__Output as _v2_UpdatePaymentStatusOfOrderRequest__Output } from '../v2/UpdatePaymentStatusOfOrderRequest';
import type { UpdatePaymentStatusOfOrderResponse as _v2_UpdatePaymentStatusOfOrderResponse, UpdatePaymentStatusOfOrderResponse__Output as _v2_UpdatePaymentStatusOfOrderResponse__Output } from '../v2/UpdatePaymentStatusOfOrderResponse';
import type { UpdatePenaltyFlagRequest as _v2_UpdatePenaltyFlagRequest, UpdatePenaltyFlagRequest__Output as _v2_UpdatePenaltyFlagRequest__Output } from '../v2/UpdatePenaltyFlagRequest';
import type { UpdatePenaltyFlagResponse as _v2_UpdatePenaltyFlagResponse, UpdatePenaltyFlagResponse__Output as _v2_UpdatePenaltyFlagResponse__Output } from '../v2/UpdatePenaltyFlagResponse';
import type { UpdateProductRequest as _v2_UpdateProductRequest, UpdateProductRequest__Output as _v2_UpdateProductRequest__Output } from '../v2/UpdateProductRequest';
import type { UpdateProductResponse as _v2_UpdateProductResponse, UpdateProductResponse__Output as _v2_UpdateProductResponse__Output } from '../v2/UpdateProductResponse';
import type { UpdateSecurityFeeRequest as _v2_UpdateSecurityFeeRequest, UpdateSecurityFeeRequest__Output as _v2_UpdateSecurityFeeRequest__Output } from '../v2/UpdateSecurityFeeRequest';
import type { UpdateSecurityFeeResponse as _v2_UpdateSecurityFeeResponse, UpdateSecurityFeeResponse__Output as _v2_UpdateSecurityFeeResponse__Output } from '../v2/UpdateSecurityFeeResponse';
import type { ValidIDsForPromoCodeRequest as _v2_ValidIDsForPromoCodeRequest, ValidIDsForPromoCodeRequest__Output as _v2_ValidIDsForPromoCodeRequest__Output } from '../v2/ValidIDsForPromoCodeRequest';
import type { ValidIDsForPromoCodeResponse as _v2_ValidIDsForPromoCodeResponse, ValidIDsForPromoCodeResponse__Output as _v2_ValidIDsForPromoCodeResponse__Output } from '../v2/ValidIDsForPromoCodeResponse';
import type { ValidateSellerDetectionNudgeRequest as _v2_ValidateSellerDetectionNudgeRequest, ValidateSellerDetectionNudgeRequest__Output as _v2_ValidateSellerDetectionNudgeRequest__Output } from '../v2/ValidateSellerDetectionNudgeRequest';
import type { ValidateSellerDetectionNudgeResponse as _v2_ValidateSellerDetectionNudgeResponse, ValidateSellerDetectionNudgeResponse__Output as _v2_ValidateSellerDetectionNudgeResponse__Output } from '../v2/ValidateSellerDetectionNudgeResponse';
import type { ValidateUserUsageOfPromoCodeRequest as _v2_ValidateUserUsageOfPromoCodeRequest, ValidateUserUsageOfPromoCodeRequest__Output as _v2_ValidateUserUsageOfPromoCodeRequest__Output } from '../v2/ValidateUserUsageOfPromoCodeRequest';
import type { ValidateUserUsageOfPromoCodeResponse as _v2_ValidateUserUsageOfPromoCodeResponse, ValidateUserUsageOfPromoCodeResponse__Output as _v2_ValidateUserUsageOfPromoCodeResponse__Output } from '../v2/ValidateUserUsageOfPromoCodeResponse';

export interface V2ServiceClient extends grpc.Client {
  CancelOrder(argument: _v2_CancelOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  CancelOrder(argument: _v2_CancelOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  CancelOrder(argument: _v2_CancelOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  CancelOrder(argument: _v2_CancelOrderRequest, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _v2_CancelOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _v2_CancelOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _v2_CancelOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  cancelOrder(argument: _v2_CancelOrderRequest, callback: grpc.requestCallback<_v2_CancelOrderResponse__Output>): grpc.ClientUnaryCall;
  
  CheckUserOTP(argument: _v2_CheckUserOTPRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  CheckUserOTP(argument: _v2_CheckUserOTPRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  CheckUserOTP(argument: _v2_CheckUserOTPRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  CheckUserOTP(argument: _v2_CheckUserOTPRequest, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  checkUserOtp(argument: _v2_CheckUserOTPRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  checkUserOtp(argument: _v2_CheckUserOTPRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  checkUserOtp(argument: _v2_CheckUserOTPRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  checkUserOtp(argument: _v2_CheckUserOTPRequest, callback: grpc.requestCallback<_v2_CheckUserOTPResponse__Output>): grpc.ClientUnaryCall;
  
  CreateDmOrder(argument: _v2_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  CreateDmOrder(argument: _v2_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  CreateDmOrder(argument: _v2_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  CreateDmOrder(argument: _v2_Request, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  createDmOrder(argument: _v2_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  createDmOrder(argument: _v2_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  createDmOrder(argument: _v2_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  createDmOrder(argument: _v2_Request, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  
  CreateNewUser(argument: _v2_CreateNewUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  CreateNewUser(argument: _v2_CreateNewUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  CreateNewUser(argument: _v2_CreateNewUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  CreateNewUser(argument: _v2_CreateNewUserRequest, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  createNewUser(argument: _v2_CreateNewUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  createNewUser(argument: _v2_CreateNewUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  createNewUser(argument: _v2_CreateNewUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  createNewUser(argument: _v2_CreateNewUserRequest, callback: grpc.requestCallback<_v2_CreateNewUserResponse__Output>): grpc.ClientUnaryCall;
  
  CreateOrder(argument: _v2_CreateOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  CreateOrder(argument: _v2_CreateOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  CreateOrder(argument: _v2_CreateOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  CreateOrder(argument: _v2_CreateOrderRequest, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _v2_CreateOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _v2_CreateOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _v2_CreateOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  createOrder(argument: _v2_CreateOrderRequest, callback: grpc.requestCallback<_v2_CreateOrderResponse__Output>): grpc.ClientUnaryCall;
  
  CreateSmsaTracking(argument: _v2_CreateSMSATracking, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  CreateSmsaTracking(argument: _v2_CreateSMSATracking, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  CreateSmsaTracking(argument: _v2_CreateSMSATracking, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  CreateSmsaTracking(argument: _v2_CreateSMSATracking, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  createSmsaTracking(argument: _v2_CreateSMSATracking, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  createSmsaTracking(argument: _v2_CreateSMSATracking, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  createSmsaTracking(argument: _v2_CreateSMSATracking, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  createSmsaTracking(argument: _v2_CreateSMSATracking, callback: grpc.requestCallback<_v2_CreateSMSATracking__Output>): grpc.ClientUnaryCall;
  
  FetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  FetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  FetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  FetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  fetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  fetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  fetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  fetchInvoiceGenerationData(argument: _v2_FetchInvoiceGenerationDataRequest, callback: grpc.requestCallback<_v2_FetchInvoiceGenerationDataResponse__Output>): grpc.ClientUnaryCall;
  
  GenerateSmsaTracking(argument: _v2_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  GenerateSmsaTracking(argument: _v2_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  GenerateSmsaTracking(argument: _v2_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  GenerateSmsaTracking(argument: _v2_Request, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  generateSmsaTracking(argument: _v2_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  generateSmsaTracking(argument: _v2_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  generateSmsaTracking(argument: _v2_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  generateSmsaTracking(argument: _v2_Request, callback: grpc.requestCallback<_v2_GenerateSmsaTrackingResponse__Output>): grpc.ClientUnaryCall;
  
  GetBanners(argument: _v2_GetBannersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  GetBanners(argument: _v2_GetBannersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  GetBanners(argument: _v2_GetBannersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  GetBanners(argument: _v2_GetBannersRequest, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  getBanners(argument: _v2_GetBannersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  getBanners(argument: _v2_GetBannersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  getBanners(argument: _v2_GetBannersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  getBanners(argument: _v2_GetBannersRequest, callback: grpc.requestCallback<_v2_GetBannersResponse__Output>): grpc.ClientUnaryCall;
  
  GetBidSummary(argument: _v2_GetBidSummaryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  GetBidSummary(argument: _v2_GetBidSummaryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  GetBidSummary(argument: _v2_GetBidSummaryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  GetBidSummary(argument: _v2_GetBidSummaryRequest, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  getBidSummary(argument: _v2_GetBidSummaryRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  getBidSummary(argument: _v2_GetBidSummaryRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  getBidSummary(argument: _v2_GetBidSummaryRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  getBidSummary(argument: _v2_GetBidSummaryRequest, callback: grpc.requestCallback<_v2_GetBidSummaryResponse__Output>): grpc.ClientUnaryCall;
  
  GetCategoryModelsCount(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  GetCategoryModelsCount(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  GetCategoryModelsCount(argument: _v2_GetVariantsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  GetCategoryModelsCount(argument: _v2_GetVariantsRequest, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  getCategoryModelsCount(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  getCategoryModelsCount(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  getCategoryModelsCount(argument: _v2_GetVariantsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  getCategoryModelsCount(argument: _v2_GetVariantsRequest, callback: grpc.requestCallback<_v2_GetCategoryModelsCountResponse__Output>): grpc.ClientUnaryCall;
  
  GetCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  GetCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  GetCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  GetCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  getCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  getCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  getCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  getCompletionRateUser(argument: _v2_GetCompletionRateUserRequest, callback: grpc.requestCallback<_v2_GetCompletionRateUserResponse__Output>): grpc.ClientUnaryCall;
  
  GetCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  GetCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  GetCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  GetCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  getCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  getCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  getCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  getCountdownValInHours(argument: _v2_GetCountdownValInHoursRequest, callback: grpc.requestCallback<_v2_GetCountdownValInHoursResponse__Output>): grpc.ClientUnaryCall;
  
  GetDmUser(argument: _v2_GetDmUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  GetDmUser(argument: _v2_GetDmUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  GetDmUser(argument: _v2_GetDmUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  GetDmUser(argument: _v2_GetDmUserRequest, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  getDmUser(argument: _v2_GetDmUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  getDmUser(argument: _v2_GetDmUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  getDmUser(argument: _v2_GetDmUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  getDmUser(argument: _v2_GetDmUserRequest, callback: grpc.requestCallback<_v2_GetDmUserResponse__Output>): grpc.ClientUnaryCall;
  
  GetDmUsers(argument: _v2_GetDmUsersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  GetDmUsers(argument: _v2_GetDmUsersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  GetDmUsers(argument: _v2_GetDmUsersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  GetDmUsers(argument: _v2_GetDmUsersRequest, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  getDmUsers(argument: _v2_GetDmUsersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  getDmUsers(argument: _v2_GetDmUsersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  getDmUsers(argument: _v2_GetDmUsersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  getDmUsers(argument: _v2_GetDmUsersRequest, callback: grpc.requestCallback<_v2_GetDmUsersResponse__Output>): grpc.ClientUnaryCall;
  
  GetFeeds(argument: _v2_GetFeedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  GetFeeds(argument: _v2_GetFeedRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  GetFeeds(argument: _v2_GetFeedRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  GetFeeds(argument: _v2_GetFeedRequest, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  getFeeds(argument: _v2_GetFeedRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  getFeeds(argument: _v2_GetFeedRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  getFeeds(argument: _v2_GetFeedRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  getFeeds(argument: _v2_GetFeedRequest, callback: grpc.requestCallback<_v2_GetFeedsResponse__Output>): grpc.ClientUnaryCall;
  
  GetInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  GetInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  GetInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  GetInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  getInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  getInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  getInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  getInvoiceGenerationFlag(argument: _v2_GetInvoiceGenerationFlagRequest, callback: grpc.requestCallback<_v2_GetInvoiceGenerationFlagResponse__Output>): grpc.ClientUnaryCall;
  
  GetLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  GetLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  GetLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  GetLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  getLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  getLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  getLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  getLegacyUserViaLocalPhone(argument: _v2_GetLegacyUserViaLocalPhoneRequest, callback: grpc.requestCallback<_v2_GetLegacyUserViaLocalPhoneResponse__Output>): grpc.ClientUnaryCall;
  
  GetListingFees(argument: _v2_GetListingFeesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  GetListingFees(argument: _v2_GetListingFeesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  GetListingFees(argument: _v2_GetListingFeesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  GetListingFees(argument: _v2_GetListingFeesRequest, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  getListingFees(argument: _v2_GetListingFeesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  getListingFees(argument: _v2_GetListingFeesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  getListingFees(argument: _v2_GetListingFeesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  getListingFees(argument: _v2_GetListingFeesRequest, callback: grpc.requestCallback<_v2_GetListingFeesResponse__Output>): grpc.ClientUnaryCall;
  
  GetMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  GetMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  GetMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  GetMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  getMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  getMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  getMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  getMarketPriceByVariantId(argument: _v2_GetMarketPriceByVariantIdRequest, callback: grpc.requestCallback<_v2_GetMarketPriceByVariantIdResponse__Output>): grpc.ClientUnaryCall;
  
  GetOrderDetail(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetail(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetail(argument: _v2_GetOrderDetailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetail(argument: _v2_GetOrderDetailRequest, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetail(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetail(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetail(argument: _v2_GetOrderDetailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetail(argument: _v2_GetOrderDetailRequest, callback: grpc.requestCallback<_v2_GetOrderDetailResponse__Output>): grpc.ClientUnaryCall;
  
  GetOrderDetailById(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetailById(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetailById(argument: _v2_GetOrderDetailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetailById(argument: _v2_GetOrderDetailRequest, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailById(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailById(argument: _v2_GetOrderDetailRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailById(argument: _v2_GetOrderDetailRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailById(argument: _v2_GetOrderDetailRequest, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  
  GetOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getOrderDetailByUserType(argument: _v2_GetOrderDetailByUserTypeRequest, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  
  GetOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  GetOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  GetOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  GetOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getOrderSaleAnalytics(argument: _v2_GetOrderSaleAnalyticsRequest, callback: grpc.requestCallback<_v2_GetOrderSaleAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  
  GetPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  GetPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  GetPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  GetPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  getPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  getPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  getPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  getPenalizedOrders(argument: _v2_GetPenalizedOrdersRequest, callback: grpc.requestCallback<_v2_GetPenalizedOrdersResponse__Output>): grpc.ClientUnaryCall;
  
  GetPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  GetPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  GetPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  GetPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutAnalytics(argument: _v2_GetPendingPayoutAnalyticsRequest, callback: grpc.requestCallback<_v2_GetPendingPayoutAnalyticsResponse__Output>): grpc.ClientUnaryCall;
  
  GetPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  GetPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  GetPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  GetPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  getPendingPayoutPagination(argument: _v2_GetPendingPayoutPaginationRequest, callback: grpc.requestCallback<_v2_GetPendingPayoutPaginationResponse__Output>): grpc.ClientUnaryCall;
  
  GetPermissions(argument: _v2_GetPermissionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  GetPermissions(argument: _v2_GetPermissionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  GetPermissions(argument: _v2_GetPermissionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  GetPermissions(argument: _v2_GetPermissionsRequest, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  getPermissions(argument: _v2_GetPermissionsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  getPermissions(argument: _v2_GetPermissionsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  getPermissions(argument: _v2_GetPermissionsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  getPermissions(argument: _v2_GetPermissionsRequest, callback: grpc.requestCallback<_v2_GetPermissionsResponse__Output>): grpc.ClientUnaryCall;
  
  GetProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  GetProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  GetProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  GetProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  getProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  getProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  getProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  getProductDetailsForPromoCodeValidation(argument: _v2_GetProductDetailsForPromoCodeValidationRequest, callback: grpc.requestCallback<_v2_GetProductDetailsForPromoCodeValidationResponse__Output>): grpc.ClientUnaryCall;
  
  GetProductForCommission(argument: _v2_GetProductForCommissionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  GetProductForCommission(argument: _v2_GetProductForCommissionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  GetProductForCommission(argument: _v2_GetProductForCommissionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  GetProductForCommission(argument: _v2_GetProductForCommissionRequest, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  getProductForCommission(argument: _v2_GetProductForCommissionRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  getProductForCommission(argument: _v2_GetProductForCommissionRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  getProductForCommission(argument: _v2_GetProductForCommissionRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  getProductForCommission(argument: _v2_GetProductForCommissionRequest, callback: grpc.requestCallback<_v2_GetProductForCommissionResponse__Output>): grpc.ClientUnaryCall;
  
  GetProductStatuses(argument: _v2_GetProductStatusesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  GetProductStatuses(argument: _v2_GetProductStatusesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  GetProductStatuses(argument: _v2_GetProductStatusesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  GetProductStatuses(argument: _v2_GetProductStatusesRequest, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  getProductStatuses(argument: _v2_GetProductStatusesRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  getProductStatuses(argument: _v2_GetProductStatusesRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  getProductStatuses(argument: _v2_GetProductStatusesRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  getProductStatuses(argument: _v2_GetProductStatusesRequest, callback: grpc.requestCallback<_v2_GetProductStatusesResponse__Output>): grpc.ClientUnaryCall;
  
  GetProducts(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  GetProducts(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  GetProducts(argument: _v2_GetProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  GetProducts(argument: _v2_GetProductsRequest, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  getProducts(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  getProducts(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  getProducts(argument: _v2_GetProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  getProducts(argument: _v2_GetProductsRequest, callback: grpc.requestCallback<_v2_GetProductsResponse__Output>): grpc.ClientUnaryCall;
  
  GetProductsForProductService(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  GetProductsForProductService(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  GetProductsForProductService(argument: _v2_GetProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  GetProductsForProductService(argument: _v2_GetProductsRequest, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  getProductsForProductService(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  getProductsForProductService(argument: _v2_GetProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  getProductsForProductService(argument: _v2_GetProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  getProductsForProductService(argument: _v2_GetProductsRequest, callback: grpc.requestCallback<_v2_GetProductsForProductServiceResponse__Output>): grpc.ClientUnaryCall;
  
  GetPromoCode(argument: _v2_GetPromoCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  GetPromoCode(argument: _v2_GetPromoCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  GetPromoCode(argument: _v2_GetPromoCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  GetPromoCode(argument: _v2_GetPromoCodeRequest, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  getPromoCode(argument: _v2_GetPromoCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  getPromoCode(argument: _v2_GetPromoCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  getPromoCode(argument: _v2_GetPromoCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  getPromoCode(argument: _v2_GetPromoCodeRequest, callback: grpc.requestCallback<_v2_GetPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  
  GetRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  GetRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  GetRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  GetRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getRecentlySoldProducts(argument: _v2_GetRecentlySoldProductsRequest, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  
  GetSellerBadge(argument: _v2_GetSellerBadgeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  GetSellerBadge(argument: _v2_GetSellerBadgeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  GetSellerBadge(argument: _v2_GetSellerBadgeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  GetSellerBadge(argument: _v2_GetSellerBadgeRequest, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  getSellerBadge(argument: _v2_GetSellerBadgeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  getSellerBadge(argument: _v2_GetSellerBadgeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  getSellerBadge(argument: _v2_GetSellerBadgeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  getSellerBadge(argument: _v2_GetSellerBadgeRequest, callback: grpc.requestCallback<_v2_GetSellerBadgeResponse__Output>): grpc.ClientUnaryCall;
  
  GetTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  GetTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  GetTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  GetTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  getTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  getTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  getTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  getTopSellingProductModels(argument: _v2_GetTopSellingProductModelsRequest, callback: grpc.requestCallback<_v2_GetTopSellingProductModelsResponse__Output>): grpc.ClientUnaryCall;
  
  GetUser(argument: _v2_GetUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  GetUser(argument: _v2_GetUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  GetUser(argument: _v2_GetUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  GetUser(argument: _v2_GetUserRequest, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  getUser(argument: _v2_GetUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  getUser(argument: _v2_GetUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  getUser(argument: _v2_GetUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  getUser(argument: _v2_GetUserRequest, callback: grpc.requestCallback<_v2_GetUserResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserLastOrderData(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  GetUserLastOrderData(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  GetUserLastOrderData(argument: _v2_GetUserDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  GetUserLastOrderData(argument: _v2_GetUserDataRequest, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  getUserLastOrderData(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  getUserLastOrderData(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  getUserLastOrderData(argument: _v2_GetUserDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  getUserLastOrderData(argument: _v2_GetUserDataRequest, callback: grpc.requestCallback<_v2_GetUserLastOrderDataResponse__Output>): grpc.ClientUnaryCall;
  
  GetUserProfile(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetUserProfile(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetUserProfile(argument: _v2_GetUserDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  GetUserProfile(argument: _v2_GetUserDataRequest, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _v2_GetUserDataRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _v2_GetUserDataRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  getUserProfile(argument: _v2_GetUserDataRequest, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  
  GetUsers(argument: _v2_GetUsersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  GetUsers(argument: _v2_GetUsersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  GetUsers(argument: _v2_GetUsersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  GetUsers(argument: _v2_GetUsersRequest, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  getUsers(argument: _v2_GetUsersRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  getUsers(argument: _v2_GetUsersRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  getUsers(argument: _v2_GetUsersRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  getUsers(argument: _v2_GetUsersRequest, callback: grpc.requestCallback<_v2_GetUsersResponse__Output>): grpc.ClientUnaryCall;
  
  GetUsersByPhone(argument: _v2_GetUsersByPhoneRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  GetUsersByPhone(argument: _v2_GetUsersByPhoneRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  GetUsersByPhone(argument: _v2_GetUsersByPhoneRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  GetUsersByPhone(argument: _v2_GetUsersByPhoneRequest, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  getUsersByPhone(argument: _v2_GetUsersByPhoneRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  getUsersByPhone(argument: _v2_GetUsersByPhoneRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  getUsersByPhone(argument: _v2_GetUsersByPhoneRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  getUsersByPhone(argument: _v2_GetUsersByPhoneRequest, callback: grpc.requestCallback<_v2_GetUsersByPhoneResponse__Output>): grpc.ClientUnaryCall;
  
  GetVariants(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  GetVariants(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  GetVariants(argument: _v2_GetVariantsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  GetVariants(argument: _v2_GetVariantsRequest, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  getVariants(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  getVariants(argument: _v2_GetVariantsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  getVariants(argument: _v2_GetVariantsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  getVariants(argument: _v2_GetVariantsRequest, callback: grpc.requestCallback<_v2_GetVariantsResponse__Output>): grpc.ClientUnaryCall;
  
  GetViewedProducts(argument: _v2_GetViewedProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  GetViewedProducts(argument: _v2_GetViewedProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  GetViewedProducts(argument: _v2_GetViewedProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  GetViewedProducts(argument: _v2_GetViewedProductsRequest, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getViewedProducts(argument: _v2_GetViewedProductsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getViewedProducts(argument: _v2_GetViewedProductsRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getViewedProducts(argument: _v2_GetViewedProductsRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  getViewedProducts(argument: _v2_GetViewedProductsRequest, callback: grpc.requestCallback<_v2_GetViewedProductsResponse__Output>): grpc.ClientUnaryCall;
  
  ProcessReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  ProcessReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  ProcessReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  ProcessReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  processReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  processReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  processReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  processReserveFinancingPayment(argument: _v2_ProcessReserveFinancingPaymentRequest, callback: grpc.requestCallback<_v2_ProcessReserveFinancingPaymentResponse__Output>): grpc.ClientUnaryCall;
  
  SetUserOTP(argument: _v2_SetUserOTPRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  SetUserOTP(argument: _v2_SetUserOTPRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  SetUserOTP(argument: _v2_SetUserOTPRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  SetUserOTP(argument: _v2_SetUserOTPRequest, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  setUserOtp(argument: _v2_SetUserOTPRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  setUserOtp(argument: _v2_SetUserOTPRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  setUserOtp(argument: _v2_SetUserOTPRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  setUserOtp(argument: _v2_SetUserOTPRequest, callback: grpc.requestCallback<_v2_SetUserOTPResponse__Output>): grpc.ClientUnaryCall;
  
  SubmitRating(argument: _v2_SubmitRatingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  SubmitRating(argument: _v2_SubmitRatingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  SubmitRating(argument: _v2_SubmitRatingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  SubmitRating(argument: _v2_SubmitRatingRequest, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  submitRating(argument: _v2_SubmitRatingRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  submitRating(argument: _v2_SubmitRatingRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  submitRating(argument: _v2_SubmitRatingRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  submitRating(argument: _v2_SubmitRatingRequest, callback: grpc.requestCallback<_v2_SubmitRatingResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateDmOrder(argument: _v2_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  UpdateDmOrder(argument: _v2_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  UpdateDmOrder(argument: _v2_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  UpdateDmOrder(argument: _v2_Request, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  updateDmOrder(argument: _v2_Request, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  updateDmOrder(argument: _v2_Request, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  updateDmOrder(argument: _v2_Request, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  updateDmOrder(argument: _v2_Request, callback: grpc.requestCallback<_v2_GetOrderDetailByIdResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateHighestBid(argument: _v2_UpdateHighestBidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  UpdateHighestBid(argument: _v2_UpdateHighestBidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  UpdateHighestBid(argument: _v2_UpdateHighestBidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  UpdateHighestBid(argument: _v2_UpdateHighestBidRequest, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  updateHighestBid(argument: _v2_UpdateHighestBidRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  updateHighestBid(argument: _v2_UpdateHighestBidRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  updateHighestBid(argument: _v2_UpdateHighestBidRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  updateHighestBid(argument: _v2_UpdateHighestBidRequest, callback: grpc.requestCallback<_v2_UpdateHighestBidResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateInactiveUser(argument: _v2_UpdateInactiveUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  UpdateInactiveUser(argument: _v2_UpdateInactiveUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  UpdateInactiveUser(argument: _v2_UpdateInactiveUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  UpdateInactiveUser(argument: _v2_UpdateInactiveUserRequest, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  updateInactiveUser(argument: _v2_UpdateInactiveUserRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  updateInactiveUser(argument: _v2_UpdateInactiveUserRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  updateInactiveUser(argument: _v2_UpdateInactiveUserRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  updateInactiveUser(argument: _v2_UpdateInactiveUserRequest, callback: grpc.requestCallback<_v2_UpdateInactiveUserResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateLogisticService(argument: _v2_UpdateLogisticServiceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  UpdateLogisticService(argument: _v2_UpdateLogisticServiceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  UpdateLogisticService(argument: _v2_UpdateLogisticServiceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  UpdateLogisticService(argument: _v2_UpdateLogisticServiceRequest, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  updateLogisticService(argument: _v2_UpdateLogisticServiceRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  updateLogisticService(argument: _v2_UpdateLogisticServiceRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  updateLogisticService(argument: _v2_UpdateLogisticServiceRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  updateLogisticService(argument: _v2_UpdateLogisticServiceRequest, callback: grpc.requestCallback<_v2_UpdateLogisticServiceResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  UpdateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  UpdateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  UpdateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  updateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  updateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  updateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  updateOrderAttribute(argument: _v2_UpdateOrderAttributeRequest, callback: grpc.requestCallback<_v2_UpdateOrderAttributeResponse__Output>): grpc.ClientUnaryCall;
  
  UpdatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  UpdatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  UpdatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  UpdatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  updatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  updatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  updatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  updatePaymentStatusOfOrder(argument: _v2_UpdatePaymentStatusOfOrderRequest, callback: grpc.requestCallback<_v2_UpdatePaymentStatusOfOrderResponse__Output>): grpc.ClientUnaryCall;
  
  UpdatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  UpdatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  UpdatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  UpdatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  updatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  updatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  updatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  updatePenaltyFlag(argument: _v2_UpdatePenaltyFlagRequest, callback: grpc.requestCallback<_v2_UpdatePenaltyFlagResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateProduct(argument: _v2_UpdateProductRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  UpdateProduct(argument: _v2_UpdateProductRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  UpdateProduct(argument: _v2_UpdateProductRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  UpdateProduct(argument: _v2_UpdateProductRequest, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _v2_UpdateProductRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _v2_UpdateProductRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _v2_UpdateProductRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  updateProduct(argument: _v2_UpdateProductRequest, callback: grpc.requestCallback<_v2_UpdateProductResponse__Output>): grpc.ClientUnaryCall;
  
  UpdateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  UpdateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  UpdateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  UpdateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  updateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  updateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  updateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  updateSecurityFee(argument: _v2_UpdateSecurityFeeRequest, callback: grpc.requestCallback<_v2_UpdateSecurityFeeResponse__Output>): grpc.ClientUnaryCall;
  
  ValidIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  ValidIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  ValidIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  ValidIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validIdsForPromoCode(argument: _v2_ValidIDsForPromoCodeRequest, callback: grpc.requestCallback<_v2_ValidIDsForPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  
  ValidateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  ValidateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  ValidateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  ValidateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  validateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  validateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  validateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  validateSellerDetectionNudge(argument: _v2_ValidateSellerDetectionNudgeRequest, callback: grpc.requestCallback<_v2_ValidateSellerDetectionNudgeResponse__Output>): grpc.ClientUnaryCall;
  
  ValidateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  ValidateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  ValidateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  ValidateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  validateUserUsageOfPromoCode(argument: _v2_ValidateUserUsageOfPromoCodeRequest, callback: grpc.requestCallback<_v2_ValidateUserUsageOfPromoCodeResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface V2ServiceHandlers extends grpc.UntypedServiceImplementation {
  CancelOrder: grpc.handleUnaryCall<_v2_CancelOrderRequest__Output, _v2_CancelOrderResponse>;
  
  CheckUserOTP: grpc.handleUnaryCall<_v2_CheckUserOTPRequest__Output, _v2_CheckUserOTPResponse>;
  
  CreateDmOrder: grpc.handleUnaryCall<_v2_Request__Output, _v2_GetOrderDetailByIdResponse>;
  
  CreateNewUser: grpc.handleUnaryCall<_v2_CreateNewUserRequest__Output, _v2_CreateNewUserResponse>;
  
  CreateOrder: grpc.handleUnaryCall<_v2_CreateOrderRequest__Output, _v2_CreateOrderResponse>;
  
  CreateSmsaTracking: grpc.handleUnaryCall<_v2_CreateSMSATracking__Output, _v2_CreateSMSATracking>;
  
  FetchInvoiceGenerationData: grpc.handleUnaryCall<_v2_FetchInvoiceGenerationDataRequest__Output, _v2_FetchInvoiceGenerationDataResponse>;
  
  GenerateSmsaTracking: grpc.handleUnaryCall<_v2_Request__Output, _v2_GenerateSmsaTrackingResponse>;
  
  GetBanners: grpc.handleUnaryCall<_v2_GetBannersRequest__Output, _v2_GetBannersResponse>;
  
  GetBidSummary: grpc.handleUnaryCall<_v2_GetBidSummaryRequest__Output, _v2_GetBidSummaryResponse>;
  
  GetCategoryModelsCount: grpc.handleUnaryCall<_v2_GetVariantsRequest__Output, _v2_GetCategoryModelsCountResponse>;
  
  GetCompletionRateUser: grpc.handleUnaryCall<_v2_GetCompletionRateUserRequest__Output, _v2_GetCompletionRateUserResponse>;
  
  GetCountdownValInHours: grpc.handleUnaryCall<_v2_GetCountdownValInHoursRequest__Output, _v2_GetCountdownValInHoursResponse>;
  
  GetDmUser: grpc.handleUnaryCall<_v2_GetDmUserRequest__Output, _v2_GetDmUserResponse>;
  
  GetDmUsers: grpc.handleUnaryCall<_v2_GetDmUsersRequest__Output, _v2_GetDmUsersResponse>;
  
  GetFeeds: grpc.handleUnaryCall<_v2_GetFeedRequest__Output, _v2_GetFeedsResponse>;
  
  GetInvoiceGenerationFlag: grpc.handleUnaryCall<_v2_GetInvoiceGenerationFlagRequest__Output, _v2_GetInvoiceGenerationFlagResponse>;
  
  GetLegacyUserViaLocalPhone: grpc.handleUnaryCall<_v2_GetLegacyUserViaLocalPhoneRequest__Output, _v2_GetLegacyUserViaLocalPhoneResponse>;
  
  GetListingFees: grpc.handleUnaryCall<_v2_GetListingFeesRequest__Output, _v2_GetListingFeesResponse>;
  
  GetMarketPriceByVariantId: grpc.handleUnaryCall<_v2_GetMarketPriceByVariantIdRequest__Output, _v2_GetMarketPriceByVariantIdResponse>;
  
  GetOrderDetail: grpc.handleUnaryCall<_v2_GetOrderDetailRequest__Output, _v2_GetOrderDetailResponse>;
  
  GetOrderDetailById: grpc.handleUnaryCall<_v2_GetOrderDetailRequest__Output, _v2_GetOrderDetailByIdResponse>;
  
  GetOrderDetailByUserType: grpc.handleUnaryCall<_v2_GetOrderDetailByUserTypeRequest__Output, _v2_GetOrderDetailByIdResponse>;
  
  GetOrderSaleAnalytics: grpc.handleUnaryCall<_v2_GetOrderSaleAnalyticsRequest__Output, _v2_GetOrderSaleAnalyticsResponse>;
  
  GetPenalizedOrders: grpc.handleUnaryCall<_v2_GetPenalizedOrdersRequest__Output, _v2_GetPenalizedOrdersResponse>;
  
  GetPendingPayoutAnalytics: grpc.handleUnaryCall<_v2_GetPendingPayoutAnalyticsRequest__Output, _v2_GetPendingPayoutAnalyticsResponse>;
  
  GetPendingPayoutPagination: grpc.handleUnaryCall<_v2_GetPendingPayoutPaginationRequest__Output, _v2_GetPendingPayoutPaginationResponse>;
  
  GetPermissions: grpc.handleUnaryCall<_v2_GetPermissionsRequest__Output, _v2_GetPermissionsResponse>;
  
  GetProductDetailsForPromoCodeValidation: grpc.handleUnaryCall<_v2_GetProductDetailsForPromoCodeValidationRequest__Output, _v2_GetProductDetailsForPromoCodeValidationResponse>;
  
  GetProductForCommission: grpc.handleUnaryCall<_v2_GetProductForCommissionRequest__Output, _v2_GetProductForCommissionResponse>;
  
  GetProductStatuses: grpc.handleUnaryCall<_v2_GetProductStatusesRequest__Output, _v2_GetProductStatusesResponse>;
  
  GetProducts: grpc.handleUnaryCall<_v2_GetProductsRequest__Output, _v2_GetProductsResponse>;
  
  GetProductsForProductService: grpc.handleUnaryCall<_v2_GetProductsRequest__Output, _v2_GetProductsForProductServiceResponse>;
  
  GetPromoCode: grpc.handleUnaryCall<_v2_GetPromoCodeRequest__Output, _v2_GetPromoCodeResponse>;
  
  GetRecentlySoldProducts: grpc.handleUnaryCall<_v2_GetRecentlySoldProductsRequest__Output, _v2_GetViewedProductsResponse>;
  
  GetSellerBadge: grpc.handleUnaryCall<_v2_GetSellerBadgeRequest__Output, _v2_GetSellerBadgeResponse>;
  
  GetTopSellingProductModels: grpc.handleUnaryCall<_v2_GetTopSellingProductModelsRequest__Output, _v2_GetTopSellingProductModelsResponse>;
  
  GetUser: grpc.handleUnaryCall<_v2_GetUserRequest__Output, _v2_GetUserResponse>;
  
  GetUserLastOrderData: grpc.handleUnaryCall<_v2_GetUserDataRequest__Output, _v2_GetUserLastOrderDataResponse>;
  
  GetUserProfile: grpc.handleUnaryCall<_v2_GetUserDataRequest__Output, _v2_GetOrderDetailByIdResponse>;
  
  GetUsers: grpc.handleUnaryCall<_v2_GetUsersRequest__Output, _v2_GetUsersResponse>;
  
  GetUsersByPhone: grpc.handleUnaryCall<_v2_GetUsersByPhoneRequest__Output, _v2_GetUsersByPhoneResponse>;
  
  GetVariants: grpc.handleUnaryCall<_v2_GetVariantsRequest__Output, _v2_GetVariantsResponse>;
  
  GetViewedProducts: grpc.handleUnaryCall<_v2_GetViewedProductsRequest__Output, _v2_GetViewedProductsResponse>;
  
  ProcessReserveFinancingPayment: grpc.handleUnaryCall<_v2_ProcessReserveFinancingPaymentRequest__Output, _v2_ProcessReserveFinancingPaymentResponse>;
  
  SetUserOTP: grpc.handleUnaryCall<_v2_SetUserOTPRequest__Output, _v2_SetUserOTPResponse>;
  
  SubmitRating: grpc.handleUnaryCall<_v2_SubmitRatingRequest__Output, _v2_SubmitRatingResponse>;
  
  UpdateDmOrder: grpc.handleUnaryCall<_v2_Request__Output, _v2_GetOrderDetailByIdResponse>;
  
  UpdateHighestBid: grpc.handleUnaryCall<_v2_UpdateHighestBidRequest__Output, _v2_UpdateHighestBidResponse>;
  
  UpdateInactiveUser: grpc.handleUnaryCall<_v2_UpdateInactiveUserRequest__Output, _v2_UpdateInactiveUserResponse>;
  
  UpdateLogisticService: grpc.handleUnaryCall<_v2_UpdateLogisticServiceRequest__Output, _v2_UpdateLogisticServiceResponse>;
  
  UpdateOrderAttribute: grpc.handleUnaryCall<_v2_UpdateOrderAttributeRequest__Output, _v2_UpdateOrderAttributeResponse>;
  
  UpdatePaymentStatusOfOrder: grpc.handleUnaryCall<_v2_UpdatePaymentStatusOfOrderRequest__Output, _v2_UpdatePaymentStatusOfOrderResponse>;
  
  UpdatePenaltyFlag: grpc.handleUnaryCall<_v2_UpdatePenaltyFlagRequest__Output, _v2_UpdatePenaltyFlagResponse>;
  
  UpdateProduct: grpc.handleUnaryCall<_v2_UpdateProductRequest__Output, _v2_UpdateProductResponse>;
  
  UpdateSecurityFee: grpc.handleUnaryCall<_v2_UpdateSecurityFeeRequest__Output, _v2_UpdateSecurityFeeResponse>;
  
  ValidIdsForPromoCode: grpc.handleUnaryCall<_v2_ValidIDsForPromoCodeRequest__Output, _v2_ValidIDsForPromoCodeResponse>;
  
  ValidateSellerDetectionNudge: grpc.handleUnaryCall<_v2_ValidateSellerDetectionNudgeRequest__Output, _v2_ValidateSellerDetectionNudgeResponse>;
  
  ValidateUserUsageOfPromoCode: grpc.handleUnaryCall<_v2_ValidateUserUsageOfPromoCodeRequest__Output, _v2_ValidateUserUsageOfPromoCodeResponse>;
  
}

export interface V2ServiceDefinition extends grpc.ServiceDefinition {
  CancelOrder: MethodDefinition<_v2_CancelOrderRequest, _v2_CancelOrderResponse, _v2_CancelOrderRequest__Output, _v2_CancelOrderResponse__Output>
  CheckUserOTP: MethodDefinition<_v2_CheckUserOTPRequest, _v2_CheckUserOTPResponse, _v2_CheckUserOTPRequest__Output, _v2_CheckUserOTPResponse__Output>
  CreateDmOrder: MethodDefinition<_v2_Request, _v2_GetOrderDetailByIdResponse, _v2_Request__Output, _v2_GetOrderDetailByIdResponse__Output>
  CreateNewUser: MethodDefinition<_v2_CreateNewUserRequest, _v2_CreateNewUserResponse, _v2_CreateNewUserRequest__Output, _v2_CreateNewUserResponse__Output>
  CreateOrder: MethodDefinition<_v2_CreateOrderRequest, _v2_CreateOrderResponse, _v2_CreateOrderRequest__Output, _v2_CreateOrderResponse__Output>
  CreateSmsaTracking: MethodDefinition<_v2_CreateSMSATracking, _v2_CreateSMSATracking, _v2_CreateSMSATracking__Output, _v2_CreateSMSATracking__Output>
  FetchInvoiceGenerationData: MethodDefinition<_v2_FetchInvoiceGenerationDataRequest, _v2_FetchInvoiceGenerationDataResponse, _v2_FetchInvoiceGenerationDataRequest__Output, _v2_FetchInvoiceGenerationDataResponse__Output>
  GenerateSmsaTracking: MethodDefinition<_v2_Request, _v2_GenerateSmsaTrackingResponse, _v2_Request__Output, _v2_GenerateSmsaTrackingResponse__Output>
  GetBanners: MethodDefinition<_v2_GetBannersRequest, _v2_GetBannersResponse, _v2_GetBannersRequest__Output, _v2_GetBannersResponse__Output>
  GetBidSummary: MethodDefinition<_v2_GetBidSummaryRequest, _v2_GetBidSummaryResponse, _v2_GetBidSummaryRequest__Output, _v2_GetBidSummaryResponse__Output>
  GetCategoryModelsCount: MethodDefinition<_v2_GetVariantsRequest, _v2_GetCategoryModelsCountResponse, _v2_GetVariantsRequest__Output, _v2_GetCategoryModelsCountResponse__Output>
  GetCompletionRateUser: MethodDefinition<_v2_GetCompletionRateUserRequest, _v2_GetCompletionRateUserResponse, _v2_GetCompletionRateUserRequest__Output, _v2_GetCompletionRateUserResponse__Output>
  GetCountdownValInHours: MethodDefinition<_v2_GetCountdownValInHoursRequest, _v2_GetCountdownValInHoursResponse, _v2_GetCountdownValInHoursRequest__Output, _v2_GetCountdownValInHoursResponse__Output>
  GetDmUser: MethodDefinition<_v2_GetDmUserRequest, _v2_GetDmUserResponse, _v2_GetDmUserRequest__Output, _v2_GetDmUserResponse__Output>
  GetDmUsers: MethodDefinition<_v2_GetDmUsersRequest, _v2_GetDmUsersResponse, _v2_GetDmUsersRequest__Output, _v2_GetDmUsersResponse__Output>
  GetFeeds: MethodDefinition<_v2_GetFeedRequest, _v2_GetFeedsResponse, _v2_GetFeedRequest__Output, _v2_GetFeedsResponse__Output>
  GetInvoiceGenerationFlag: MethodDefinition<_v2_GetInvoiceGenerationFlagRequest, _v2_GetInvoiceGenerationFlagResponse, _v2_GetInvoiceGenerationFlagRequest__Output, _v2_GetInvoiceGenerationFlagResponse__Output>
  GetLegacyUserViaLocalPhone: MethodDefinition<_v2_GetLegacyUserViaLocalPhoneRequest, _v2_GetLegacyUserViaLocalPhoneResponse, _v2_GetLegacyUserViaLocalPhoneRequest__Output, _v2_GetLegacyUserViaLocalPhoneResponse__Output>
  GetListingFees: MethodDefinition<_v2_GetListingFeesRequest, _v2_GetListingFeesResponse, _v2_GetListingFeesRequest__Output, _v2_GetListingFeesResponse__Output>
  GetMarketPriceByVariantId: MethodDefinition<_v2_GetMarketPriceByVariantIdRequest, _v2_GetMarketPriceByVariantIdResponse, _v2_GetMarketPriceByVariantIdRequest__Output, _v2_GetMarketPriceByVariantIdResponse__Output>
  GetOrderDetail: MethodDefinition<_v2_GetOrderDetailRequest, _v2_GetOrderDetailResponse, _v2_GetOrderDetailRequest__Output, _v2_GetOrderDetailResponse__Output>
  GetOrderDetailById: MethodDefinition<_v2_GetOrderDetailRequest, _v2_GetOrderDetailByIdResponse, _v2_GetOrderDetailRequest__Output, _v2_GetOrderDetailByIdResponse__Output>
  GetOrderDetailByUserType: MethodDefinition<_v2_GetOrderDetailByUserTypeRequest, _v2_GetOrderDetailByIdResponse, _v2_GetOrderDetailByUserTypeRequest__Output, _v2_GetOrderDetailByIdResponse__Output>
  GetOrderSaleAnalytics: MethodDefinition<_v2_GetOrderSaleAnalyticsRequest, _v2_GetOrderSaleAnalyticsResponse, _v2_GetOrderSaleAnalyticsRequest__Output, _v2_GetOrderSaleAnalyticsResponse__Output>
  GetPenalizedOrders: MethodDefinition<_v2_GetPenalizedOrdersRequest, _v2_GetPenalizedOrdersResponse, _v2_GetPenalizedOrdersRequest__Output, _v2_GetPenalizedOrdersResponse__Output>
  GetPendingPayoutAnalytics: MethodDefinition<_v2_GetPendingPayoutAnalyticsRequest, _v2_GetPendingPayoutAnalyticsResponse, _v2_GetPendingPayoutAnalyticsRequest__Output, _v2_GetPendingPayoutAnalyticsResponse__Output>
  GetPendingPayoutPagination: MethodDefinition<_v2_GetPendingPayoutPaginationRequest, _v2_GetPendingPayoutPaginationResponse, _v2_GetPendingPayoutPaginationRequest__Output, _v2_GetPendingPayoutPaginationResponse__Output>
  GetPermissions: MethodDefinition<_v2_GetPermissionsRequest, _v2_GetPermissionsResponse, _v2_GetPermissionsRequest__Output, _v2_GetPermissionsResponse__Output>
  GetProductDetailsForPromoCodeValidation: MethodDefinition<_v2_GetProductDetailsForPromoCodeValidationRequest, _v2_GetProductDetailsForPromoCodeValidationResponse, _v2_GetProductDetailsForPromoCodeValidationRequest__Output, _v2_GetProductDetailsForPromoCodeValidationResponse__Output>
  GetProductForCommission: MethodDefinition<_v2_GetProductForCommissionRequest, _v2_GetProductForCommissionResponse, _v2_GetProductForCommissionRequest__Output, _v2_GetProductForCommissionResponse__Output>
  GetProductStatuses: MethodDefinition<_v2_GetProductStatusesRequest, _v2_GetProductStatusesResponse, _v2_GetProductStatusesRequest__Output, _v2_GetProductStatusesResponse__Output>
  GetProducts: MethodDefinition<_v2_GetProductsRequest, _v2_GetProductsResponse, _v2_GetProductsRequest__Output, _v2_GetProductsResponse__Output>
  GetProductsForProductService: MethodDefinition<_v2_GetProductsRequest, _v2_GetProductsForProductServiceResponse, _v2_GetProductsRequest__Output, _v2_GetProductsForProductServiceResponse__Output>
  GetPromoCode: MethodDefinition<_v2_GetPromoCodeRequest, _v2_GetPromoCodeResponse, _v2_GetPromoCodeRequest__Output, _v2_GetPromoCodeResponse__Output>
  GetRecentlySoldProducts: MethodDefinition<_v2_GetRecentlySoldProductsRequest, _v2_GetViewedProductsResponse, _v2_GetRecentlySoldProductsRequest__Output, _v2_GetViewedProductsResponse__Output>
  GetSellerBadge: MethodDefinition<_v2_GetSellerBadgeRequest, _v2_GetSellerBadgeResponse, _v2_GetSellerBadgeRequest__Output, _v2_GetSellerBadgeResponse__Output>
  GetTopSellingProductModels: MethodDefinition<_v2_GetTopSellingProductModelsRequest, _v2_GetTopSellingProductModelsResponse, _v2_GetTopSellingProductModelsRequest__Output, _v2_GetTopSellingProductModelsResponse__Output>
  GetUser: MethodDefinition<_v2_GetUserRequest, _v2_GetUserResponse, _v2_GetUserRequest__Output, _v2_GetUserResponse__Output>
  GetUserLastOrderData: MethodDefinition<_v2_GetUserDataRequest, _v2_GetUserLastOrderDataResponse, _v2_GetUserDataRequest__Output, _v2_GetUserLastOrderDataResponse__Output>
  GetUserProfile: MethodDefinition<_v2_GetUserDataRequest, _v2_GetOrderDetailByIdResponse, _v2_GetUserDataRequest__Output, _v2_GetOrderDetailByIdResponse__Output>
  GetUsers: MethodDefinition<_v2_GetUsersRequest, _v2_GetUsersResponse, _v2_GetUsersRequest__Output, _v2_GetUsersResponse__Output>
  GetUsersByPhone: MethodDefinition<_v2_GetUsersByPhoneRequest, _v2_GetUsersByPhoneResponse, _v2_GetUsersByPhoneRequest__Output, _v2_GetUsersByPhoneResponse__Output>
  GetVariants: MethodDefinition<_v2_GetVariantsRequest, _v2_GetVariantsResponse, _v2_GetVariantsRequest__Output, _v2_GetVariantsResponse__Output>
  GetViewedProducts: MethodDefinition<_v2_GetViewedProductsRequest, _v2_GetViewedProductsResponse, _v2_GetViewedProductsRequest__Output, _v2_GetViewedProductsResponse__Output>
  ProcessReserveFinancingPayment: MethodDefinition<_v2_ProcessReserveFinancingPaymentRequest, _v2_ProcessReserveFinancingPaymentResponse, _v2_ProcessReserveFinancingPaymentRequest__Output, _v2_ProcessReserveFinancingPaymentResponse__Output>
  SetUserOTP: MethodDefinition<_v2_SetUserOTPRequest, _v2_SetUserOTPResponse, _v2_SetUserOTPRequest__Output, _v2_SetUserOTPResponse__Output>
  SubmitRating: MethodDefinition<_v2_SubmitRatingRequest, _v2_SubmitRatingResponse, _v2_SubmitRatingRequest__Output, _v2_SubmitRatingResponse__Output>
  UpdateDmOrder: MethodDefinition<_v2_Request, _v2_GetOrderDetailByIdResponse, _v2_Request__Output, _v2_GetOrderDetailByIdResponse__Output>
  UpdateHighestBid: MethodDefinition<_v2_UpdateHighestBidRequest, _v2_UpdateHighestBidResponse, _v2_UpdateHighestBidRequest__Output, _v2_UpdateHighestBidResponse__Output>
  UpdateInactiveUser: MethodDefinition<_v2_UpdateInactiveUserRequest, _v2_UpdateInactiveUserResponse, _v2_UpdateInactiveUserRequest__Output, _v2_UpdateInactiveUserResponse__Output>
  UpdateLogisticService: MethodDefinition<_v2_UpdateLogisticServiceRequest, _v2_UpdateLogisticServiceResponse, _v2_UpdateLogisticServiceRequest__Output, _v2_UpdateLogisticServiceResponse__Output>
  UpdateOrderAttribute: MethodDefinition<_v2_UpdateOrderAttributeRequest, _v2_UpdateOrderAttributeResponse, _v2_UpdateOrderAttributeRequest__Output, _v2_UpdateOrderAttributeResponse__Output>
  UpdatePaymentStatusOfOrder: MethodDefinition<_v2_UpdatePaymentStatusOfOrderRequest, _v2_UpdatePaymentStatusOfOrderResponse, _v2_UpdatePaymentStatusOfOrderRequest__Output, _v2_UpdatePaymentStatusOfOrderResponse__Output>
  UpdatePenaltyFlag: MethodDefinition<_v2_UpdatePenaltyFlagRequest, _v2_UpdatePenaltyFlagResponse, _v2_UpdatePenaltyFlagRequest__Output, _v2_UpdatePenaltyFlagResponse__Output>
  UpdateProduct: MethodDefinition<_v2_UpdateProductRequest, _v2_UpdateProductResponse, _v2_UpdateProductRequest__Output, _v2_UpdateProductResponse__Output>
  UpdateSecurityFee: MethodDefinition<_v2_UpdateSecurityFeeRequest, _v2_UpdateSecurityFeeResponse, _v2_UpdateSecurityFeeRequest__Output, _v2_UpdateSecurityFeeResponse__Output>
  ValidIdsForPromoCode: MethodDefinition<_v2_ValidIDsForPromoCodeRequest, _v2_ValidIDsForPromoCodeResponse, _v2_ValidIDsForPromoCodeRequest__Output, _v2_ValidIDsForPromoCodeResponse__Output>
  ValidateSellerDetectionNudge: MethodDefinition<_v2_ValidateSellerDetectionNudgeRequest, _v2_ValidateSellerDetectionNudgeResponse, _v2_ValidateSellerDetectionNudgeRequest__Output, _v2_ValidateSellerDetectionNudgeResponse__Output>
  ValidateUserUsageOfPromoCode: MethodDefinition<_v2_ValidateUserUsageOfPromoCodeRequest, _v2_ValidateUserUsageOfPromoCodeResponse, _v2_ValidateUserUsageOfPromoCodeRequest__Output, _v2_ValidateUserUsageOfPromoCodeResponse__Output>
}
