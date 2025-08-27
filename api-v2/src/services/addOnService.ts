import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { AddOn, AddOnSummary } from '../models/Brand';
import { AddOnRepository } from '../repositories/addOnRepository';
import { SettingService } from './settingService';
import { ProductRepository } from '../repositories/productRepository';
import { Cities } from '../enums/Cities.Enum';
import { getAddOns } from '../grpc/addon';
import { GetAddonsRequest } from '../grpc/proto/addon/GetAddonsRequest';
import { AddonItem } from '../grpc/proto/addon/AddonItem';

@Service()
export class AddOnService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  addOnRepository: AddOnRepository;
  @Inject()
  productRepository: ProductRepository;
  constructor(public settingService?: SettingService) {}
  async getAddOns(brandId: string): Promise<AddOn[]> {
    try {
      const [errAddOns, addons] = await this.addOnRepository.getAddOns(brandId);
      if (errAddOns) {
        this.error.errorCode = addons.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = addons.result.toString();
        this.error.message = addons.message;
        throw this.error;
      }

      if (addons.result.length === 0) {
        return [];
      }
      return addons.result[0];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ADD_ONS,
          exception.message
        );
      }
    }
  }
  async addOnSummary(
    productId: string,
    selectedAddOnIds: string[]
  ): Promise<AddOnSummary> {
    try {
      const [err, productResult] =
        await this.productRepository.getPreviewProductById(productId, null);
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT,
          Constants.MESSAGE.FAILED_TO_GET_PRODUCT
        );
      }
      if (
        productResult?.result?.seller_address?.city === Cities.RIYADH ||
        productResult?.result?.seller_address?.city === Cities.RIYADH_AR
      ) {
        const product = productResult?.result;
        const addons = await getAddOns({
          addonIds: selectedAddOnIds,
          price: product.sell_price,
        } as GetAddonsRequest);

        return await this.AddOnSummary(addons.addons);
      }
      return null;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ADD_ONS,
          exception.message
        );
      }
    }
  }
  AddOnSummary = async (selectedAddOns: AddonItem[]) => {
    const [errSettings, sysSettings] =
      await this.settingService.getSettingsObjectByKeys(['vat_percentage']);
    if (errSettings) throw new Error('settings was not found');

    const vatPercentage = sysSettings.vat_percentage;
    const addOnsTotal =
      selectedAddOns?.reduce(
        (total: number, addon: AddonItem) => total + Number(addon?.price),
        0
      ) || 0;

    const addOnsVat = (vatPercentage / 100) * addOnsTotal;
    const addOnsGrandTotal = addOnsTotal + addOnsVat;
    return {
      selectedAddOns: selectedAddOns || [],
      addOnsTotal,
      addOnsGrandTotal,
      addOnsVat,
    } as AddOnSummary;
  };
}
