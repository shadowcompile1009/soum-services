import type * as grpc from '@grpc/grpc-js';
import type { MessageTypeDefinition } from '@grpc/proto-loader';

import type {
  CommissionServiceClient as _commission_CommissionServiceClient,
  CommissionServiceDefinition as _commission_CommissionServiceDefinition,
} from './commission/CommissionService';

type SubtypeConstructor<
  Constructor extends new (...args: any) => any,
  Subtype
> = {
  new (...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  commission: {
    AddOn: MessageTypeDefinition;
    AddonSummaryCalculateData: MessageTypeDefinition;
    AvailablePayment: MessageTypeDefinition;
    BreakDownResponse: MessageTypeDefinition;
    CalculateAddonSummaryRequest: MessageTypeDefinition;
    CalculateAddonSummaryResponse: MessageTypeDefinition;
    CalculateCommissionSummaryRequest: MessageTypeDefinition;
    CalculateCommissionSummaryRequestForList: MessageTypeDefinition;
    CalculateCommissionSummaryResponse: MessageTypeDefinition;
    CalculateCommissionSummaryResponseForList: MessageTypeDefinition;
    CalculationSettings: MessageTypeDefinition;
    CommissionAnalysis: MessageTypeDefinition;
    CommissionFilters: MessageTypeDefinition;
    CommissionService: SubtypeConstructor<
      typeof grpc.Client,
      _commission_CommissionServiceClient
    > & { service: _commission_CommissionServiceDefinition };
    CommissionSummaryResponse: MessageTypeDefinition;
    CreateCommissionSummaryRequest: MessageTypeDefinition;
    DetailedPromoCode: MessageTypeDefinition;
    FinancingRequest: MessageTypeDefinition;
    ForceUpdateCommissionRequest: MessageTypeDefinition;
    GetDefaultPromoCodeRequest: MessageTypeDefinition;
    GetFeedPromoRequest: MessageTypeDefinition;
    GetFeedPromosRequest: MessageTypeDefinition;
    GetFeedPromosResponse: MessageTypeDefinition;
    GetPromoDetailsRequest: MessageTypeDefinition;
    GetPromosByIdsRequest: MessageTypeDefinition;
    GetPromosByIdsResponse: MessageTypeDefinition;
    MigrateCommissionSummaryRequest: MessageTypeDefinition;
    MigrationCalculationSettings: MessageTypeDefinition;
    Order: MessageTypeDefinition;
    PaymentOption: MessageTypeDefinition;
    Product: MessageTypeDefinition;
    ProductCommissionSummaryRequest: MessageTypeDefinition;
    ProductCommissionSummaryResponse: MessageTypeDefinition;
    PromoCode: MessageTypeDefinition;
    PromoCodeScope: MessageTypeDefinition;
    Reservation: MessageTypeDefinition;
    UpdateSellPriceRequest: MessageTypeDefinition;
    UpdateSellerCommissionRequest: MessageTypeDefinition;
    UpdateUsageCountRequest: MessageTypeDefinition;
    UpdateUsageCountResponse: MessageTypeDefinition;
  };
}
