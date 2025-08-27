// Original file: node_modules/soum-proto/proto/commission.proto

import type * as grpc from '@grpc/grpc-js';
import type { MethodDefinition } from '@grpc/proto-loader';
import type {
  CalculateAddonSummaryRequest as _commission_CalculateAddonSummaryRequest,
  CalculateAddonSummaryRequest__Output as _commission_CalculateAddonSummaryRequest__Output,
} from '../commission/CalculateAddonSummaryRequest';
import type {
  CalculateAddonSummaryResponse as _commission_CalculateAddonSummaryResponse,
  CalculateAddonSummaryResponse__Output as _commission_CalculateAddonSummaryResponse__Output,
} from '../commission/CalculateAddonSummaryResponse';
import type {
  CalculateCommissionSummaryRequest as _commission_CalculateCommissionSummaryRequest,
  CalculateCommissionSummaryRequest__Output as _commission_CalculateCommissionSummaryRequest__Output,
} from '../commission/CalculateCommissionSummaryRequest';
import type {
  CalculateCommissionSummaryRequestForList as _commission_CalculateCommissionSummaryRequestForList,
  CalculateCommissionSummaryRequestForList__Output as _commission_CalculateCommissionSummaryRequestForList__Output,
} from '../commission/CalculateCommissionSummaryRequestForList';
import type {
  CalculateCommissionSummaryResponse as _commission_CalculateCommissionSummaryResponse,
  CalculateCommissionSummaryResponse__Output as _commission_CalculateCommissionSummaryResponse__Output,
} from '../commission/CalculateCommissionSummaryResponse';
import type {
  CalculateCommissionSummaryResponseForList as _commission_CalculateCommissionSummaryResponseForList,
  CalculateCommissionSummaryResponseForList__Output as _commission_CalculateCommissionSummaryResponseForList__Output,
} from '../commission/CalculateCommissionSummaryResponseForList';
import type {
  CommissionSummaryResponse as _commission_CommissionSummaryResponse,
  CommissionSummaryResponse__Output as _commission_CommissionSummaryResponse__Output,
} from '../commission/CommissionSummaryResponse';
import type {
  CreateCommissionSummaryRequest as _commission_CreateCommissionSummaryRequest,
  CreateCommissionSummaryRequest__Output as _commission_CreateCommissionSummaryRequest__Output,
} from '../commission/CreateCommissionSummaryRequest';
import type {
  DetailedPromoCode as _commission_DetailedPromoCode,
  DetailedPromoCode__Output as _commission_DetailedPromoCode__Output,
} from '../commission/DetailedPromoCode';
import type {
  ForceUpdateCommissionRequest as _commission_ForceUpdateCommissionRequest,
  ForceUpdateCommissionRequest__Output as _commission_ForceUpdateCommissionRequest__Output,
} from '../commission/ForceUpdateCommissionRequest';
import type {
  GetDefaultPromoCodeRequest as _commission_GetDefaultPromoCodeRequest,
  GetDefaultPromoCodeRequest__Output as _commission_GetDefaultPromoCodeRequest__Output,
} from '../commission/GetDefaultPromoCodeRequest';
import type {
  GetFeedPromoRequest as _commission_GetFeedPromoRequest,
  GetFeedPromoRequest__Output as _commission_GetFeedPromoRequest__Output,
} from '../commission/GetFeedPromoRequest';
import type {
  GetFeedPromosRequest as _commission_GetFeedPromosRequest,
  GetFeedPromosRequest__Output as _commission_GetFeedPromosRequest__Output,
} from '../commission/GetFeedPromosRequest';
import type {
  GetFeedPromosResponse as _commission_GetFeedPromosResponse,
  GetFeedPromosResponse__Output as _commission_GetFeedPromosResponse__Output,
} from '../commission/GetFeedPromosResponse';
import type {
  GetPromoDetailsRequest as _commission_GetPromoDetailsRequest,
  GetPromoDetailsRequest__Output as _commission_GetPromoDetailsRequest__Output,
} from '../commission/GetPromoDetailsRequest';
import type {
  GetPromosByIdsRequest as _commission_GetPromosByIdsRequest,
  GetPromosByIdsRequest__Output as _commission_GetPromosByIdsRequest__Output,
} from '../commission/GetPromosByIdsRequest';
import type {
  GetPromosByIdsResponse as _commission_GetPromosByIdsResponse,
  GetPromosByIdsResponse__Output as _commission_GetPromosByIdsResponse__Output,
} from '../commission/GetPromosByIdsResponse';
import type {
  MigrateCommissionSummaryRequest as _commission_MigrateCommissionSummaryRequest,
  MigrateCommissionSummaryRequest__Output as _commission_MigrateCommissionSummaryRequest__Output,
} from '../commission/MigrateCommissionSummaryRequest';
import type {
  ProductCommissionSummaryRequest as _commission_ProductCommissionSummaryRequest,
  ProductCommissionSummaryRequest__Output as _commission_ProductCommissionSummaryRequest__Output,
} from '../commission/ProductCommissionSummaryRequest';
import type {
  ProductCommissionSummaryResponse as _commission_ProductCommissionSummaryResponse,
  ProductCommissionSummaryResponse__Output as _commission_ProductCommissionSummaryResponse__Output,
} from '../commission/ProductCommissionSummaryResponse';
import type {
  UpdateSellPriceRequest as _commission_UpdateSellPriceRequest,
  UpdateSellPriceRequest__Output as _commission_UpdateSellPriceRequest__Output,
} from '../commission/UpdateSellPriceRequest';
import type {
  UpdateSellerCommissionRequest as _commission_UpdateSellerCommissionRequest,
  UpdateSellerCommissionRequest__Output as _commission_UpdateSellerCommissionRequest__Output,
} from '../commission/UpdateSellerCommissionRequest';
import type {
  UpdateUsageCountRequest as _commission_UpdateUsageCountRequest,
  UpdateUsageCountRequest__Output as _commission_UpdateUsageCountRequest__Output,
} from '../commission/UpdateUsageCountRequest';
import type {
  UpdateUsageCountResponse as _commission_UpdateUsageCountResponse,
  UpdateUsageCountResponse__Output as _commission_UpdateUsageCountResponse__Output,
} from '../commission/UpdateUsageCountResponse';

export interface CommissionServiceClient extends grpc.Client {
  GetPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  GetPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;
  getPromosByIds(
    argument: _commission_GetPromosByIdsRequest,
    callback: grpc.requestCallback<_commission_GetPromosByIdsResponse__Output>
  ): grpc.ClientUnaryCall;

  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  addSellerCommissionPenalty(
    argument: _commission_UpdateSellerCommissionRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateAddonSummary(
    argument: _commission_CalculateAddonSummaryRequest,
    callback: grpc.requestCallback<_commission_CalculateAddonSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummary(
    argument: _commission_CalculateCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;
  calculateProductCommissionSummaryForList(
    argument: _commission_CalculateCommissionSummaryRequestForList,
    callback: grpc.requestCallback<_commission_CalculateCommissionSummaryResponseForList__Output>
  ): grpc.ClientUnaryCall;

  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  createProductCommissionSummary(
    argument: _commission_CreateCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  forceUpdateCommission(
    argument: _commission_ForceUpdateCommissionRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getDefaultPromoCode(
    argument: _commission_GetDefaultPromoCodeRequest,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;

  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromo(
    argument: _commission_GetFeedPromoRequest,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;

  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;
  getFeedPromos(
    argument: _commission_GetFeedPromosRequest,
    callback: grpc.requestCallback<_commission_GetFeedPromosResponse__Output>
  ): grpc.ClientUnaryCall;

  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  getProductCommissionSummary(
    argument: _commission_ProductCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;
  getPromoDetails(
    argument: _commission_GetPromoDetailsRequest,
    callback: grpc.requestCallback<_commission_DetailedPromoCode__Output>
  ): grpc.ClientUnaryCall;

  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  migrateProductCommissionSummary(
    argument: _commission_MigrateCommissionSummaryRequest,
    callback: grpc.requestCallback<_commission_CommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellPrice(
    argument: _commission_UpdateSellPriceRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;
  updateSellerCommission(
    argument: _commission_UpdateSellerCommissionRequest,
    callback: grpc.requestCallback<_commission_ProductCommissionSummaryResponse__Output>
  ): grpc.ClientUnaryCall;

  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    metadata: grpc.Metadata,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    metadata: grpc.Metadata,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    options: grpc.CallOptions,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
  updateUsageCount(
    argument: _commission_UpdateUsageCountRequest,
    callback: grpc.requestCallback<_commission_UpdateUsageCountResponse__Output>
  ): grpc.ClientUnaryCall;
}

export interface CommissionServiceHandlers
  extends grpc.UntypedServiceImplementation {
  GetPromosByIds: grpc.handleUnaryCall<
    _commission_GetPromosByIdsRequest__Output,
    _commission_GetPromosByIdsResponse
  >;

  addSellerCommissionPenalty: grpc.handleUnaryCall<
    _commission_UpdateSellerCommissionRequest__Output,
    _commission_ProductCommissionSummaryResponse
  >;

  calculateAddonSummary: grpc.handleUnaryCall<
    _commission_CalculateAddonSummaryRequest__Output,
    _commission_CalculateAddonSummaryResponse
  >;

  calculateProductCommissionSummary: grpc.handleUnaryCall<
    _commission_CalculateCommissionSummaryRequest__Output,
    _commission_CalculateCommissionSummaryResponse
  >;

  calculateProductCommissionSummaryForList: grpc.handleUnaryCall<
    _commission_CalculateCommissionSummaryRequestForList__Output,
    _commission_CalculateCommissionSummaryResponseForList
  >;

  createProductCommissionSummary: grpc.handleUnaryCall<
    _commission_CreateCommissionSummaryRequest__Output,
    _commission_CommissionSummaryResponse
  >;

  forceUpdateCommission: grpc.handleUnaryCall<
    _commission_ForceUpdateCommissionRequest__Output,
    _commission_ProductCommissionSummaryResponse
  >;

  getDefaultPromoCode: grpc.handleUnaryCall<
    _commission_GetDefaultPromoCodeRequest__Output,
    _commission_DetailedPromoCode
  >;

  getFeedPromo: grpc.handleUnaryCall<
    _commission_GetFeedPromoRequest__Output,
    _commission_DetailedPromoCode
  >;

  getFeedPromos: grpc.handleUnaryCall<
    _commission_GetFeedPromosRequest__Output,
    _commission_GetFeedPromosResponse
  >;

  getProductCommissionSummary: grpc.handleUnaryCall<
    _commission_ProductCommissionSummaryRequest__Output,
    _commission_ProductCommissionSummaryResponse
  >;

  getPromoDetails: grpc.handleUnaryCall<
    _commission_GetPromoDetailsRequest__Output,
    _commission_DetailedPromoCode
  >;

  migrateProductCommissionSummary: grpc.handleUnaryCall<
    _commission_MigrateCommissionSummaryRequest__Output,
    _commission_CommissionSummaryResponse
  >;

  updateSellPrice: grpc.handleUnaryCall<
    _commission_UpdateSellPriceRequest__Output,
    _commission_ProductCommissionSummaryResponse
  >;

  updateSellerCommission: grpc.handleUnaryCall<
    _commission_UpdateSellerCommissionRequest__Output,
    _commission_ProductCommissionSummaryResponse
  >;

  updateUsageCount: grpc.handleUnaryCall<
    _commission_UpdateUsageCountRequest__Output,
    _commission_UpdateUsageCountResponse
  >;
}

export interface CommissionServiceDefinition extends grpc.ServiceDefinition {
  GetPromosByIds: MethodDefinition<
    _commission_GetPromosByIdsRequest,
    _commission_GetPromosByIdsResponse,
    _commission_GetPromosByIdsRequest__Output,
    _commission_GetPromosByIdsResponse__Output
  >;
  addSellerCommissionPenalty: MethodDefinition<
    _commission_UpdateSellerCommissionRequest,
    _commission_ProductCommissionSummaryResponse,
    _commission_UpdateSellerCommissionRequest__Output,
    _commission_ProductCommissionSummaryResponse__Output
  >;
  calculateAddonSummary: MethodDefinition<
    _commission_CalculateAddonSummaryRequest,
    _commission_CalculateAddonSummaryResponse,
    _commission_CalculateAddonSummaryRequest__Output,
    _commission_CalculateAddonSummaryResponse__Output
  >;
  calculateProductCommissionSummary: MethodDefinition<
    _commission_CalculateCommissionSummaryRequest,
    _commission_CalculateCommissionSummaryResponse,
    _commission_CalculateCommissionSummaryRequest__Output,
    _commission_CalculateCommissionSummaryResponse__Output
  >;
  calculateProductCommissionSummaryForList: MethodDefinition<
    _commission_CalculateCommissionSummaryRequestForList,
    _commission_CalculateCommissionSummaryResponseForList,
    _commission_CalculateCommissionSummaryRequestForList__Output,
    _commission_CalculateCommissionSummaryResponseForList__Output
  >;
  createProductCommissionSummary: MethodDefinition<
    _commission_CreateCommissionSummaryRequest,
    _commission_CommissionSummaryResponse,
    _commission_CreateCommissionSummaryRequest__Output,
    _commission_CommissionSummaryResponse__Output
  >;
  forceUpdateCommission: MethodDefinition<
    _commission_ForceUpdateCommissionRequest,
    _commission_ProductCommissionSummaryResponse,
    _commission_ForceUpdateCommissionRequest__Output,
    _commission_ProductCommissionSummaryResponse__Output
  >;
  getDefaultPromoCode: MethodDefinition<
    _commission_GetDefaultPromoCodeRequest,
    _commission_DetailedPromoCode,
    _commission_GetDefaultPromoCodeRequest__Output,
    _commission_DetailedPromoCode__Output
  >;
  getFeedPromo: MethodDefinition<
    _commission_GetFeedPromoRequest,
    _commission_DetailedPromoCode,
    _commission_GetFeedPromoRequest__Output,
    _commission_DetailedPromoCode__Output
  >;
  getFeedPromos: MethodDefinition<
    _commission_GetFeedPromosRequest,
    _commission_GetFeedPromosResponse,
    _commission_GetFeedPromosRequest__Output,
    _commission_GetFeedPromosResponse__Output
  >;
  getProductCommissionSummary: MethodDefinition<
    _commission_ProductCommissionSummaryRequest,
    _commission_ProductCommissionSummaryResponse,
    _commission_ProductCommissionSummaryRequest__Output,
    _commission_ProductCommissionSummaryResponse__Output
  >;
  getPromoDetails: MethodDefinition<
    _commission_GetPromoDetailsRequest,
    _commission_DetailedPromoCode,
    _commission_GetPromoDetailsRequest__Output,
    _commission_DetailedPromoCode__Output
  >;
  migrateProductCommissionSummary: MethodDefinition<
    _commission_MigrateCommissionSummaryRequest,
    _commission_CommissionSummaryResponse,
    _commission_MigrateCommissionSummaryRequest__Output,
    _commission_CommissionSummaryResponse__Output
  >;
  updateSellPrice: MethodDefinition<
    _commission_UpdateSellPriceRequest,
    _commission_ProductCommissionSummaryResponse,
    _commission_UpdateSellPriceRequest__Output,
    _commission_ProductCommissionSummaryResponse__Output
  >;
  updateSellerCommission: MethodDefinition<
    _commission_UpdateSellerCommissionRequest,
    _commission_ProductCommissionSummaryResponse,
    _commission_UpdateSellerCommissionRequest__Output,
    _commission_ProductCommissionSummaryResponse__Output
  >;
  updateUsageCount: MethodDefinition<
    _commission_UpdateUsageCountRequest,
    _commission_UpdateUsageCountResponse,
    _commission_UpdateUsageCountRequest__Output,
    _commission_UpdateUsageCountResponse__Output
  >;
}
