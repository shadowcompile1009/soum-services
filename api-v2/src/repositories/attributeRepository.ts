import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import {
  Attribute as AttributeModel,
  AttributeDocument,
} from '../models/Attribute';
import { BaseRepository } from './BaseRepository';
import { createKey, deleteCache, getCache, setCache } from '../libs/redis';
import _isEmpty from 'lodash/isEmpty';
import { getAttribute, getAttributes } from '../grpc/category';
import { Attribute } from '../grpc/proto/category/Attribute';
import { Option } from '../grpc/proto/category.pb';

@Service()
export class AttributeRepository extends BaseRepository {
  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: AttributeDocument | string; message?: string }
    ]
  > {
    try {
      const data: AttributeDocument = await AttributeModel.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ATTRIBUTE,
          message: exception.message,
        },
      ];
    }
  }

  async getAllAttribute(
    like?: string
  ): Promise<
    [
      boolean,
      { code: number; result: AttributeDocument[] | string; message?: string }
    ]
  > {
    try {
      const key = createKey(Constants.CACHE_KEYS.VARIANT_ATTRIBUTES, [like]);
      const cacheData = await getCache<AttributeDocument[]>(key);
      if (!_isEmpty(cacheData)) {
        return [
          false,
          { code: Constants.SUCCESS_CODE.SUCCESS, result: cacheData },
        ];
      }
      const attributes = await getAttributes({
        size: 200,
        page: 1,
        search: like,
        optionsIncluded: true,
      });
      const returnedData: AttributeDocument[] = attributes.attributes.map(
        (attribute: Attribute) => {
          return {
            attribute_name_ar: attribute.nameAr,
            attribute_name_en: attribute.nameEn,
            status: attribute.status,
            id: attribute.id,
            options: attribute.options,
          } as AttributeDocument;
        }
      );
      await setCache(key, returnedData, 1800);

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: returnedData },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          message: exception.message,
        },
      ];
    }
  }

  async getAttribute(
    attributeId: string
  ): Promise<
    [
      boolean,
      { code: number; result: AttributeDocument[] | string; message?: string }
    ]
  > {
    try {
      const key = createKey(Constants.CACHE_KEYS.VARIANT_ATTRIBUTES, [
        attributeId,
      ]);
      const cacheData = await getCache<AttributeDocument[]>(key);
      if (!_isEmpty(cacheData)) {
        return [
          false,
          { code: Constants.SUCCESS_CODE.SUCCESS, result: cacheData },
        ];
      }
      const attribute = await getAttribute({
        id: attributeId,
      });
      const returnedData: AttributeDocument[] = [attribute?.attribute]?.map(
        (attribute: Attribute) => {
          return {
            attribute_name_ar: attribute?.nameAr,
            attribute_name_en: attribute?.nameEn,
            status: attribute?.status,
            _id: attribute.id,
            options: attribute?.options?.map((option: Option) => {
              return {
                id: option?.id,
                option_name_en: option?.nameEn,
                option_name_ar: option?.nameAr,
              };
            }),
          } as AttributeDocument;
        }
      );
      await setCache(key, returnedData, 1800);

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: returnedData },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          message: exception.message,
        },
      ];
    }
  }

  async updateAttribute(
    attributeDocument: AttributeDocument
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      if (!attributeDocument._id) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const data: any = null;
      if (!data)
        [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ATTRIBUTE,
          },
        ];
      const key = createKey(Constants.CACHE_KEYS.VARIANT_ATTRIBUTES, ['']);
      await deleteCache([key]);
      await deleteCache(['all_attributes']);

      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ATTRIBUTE,
            message: exception.message,
          },
        ];
      }
    }
  }

  async deleteAttribute(atrributeId: string) {
    try {
      if (!atrributeId) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }

      const result: any = null;
      const key = createKey(Constants.CACHE_KEYS.VARIANT_ATTRIBUTES, ['']);
      await deleteCache([key]);

      return [false, result];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: mappingErrorCode,
            message: exception.message,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_DELETE_ATTRIBUTE,
            message: exception.message,
          },
        ];
      }
    }
  }
}
