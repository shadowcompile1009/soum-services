import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { createKey, getCache, setCache } from '@src/utils/redis';
import _isEmpty from 'lodash/isEmpty';
import { AttributeService } from '../attribute/attribute.service';
import { UpdateAttributeDto } from '../attribute/dto/attribute.dto';
import { Attribute } from '../attribute/entities/attribute';
import { AttributeStatus } from '../attribute/enums/attribute-status.enum';
import { CategoryConditionService } from '../category-condition/category-condition.service';
import { CategoryService } from '../category/category.service';
import { CreateCategoryDto } from '../category/dto/category.dto';
import { Category } from '../category/entities/category';
import { CategoryStatus } from '../category/enums/category-status.enum';
import { CategoryTypes } from '../category/enums/category-types.enums';
import { ConditionService } from '../condition/condition.service';
import { OptionDTO } from '../option/dto/option.dto';
import { OptionStatus } from '../option/enums/option-status.enum';
import {
  CATEGORY_SERVICE_NAME,
  Category as CategoryGRPC,
  Condition,
  CreateAttributeRequest,
  CreateAttributeResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  DeleteAttributeRequest,
  DeleteAttributeResponse,
  GetAttributeRequest,
  GetAttributeResponse,
  GetAttributesRequest,
  GetAttributesResponse,
  GetCatConPriceRangeRequest,
  GetCatConPriceRangeResponse,
  GetCategoriesRequest,
  GetCategoriesResponse,
  GetCategoryByNameRequest,
  GetConditionsRequest,
  GetConditionsResponse,
  GetMultipleAttributeRequest,
  GetMultipleAttributeResponse,
  GetProductCatConRequest,
  GetProductCatConResponse,
  Option,
  PriceQuality,
  UpdateAttributeRequest,
  UpdateAttributeResponse,
} from './proto/category.pb';

@Controller('grpc')
export class GrpcController {
  constructor(
    private readonly catConService: CategoryConditionService,
    private readonly conditionService: ConditionService,
    private readonly categoryService: CategoryService,
    private readonly attributeService: AttributeService,
  ) {}
  @GrpcMethod(CATEGORY_SERVICE_NAME, 'getCatConPriceRange')
  async getCategoryConditionPriceRange(
    payload: GetCatConPriceRangeRequest,
  ): Promise<GetCatConPriceRangeResponse> {
    const key = createKey('category_condition_price_range', [
      payload.conditionId,
      payload.variantId,
      payload.catConditionQuality,
    ]);
    const cashedData = await getCache(key);
    if (_isEmpty(cashedData)) {
      const result =
        await this.catConService.getCategoryConditionPriceRange(payload);
      await setCache(key, result, 60);
      return result;
    }
    return cashedData as GetCatConPriceRangeResponse;
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetProductCatCon')
  async GetProductCondition(
    payload: GetProductCatConRequest,
  ): Promise<GetProductCatConResponse> {
    const key = `product_condition_${payload.id}_${payload.variantId}_${payload.sellPrice}`;
    const cashedData = await getCache(key);
    if (!_isEmpty(cashedData)) {
      return cashedData as GetProductCatConResponse;
    }

    const condition = await this.conditionService.getById(payload.id);
    let productPriceQuality = null;
    if (condition) {
      productPriceQuality =
        await this.catConService.GetProductCondition(payload);
    }
    const result = {
      condition,
      priceQuality: productPriceQuality as PriceQuality,
    } as GetProductCatConResponse;
    await setCache(key, result, 60);
    return result;
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetConditions')
  async GetConditions(
    payload: GetConditionsRequest,
  ): Promise<GetConditionsResponse> {
    const key = createKey('conditions', payload.ids.sort());
    const cashedData = await getCache(key);
    if (!_isEmpty(cashedData)) {
      return cashedData as GetConditionsResponse;
    }

    const conditionsList = await this.conditionService.getList(
      {
        ids: payload.ids,
      },
      0,
      100,
    );
    const result = {
      conditions: conditionsList.items as Condition[],
    } as GetConditionsResponse;
    await setCache(key, result, 5 * 60);
    return result;
  }
  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetCategories')
  async getCategories(
    payload: GetCategoriesRequest,
  ): Promise<GetCategoriesResponse> {
    try {
      const { items } = await this.categoryService.getCategories(
        null,
        payload.type as CategoryTypes,
        payload?.categories?.ids || [],
        payload.limit,
        payload.offset,
      );
      const mapCategories = (category: Category): CategoryGRPC => {
        return {
          id: category.id,
          name: category.name,
          nameAr: category.nameAr,
          status: category.status || '',
          type: category.type,
          parentId: category.parentId || '',
          icon:
            category.images.filter(
              (icon) => icon.type === 'mini_category_icon',
            )?.[0] || undefined,
          position: category.position,
        };
      };
      if (items?.length) {
        const categories1: CategoryGRPC[] = items?.map(mapCategories);
        return { categories: categories1 } as GetCategoriesResponse;
      }
      return { categories: [] };
    } catch (error) {
      console.log(error)
      return { categories: [] };
    }
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetCategoryByName')
  async getCategoryByName(
    payload: GetCategoryByNameRequest,
  ): Promise<CategoryGRPC> {
    const category = await this.categoryService.getCategoryByName(payload.name);
    return {
      id: category.id,
      name: category.name,
      nameAr: category.nameAr,
      status: category.status || '',
      type: category.type,
      parentId: category.parentId || '',
      icon:
        category.images.filter(
          (icon) => icon.type === 'mini_category_icon',
        )[0] || undefined,
      position: category.position,
    } as CategoryGRPC;
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'CreateCategory')
  async createCategory(
    payload: CreateCategoryRequest,
  ): Promise<CreateCategoryResponse> {
    try {
      const newCategory: CreateCategoryDto = {
        id: payload.id,
        name: payload.name,
        nameAr: payload.nameAr,
        position: payload.position,
        images: payload.icons,
        status: CategoryStatus.ACTIVE,
        parentId: payload.parentId,
        type: payload.type as CategoryTypes,
        currentPrice: payload.currentPrice || 0,
        maxPercentage: payload.maxPercentage || 0,
        // categoryAttributes: payload.categoryAttributes || [],
      };

      return await this.categoryService.createCategoryMigration(newCategory);
    } catch (error) {
      console.log(error?.message);
    }
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetAttributes')
  async getAttributes(
    filter: GetAttributesRequest,
  ): Promise<GetAttributesResponse> {
    const { attributes, count } =
      await this.attributeService.getAttributes(filter);
    const returnedData = attributes?.map((attribute) => {
      const optionsMap = attribute.options?.map((item) => <Option>item);
      return {
        id: attribute.id,
        nameAr: attribute.nameAr,
        nameEn: attribute.nameEn,
        status: attribute.status,
        options: optionsMap,
      };
    });

    return { attributes: returnedData, total: count };
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetAttribute')
  async getAttribute(
    filter: GetAttributeRequest,
  ): Promise<GetAttributeResponse> {
    const result = await this.attributeService.getAttributeById(filter);
    if (!result?.id) {
      return { attribute: null };
    }

    const optionsMap = result?.options
      ?.getItems(false)
      ?.map((item) => <Option>item);

    return {
      attribute: {
        id: result.id,
        nameAr: result.nameAr,
        nameEn: result.nameEn,
        status: result.status,
        options: optionsMap,
      },
    };
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'GetMultipleAttribute')
  async getMultipleAttributes(
    payload: GetMultipleAttributeRequest,
  ): Promise<GetMultipleAttributeResponse> {
    const result = await this.attributeService.getMultipleAttributes(payload);
    if (!result) {
      return { attributes: [] };
    }

    const mappedResult = result.map((attribute) => {
      const baseAttribute = {
        id: attribute.id,
        nameAr: attribute.nameAr,
        nameEn: attribute.nameEn,
        status: attribute.status,
      };

      return {
        ...baseAttribute,
        options: attribute?.options
          ?.getItems(false)
          ?.map((item) => <Option>item),
      };
    });

    return {
      attributes: mappedResult,
    };
  }

  private mapOptionsOfAttribute(attribute: Attribute) {
    const arr = [];
    for (const item of attribute?.options) {
      arr.push({
        id: item.id,
        nameAr: item.nameAr,
        nameEn: item.nameAr,
        status: item.status,
      });
    }

    return arr;
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'CreateAttribute')
  async createAttribute(
    data: CreateAttributeRequest,
  ): Promise<CreateAttributeResponse> {
    const result = await this.attributeService.createAttribute(data);
    return {
      id: result.id,
      name: result.nameEn,
      nameAr: result.nameAr,
      status: result.status,
      options: this.mapOptionsOfAttribute(result),
    };
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'UpdateAttribute')
  async updateAttribute(
    payload: UpdateAttributeRequest,
  ): Promise<UpdateAttributeResponse> {
    const mapOptions = (options?: Option[]): OptionDTO[] => {
      return (options || []).map((option: Option) => ({
        id: option.id,
        nameAr: option.nameAr,
        nameEn: option.nameEn,
        status: option.status as OptionStatus,
        positionAr: option?.positionAr,
        positionEn: option?.positionEn,
      }));
    };
    const attribute: UpdateAttributeDto = {
      id: payload.id,
      nameEn: payload.nameEn,
      nameAr: payload.nameAr,
      status: payload.status as AttributeStatus,
      options: mapOptions(payload.options),
    };

    const updateAttribute =
      await this.attributeService.updateAttribute(attribute);

    return {
      id: updateAttribute.id,
      name: updateAttribute.nameEn,
      nameAr: updateAttribute.nameAr,
      status: updateAttribute.status,
      options: this.mapOptionsOfAttribute(updateAttribute),
    };
  }

  @GrpcMethod(CATEGORY_SERVICE_NAME, 'DeleteAttribute')
  async deleteAttribute(
    payload: DeleteAttributeRequest,
  ): Promise<DeleteAttributeResponse> {
    const { id } = payload;
    await this.attributeService.deleteAttribute(id);
    return {};
  }
}
