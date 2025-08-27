import _differenceWith from 'lodash/differenceWith';
import _isEqual from 'lodash/isEqual';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { NewPriceProductDto } from '../dto/condition/priceNudgeVarientDto';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import {
  AttributeDto,
  BaseAttributeDto,
  FilterableAttribute,
  OptionAttributeDto,
} from '../dto/variant/AttributeDto';
import { CreateVarientDto } from '../dto/variant/CreateVarientDto';
import { GetVarientDto } from '../dto/variant/GetVarientDto';
import { UpdateVarientDto } from '../dto/variant/UpdateVarientDto';
import {
  deleteCache,
  deleteWithPattern,
  getCache,
  setCache,
} from '../libs/redis';
import { AttributeDocument } from '../models/Attribute';
import {
  AttributeVariantDocument,
  Variant,
  VariantDocument,
} from '../models/Variant';
import { ModelRepository } from '../repositories';
import { AttributeRepository } from '../repositories/attributeRepository';
import { ProductRepository } from '../repositories/productRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { isGeneration, isNumber, parseYear, unitFormat } from '../util/common';

@Service()
export class VariantService {
  constructor(
    public variantRepository?: VariantRepository,
    public attributeRepository?: AttributeRepository,
    public error?: ErrorResponseDto,
    public modelRepository?: ModelRepository,
    public productRepository?: ProductRepository
  ) {}

  private async getAllVariantAttributes(): Promise<AttributeDocument[]> {
    const key = `all_attributes`;
    const attributes = await getCache<any>(key);
    if (attributes) {
      return attributes as AttributeDocument[];
    }
    const [errAttribute, attributesData] =
      await this.attributeRepository.getAllAttribute();
    if (errAttribute) {
      this.error.errorCode = attributesData.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = attributesData.result.toString();
      this.error.message = attributesData.message;
      throw this.error;
    }

    await setCache(key, attributesData.result);
    return attributesData.result as AttributeDocument[];
  }

  async getVariantViaId(variantId: string, grade?: string) {
    try {
      const respondData = await getCache(`variant_via_id_${variantId}`);

      if (respondData) {
        return respondData;
      }
      const [errVariant, variant] =
        await this.variantRepository.getByIdWithPriceNudge(variantId);
      if (errVariant || !variant.result?.length) {
        this.error.errorCode = variant.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = variant.result.toString();
        this.error.message = variant.message;
        throw this.error;
      }

      const attributes: AttributeDocument[] =
        await this.getAllVariantAttributes();

      const returnedData = await this.mapFromModelToGetVariantDto(
        variant.result[0],
        attributes,
        grade
      );

      setCache(`variant_via_id_${variantId}`, returnedData);
      return returnedData;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async getShortVariantByID(
    variantId: string
  ): Promise<
    [
      boolean,
      { code: number; result: VariantDocument | string; message?: string }
    ]
  > {
    try {
      const [errVariant, variant] = await this.variantRepository.getById(
        variantId
      );

      return [errVariant, variant];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async getVariantViaModelId(modelId: string, offset?: any, limit?: any) {
    try {
      const key = `variant_modelId_${modelId}_${offset ?? 0}_${limit ?? 0}`;
      let modelVariants = await getCache<any>(key);
      if (modelVariants) {
        return modelVariants;
      }

      const [errVariant, variant] =
        await this.variantRepository.getVariantViaModelId(
          modelId,
          +offset,
          +limit
        );

      if (errVariant) {
        this.error.errorCode = variant?.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = variant.result.toString();
        this.error.message = variant.message;
        throw this.error;
      }
      const variants = variant.result as VariantDocument[];

      const attributes: AttributeDocument[] =
        await this.getAllVariantAttributes();

      if (offset !== undefined && limit !== undefined) {
        modelVariants = variant;

        modelVariants.result = await Promise.all(
          variants.map(async (elem: VariantDocument) => {
            return await this.mapFromModelToGetVariantDto(elem, attributes);
          })
        );

        await setCache(key, modelVariants);
        return modelVariants;
      }

      // eslint-disable-next-line prefer-const
      modelVariants = await Promise.all(
        variants.map(async (elem: VariantDocument) => {
          return await this.mapFromModelToGetVariantDto(elem, attributes);
        })
      );

      await setCache(key, modelVariants);
      return modelVariants;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async getBaseAttributeVariant(modelId: string) {
    try {
      const mappingVariantArr = await this.getVariantViaModelId(modelId);
      const filterableAttributes = (
        mappingVariantArr[0]?.attributes?.slice(1) || []
      ).map((element: AttributeDto) => {
        return {
          id: element.featureId,
          attributeName: element.nameEn,
          attributeNameAr: element.nameAr,
        } as FilterableAttribute;
      });

      const baseAttributeId =
        mappingVariantArr?.[0]?.attributes?.[0]?.featureId;
      const baseOptionId = mappingVariantArr?.[0]?.attributes?.[0]?.attributeId;
      const firstBaseAttribute: BaseAttributeDto = {
        id: mappingVariantArr?.[0]?.attributes?.[0]?.featureId,
        nameAr: mappingVariantArr?.[0]?.attributes?.[0]?.nameAr,
        nameEn: mappingVariantArr?.[0]?.attributes?.[0]?.nameEn,
        options: mappingVariantArr?.[0]?.attributes?.[0]?.options || [],
      };
      let isEmptyVariant = false;

      if (
        mappingVariantArr?.[0]?.attributes?.[0]?.options?.length &&
        mappingVariantArr?.[0]?.attributes?.[0]?.options?.[0]?.nameEn.toLowerCase() ===
          'next'
      ) {
        isEmptyVariant = true;
      }
      for (const variant of mappingVariantArr?.slice(1)) {
        const foundMatchBaseAttribute = variant?.attributes?.find(
          (attribute: AttributeDto) =>
            attribute?.featureId?.toString() === baseAttributeId?.toString() &&
            attribute?.attributeId?.toString() !== baseOptionId?.toString()
        );

        if (!foundMatchBaseAttribute) {
          continue;
        }
        const existAttribute = firstBaseAttribute?.options?.find(
          (attribute: OptionAttributeDto) =>
            attribute.id === foundMatchBaseAttribute?.options?.[0]?.id
        );

        if (existAttribute) {
          continue;
        }
        if (foundMatchBaseAttribute?.options?.length) {
          firstBaseAttribute.options.push({
            id: foundMatchBaseAttribute?.options?.[0]?.id,
            nameAr: foundMatchBaseAttribute?.options?.[0]?.nameAr,
            nameEn: foundMatchBaseAttribute?.options?.[0]?.nameEn,
          });
        }
      }

      let returnedVariant: any;
      if (isEmptyVariant) {
        returnedVariant = Variant.findOne({
          model_id: modelId,
          status: 'Active',
        });
        returnedVariant.attributes = [];

        return {
          baseAttribute: firstBaseAttribute,
          filterableAttributes: filterableAttributes,
          variant: await this.mapFromModelToGetVariantDto(returnedVariant, []),
        };
      }

      return {
        baseAttribute: firstBaseAttribute,
        filterableAttributes: filterableAttributes,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async getFilterAttributeVariant(objQuery: any) {
    try {
      let mappingVariantArr = await this.getVariantViaModelId(objQuery.modelId);

      if ((mappingVariantArr || []).length === 0) {
        return null;
      }

      if (objQuery?.previousOptions && objQuery?.previousOptions?.[0] !== '') {
        mappingVariantArr = mappingVariantArr.filter(
          (variant: GetVarientDto) => {
            const attributesArray: string[] = variant?.attributes?.map(
              (attribute: AttributeDto) => attribute?.attributeId?.toString()
            );

            if (
              objQuery?.previousOptions?.every((element: string) =>
                attributesArray?.includes(element)
              )
            ) {
              return variant;
            }
          }
        );
      }

      const [err, attributedRes] = await this.attributeRepository.getById(
        objQuery.attributeId
      );
      let filterAttribute = attributedRes.result as AttributeDocument;
      if (err) {
        const [, attributeData] = await this.attributeRepository.getAttribute(
          objQuery.attributeId
        );
        filterAttribute = (attributeData?.result as AttributeDocument[])?.[0];
      }

      const queryAttribute: BaseAttributeDto = {
        id: filterAttribute._id?.toString(),
        nameAr: filterAttribute.attribute_name_ar,
        nameEn: filterAttribute.attribute_name_en,
        options: [],
      };

      for (const variant of mappingVariantArr || []) {
        const foundMatchBaseAttribute = variant.attributes?.find(
          (attribute: AttributeDto) =>
            attribute?.featureId?.toString() ===
              objQuery?.filterId?.toString() &&
            attribute?.attributeId?.toString() ===
              objQuery?.optionId?.toString()
        );

        if (!foundMatchBaseAttribute) {
          continue;
        }
        const foundNextMatchAttribute = variant.attributes?.find(
          (attribute: AttributeDto) =>
            attribute?.featureId?.toString() ===
            objQuery?.attributeId?.toString()
        );

        if (!foundNextMatchAttribute) {
          continue;
        }
        const existAttribute = queryAttribute.options?.find(
          (attribute: BaseAttributeDto) =>
            attribute?.id?.toString() ===
            foundNextMatchAttribute?.options?.[0]?.id?.toString()
        );

        if (existAttribute) {
          continue;
        }
        queryAttribute.options.push({
          id: foundNextMatchAttribute?.options?.[0]?.id,
          nameAr: foundNextMatchAttribute?.options?.[0]?.nameAr,
          nameEn: foundNextMatchAttribute?.options?.[0]?.nameEn,
        });
      }

      if (queryAttribute.options.length === 0) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT
        );
      }

      return {
        queryAttribute: queryAttribute,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async getVariantViaFilterAttributes(objQuery: any) {
    try {
      const mappingVariantArr = await this.getVariantViaModelId(
        objQuery?.modelId
      );
      let attributeArr: string[] = [];
      let variantData: GetVarientDto;
      for (const variant of mappingVariantArr || []) {
        const foundMatchBaseAttribute = variant.attributes.find(
          (attribute: AttributeDto) =>
            attribute?.featureId?.toString() ===
              objQuery?.attributeId?.toString() &&
            attribute?.attributeId?.toString() ===
              objQuery?.optionId?.toString()
        );

        if (!foundMatchBaseAttribute) {
          continue;
        }
        const newAttributeArr = (variant.attributes || []).slice(1) || [];
        attributeArr = newAttributeArr.map((item: AttributeDto) =>
          item?.attributeId?.toString()
        );
        const diff = _differenceWith(
          attributeArr,
          objQuery.filterIds,
          _isEqual
        );

        if (diff.length === 0) {
          variantData = variant;
          return variantData;
        }
      }

      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
        Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }

  async createVarient(newVarient: VariantDocument) {
    try {
      const [err, data] = await this.variantRepository.createVarient(
        newVarient
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      await deleteWithPattern('variant_model_*');
      await deleteWithPattern('variant_modelId_*');
      await deleteWithPattern('base_attribute_*');
      await deleteWithPattern('filter_attribute_*');

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
          exception.message
        );
      }
    }
  }

  async updateVarient(variantId: string, updatedVarient: VariantDocument) {
    try {
      const [err, data] = await this.variantRepository.updateVarient(
        variantId,
        updatedVarient
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      await deleteCache([`variant_modelId_${updatedVarient.model_id}`]);
      await deleteWithPattern('variant_model_*');
      await deleteWithPattern('variant_modelId_*');
      await deleteWithPattern('base_attribute_*');
      await deleteWithPattern('filter_attribute_*');
      await deleteWithPattern('variant_via_id_*');

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_VARIANT,
          exception.message
        );
      }
    }
  }

  async removeVarient(variantId: string) {
    try {
      const [err, data] = await this.variantRepository.removeVarient(variantId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      await deleteWithPattern('variant_model_*');
      await deleteWithPattern('variant_modelId_*');
      await deleteWithPattern('base_attribute_*');
      await deleteWithPattern('filter_attribute_*');

      return [err, data];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_VARIANT,
          exception.message
        );
      }
    }
  }
  calculateFairSegment(upperValue: number, lowerValue: number) {
    return {
      fair: lowerValue + Math.round(((upperValue - lowerValue) * 1) / 3),
      expensive: lowerValue + Math.round(((upperValue - lowerValue) * 2) / 3),
    };
  }
  async mapFromModelToGetVariantDto(
    variantDocument: any,
    allAttributes?: AttributeDocument[],
    grade?: string
  ): Promise<GetVarientDto> {
    const attributes = this.mappingAttribute(
      variantDocument.attributes,
      allAttributes
    );
    const result: GetVarientDto = {
      id: variantDocument._id,
      categoryId: variantDocument.category_id,
      brandId: variantDocument.brand_id,
      modelId: variantDocument.model_id,
      varientEn: variantDocument.varient,
      varientAr: variantDocument.varient_ar,
      currentPrice: variantDocument.current_price,
      position: variantDocument.position,
      createdAt: variantDocument.created_at,
      status: variantDocument.status,
      deletedDate: variantDocument.deleted_date,
      attributes: attributes,
    };

    if (variantDocument.conditions) {
      result.priceRanges = grade; // this need fix plz no ignore
    }
    return result;
  }

  mapSingleFeature(obj: AttributeDto, allAttributes?: any[]): AttributeDto {
    const attribute = allAttributes?.filter(
      (attribute: any) => attribute.id === obj?.featureId?.toString()
    )[0];
    const options = attribute?.options
      ?.filter((item: any) => item.id === obj?.attributeId?.toString())
      .map((i: any) => ({
        id: i?.id,
        nameAr: i?.nameAr,
        nameEn: i?.nameEn,
      }));

    return {
      featureId: obj?.featureId,
      attributeId: obj?.attributeId,
      nameAr: attribute?.attribute_name_ar,
      nameEn: attribute?.attribute_name_en,
      options,
    };
  }

  mappingAttribute(
    attributeVariants: AttributeVariantDocument[],
    allAttributes?: AttributeDocument[]
  ): AttributeDto[] {
    let data: AttributeDto[] = [];

    if (!attributeVariants) {
      return data;
    }
    data = attributeVariants.map((item: AttributeVariantDocument) => {
      return this.mapSingleFeature(
        {
          featureId: item.feature_id,
          attributeId: item.attribute_id,
        },
        allAttributes
      );
    });

    return data;
  }

  mapFromGetVariantDtoToCreateModel(
    varient: CreateVarientDto
  ): VariantDocument {
    return {
      category_id: varient.categoryId,
      brand_id: varient.brandId,
      model_id: varient.modelId,
      varient: varient.varientEn,
      varient_ar: varient.varientAr,
      current_price: varient.currentPrice || 0,
      deleted_date: null,
      attributes:
        varient.attributes?.map((item: AttributeDto) => {
          return {
            feature_id: item.featureId,
            attribute_id: item.attributeId,
          };
        }) || [],
    } as VariantDocument;
  }

  mapFromGetVariantDtoToUpdateModel(
    varient: UpdateVarientDto
  ): VariantDocument {
    return {
      category_id: varient.categoryId,
      brand_id: varient.brandId,
      model_id: varient.modelId,
      varient: varient.varientEn,
      varient_ar: varient.varientAr,
      position: varient.position,
      status: varient.status,
      current_price: varient.currentPrice,
      deleted_date: varient.deletedDate,
      updated_at: new Date(),
      created_at: varient.createdAt,
      attributes:
        varient.attributes?.map((item: AttributeDto) => {
          return {
            feature_id: item.featureId,
            attribute_id: item.attributeId,
          };
        }) || [],
    } as VariantDocument;
  }

  async mapAttributeOptionsVariant(
    variantDocument: any,
    allAttributes?: AttributeDocument[]
  ): Promise<GetVarientDto> {
    const attributes = this.mappingAttribute(
      variantDocument.attributes,
      allAttributes
    );

    const result: GetVarientDto = {
      id: variantDocument._id,
      categoryId: variantDocument.category_id,
      brandId: variantDocument.brand_id,
      modelId: variantDocument.model_id,
      varientEn: variantDocument.varient,
      varientAr: variantDocument.varient_ar,
      currentPrice: variantDocument.current_price,
      position: variantDocument.position,
      createdAt: variantDocument.created_at,
      status: variantDocument.status,
      deletedDate: variantDocument.deleted_date,
      attributes: attributes,
    };

    return result;
  }
  async getAttributeOptionsVariant(
    modelId: string,
    categoryId: string,
    brandId: string
  ): Promise<BaseAttributeDto[]> {
    try {
      const [[errVariant, variant], [errAttribute, attributes]] =
        await Promise.all([
          this.variantRepository.getVariantsWithProduct(
            modelId,
            categoryId,
            brandId
          ),
          this.attributeRepository.getAllAttribute(),
        ]);

      if (errVariant || errAttribute) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT
        );
      }

      if (errAttribute) {
        this.error.errorCode = attributes.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = attributes.result.toString();
        this.error.message = attributes.message;
        throw this.error;
      }

      const variants = variant.result as VariantDocument[];
      const attributesArr = attributes.result as AttributeDocument[];
      const mappingVariantArr = await Promise.all(
        variants.map(elem =>
          this.mapFromModelToGetVariantDto(elem, attributesArr)
        )
      );

      const baseAttributeMap = new Map<string, BaseAttributeDto>();

      mappingVariantArr[0]?.attributes.forEach(v => {
        const baseAttributeId = v?.featureId;
        const baseOptionId = v?.attributeId;

        let baseAttribute: BaseAttributeDto = baseAttributeMap.get(
          baseAttributeId
        ) || {
          id: v?.featureId,
          nameAr: v?.nameAr,
          nameEn: v?.nameEn,
          options: v?.options,
        };

        if (
          baseAttribute?.options.length === 1 &&
          baseAttribute?.options.some(opt => opt.nameEn === 'Next')
        ) {
          baseAttribute = null;
        }

        for (const variant of mappingVariantArr.slice(1)) {
          const foundMatchBaseAttribute = variant?.attributes?.find(
            (attribute: AttributeDto) =>
              attribute?.featureId?.toString() ===
                baseAttributeId?.toString() &&
              attribute?.attributeId?.toString() !== baseOptionId?.toString()
          );

          if (foundMatchBaseAttribute) {
            const existAttribute = baseAttribute?.options?.some(
              (attribute: OptionAttributeDto) =>
                attribute.id === foundMatchBaseAttribute.options[0].id
            );

            if (!existAttribute) {
              baseAttribute.options.push({
                id: foundMatchBaseAttribute?.options[0]?.id,
                nameAr: foundMatchBaseAttribute?.options[0]?.nameAr,
                nameEn: foundMatchBaseAttribute?.options[0]?.nameEn,
              });
            }
          }
          baseAttribute.options.sort(this.customVariantSort);
        }

        if (baseAttribute) {
          baseAttributeMap.set(baseAttributeId, baseAttribute);
        }
      });

      return Array.from(baseAttributeMap.values()).filter(Boolean);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          exception.message
        );
      }
    }
  }
  customVariantSort(a: OptionAttributeDto, b: OptionAttributeDto): number {
    const aIsNumber: boolean = isNumber(a.nameEn.trim());
    const bIsNumber: boolean = isNumber(b.nameEn.trim());

    const aIsGeneration: boolean = isGeneration(a.nameEn.trim());
    const bIsGeneration: boolean = isGeneration(b.nameEn.trim());

    if (aIsGeneration && bIsGeneration) {
      const aYear = parseYear(a.nameEn);
      const bYear = parseYear(b.nameEn);
      return aYear - bYear;
    } else if (aIsNumber && bIsNumber) {
      return parseFloat(a.nameEn) - parseFloat(b.nameEn);
    } else if (aIsGeneration || bIsGeneration) {
      return aIsGeneration ? -1 : 1;
    } else {
      const aUnit: string = unitFormat(a.nameEn);
      const bUnit: string = unitFormat(b.nameEn);

      const unitOrder: { [key: string]: number } = {
        KB: 1,
        MB: 2,
        GB: 3,
        TB: 4,
      };

      const aNumericValue = parseFloat(a.nameEn) || 0;
      const bNumericValue = parseFloat(b.nameEn) || 0;

      if (aUnit === bUnit) {
        return aNumericValue - bNumericValue;
      } else {
        const aUnitOrder = unitOrder[aUnit] || 0;
        const bUnitOrder = unitOrder[bUnit] || 0;

        return aUnitOrder - bUnitOrder;
      }
    }
  }
  async requestToSyncMarketProducts(
    csvData: NewPriceProductDto[]
  ): Promise<any> {
    try {
      return await this.variantRepository.updateMarketPercentageProducts(
        csvData
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_SYNC_MARKET_PRODUCTS,
        exception.message
      );
    }
  }
}
