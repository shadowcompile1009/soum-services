import moment from 'moment';
import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import {
  PaymentOrderUpdateDto,
  UpdateOrderAfterPayment,
} from '../dto/order/PaymentOrderUpdateDto';
import {
  BoughtHistory,
  ReservationOrderDto,
} from '../dto/order/ReservationDto';
import { PaginationDto } from '../dto/paginationDto';
import { TopSellingProductDto } from '../dto/product/ProductViewDto';
import { TransactionOrderStatus } from '../enums/TransactionStatus';
import { getPromosByIds } from '../grpc/commission';
import { DetailedPromoCode } from '../grpc/proto/commission/DetailedPromoCode';
import { DeltaMachineOrder } from '../models/DeltaMachineOrder';
import { ProductModel } from '../models/LegacyProducts';
import {
  OrderDocument,
  OrderModel,
  OrderPaginatedModel,
  TaskGeneratedStatus,
  TypesenseSyncedOrder,
} from '../models/Order';
import { getDataRangeAnalytics } from '../util/common';
import { errorTemplate, lookup, unwind } from '../util/queryHelper';
import { BaseRepository } from './BaseRepository';

@Service()
export class OrderRepository extends BaseRepository {
  async getById(
    id: string
  ): Promise<
    [
      boolean,
      { code: number; result: OrderDocument | string; message?: string }
    ]
  > {
    try {
      const data = await OrderModel.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async getOrdersByUserId(
    sellerId: string
  ): Promise<
    [boolean, { code: number; result: OrderDocument[]; message?: string }]
  > {
    try {
      const data = await OrderModel.find({ seller: sellerId }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: [],
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: [],
          message: exception.message,
        },
      ];
    }
  }

  async getUnsyncedOrdersByUserId(
    userId: string,
    limit?: number
  ): Promise<[boolean, { result: TypesenseSyncedOrder[]; message?: string }]> {
    const aggregate: Array<Record<string, any>> = [
      {
        $match: {
          seller: mongoose.Types.ObjectId(userId),
          synced_at: null,
        },
      },
      lookup('users', 'seller', '_id', 'seller'),
      unwind('$seller', false),
      lookup('users', 'buyer', '_id', 'buyer'),
      unwind('$buyer', false),
      lookup('products', 'product', '_id', 'product'),
      unwind('$product', false),
      lookup('device_models', 'product.model_id', '_id', 'model'),
      unwind('$model', false),
      lookup('DeltaMachineOrders', '_id', 'orderId', 'dmOrder'),
      unwind('$dmOrder', false),
      lookup('DeltaMachineStatuses', 'dmOrder.statusId', '_id', 'dmStatus'),
      unwind('$dmStatus', false),
      {
        $project: {
          product_listing_date: '$product.createdDate',
          order_date: '$product.order_date',
          order_id: '$_id',
          dmOrder: '$dmOrder._id',
          dmStatus: '$dmStatus.name',
          product_id: '$product._id',
          buyer_name: '$buyer.name',
          buyer_mobile: '$buyer.mobileNumber',
          buyer_city: '$buyer.address.city',
          seller_id: '$seller._id',
          seller_name: '$seller.name',
          seller_mobile: '$seller.mobileNumber',
          seller_city: '$seller.address.city',
          seller_image: '$seller.profilePic',
          buyerId: '$buyer._id',
          buyerName: '$buyer.name',
          buy_amount: 1,
          shipping_charge: 1,
          vat: 1,
          commission: 1,
          grand_total: 1,
          checkout_id: 1,
          order_number: 1,
          payment_type: 1,
          transaction_id: 1,
          return_reason: 1,
          dispute_comment: 1,
          dispute_validity: 1,
          transaction_time_stamp: '',
          split_payout_detail: 1,
          transaction_status: 1,
          paymentReceivedFromBuyer: 1,
          paymentMadeToSeller: 1,
          buy_type: 1,
          dispute: 1,
          status: 1,
          created_at: 1,
          updated_at: 1,
          sourcePlatform: 1,
          product_sell_price: '$product.sell_price',
          product_name: '$model.model_name',
          product_name_ar: '$model.model_name_ar',
          product_varient_id: '$product.varient_id',
        },
      },
      {
        $limit: limit || 50,
      },
    ];

    const returned = await OrderModel.aggregate(aggregate).exec();

    return [
      false,
      {
        result: returned,
        message: Constants.MESSAGE.SYNC_ORDER_SUCCESS,
      },
    ];
  }

  async getOrderDataForGeneratingInvoice(
    orderId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await OrderModel.findById(orderId)
        .populate('seller', 'name countryCode address mobileNumber bankDetail')
        .populate('buyer', 'name countryCode address mobileNumber')
        .populate({
          path: 'product',
          populate: {
            path: 'category',
            select: 'category_name',
          },
        })
        .populate({
          path: 'product',
          populate: {
            path: 'brand',
            select: 'brand_name',
          },
        })
        .populate({
          path: 'product',
          select:
            // eslint-disable-next-line max-len
            'sell_price category_id brand_id model_id varient_id varient varient_ar bidding answer_to_questions answer_to_questions_ar answer_to_questions_migration answer_to_questions_ar_migration createdDate',
          populate: {
            path: 'model',
          },
        })
        .lean()
        .exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async getOrderDataWithProductDetails(
    orderId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await OrderModel.findById(orderId)
        .populate(
          'seller',
          'name countryCode mobileNumber address secretKey bankDetail tags'
        )
        .populate(
          'buyer',
          'name countryCode mobileNumber address secretKey bankDetail'
        )
        .populate({
          path: 'product',
          populate: {
            path: 'category',
            select: 'category_name category_name_ar category_icon',
          },
        })
        .populate({
          path: 'product',
          populate: {
            path: 'brand',
            select: 'brand_name brand_name_ar brand_icon',
          },
        })
        .populate({
          path: 'product',
          select:
            // eslint-disable-next-line max-len
            'sell_price category_id brand_id model_id varient_id varient bidding answer_to_questions answer_to_questions_ar answer_to_questions_migration answer_to_questions_ar_migration',
          populate: {
            path: 'model',
          },
        })
        .lean()
        .exec();

      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async updatePaymentMadeToSeller(
    orderId: string,
    hyperSplitsData: string,
    paymentMadeToSeller: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      await OrderModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(orderId),
        },
        {
          $set: {
            split_payout_detail: hyperSplitsData,
            paymentMadeToSeller: paymentMadeToSeller,
          },
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Update seller payment status successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_MAKE_PAYMENT_SELLER,
          message: exception.message,
        },
      ];
    }
  }

  async updateLastPayoutToSeller(
    orderId: string,
    lastPayout: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      await OrderModel.findOneAndUpdate(
        {
          _id: mongoose.Types.ObjectId(orderId),
        },
        {
          $set: {
            last_payout: lastPayout,
          },
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Update last payout successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_LAST_PAYOUT,
          message: exception.message,
        },
      ];
    }
  }
  async GetAllOrdersForAdminListing(
    page: number,
    limit: number,
    searchValue: string,
    filter: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      let orQuery: any[] = [];
      if (searchValue) {
        orQuery.push({ order_number: { $regex: searchValue } });
        if (mongoose.Types.ObjectId.isValid(searchValue)) {
          orQuery = orQuery.concat([
            { product: mongoose.Types.ObjectId(searchValue) },
            { seller: mongoose.Types.ObjectId(searchValue) },
            { buyer: mongoose.Types.ObjectId(searchValue) },
          ]);
        }
      }
      if (filter) {
        orQuery = orQuery.concat([
          { dispute: filter },
          { transaction_status: filter },
        ]);
      }
      const query = orQuery.length > 0 ? { $or: orQuery } : {};
      let orders: OrderDocument[] = [];
      const aggregate = [
        {
          $match: query,
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
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
            from: 'users',
            localField: 'buyer',
            foreignField: '_id',
            as: 'buyer',
          },
        },
        {
          $unwind: {
            path: '$buyer',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'PayoutHistory',
            localField: '_id',
            foreignField: 'order',
            let: {
              orderId: {
                $ifNull: [{ $toObjectId: '$_id' }, ''],
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$order', '$$orderId'],
                  },
                },
              },
              { $sort: { created_at: -1 } },
              { $limit: 1 },
              { $project: { _id: 0, transaction_timestamp: 1 } },
            ],
            as: 'payout',
          },
        },
        {
          $unwind: {
            path: '$payout',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            buy_amount: 1,
            buy_type: 1,
            buyer_mobile_number: '$buyer.mobileNumber',
            buyer_name: '$buyer.name',
            buyer_id: '$buyer._id',
            commission: 1,
            created_at: 1,
            dispute: 1,
            grand_total: 1,
            id: '$_id',
            isReadyToPayout: '',
            order_number: 1,
            order_refund_status: 1,
            paymentMadeToSeller: 1,
            paymentReceivedFromBuyer: 1,
            payment_type: 1,
            brand_id: '$product.brand_id',
            brand_name: '$product.brand_name',
            category_id: '$product.category_id',
            category_name: '$product.category_name',
            model_id: '$product.model_id',
            model_name: '$product.model_name',
            varient_id: '$product.varient_id',
            varient_name: '$product.varient',
            seller_mobile_number: '$seller.mobileNumber',
            seller_id: '$seller._id',
            shipping_charge: 1,
            sourcePlatform: 1,
            status: 1,
            transaction_detail: 1,
            transaction_id: 1,
            transaction_status: 1,
            last_payout: {
              $ifNull: ['$payout', ''],
            },
          },
        },
        {
          $lookup: {
            from: 'brands',
            localField: 'brand_id',
            foreignField: '_id',
            as: 'brand',
          },
        },
        {
          $unwind: {
            path: '$brand',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category_id',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: {
            path: '$category',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'device_models',
            localField: 'model_id',
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
            localField: 'varient_id',
            foreignField: '_id',
            as: 'varient',
          },
        },
        {
          $unwind: {
            path: '$varient',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 1,
            buy_amount: 1,
            buy_type: 1,
            buyer_mobile_number: 1,
            buyer_name: 1,
            buyer_id: 1,
            commission: 1,
            created_at: 1,
            updated_at: 1,
            dispute: 1,
            grand_total: 1,
            id: 1,
            isReadyToPayout: '',
            order_number: 1,
            order_refund_status: 1,
            paymentMadeToSeller: 1,
            paymentReceivedFromBuyer: 1,
            payment_type: 1,
            brand_id: 1,
            brand_name: '$brand.brand_name',
            category_id: 1,
            category_name: '$category.category_name',
            model_id: 1,
            model_name: '$model.model_name',
            varient_id: 1,
            varient_name: '$varient.varient',
            seller_mobile_number: 1,
            seller_id: 1,
            shipping_charge: 1,
            sourcePlatform: 1,
            status: 1,
            transaction_detail: 1,
            transaction_id: 1,
            transaction_status: 1,
            last_payout: 1,
          },
        },
        {
          $skip: limit * (page - 1),
        },
        {
          $limit: limit,
        },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          },
        },
      ];
      orders = await OrderModel.aggregate(aggregate).exec();

      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: orders }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_LIST_ORDER,
          message: JSON.stringify(exception),
        },
      ];
    }
  }
  async updateRefundStatus(orderId: mongoose.Types.ObjectId, updateObj: any) {
    try {
      await OrderModel.findOneAndUpdate(
        { _id: orderId },
        { $set: { order_refund_status: updateObj } }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.ERROR_MAP.PRODUCT_UPDATED,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_PRODUCT,
          message: exception.message,
        },
      ];
    }
  }

  async findOrdersById(orderIds: string[]) {
    let ordersIdsArr = [];
    if (orderIds.length === 1) {
      ordersIdsArr.push(new mongoose.Types.ObjectId(orderIds[0]));
    } else {
      ordersIdsArr = orderIds;
    }
    const aggregate = [
      {
        $match: { _id: { $in: ordersIdsArr } },
      },
      {
        $lookup: {
          from: 'promocodes',
          let: {
            codeId: {
              $ifNull: [
                {
                  $toObjectId: '$promos.sellerPromocodeId',
                },
                '',
              ],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$codeId'],
                },
              },
            },
          ],
          as: 'sellerPromoCode',
        },
      },
      {
        $unwind: {
          path: '$sellerPromoCode',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
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
          from: 'users',
          localField: 'seller',
          foreignField: '_id',
          as: 'sellerObj',
        },
      },
      {
        $unwind: {
          path: '$sellerObj',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyer',
          foreignField: '_id',
          as: 'buyerObj',
        },
      },
      {
        $unwind: {
          path: '$buyerObj',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'Address',
          localField: 'buyer',
          foreignField: 'user_id',
          pipeline: [{ $sort: { created_date: 1 } }],
          as: 'buyerAddress',
        },
      },
      {
        $unwind: {
          path: '$buyerAddress',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'Address',
          localField: 'seller',
          foreignField: 'user_id',
          pipeline: [{ $sort: { created_date: 1 } }],
          as: 'sellerAddress',
        },
      },
      {
        $unwind: {
          path: '$sellerAddress',
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
      lookup('categories', 'product.category_id', '_id', 'category'),
      unwind('$category', true),
      lookup('brands', 'product.brand_id', '_id', 'brand'),
      unwind('$brand', true),
      {
        $project: {
          _id: 1,
          buy_amount: 1,
          buy_type: 1,
          buyer: 1,
          seller: 1,
          isReservation: 1,
          isFinancing: 1,
          billingSettings: 1,
          addOns: 1,
          buyer_mobile_number: '$buyerObj.mobileNumber',
          buyer_country_code: '$buyerObj.countryCode',
          buyer_city: '$buyerObj.address.city',
          buyer_postal_code: '$buyerObj.address.postal_code',
          buyer_street_address: '$buyerObj.address.address',
          buyer_name: '$buyerObj.name',
          buyer_acount_name: '$buyerObj.bankDetail.accountHolderName',
          buyer_bank_name: '$buyerObj.bankDetail.bankName',
          buyer_bank_bic: '$buyerObj.bankDetail.bankBIC',
          buyer_iban: '$buyerObj.bankDetail.accountId',
          buyer_secret_key: '$buyerObj.secretKey',
          buyer_email: '$buyerObj.email',
          buyerLatitude: '$buyerObj.address.latitude',
          buyerLongitude: '$buyerObj.address.longitude',
          grand_total: 1,
          vat: 1,
          commission: 1,
          shipping_charge: 1,
          buyerAddress: 1,
          sellerAddress: 1,
          id: '$_id',
          isReadyToPayout: '',
          order_number: 1,
          order_refund_status: 1,
          paymentMadeToSeller: 1,
          paymentReceivedFromBuyer: 1,
          payment_type: 1,
          seller_mobile_number: '$sellerObj.mobileNumber',
          is_key_seller: '$sellerObj.isKeySeller',
          is_merchant_seller: '$sellerObj.isMerchant',
          seller_country_code: '$sellerObj.countryCode',
          seller_city: '$sellerObj.address.city',
          seller_postal_code: '$sellerObj.address.postal_code',
          seller_street_address: '$sellerObj.address.address',
          seller_name: '$sellerObj.name',
          seller_acount_name: '$sellerObj.bankDetail.accountHolderName',
          seller_bank_name: '$sellerObj.bankDetail.bankName',
          seller_bank_bic: '$sellerObj.bankDetail.bankBIC',
          seller_iban: '$sellerObj.bankDetail.accountId',
          sellerPromoCode: '$sellerPromoCode.code',
          seller_secret_key: '$sellerObj.secretKey',
          seller_email: '$sellerObj.email',
          sellerLatitude: '$sellerObj.address.latitude',
          sellerLongitude: '$sellerObj.address.longitude',
          status: 1,
          transaction_id: 1,
          transaction_status: 1,
          sourcePlatform: 1,
          transaction_detail: 1,
          created_at: 1,
          last_payout: {
            $ifNull: ['$payout', ''],
          },
          product: 1,
          model_id: '$product.model_id',
          varient: '$product.varient',
          images: '$product.product_images',
          varient_ar: '$product.varient_ar',
          varient_id: '$product.varient_id',
          grade: '$product.grade',
          answer_to_questions_ar: '$product.answer_to_questions_ar_migration',
          promos: 1,
          seller_promo_code_id: '$promos.sellerPromocodeId',
          buyer_promo_code_id: '$promos.buyerPromocodeId',
          model_name: '$model.model_name',
          model_name_ar: '$model.model_name_ar',
          category_id: '$product.category_id',
          categoryName: '$category.category_name',
          brandName: '$brand.brand_name',
          productCondition: '$product.grade',
          productDescription: '$product.description',
          tags: '$sellerObj.tags',
          gtmClientId: 1,
          isUAE: '$sellerObj.sellerType.isUAE',
          gtmSessionId: 1,
          inventoryId: '$product.inventoryId',
          isConsignment: '$product.isConsignment',
        },
      },
      {
        $facet: {
          metadata: [
            {
              $count: 'total',
            },
          ],
          data: [
            {
              $skip: 0,
            },
          ],
        },
      },
    ];
    const queryResult = await OrderModel.aggregate(aggregate).exec();
    let result = queryResult[0].data;
    let sellerPromoIds: string[] = [];
    let buyerPromoIds: string[] = [];
    result.forEach((order: any) => {
      if (order.promos?.sellerPromocodeId) {
        sellerPromoIds = [...sellerPromoIds, order.promos?.sellerPromocodeId];
      }
      if (order.promos?.buyerPromocodeId) {
        buyerPromoIds = [...buyerPromoIds, order.promos?.buyerPromocodeId];
      }
    });

    const [buyerPromoCodeGrpcResponse, sellerPromoCodesGrpcResponse] =
      await Promise.all([
        getPromosByIds({ ids: buyerPromoIds }),
        getPromosByIds({ ids: sellerPromoIds }),
      ]);
    let buyerPromoMap: Record<string, DetailedPromoCode> = {};
    let sellerPromoMap: Record<string, DetailedPromoCode> = {};
    buyerPromoCodeGrpcResponse.promos?.forEach(promo => {
      buyerPromoMap = {
        ...buyerPromoMap,
        [promo.id]: promo,
      };
    });
    sellerPromoCodesGrpcResponse.promos?.forEach(promo => {
      sellerPromoMap = {
        ...sellerPromoMap,
        [promo.id]: promo,
      };
    });

    result = result.map((order: any) => {
      let updatedOrder = { ...order };
      const buyerPromoCodeId = order.promos?.buyerPromocodeId;
      const sellerPromoCodeId = order.promos?.sellerPromocodeId;

      if (buyerPromoCodeId) {
        updatedOrder = {
          ...updatedOrder,
          buyer_promo_code: buyerPromoMap[buyerPromoCodeId],
        };
      } else {
        updatedOrder = {
          ...updatedOrder,
          buyer_promo_code: null,
        };
      }

      if (sellerPromoCodeId) {
        updatedOrder = {
          ...updatedOrder,
          seller_promo_code: sellerPromoMap[sellerPromoCodeId],
        };
      } else {
        updatedOrder = {
          ...updatedOrder,
          seller_promo_code: null,
        };
      }
      return updatedOrder;
    });
    return result;
  }

  async getUserOrderAsBuyer(
    userId: string,
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<OrderDocument> | string;
        message?: string;
      }
    ]
  > {
    try {
      const filterObj = {
        buyer: mongoose.Types.ObjectId(userId),
        transaction_status: 'Success',
      };

      const options: any = {
        page: page,
        limit: size,
        sort: { created_at: -1 },
        populate: ['product', 'seller'],
      };
      const data = await OrderPaginatedModel.paginate(filterObj, options);

      return [
        false,
        {
          code: 200,
          result: {
            docs: data.docs as OrderDocument[],
            totalDocs: data.totalDocs as number,
            hasNextPage: data.hasNextPage as boolean,
          },
        },
      ];
    } catch (exception) {
      return [true, { code: 400, result: null, message: exception.toString() }];
    }
  }

  async getOrdersToGenerateInvoices() {
    const data = await OrderModel.find({
      $or: [
        { invoice_generated: TaskGeneratedStatus.PENDING },
        { invoice_generated: null },
      ],
      transaction_status: 'Success',
    })
      .sort({ created_at: 'asc' })
      .limit(10);

    if (!data) return null;
    return data;
  }

  async getUnMigratedCommissionOrders() {
    const data = await OrderModel.find({
      $or: [
        { commissionGenerated: TaskGeneratedStatus.PENDING },
        { commissionGenerated: null },
      ],
      beforeCommissionService: true,
      transaction_status: 'Success',
    })
      .populate({
        path: 'product',
      })
      .sort({ created_at: 'desc' })
      .limit(10);

    if (!data) return null;
    return data;
  }

  async updateOrderCommissionGeneration(
    orderId: string,
    status: TaskGeneratedStatus
  ) {
    try {
      await OrderModel.findOneAndUpdate(
        { _id: orderId },
        { $set: { commissionGenerated: status } }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
          message: exception.message,
        },
      ];
    }
  }
  async updateOrderInvoiceGeneration(
    orderId: string,
    status: TaskGeneratedStatus
  ) {
    try {
      await OrderModel.findOneAndUpdate(
        { _id: orderId },
        { $set: { invoice_generated: status } }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async createNewOrder(
    orderDocument: OrderDocument
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      const data = await OrderModel.create(orderDocument);
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_ORDER,
            message: 'Failed to create order',
          },
        ];
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,

          result: data,
          message: 'Order created successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_ORDER,
          message: exception.message,
        },
      ];
    }
  }
  async checkIfUserBuyProduct(
    productId: string,
    userId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: boolean;
        message?: string;
      }
    ]
  > {
    try {
      const data = await OrderModel.exists({
        product: mongoose.Types.ObjectId(productId),
        buyer: mongoose.Types.ObjectId(userId),
        transaction_status: 'Success',
      });
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: null,
          message: exception.toString(),
        },
      ];
    }
  }

  async updateOrderAfterPayment(
    paymentOrderUpdateDto: PaymentOrderUpdateDto
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: OrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const updateObj = {
        transaction_id: paymentOrderUpdateDto.transactionId,
        transaction_status: paymentOrderUpdateDto.status,
        paymentReceivedFromBuyer:
          paymentOrderUpdateDto.paymentReceivedFromBuyer,
        transaction_detail: JSON.stringify(paymentOrderUpdateDto.response),
      } as UpdateOrderAfterPayment;

      if (
        paymentOrderUpdateDto.sourcePlatform !== '' &&
        paymentOrderUpdateDto.sourcePlatform !== undefined
      ) {
        updateObj.sourcePlatform = paymentOrderUpdateDto.sourcePlatform;
      }

      if (paymentOrderUpdateDto.buyerAddress) {
        updateObj.buyer_address = paymentOrderUpdateDto.buyerAddress;
      }

      const data = await OrderModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(paymentOrderUpdateDto.orderId) },
        {
          $set: updateObj,
        },
        {
          new: true,
        }
      );
      if (!data)
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_ORDER,
            message: 'Failed to update order',
          },
        ];
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Order updated successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<OrderDocument> {
    return OrderModel.findOne({ order_number: orderNumber }).exec();
  }

  async getAllReservations(
    userId: string,
    page: number,
    size: number,
    orderId: string
  ): Promise<ReservationOrderDto[]> {
    if (!mongoose.isValidObjectId(userId)) {
      throw new Error(Constants.MESSAGE.INVALID_ID_FORMAT);
    }
    try {
      const aggregation = [
        {
          $match: {
            $and: [
              {
                $or: [
                  {
                    buyer: mongoose.Types.ObjectId(userId),
                    isReservation: true,
                    transaction_status: TransactionOrderStatus.SUCCESS,
                  },
                  {
                    buyer: mongoose.Types.ObjectId(userId),
                    isFinancing: true,
                    transaction_status: TransactionOrderStatus.SUCCESS,
                  },
                ],
              },
              orderId ? { _id: mongoose.Types.ObjectId(orderId) } : {},
            ].filter(Boolean),
          },
        },
        lookup('products', 'product', '_id', 'product'),
        unwind('$product', true),
        lookup('categories', 'product.category_id', '_id', 'category'),
        unwind('$category', true),
        lookup('users', 'seller', '_id', 'seller'),
        unwind('$seller', true),
        lookup('device_models', 'product.model_id', '_id', 'model'),
        unwind('$model', true),
        lookup('brands', 'product.brand_id', '_id', 'brand'),
        unwind('$brand', true),
        {
          $project: {
            _id: 0,
            order_id: '$_id',
            order_number: 1,
            seller_city: '$seller.address.city',
            seller_id: '$seller._id',
            seller_name: '$seller.name',
            seller_countryCode: '$seller.countryCode',
            seller_mobile: '$seller.mobileNumber',
            product_id: '$product._id',
            productImages: '$product.product_images',
            sellPrice: '$product.sell_price',
            modelId: '$product.model_id',
            variantId: '$product.varient_id',
            grade: '$product.grade',
            categoryId: '$product.category_id',
            product_sell_price: '$product.sell_price',
            modelName: '$model.model_name',
            modelNameAr: '$model.model_name_ar',
            brandName: '$brand.brand_name',
            brandNameAr: '$brand.brand_name_ar',
            categoryName: '$category.category_name',
            transaction_detail: 1,
            transaction_status: 1,
            buy_amount: 1,
            grand_total: 1,
            created_at: 1,
            updated_at: 1,
            isFinancing: 1,
            isReservation: 1,
            isFinancingEmailSent: 1,
          },
        },

        {
          $skip: +size * (+page - 1),
        },
        {
          $limit: +size,
        },
      ];

      return OrderModel.aggregate(aggregation).exec();
    } catch (exception) {
      return [];
    }
  }

  async getBoughtHistory(
    userId: string,
    page: number,
    size: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: BoughtHistory[];
        message?: string;
      }
    ]
  > {
    try {
      const aggregate = [
        {
          $match: {
            $and: [
              {
                $or: [
                  { transaction_status: 'Success' },
                  {
                    $and: [
                      { transaction_status: 'Pending' },
                      {
                        created_at: {
                          $gte: moment().subtract(10, 'minute').toDate(),
                        },
                      },
                    ],
                  },
                ],
              },
              {
                $or: [
                  {
                    isReservation: null,
                  },
                  {
                    isReservation: false,
                  },
                ],
              },
              {
                $or: [
                  {
                    isFinancing: null,
                  },
                  {
                    isFinancing: false,
                  },
                ],
              },
            ],
            buyer: new mongoose.Types.ObjectId(userId),
          },
        },
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
        lookup('products', 'product', '_id', 'product'),
        unwind('$product', false),
        lookup('device_models', 'product.model_id', '_id', 'model'),
        unwind('$model', false),
        {
          $project: {
            _id: 1,
            transaction_status: 1,
            order_number: 1,
            dispute: 1,
            buy_amount: 1,
            promos: 1,
            updated_at: 1,
            product: {
              _id: '$product._id',
              product_images: '$product.product_images',
              model_id: {
                _id: '$model._id',
                model_name: '$model.model_name',
                model_name_ar: '$model.model_name_ar',
              },
            },
          },
        },
      ];

      const data: BoughtHistory[] = await OrderModel.aggregate(aggregate);

      return [
        false,
        {
          code: 200,
          result: data,
          message: Constants.MESSAGE.GET_BOUGHT_HISTORY_SUCCESSFULLY,
        },
      ];
    } catch (exception) {
      return errorTemplate(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_MAP.FAILED_TO_GET_BOUGHT_HISTORY,
        exception.message
      );
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  async updateManyByIds<T extends object>(ids: string[], fields: T) {
    return await OrderModel.updateMany(
      { _id: { $in: ids } },
      {
        $set: fields,
      }
    );
  }

  async getRecentlySoldProducts(
    hours: number,
    limit: number,
    offset: number,
    categoryId: string = '',
    getSpecificCategory: boolean = false
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
    const recentlySoldProductsId = await OrderModel.find(
      {
        transaction_status: 'Success',
        created_at: { $gt: moment().subtract(hours, 'hours').toDate() },
      },
      { product: 1 }
    ).sort({ created_at: -1 });
    const productIds = (recentlySoldProductsId || []).map(
      (elem: any) => elem.product
    );
    if (!productIds?.length) {
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: [],
        },
      ];
    }
    const categoryObjectId = categoryId
      ? new mongoose.Types.ObjectId(categoryId)
      : null;
    const data = await ProductModel.aggregate([
      getSpecificCategory === false
        ? categoryId === ''
          ? {
              $match: {
                _id: { $in: productIds },
                condition_id: { $ne: null },
              },
            }
          : {
              $match: {
                _id: { $in: productIds },
                condition_id: { $ne: null },
                category_id: { $ne: categoryObjectId },
              },
            }
        : {
            $match: {
              _id: { $in: productIds },
              condition_id: { $ne: null },
              category_id: { $eq: categoryObjectId },
            },
          },
      lookup('varients', 'varient_id', '_id', 'varientData'),
      unwind('$varientData', false),
      lookup('device_models', 'model_id', '_id', 'device_model'),
      unwind('$device_model', false),
      lookup('orders', '_id', 'product', 'orderData'),
      unwind('$orderData', true),
      lookup('categories', 'category_id', '_id', 'category'),
      unwind('$category', true),
      {
        $group: {
          _id: '$_id',
          varientId: { $first: '$varient_id' },
          modelId: { $first: '$model_id' },
          isConsignment: { $first: '$isConsignment' },
          categoryId: { $first: '$category_id' },
          conditionId: { $first: '$condition_id' },
          grade: { $first: '$grade' },
          arGrade: { $first: '$grade_ar' },
          sellDate: { $first: '$orderData.created_at' },
          modelName: { $first: '$device_model.model_name' },
          arModelName: { $first: '$device_model.model_name_ar' },
          sellPrice: { $first: '$sell_price' },
          grandTotal: { $first: '$orderData.grand_total' },
          vat: { $first: '$orderData.vat' },
          buyAmount: { $first: '$orderData.buy_amount' },
          shippingCharge: { $first: '$orderData.shipping_charge' },
          sellStatus: { $first: '$sell_status' },
          createdDate: { $first: '$createdDate' },
          productImages: { $first: '$product_images' },
          variantName: { $first: '$varientData.varient' },
          arVariantName: { $first: '$varientData.varient_ar' },
          originalPrice: { $first: '$varientData.current_price' },
          tags: { $first: '$seller.tags' },
          conditions: { $first: '$conditionData' },
          listingQuantity: { $first: '$listingQuantity' },
          isMerchant: { $first: '$seller.isMerchant' },
          modelImage: { $first: '$device_model.model_icon' },
          billingSettings: { $first: '$billingSettings' },
          isBiddingProduct: { $first: '$isBiddingProduct' },
          category: { $first: '$category' },
          sellerId: { $first: '$user_id' },
        },
      },
      {
        $group: {
          _id: '$categoryId',
          products: { $push: '$$ROOT' },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $sort: { 'products.sellDate': -1 },
      },
      {
        $group: {
          _id: '$_id',
          products: { $push: '$products' },
        },
      },
      {
        $project: {
          products: { $slice: ['$products', 3] },
        },
      },
      {
        $unwind: '$products',
      },
      {
        $replaceRoot: { newRoot: '$products' },
      },
      {
        $sort: { sellDate: -1 },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);
    return [
      false,
      {
        code: Constants.SUCCESS_CODE.SUCCESS,
        result: data,
      },
    ];
  }
  async getTopSellingProductModels(
    userId: string,
    range: string,
    sorting: string = 'desc',
    page: number = 1,
    size: number = 5
  ): Promise<{
    products: TopSellingProductDto[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    try {
      const { startDate, endDate } = getDataRangeAnalytics(range);
      const sortDirection = sorting.toLowerCase() === 'asc' ? 1 : -1;
      const skip = (page - 1) * size;
      const matchCondition = {
        created_at: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        seller: mongoose.Types.ObjectId(userId),
        transaction_status: 'Success',
      };
      const aggregation = [
        {
          $match: matchCondition,
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        {
          $unwind: {
            path: '$productInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$productInfo.model_id',
            totalSales: { $sum: 1 },
            totalAmount: { $sum: '$grand_total' },
            varient: { $first: '$productInfo.varient' },
            varientAR: { $first: '$productInfo.varient_ar' },
          },
        },
        {
          $sort: {
            totalSales: sortDirection,
            totalAmount: sortDirection,
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: size,
        },
        {
          $lookup: {
            from: 'device_models',
            localField: '_id',
            foreignField: '_id',
            as: 'modelInfo',
          },
        },
        {
          $unwind: {
            path: '$modelInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            modelName: '$modelInfo.model_name',
            modelNameAR: '$modelInfo.model_name_ar',
            modelIcon: '$modelInfo.model_icon',
            varient: 1,
            varientAR: 1,
            totalSales: 1,
            totalAmount: 1,
          },
        },
      ];
      const products = await OrderModel.aggregate(aggregation).exec();
      const totalItems = await OrderModel.aggregate([
        { $match: matchCondition },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        { $unwind: '$productInfo' },
        { $group: { _id: '$productInfo.model_id' } },
        { $count: 'count' },
      ]).then(result => result[0]?.count ?? 0);
      const totalPages = Math.ceil(totalItems / size);
      return {
        products,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: size,
      };
    } catch (exception) {
      console.log('🚀 ~ getTopSellingProductModels :', exception);
      return {
        products: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        pageSize: 5,
      };
    }
  }

  async getUserOrderWithPromo(
    promoId: string,
    userId: string
  ): Promise<OrderDocument> {
    const order = await OrderModel.findOne({
      buyer: mongoose.Types.ObjectId(userId),
      'promos.buyerPromocodeId': promoId,
      transaction_status: 'Success',
    });
    return order;
  }
  async getRecentlyBoughtProducts(userId: string): Promise<OrderDocument[]> {
    const orders = await OrderModel.find({
      created_at: {
        $gte: moment().subtract(10, 'minutes').toDate(),
      },
      transaction_status: { $ne: 'Fail' },
      buyer: new mongoose.Types.ObjectId(userId),
      $and: [
        {
          $or: [{ isReservation: null }, { isReservation: false }],
        },
        {
          $or: [{ isFinancing: null }, { isFinancing: false }],
        },
      ],
    }).exec();

    let result: OrderDocument[] = [];
    for (let i = 0; i < orders.length; i++) {
      if (!(await DeltaMachineOrder.exists({ orderId: orders[i]._id }))) {
        result = [...result, orders[i]];
      }
    }
    return result;
  }

  async updateOrderAttribute(
    orderId: string
  ): Promise<
    [boolean, { code: number; result: any | string; message?: string }]
  > {
    try {
      await OrderModel.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(orderId) },
        { $set: { isFinancingEmailSent: true } }
      ).exec();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Update attribute of order successfully',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER,
          message: exception.message,
        },
      ];
    }
  }

  async getRecentlyBoughtProductsCount(userId: string): Promise<number> {
    return (await this.getRecentlyBoughtProducts(userId)).length;
  }

  async getCountOfMerchantOrders(
    startDate: Date,
    minCount: number
  ): Promise<MerchantSoldCounts[]> {
    try {
      const aggregation = [
        {
          $match: {
            created_at: {
              $gt: startDate,
            },
            transaction_status: 'Success',
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'productData',
          },
        },
        {
          $match: {
            'productData.listingGroupId': {
              $ne: null,
            } as any,
          },
        },
        {
          $group: {
            _id: '$productData.listingGroupId',
            count: { $sum: 1 },
          },
        },
        { $match: { count: { $gte: minCount } } },
        {
          $unwind: {
            path: '$_id',
            preserveNullAndEmptyArrays: false,
          },
        },
      ];
      const result = await OrderModel.aggregate(aggregation).exec();
      return (result || []).map((elem: any) => {
        return {
          id: elem._id.toString(),
          count: elem.count,
        } as MerchantSoldCounts;
      });
    } catch (error) {
      return [];
    }
  }
}
export class MerchantSoldCounts {
  id: string;
  count: number;
}
