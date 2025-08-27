import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { TradeInCapRepository } from '../repositories/trandeInCapRepository';
import { TradeInCapDocument } from '../models/TradeInCap';
import { ModelRepository } from '../repositories';
import { ModelSettingDocument } from '../models/ModelSetting';
import { TradeInRepository } from '../repositories/trandeInRepository';
import { TradeInStatus } from '../enums/TradeInStatus';
import { ILegacyProductModel } from '../models/LegacyProducts';
import { VariantRepository } from '../repositories/variantRepository';
import { ProductService } from './productService';
import { VariantForProduct } from '../models/Variant';

@Service()
export class TradeInService {
  constructor(
    public tradeInCapRepository: TradeInCapRepository,
    public tradeInRepository: TradeInRepository,
    public modelRepository: ModelRepository,
    public error: ErrorResponseDto,
    public variantRepository?: VariantRepository,
    public proudctService?: ProductService
  ) {}
  async updateTradeInCap(
    modelId: string,
    userId: string
  ): Promise<TradeInCapDocument> {
    const [err, models] = await this.modelRepository.getById(modelId);
    if (err) {
      this.error.errorCode = models.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = models.result.toString();
      this.error.message = models.message;
      throw this.error;
    }

    const [, data] = await this.modelRepository.getModelCommissionSetting(
      modelId
    );
    const modelSetting = data.result as ModelSettingDocument;
    if (!modelSetting?.tradeInSettings) {
      throw new Error(
        Constants.ERROR_MAP.MODEL_COMMISSION_SETTING_ARE_TURNED_OFF
      );
    }
    const tradeInCap = await this.tradeInCapRepository.getLatestInCurrentHour(
      modelId
    );
    if (!tradeInCap) {
      return this.tradeInCapRepository.createTradeInCap(modelId, [userId]);
    }
    if (tradeInCap.userIds.length >= 5) {
      throw new Error(Constants.ERROR_MAP.TRADE_IN_CAP_IS_EXHAUSTED);
    }
    if (tradeInCap.userIds.includes(userId)) {
      return tradeInCap;
    }
    const userIds = tradeInCap.userIds;
    userIds.push(userId);
    return this.tradeInCapRepository.updateTradeInCap(modelId, userIds);
  }

  async getList(params: {
    limit: number;
    offset: number;
    productId?: string;
    userId?: string;
  }): Promise<any> {
    return this.tradeInRepository.listTradeIns(params);
  }

  async getMyTradeInsList(params: {
    limit: number;
    offset: number;
    productId?: string;
    userId?: string;
  }): Promise<any> {
    const tradeIns = await this.tradeInRepository.listTradeIns(params);
    tradeIns.items = await Promise.all(
      tradeIns.items.map(async (item: any) => {
        const [, variantRes] =
          await this.variantRepository.getVarientWithAttributes(
            item?.varient_id
          );
        const variant: VariantForProduct =
          variantRes.result as VariantForProduct;
        item.attributes = this.proudctService.mapAttributesDto(
          variant?.attributes
        );
        return item;
      })
    );
    return tradeIns;
  }

  async load(productId: string): Promise<any> {
    return this.tradeInRepository.loadTradeIn(productId);
  }

  async updateTradeInStatus(
    productId: string,
    status: TradeInStatus
  ): Promise<ILegacyProductModel> {
    return this.tradeInRepository.updateTradeInStatus(productId, status);
  }
}
