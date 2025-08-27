import { Service } from 'typedi';
import { Types } from 'mongoose';
import moment from 'moment';
import { Constants } from '../constants/constant';
import { FavoriteDocument, FavoriteModel } from '../models/Favourite';
import { PaginationDto } from '../dto/paginationDto';
import { FavoriteDto } from '../dto/favorite/FavoriteDto';
import { getNewConditionName } from '../util/productCondition';
import { ProductModel } from '../models/LegacyProducts';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { lookup, unwind } from '../util/queryHelper';
import { TransactionOrderStatus } from '../enums/TransactionStatus';
@Service()
export class FavoriteRepository {
  async getUserFavorites(
    userId: string,
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<FavoriteDocument> | string;
        message?: string;
      }
    ]
  > {
    interface MatchCondition {
      userId?: Types.ObjectId;
    }
    const matchCondition: MatchCondition = {
      userId: Types.ObjectId(userId),
    };

    const aggregate: Array<Record<string, any>> = [
      {
        $match: matchCondition as Record<string, unknown>,
      },
      {
        $lookup: {
          from: 'products',
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $unwind: {
          path: '$product',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'seller',
        },
      },
      {
        $unwind: {
          path: '$seller',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'device_models',
          localField: 'product.model_id',
          foreignField: '_id',
          as: 'model',
        },
      },
      {
        $unwind: {
          path: '$model',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'varients',
          localField: 'product.varient_id',
          foreignField: '_id',
          as: 'varientData',
        },
      },
      { $unwind: '$varientData' },
      lookup('brands', 'product.brand_id', '_id', 'brand'),
      unwind('$brand', true),
      lookup('categories', 'product.category_id', '_id', 'category'),
      unwind('$category', true),
      lookup('orders', 'productId', 'product', 'orderData'),
      unwind('$orderData', true),
      {
        $match: {
          $and: [
            {
              $or: [
                { 'product.sell_status': ProductOrderStatus.Available },
                {
                  $and: [
                    { 'product.sell_status': ProductOrderStatus.Sold },
                    {
                      'orderData.transaction_status':
                        TransactionOrderStatus.SUCCESS,
                    },
                    {
                      'orderData.created_at': {
                        $gt: new Date(
                          new Date().getTime() - 3 * 24 * 60 * 60 * 1000
                        ),
                      },
                    },
                  ],
                },
              ],
            },
            { 'product.expiryDate': { $gte: moment().toDate() } },
            {
              'product.status': {
                $nin: [
                  ProductStatus.Delete,
                  ProductStatus.OnHold,
                  ProductStatus.Reject,
                ],
              },
            },
            { 'product.sell_status': { $ne: ProductOrderStatus.Locked } },
          ],
        },
      },
      {
        $group: {
          _id: '$_id',
          productId: { $first: '$product._id' },
          isConsignment: { $first: '$product.isConsignment' },
          grade: { $first: '$product.grade' },
          modelName: { $first: '$model.model_name' },
          arModelName: { $first: '$model.model_name_ar' },
          arGrade: { $first: '$product.grade_ar' },
          sellerId: { $first: '$product.user_id' },
          sellerCity: { $first: '$seller.address.city' },
          sellPrice: { $first: '$product.sell_price' },
          sellStatus: { $first: '$product.sell_status' },
          status: { $first: '$product.status' },
          createdDate: { $first: '$product.createdDate' },
          expiryDate: { $first: '$product.expiryDate' },
          productImages: { $first: '$product.product_images' },
          variantName: { $first: '$varientData.varient' },
          arVariantName: { $first: '$varientData.varient_ar' },
          originalPrice: { $first: '$varientData.current_price' },
          varient_id: { $first: '$varientData._id' },
          model_id: { $first: '$product.model_id' },
          category_id: { $first: '$product.category_id' },
          conditionId: { $first: '$product.condition_id' },
          attributes: { $first: '$attributes' },
          billingSettings: { $first: '$product.billingSettings' },
          isBiddingProduct: { $first: '$product.isBiddingProduct' },
          sellDate: { $first: '$orderData.created_at' },
          brand: { $first: '$brand' },
          category: { $first: '$category' },
        },
      },
      {
        $project: {
          _id: 0,
          productId: 1,
          sellerId: 1,
          sellerCity: 1,
          sellPrice: 1,
          grade: 1,
          modelName: 1,
          arModelName: 1,
          arGrade: 1,
          variantName: 1,
          arVariantName: 1,
          originalPrice: 1,
          productImages: 1,
          createdDate: 1,
          expiryDate: 1,
          sellStatus: 1,
          status: 1,
          varient_id: 1,
          attributes: 1,
          billingSettings: 1,
          isBiddingProduct: 1,
          sellDate: 1,
          conditionId: 1,
          brand: 1,
          category: 1,
          model_id: 1,
          category_id: 1,
          isConsignment: 1,
        },
      },
      {
        $sort: { createdDate: 1 },
      },
    ];

    const data = await FavoriteModel.aggregate([
      ...aggregate,
      { $skip: size * (page - 1) },
      {
        $limit: size,
      },
    ]);

    const totalCount = await FavoriteModel.count({ userId: userId });
    if (!data) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_FAV,
        },
      ];
    }
    data.map((product: any) => {
      return getNewConditionName(product);
    });

    return [
      false,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: {
          docs: data,
          totalDocs: totalCount,
          hasNextPage: totalCount > page * size,
        },
      },
    ];
  }

  async updateFavourite(
    favDocument: FavoriteDocument
  ): Promise<
    [
      boolean,
      { code: number; result: FavoriteDocument | string; message?: string }
    ]
  > {
    try {
      const productExist = await ProductModel.find({
        _id: Types.ObjectId(favDocument.productId),
        status: ProductStatus.Active,
        sell_status: ProductOrderStatus.Available,
        expiryDate: { $gte: new Date() },
      }).exec();
      if (!productExist || productExist.length === 0) {
        return [
          true,
          {
            message: 'Failed to add product to favorites',
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_FAV,
          },
        ];
      }
      const data: FavoriteDocument = await FavoriteModel.updateOne(
        {
          userId: favDocument.userId,
          productId: favDocument.productId,
        },
        { $setOnInsert: { ...favDocument } },
        { upsert: true }
      );
      if (!data) {
        return [
          true,
          {
            message: 'Failed to add product to favorites',
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_ADD_TO_FAV,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_ADD_TO_FAV,
          message: exception.message,
        },
      ];
    }
  }
  async removeFromFavorites(
    favoriteDto: FavoriteDto
  ): Promise<[boolean, { code: number; result: string; message?: string }]> {
    try {
      const existingFavorite = await FavoriteModel.findOne({
        productId: favoriteDto.productId,
      }).exec();
      if (!existingFavorite) {
        return [
          true,
          {
            message: 'Favorite product not found',
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_REMOVE_FAV,
          },
        ];
      }
      await FavoriteModel.findOneAndDelete({
        productId: favoriteDto.productId,
        userId: favoriteDto.userId,
      }).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Favorite is removed successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_REMOVE_FAV,
          message: exception.message,
        },
      ];
    }
  }
  async getFavorites(userId: string) {
    try {
      const favs = await FavoriteModel.find(
        { userId: userId },
        { _id: 0, productId: 1 }
      ).exec();
      if (!favs) {
        return [true, Constants.MESSAGE.FAVORITE_PRODUCT_NOT_FOUND];
      }
      return [false, favs];
    } catch (exception) {
      return [true, exception.message];
    }
  }
}
