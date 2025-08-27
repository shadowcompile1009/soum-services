import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { ProductStatus } from '../enums/ProductStatus.Enum';
import { getProductCondition } from '../grpc/category';
import { GetProductCatConRequest } from '../grpc/proto/category.pb';
import { ILegacyProductModel } from '../models/LegacyProducts';
import { ListingGroupInput } from '../models/ListingGroup';
import { DeviceModelDocument } from '../models/Model';
import { VariantDocument } from '../models/Variant';
import {
  ListingGroupRepository,
  ProductRepository,
  UserRepository,
} from '../repositories';
import { SettingRepository } from '../repositories/settingRepository';
import logger from '../util/logger';
import { ModelService } from './modelService';
import { ProductService } from './productService';
import { SearchService } from './searchService';
import { VariantService } from './variantService';
import { getPreSignURLProductImgs } from '../grpc/productMicroService';
import { getSecretData } from '../libs/vault';
import { SellerUserType } from '../grpc/proto/commission/sellerType.enum';
@Service()
export class ListingGroupService {
  constructor(
    public variantService: VariantService,
    public modelService: ModelService,
    public listingGroupRepository: ListingGroupRepository,
    public productRepository: ProductRepository,
    public error: ErrorResponseDto,
    public searchService: SearchService,
    public userRepository: UserRepository,
    public settingRepository: SettingRepository,
    public productService: ProductService
  ) {}

  async createListingGroup(
    listingGroupInput: ListingGroupInput,
    user_id?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const model: DeviceModelDocument = await this.modelService.getModelViaId(
        listingGroupInput?.model_id
      );
      const [errVariant, variant] =
        await this.variantService.getShortVariantByID(
          listingGroupInput?.variant_id
        );

      if (errVariant) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT,
            message: Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT,
          },
        ];
      }

      if (!errVariant && variant) {
        const variantData = (variant as any).result as VariantDocument;

        const isNullPriceRange = false; // check if category condition has price range
        // check with meshal
        if (
          listingGroupInput.sell_price > variantData.current_price &&
          variantData.current_price > 0 &&
          !isNullPriceRange
        ) {
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.MESSAGE.INVALID_SELL_PRICE,
              message: Constants.MESSAGE.INVALID_SELL_PRICE,
            },
          ];
        }

        if (
          variantData?.category_id?.toString() ===
            listingGroupInput?.category_id?.toString() &&
          variantData?.brand_id?.toString() ===
            listingGroupInput?.brand_id?.toString() &&
          variantData?.model_id?.toString() === listingGroupInput?.model_id
        ) {
          const productImgs = listingGroupInput?.isUsingLegacyUpload
            ? listingGroupInput?.product_images?.length > 1
              ? listingGroupInput?.product_images
              : [model.model_icon]
            : (
                await getPreSignURLProductImgs({
                  categoryId: listingGroupInput.category_id,
                  productImages: listingGroupInput.productImageSections,
                })
              )?.imgURLs;

          const vaultSettings = await getSecretData('/secret/data/apiv2');
          const defaultConditions = JSON.parse(
            vaultSettings?.defaultConditions || '[]'
          );

          const defaultConditionId = defaultConditions.find(
            (elem: any) =>
              elem.categoryId == listingGroupInput?.category_id?.toString()
          )?.conditionId;
          const listingGroupData: ListingGroupInput = {
            user_id: user_id,
            category_id: listingGroupInput.category_id || '',
            variant_id: listingGroupInput?.variant_id || '',
            brand_id: listingGroupInput.brand_id || '',
            model_id: listingGroupInput.model_id || '',
            variant: variantData?.varient,
            variant_ar: variantData?.varient_ar,
            sell_price: listingGroupInput.sell_price,
            quantity: listingGroupInput.quantity,
            score: 100,
            status: ProductStatus.Active,
            created_date: new Date(),
            updated_date: new Date(),
            product_images: productImgs,
            isModelImage: listingGroupInput.isModelImage || false,
            condition_id:
              listingGroupInput?.condition_id || defaultConditionId || '',
            description: listingGroupInput.description || '',
          };

          const [errNewListingGroup, newGroupResult] =
            await this.listingGroupRepository.createListingGroup(
              listingGroupData
            );

          const getSellerUserTypetResult =
            await this.productService.getSellerUserType(user_id);
          // not Compliant and seller
          const userType = !getSellerUserTypetResult?.isCompliant
            ? SellerUserType.NOT_COMPLIANT
            : getSellerUserTypetResult.userType;
          const condition = await getProductCondition({
            id: listingGroupInput.condition_id,
            variantId: listingGroupInput.variant_id,
            sellPrice: listingGroupInput.sell_price,
          } as GetProductCatConRequest);
          const priceRange = condition?.priceQuality?.name || '';

          if (!errNewListingGroup && newGroupResult?.result?._id) {
            const [genError, genResult] =
              await this.listingGroupRepository.generateProduct(
                newGroupResult?.result?._id,
                this.productRepository,
                this.modelService.settingRepository,
                userType,
                priceRange?.toString(),
                null,
                null,
                listingGroupInput?.isUsingLegacyUpload
                  ? null
                  : listingGroupInput.category_id,
                listingGroupInput?.isUsingLegacyUpload
                  ? null
                  : listingGroupInput.productImageSections,
                listingGroupInput?.inventoryId
              );

            if (genError) {
              return [true, genResult];
            }

            if (genResult?.result?._id) {
              await this.listingGroupRepository.updateListingGroup(
                newGroupResult.result._id,
                {
                  active_listing: genResult?.result?._id,
                }
              );
            }
            newGroupResult.result.active_listing = genResult?.result?._id;
            await this.searchService.addProducts([genResult?.result?._id]);
          }
          await this.userRepository.updateRatesScan(user_id, false);

          return [
            false,
            {
              code: Constants.SUCCESS_CODE.SUCCESS,
              result: newGroupResult.result,
              message: Constants.MESSAGE.CREATE_BULK_LISTING_SUCCESSFULLY,
            },
          ];
        } else {
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.MESSAGE.CAT_BRAND_MODEL_NOT_MATCH,
              message: Constants.MESSAGE.CAT_BRAND_MODEL_NOT_MATCH,
            },
          ];
        }
      }

      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.MESSAGE.FAILED_TO_CREATE_BULK_LISTING,
          message: Constants.MESSAGE.FAILED_TO_CREATE_BULK_LISTING,
        },
      ];
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT
        );
      }
    }
  }

  async getAllListingGroups(
    page: number,
    size: number,
    user_id?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const [err, data] = await this.listingGroupRepository.getAllListingGroups(
        page,
        size,
        user_id
      );

      if (err) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: data.result,
            message: data.message,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data.result,
          message: Constants.MESSAGE.GET_LISTING_GROUP_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ALL_LISTING_GROUPS
        );
      }
    }
  }

  async getListingGroupByID(
    id: string,
    user_id?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const [err, data] = await this.listingGroupRepository.getListingGroupByID(
        id,
        user_id
      );

      if (err) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: data.result,
            message: data.message,
          },
        ];
      }

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data.result,
          message: Constants.MESSAGE.GET_LISTING_GROUP_BY_ID_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_LISTING_GROUP_BY_ID
        );
      }
    }
  }

  async updateListingGroup(
    id: string,
    listingGroupInput: ListingGroupInput,
    user_id?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const [errGroup, group] = await this.getListingGroupByID(id, user_id);

      if (errGroup) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: group.result,
            message: group.message,
          },
        ];
      }
      const [errVariant, variant] =
        await this.variantService.getShortVariantByID(group.result?.variant_id);

      if (errVariant) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT,
            message: Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT,
          },
        ];
      }

      if (!errVariant && variant) {
        const variantData = (variant as any).result as VariantDocument;

        if (
          listingGroupInput.sell_price &&
          listingGroupInput.sell_price > variantData.current_price &&
          variantData.current_price > 0
        ) {
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.MESSAGE.INVALID_SELL_PRICE,
              message: Constants.MESSAGE.INVALID_SELL_PRICE,
            },
          ];
        }
      }
      const [err, data] = await this.listingGroupRepository.updateListingGroup(
        id,
        listingGroupInput
      );

      if (err) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: data.result,
            message: data.message,
          },
        ];
      }

      if (data?.result?.isPriceUpdate) {
        await this.productService.updatePrice(
          data?.result?.active_listing,
          user_id,
          listingGroupInput?.sell_price
        );
      }

      await this.searchService.addProducts([data?.result?.active_listing]);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data.result,
          message: Constants.MESSAGE.FAILED_TO_UPDATE_LISTING_GROUP,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_LISTING_GROUP
        );
      }
    }
  }

  async deleteListingGroup(
    id: string,
    user_id?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const [errGroup, group] = await this.getListingGroupByID(id, user_id);

      if (errGroup) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: group.result,
            message: group.message,
          },
        ];
      }

      const [err, data] = await this.listingGroupRepository.deleteListingGroup(
        id
      );

      if (err) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: data.result,
            message: data.message,
          },
        ];
      }
      await this.searchService.addProducts([data?.result?.active_listing]);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data.result,
          message: Constants.MESSAGE.DELETE_LISTING_GROUP_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_LISTING_GROUP
        );
      }
    }
  }

  async generateListingAfterSold(product: ILegacyProductModel) {
    try {
      if (product.listingGroupId) {
        const listingGroup = await this.listingGroupRepository.getById(
          product.listingGroupId.toString()
        );

        if (listingGroup) {
          listingGroup.quantity = product?.listingQuantity - 1;
        }

        const getSellerUserTypetResult =
          await this.productService.getSellerUserType(listingGroup.user_id);
        const userType = !getSellerUserTypetResult?.isCompliant
          ? SellerUserType.NOT_COMPLIANT
          : getSellerUserTypetResult.userType;
        // TODO: Apply NOT_COMPLIANT logic if isBuyer/product context is available
        const condition = await getProductCondition({
          id: product.condition_id,
          variantId: product.varient_id,
          sellPrice: product.sell_price,
        } as GetProductCatConRequest);
        const priceRange = condition?.priceQuality?.name || 'Fair';

        if (listingGroup.quantity > 0) {
          const [genError, genResult] =
            await this.listingGroupRepository.generateProduct(
              product.listingGroupId.toString(),
              this.productRepository,
              this.settingRepository,
              userType,
              priceRange.toString(),
              listingGroup.quantity,
              product._id
            );

          if (genError) {
            logger.error('Failed to generate product of bulk-listing');
          } else if (genResult?.result?._id) {
            if (listingGroup) {
              listingGroup.active_listing = genResult?.result?._id;
            }
            await this.searchService.addProducts([genResult?.result?._id]);
          }
        }
        listingGroup && (await listingGroup.save());
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_CREATE_PRODUCT
        );
      }
    }
  }
}
