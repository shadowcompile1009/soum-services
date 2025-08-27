import _isEmpty from 'lodash/isEmpty';
import mongoose, { ClientSession, Types } from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ListDmoDto } from '../dto/dmo/DmoDto';
import { PenalizedOrder } from '../dto/order/PayoutSellerOrderDto';
import { PaginationDto } from '../dto/paginationDto';
import { DeltaMachineStatusName } from '../enums/DeltaMachineStatusName';
import { DeltaMachineStatusSubmodule } from '../enums/DeltaMachineStatusSubmodule';
import { UserStatus } from '../enums/UserStatus';
import { mappingMongoError } from '../libs/mongoError';
import { getCache, setCache } from '../libs/redis';
import {
  DeltaMachineOrder,
  DeltaMachineOrderDocument,
  OrdersListResponse,
} from '../models/DeltaMachineOrder';
import {
  CourierAutomationSettingInputType,
  DeltaMachineSettingDocument,
  DeltaMachineSettingInput,
  OMStatusAutomationSettingInputType,
  PickupServiceSettingSubmoduleInputType,
  SettingDMO,
  WhatsappAutomationSettingSubmoduleInputType,
} from '../models/DeltaMachineSetting';
import {
  DeltaMachineStatus,
  DeltaMachineStatusDocument,
} from '../models/DeltaMachineStatus';
import {
  DeltaMachineNewUserInput,
  DeltaMachineUser,
  DeltaMachineUserDocument,
  UserListResponse,
} from '../models/DeltaMachineUsers';
import {
  DmoNCTReasons,
  DmoNCTReasonsDocument,
  DmoNCTReasonsDto,
} from '../models/DmoNCTReasons';
import {
  DmoPayoutRefundHistory,
  DmoPayoutRefundHistoryDocument,
} from '../models/DmoPayoutRefundHistory';
import { NCTReasons, NCTReasonsDocument } from '../models/NCTReasons';
import { OrderModel } from '../models/Order';
import { PaymentProviderType } from '../models/Payment';
import { getDataRangeAnalytics } from '../util/common';
import { lookup, unwind } from '../util/queryHelper';
import { BaseRepository } from './BaseRepository';
interface MatchConditionDMO {
  orderId?: mongoose.Types.ObjectId;
  paymentType?: Record<string, Array<unknown>>;
  statusId?: Record<string, Array<unknown>>;
  serviceId?: Record<string, Array<unknown>>;
  [index: string]: any;
}
interface MatchNCTReasonCondition {
  displayName?: string;
}
export interface SellerDMOrder {
  id: string;
  orderId: string;
  statusId: string;
  createdAt: Date;
  updatedAt: Date;
  confirmationDeadline: Date;
  orderData: any;
  listingNumber: string;
}

@Service()
export class DeltaMachineRepository implements BaseRepository {
  async getList({
    offset,
    limit,
    submodule,
    searchOption,
    statuses,
    services,
  }: ListDmoDto): Promise<
    [
      boolean,
      {
        code: number;
        result: OrdersListResponse | string;
        message?: string;
      }
    ]
  > {
    try {
      let matchCondition: MatchConditionDMO = {};
      let statusIds = [];
      if (statuses?.length > 0) {
        statusIds = statuses;
        matchCondition = { statusId: { $in: statuses } };
        if (
          submodule === DeltaMachineStatusSubmodule.SHIPPING &&
          services.length > 0
        ) {
          matchCondition.serviceId = { $in: services };
        }
      } else {
        if (submodule === DeltaMachineStatusSubmodule.PAYOUT) {
          const ssBysubmodule = await DeltaMachineStatus.find({
            submodule: {
              $in: [
                DeltaMachineStatusSubmodule.PAYOUT,
                DeltaMachineStatusSubmodule.ACTIVE,
              ],
            },
          }).exec();
          statusIds = ssBysubmodule.map(s => s.id);
        } else {
          const ssBysubmodule = await DeltaMachineStatus.find({
            submodule: submodule,
          }).exec();
          statusIds = ssBysubmodule.map(s => s.id);
        }

        if (statusIds?.length) {
          matchCondition = { statusId: { $in: statusIds } };
        }
        if (submodule === DeltaMachineStatusSubmodule.BNPL) {
          statusIds = statuses;
          const paymentProviderTypes: string[] = [
            PaymentProviderType.Tabby,
            PaymentProviderType.TAMARA,
            PaymentProviderType.MADFU,
            PaymentProviderType.EMKAN,
          ];
          matchCondition = {
            statusId: { $in: statusIds },
            paymentType: { $in: paymentProviderTypes },
          };
        }
        if (submodule === DeltaMachineStatusSubmodule.SHIPPING) {
          statusIds = statuses;
          matchCondition = {
            statusId: { $in: statusIds },
          };
          if (services.length > 0) {
            matchCondition.serviceId = { $in: services };
          }
        }
      }
      if (searchOption) {
        matchCondition = { ...matchCondition, ...searchOption };
      }
      if (submodule === DeltaMachineStatusSubmodule.RESERVATION) {
        matchCondition = { ...matchCondition, 'orderData.isReservation': true };
      }
      if (submodule === DeltaMachineStatusSubmodule.FINANCE) {
        const reservationCondition = {
          $or: [
            {
              'orderData.isReservation': true,
            },
            {
              'orderData.isFinancing': true,
            },
          ],
        };
        matchCondition = { ...matchCondition, ...reservationCondition };
      }
      let queryDMOFunc = DeltaMachineOrder.find(matchCondition as any)
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 });

      if (searchOption && searchOption?.order_number) {
        const order = await OrderModel.findOne(searchOption).exec();
        if (order) {
          delete matchCondition.order_number;
          matchCondition.orderId = order._id;
          queryDMOFunc = DeltaMachineOrder.find(matchCondition as any).sort({
            createdAt: -1,
          });
        }
      }

      const data = await queryDMOFunc.exec();
      const total = await DeltaMachineOrder.countDocuments(
        matchCondition as any
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            total,
            limit,
            offset,
            data,
          },
        },
      ];
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getListForMissingOrderData(limit: number = 100): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const orders = await DeltaMachineOrder.find({
        'orderData.productNameAr': { $eq: null },
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: orders,
        },
      ];
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

  async getListByOrderIds(orderIds: string[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await DeltaMachineOrder.find({ orderId: { $in: orderIds } })
        .sort({ createdAt: -1 })
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
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
  async getDMOrdersByUserId(
    userId: string,
    submodule: string,
    limit: number = 0,
    skip: number = 0,
    statusIds: string[] = []
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      let orders;
      if (limit > 0) {
        if (submodule === 'in-progress') {
          orders = await DeltaMachineOrder.find({
            'orderData.sellerId': new mongoose.Types.ObjectId(userId),
            statusId: { $nin: statusIds },
          })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
        } else {
          orders = await DeltaMachineOrder.find({
            'orderData.sellerId': new mongoose.Types.ObjectId(userId),
            statusId: { $in: statusIds },
          })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .exec();
        }
      } else {
        orders = await DeltaMachineOrder.find({
          'orderData.sellerId': new mongoose.Types.ObjectId(userId),
        })
          .sort({ createdAt: -1 })
          .exec();
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: orders,
        },
      ];
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

  async getDMOrdersByBuyerId(buyerId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const orders = await DeltaMachineOrder.find({
        'orderData.buyerId': new mongoose.Types.ObjectId(buyerId),
      })
        .sort({ createdAt: -1 })
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: orders,
        },
      ];
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
  async getDMOrdersOfSeller(sellerId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: SellerDMOrder[] | string;
        message?: string;
      }
    ]
  > {
    try {
      // Need to rely on order data seller to get the orders. Assume that every order has DM order,
      const aggregate = [
        {
          $match: {
            'orderData.sellerId': new mongoose.Types.ObjectId(sellerId),
          },
        },
        {
          $lookup: {
            from: 'products',
            let: {
              prodId: {
                $toObjectId: '$orderData.productId',
              },
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$_id', '$$prodId'],
                  },
                },
              },
            ],
            as: 'product',
          },
        },
        unwind('$product', true),
        {
          $project: {
            _id: 1,
            orderId: 1,
            statusId: 1,
            createdAt: 1,
            updatedAt: 1,
            confirmationDeadline: 1,
            orderData: 1,
            listingNumber: '$product.code',
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ];
      const aggResult = await DeltaMachineOrder.aggregate(aggregate).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: aggResult,
        },
      ];
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

  async getOrdersByStatus(
    statuses: string[],
    isPickUpOrder: boolean = false,
    isKeySeller?: boolean
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 14);
      let msgs;

      if (isKeySeller) {
        const statusesObjectID = statuses.map(
          (status: string) => new mongoose.Types.ObjectId(status)
        );
        const aggregate: Array<Record<string, any>> = [
          {
            $match: {
              statusId: { $in: statusesObjectID },
            },
          },
          lookup('users', 'orderData.sellerId', '_id', 'user'),
          unwind('$user', false),
          {
            $match: {
              'user.isKeySeller': true,
            },
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $limit: 2,
          },
          {
            $project: {
              _id: 1,
              orderId: 1,
              userId: '$orderData.sellerId',
              userName: '$orderData.sellerName',
            },
          },
        ];

        const data = await DeltaMachineOrder.aggregate(aggregate);

        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
          },
        ];
      }

      if (isPickUpOrder) {
        msgs = await DeltaMachineOrder.find({
          statusId: { $in: statuses },
          pickUpTrackingNumber: { $ne: null },
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }).exec();
      } else {
        msgs = await DeltaMachineOrder.find({
          statusId: { $in: statuses },
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        }).exec();
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getOrdersBySellerId(sellerId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await DeltaMachineOrder.find({
        'orderData.sellerId': Types.ObjectId(sellerId),
      }).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getOrderByTrackingNo(
    trackingNumber: string,
    reverse: boolean
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      let data = null;
      if (reverse) {
        data = await DeltaMachineOrder.findOne({
          reverseSMSATrackingNumber: trackingNumber,
        }).exec();
      } else {
        data = await DeltaMachineOrder.findOne({
          trackingNumber,
        }).exec();
      }
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getDMOrderByLastMileTrackingNo(lastMileTrackingNumber: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineOrder.findOne({
        lastMileTrackingNumber,
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getStatusList(submodule: string = ''): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineStatusDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      let queryDMStatus = DeltaMachineStatus.find().sort({ sequence: 1 });
      if (submodule.length > 0) {
        queryDMStatus = DeltaMachineStatus.find({ submodule: submodule }).sort({
          sequence: 1,
        });
      }
      const data = await queryDMStatus.exec();
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getStatusListByName(statusNames: DeltaMachineStatusName[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineStatusDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const queryDMStatus = DeltaMachineStatus.find({
        name: { $in: statusNames },
      });
      const data = await queryDMStatus.exec();
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async listPayoutRefundHistory(orderId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DmoPayoutRefundHistoryDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DmoPayoutRefundHistory.find({ orderId })
        .sort({ createdAt: -1 })
        .exec();
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getStatusByName(name: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineStatusDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineStatus.findOne({ name }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: 'Status not found',
            message: 'Status not found',
          },
        ];
      } else {
        return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
      }
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          message: exception.message,
        },
      ];
    }
  }

  async getById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineOrder.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
            message: Constants.MESSAGE.FAILED_TO_GET_ORDER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async updateByTrackingId(
    trackingId: string,
    statusId: string,
    reverse: boolean = false
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      let query: any = { trackingNumber: trackingId };
      if (reverse) {
        query = { reverseSMSATrackingNumber: trackingId };
      }
      const data = await DeltaMachineOrder.findOneAndUpdate(query, {
        statusId,
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async updateByLastMileTrackingId(
    trackingId: string,
    statusId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const query: any = { lastMileTrackingNumber: trackingId };
      const data = await DeltaMachineOrder.findOneAndUpdate(query, {
        statusId,
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async updateByBeOneTrackingId(
    pickUpTrackingNumber: string,
    statusId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineOrder.findOneAndUpdate(
        { pickUpTrackingNumber },
        {
          $set: {
            statusId,
          },
        }
      ).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getByOrderId(
    orderId: string,
    throwIfNull: boolean = true
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineOrder.findOne({ orderId }).exec();
      if (!data && throwIfNull) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getDMOrderByOrderNumber(orderNumber: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineOrder.findOne({
        'orderData.orderNumber': orderNumber,
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getDmoById(
    orderId: string,
    dmoId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineOrder.findOne({
        $or: [{ orderId: orderId }, { orderId: dmoId }],
      }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async getStatusById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineStatusDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineStatus.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: 'Status not found',
            message: 'Status not found',
          },
        ];
      } else {
        return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
      }
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          message: exception.message,
        },
      ];
    }
  }

  async create(deltaMachineOrder: DeltaMachineOrderDocument) {
    const createdDeltaMachineOrder = new DeltaMachineOrder(deltaMachineOrder);
    return createdDeltaMachineOrder.save();
  }
  async update(
    condition: any,
    data: any
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
      const doc = await DeltaMachineOrder.findOneAndUpdate(
        condition,
        {
          $set: data,
        },
        {
          new: true,
        }
      ).exec();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: doc.toObject() },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async updateUserRole(
    userId: string,
    roleId: string
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
      const doc = await DeltaMachineUser.findOneAndUpdate(
        { _id: userId },
        {
          roleId,
        }
      ).exec();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: doc.toObject() },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async updateUserGroup(
    userId: string,
    groupId: string
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
      const doc = await DeltaMachineUser.findOneAndUpdate(
        { _id: userId },
        {
          groupId,
        }
      ).exec();
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: doc.toObject() },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          message: exception.message,
        },
      ];
    }
  }

  async delete(
    id: string
  ): Promise<
    [boolean, { code: number; result: string | string; message?: string }]
  > {
    try {
      await DeltaMachineOrder.findByIdAndDelete(id).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'DMO is removed successfully',
        },
      ];
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
            result: Constants.ERROR_MAP.FAILED_TO_DELETE_DMO,
            message: exception.message,
          },
        ];
      }
    }
  }
  async createDmoStatuses(statues: DeltaMachineStatusDocument[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineStatusDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const existingStatuses = await DeltaMachineStatus.find({
        name: { $in: statues.map(item => item.name) },
      });
      const statusesMap = new Map();
      statues.forEach(item => {
        statusesMap.set(item.name, item);
      });

      const existingStatusesMap = new Map();
      existingStatuses.forEach(item => {
        existingStatusesMap.set(item.name, item);
      });
      const newStatuses = statues.filter(
        item => !existingStatusesMap.has(item.name)
      );
      const items = await DeltaMachineStatus.insertMany(newStatuses);
      let updatedStatuses = statues.filter(item =>
        existingStatusesMap.has(item.name)
      );
      updatedStatuses = await Promise.all(
        updatedStatuses.map(item => {
          return DeltaMachineStatus.findOneAndUpdate(
            { name: item.name },
            statusesMap.get(item.name),
            {
              new: true,
            }
          ).exec();
        })
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: [...updatedStatuses, ...items],
        },
      ];
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async deleteDmoStatus(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: boolean | string;
        message?: string;
      }
    ]
  > {
    try {
      await DeltaMachineStatus.deleteOne({ _id: id });
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: true }];
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getNCTReasonList(): Promise<
    [
      boolean,
      {
        code: number;
        result: NCTReasonsDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await NCTReasons.find().sort({ sequence: 1 }).exec();
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
            result: Constants.ERROR_MAP.FAILED_TO_GET_LIST_NCT_REASONS,
            message: exception.message,
          },
        ];
      }
    }
  }
  async createNCTReasons(nctReasons: NCTReasonsDocument[]): Promise<
    [
      boolean,
      {
        code: number;
        result: NCTReasonsDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const existingNCTReasons = await NCTReasons.find({
        name: { $in: nctReasons.map(item => item.name) },
      });
      const nctReasonsMap = new Map();
      nctReasons.forEach(item => {
        nctReasonsMap.set(item.name, item);
      });

      const existingNCTReasonsMap = new Map();
      existingNCTReasons.forEach(item => {
        existingNCTReasonsMap.set(item.name, item);
      });
      const newNCTReasons = nctReasons.filter(
        item => !existingNCTReasonsMap.has(item.name)
      );
      const items = await NCTReasons.insertMany(newNCTReasons);
      let updatedNCTReasons = nctReasons.filter(item =>
        existingNCTReasonsMap.has(item.name)
      );
      updatedNCTReasons = await Promise.all(
        updatedNCTReasons.map(item => {
          return NCTReasons.findOneAndUpdate(
            { name: item.name },
            nctReasonsMap.get(item.name),
            {
              new: true,
            }
          ).exec();
        })
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: [...updatedNCTReasons, ...items],
        },
      ];
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
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_NCT_REASONS_MANUALLY,
            message: exception.message,
          },
        ];
      }
    }
  }

  async deleteNCTReason(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: boolean | string;
        message?: string;
      }
    ]
  > {
    try {
      await NCTReasons.deleteOne({ _id: id });
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: true }];
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
            result: Constants.ERROR_MAP.FAILED_TO_DELETE_NCT_REASON_BY_ID,
            message: exception.message,
          },
        ];
      }
    }
  }

  async createDmoNCTReason(
    nctReason: DmoNCTReasonsDto,
    userId: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DmoNCTReasonsDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      nctReason.userId = userId;
      const dmoNCTReason = await DmoNCTReasons.create(nctReason);
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: dmoNCTReason,
        },
      ];
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
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_NCT_REASONS_MANUALLY,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getListDmoByOrderIds(orderIds: any[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await DeltaMachineOrder.find({ orderId: { $in: orderIds } })
        .sort({ createdAt: -1 })
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
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

  async getListDmoNCTReasonsByDmoIds(dmoIds: any[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DmoNCTReasonsDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await DmoNCTReasons.find({
        dmoId: { $in: dmoIds },
      })
        .sort({ createdAt: -1 })
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_LIST_NCT_REASONS,
          message: exception.message,
        },
      ];
    }
  }

  async getSpecificNCTReasons(condition: MatchNCTReasonCondition): Promise<
    [
      boolean,
      {
        code: number;
        result: NCTReasonsDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await NCTReasons.findOne(condition).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_NCT_REASON,
          message: exception.message,
        },
      ];
    }
  }

  async createNewDmoNCTReasons(nctReasons: DmoNCTReasonsDocument[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DmoNCTReasonsDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const dmoNCTReasons = await DmoNCTReasons.insertMany(nctReasons);
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: dmoNCTReasons,
        },
      ];
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
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_NCT_REASONS_MANUALLY,
            message: exception.message,
          },
        ];
      }
    }
  }
  async updateDmoNCTReason(
    condition: any,
    data: any
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
      const doc = await DmoNCTReasons.findOneAndUpdate(
        condition,
        {
          $set: data,
        },
        {
          new: true,
          upsert: true,
          sort: {
            updatedAt: -1,
          },
        }
      ).exec();

      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: doc.toObject() },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO_NCT_REASONS,
          message: exception.message,
        },
      ];
    }
  }

  async getDmoNCTReasonByOrderId(orderId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DmoNCTReasonsDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const msgs = await DmoNCTReasons.findOne({
        $or: [{ orderId: orderId }, { dmoId: orderId }],
      })
        .sort({ createdAt: -1 })
        .exec();
      if (!msgs) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_NCT_REASON_BY_ORDER_ID,
            message: 'None of DMO NCT reason created with the order id',
          },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: msgs,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_NCT_REASON_BY_ORDER_ID,
          message: exception.message,
        },
      ];
    }
  }
  async addNewUser(userInput: DeltaMachineNewUserInput): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineUserDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      let condition: any = { username: userInput.username };
      if ((userInput.email || '').length > 0) {
        condition = {
          $or: [{ email: userInput.email }, { username: userInput.username }],
        };
      }
      const existingUsername = await DeltaMachineUser.findOne(condition).exec();
      if (existingUsername) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USERNAME_EXISTS,
            message: 'Username or email already exists',
          },
        ];
      }
      const newUser = new DeltaMachineUser();
      newUser.username = userInput.username;
      newUser.phoneNumber = userInput.phoneNumber;
      newUser.email = userInput.email;
      newUser.password = userInput.password;
      newUser.createdBy = userInput.createdBy;
      newUser.roleId = userInput.roleId;
      newUser.groupId = userInput.groupId;
      let data: any = await newUser.save();
      data = data.toObject();
      delete data.password;
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Create new user successfully',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USERNAME_EXISTS,
            message: exception.message,
          },
        ];
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_ADD_USER,
          message: exception.message,
        },
      ];
    }
  }

  async getUserById(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineUserDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineUser.findById(userId);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
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
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }

  async getUserByNumber(phoneNumber: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineUserDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineUser.findOne({ phoneNumber });

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
        },
      ];
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
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }

  async getUserByIds(userIds: string[]) {
    try {
      const data = await DeltaMachineUser.find({ _id: { $in: userIds } });

      if (data) {
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: data,
            message: '',
          },
        ];
      }

      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: '',
        },
      ];
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
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }
  async getUsers(
    offset: number,
    limit: number
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: UserListResponse | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineUser.find({
        status: {
          $ne: UserStatus.DELETE,
        },
      })
        .select(
          'firstName lastName username email phoneNumber userType createdBy roleId role'
        )
        .skip(offset)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();
      const total = await DeltaMachineUser.countDocuments().exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            total,
            limit,
            offset,
            data,
          },
        },
      ];
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
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }
  updateValueWithOptions = (possibleValues: any) => {
    const value: string[] = [];
    if (!_isEmpty(possibleValues)) {
      possibleValues.forEach((element: any) => {
        if (element.isSelected) {
          value.push(element.option);
        }
      });
    }
    return value.join(',');
  };
  async updateTogglePickupServiceSetting(
    updatedInput: PickupServiceSettingSubmoduleInputType
  ) {
    try {
      const data = await SettingDMO.findOne({
        name: 'setting_pickup_service_offering',
      }).exec();
      if (!data) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      data.value = JSON.stringify(updatedInput);
      const updatedSetting = await data.save();
      return [false, updatedSetting];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async addSetting(
    obj: DeltaMachineSettingInput,
    session?: ClientSession
  ): Promise<[boolean, DeltaMachineSettingDocument | string]> {
    try {
      const newSetting: DeltaMachineSettingDocument = new SettingDMO();
      newSetting.name = obj.name;
      newSetting.description = obj.description;
      newSetting.type = obj.type;
      newSetting.setting_category = obj.setting_category.toString();
      newSetting.possible_values = obj.possible_values;
      newSetting.value =
        this.updateValueWithOptions(newSetting.possible_values) || obj.value;
      newSetting.status = obj.status;
      const data = await newSetting.save(session ? { session: session } : null);
      return [false, data];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [true, mappingErrorCode];
      } else {
        return [true, exception.message];
      }
    }
  }
  async updateOMStatusAutomationSubmoduleSetting(
    updatedInput: OMStatusAutomationSettingInputType
  ) {
    try {
      const data = await SettingDMO.findOne({
        name: 'setting_om_status_automation',
      }).exec();
      if (!data) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      data.value = JSON.stringify(updatedInput);
      const updatedSetting = await data.save();
      return [false, updatedSetting];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async getSettingByKey(settingKey: string) {
    try {
      const setting = await SettingDMO.findOne({ name: settingKey }).exec();
      if (!setting) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      return [false, setting];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async updateWhatsappAutomationSubmoduleSetting(
    updatedInput: WhatsappAutomationSettingSubmoduleInputType
  ) {
    try {
      const data = await SettingDMO.findOne({
        name: 'setting_wa_automation_dmo_phase_1',
      }).exec();
      if (!data) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      data.value = JSON.stringify(updatedInput);
      const updatedSetting = await data.save();
      return [false, updatedSetting];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async deleteUser(
    userId: string,
    deletedBy: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineUserDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const deletedDMUser = await DeltaMachineUser.findByIdAndUpdate(
        userId,
        {
          status: UserStatus.DELETE,
          deletedBy: deletedBy,
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          new: true,
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: deletedDMUser,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
          message: exception.message,
        },
      ];
    }
  }

  async updateCourierAutomationSubmoduleSetting(
    updatedInput: CourierAutomationSettingInputType
  ) {
    try {
      const data = await SettingDMO.findOne({
        name: 'setting_courier_automation',
      }).exec();
      if (!data) {
        return [true, Constants.MESSAGE.SETTING_NOT_FOUND];
      }
      data.value = JSON.stringify(updatedInput);
      const updatedSetting = await data.save();
      return [false, updatedSetting];
    } catch (exception) {
      return [true, exception.message];
    }
  }
  async getPendingPayoutAnalytics(sellerId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const payoutStatusName = new Set([
        DeltaMachineStatusName.PAYOUT_TO_SELLER,
      ]);

      const statuses = await DeltaMachineStatus.find()
        .sort({ sequence: 1 })
        .exec();

      const payoutStatus = (statuses as DeltaMachineStatusDocument[]).filter(
        status =>
          payoutStatusName.has(status.toObject().name as DeltaMachineStatusName)
      );
      const statusIds: mongoose.Types.ObjectId[] = payoutStatus.map(
        (status: any) => status._id
      );

      const aggregationPipeline: any[] = [
        {
          $match: {
            'orderData.sellerId': new mongoose.Types.ObjectId(sellerId),
            statusId: { $in: statusIds },
          },
        },
        {
          $group: {
            _id: {
              sellerId: '$orderData.sellerId',
              statusId: '$statusId',
            },
            totalAmount: {
              $sum: '$orderData.payoutAmount',
            },
          },
        },
      ];
      const result = await DeltaMachineOrder.aggregate(
        aggregationPipeline
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result,
        },
      ];
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

  async getPendingPayoutPagination(
    sellerId: string,
    page: number = 1,
    pageSize: number = 5,
    searchTerm: string = ''
  ): Promise<{
    data: DeltaMachineOrderDocument[] | string;
    message?: string;
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }> {
    try {
      const payoutStatusName = new Set([
        DeltaMachineStatusName.PAYOUT_TO_SELLER,
      ]);

      // Fetch the statuses that we want to filter by
      const statuses = await DeltaMachineStatus.find()
        .sort({ sequence: 1 })
        .exec();
      const payoutStatus = (statuses as DeltaMachineStatusDocument[]).filter(
        status =>
          payoutStatusName.has(status.toObject().name as DeltaMachineStatusName)
      );

      const statusIds: mongoose.Types.ObjectId[] = payoutStatus.map(
        (status: any) => status._id
      );

      // Match conditions
      const matchConditions: any = {
        'orderData.sellerId': new mongoose.Types.ObjectId(sellerId),
        statusId: { $in: statusIds },
      };

      // Apply search term if provided
      if (searchTerm) {
        matchConditions['orderData.productName'] = {
          $regex: searchTerm,
          $options: 'i',
        };
      }

      // Count total items matching the conditions
      const totalItems = await DeltaMachineOrder.countDocuments(
        matchConditions
      ).exec();

      const totalPages = Math.ceil(totalItems / pageSize);

      // Calculate skip value for pagination
      const skip = (page - 1) * pageSize;

      // Retrieve data with pagination
      const data = await DeltaMachineOrder.find(matchConditions)
        .select(
          'orderData.orderNumber orderData.productName orderData.productNameAr orderData.payoutAmount'
        )
        .skip(skip)
        .limit(pageSize)
        .exec();

      return {
        data,
        totalItems,
        totalPages,
        currentPage: page,
      };
    } catch (exception) {
      return {
        data: Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
        message: exception.message,
      };
    }
  }

  async getOrderSaleAnalytics(
    sellerId: string,
    range: string = 'last30Days'
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const { startDate, endDate } = getDataRangeAnalytics(range);
      const completedStatusesNames = new Set([
        DeltaMachineStatusName.TRANSFERRED,
        DeltaMachineStatusName.REFUNDED,
      ]);

      let statusIds: string[] = await getCache<any>(`statusIds`);
      if (_isEmpty(statusIds)) {
        const statuses = await DeltaMachineStatus.find()
          .where('name')
          .in([...completedStatusesNames])
          .select('_id')
          .exec();
        statusIds = statuses.map(status => status?._id?.toString());
        await setCache(`statusIds`, statusIds, 1800);
      }

      const aggregationPipeline: any[] = [
        {
          $match: {
            'orderData.sellerId': new mongoose.Types.ObjectId(sellerId),
            statusId: {
              $in: statusIds.map(item => mongoose.Types.ObjectId(item)),
            },
            'orderData.createdAt': {
              $gte: new Date(startDate),
              $lte: new Date(endDate),
            },
          },
        },
        {
          $group: {
            _id: { sellerId: '$orderData.sellerId', statusId: '$statusId' },
            totalAmount: {
              $sum: '$orderData.grandTotal',
            },
            count: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'DeltaMachineStatuses',
            localField: '_id.statusId',
            foreignField: '_id',
            as: 'statusInfo',
          },
        },
        {
          $unwind: '$statusInfo',
        },
        {
          $project: {
            sellerId: '$_id.sellerId',
            statusId: '$_id.statusId',
            statusName: { $ifNull: ['$statusInfo.name', 'Unknown Status'] },
            totalAmount: { $ifNull: ['$totalAmount', 0] },
            transaction: { $ifNull: ['$count', 0] },
          },
        },
        {
          $group: {
            _id: '$_id.sellerId',
            totalsByStatus: {
              $push: {
                statusId: '$statusId',
                statusName: '$statusName',
                totalAmount: '$totalAmount',
                transaction: '$transaction',
              },
            },
            totalTransactions: { $sum: '$transaction' }, // Sum of all counts (total transactions)
            totalAmountOverall: { $sum: '$totalAmount' }, // Overall total amount
          },
        },
      ];
      const result = await DeltaMachineOrder.aggregate(
        aggregationPipeline
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result,
        },
      ];
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

  async getDMOrdersByBuyerUserId(
    userId: string,
    submodule: string,
    limit: number = 0,
    page: number = 0,
    statusIds: string[] = []
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: PaginationDto<DeltaMachineOrderDocument> | string;
        message?: string;
      }
    ]
  > {
    try {
      // Set pagination options
      const skip = (page - 1) * limit;
      // Build status condition
      const statusIdCondition =
        submodule === 'in-progress' ? { $nin: statusIds } : { $in: statusIds };

      // Build filter object
      const filterObject = {
        'orderData.buyerId': new mongoose.Types.ObjectId(userId),
        statusId: statusIdCondition,
        'orderData.isReservation': { $ne: true },
        'orderData.isFinancing': { $ne: true },
      };
      // Perform aggregation with multiple lookups and pagination
      const [aggregatedOrders, totalCount] = await Promise.all([
        DeltaMachineOrder.aggregate([
          { $match: filterObject },
          {
            $lookup: {
              from: 'users',
              localField: 'orderData.sellerId',
              foreignField: '_id',
              as: 'seller',
            },
          },
          { $unwind: { path: '$seller', preserveNullAndEmptyArrays: true } },
          {
            $lookup: {
              from: 'users',
              localField: 'orderData.buyerId',
              foreignField: '_id',
              as: 'buyer',
            },
          },
          { $unwind: { path: '$buyer', preserveNullAndEmptyArrays: true } },
          { $sort: { createdAt: -1 } },
          { $skip: skip },
          { $limit: limit },
        ]),
        DeltaMachineOrder.countDocuments(filterObject),
      ]);

      const updatedArray = aggregatedOrders.map(item => {
        return {
          ...item,
          orderData: {
            ...item.orderData,
            buyerCity: item.buyer?.address?.city || null,
            sellerCity: item.seller?.address?.city || null,
            deliveryAddress: item.buyer?.address,
          },
        };
      });
      // Return the result in paginate format
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: {
            docs: updatedArray,
            totalDocs: totalCount,
            hasNextPage: page * limit < totalCount,
          },
        },
      ];
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

  async getPenalizedOrders(
    dmoIds: string[],
    page: number = 1,
    pageSize: number = 5
  ): Promise<{
    data: PenalizedOrder[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    try {
      const dmOrderIds = dmoIds?.map(
        dmoId => new mongoose.Types.ObjectId(dmoId)
      );
      const skip = (page - 1) * pageSize;
      const queryCondition = {
        _id: { $in: dmOrderIds },
      };
      const totalItems = await DeltaMachineOrder.countDocuments({
        ...queryCondition,
      });
      const totalPages = Math.ceil(totalItems / pageSize);

      const penalizedOrders = await DeltaMachineOrder.aggregate<PenalizedOrder>(
        [
          {
            $match: {
              ...queryCondition,
            },
          },
          {
            $lookup: {
              from: 'DmoNCTReasons',
              localField: '_id',
              foreignField: 'orderId',
              as: 'nctReasons',
            },
          },
          {
            $unwind: {
              path: '$nctReasons',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: 'NCTReasons',
              localField: 'nctReasons.nctReasonId',
              foreignField: '_id',
              as: 'reasonDetails',
            },
          },
          {
            $unwind: {
              path: '$reasonDetails',
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              productName: '$orderData.productName',
              orderNumber: '$orderData.orderNumber',
              payoutAmount: '$orderData.payoutAmount',
              nctReason: '$reasonDetails.displayName',
              nctReasonAR: '$reasonDetails.displayNameAR',
              dmoId: '$_id',
            },
          },
          { $skip: skip },
          { $limit: pageSize },
        ]
      );

      return {
        data: penalizedOrders,
        totalItems,
        totalPages,
        currentPage: page,
        pageSize,
      };
    } catch (error) {
      console.log(`Failed to get penalized orders ${error}`);
      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: page,
        pageSize,
      };
    }
  }

  async getPendingPenaltyTotalAmount(
    userId: string,
    range: string = 'thismonth'
  ): Promise<number> {
    try {
      const { startDate, endDate } = getDataRangeAnalytics(range);
      const queryCondition = {
        'orderData.sellerId': new mongoose.Types.ObjectId(userId),
        'orderData.createdAt': {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
        'orderData.penalty': {
          $gt: 0,
        },
      };
      const penalty: any = await DeltaMachineOrder.aggregate<PenalizedOrder>([
        {
          $match: {
            ...queryCondition,
          },
        },
        {
          $group: {
            _id: '$orderData.sellerId',
            totalPenalty: {
              $sum: '$orderData.penalty',
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalPenalty: 1,
          },
        },
      ]);
      return penalty?.length > 0 ? penalty[0].totalPenalty : 0;
    } catch (error) {
      console.log(`Failed to get penalized orders ${error}`);
      return 0;
    }
  }
  async countDmOrdersForBuyer(
    userId: string,
    submodule: string,
    statusIds: string[] = []
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: number | string;
        message?: string;
      }
    ]
  > {
    try {
      let statusIdCondition;
      if (submodule === 'in-progress') {
        statusIdCondition = { $nin: statusIds };
      } else {
        statusIdCondition = { $in: statusIds };
      }
      const orderCount = await DeltaMachineOrder.find({
        'orderData.buyerId': new mongoose.Types.ObjectId(userId),
        statusId: statusIdCondition,
        'orderData.isReservation': { $ne: true },
        'orderData.isFinancing': { $ne: true },
      }).count();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: orderCount,
        },
      ];
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

  async countReservationOrdersForBuyer(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: number | string;
        message?: string;
      }
    ]
  > {
    try {
      const orderCount = await DeltaMachineOrder.find({
        'orderData.buyerId': new mongoose.Types.ObjectId(userId),
        'orderData.isReservation': { $eq: true },
      }).count();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: orderCount,
        },
      ];
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
  async getDmOrdersByProductIds(productIds: string[]): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineOrderDocument[] | string;
        message?: string;
      }
    ]
  > {
    try {
      const dmOrders = await DeltaMachineOrder.find({
        'orderData.productId': { $in: productIds },
      }).exec();

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: dmOrders,
        },
      ];
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
}
