import mongoose from 'mongoose';
import { Service } from 'typedi';
import { mappingMongoError } from '../libs/mongoError';
import { Constants } from '../constants/constant';
import {
  ProductVariant,
  ProductVariantMap,
  ImportingVariantInput,
  MappingArray,
} from '../models/ProductVariantMap';
import { BaseRepository } from './BaseRepository';
import { getCache, setCache } from '../libs/redis';
import _isEmpty from 'lodash/isEmpty';
import { errorTemplate, returnedDataTemplate } from '../util/queryHelper';
@Service()
export class ProductVariantRepository implements BaseRepository {
  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: ProductVariantMap | string; message?: string }
    ]
  > {
    try {
      const cacheData = await getCache<ProductVariantMap>(`variant_${id}`);

      if (_isEmpty(cacheData)) {
        const data = await ProductVariant.findById(id).exec();

        if (!data) {
          return errorTemplate(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_MAP.FAILED_TO_GET_VARIANT
          );
        }
        await setCache(`variant_${id}`, data, 1800);

        return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
      }
      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, cacheData);
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
        exception.message
      );
    }
  }

  async cleanVariantMappingSheetData(): Promise<
    [
      boolean,
      { code: number; result: string | ProductVariantMap; message?: string }
    ]
  > {
    try {
      const data: any[] = await ProductVariant.find({});

      data.forEach(async (productVariant: ImportingVariantInput) => {
        await ProductVariant.updateOne(
          { _id: new mongoose.Types.ObjectId(productVariant._id) },
          {
            $set: {
              category_id: productVariant.category_id.replace(/"/g, ''),
              brand_id: productVariant.brand_id.replace(/"/g, ''),
              model_id: productVariant.model_id.replace(/"/g, ''),
              old_variant_id: productVariant.old_variant_id.replace(/"/g, ''),
              new_model_id: productVariant.new_model_id.replace(/"/g, ''),
              new_variant_id: productVariant.new_variant_id.replace(/"/g, ''),
            },
          }
        );
      });

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        'Clean variant mapping data successfully',
        'Clean variant mapping data successfully'
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      }

      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
        exception.message
      );
    }
  }

  async getMappingArray(): Promise<
    [
      boolean,
      { code: number; result: string | MappingArray[]; message?: string }
    ]
  > {
    try {
      const data: MappingArray[] = await ProductVariant.find(
        {},
        { model_id: 1, new_model_id: 1, old_variant_id: 1, new_variant_id: 1 }
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        data,
        'Get mapping data successfully'
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      }

      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
        exception.message
      );
    }
  }

  async saveRelatedProduct(
    mappingRow_id: string,
    ids: any
  ): Promise<
    [
      boolean,
      { code: number; result: string | MappingArray[]; message?: string }
    ]
  > {
    try {
      const relatedProducts: mongoose.Types.ObjectId[] = ids.map(
        (id: any) => new mongoose.Types.ObjectId(id._id)
      );
      await ProductVariant.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(mappingRow_id) },
        { $set: { related_products: relatedProducts } }
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        'Update related products successfully',
        'Update related products successfully'
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      }

      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
        exception.message
      );
    }
  }

  async saveRelatedVariants(
    mappingRow_id: string,
    ids: any
  ): Promise<
    [
      boolean,
      { code: number; result: string | MappingArray[]; message?: string }
    ]
  > {
    try {
      const relatedVariants: mongoose.Types.ObjectId[] = ids.map(
        (id: any) => new mongoose.Types.ObjectId(id._id)
      );
      await ProductVariant.findByIdAndUpdate(
        { _id: mongoose.Types.ObjectId(mappingRow_id) },
        { $set: { related_variants: relatedVariants } }
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        'Update related variants successfully',
        'Update related variants successfully'
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      }

      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
        exception.message
      );
    }
  }
}
