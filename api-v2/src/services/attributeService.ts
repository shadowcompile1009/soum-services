import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { CreateAttributeDto } from '../dto/attribute/CreateAttributeDto';
import { GetOptionItemDto } from '../dto/attribute/GetOptionItemDto';
import { UpdateAttributeDto } from '../dto/attribute/UpdateAttributeDto';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import {
  createAttribute,
  deleteAttribute,
  getAttribute,
  getAttributes,
  updateAttribute,
} from '../grpc/category';
import { GetAttributeResponse } from '../grpc/proto/category/GetAttributeResponse';
import { GetAttributesResponse } from '../grpc/proto/category/GetAttributesResponse';
import { AttributeDocument, AttributeOption } from '../models/Attribute';
import { AttributeRepository } from '../repositories/attributeRepository';
import {
  createKey,
  deleteWithPattern,
  getCache,
  setCache,
} from '../libs/redis';
import _isEmpty from 'lodash/isEmpty';

@Service()
export class AttributeService {
  constructor(
    public attributeRepository: AttributeRepository,
    public error: ErrorResponseDto
  ) {}
  async getAllAttributes(
    like: string,
    optionsIncluded: boolean,
    page: number = 1,
    size: number = 10
  ) {
    try {
      const key = createKey(Constants.CACHE_KEYS.VARIANT_ATTRIBUTES, [
        like,
        page?.toString(),
        size?.toString(),
      ]);

      const cacheData = await getCache<AttributeDocument[]>(key);
      if (!_isEmpty(cacheData)) {
        return cacheData;
      }
      const attributes: GetAttributesResponse = await getAttributes({
        page,
        size,
        optionsIncluded,
        search: like,
      });
      await setCache(key, attributes, 1800);

      return attributes;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
          exception.message
        );
      }
    }
  }

  async getAttribute(attributeId: string): Promise<GetAttributeResponse> {
    try {
      const attribute = await getAttribute({
        id: attributeId,
      });

      return attribute;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY,
          exception.message
        );
      }
    }
  }

  async createAttribute(attribute: CreateAttributeDto) {
    try {
      const result = await createAttribute({
        name: attribute.nameEn,
        nameAr: attribute.nameAr,
        status: attribute.status,
        options: attribute.options,
      });
      await deleteWithPattern(`${Constants.CACHE_KEYS.VARIANT_ATTRIBUTES}*`);
      await deleteWithPattern(`${Constants.CACHE_KEYS.BASE_ATTRIBUTES}*`);
      await deleteWithPattern(`${Constants.CACHE_KEYS.FILTER_ATTRIBUTES}*`);

      return result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_CATEGORY,
          exception.message
        );
      }
    }
  }
  mapFromCreateAttributeDtoToDocument(
    attribute: CreateAttributeDto
  ): AttributeDocument {
    return {
      attribute_name_ar: attribute?.nameAr,
      attribute_name_en: attribute?.nameEn,
      options: attribute.options.map(
        (elem: GetOptionItemDto) =>
          ({
            id: new mongoose.Types.ObjectId()?.toString(),
            option_name_ar: elem.nameAr,
            option_name_en: elem.nameEn,
          } as AttributeOption)
      ),
    } as AttributeDocument;
  }

  mapFromUpdateAttributeDtoToDocument(
    attribute: UpdateAttributeDto
  ): AttributeDocument {
    return {
      _id: new mongoose.Types.ObjectId(attribute?.id),
      attribute_name_ar: attribute?.nameAr,
      attribute_name_en: attribute?.nameEn,
      options: attribute?.options?.map(
        (elem: GetOptionItemDto) =>
          ({
            id: elem.id || new mongoose.Types.ObjectId(),
            option_name_ar: elem.nameAr,
            option_name_en: elem.nameEn,
          } as AttributeOption)
      ),
    } as AttributeDocument;
  }
  async updateAttribute(attribute: UpdateAttributeDto) {
    try {
      if (!attribute.id) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_ATTRIBUTE
        );
      }
      const result = await updateAttribute({
        id: attribute.id,
        nameEn: attribute.nameEn,
        nameAr: attribute.nameAr,
        status: attribute.status,
        options: attribute.options,
      });
      await deleteWithPattern(`${Constants.CACHE_KEYS.VARIANT_ATTRIBUTES}*`);
      await deleteWithPattern(`${Constants.CACHE_KEYS.BASE_ATTRIBUTES}*`);
      await deleteWithPattern(`${Constants.CACHE_KEYS.FILTER_ATTRIBUTES}*`);

      return result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_ATTRIBUTE
        );
      }
    }
  }

  async deleteAttribute(attributeId: string) {
    try {
      const result = await deleteAttribute({
        id: attributeId,
      });
      await deleteWithPattern(`${Constants.CACHE_KEYS.VARIANT_ATTRIBUTES}*`);
      await deleteWithPattern(`${Constants.CACHE_KEYS.BASE_ATTRIBUTES}*`);
      await deleteWithPattern(`${Constants.CACHE_KEYS.FILTER_ATTRIBUTES}*`);

      return result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_ATTRIBUTE,
          exception.message
        );
      }
    }
  }
}
