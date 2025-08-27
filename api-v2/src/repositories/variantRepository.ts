import mongoose from 'mongoose';
import { Service } from 'typedi';
import moment from 'moment';
import { mappingMongoError } from '../libs/mongoError';
import { Constants } from '../constants/constant';
import { Variant, VariantDocument, VariantForProduct } from '../models/Variant';
import { BaseRepository } from './BaseRepository';
import { Attribute, AttributeDocument } from '../models/Attribute';
import { ImportingVariantInput } from '../models/ImportingVariant';
import {
  getCache,
  setCache,
  deleteCache,
  deleteWithPattern,
} from '../libs/redis';
import _isEmpty from 'lodash/isEmpty';
import {
  errorTemplate,
  lookup,
  returnedDataTemplate,
} from '../util/queryHelper';
import { ProductStatus } from '../enums/ProductStatus.Enum';
import { ProductOrderStatus } from '../enums/ProductStatus.Enum';
import { getAttribute } from '../grpc/category';
import { ProductModel } from '../models/LegacyProducts';
import { NewPriceProductDto } from '../dto/condition/priceNudgeVarientDto';
import { ILegacyProductModel } from '../models/LegacyProducts';
@Service()
export class VariantRepository implements BaseRepository {
  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: VariantDocument | string; message?: string }
    ]
  > {
    try {
      const cacheData = await getCache<VariantDocument>(`variant_${id}`);

      if (_isEmpty(cacheData)) {
        const data = await Variant.findById(id).exec();

        if (!data) {
          return errorTemplate(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
            Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT
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

  async getByIdWithPriceNudge(
    id: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const options = [
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        lookup('conditions', '_id', 'varient_id', 'conditions'),
      ];

      const variantData = await Variant.aggregate(options).exec();

      if (!variantData || variantData.length < 1) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: variantData },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_VARIANT_BY_ID,
          message: exception.message,
        },
      ];
    }
  }

  async getVariantById(
    id: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      return await this.getById(id);
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_VARIANT_BY_ID,
          message: exception.message,
        },
      ];
    }
  }

  async getVariantsWithProduct(
    modelId?: string,
    categoryId?: string,
    brandId?: string
  ): Promise<
    [
      boolean,
      { code: number; result: VariantDocument[] | string; message?: string }
    ]
  > {
    let aggregation = [];
    let matchItem = null;

    if (categoryId) {
      matchItem = {
        $eq: ['$category_id', new mongoose.Types.ObjectId(categoryId)],
      };
      aggregation.push({
        $match: {
          category_id: {
            $eq: new mongoose.Types.ObjectId(categoryId),
          },
          status: {
            $eq: 'Active',
          },
        },
      });
    }
    if (modelId) {
      const models = modelId.split(',');
      const model_ids = models.map(model => new mongoose.Types.ObjectId(model));
      matchItem = model_ids.length > 0 ? { $in: ['$model_id', model_ids] } : {};
      aggregation.push({
        $match: {
          model_id: {
            $in: model_ids,
          },
          status: {
            $eq: 'Active',
          },
        },
      });
    }
    if (brandId) {
      matchItem = {
        $eq: ['$brand_id', new mongoose.Types.ObjectId(brandId)],
      };
      aggregation.push({
        $match: {
          brand_id: {
            $eq: new mongoose.Types.ObjectId(brandId),
          },
          status: {
            $eq: 'Active',
          },
        },
      });
    }

    aggregation = [
      ...aggregation,
      ...[
        {
          $lookup: {
            from: 'products',
            let: {
              id: '$_id',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: ['$$id', '$varient_id'],
                      },
                      matchItem && { matchItem },
                      { $eq: ['$status', ProductStatus.Active] },
                      { $eq: ['$isApproved', true] },
                      { $eq: ['$sell_status', ProductOrderStatus.Available] },
                      { $gte: ['$expiryDate', moment().toDate()] },
                    ],
                  },
                },
              },
            ],
            as: 'products',
          },
        },
        { $unwind: '$products' },
        {
          $group: {
            _id: '$_id',
            brandId: { $first: '$brand_id' },
            categoryId: { $first: '$category_id' },
            modelId: { $first: '$model_id' },
            varientEn: { $first: '$varient' },
            varientAr: { $first: '$varient_ar' },
            attributes: { $first: '$attributes' },
            currentPrice: { $first: '$current_price' },
            position: { $first: '$position' },
            createdAt: { $first: '$created_at' },
            status: { $first: '$status' },
            deletedDate: { $first: '$deleted_date' },
          },
        },
        {
          $sort: {
            position: -1,
          },
        },
      ],
    ];

    const data = await Variant.aggregate([...aggregation]);
    return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
  }

  async getVariantViaModelId(
    modelId: any,
    offset?: number,
    limit?: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: VariantDocument[] | string;
        message?: string;
        total?: number;
        offset?: number;
        limit?: number;
      }
    ]
  > {
    try {
      const totalItems = await Variant.countDocuments({
        model_id: modelId,
        status: 'Active',
      });

      const data = await Variant.find({
        model_id: modelId,
        status: 'Active',
      })
        .skip(offset)
        .limit(limit)
        .exec();

      if (!data || data.length === 0) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT
        );
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          total: totalItems,
          offset: offset,
          limit: limit,
        },
      ];
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
        exception.message
      );
    }
  }

  async getVariantViaCategoryId(
    categoryId: string
  ): Promise<
    [
      boolean,
      { code: number; result: VariantDocument[] | string; message?: string }
    ]
  > {
    try {
      const data = await Variant.find(
        {
          category_id: categoryId,
          status: 'Active',
        },
        { _id: 1 }
      ).exec();
      if (!data || data.length === 0) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
          Constants.MESSAGE.FAILED_TO_GET_MATCHED_VARIANT
        );
      }
      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_GET_VARIANT,
        exception.message
      );
    }
  }

  async getAllAttributes(): Promise<
    [boolean, { code: number; result: AttributeDocument[]; message?: string }]
  > {
    try {
      const data = await Attribute.find({ status: 'Active' }).exec();
      if (!data) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          '',
          Constants.ERROR_MAP.ATTRIBUTE_NOT_FOUND
        );
      }
      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        '',
        exception.message
      );
    }
  }

  async getVariant(mapIds: string[] = null) {
    try {
      let options = {};
      if (mapIds) {
        options = {
          _id: { $in: mapIds.map(item => new mongoose.Types.ObjectId(item)) },
          status: 'Active',
        };
        const data = await Variant.find(options).exec();
        return [false, data];
      }
      const key = `all_variants`;
      let allVariants = await getCache<any>(key);
      if (allVariants) {
        return [false, allVariants];
      }
      allVariants = await Variant.find(options).exec();
      await setCache(key, allVariants);
      return [false, allVariants];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_VARIANT];
    }
  }

  async getModelsInUsedByVarients(): Promise<
    [boolean, { model_id: any }[] | string]
  > {
    try {
      const data = await Variant.aggregate([
        {
          $match: {
            status: 'Active',
          },
        },
        {
          $project: {
            model_id: 1,
          },
        },
      ]);

      return [false, data];
    } catch (exception) {
      return [true, Constants.ERROR_MAP.FAILED_TO_GET_VARIANT];
    }
  }

  async createVarient(
    varient: VariantDocument
  ): Promise<
    [
      boolean,
      { code: number; result: VariantDocument | string; message?: string }
    ]
  > {
    try {
      const createdVarient = new Variant(varient);
      const data = await createdVarient.save();
      await setCache(`variant_${data._id.toString()}`, data, 1800);
      await deleteWithPattern(Constants.CACHE_KEYS.ATTRIBUTE_OPTIONS + '*');

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_ADD_VARIANT,
          exception.message
        );
      }
    }
  }

  async updateVarient(
    variantId: string,
    varient: VariantDocument
  ): Promise<
    [
      boolean,
      { code: number; result: VariantDocument | string; message?: string }
    ]
  > {
    try {
      const data = await Variant.findOneAndUpdate({ _id: variantId }, varient, {
        new: true,
      });
      await deleteCache([`variant_${variantId}`]);
      await deleteWithPattern(Constants.CACHE_KEYS.ATTRIBUTE_OPTIONS + '*');

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_VARIANT,
          exception.message
        );
      }
    }
  }

  async removeVarient(
    variantId: string
  ): Promise<
    [boolean, { code: number; result: string | string; message?: string }]
  > {
    try {
      await Variant.findByIdAndUpdate(variantId, {
        $set: { status: 'Delete', deleted_date: new Date() },
      });
      await deleteCache([`variant_${variantId}`]);
      await deleteWithPattern(Constants.CACHE_KEYS.ATTRIBUTE_OPTIONS + '*');

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        'Variant is removed successfully'
      );
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_DELETE_VARIANT,
          exception.message
        );
      }
    }
  }

  async findAndUpsert(
    variantInput: ImportingVariantInput
  ): Promise<
    [
      boolean,
      { code: number; result: string | VariantDocument; message?: string }
    ]
  > {
    try {
      const temp = variantInput.attributes.map(item => ({
        'attributes.feature_id': item.feature_id.toString(),
        'attributes.attribute_id': item.attribute_id.toString(),
      }));
      const filterAttributes = {
        $and: temp,
      };

      let existingVariant = await Variant.findOne({
        category_id: variantInput.category_id,
        brand_id: variantInput.brand_id,
        model_id: variantInput.model_id,
        ...filterAttributes,
      });

      if (existingVariant) {
        existingVariant.current_price = variantInput.current_price;
        existingVariant.migration_source =
          existingVariant.migration_source === 'migration_service_create'
            ? 'migration_service_create_update'
            : 'migration_service_update';
        await existingVariant.save();
      } else {
        variantInput.migration_source = 'migration_service_create_2ndtime';
        existingVariant = await Variant.create(variantInput);
      }

      await deleteWithPattern(Constants.CACHE_KEYS.ATTRIBUTE_OPTIONS + '*');

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        existingVariant,
        'Upsert variant successfully'
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

  async getVarientWithAttributes(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: string | VariantForProduct; message?: string }
    ]
  > {
    try {
      const cacheData = await getCache<VariantForProduct>(
        `variant_with_option_${id}`
      );

      if (!_isEmpty(cacheData)) {
        return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, cacheData);
      }
      const aggregateArr = [
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $unwind: '$attributes',
        },
        {
          $lookup: {
            from: 'Attribute',
            let: { varientAttribute: '$attributes' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $or: [
                          { $eq: ['$_id', '$$varientAttribute.feature_id'] },
                          {
                            $eq: [
                              { $toString: '$_id' },
                              { $toString: '$$varientAttribute.feature_id' },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'attribute',
          },
        },
        {
          $unwind: '$attribute',
        },
        {
          $project: {
            _id: 1,
            varient_ar: 1,
            varient: 1,
            conditions: 1,
            current_price: 1,
            'attribute.attribute_name_ar': 1,
            'attribute.attribute_name_en': 1,
            'attribute.option': {
              $filter: {
                input: '$attribute.options',
                as: 'option',
                cond: {
                  $eq: [
                    { $convert: { input: '$$option.id', to: 'string' } },
                    {
                      $convert: {
                        input: '$attributes.attribute_id',
                        to: 'string',
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $group: {
            _id: '$_id',
            varient_ar: { $first: '$varient_ar' },
            varient: { $first: '$varient' },
            attributes: { $push: '$attribute' },
            current_price: { $first: '$current_price' },
          },
        },
      ];

      const data = await Variant.aggregate(aggregateArr);
      if (!data || data?.length == 0) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_VARIANT
        );
      }
      const variant: VariantDocument = await Variant.findById(id).exec();
      const attributes = await Promise.all(
        variant.attributes?.map(async attribute => {
          const { attribute: attrObj } = await getAttribute({
            id: attribute.feature_id,
          });
          attrObj.options = attrObj.options?.filter(
            option => option.id === attribute.attribute_id
          );
          return attrObj;
        })
      );
      const returnedResult = {
        ...{
          id: variant.id,
          nameEn: variant.varient,
          nameAr: variant.varient_ar,
          currentPrice: variant.current_price,
        },
        ...{ attributes: attributes as any },
      };
      await setCache(`variant_with_option_${id}`, returnedResult, 1800);
      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        returnedResult
      );
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

  async getVariantIdsByMapId(
    map_id: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const data: any = await Variant.find(
        { model_variant_map_id: mongoose.Types.ObjectId(map_id) },
        { _id: 1 }
      );

      return returnedDataTemplate(
        Constants.SUCCESS_CODE.SUCCESS,
        data,
        'Get variant ids by mapping id successfully'
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

  async migrateModelId(
    map_id: string,
    old_model_id: string,
    new_model_id: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: any;
        message?: string;
      }
    ]
  > {
    try {
      const data: any = await Variant.updateMany(
        {
          model_id: mongoose.Types.ObjectId(old_model_id),
        },
        {
          $set: {
            model_id: new mongoose.Types.ObjectId(new_model_id),
            model_migration_source: `Updated old model_id = ${old_model_id} with ${new_model_id}`,
            model_variant_map_id: new mongoose.Types.ObjectId(map_id),
          },
        },
        {
          new: true,
        }
      );

      if (!data || data.length === 0) {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
          Constants.MESSAGE.NO_SUCH_PRODUCT_FOUND
        );
      }

      return returnedDataTemplate(Constants.SUCCESS_CODE.SUCCESS, data);
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          mappingErrorCode,
          exception.message
        );
      } else {
        return errorTemplate(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_MAP.FAILED_TO_GET_PREVIEW_PRODUCT,
          exception.message
        );
      }
    }
  }

  async updateMarketPercentageProducts(
    variants: NewPriceProductDto[]
  ): Promise<ILegacyProductModel[] | string> {
    try {
      const bulkOperations: any[] = [];
      for (const variant of variants) {
        const variantId = variant.variantId;
        const minCompPriceNew = Number(variant.newPrice);
        const products = await ProductModel.find({
          status: ProductStatus.Active,
          isApproved: true,
          sell_status: ProductOrderStatus.Available,
          expiryDate: { $gte: moment().toDate() },
          varient_id: new mongoose.Types.ObjectId(variantId),
        }).select('_id sell_price');
        if (!products.length) {
          continue;
        }
        for (const product of products) {
          const sellPrice = product.sell_price;
          if (!sellPrice || sellPrice <= 0) {
            continue;
          }
          const marketPercentage = Math.round(
            100 - (sellPrice / minCompPriceNew) * 100
          );
          if (marketPercentage >= 5) {
            bulkOperations.push({
              updateOne: {
                filter: { _id: product._id },
                update: {
                  $set: {
                    marketPercentage,
                    lastSyncDate: new Date(),
                  },
                },
              },
            });
          }
        }
      }
      if (bulkOperations.length > 0) {
        const result = await ProductModel.bulkWrite(bulkOperations);
        console.log(`${result.modifiedCount} products updated successfully.`);
      } else {
        console.log('No products required updates.');
      }
      return 'Market percentage update completed for all variants.';
    } catch (error) {
      console.log('🚀 ~ SearchRepository ~ error:', error);
      return 'Failed to update market percentage.';
    }
  }
}
