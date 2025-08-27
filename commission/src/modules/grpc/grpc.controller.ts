import { Controller } from '@nestjs/common';
import { ProductCommissionService } from '../product-commission/product-commission.service';
import {
  COMMISSION_SERVICE_NAME,
  CalculateCommissionSummaryRequest,
  CalculateCommissionSummaryResponse,
  CommissionSummaryResponse,
  CreateCommissionSummaryRequest,
  MigrateCommissionSummaryRequest,
  ProductCommissionSummaryRequest,
  ProductCommissionSummaryResponse,
  UpdateSellPriceRequest,
  UpdateSellerCommissionRequest,
  CalculateAddonSummaryResponse,
  CalculateAddonSummaryRequest,
  ForceUpdateCommissionRequest,
  CalculateCommissionSummaryResponseForList,
  CalculateCommissionSummaryRequestForList,
  GetPromoDetailsRequest,
  DetailedPromoCode,
  GetDefaultPromoCodeRequest,
  GetFeedPromosRequest,
  GetFeedPromosResponse,
  GetFeedPromoRequest,
  GetPromosByIdsRequest,
  GetPromosByIdsResponse,
  UpdateUsageCountRequest,
  UpdateUsageCountResponse,
} from './proto/commission.pb';
import { GrpcMethod } from '@nestjs/microservices';
import { PromoCodeService } from '../promo-code/promo-code.service';

@Controller('grpc')
export class GrpcController {
  constructor(
    private readonly productCommissionService: ProductCommissionService,
    private readonly promoCodeService: PromoCodeService,
  ) {}
  @GrpcMethod(COMMISSION_SERVICE_NAME, 'createProductCommissionSummary')
  async createProductCommissionSummary(
    payload: CreateCommissionSummaryRequest,
  ) {
    return this.productCommissionService.calculateAndSaveCommission(
      payload,
      null,
    );
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'calculateProductCommissionSummary')
  async calculateProductCommissionSummary(
    payload: CalculateCommissionSummaryRequest,
  ): Promise<CalculateCommissionSummaryResponse> {
    return this.productCommissionService.calculateCommissions(
      { ...payload, order: null, addOns: null },
      null,
      payload.allPayments,
    );
  }

  @GrpcMethod(
    COMMISSION_SERVICE_NAME,
    'calculateProductCommissionSummaryForList',
  )
  async calculateProductCommissionSummaryForList(
    payload: CalculateCommissionSummaryRequestForList,
  ): Promise<CalculateCommissionSummaryResponseForList> {
    return this.productCommissionService.calculateCommissionsForList(
      payload.calculateCommissionSummaryRequests,
    );
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'getProductCommissionSummary')
  async getProductCommissionSummary(payload: ProductCommissionSummaryRequest) {
    const result = await this.productCommissionService.getCommissions(
      payload,
      1,
      0,
    );
    if (result && result.length)
      return result[0] as ProductCommissionSummaryResponse;
    return {} as ProductCommissionSummaryResponse;
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'updateSellerCommission')
  updateSellerCommission(payload: UpdateSellerCommissionRequest) {
    return this.productCommissionService.updateSellerCommission(payload);
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'forceUpdateCommission')
  forceUpdateCommission(payload: ForceUpdateCommissionRequest) {
    return this.productCommissionService.forceUpdateSellerAndBuyerCommission(
      payload,
    );
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'addSellerCommissionPenalty')
  addSellerCommissionPenalty(payload: UpdateSellerCommissionRequest) {
    return this.productCommissionService.addSellerCommissionPenalty(payload);
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'updateSellPrice')
  updateSellPrice(payload: UpdateSellPriceRequest) {
    return this.productCommissionService.updateSellPrice(payload);
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'calculateAddonSummary')
  async calculateAddonSummary(
    payload: CalculateAddonSummaryRequest,
  ): Promise<CalculateAddonSummaryResponse> {
    return this.productCommissionService.calculateAddonSummary(payload);
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'updateUsageCount')
  async incrementPromoCodeUsageCount(
    payload: UpdateUsageCountRequest,
  ): Promise<UpdateUsageCountResponse> {
    try {
      await this.promoCodeService.updateUsageCount(
        payload.promoCodeId,
        payload.count,
      );
      return { ok: true };
    } catch (exception) {
      return { ok: false };
    }
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'getPromoDetails')
  async getPromoDetails(
    payload: GetPromoDetailsRequest,
  ): Promise<DetailedPromoCode> {
    try {
      const result =
        await this.promoCodeService.getPromoCodeByFieldNameAndValue(
          payload.filterField,
          payload.filterFieldValue,
        );
      return result.toObject();
    } catch (exception) {
      console.log({ exception });
      return null;
    }
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'getDefaultPromoCode')
  async getDefaultPromoCode(
    _payload: GetDefaultPromoCodeRequest,
  ): Promise<DetailedPromoCode> {
    try {
      return (await this.promoCodeService.getDefaultPromoCode()).toObject();
    } catch (exception) {
      return null;
    }
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'getFeedPromos')
  async getFeedPromos(
    payload: GetFeedPromosRequest,
  ): Promise<GetFeedPromosResponse> {
    try {
      return {
        DetailedPromoCode: (
          await this.promoCodeService.getFeedPromos(payload.feedIds)
        ).map((val) => val.toObject()),
      };
    } catch (exception) {
      return null;
    }
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'getFeedPromo')
  async getFeedPromo(payload: GetFeedPromoRequest): Promise<DetailedPromoCode> {
    try {
      return (
        await this.promoCodeService.getFeedPromo(payload.feedId)
      ).toObject();
    } catch (exception) {
      return null;
    }
  }

  @GrpcMethod(COMMISSION_SERVICE_NAME, 'getPromosByIds')
  async getPromosByIds(
    payload: GetPromosByIdsRequest,
  ): Promise<GetPromosByIdsResponse> {
    try {
      return {
        promos: (
          await this.promoCodeService.getPromoCodesByIds(payload.ids)
        ).map((val) => val.toObject()),
      };
    } catch (exception) {
      return {
        promos: [],
      };
    }
  }
}
