import _cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import mongoose from 'mongoose';
import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { RefundOrderDto } from '../dto/refund/RefundOrderDto';
import { Cities, CitiesNames, isCityMatch } from '../enums/Cities.Enum';
import {
  DeltaMachineBNPLStatuses,
  DeltaMachineStatusSubmodule,
} from '../enums/DeltaMachineStatusSubmodule';
import { OrderType } from '../enums/OrderType.Enum';
import {
  DeltaMachinePayoutType,
  DisplayName,
  PaymentMethod,
} from '../enums/PaymentMethod.Enum';
import { SellerType, UserType } from '../enums/UserType.Enum';
import { WalletTransactionStatus } from '../enums/WalletTransactionStatus';
import { GetRole, GetUserData, GetUserRoles } from '../grpc/authz';
import {
  CreatePickupForOrder,
  CreateShipment,
  GetCityTiers,
  GetLogisticServices,
  GetPickupStatuses,
  MapLogisticsServices,
  cancelPickupForOrder,
  createPickUpForAccessories,
} from '../grpc/ler';
import { GetUserRolesRequest } from '../grpc/proto/authz/GetUserRolesRequest';
import { GetTransactionsResponse } from '../grpc/proto/wallet/GetTransactionsResponse';
import { TransactionResponse } from '../grpc/proto/wallet/TransactionResponse';
import { GetResponsesOfProduct } from '../grpc/review';
import {
  CreateTransaction,
  GetCreditsByOrderIds,
  GetGlobalWalletToggle,
  GetTransactions,
  GetWallet,
  GetWalletPayoutSettings,
  UpdatePendingAmountTransaction,
  UpdateTransaction,
} from '../grpc/wallet';
import { AirTable } from '../libs/airtable';
import { Secom } from '../libs/couriers/secom';
import FreshchatMessageStatus from '../libs/freshchat/freshchatMessageStatus.Enum';
import { getOutboundMsg } from '../libs/freshchat/services';
import { AddressDocument } from '../models/Address';
import { BankDocument } from '../models/Bank';
import {
  DeltaMachineOrderDocument,
  OrderData,
  OrdersListResponse,
  ShipmentServiceEnum,
} from '../models/DeltaMachineOrder';
import {
  CourierAutomationSettingInputType,
  DeltaMachineSettingInput,
  OMStatusAutomationSettingInputType,
  PickupServiceSettingSubmoduleInputType,
  WhatsappAutomationSettingSubmoduleInputType,
} from '../models/DeltaMachineSetting';
import { DeltaMachineStatusDocument } from '../models/DeltaMachineStatus';
import {
  DeltaMachineNewUserInput,
  DeltaMachineUserDocument,
  UserListResponse,
} from '../models/DeltaMachineUsers';
import {
  DmoNCTReasonsDocument,
  DmoNCTReasonsDto,
} from '../models/DmoNCTReasons';
import { UserLegacyDocument } from '../models/LegacyUser';
import { OrderDocument, UpdatePayoutOrderInput } from '../models/Order';
import { BankDetailInput } from '../models/User';
import { WhatsAppMsgDocument } from '../models/WhatsAppMsg';
import { BankRepository } from '../repositories/bankRepository';
import {
  DeltaMachineRepository,
  SellerDMOrder,
} from '../repositories/deltaMachineRepository';
import { DmoPayoutRefundHistoryRepository } from '../repositories/dmoPayoutRefundHistoryRepository';
import { ModelRepository } from '../repositories/modelRepository';
import { OrderRepository } from '../repositories/orderRepository';
import { PayoutHistoryRepository } from '../repositories/payoutHistoryRepository';
import { ProductRepository } from '../repositories/productRepository';
import { SettingRepository } from '../repositories/settingRepository';
import { UserRepository } from '../repositories/userRepository';
import { WhatsAppMsgRepository } from '../repositories/whatsAppMsgRepository';
import {
  EventLogRequest,
  EventLogTemplateRequest,
  createEventLog,
  getTemplateMsgToCreateEventLog,
} from '../util/activityLogs';
import {
  _get,
  decrypt,
  decryptIBAN,
  encrypt,
  formatPriceInDecimalPoints,
  getParsedValue,
  normalize,
} from '../util/common';
import logger from '../util/logger';
import { sendEventData } from '../util/webEngageEvents';
import { FreshchatService } from './freshchatService';
import { MerchantMessage, OrderService } from './orderService';
import { RefundService } from './refundService';

import { ListDmoDto } from '../dto/dmo/DmoDto';
import { NCTReasonsInputDto } from '../dto/nctReasons/NCTReasonDto';
import { WhatsAppMsgReportDto } from '../dto/whatsappMsg/whatsAppMsgDto';
import { DMShippingMethod } from '../enums/DMShippingMethod';
import { DeltaMachineStatusName } from '../enums/DeltaMachineStatusName';
import { InvoiceFormats } from '../enums/InvoiceFormats';
import { ProductOrderStatus, ProductStatus } from '../enums/ProductStatus.Enum';
import { getCategoryByName, getProductCondition } from '../grpc/category';
import {
  addSellerCommissionPenalty,
  forceUpdateCommission,
  getProductSummaryCommission,
  updatePromoCodeUsageCount,
} from '../grpc/commission';
import {
  GetCancellationFee,
  GetHoldingPenaltyBalance,
  GetStandingPenaltyToDmo,
  UpdateHoldingPenalty,
} from '../grpc/dmbackend';
import { GetProductCatConRequest } from '../grpc/proto/category.pb';
import { CreatePickupForAccessoriesRequest } from '../grpc/proto/ler/CreatePickupForAccessoriesRequest';
import { ValidateSellerDetectionNudgeResponse } from '../grpc/proto/v2/ValidateSellerDetectionNudgeResponse';
import {
  DailyReportBullMQService,
  InvoiceBullMQService,
  InvoiceJobType,
  JobTypes,
} from '../libs/bull.util';
import { BullMQService, Queues } from '../libs/bullmq.util';
import { sendMail } from '../libs/sendgrid';
import { ILegacyProductModel } from '../models/LegacyProducts';
import { NCTReasonsDocument } from '../models/NCTReasons';
import { PaymentProviderType } from '../models/Payment';
import { generateDelectionMessageSellerResponseSheet } from '../util/excel';
import { ListingGroupService } from './listingGroupService';
import { ProductService } from './productService';
import { SearchService } from './searchService';
import { SettingService } from './settingService';
import { UserService } from './userService';
import { VariantService } from './variantService';

import config from 'config';
import { Types } from 'mongoose';
import { PaymentOrderUpdateDto } from '../dto/order/PaymentOrderUpdateDto';
import { PenalizedOrder } from '../dto/order/PayoutSellerOrderDto';
import { PaginationDto } from '../dto/paginationDto';
import { PurchaseProductDto } from '../dto/product/PurchaseProductDto';
import {
  TorodKafkaMessage,
  TorodStatus,
} from '../dto/torod/torod-web-hook.dto';
import { AddonType } from '../enums/AddonType';
import { FreshchatResponse } from '../enums/FreshchatResponse';
import { NCTReasonName } from '../enums/NCTReason.enum';
import { ShipmentTypeEnum } from '../enums/ShipmentType';
import { TransactionOrderStatus } from '../enums/TransactionStatus';
import { createInvoice } from '../grpc/invoice';
import { SellerUserType } from '../grpc/proto/commission/sellerType.enum';
import { AWSService } from '../libs/aws';
import { setCache } from '../libs/redis';
import { SlackUtil } from '../libs/slack.util';
import { UFR, UFRLabelType } from '../libs/ufr.util';
import { getSecretData } from '../libs/vault';
import { VariantDocument } from '../models/Variant';
import { AddressRepository } from '../repositories/addressRepository';
import { mapAttributes } from '../util/attributes';
import { TorodConsumerService } from '../util/consumer';
import { getDeliveryTime } from '../util/deliveryHelper';
import { AttributeService } from './attributeService';
import { updateConsignmentStatus } from '../grpc/productMicroService';
import { ConsignmentStatus } from '../enums/CommissionStatus.enum';
const torodWebhookKafka: { [key: string]: string } =
  config.get('torodWebhookKafka');
@Service()
export class DeltaMachineService {
  @Inject()
  productRepository: ProductRepository;
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  deltaMachineRepository: DeltaMachineRepository;
  @Inject()
  orderService: OrderService;
  @Inject()
  settingRepository: SettingRepository;
  @Inject()
  orderRepository: OrderRepository;
  @Inject()
  whatsAppMsgRepository: WhatsAppMsgRepository;
  @Inject()
  userRepository: UserRepository;
  @Inject()
  payoutHistoryRepository: PayoutHistoryRepository;
  @Inject()
  refundService: RefundService;
  @Inject()
  userService: UserService;
  @Inject()
  freshchatService: FreshchatService;
  @Inject()
  dmoPayoutRefundHistoryRepository: DmoPayoutRefundHistoryRepository;
  @Inject()
  bankRepository: BankRepository;
  @Inject()
  variantService: VariantService;
  @Inject()
  modelRepository: ModelRepository;
  @Inject()
  listingGroupService: ListingGroupService;
  @Inject()
  bullMQService: BullMQService;
  @Inject()
  invoiceBullMQService: InvoiceBullMQService;
  @Inject()
  dailyReportBullMQService: DailyReportBullMQService;
  @Inject()
  productService: ProductService;
  @Inject()
  searchService: SearchService;
  @Inject()
  settingService: SettingService;
  @Inject()
  addressRepository: AddressRepository;

  @Inject()
  orderservice: OrderService;
  @Inject()
  attributeService: AttributeService;
  constructor(public torodConsumerService?: TorodConsumerService) {
    (async (): Promise<any> => {
      await this.setupTorodConsumer();
    })();
  }

  async setupTorodConsumer() {
    let topic = 'staging-torod-webhook-log';
    if (process.env.NODE_ENV?.includes('production')) {
      topic = torodWebhookKafka.prefix + '-torod-webhook-log';
    }
    await this.torodConsumerService.consume(
      {
        topics: [topic],
      },
      {
        eachMessage: async ({ message }) => {
          try {
            const eventLog = JSON.parse(message?.value?.toString());
            await this.torodWebhook([eventLog]);
          } catch (error) {
            console.log('Error While consuming torod messages', error);
          }
        },
      },
      torodWebhookKafka
    );
  }
  torodWebhook = async (messages: TorodKafkaMessage[]) => {
    try {
      const {
        inTransitStatus,
        awaitingSellerToShip,
        deliveredToInspectionCenter,
        refundToBuyer,
        deliveredStatus,
        inTransitToSoumInspection,
      } = await this.getMappedStatus();

      for (const item of messages || []) {
        const firstMileOrder = await this.getDMOrderByTrackingNo(item.orderId);
        if (firstMileOrder) {
          // first (created and pending) > awaiting to ship
          // first (shipped) > intransit inspection center
          // first (delivered) > delivered inspection center
          if (
            [TorodStatus.CREEATED, TorodStatus.PENDING].includes(item.status)
          ) {
            await this.updateStatusByTrackingId(
              firstMileOrder.id,
              item.orderId,
              awaitingSellerToShip.id
            );
          } else if ([TorodStatus.SHIPPED].includes(item.status)) {
            await this.updateStatusByTrackingId(
              firstMileOrder.id,
              item.orderId,
              inTransitToSoumInspection.id
            );
          } else if ([TorodStatus.DELIVERED].includes(item.status)) {
            await this.updateStatusByTrackingId(
              firstMileOrder.id,
              item.orderId,
              deliveredToInspectionCenter.id
            );
            if (firstMileOrder.orderData.isConsignment) {
              await updateConsignmentStatus({
                status: ConsignmentStatus.RECEIVED,
                orderNumber: firstMileOrder.orderData?.orderNumber,
              });
            }
          } else if (
            [
              TorodStatus.CANCELLED,
              TorodStatus.FAILED,
              TorodStatus.RTO,
            ].includes(item.status)
          ) {
            await this.updateStatusByTrackingId(
              firstMileOrder.id,
              item.orderId,
              refundToBuyer.id
            );
            if (firstMileOrder.orderData.isConsignment) {
              await updateConsignmentStatus({
                status: ConsignmentStatus.CLOSED_UNFULFILLED,
                orderNumber: firstMileOrder.orderData?.orderNumber,
              });
            }
          }
          await this.sendWEConfirmDeliveryEvent(
            firstMileOrder?.orderId?.toString()
          );
          return;
        }

        const lastMileOrder = await this.getDMOrderByLastMileTrackingNo(
          item.orderId
        );
        if (lastMileOrder) {
          // this was old logic by @sardor or @fahid
          // if (lastMileOrder?.isRiyadhSpecificPickup) return;

          // last (created and pending) > way to buyer
          // last (shipped) > intransit to buyer
          // last (delivered) > delivered
          if (
            [TorodStatus.CREEATED, TorodStatus.PENDING].includes(item.status)
          ) {
            // no update so far
          } else if ([TorodStatus.SHIPPED].includes(item.status)) {
            console.log(
              'update to inTransitStatus',
              lastMileOrder.id,
              item.orderId,
              inTransitStatus.id
            );
            await this.updateStatusByLastMileTrackingId(
              lastMileOrder.id,
              item.orderId,
              inTransitStatus.id
            );
          } else if ([TorodStatus.DELIVERED].includes(item.status)) {
            await this.updateStatusByLastMileTrackingId(
              lastMileOrder.id,
              item.orderId,
              deliveredStatus.id
            );
          } else if (
            [
              TorodStatus.CANCELLED,
              TorodStatus.FAILED,
              TorodStatus.RTO,
            ].includes(item.status)
          ) {
            await this.updateStatusByLastMileTrackingId(
              lastMileOrder.id,
              item.orderId,
              refundToBuyer.id
            );
          }
          await this.sendWEConfirmDeliveryEvent(
            lastMileOrder?.orderId?.toString()
          );
          return;
        }

        const returnOrder = await this.getDMOrderByTrackingNo(
          item.orderId,
          true
        );
        if (returnOrder) {
          console.log('No handle for this as of now');
        }
      }
    } catch (exception) {
      console.log(exception.message);
    }
  };

  async getMappedStatus() {
    const statuses = await this.getStatusList();

    const awaitingOrdersStatusesNames = [
      DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP,
      DeltaMachineStatusName.READY_TO_SHIP,
      DeltaMachineStatusName.PICKED_UP,
      DeltaMachineStatusName.NEW_ORDER,
      DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY,
      DeltaMachineStatusName.CONFIRMED_AVAILABILITY,
      DeltaMachineStatusName.BACKLOG_IN_TRANSIT,
      DeltaMachineStatusName.BACKLOG_AWAITING_SELLER_TO_SHIP,
    ];
    const awaitingOrdersStatuses = (
      statuses as DeltaMachineStatusDocument[]
    ).filter((status: DeltaMachineStatusDocument) =>
      awaitingOrdersStatusesNames.includes(
        status.toObject().name as DeltaMachineStatusName
      )
    );
    const deliveredStatus = (statuses as DeltaMachineStatusDocument[]).find(
      status => status.name === DeltaMachineStatusName.ITEM_DELIVERED
    );
    const deliveredToSoumFC = (statuses as DeltaMachineStatusDocument[]).find(
      status => status.name === DeltaMachineStatusName.DELIVERED_TO_SOUM_FC
    );
    const validDisputeStatus = (statuses as DeltaMachineStatusDocument[]).find(
      status => status.name === DeltaMachineStatusName.VALID_DISPUTE
    );
    const inTransitStatus = (statuses as DeltaMachineStatusDocument[]).find(
      status => status.name === DeltaMachineStatusName.IN_TRANSIT
    );
    const returnInTransitStatus = (
      statuses as DeltaMachineStatusDocument[]
    ).find(status => status.name === DeltaMachineStatusName.RETURN_IN_TRANSIT);
    const returnedStatus = (statuses as DeltaMachineStatusDocument[]).find(
      status => status.name === DeltaMachineStatusName.RETURNED
    );
    const awaitingSellerToShip = (
      statuses as DeltaMachineStatusDocument[]
    ).find(
      status => status.name === DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP
    );

    const deliveredToInspectionCenter = (
      statuses as DeltaMachineStatusDocument[]
    ).find(
      status =>
        status.name === DeltaMachineStatusName.DELIVERED_TO_INSPECTION_CENTER
    );

    const refundToBuyer = (statuses as DeltaMachineStatusDocument[]).find(
      status => status.name === DeltaMachineStatusName.REFUND_TO_BUYER
    );
    const inTransitToSoumInspection = (
      statuses as DeltaMachineStatusDocument[]
    ).find(
      status =>
        status.name === DeltaMachineStatusName.IN_TRANSIT_TO_INSPECTION_CENTER
    );
    return {
      awaitingOrdersStatuses,
      deliveredStatus,
      validDisputeStatus,
      returnInTransitStatus,
      returnedStatus,

      inTransitStatus,
      deliveredToSoumFC,
      inTransitToSoumInspection,
      awaitingSellerToShip,
      deliveredToInspectionCenter,
      refundToBuyer,
    };
  }
  async getOrderDetailById(orderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getByOrderId(
        orderId
      );
      if (err && typeof data.result === 'string') {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }

      const orders = await this.orderService.findOrdersById([
        (data.result as DeltaMachineOrderDocument).orderId,
      ]);

      if (isEmpty(orders)) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ORDER
        );
      }

      const response = data.result as any;
      if (response?.serviceId) {
        const servicesMap = new Map();
        const vendorsMap = new Map();
        const logisticService = await GetLogisticServices({});
        (logisticService?.services || []).forEach(service => {
          servicesMap.set(service.serviceId, service);
        });
        (logisticService?.vendors || []).forEach(vendor => {
          vendorsMap.set(vendor.vendorId, vendor);
        });
        if (
          servicesMap.has(response?.serviceId) ||
          vendorsMap.has(response?.vendorId)
        ) {
          response.logistic =
            (vendorsMap.has(response?.vendorId)
              ? vendorsMap.get(response?.vendorId)?.vendorName?.trim()
              : '') +
            ' - ' +
            (servicesMap.has(response?.serviceId)
              ? servicesMap.get(response?.serviceId)?.serviceName?.trim()
              : '');
        }
      }
      const order = orders[0];
      const dmo = data.result as DeltaMachineOrderDocument;
      const dmoId = dmo?.id;
      response.orderData = this.populateOrdersData(order);

      const standingPenaltyRes = await GetStandingPenaltyToDmo({ dmoId });
      response.orderData.penalty = standingPenaltyRes?.penalty || 0;
      const cancellationFee = dmo?.orderData?.cancellationFee || 0;
      response.orderData.cancellationFee = cancellationFee;

      const [errAddress, buyerData] = await this.userService.getListUserAddress(
        order.buyer
      );

      if (!errAddress) {
        const buyerAddresses = buyerData.result as AddressDocument[];
        if (buyerAddresses.length) {
          const buyerAddress = buyerAddresses.pop();

          if (buyerAddress?.street) {
            response.orderData.buyerAddress = `${buyerAddress?.street}
            ${buyerAddress?.district || ''}
            ${buyerAddress?.postal_code || ''}`;
          }

          response.orderData.buyerCity =
            buyerAddress?.city || response.orderData.buyerCity;
          response.orderData.buyerPostalCode =
            buyerAddress?.postal_code || response.orderData.buyerPostalCode;
          response.orderData.buyerDistrict =
            buyerAddress?.district || response.orderData.buyerDistrict;
        }
      }

      const [errSellerAddress, sellerData] =
        await this.userService.getListUserAddress(order.seller);
      if (!errSellerAddress) {
        const sellerAddresses = sellerData.result as AddressDocument[];
        if (sellerAddresses.length) {
          const sellerAddress = sellerAddresses.pop();

          if (sellerAddress?.street) {
            response.orderData.sellerAddress = `${sellerAddress?.street}
            ${sellerAddress?.district || ''}
            ${sellerAddress?.postal_code || ''}`;
          }

          response.orderData.sellerCity =
            sellerAddress?.city || response.orderData.sellerCity;
          response.orderData.sellerPostalCode =
            sellerAddress?.postal_code || response.orderData.sellerPostalCode;
          response.orderData.sellerDistrict =
            sellerAddress?.district || response.orderData.sellerDistrict;
        }
      }

      response.orderData.orderType = this.setOrderType(response.orderData);

      const [sellerErr, orderDetailSeller] =
        await this.orderService.getOrderDetail(order._id, 'seller');
      if (!sellerErr) {
        response.orderData.payoutAmount = orderDetailSeller.order.grand_total;
        response.orderData.sellPrice = orderDetailSeller.order.sell_price;
        response.orderData.sellerPromoCode = orderDetailSeller.order.promo_code;
      }

      const [buyerErr, orderDetailBuyer] =
        await this.orderService.getOrderDetail(order._id, 'buyer');
      if (!buyerErr) {
        response.orderData.grandTotal = orderDetailBuyer.order.grand_total;
        response.orderData.buyerPromoCode = orderDetailBuyer.order.promo_code;
      }

      const statuses = await this.getStatusList();
      const status = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.toObject().id === response.statusId.toString()
      );
      response.orderData.status = status.toObject().displayName;
      return response;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async getDetailedList(
    offset: number,
    limit: number,
    submodule?: DeltaMachineStatusSubmodule,
    searchOption: any = null,
    statuses: string[] = []
  ) {
    try {
      const [err, data] = await this.deltaMachineRepository.getList({
        offset,
        limit,
        submodule,
        searchOption,
        statuses,
      });
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const response = data.result as OrdersListResponse;
      const dmOrdersList = response.data as DeltaMachineOrderDocument[];
      const orderIds = dmOrdersList.map(dmo => dmo.orderId);
      const orders = await this.orderService.findOrdersById(orderIds);

      const walletCreditsSet = new Set();
      if (submodule === DeltaMachineStatusSubmodule.PAYOUT) {
        const creditTransactions: any = await GetCreditsByOrderIds({
          orderIds,
        });
        if (creditTransactions.data) {
          creditTransactions.data.forEach((element: { orderId: any }) => {
            walletCreditsSet.add(element.orderId);
          });
        }
      }

      for (const dmOrder of dmOrdersList) {
        const matchedOrder = orders.find(
          order => order._id.toString() === dmOrder.orderId.toString()
        );
        if (matchedOrder) {
          dmOrder.orderData = this.populateOrdersData(matchedOrder);

          const [errAddress, data] = await this.userService.getListUserAddress(
            dmOrder.orderData.buyerId
          );
          if (!errAddress) {
            const buyerAddresses = data.result as AddressDocument[];
            if (buyerAddresses.length) {
              const buyerAddress = buyerAddresses.pop();
              dmOrder.orderData.buyerCity =
                buyerAddress?.city || dmOrder.orderData.buyerCity;
              if (buyerAddress?.street) {
                dmOrder.orderData.buyerAddress = `${buyerAddress?.street}
                ${buyerAddress?.district || ''}
                ${buyerAddress?.postal_code || ''}`;
              }
              dmOrder.orderData.buyerStreet =
                buyerAddress?.street || dmOrder.orderData.buyerStreet;
              dmOrder.orderData.buyerPostalCode =
                buyerAddress?.postal_code || dmOrder.orderData.buyerPostalCode;
              dmOrder.orderData.buyerDistrict =
                buyerAddress?.district || dmOrder.orderData.buyerDistrict;
            }
          }
          const [errSellerAddress, sellerData] =
            await this.userService.getListUserAddress(
              dmOrder.orderData.sellerId
            );
          if (!errSellerAddress) {
            const sellerAddresses = sellerData.result as AddressDocument[];
            if (sellerAddresses.length) {
              const sellerAddress = sellerAddresses.pop();
              dmOrder.orderData.sellerCity =
                sellerAddress?.city || dmOrder.orderData.sellerCity;
              if (sellerAddress?.street) {
                dmOrder.orderData.sellerAddress = `${sellerAddress?.street}
                ${sellerAddress?.district || ''}
                ${sellerAddress?.postal_code || ''}`;
              }
              dmOrder.orderData.sellerStreet =
                sellerAddress?.street || dmOrder.orderData.sellerStreet;
              dmOrder.orderData.sellerPostalCode =
                sellerAddress?.postal_code ||
                dmOrder.orderData.sellerPostalCode;
              dmOrder.orderData.sellerDistrict =
                sellerAddress?.district || dmOrder.orderData.sellerDistrict;
            }
          }
          dmOrder.orderData.orderType = this.setOrderType(dmOrder.orderData);
          dmOrder.orderData.captureStatus = dmOrder.captureStatus;
          matchedOrder.promos = dmOrder.orderData.sellerPromo || null;
          const [sellerErr, orderDetailSeller] =
            await this.orderService.calculateOrderDetail(
              'seller',
              matchedOrder
            );
          if (!sellerErr) {
            dmOrder.orderData.payoutAmount =
              orderDetailSeller.order.grand_total;
            dmOrder.orderData.sellPrice = orderDetailSeller.order.sell_price;
            dmOrder.orderData.sellerPromoCode =
              orderDetailSeller.order.promo_code;
          }
          matchedOrder.promos = dmOrder.orderData.buyerPromo || null;
          const [buyerErr, orderDetailBuyer] =
            await this.orderService.calculateOrderDetail('buyer', matchedOrder);
          if (!buyerErr) {
            dmOrder.orderData.grandTotal = orderDetailBuyer.order.grand_total;
            dmOrder.orderData.buyerPromoCode =
              orderDetailBuyer.order.promo_code;
          }

          if (submodule === DeltaMachineStatusSubmodule.PAYOUT) {
            if (walletCreditsSet.has(String(dmOrder.orderId))) {
              dmOrder.payoutType = DeltaMachinePayoutType.WALLET_CREDIT;
            } else {
              dmOrder.payoutType = DeltaMachinePayoutType.PAYOUT;
            }
          }
        }
      }
      response.data = dmOrdersList;
      return response;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async getDetailedListForOrders(limit: number = 100) {
    try {
      const [err, response] =
        await this.deltaMachineRepository.getListForMissingOrderData(limit);
      if (err) {
        this.error.errorCode = response.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = response.result.toString();
        this.error.message = response.message;
        throw this.error;
      }
      const dmOrdersList = response.result as DeltaMachineOrderDocument[];
      const orderIds = dmOrdersList.map(dmo => dmo.orderId);
      const orders = await this.orderService.findOrdersById(orderIds);
      const statuses =
        (await this.getStatusList()) as DeltaMachineStatusDocument[];
      for (const dmOrder of dmOrdersList) {
        const matchedOrder = orders.find(
          order => order._id.toString() === dmOrder.orderId.toString()
        );
        if (matchedOrder) {
          const orderData = this.populateOrdersData(matchedOrder);
          let orderStatus = '';
          statuses.forEach((status: DeltaMachineStatusDocument) => {
            if (status.toObject().id === dmOrder?.statusId?.toString()) {
              orderStatus = status.toObject().name;
            }
          });
          if (dmOrder.orderData) {
            dmOrder.orderData.buyerName = orderData?.buyerName;
            dmOrder.orderData.sellerName = orderData?.sellerName;
            dmOrder.orderData.variantId = orderData?.variantId;
            dmOrder.orderData.productNameAr = orderData?.productNameAr;
            dmOrder.orderData.orderStatus = orderStatus;
            dmOrder.orderData.captureStatus = dmOrder.captureStatus;
          }
        }
      }
      return dmOrdersList;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async populateOrderData() {
    const results = await this.getDetailedListForOrders();
    for (const order of results) {
      await this.deltaMachineRepository.update({ _id: order?.id }, order);
    }
    return results?.length;
  }

  async getList(params: ListDmoDto) {
    try {
      const [err, data] = await this.deltaMachineRepository.getList(params);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const response = data.result as OrdersListResponse;
      let dmOrdersList = response.data as DeltaMachineOrderDocument[];
      if (params.submodule === DeltaMachineStatusSubmodule.RESERVATION) {
        for (const dmOrder of dmOrdersList) {
          const [buyerErr, orderDetailBuyer] =
            await this.orderService.getOrderDetail(dmOrder.orderId, 'buyer');

          if (!buyerErr) {
            dmOrder.orderData.payoutAmount =
              orderDetailBuyer?.order?.grand_total;
            dmOrder.orderData.paidAmount =
              orderDetailBuyer?.order?.reservation?.reservationAmount;
            dmOrder.orderData.remainingAmount =
              orderDetailBuyer?.order?.reservation?.reservationRemainingAmount;
            dmOrder.orderData.sellPrice = orderDetailBuyer?.order?.sell_price;
          }
        }
      }

      if (params.submodule === DeltaMachineStatusSubmodule.FINANCE) {
        for (const dmOrder of dmOrdersList) {
          const [buyerErr, orderDetailBuyer] =
            await this.orderService.getOrderDetail(dmOrder.orderId, 'buyer');

          if (!buyerErr) {
            dmOrder.orderData.payoutAmount =
              orderDetailBuyer?.order?.grand_total;
            dmOrder.orderData.sellPrice = orderDetailBuyer?.order?.sell_price;
            dmOrder.orderData.financingFee =
              orderDetailBuyer?.order?.financingRequest?.amount;
            dmOrder.orderData.reservationAmount =
              orderDetailBuyer?.order?.reservation?.reservationAmount;
            const [, dmStatus] =
              await this.deltaMachineRepository.getStatusById(dmOrder.statusId);
            const dmStatusResult =
              dmStatus.result as DeltaMachineStatusDocument;
            if (
              dmStatusResult.name === DeltaMachineStatusName.FULL_AMOUNT_PAID
            ) {
              dmOrder.orderData.paidAmount =
                orderDetailBuyer?.order?.grand_total;
              dmOrder.orderData.remainingAmount = 0;
            } else if (dmOrder.orderData.isFinancing) {
              if (
                [
                  DeltaMachineStatusName.NEW_ORDER,
                  DeltaMachineStatusName.WAITING_FOR_APPROVAL,
                  DeltaMachineStatusName.REJECTED_BY_FINANCE_COMPANY,
                  DeltaMachineStatusName.APPROVED_BY_FINANCE_COMPANY,
                ].find(val => val === dmStatusResult.name)
              ) {
                dmOrder.orderData.paidAmount = 0;
                dmOrder.orderData.remainingAmount =
                  orderDetailBuyer?.order?.grand_total;
              } else {
                dmOrder.orderData.paidAmount =
                  orderDetailBuyer?.order?.reservation?.reservationAmount;
                dmOrder.orderData.remainingAmount =
                  orderDetailBuyer?.order?.reservation?.reservationRemainingAmount;
              }
            }
            if (dmOrder.orderData.isReservation) {
              dmOrder.orderData.paidAmount =
                orderDetailBuyer?.order?.reservation?.reservationAmount;
              dmOrder.orderData.remainingAmount =
                orderDetailBuyer?.order?.reservation?.reservationRemainingAmount;
            }
          }
        }
      }

      if (params.submodule === DeltaMachineStatusSubmodule.REFUND) {
        for (const dmOrder of dmOrdersList) {
          dmOrder.orderData.refundAmount = parseFloat(
            dmOrder?.orderData?.grandTotal
          );
          if (dmOrder?.orderData?.isReservation) {
            const [buyerErr, orderDetailBuyer] =
              await this.orderService.getOrderDetail(dmOrder.orderId, 'buyer');
            if (!buyerErr) {
              dmOrder.orderData.refundAmount =
                orderDetailBuyer?.order?.reservation?.reservationAmount;
            }
          }
          if (dmOrder?.orderData?.isFinancing) {
            const [buyerErr, orderDetailBuyer] =
              await this.orderService.getOrderDetail(dmOrder.orderId, 'buyer');
            if (!buyerErr) {
              dmOrder.orderData.refundAmount =
                orderDetailBuyer?.order?.reservation?.reservationAmount;
            }
          }
        }
        dmOrdersList = await Promise.all(
          dmOrdersList.map(async dmOrder => {
            dmOrder.orderData.refundAmount = parseFloat(
              dmOrder?.orderData?.grandTotal
            );

            if (
              dmOrder?.orderData?.isReservation ||
              dmOrder?.orderData?.isFinancing
            ) {
              try {
                const [buyerErr, orderDetailBuyer] =
                  await this.orderService.getOrderDetail(
                    dmOrder.orderId,
                    'buyer'
                  );

                if (!buyerErr) {
                  dmOrder.orderData.refundAmount =
                    orderDetailBuyer?.order?.reservation?.reservationAmount;
                }
              } catch (err) {
                console.error(
                  `Error fetching buyer details for order ${dmOrder.orderId}`,
                  err
                );
              }
            }

            return dmOrder;
          })
        );
      }

      if (params.submodule === DeltaMachineStatusSubmodule.PAYOUT) {
        const orderIds = dmOrdersList.map(dmo => dmo.orderId);
        const walletCreditsSet = new Set();
        const creditTransactions: any = await GetCreditsByOrderIds({
          orderIds,
        });
        if (creditTransactions.data) {
          creditTransactions.data.forEach((element: { orderId: any }) => {
            walletCreditsSet.add(element.orderId);
          });
        }
        for (const dmOrder of dmOrdersList) {
          const [sellerErr, orderDetailSeller] =
            await this.orderService.getOrderDetail(dmOrder.orderId, 'seller');
          if (!sellerErr) {
            dmOrder.orderData.payoutAmount =
              orderDetailSeller?.order?.grand_total;
            dmOrder.orderData.sellPrice = orderDetailSeller?.order?.sell_price;
          }
          if (walletCreditsSet.has(String(dmOrder.orderId))) {
            dmOrder.payoutType = DeltaMachinePayoutType.WALLET_CREDIT;
          } else {
            dmOrder.payoutType = DeltaMachinePayoutType.PAYOUT;
          }
        }
        dmOrdersList = await Promise.all(
          dmOrdersList.map(async dmOrder => {
            try {
              const [sellerErr, orderDetailSeller] =
                await this.orderService.getOrderDetail(
                  dmOrder.orderId,
                  'seller'
                );

              if (!sellerErr) {
                if (orderDetailSeller?.order?.isConsignment) {
                  return null;
                }

                dmOrder.orderData.payoutAmount =
                  orderDetailSeller?.order?.grand_total;
                dmOrder.orderData.sellPrice =
                  orderDetailSeller?.order?.sell_price;
              }
            } catch (err) {
              console.error(
                `Error fetching order details for order ${dmOrder.orderId}`,
                err
              );
            }

            dmOrder.payoutType = walletCreditsSet.has(String(dmOrder.orderId))
              ? DeltaMachinePayoutType.WALLET_CREDIT
              : DeltaMachinePayoutType.PAYOUT;

            return dmOrder;
          })
        );
        dmOrdersList = dmOrdersList.filter(Boolean);
      }
      if (
        params.submodule === DeltaMachineStatusSubmodule.CONFIRMATION ||
        params.submodule === DeltaMachineStatusSubmodule.DELIVERY ||
        params.submodule === DeltaMachineStatusSubmodule.SHIPPING ||
        params.submodule === DeltaMachineStatusSubmodule.BACKLOG
      ) {
        const servicesMap = new Map();
        const vendorsMap = new Map();
        const logisticService = await GetLogisticServices({});
        (logisticService?.services || []).forEach(service => {
          servicesMap.set(service.serviceId, service);
        });
        (logisticService?.vendors || []).forEach(vendor => {
          vendorsMap.set(vendor.vendorId, vendor);
        });
        for (const dmOrder of dmOrdersList) {
          if (params.submodule === DeltaMachineStatusSubmodule.SHIPPING) {
            dmOrder.updatedAt =
              dmOrder.orderData?.confirmationDate || dmOrder.updatedAt;
          }
          if (
            servicesMap.has(dmOrder?.serviceId) ||
            vendorsMap.has(dmOrder?.vendorId)
          ) {
            dmOrder.logistic =
              (vendorsMap.has(dmOrder?.vendorId)
                ? vendorsMap.get(dmOrder.vendorId)?.vendorName
                : '') +
              ' - ' +
              (servicesMap.has(dmOrder?.serviceId)
                ? servicesMap.get(dmOrder.serviceId)?.serviceName
                : '');
          }
        }
      }
      response.data = dmOrdersList;
      return response;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async confirmShippingMethod(serviceName: string, dmOrderId: string) {
    try {
      if (
        normalize(serviceName) !== normalize(DMShippingMethod.PICKUP) &&
        normalize(serviceName) !== normalize(DMShippingMethod.DROPOFF)
      ) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.INVALID_SHIPPING_METHOD
        );
      }

      const logisticService = await GetLogisticServices({});
      const vendorMap = new Map();
      (logisticService?.vendors || []).forEach(vendor => {
        vendorMap.set(vendor?.vendorName?.trim()?.toLowerCase(), vendor);
      });
      let statusId = '';
      let vendorId = '';
      let serviceId = '';
      if (normalize(serviceName) === normalize(DMShippingMethod.PICKUP)) {
        const pickupVendor = vendorMap.get(normalize('B1'));
        vendorId = pickupVendor?.vendorId;
        serviceId = pickupVendor?.services?.split(',')[0] || '';
        const [, dmOrderStatus] =
          await this.deltaMachineRepository.getStatusByName(
            'awaiting-courier-to-pickup'
          );
        const deltaMachineStatusDocument =
          dmOrderStatus.result as DeltaMachineStatusDocument;
        statusId = deltaMachineStatusDocument?._id;
      }
      if (normalize(serviceName) === normalize(DMShippingMethod.DROPOFF)) {
        const dropoffVendor = vendorMap.get(normalize('SMSA'));
        vendorId = dropoffVendor?.vendorId;
        serviceId = dropoffVendor?.services?.split(',')[0] || '';
        const [, dmOrderStatus] =
          await this.deltaMachineRepository.getStatusByName(
            'awaiting-seller-to-ship'
          );
        const deltaMachineStatusDocument =
          dmOrderStatus.result as DeltaMachineStatusDocument;
        statusId = deltaMachineStatusDocument?._id;
      }
      await this.updateAirTableRecordStatus(dmOrderId, statusId);
      const [, dmOrderRes] = await this.deltaMachineRepository.update(
        { _id: dmOrderId },
        {
          statusId,
          serviceId,
          vendorId,
        }
      );
      const dmOrder = dmOrderRes?.result as DeltaMachineOrderDocument;
      if (normalize(serviceName) === normalize(DMShippingMethod.PICKUP)) {
        await this.createPickUpForOrder(dmOrder?.orderId, dmOrderId);
      }
      return dmOrder;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          exception.message
        );
      }
    }
  }

  async getOrdersByStatus(
    statuses: DeltaMachineStatusDocument[],
    isPick: boolean = false,
    isKeySeller?: boolean
  ) {
    try {
      const statusIds: string[] = [];
      statuses.forEach(status => statusIds.push(status.id));
      const [err, data] = await this.deltaMachineRepository.getOrdersByStatus(
        statusIds,
        isPick,
        isKeySeller
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as DeltaMachineOrderDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async getOrdersBySellerId(sellerId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getOrdersBySellerId(
        sellerId
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as DeltaMachineOrderDocument[];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async listPayoutRefundHistory(orderId: string) {
    try {
      const [err, data] =
        await this.deltaMachineRepository.listPayoutRefundHistory(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
          exception.message
        );
      }
    }
  }

  async getDmOrderStatusByOrderId(orderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getByOrderId(
        orderId,
        false
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const deltaMachineOrder = data.result as DeltaMachineOrderDocument;
      if (!deltaMachineOrder) {
        return null;
      }
      const dmoStatus = await this.deltaMachineRepository.getStatusById(
        deltaMachineOrder.statusId
      );
      return {
        deltaMachineOrder,
        status: dmoStatus[1]?.result,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
          exception.message
        );
      }
    }
  }
  async getStatusList(submodule: string = '') {
    try {
      const [err, data] = await this.deltaMachineRepository.getStatusList(
        submodule
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async getStatusListByName(statusNames: DeltaMachineStatusName[]) {
    try {
      const [err, data] = await this.deltaMachineRepository.getStatusListByName(
        statusNames
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async getStatusById(
    statusId: string = ''
  ): Promise<DeltaMachineStatusDocument> {
    try {
      const [, data] = await this.deltaMachineRepository.getStatusById(
        statusId
      );
      const dmoStatusDocument = data.result as DeltaMachineStatusDocument;
      return dmoStatusDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async getStatusByName(
    name: string = ''
  ): Promise<DeltaMachineStatusDocument> {
    try {
      const [, data] = await this.deltaMachineRepository.getStatusByName(name);
      const dmoStatusDocument = data.result as DeltaMachineStatusDocument;
      return dmoStatusDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async createDmoStatuses(statues: any) {
    try {
      const [err, data] = await this.deltaMachineRepository.createDmoStatuses(
        statues
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async deleteDmoStatus(id: any) {
    try {
      const [err, data] = await this.deltaMachineRepository.deleteDmoStatus(id);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async getNCTReasonList() {
    try {
      const [err, data] = await this.deltaMachineRepository.getNCTReasonList();
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_LIST_NCT_REASONS,
          exception.message
        );
      }
    }
  }
  async getSpecificNCTReasons(condition: any) {
    try {
      const [err, data] =
        await this.deltaMachineRepository.getSpecificNCTReasons(condition);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result as NCTReasonsDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_LIST_NCT_REASONS,
          exception.message
        );
      }
    }
  }
  async createNCTReasons(nctReasons: any) {
    try {
      const [err, data] = await this.deltaMachineRepository.createNCTReasons(
        nctReasons
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_NCT_REASONS_MANUALLY,
          exception.message
        );
      }
    }
  }

  async deleteNCTReason(id: any) {
    try {
      const [err, data] = await this.deltaMachineRepository.deleteNCTReason(id);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_NCT_REASON_BY_ID,
          exception.message
        );
      }
    }
  }
  async cancelShipment(nctReasonName: string, orderId: string) {
    if (
      [
        'passed-24-hrs-with-no-response',
        'passed-24-hrs-not-shipped',
        'item-unavailable',
        'buyer-withdraw',
      ].includes(nctReasonName)
    ) {
      // for some reason dmoId is passed as orderId or dm
      const dmorder = await this.getDmoById(orderId, orderId);

      if (dmorder.shipmentService != ShipmentServiceEnum.TOROD) return;
      // this is insteed of one by one if condition
      if (dmorder.trackingNumber) {
        await cancelPickupForOrder({
          trackingOrOrderId: dmorder.trackingNumber,
        });
      }
      if (dmorder.lastMileTrackingNumber) {
        await cancelPickupForOrder({
          trackingOrOrderId: dmorder.lastMileTrackingNumber,
        });
      }
    }
  }

  async createDmoNCTReason(
    dmoNCTReason: DmoNCTReasonsDto,
    args: { userId: string; nctReasonName: string }
  ) {
    try {
      let nctReason: NCTReasonsDocument = null;
      if (!dmoNCTReason.nctReasonId) {
        nctReason = await this.getSpecificNCTReasons({
          name: args.nctReasonName,
        });
        dmoNCTReason.nctReasonId = nctReason?._id;
      }
      if (!args.nctReasonName) {
        nctReason = await this.getSpecificNCTReasons({
          _id: new Types.ObjectId(dmoNCTReason.nctReasonId),
        });
        args.nctReasonName = nctReason?.name;
      }
      const [err, data] = await this.deltaMachineRepository.createDmoNCTReason(
        dmoNCTReason,
        args.userId
      );
      await this.cancelShipment(args.nctReasonName, dmoNCTReason.dmoId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_DMO_NCT_REASON,
          exception.message
        );
      }
    }
  }
  async updateDmoNCTReason({ id, nctReasonId }: any) {
    try {
      const [dmoNCTReasonErr, dmoNCTReason] =
        await this.deltaMachineRepository.getDmoNCTReasonByOrderId(id);
      if (dmoNCTReasonErr) {
        this.error.errorCode = dmoNCTReason.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmoNCTReason.result.toString();
        this.error.message = dmoNCTReason.message;
        throw this.error;
      }
      const dmoNCTReasonDoc = dmoNCTReason.result as DmoNCTReasonsDocument;

      const nctReason = await this.getSpecificNCTReasons({
        _id: new Types.ObjectId(nctReasonId),
      });
      const [err, data] = await this.deltaMachineRepository.updateDmoNCTReason(
        { _id: dmoNCTReasonDoc._id },
        { nctReasonId, updatedAt: new Date() }
      );
      await this.cancelShipment(
        nctReason?.name,
        dmoNCTReasonDoc.dmoId.toString()
      );

      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      // Queue to check buyer withdrawal with cancellation fee
      this.bullMQService.addJob(
        {
          id: dmoNCTReasonDoc?.dmoId,
          type: JobTypes.REFUND_TO_BUYER,
          sellerPhone: dmoNCTReasonDoc?.orderId,
        },
        {
          delay: 0,
          removeOnComplete: true,
        }
      );
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO_NCT_REASONS,
          exception.message
        );
      }
    }
  }

  async importHistoricalDmoNCTReasons(request: NCTReasonsInputDto[]) {
    try {
      const [, nctReasonData] =
        await this.deltaMachineRepository.getNCTReasonList();
      const nctReasons = nctReasonData.result as NCTReasonsDocument[];
      const existingNCTReasonsMap = new Map();
      nctReasons.forEach(item => {
        existingNCTReasonsMap.set(item.toObject().id, item);
      });

      const dmoIds = request
        .filter(item => mongoose.isValidObjectId(item.DmoId))
        .map(item => new mongoose.Types.ObjectId(item.DmoId));
      const [, dmoNCTReasonData] =
        await this.deltaMachineRepository.getListDmoNCTReasonsByDmoIds(dmoIds);
      const dmoNCTReasonArr =
        dmoNCTReasonData.result as DmoNCTReasonsDocument[];
      const existingDmoNCTReasonMap = new Map();
      dmoNCTReasonArr.forEach(item => {
        existingDmoNCTReasonMap.set(item.toObject().dmoId.toString(), item);
      });

      const [, dmoData] =
        await this.deltaMachineRepository.getListDmoByOrderIds(dmoIds);
      const dmoArr = dmoData.result as DeltaMachineOrderDocument[];
      const existingDmoMap = new Map();
      dmoArr.forEach(item => {
        existingDmoMap.set(item.toObject().orderId.toString(), item);
      });
      const newDmoNCTReasonArr: DmoNCTReasonsDocument[] = [];
      await Promise.all(
        request?.map(async (nctReasonItem: NCTReasonsInputDto) => {
          const existingNCTReason = existingNCTReasonsMap.get(
            nctReasonItem.NctReasonId
          );
          if (!existingNCTReason) {
            logger.error('Invalid NctReasonId');
            return;
          }
          const existDmoNCTReason = existingDmoNCTReasonMap.get(
            nctReasonItem.DmoId
          );
          if (existDmoNCTReason) {
            return await this.deltaMachineRepository.updateDmoNCTReason(
              {
                dmoId: nctReasonItem.DmoId,
              },
              { nctReasonId: nctReasonItem.NctReasonId, updatedAt: new Date() }
            );
          }
          // add new DmoNCTReason
          const dmo = existingDmoMap.get(nctReasonItem.DmoId);
          if (!dmo) {
            logger.error('Invalid DmoId');
            return;
          }
          const newDmoNCTReason = {
            userId: '634d677fcdf0d90034dc7490',
            nctReasonId: nctReasonItem.NctReasonId,
            dmoId: nctReasonItem.DmoId,
            orderId: dmo.toObject().id,
          } as DmoNCTReasonsDocument;
          newDmoNCTReasonArr.push(newDmoNCTReason);
        })
      );
      if (newDmoNCTReasonArr.length > 0) {
        return await this.deltaMachineRepository.createNewDmoNCTReasons(
          newDmoNCTReasonArr
        );
      }

      return [false, 'Done to import historical nct reasons'];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO_NCT_REASONS,
          JSON.stringify(exception)
        );
      }
    }
  }

  async handleReservationOrderBullMqJob(dmoId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmoId);
      if (err) {
        throw data.message;
      }
      const dmOrder = data.result as DeltaMachineOrderDocument;
      const [statusError, statusData] =
        await this.deltaMachineRepository.getStatusById(dmOrder.statusId);
      if (statusError) {
        throw statusData.message;
      }
      const dmStatus = statusData.result as DeltaMachineStatusDocument;
      if (dmStatus.name !== 'new-order') {
        return;
      }
      await this.productRepository.updateProductStatus(
        dmOrder.orderData.productId,
        ProductOrderStatus.Available
      );
      const [, refundToBuyerStatusData] =
        await this.deltaMachineRepository.getStatusByName('refund-to-buyer');
      const refundToBuyer =
        refundToBuyerStatusData.result as DeltaMachineStatusDocument;
      await this.update(dmoId, {
        statusId: refundToBuyer.id,
        ...{ updatedAt: new Date() },
      });
      await this.updateAirTableRecordStatus(dmoId, refundToBuyer.id);
      await this.createActivityLogEvent(dmoId, refundToBuyer.id, '', '');
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }
  async findDmoNCTReasonByOrderId(
    orderId: string
  ): Promise<DmoNCTReasonsDocument> {
    const [dmoNCTReasonErr, dmoNCTReason] =
      await this.deltaMachineRepository.getDmoNCTReasonByOrderId(orderId);
    if (dmoNCTReasonErr) {
      return null;
    }
    return dmoNCTReason.result as DmoNCTReasonsDocument;
  }

  async updateDMOrder(
    dmOrderId: string,
    userId: string,
    userName: string,
    dataToUpdate: any,
    nctReasonId: string,
    dynamicTimerStatusIds: any
  ) {
    try {
      const dmOrder = await this.getById(dmOrderId);
      if (dataToUpdate?.statusId && dmOrder) {
        const [, data] = await this.deltaMachineRepository.update(
          { _id: dmOrderId },
          { ...dataToUpdate, ...{ updatedAt: new Date() } }
        );
        await this.createActivityLogEvent(
          dmOrderId,
          dataToUpdate.statusId,
          userId,
          userName
        );
        await this.updateAirTableRecordStatus(
          dmOrderId,
          dataToUpdate?.statusId
        );
        // Re-calculate the rates ...
        const orderData = await this.orderService.findOrderById(
          dmOrder.orderId
        );
        if (orderData) {
          await this.userRepository.updateRatesScan(orderData?.seller, false);
          await this.userRepository.updateRatesScan(orderData?.buyer, false);
        }
        // get setting_pickup_service_offering settings
        const [, currentSettingData] =
          await this.deltaMachineRepository.getSettingByKey(
            'setting_pickup_service_offering'
          );
        const currentSetting = getParsedValue(
          currentSettingData.value,
          currentSettingData.type
        );
        data.result = {
          ...data.result,
          isAvailableToPickup:
            currentSetting?.service?.pickupToggle?.value &&
            (data.result as DeltaMachineOrderDocument)?.isAvailableToPickup,
        };
        const dmOrderStatus = await this.getStatusById(dataToUpdate?.statusId);
        let delay = 93600000; // 26 hours delay
        let type: JobTypes = JobTypes.CONFIRMATION;
        let canAddJob = false;
        const toggleSettings = await this.getSettingByKey(
          'setting_om_status_automation'
        );
        if (
          dmOrderStatus?.name === DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY
        ) {
          if (toggleSettings?.automation?.refund?.value === true) {
            canAddJob = true;
          }
          const timeDifference =
            new Date().getTime() - dmOrder.createdAt.getTime();
          delay = 93600000 - timeDifference;
          delay = delay < 0 ? 0 : delay; // 26 hours delay
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP
        ) {
          if (
            toggleSettings?.automation?.backlog_unshipped_orders?.value === true
          ) {
            canAddJob = true;
            const timeDifference =
              new Date().getTime() - dmOrder.createdAt.getTime();
            delay = 115200000 - timeDifference;
            delay = delay < 0 ? 0 : delay; // 32 hours delay
            type = JobTypes.NOT_SHIPPED;
          }
        } else if (
          dmOrderStatus?.name ===
          DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP
        ) {
          if (
            toggleSettings?.automation?.backlog_unpicked_up_orders?.value ===
            true
          ) {
            canAddJob = true;
            const timeDifference =
              new Date().getTime() - dmOrder.createdAt.getTime();
            delay = 115200000 - timeDifference;
            delay = delay < 0 ? 0 : delay; // 32 hours delay
            type = JobTypes.NOT_PICKED;
          }
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.CONFIRMED_AVAILABILITY
        ) {
          if (
            toggleSettings?.automation?.await_shipping_pickup?.value === true
          ) {
            canAddJob = true;
            delay = 900000; // 15 minutes delay
            type = JobTypes.CONFIRMED_AVAILABILITY;
          }
        } else if (dmOrderStatus?.name === DeltaMachineStatusName.IN_TRANSIT) {
          if (
            toggleSettings?.automation?.backlog_intransit_orders?.value === true
          ) {
            canAddJob = true;
            delay =
              new Date().getTime() -
              dmOrder?.orderData?.shippingDate?.getTime();
            delay = delay >= 432000000 ? 0 : 432000000; // 120 hours delay
            type = JobTypes.IN_TRANSIT;
          }
          await this.handleOrderStatusUpdateFreshChatMessage(dmOrderId);
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.ITEM_DELIVERED
        ) {
          if (
            toggleSettings?.automation?.setting_item_delivered_automation
              ?.value === true
          ) {
            canAddJob = true;
            delay =
              new Date().getTime() -
              dmOrder?.orderData?.deliveryDate?.getTime();
            delay = delay >= 86400000 ? 0 : 86400000; // 24 hours delay
            type = JobTypes.ITEM_DELIVERED;
          }
          await this.handleOrderStatusUpdateFreshChatMessage(dmOrderId);
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.WAITING_FOR_FULL_AMOUNT
        ) {
          await this.handleOrderStatusUpdateFreshChatMessage(dmOrderId, true);
        }
        if (canAddJob) {
          this.bullMQService.addJob(
            {
              id: dmOrder.id,
              type,
            },
            {
              delay,
              removeOnComplete: true,
            }
          );
        }
        // Queue to check buyer withdrawal with cancellation fee
        this.bullMQService.addJob(
          {
            dmOrderId,
            type: JobTypes.REFUND_TO_BUYER,
            sellerPhone: '',
          },
          {
            delay: 0,
            removeOnComplete: true,
          }
        );
        if (dynamicTimerStatusIds.includes(dataToUpdate?.statusId)) {
          await this.sendWEUpdateOrderEvent(dmOrder?.orderId);
        }
        return [false, true];
      } else if (nctReasonId !== '') {
        try {
          await this.updateDmoNCTReason({
            id: dmOrder?.orderId,
            nctReasonId,
          });
        } catch (err) {
          const nctReasonObj = {
            nctReasonId,
            dmoId: dmOrder?.id,
            orderId: dmOrder?.orderId,
          };
          await this.createDmoNCTReason(nctReasonObj, {
            userId,
            nctReasonName: null,
          });
        }
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          exception.message
        );
      }
    }
  }

  async createDmOrderJob(newOrder: DeltaMachineOrderDocument) {
    this.bullMQService.createDMOrderJob(
      {
        id: newOrder?.orderId,
        type: JobTypes.CREATE_DM_ORDER,
        retryCount: 0,
      },
      { delay: 2000 },
      Queues.DM_ORDERS
    );
  }

  async createDMOrder(orderData: any, order: any, newOrder: any) {
    try {
      const returnedData: any = {};
      newOrder.orderData.buyerId = new mongoose.Types.ObjectId(
        newOrder.orderData.buyerId
      );
      newOrder.orderData.variantId = new mongoose.Types.ObjectId(
        newOrder.orderData.variantId
      );
      newOrder.orderData.sellerId = new mongoose.Types.ObjectId(
        newOrder.orderData.sellerId
      );
      const newOrderRes = await this.deltaMachineRepository.create(newOrder);
      const createdDmo = newOrderRes as DeltaMachineOrderDocument;
      const toggleSettings = await this.getSettingByKey(
        'setting_om_status_automation'
      ).catch(() => {});

      if (newOrder?.isReservation) {
        this.bullMQService.addJob(
          {
            type: JobTypes.RESERVATION_ORDER_VERIFICATION,
            id: createdDmo.id,
          },
          {
            delay: 2 * 24 * 60 * 60 * 1000, // 2 days delay to execute the job
            removeOnComplete: true,
          },
          Queues.DEFAULT
        );
      }
      if (toggleSettings?.automation?.refund?.value == true) {
        this.bullMQService.addJob(
          {
            id: createdDmo.id,
            type: JobTypes.CONFIRMATION,
          },
          {
            delay: 93600000, // 26 hours delay to execute the job
            removeOnComplete: true,
          }
        );
      }
      // Generate new product if from bulk-listing.
      const soldProduct = order.product as ILegacyProductModel;
      await this.listingGroupService.generateListingAfterSold(soldProduct);
      newOrder.orderData = orderData;
      createdDmo.isAirTableSynched = await this.createAirTableRecord(
        JSON.parse(JSON.stringify(newOrder)),
        orderData
      );
      returnedData.isAirTableSynched = createdDmo.isAirTableSynched;
      if (createdDmo?.isAirTableSynched) {
        createdDmo.isAirTableSynched = true;
        await this.deltaMachineRepository.update(
          { _id: createdDmo.id },
          { isAirTableSynched: true }
        );
        try {
          if (orderData?.addOns) {
            await this.createPickUpForAccessories(createdDmo?.id, orderData);
          }
          const isSellerCityRiyadh =
            orderData.sellerCity === Cities.RIYADH ||
            orderData.sellerCity === Cities.RIYADH_AR
              ? true
              : false;
          if (newOrder?.isRiyadhSpecificPickup && isSellerCityRiyadh) {
            await this.createPickUpForOrder(
              createdDmo.orderId,
              createdDmo?.id,
              newOrder?.isRiyadhSpecificPickup
            );
          }
        } catch (err) {}
      } else {
        SlackUtil.emitSlackMessageAlert(
          `Failed to add ${newOrder.orderData.orderNumber} to airtable`
        );
      }
      const settings = await this.getSettingByKey(
        'setting_wa_automation_dmo_phase_1'
      );
      // Re-calculate the rates
      await this.userRepository.updateRatesScan(order?.seller, false);
      await this.userRepository.updateRatesScan(order?.buyer, false);
      let sentOutBoundMsg = false;
      let isCategoryCarPlate = false;
      const variantNameArr = [];
      let productNameToSend = orderData?.productName || '';
      if (
        settings?.whatsapp?.buyer_processing?.value ||
        settings?.whatsapp?.seller_processing?.value
      ) {
        const categoryGrpc = await getCategoryByName({ name: 'Car Plates' });
        if (categoryGrpc?.id.toString() === orderData?.categoryId.toString()) {
          isCategoryCarPlate = true;
          const variant: any = await this.variantService.getVariantViaId(
            orderData?.variantId
          );
          for (const item of variant?.attributes) {
            if (item.options?.length) {
              variantNameArr.push(item.options[0].nameAr);
            }
          }
          productNameToSend = variantNameArr.join(' | ');
        }
      }
      const expressDeliveryFlag =
        await this.productService.checkExpressDeliveryFlag({
          sellerId: orderData.sellerId.toString(),
          productId: orderData.productId.toString(),
        });

      // Send outbound msg to buyer
      if (settings?.whatsapp?.buyer_processing?.value) {
        let buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_BUYER_PURCHASE;
        if (orderData?.isUAEListing) {
          buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_BUYER_PURCHASE_UAE;
        }
        if (orderData?.isReservation) {
          buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_POST_RESERVATION;
        }
        if (orderData?.isFinancing) {
          buyerTemplateName =
            process.env.FRESHCAT_TEMPLATE_SUCCESSFUL_CAR_RESERVATION_FINANCING;
        }
        if (isCategoryCarPlate) {
          buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_BUYER_CAR_PLATES;
        }
        if (expressDeliveryFlag) {
          buyerTemplateName =
            process.env.FRESHCHAT_TEMPLATE_BUYER_EXPRESS_DELIVERY;
        }
        try {
          const expectedDeliveryTime = orderData?.isUAEListing
            ? { minDeliveryTime: '3', maxDeliveryTime: '8' }
            : await this.expectedDeliveryTime(newOrder);
          // Prettier revert line back to this way and then length goes longer than expected
          // eslint-disable-next-line max-len
          let timeForDelivery = `${expectedDeliveryTime.minDeliveryTime} - ${expectedDeliveryTime.maxDeliveryTime}`;
          const sellerShippingTime = await this.getSellerShippingTime();
          const availabilityConfirmationTime =
            await this.getAvailabilityConfirmationTime();

          if (expressDeliveryFlag) {
            timeForDelivery = this.expectedDeliveryTimeOfExpressDelivery(
              orderData.buyerCity
            );
          }

          await this.freshchatService.sendOutboundMsg({
            templateName: buyerTemplateName,
            phoneNumber: orderData.buyerPhone,
            dmoId: createdDmo.id,
            productId: orderData.productId,
            productName: productNameToSend,
            orderId: newOrder.orderId,
            orderNumber: orderData.orderNumber,
            timeForDelivery: timeForDelivery,
            sellerShippingTime: sellerShippingTime,
            availabilityConfirmationTime: availabilityConfirmationTime,
          });
          sentOutBoundMsg = true;
        } catch (error) {
          console.log('Error on sending buyer reservation msg: ', error);
        }
      }
      // Send outbound msg to seller
      if (
        settings?.whatsapp?.seller_processing?.value &&
        !order?.isConsignment
      ) {
        let sellerTemplateName =
          settings?.whatsapp.seller_processing?.templateName ||
          process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V4;
        if (newOrder?.isAvailableToPickup) {
          sellerTemplateName =
            process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_PICKUP;
        }
        const walletPayoutSettings = await GetWalletPayoutSettings();
        const globalWalletToggle = await GetGlobalWalletToggle();
        if (walletPayoutSettings.value && globalWalletToggle.value) {
          sellerTemplateName =
            process.env
              .FRESHCHAT_TEMPLATE_SELLER_PROCESSING_WHEN_WALLET_PAYOUT_ON;
        }
        if (isCategoryCarPlate) {
          sellerTemplateName = process.env.FRESHCHAT_TEMPLATE_SELLER_CAR_PLATES;
        }
        try {
          let pdfLink = ' ';
          if (orderData?.canGenerateTrackingNumber) {
            pdfLink = `${process.env.SECOM_API_TRACK_ORDER_URL}${orderData.trackingNumber}`;
          }
          await this.freshchatService.sendOutboundMsg({
            templateName: sellerTemplateName,
            phoneNumber: orderData.sellerPhone,
            dmoId: createdDmo.id,
            productId: orderData.productId,
            productName: productNameToSend,
            orderId: newOrder.orderId,
            orderNumber: orderData.orderNumber,
            pdfLink,
            categoryId: orderData.categoryId,
          });
          sentOutBoundMsg = true;
        } catch (error) {
          console.log('Error on sending seller msg: ', error);
        }
      }
      // Update DMO
      if (sentOutBoundMsg) {
        returnedData.sentOutBoundMsg = sentOutBoundMsg;
        await this.deltaMachineRepository.update(
          { _id: createdDmo.id },
          { sendOutBoundMessage: true }
        );
      }

      // Create Pending credit for sellers' wallet
      const walletPayoutSettings = await GetWalletPayoutSettings();
      const globalWalletToggle = await GetGlobalWalletToggle();

      if (walletPayoutSettings.value && globalWalletToggle.value) {
        await CreateTransaction({
          ownerId: orderData.sellerId,
          type: 'Credit',
          amount: orderData.payoutAmount,
          orderId: newOrder.orderId,
          description: orderData.productName,
          metadata: { creditType: 'Payout' },
        });
      }

      const product = await this.productRepository.findProductById(
        orderData.productId
      );

      const condition = await getProductCondition({
        id: product.condition_id,
        variantId: product.varient_id,
        sellPrice: product.sell_price,
      } as GetProductCatConRequest);
      const priceRange = condition?.priceQuality?.name || null;
      const webEngageData = {
        'Seller ID': newOrder?.orderData.sellerId,
        'Seller Name': orderData?.sellerName || '',
        'Model Name': orderData?.modelName,
        Variants: orderData?.varient || '',
        'Product ID': orderData?.productId || '',
        'Timestamp of the listing creation': orderData?.createdAt || '',
        'Sell Price': orderData?.sellPrice || '',
        'Category Name': orderData?.categoryName || '',
        'Brand Name': orderData?.brandName,
        Condition: orderData?.productCondition,
        'Buy Price': orderData?.grandTotal,
        'Price Range': priceRange,
      };
      const webEngageDataSold = {
        'Seller ID': newOrder?.orderData.sellerId,
        'Seller Name': orderData?.sellerName || '',
        'Model Name': orderData?.modelName,
        Variants: orderData?.varient || '',
        'Product ID': orderData?.productId || '',
        'Created Time': orderData?.createdAt || '',
        'Sell Price': orderData?.sellPrice || '',
        'Category Name': orderData?.categoryName || '',
        'Brand Name': orderData?.brandName,
        'Listing Condition': orderData?.productCondition,
      };
      const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

      try {
        await sendEventData(
          newOrder?.orderData.sellerId || 'Unknown ID',
          'Product Sold',
          dateFormat,
          webEngageDataSold
        );

        await sendEventData(
          newOrder?.orderData.sellerId || 'Unknown ID',
          'Order Tracking Medium Timer',
          dateFormat,
          webEngageData
        );
      } catch (err) {
        logger.error('WebEngage ->', err);
      }
      const merchantOrder: MerchantMessage = {
        eventType: 'orderCreated',
        userId: orderData?.sellerId,
        userName: orderData?.sellerName,
        orderId: orderData?.orderId,
        orderNumber: orderData?.orderNumber,
        productId: orderData?.productId,
        productName: orderData?.productName,
        grandTotal: Number(orderData?.grandTotal),
        dmOrderId: orderData?.dmoId,
        description: '',
        modelName: orderData?.modelName,
        productGroupId: orderData?.listingGroupId,
      };
      await this.orderService.produceCreateOrderEvent(merchantOrder);
      await this.sendWECreateOrderEvent(orderData);
      return [false, returnedData];
    } catch (exception) {
      console.log(
        `Exception thrown while creating dm order ${orderData?.orderNumber}`
      );
      console.log({ exception });
      //11000 is code generated by mongodb if unique violation occur
      //if unique violation occur then order was already created.
      if (exception.name !== 'MongoError' || exception.code !== 11000) {
        SlackUtil.logErrorMessage(
          `Failed to add ${orderData?.orderNumber} to DM`,
          exception
        );
      }
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_DMO,
          exception.message
        );
      }
    }
  }

  async create(newOrder: DeltaMachineOrderDocument): Promise<OrderData | null> {
    let orderData: OrderData;
    try {
      const [error, dmOrderStatus] =
        await this.deltaMachineRepository.getStatusByName('new-order');
      if (error) {
        this.error.errorCode = dmOrderStatus.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmOrderStatus.result.toString();
        this.error.message = dmOrderStatus.message;
        throw this.error;
      }
      const deltaMachineStatusDocument =
        dmOrderStatus.result as DeltaMachineStatusDocument;
      newOrder.statusId = deltaMachineStatusDocument?._id;
      const orders = await this.orderService.findOrdersById([newOrder.orderId]);
      if (orders?.length) {
        orderData = this.populateOrdersData(orders[0]);
        // If not in orderData, try to build from microservice
        if (!orderData.questionsAndAnswers) {
          const responses = await GetResponsesOfProduct({
            productId: orderData.productId,
          });
          const questionAnswer = responses?.responses?.map((item: any) => {
            return {
              question: item.questionAr,
              answer: item.answers?.[0]?.optionAr || item.answers?.[0]?.text,
            };
          });
          if (questionAnswer) {
            orderData.questionsAndAnswers = JSON.stringify(questionAnswer);
          }
        }

        newOrder.paymentType = orderData.paymentType;
        const [errAddress, data] = await this.userService.getListUserAddress(
          orders[0]?.buyer
        );
        if (!errAddress) {
          const buyerAddresses = data.result as AddressDocument[];
          if (buyerAddresses.length) {
            const buyerAddress = buyerAddresses.pop();
            orderData.buyerCity = buyerAddress?.city || orderData.buyerCity;
            if (buyerAddress?.street) {
              orderData.buyerAddress = `${buyerAddress?.street}
              ${buyerAddress?.district || ''}
              ${buyerAddress?.postal_code || ''}`;
            }
            orderData.buyerStreet =
              buyerAddress?.street || orderData.buyerStreet;
            orderData.buyerPostalCode =
              buyerAddress?.postal_code || orderData.buyerPostalCode;
            orderData.buyerDistrict =
              buyerAddress?.district || orderData.buyerDistrict;
          }
        }
        const [errSellerAddress, sellerData] =
          await this.userService.getListUserAddress(orders[0]?.seller);
        if (!errSellerAddress) {
          const sellerAddresses = sellerData.result as AddressDocument[];
          if (sellerAddresses.length) {
            const sellerAddress = sellerAddresses.pop();
            orderData.sellerCity = sellerAddress?.city || orderData.sellerCity;
            if (sellerAddress?.street) {
              orderData.sellerAddress = `${sellerAddress?.street}
              ${sellerAddress?.district || ''}
              ${sellerAddress?.postal_code || ''}`;
            }
            orderData.sellerStreet =
              sellerAddress?.street || orderData.sellerStreet;
            orderData.sellerPostalCode =
              sellerAddress?.postal_code || orderData.sellerPostalCode;
            orderData.sellerDistrict =
              sellerAddress?.district || orderData.sellerDistrict;
          }
        }
        newOrder.isRiyadhSpecificPickup = false;
        newOrder.trackingNumber = ' ';
        orderData.orderType = this.setOrderType(orderData);
        const [, sysSettings] =
          await this.settingService.getSettingsObjectByKeys([
            'riyadh_specific_pickup_only',
          ]);
        const isRiyadhSpecificPickup =
          sysSettings['riyadh_specific_pickup_only'];
        const isSellerCityRiyadh =
          orderData.sellerCity === Cities.RIYADH ||
          orderData.sellerCity === Cities.RIYADH_AR
            ? true
            : false;
        const isSellerCityJeddah =
          orderData.sellerCity === Cities.JEDDAH ||
          orderData.sellerCity === Cities.JEDDAH_AR
            ? true
            : false;
        const sellerId = orderData?.sellerId?.toString();
        const vaultSettings = await getSecretData('/secret/data/apiv2');
        const limitSMSASettings = JSON.parse(
          vaultSettings['limitSMSA'] || '[]'
        );
        let canGenerateTrackingNumber = true;
        const orderDataCopy = _cloneDeep(orderData);
        orderDataCopy.sellerPhone = process.env.SOUM_NUMBER;
        orderDataCopy.sellerName = process.env.SOUM_SELLER_NAME;
        orderDataCopy.sellerAddress = process.env.SOUM_SELLER_RIYADH_ADDRESS;
        orderDataCopy.sellerCity = Cities.RIYADH;
        if (isRiyadhSpecificPickup && isSellerCityRiyadh) {
          newOrder.isRiyadhSpecificPickup = true;
        }

        if (orderData.isConsignment) {
          canGenerateTrackingNumber = false;
        }
        if (isSellerCityRiyadh) {
          canGenerateTrackingNumber = false;
        } else if (isSellerCityJeddah) {
          const selectSellersForAutomation = JSON.parse(
            vaultSettings['selectSellersForAutomation'] || '[]'
          );
          if (
            selectSellersForAutomation.find(
              (sellerPhoneNumber: string) =>
                sellerPhoneNumber === orderData?.sellerPhone
            )
          ) {
            orderDataCopy.sellerAddress =
              process.env.SOUM_SELLER_JEDDAH_ADDRESS;
            orderDataCopy.sellerCity = Cities.JEDDAH;
            canGenerateTrackingNumber = false;
            newOrder.isRiyadhSpecificPickup = true;
          }
        }
        if (
          limitSMSASettings.find(
            (limitSMSAId: string) => limitSMSAId === sellerId
          )
        ) {
          newOrder.trackingNumber = ' ';
          canGenerateTrackingNumber = false;
          orderData.failedInspectionFlag = true;
        }
        orderDataCopy.orderNumber = `${orderDataCopy.orderNumber}_lastmile`;
        // newOrder.lastMileTrackingNumber = await this.generatetrackingNumber(
        //   `${newOrder.orderId}_lastmile`,
        //   orderDataCopy
        // );

        const [buyerErr, orderDetailBuyer] =
          await this.orderService.getOrderDetail(newOrder.orderId, 'buyer');
        if (!buyerErr) {
          orderData.grandTotal = orderDetailBuyer.order.grand_total;
          orderData.buyerPromoCode = orderDetailBuyer.order.promo_code;
          orderData.deliveryFee = orderDetailBuyer.order.delivery_fee;
          orderData.shippingAmount = orderDetailBuyer.order.shipping_charge;
        }
        newOrder.lastMileTrackingNumber = await this.handleShipmentCreation(
          ShipmentTypeEnum.LAST_MILE,
          orderData,
          newOrder.orderId
        );
        if (canGenerateTrackingNumber) {
          orderDataCopy.sellerAddress = orderData.sellerAddress;
          orderDataCopy.sellerPhone = orderData.sellerPhone;
          orderDataCopy.sellerName = orderData.sellerName;
          orderDataCopy.sellerCity = orderData.sellerCity;
          orderDataCopy.buyerAddress = process.env.SOUM_SELLER_RIYADH_ADDRESS;
          orderDataCopy.buyerPhone = process.env.SOUM_NUMBER;
          orderDataCopy.buyerName = process.env.SOUM_SELLER_NAME;
          orderDataCopy.buyerCity = Cities.RIYADH;
          orderDataCopy.orderNumber = orderData.orderNumber;
          // newOrder.trackingNumber = await this.generatetrackingNumber(
          //   newOrder.orderId,
          //   orderDataCopy
          // );

          newOrder.trackingNumber = await this.handleShipmentCreation(
            ShipmentTypeEnum.FIRST_MILE,
            orderData,
            newOrder.orderId
          );
        }
        orderData.trackingNumber = newOrder.trackingNumber;
        orderData.lastMileTrackingNumber = newOrder.lastMileTrackingNumber;
        const [sellerErr, orderDetailSeller] =
          await this.orderService.getOrderDetail(newOrder.orderId, 'seller');
        if (!sellerErr) {
          orderData.payoutAmount = orderDetailSeller.order.grand_total;
          orderData.sellPrice = orderDetailSeller.order.sell_price;
          orderData.sellerPromoCode = orderDetailSeller.order.promo_code;
          orderData.commissionAmount =
            orderDetailSeller.order.commission.toString();
          orderData.vatAmount = orderDetailSeller.order.vat.toString();
          orderData.deliveryFee = orderDetailSeller.order.delivery_fee;
        }
        try {
          orderData.sellerIBAN = decryptIBAN(
            _get(orderData, 'sellerIBAN', ''),
            _get(orderData, 'sellerSecretKey', '')
          );
        } catch (err) {}
        // check if seller has any holding penalty balance
        const penalty = await GetHoldingPenaltyBalance({
          sellerId,
        });
        const penaltyFee = Number(penalty?.amount || 0);
        if (penaltyFee > 0) {
          const condition = await getProductCondition({
            id: orderData?.conditionId,
            variantId: orderData?.variantId,
            sellPrice: Number(orderData?.sellPrice),
          } as GetProductCatConRequest);
          const priceRange = condition?.priceQuality?.name || null;
          try {
            await addSellerCommissionPenalty({
              product: {
                id: orderData?.productId,
                priceRange: priceRange?.toString() || '',
              },
              sellerNewCommission: penaltyFee,
            });
          } catch (err) {}
          const [, orderSellerPenalty] = await this.orderService.getOrderDetail(
            newOrder.orderId,
            'seller'
          );
          orderData.payoutAmount = orderSellerPenalty.order.grand_total;
          orderData.commissionAmount =
            orderSellerPenalty.order.commission.toString();
          orderData.vatAmount = orderSellerPenalty.order.vat.toString();
        }
        newOrder.orderData = {
          orderNumber: orderData?.orderNumber,
          productId: orderData?.productId,
          productName: orderData?.productName,
          orderType: orderData?.orderType,
          orderStatus: orderData?.orderStatus,
          grandTotal: orderData?.grandTotal,
          payoutAmount: orderData?.payoutAmount,
          sellPrice: orderData?.sellPrice,
          paymentStatus: orderData?.paymentStatus,
          paymentType: orderData?.paymentType,
          createdAt: orderData?.createdAt,
          captureStatus:
            newOrder?.captureStatus || DeltaMachineBNPLStatuses.CAPTURED,
          trackingNumber: orderData?.trackingNumber,
          buyerId: orderData?.buyerId,
          sellerId: orderData?.sellerId,
          buyerName: orderData?.buyerName,
          sellerName: orderData?.sellerName,
          variantId: orderData?.variantId,
          productNameAr: orderData?.productNameAr,
          penalty: penaltyFee,
          isReservation: orderData?.isReservation,
          isFinancing: orderData?.isFinancing,
          replacedOrderId: '',
          replacedProductId: '',
          inventoryId: orderData?.inventoryId,
          isConsignment: orderData?.isConsignment,
          buyerLongitude: orderData.buyerLongitude,
          buyerLatitude: orderData.buyerLatitude,
          sellerLongitude: orderData.sellerLongitude,
          sellerLatitude: orderData.sellerLatitude,
        };
        newOrder.shipmentService = vaultSettings['shipmentService'] || 'SMSA';
        const newOrderRes = await this.deltaMachineRepository.create(newOrder);
        if (orderData?.isConsignment) {
          const consignmentOrderNumber = orderData?.orderNumber.split('_')[0];
          await updateConsignmentStatus({
            status: ConsignmentStatus.PAYOUT_TO_SELLER,
            orderNumber: consignmentOrderNumber,
          });
        }
        const createdDmo = newOrderRes as DeltaMachineOrderDocument;
        const toggleSettings = await this.getSettingByKey(
          'setting_om_status_automation'
        ).catch(() => {});

        if (orderData?.isReservation) {
          this.bullMQService.addJob(
            {
              type: JobTypes.RESERVATION_ORDER_VERIFICATION,
              id: createdDmo.id,
            },
            {
              delay: 2 * 24 * 60 * 60 * 1000, // 2 days delay to execute the job
              removeOnComplete: true,
            },
            Queues.DEFAULT
          );
        }
        if (toggleSettings?.automation?.refund?.value == true) {
          this.bullMQService.addJob(
            {
              id: createdDmo.id,
              type: JobTypes.CONFIRMATION,
            },
            {
              delay: 93600000, // 26 hours delay to execute the job
              removeOnComplete: true,
            }
          );
        }
        if (penaltyFee > 0) {
          // deduct holding penalty after seller payout action
          await UpdateHoldingPenalty({
            sellerId,
            dmoId: createdDmo.id,
            isPayout: false,
          });
        }
        orderData.dmoId = createdDmo.id;
        newOrder.orderData = orderData;
        newOrder.orderData.brandName = orderData.brandName;
        newOrder.orderData.productImgs = orderData.productImgs;
        newOrder.orderData.buyerDistrict = orderData.buyerDistrict;
        newOrder.orderData.availableLogisticsServices = ' ';
        let isAvailableToPickup = false;
        let vendorId = '';
        let isAvailableToOneService = false;
        let serviceId = '';
        if (newOrder?.orderData) {
          try {
            // Generate new product if from bulk-listing.
            const soldProduct = orders[0].product as ILegacyProductModel;
            await this.listingGroupService.generateListingAfterSold(
              soldProduct
            );
            const sellerCityTierObj = await GetCityTiers({
              name: newOrder.orderData.sellerCity,
            });
            const buyerCityTierObj = await GetCityTiers({
              name: newOrder.orderData.buyerCity,
            });
            if (sellerCityTierObj?.sellerTier && buyerCityTierObj?.buyerTier) {
              const sellerCityTier = sellerCityTierObj?.sellerTier;
              const buyerCityTier = buyerCityTierObj?.buyerTier;
              const logisticServiceObj = await MapLogisticsServices({
                sellerCityTier: sellerCityTier,
                buyerCityTier: buyerCityTier,
                isKeySeller: newOrder.orderData.isKeySeller,
              });
              newOrder.orderData.availableLogisticsServices =
                logisticServiceObj?.logisticServices || ' ';
              isAvailableToPickup = logisticServiceObj?.isAvailableToPickup;
              vendorId = logisticServiceObj?.vendorId;
              serviceId = logisticServiceObj?.serviceId;
              isAvailableToOneService =
                logisticServiceObj?.isAvailableToOneService;
            }
          } catch (err) {}
        }
        if (isAvailableToPickup) {
          await this.deltaMachineRepository.update(
            { _id: createdDmo.id },
            { isAvailableToPickup }
          );
        }
        if (isAvailableToOneService) {
          await this.deltaMachineRepository.update(
            { _id: createdDmo.id },
            { vendorId, serviceId }
          );
        }
        if (orders[0]?.addOns) {
          const orderAddOns = orders[0].addOns as any;
          newOrder.orderData.addOns =
            orderAddOns.selectedAddOns
              ?.map((addOn: any) => {
                const name = addOn?.addOnName ? addOn.addOnName : addOn.name;
                return `${name}`;
              })
              .join(',') || '';

          const warrantyAddOn = orderAddOns.selectedAddOns.find(
            (addOn: any) => addOn.addOnType === AddonType.WARRANTY
          );
          if (warrantyAddOn) {
            newOrder.orderData.addOnsDescription =
              warrantyAddOn.description || '';
            newOrder.orderData.addOnsValidity = warrantyAddOn.validity || '';
          }
        }
        const location = orderData.failedInspectionFlag
          ? Cities.JEDDAH
          : Cities.RIYADH;
        const mappingOrderData = _cloneDeep(orderData);
        newOrder.orderData.failedInspectionLabel =
          await this.createFailedInspectionLabel(
            newOrder.orderId,
            mappingOrderData,
            location
          );
        createdDmo.isAirTableSynched = await this.createAirTableRecord(
          JSON.parse(JSON.stringify(newOrder)),
          orderData
        );
        if (createdDmo?.isAirTableSynched) {
          createdDmo.isAirTableSynched = true;
          await this.deltaMachineRepository.update(
            { _id: createdDmo.id },
            { isAirTableSynched: true }
          );
          if (orderData?.addOns) {
            await this.createPickUpForAccessories(createdDmo?.id, orderData);
          }
          const isSellerCityRiyadh =
            orderData.sellerCity === Cities.RIYADH ||
            orderData.sellerCity === Cities.RIYADH_AR
              ? true
              : false;
          if (isRiyadhSpecificPickup && isSellerCityRiyadh) {
            await this.createPickUpForOrder(
              createdDmo.orderId,
              createdDmo?.id,
              isRiyadhSpecificPickup
            );
          }
        } else {
          SlackUtil.emitSlackMessageAlert(
            `Failed to add ${newOrder.orderData.orderNumber} to airtable`
          );
        }
        await this.addJobToAutoConfirmAvailability(createdDmo?.id, sellerId);
        const settings = await this.getSettingByKey(
          'setting_wa_automation_dmo_phase_1'
        );
        // Re-calculate the rates
        await this.userRepository.updateRatesScan(orders[0]?.seller, false);
        await this.userRepository.updateRatesScan(orders[0]?.buyer, false);
        let sentOutBoundMsg = false;
        let isCategoryCarPlate = false;
        const variantNameArr = [];
        let productNameToSend = orderData?.productName || '';
        if (
          settings?.whatsapp?.buyer_processing?.value ||
          settings?.whatsapp?.seller_processing?.value
        ) {
          const categoryGrpc = await getCategoryByName({ name: 'Car Plates' });
          if (
            categoryGrpc?.id.toString() === orderData?.categoryId.toString()
          ) {
            isCategoryCarPlate = true;
            const variant: any = await this.variantService.getVariantViaId(
              orderData?.variantId
            );
            for (const item of variant?.attributes) {
              if (item.options?.length) {
                variantNameArr.push(item.options[0].nameAr);
              }
            }
            productNameToSend = variantNameArr.join(' | ');
          }
        }
        const [expressDelivery, fbsExpressDelivery] = await Promise.all([
          this.productService.checkExpressDeliveryFlag({
            sellerId: orderData.sellerId.toString(),
            productId: orderData.productId.toString(),
          }),
          this.productService.checkFBSExpressDeliveryFlag({
            sellerId: orderData.sellerId.toString(),
          }),
        ]);
        const expressDeliveryFlag = expressDelivery || fbsExpressDelivery;

        // Send outbound msg to buyer
        if (settings?.whatsapp?.buyer_processing?.value) {
          let buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_BUYER_PURCHASE;
          if (orderData?.isUAEListing) {
            buyerTemplateName =
              process.env.FRESHCHAT_TEMPLATE_BUYER_PURCHASE_UAE;
          }
          if (orderData?.isReservation) {
            buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_POST_RESERVATION;
          }
          if (orderData?.isFinancing) {
            buyerTemplateName =
              process.env
                .FRESHCAT_TEMPLATE_SUCCESSFUL_CAR_RESERVATION_FINANCING;
          }
          if (isCategoryCarPlate) {
            buyerTemplateName = process.env.FRESHCHAT_TEMPLATE_BUYER_CAR_PLATES;
          }
          if (expressDeliveryFlag) {
            buyerTemplateName =
              process.env.FRESHCHAT_TEMPLATE_BUYER_EXPRESS_DELIVERY;
          }
          try {
            const expectedDeliveryTime = orderData?.isUAEListing
              ? { minDeliveryTime: '3', maxDeliveryTime: '8' }
              : await this.expectedDeliveryTime(newOrder);
            // Prettier revert line back to this way and then length goes longer than expected
            // eslint-disable-next-line max-len
            let timeForDelivery = `${expectedDeliveryTime.minDeliveryTime} - ${expectedDeliveryTime.maxDeliveryTime}`;
            const sellerShippingTime = await this.getSellerShippingTime();
            const availabilityConfirmationTime =
              await this.getAvailabilityConfirmationTime();

            if (expressDeliveryFlag) {
              timeForDelivery = this.expectedDeliveryTimeOfExpressDelivery(
                orderData.buyerCity
              );
            }

            await this.freshchatService.sendOutboundMsg({
              templateName: buyerTemplateName,
              phoneNumber: orderData.buyerPhone,
              dmoId: createdDmo.id,
              productId: orderData.productId,
              productName: productNameToSend,
              orderId: newOrder.orderId,
              orderNumber: orderData.orderNumber,
              timeForDelivery: timeForDelivery,
              sellerShippingTime: sellerShippingTime,
              availabilityConfirmationTime: availabilityConfirmationTime,
            });
            sentOutBoundMsg = true;
          } catch (error) {
            console.log('Error on sending buyer reservation msg: ', error);
          }
        }
        // Send outbound msg to seller
        if (settings?.whatsapp?.seller_processing?.value) {
          let sellerTemplateName =
            settings?.whatsapp.seller_processing?.templateName ||
            process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V4;
          if (isAvailableToPickup) {
            sellerTemplateName =
              process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_PICKUP;
          }
          const walletPayoutSettings = await GetWalletPayoutSettings();
          const globalWalletToggle = await GetGlobalWalletToggle();
          if (walletPayoutSettings.value && globalWalletToggle.value) {
            sellerTemplateName =
              process.env
                .FRESHCHAT_TEMPLATE_SELLER_PROCESSING_WHEN_WALLET_PAYOUT_ON;
          }
          if (isCategoryCarPlate) {
            sellerTemplateName =
              process.env.FRESHCHAT_TEMPLATE_SELLER_CAR_PLATES;
          }
          try {
            let pdfLink = ' ';
            if (canGenerateTrackingNumber) {
              pdfLink = `${process.env.SECOM_API_TRACK_ORDER_URL}${orderData.trackingNumber}`;
            }
            await this.freshchatService.sendOutboundMsg({
              templateName: sellerTemplateName,
              phoneNumber: orderData.sellerPhone,
              dmoId: createdDmo.id,
              productId: orderData.productId,
              productName: productNameToSend,
              orderId: newOrder.orderId,
              orderNumber: orderData.orderNumber,
              pdfLink,
              categoryId: orderData.categoryId,
            });
            sentOutBoundMsg = true;
          } catch (error) {
            console.log('Error on sending seller msg: ', error);
          }
        }
        // Update DMO
        if (sentOutBoundMsg) {
          await this.deltaMachineRepository.update(
            { _id: createdDmo.id },
            { sendOutBoundMessage: true }
          );
        }

        // Create Pending credit for sellers' wallet
        const walletPayoutSettings = await GetWalletPayoutSettings();
        const globalWalletToggle = await GetGlobalWalletToggle();

        if (walletPayoutSettings.value && globalWalletToggle.value) {
          await CreateTransaction({
            ownerId: orderData.sellerId,
            type: 'Credit',
            amount: orderData.payoutAmount,
            orderId: newOrder.orderId,
            description: orderData.productName,
            metadata: { creditType: 'Payout' },
          });
        }

        const product = await this.productRepository.findProductById(
          orderData.productId
        );

        const condition = await getProductCondition({
          id: product.condition_id,
          variantId: product.varient_id,
          sellPrice: product.sell_price,
        } as GetProductCatConRequest);
        const priceRange = condition?.priceQuality?.name || null;
        const webEngageData = {
          'Seller ID': sellerId,
          'Seller Name': orderData?.sellerName || '',
          'Model Name': orderData?.modelName,
          Variants: orderData?.varient || '',
          'Product ID': orderData?.productId || '',
          'Timestamp of the listing creation': orderData?.createdAt || '',
          'Sell Price': orderData?.sellPrice || '',
          'Category Name': orderData?.categoryName || '',
          'Brand Name': orderData?.brandName,
          Condition: orderData?.productCondition,
          'Buy Price': orderData?.grandTotal,
          'Price Range': priceRange,
        };
        const webEngageDataSold = {
          'Seller ID': sellerId,
          'Seller Name': orderData?.sellerName || '',
          'Model Name': orderData?.modelName,
          Variants: orderData?.varient || '',
          'Product ID': orderData?.productId || '',
          'Created Time': orderData?.createdAt || '',
          'Sell Price': orderData?.sellPrice || '',
          'Category Name': orderData?.categoryName || '',
          'Brand Name': orderData?.brandName,
          'Listing Condition': orderData?.productCondition,
        };
        const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

        try {
          await sendEventData(
            sellerId || 'Unknown ID',
            'Product Sold',
            dateFormat,
            webEngageDataSold
          );

          await sendEventData(
            sellerId || 'Unknown ID',
            'Order Tracking Medium Timer',
            dateFormat,
            webEngageData
          );
        } catch (err) {
          logger.error('WebEngage ->', err);
        }
        const merchantOrder: MerchantMessage = {
          eventType: 'orderCreated',
          userId: orderData?.sellerId,
          userName: orderData?.sellerName,
          orderId: orderData?.orderId,
          orderNumber: orderData?.orderNumber,
          productId: orderData?.productId,
          productName: orderData?.productName,
          grandTotal: Number(orderData?.grandTotal),
          dmOrderId: orderData?.dmoId,
          description: '',
          modelName: orderData?.modelName,
          productGroupId: orderData?.listingGroupId,
        };
        await this.orderService.produceCreateOrderEvent(merchantOrder);
        await this.sendWECreateOrderEvent(orderData);
        return orderData;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ORDER,
          ''
        );
      }
    } catch (exception) {
      console.log(
        `Exception thrown while creating dm order ${orderData?.orderNumber}`
      );
      console.log({ exception });
      //11000 is code generated by mongodb if unique violation occur
      //if unique violation occur then order was already created.
      if (exception.name !== 'MongoError' || exception.code !== 11000) {
        SlackUtil.logErrorMessage(
          `Failed to add ${orderData?.orderNumber} to DM`,
          exception
        );
      }
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_DMO,
          exception.message
        );
      }
    }
  }

  async getAvailabilityConfirmationTime() {
    const [settingError, setting] =
      await this.settingRepository.getSettingByKey(
        'availability_confirmation_time'
      );
    if (settingError) {
      //dont want to stop automation
      return 'ساعتين';
    }
    if (setting.value === 1) {
      return 'ساعة واحدة';
    }
    if (setting.value === 2) {
      return 'ساعتين';
    }
    if (setting.value >= 3 && setting.value <= 10) {
      return `${setting.value} ساعات`;
    }
    return `${setting.value} ساعة`;
  }

  async getSellerShippingTime() {
    const [settingError, setting] =
      await this.settingRepository.getSettingByKey('seller_shipping_time');
    if (settingError) {
      //dont want to stop automation
      return 'ساعتين';
    }
    if (setting.value === 1) {
      return 'ساعة واحدة';
    }
    if (setting.value === 2) {
      return 'ساعتين';
    }
    if (setting.value >= 3 && setting.value <= 10) {
      return `${setting.value} ساعات`;
    }
    return `${setting.value} ساعة`;
  }
  async expectedDeliveryTime(
    dmOrder: DeltaMachineOrderDocument
  ): Promise<{ minDeliveryTime: string; maxDeliveryTime: string }> {
    const defaultValue = {
      minDeliveryTime: '4',
      maxDeliveryTime: '7',
    };
    const [settingError, setting] =
      await this.settingRepository.getSettingByKey('delivery_rules');
    const [sellerAddressError, sellerAddressResult] =
      await this.addressRepository.getUserAddress(dmOrder.orderData.sellerId);
    const [orderError, orderResult] = await this.orderRepository.getById(
      dmOrder.orderId
    );
    if (
      settingError ||
      orderError ||
      sellerAddressError ||
      !sellerAddressResult.result.length
    ) {
      return defaultValue;
    }
    const order = orderResult.result as OrderDocument;
    const sellerAddress = sellerAddressResult.result[0] as AddressDocument;
    const buyerCity = order.buyer_address?.city || '';
    const sellerCity = sellerAddress?.city || '';
    const parsedSetting = JSON.parse(setting.value);
    const sellerCitySetting = parsedSetting.filter(
      (value: any) =>
        value?.from === sellerCity || value?.from_ar === sellerCity
    );
    if (!sellerCitySetting || !sellerCitySetting.length) {
      return defaultValue;
    }
    const buyerRule = sellerCitySetting[0].delivery_rule.filter(
      (value: any) => value?.to === buyerCity || value?.to_ar === buyerCity
    );
    if (
      !buyerRule ||
      !buyerRule.length ||
      !buyerRule[0].min_expected_delivery_time
    ) {
      return defaultValue;
    }
    return {
      minDeliveryTime: buyerRule[0].min_expected_delivery_time,
      maxDeliveryTime: buyerRule[0].max_expected_delivery_time,
    };
  }
  expectedDeliveryTimeOfExpressDelivery(buyerCity: string): string {
    if (isCityMatch(buyerCity, CitiesNames.RIYADH)) {
      return '0 - 1 يوم عمل';
    }
    if (
      isCityMatch(buyerCity, CitiesNames.JEDDAH) ||
      isCityMatch(buyerCity, CitiesNames.DAMMAM)
    ) {
      return '2 - 3 أيام عمل';
    }

    return '3 - 4 أيام عمل';
  }

  async update(id: string, dataToUpdate: any) {
    try {
      const [err, data] = await this.deltaMachineRepository.update(
        { _id: id },
        { ...dataToUpdate, ...{ updatedAt: new Date() } }
      );
      const [errOrder, order] = await this.deltaMachineRepository.getById(id);

      if (err || errOrder) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      // Re-calculate the rates ...
      const orderData = await this.orderService.findOrderById(
        (order.result as DeltaMachineOrderDocument).orderId
      );
      if (orderData) {
        await this.userRepository.updateRatesScan(orderData?.seller, false);
        await this.userRepository.updateRatesScan(orderData?.buyer, false);
      }
      // get setting_pickup_service_offering settings
      const [, currentSettingData] =
        await this.deltaMachineRepository.getSettingByKey(
          'setting_pickup_service_offering'
        );
      const currentSetting = getParsedValue(
        currentSettingData.value,
        currentSettingData.type
      );
      data.result = {
        ...data.result,
        isAvailableToPickup:
          currentSetting?.service?.pickupToggle?.value &&
          (data.result as DeltaMachineOrderDocument)?.isAvailableToPickup,
      };
      try {
        const dmOrderStatus = await this.getStatusById(dataToUpdate?.statusId);
        const dmOrder = await this.getById(id);
        let delay = 93600000; // 26 hours delay
        let type: JobTypes = JobTypes.CONFIRMATION;
        let canAddJob = false;
        const toggleSettings = await this.getSettingByKey(
          'setting_om_status_automation'
        );
        if (dmOrderStatus?.name === DeltaMachineStatusName.TRANSFERRED) {
          try {
            const sellerData = await GetUserData({
              userId: dmOrder?.orderData.sellerId,
            });
            const buyerData = await GetUserData({
              userId: dmOrder?.orderData.buyerId,
            });
            // create invoice in OM 2.0 when status is updated to transferred status
            await createInvoice({
              orderId: dmOrder?.orderId,
              userType: 'seller',
              invoiceType: 'invoice',
              eventName: `${DeltaMachineStatusName.PAYOUT_TO_SELLER} to ${DeltaMachineStatusName.TRANSFERRED}`,
              buyerBusinessModel: buyerData?.businessModel,
              sellerBusinessModel: sellerData?.businessModel,
            });
          } catch (err) {
            console.log(err);
          }
        }
        if (
          dmOrderStatus?.name === DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY
        ) {
          if (toggleSettings?.automation?.refund?.value === true) {
            canAddJob = true;
          }
          const timeDifference =
            new Date().getTime() - dmOrder.createdAt.getTime();
          delay = 93600000 - timeDifference;
          delay = delay < 0 ? 0 : delay; // 26 hours delay
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP
        ) {
          if (
            toggleSettings?.automation?.backlog_unshipped_orders?.value === true
          ) {
            canAddJob = true;
            const timeDifference =
              new Date().getTime() - dmOrder.createdAt.getTime();
            delay = 115200000 - timeDifference;
            delay = delay < 0 ? 0 : delay; // 32 hours delay
            type = JobTypes.NOT_SHIPPED;
          }
        } else if (
          dmOrderStatus?.name ===
          DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP
        ) {
          if (
            toggleSettings?.automation?.backlog_unpicked_up_orders?.value ===
            true
          ) {
            canAddJob = true;
            const timeDifference =
              new Date().getTime() - dmOrder.createdAt.getTime();
            delay = 115200000 - timeDifference;
            delay = delay < 0 ? 0 : delay; // 32 hours delay
            type = JobTypes.NOT_PICKED;
          }
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.CONFIRMED_AVAILABILITY
        ) {
          if (
            toggleSettings?.automation?.await_shipping_pickup?.value === true
          ) {
            canAddJob = true;
            delay = 900000; // 15 minutes delay
            type = JobTypes.CONFIRMED_AVAILABILITY;
          }
        } else if (dmOrderStatus?.name === DeltaMachineStatusName.IN_TRANSIT) {
          if (
            toggleSettings?.automation?.backlog_intransit_orders?.value === true
          ) {
            canAddJob = true;
            delay =
              new Date().getTime() -
              dmOrder?.orderData?.shippingDate?.getTime();
            delay = delay >= 432000000 ? 0 : 432000000; // 120 hours delay
            type = JobTypes.IN_TRANSIT;
          }

          await this.handleOrderStatusUpdateFreshChatMessage(id);
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.ITEM_DELIVERED
        ) {
          if (
            toggleSettings?.automation?.setting_item_delivered_automation
              ?.value === true
          ) {
            canAddJob = true;
            delay =
              new Date().getTime() -
              dmOrder?.orderData?.deliveryDate?.getTime();
            delay = delay >= 86400000 ? 0 : 86400000; // 24 hours delay
            type = JobTypes.ITEM_DELIVERED;
          }
          await this.handleOrderStatusUpdateFreshChatMessage(id);
        } else if (
          dmOrderStatus?.name === DeltaMachineStatusName.WAITING_FOR_FULL_AMOUNT
        ) {
          await this.handleOrderStatusUpdateFreshChatMessage(id, true);
        }
        if (canAddJob) {
          this.bullMQService.addJob(
            {
              id: dmOrder.id,
              type,
            },
            {
              delay,
              removeOnComplete: true,
            }
          );
        }
        // Queue to check buyer withdrawal with cancellation fee
        this.bullMQService.addJob(
          {
            id,
            type: JobTypes.REFUND_TO_BUYER,
            sellerPhone: '',
          },
          {
            delay: 0,
            removeOnComplete: true,
          }
        );
        return data;
      } catch (err) {
        return data;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          exception.message
        );
      }
    }
  }

  async updateCaptureStatus(orderId: string, isClosed: boolean = false) {
    try {
      const captureStatus = DeltaMachineBNPLStatuses.CAPTURED;
      let updateData: any = {
        captureStatus: DeltaMachineBNPLStatuses.CAPTURED,
        'orderData.captureStatus': captureStatus,
        updatedAt: new Date(),
      };
      if (isClosed) {
        updateData = {
          captureStatus: DeltaMachineBNPLStatuses.CLOSED,
          'orderData.captureStatus': captureStatus,
          updatedAt: new Date(),
        };
      }
      const [err, data] = await this.deltaMachineRepository.update(
        { orderId },
        updateData
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          exception.message
        );
      }
    }
  }

  async getById(id: string) {
    try {
      const [err, dmoObj] = await this.deltaMachineRepository.getById(id);
      if (err) {
        this.error.errorCode = dmoObj.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmoObj.result.toString();
        this.error.message = dmoObj.message;
        throw this.error;
      }
      const dmoDocument = dmoObj.result as DeltaMachineOrderDocument;
      return dmoDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_DMO,
          exception.message
        );
      }
    }
  }

  async delete(id: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.delete(id);
      const [errOrder, order] = await this.deltaMachineRepository.getById(id);

      if (err || errOrder) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      // Re-calculate the rates
      const orderData = await this.orderService.findOrderById(
        (order.result as DeltaMachineOrderDocument).orderId
      );
      if (orderData) {
        await this.userRepository.updateRatesScan(orderData?.seller, false);
        await this.userRepository.updateRatesScan(orderData?.buyer, false);
      }

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_DELETE_DMO,
          exception.message
        );
      }
    }
  }

  async getPayoutOrderInfo(orderId: string) {
    try {
      const data = await this.orderService.getPayoutOrderInfo(orderId);
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  async getOrderInfo(orderId: string, userType: UserType) {
    try {
      return await this.orderService.getOrderDetail(orderId, userType);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO_STATUS,
          exception.message
        );
      }
    }
  }

  getPaymentMethodSuggestion(createdDate: Date, paymentType: string) {
    const paymentMethods = [
      {
        label: PaymentMethod.InstantRefund,
        recommended: false,
        displayName: DisplayName.InstantRefund,
      },
      // keeping this in codebase for future just in case if we might need to enable it
      // {
      //   label: PaymentMethod.Reversal,
      //   recommended: false,
      //   displayName: DisplayName.Reversal,
      // },
      {
        label: PaymentMethod.RefundSoumWallet,
        recommended: false,
        displayName: DisplayName.RefundSoumWallet,
      },
    ];
    if (paymentType) {
      const hoursDifference = Math.round(
        Math.abs(new Date().getTime() - createdDate.getTime()) / 3600000
      );
      if (hoursDifference >= 24) {
        paymentMethods[0].recommended = true;
      } else {
        if (
          paymentType === Constants.cardType.Mada ||
          paymentType === Constants.cardType.StcPay ||
          paymentType === Constants.cardType.UrPay
        ) {
          paymentMethods[0].recommended = true;
        } else if (
          paymentType === Constants.cardType.ApplePay ||
          paymentType === Constants.cardType.VisaMaster
        ) {
          paymentMethods[1].recommended = true;
        }
      }
    }
    return paymentMethods;
  }

  public populateOrdersData(matchedOrder: any): OrderData {
    let IBAN: string;
    let bankCode: string;
    let buyerIBAN: string;
    let buyerBankCode: string;
    if (matchedOrder.seller_iban) {
      IBAN = decryptIBAN(
        matchedOrder.seller_iban,
        matchedOrder.seller_secret_key
      );
    }
    if (matchedOrder.seller_bank_bic) {
      bankCode = decrypt(
        matchedOrder.seller_bank_bic,
        matchedOrder.seller_secret_key
      );
    }
    if (matchedOrder.buyer_iban) {
      buyerIBAN = decryptIBAN(
        matchedOrder.buyer_iban,
        matchedOrder.buyer_secret_key
      );
    }
    if (matchedOrder.buyer_bank_bic) {
      buyerBankCode = decrypt(
        matchedOrder.buyer_bank_bic,
        matchedOrder.buyer_secret_key
      );
    }
    const sellerType = matchedOrder?.is_merchant_seller
      ? SellerUserType.MERCHANT_SELLER
      : matchedOrder?.is_key_seller
      ? SellerUserType.KEY_SELLER
      : matchedOrder.isUAE
      ? SellerUserType.UAE_SELLER
      : SellerType.INDIVIDUAL;
    const orderData = {
      productId: matchedOrder.product?._id?.toString(),
      productName: matchedOrder.model_name || '',
      productNameAr: matchedOrder?.model_name_ar || '',
      inventoryId: matchedOrder.product?.inventoryId || '',
      orderNumber: matchedOrder.order_number || '',
      orderType: OrderType.NONE,
      orderStatus: 'New order',
      sellerId: matchedOrder.seller,
      sellerPhone: `+${matchedOrder.seller_country_code || ''}${
        matchedOrder.seller_mobile_number || ''
      }`,
      buyerPhone: `+${matchedOrder.buyer_country_code || ''}${
        matchedOrder.buyer_mobile_number || ''
      }`,
      sellerCity: matchedOrder.seller_city || '',
      buyerCity: matchedOrder.buyer_city || '',
      buyerName: matchedOrder.buyer_name || '',
      sellerName: matchedOrder.seller_name || '',
      buyerId: matchedOrder.buyer,
      buyerPostalCode: matchedOrder.buyer_postal_code || '',
      sellerBankName: matchedOrder.seller_bank_name || '',
      sellerIBAN: IBAN || '',
      sellerBankBIC: bankCode || '',
      sellerAcountName: matchedOrder.seller_acount_name || '',
      sellerSecretKey: matchedOrder.seller_secret_key || '',
      sellerEmail: matchedOrder.seller_email || '',
      buyerEmail: matchedOrder.buyer_email || '',
      buyerBankName: matchedOrder.buyer_bank_name || '',
      buyerIBAN: buyerIBAN || '',
      buyerBankBIC: buyerBankCode || '',
      buyerAccountName: matchedOrder.buyer_acount_name || '',
      buyerSecretKey: matchedOrder.buyer_secret_key || '',
      buyerAddress:
        (matchedOrder.buyer_street_address || '') +
        ' ' +
        (matchedOrder.buyer_postal_code || ''),
      sellerPostalCode: matchedOrder.seller_postal_code || '',
      sellerAddress:
        (matchedOrder.seller_street_address || '') +
        ' ' +
        (matchedOrder.seller_postal_code || ''),
      buyerStreet: matchedOrder.buyer_street_address || '',
      sellerStreet: matchedOrder.seller_street_address || '',
      grandTotal: '',
      buyerDistrict: '',
      sellerDistrict: '',
      payoutAmount: '',
      buyerPromoCodeId: matchedOrder.buyer_promo_code_id,
      buyerPromo: matchedOrder.buyer_promo_code,
      sellerPromo: matchedOrder.seller_promo_code,
      buyerPromoCode: matchedOrder.buyer_promo_code?.code || '',
      sellerPromoCode: matchedOrder.seller_promo_code?.code || '',
      isKeySeller: matchedOrder.is_key_seller || false,
      sellerType,
      sellPrice: '',
      vatAmount: matchedOrder.vat || '',
      vatPercentage: matchedOrder.billingSettings?.vat_percentage || '',
      commissionAmount:
        matchedOrder.billingSettings?.seller_commission_percentage || '',
      shippingAmount: matchedOrder.shipping_charge || '',
      varient: matchedOrder.varient || '',
      paymentStatus: matchedOrder.transaction_status || '',
      paymentType: matchedOrder.payment_type || '',
      buyType: matchedOrder.buy_type || '',
      sourcePlatform: matchedOrder.sourcePlatform || '',
      createdAt: matchedOrder.created_at || '',
      productPictures: this.getImagesLinks(matchedOrder.images),
      productVarient: matchedOrder.varient_ar,
      variantId: matchedOrder.varient_id,
      questionsAndAnswers: matchedOrder.answer_to_questions_ar,
      availableLogisticsServices: '',
      modelId: matchedOrder?.model_id || '',
      modelName: matchedOrder?.model_name || '',
      categoryId: matchedOrder?.category_id || '',
      categoryName: matchedOrder?.categoryName || '',
      brandName: matchedOrder?.brandName || '',
      conditions: matchedOrder?.conditions || '',
      grade: matchedOrder?.grade || '',
      productCondition: matchedOrder?.productCondition || '',
      price_quality_extra_commission:
        matchedOrder?.billingSettings?.price_quality_extra_commission || null,
      transactionDetails: matchedOrder?.transaction_detail,
      listingGroupId: matchedOrder?.product?.listingGroupId || '',
      returnWarranty: '24 hours/ -',
      addOnsSummary: matchedOrder?.addOns,
      addOnsTotalAmount: matchedOrder?.addOns?.addOnsTotal || 0,
      addOnsGrandTotal: matchedOrder?.addOns?.addOnsGrandTotal || 0,
      addOnsVat: matchedOrder?.addOns?.addOnsVat.toFixed(2) || 0,
      addOns: '',
      isReservation: matchedOrder?.isReservation || false,
      isFinancing: matchedOrder?.isFinancing || false,
      conditionId: matchedOrder.product?.condition_id?.toString(),
      isUAEListing: matchedOrder?.isUAE || false,
      productDescription: matchedOrder?.productDescription || '',
      productImgs: matchedOrder?.images || [],
      isConsignment: matchedOrder.isConsignment,
      buyerLongitude: matchedOrder.buyerLongitude,
      buyerLatitude: matchedOrder.buyerLatitude,
      sellerLongitude: matchedOrder.sellerLongitude,
      sellerLatitude: matchedOrder.sellerLatitude,
    };
    if (matchedOrder.buyerAddress) {
      if (matchedOrder.buyerAddress?.street) {
        orderData.buyerAddress = `${matchedOrder.buyerAddress?.street}
        ${matchedOrder.buyerAddress?.district || ''}
        ${matchedOrder.buyerAddress?.postal_code || ''}`;
        orderData.buyerStreet =
          matchedOrder.buyerAddress?.street || orderData.buyerStreet;
      }
      orderData.buyerCity =
        matchedOrder.buyerAddress?.city || orderData.buyerCity;
      orderData.buyerPostalCode =
        matchedOrder.buyerAddress?.postal_code || orderData.buyerPostalCode;
      orderData.buyerDistrict =
        matchedOrder.buyerAddress?.district || orderData.buyerDistrict;
    }
    if (matchedOrder.sellerAddress) {
      if (matchedOrder.sellerAddress?.street) {
        orderData.sellerAddress = `${matchedOrder.sellerAddress?.street}
        ${matchedOrder.sellerAddress?.district || ''}
        ${matchedOrder.sellerAddress?.postal_code || ''}`;
        orderData.sellerStreet =
          matchedOrder.sellerAddress?.street || orderData.sellerStreet;
      }
      orderData.sellerCity =
        matchedOrder.sellerAddress?.city || orderData.sellerCity;
      orderData.sellerPostalCode =
        matchedOrder.sellerAddress?.postal_code || orderData.sellerPostalCode;
      orderData.sellerDistrict =
        matchedOrder.sellerAddress?.district || orderData.sellerDistrict;
    }
    if (matchedOrder?.tags) {
      if (matchedOrder.tags.find((item: any) => item.name === 'soumChoice'))
        orderData.returnWarranty = '10 Days/ -';
    }
    if (matchedOrder?.addOns) {
      matchedOrder?.addOns.selectedAddOns?.forEach((addOn: any) => {
        orderData.addOns += `${addOn.addOnName},`;
      });
      orderData.addOns = orderData.addOns.substring(
        0,
        orderData.addOns.length - 1
      );
    }

    return orderData;
  }

  public async generatetrackingNumber(
    orderId: string,
    orderData: OrderData
  ): Promise<string> {
    const secomResponse = await Secom.createOrder(orderId, orderData);
    if (secomResponse?.error) {
      return '';
    } else {
      const splitArr = secomResponse?.result?.split(' ');
      if (splitArr.length > 1) {
        return splitArr.pop();
      }
      return secomResponse.result;
    }
  }

  async createShipmentOrderAndTrackingNumber(
    orderData: OrderData,
    shipmentType: ShipmentTypeEnum
  ): Promise<string> {
    try {
      const description: string = orderData?.addOns
        ? `${orderData.productName}, ${orderData?.addOns}`
        : orderData.productName;
      const pickUpObj = await CreateShipment({
        receiver: {
          address: [
            orderData?.buyerCity,
            orderData?.buyerDistrict,
            orderData?.buyerStreet,
            orderData?.buyerPostalCode,
          ].join(', '),
          city: orderData?.buyerCity,
          email: 'soum.buyer@soum.sa',
          mobileNumber: orderData?.buyerPhone,
          name: orderData?.buyerName,
          userType: null,
          latitude: orderData.buyerLatitude,
          longitude: orderData.buyerLongitude,
        },
        sender: {
          address: [
            orderData?.sellerCity,
            orderData?.sellerDistrict,
            orderData?.sellerStreet,
            orderData?.sellerPostalCode,
          ].join(', '),
          city: orderData?.sellerCity,
          email: 'soum.seller@soum.sa',
          mobileNumber: orderData?.sellerPhone,
          name: orderData?.sellerName,
          userType: orderData?.sellerType,
          latitude: orderData.sellerLatitude,
          longitude: orderData.sellerLongitude,
        },
        serviceName: 'torod',
        trackingNumber: orderData.orderNumber,
        grandTotal: Number(orderData.grandTotal),
        description,
        shipmentType: shipmentType.toString(),
        isConsignment: orderData.isConsignment,
      });

      return pickUpObj?.trackingNumber;
    } catch (err) {
      return null;
    }
  }
  private setOrderType(orderData: OrderData): OrderType {
    const soumSellers = (process.env.SOUM_SELLERS || '').split(',');
    let sellerType = '';
    if (soumSellers.includes(orderData.sellerPhone)) {
      sellerType = 'soum-seller';
    }
    let buyerCity = orderData.buyerCity;
    let sellerCity = orderData.sellerCity;
    if (buyerCity === Cities.RIYADH_AR) {
      buyerCity = Cities.RIYADH;
    } else if (buyerCity === Cities.JEDDAH_AR) {
      buyerCity = Cities.JEDDAH;
    }
    if (sellerCity === Cities.RIYADH_AR) {
      sellerCity = Cities.RIYADH;
    } else if (sellerCity === Cities.JEDDAH_AR) {
      sellerCity = Cities.JEDDAH;
    }
    if (sellerCity === Cities.RIYADH && buyerCity === Cities.RIYADH) {
      if (sellerType === 'soum-seller') {
        return OrderType.SOUM_RIYADH_TO_RIYADH;
      } else {
        return OrderType.RIYADH_TO_RIYADH;
      }
    } else if (sellerCity === Cities.RIYADH && buyerCity !== Cities.RIYADH) {
      if (sellerType === 'soum-seller') {
        return OrderType.SOUM_RIYADH_TO_OTHER;
      } else {
        return OrderType.RIYADH_TO_OTHER;
      }
    } else if (sellerCity !== Cities.RIYADH && sellerCity !== buyerCity) {
      return OrderType.OTHER_TO_OTHER;
    } else if (sellerCity !== Cities.RIYADH && sellerCity === buyerCity) {
      return OrderType.SAME_CITY_BUT_NOT_RIYADH;
    }
  }
  async payoutOrderHyperSplit(
    userId: string,
    orderId: string,
    payAmount: number,
    adName: string,
    paymentMethod: string = 'Payout',
    userType: string = 'seller'
  ) {
    try {
      return await this.orderService.payoutOrderHyperSplit(
        orderId,
        payAmount,
        adName,
        paymentMethod,
        userType
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        if (exception.errorCode === Constants.ERROR_CODE.UNPROCESSABLE_ENTITY) {
          // trigger activity log
          await this.createActivityLogPayoutRefundEvent(
            userId,
            adName,
            orderId,
            (exception.errorDetail.toString() || '').split(' ').pop(),
            paymentMethod
          );
        }
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MAKE_PAYOUT_SELLER,
          exception.message
        );
      }
    }
  }

  async updatePayoutOrderInfo(editPayoutInput: UpdatePayoutOrderInput) {
    try {
      await this.orderService.updatePayoutOrderInfo(editPayoutInput);
      return await this.orderService.getPayoutOrderInfo(
        editPayoutInput.order_id
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SELLER_COMMISSION_ORDER,
          exception.message
        );
      }
    }
  }
  async validateExistingIBAN(
    currentIBAN: string,
    orderId: string,
    editIBAN: string
  ) {
    try {
      if (currentIBAN.length > 0 && currentIBAN !== editIBAN) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.IBAN_NOT_EXIST_FOR_USER;
        throw this.error;
      }
      // const [errPayoutLog, payoutLog] =
      //   await this.payoutHistoryRepository.checkSuccessPayout(orderId);
      // if (errPayoutLog) {
      //   this.error.errorCode = payoutLog.code;
      //   this.error.errorType = Constants.ERROR_TYPE.API;
      //   this.error.errorKey = payoutLog.result.toString();
      //   throw this.error;
      // }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CHECK_EXISTING_IBAN,
          exception.message
        );
      }
    }
  }
  async updateBankUserDetail(orderId: string, editBankInput: BankDetailInput) {
    try {
      const [err, data] =
        await this.orderRepository.getOrderDataWithProductDetails(orderId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const order = data.result as OrderDocument;
      const currentIBAN = (order.buyer.bankDetail || {}).hasOwnProperty(
        'accountId'
      )
        ? decryptIBAN(order.buyer.bankDetail.accountId, order.buyer.secretKey)
        : '';
      await this.validateExistingIBAN(currentIBAN, orderId, editBankInput.iban);
      const newIBAN = encrypt(editBankInput.iban, order.buyer.secretKey);
      await this.userRepository.updateBankDetailUser(
        order.buyer._id,
        newIBAN,
        null,
        null,
        null
      );
      const currentBankBIC = (order.buyer.bankDetail || {}).hasOwnProperty(
        'bankBIC'
      )
        ? decrypt(order.buyer.bankDetail.bankBIC, order.buyer.secretKey)
        : '';
      if (currentBankBIC != editBankInput.bankBIC) {
        const newBankBIC = encrypt(
          editBankInput.bankBIC,
          order.buyer.secretKey
        );
        await this.userRepository.updateBankDetailUser(
          order.buyer._id,
          null,
          null,
          newBankBIC,
          null
        );
      }
      const currentBankName = (order.buyer.bankDetail || {}).hasOwnProperty(
        'bankName'
      )
        ? order.buyer.bankDetail.bankName
        : '';
      if (currentBankName != editBankInput.bankName) {
        await this.userRepository.updateBankDetailUser(
          order.buyer._id,
          null,
          editBankInput.bankName,
          null,
          null
        );
      }
      const currentAccountHolderName = (
        order.buyer.bankDetail || {}
      ).hasOwnProperty('accountHolderName')
        ? order.buyer.bankDetail.accountHolderName
        : '';
      if (currentAccountHolderName != editBankInput.accountHolderName) {
        await this.userRepository.updateBankDetailUser(
          order.buyer._id,
          null,
          null,
          null,
          editBankInput.accountHolderName
        );
      }

      return 'Update bank detail successfully';
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SELLER_COMMISSION_ORDER,
          exception.message
        );
      }
    }
  }
  async refundOrder(
    refundOrderDto: RefundOrderDto,
    userId: string,
    userName: string
  ) {
    try {
      const orderData = await this.orderService.findOrderById(
        refundOrderDto.orderId
      );
      if (orderData) {
        await this.userRepository.updateRatesScan(orderData.seller, false);
      }

      return await this.refundService.refundOrder(
        refundOrderDto,
        userId,
        userName
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REFUND_ORDER,
          exception.message
        );
      }
    }
  }

  getImagesLinks(imagesArr: string[]): string {
    let images = '';
    if (imagesArr && imagesArr.length) {
      imagesArr.forEach(image => {
        if (images === '') {
          images = image;
        } else {
          images += `, ${image}`;
        }
      });
    }
    return images;
  }
  async getSuccessPayoutRefundTransaction(
    orderId: string,
    transactionType?: string,
    paymentMethod?: string
  ) {
    try {
      return await this.dmoPayoutRefundHistoryRepository.getSuccessPayoutRefundTransaction(
        orderId,
        transactionType,
        paymentMethod
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SUCCESS_PAYOUT_REFUND_TRANSACTION,
          exception.message
        );
      }
    }
  }
  async addSetting(obj: DeltaMachineSettingInput) {
    try {
      return await this.deltaMachineRepository.addSetting(obj);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_SETTING,
          exception.message
        );
      }
    }
  }
  async getSettingByKey(settingKey: string) {
    try {
      const [err, setting] = await this.deltaMachineRepository.getSettingByKey(
        settingKey
      );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SETTING
        );
      }
      return getParsedValue(setting.value, setting.type);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
          exception.message
        );
      }
    }
  }

  async updateWhatsAppAutomationSettingByKey(
    userId: string,
    username: string,
    settingKeyInput: WhatsappAutomationSettingSubmoduleInputType
  ) {
    try {
      // trigger activity log event with toggle setting
      const [, currentSettingData] =
        await this.deltaMachineRepository.getSettingByKey(
          'setting_wa_automation_dmo_phase_1'
        );
      const currentSetting = getParsedValue(
        currentSettingData.value,
        currentSettingData.type
      );
      if (
        settingKeyInput.whatsapp.buyer_processing.value !=
        currentSetting.whatsapp.buyer_processing.value
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'buyer_processing',
          settingKeyInput.whatsapp.buyer_processing.value
        );
      }
      if (
        settingKeyInput.whatsapp.seller_processing.value !=
        currentSetting.whatsapp.seller_processing.value
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'seller_processing',
          settingKeyInput.whatsapp.seller_processing.value
        );
      }

      const [err, setting] =
        await this.deltaMachineRepository.updateWhatsappAutomationSubmoduleSetting(
          settingKeyInput
        );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
          setting.toString()
        );
      }
      return getParsedValue(setting.value, setting.type);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
          exception.message
        );
      }
    }
  }

  async updateCourierAutomationSettingByKey(
    userId: string,
    username: string,
    settingKeyInput: CourierAutomationSettingInputType
  ) {
    try {
      // trigger activity log event with toggle setting
      const [, currentSettingData] =
        await this.deltaMachineRepository.getSettingByKey(
          'setting_courier_automation'
        );
      const currentSetting = getParsedValue(
        currentSettingData.value,
        currentSettingData.type
      );
      if (
        settingKeyInput.smsa.automationToggle.value !=
        currentSetting.smsa.automationToggle.value
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'setting_courier_automation',
          settingKeyInput.smsa.automationToggle.value
        );
      }

      const [err, setting] =
        await this.deltaMachineRepository.updateCourierAutomationSubmoduleSetting(
          settingKeyInput
        );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          setting.toString()
        );
      }
      return getParsedValue(setting.value, setting.type);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          exception.message
        );
      }
    }
  }
  async updateWhatsAppAutomationSettingKey(key: string) {
    try {
      const [settingErr, currentSettingData] =
        await this.deltaMachineRepository.getSettingByKey(key);
      if (settingErr) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          ''
        );
      }
      const settingValue: WhatsappAutomationSettingSubmoduleInputType =
        JSON.parse(currentSettingData.value);
      settingValue.whatsapp.dispute_message = {
        type: 'boolean',
        value: false,
      };
      settingValue.whatsapp.seller_extension_whatsapp_message = {
        type: 'boolean',
        value: false,
      };
      currentSettingData.value = settingValue;
      const [err, setting] =
        await this.deltaMachineRepository.updateWhatsappAutomationSubmoduleSetting(
          currentSettingData.value
        );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          setting.toString()
        );
      }
      return getParsedValue(setting.value, setting.type);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          exception.message
        );
      }
    }
  }
  async updateOMAutomationSettingByKey(
    userId: string,
    username: string,
    settingKeyInput: OMStatusAutomationSettingInputType
  ) {
    try {
      // trigger activity log event with toggle setting
      const [, currentSettingData] =
        await this.deltaMachineRepository.getSettingByKey(
          'setting_om_status_automation'
        );
      const currentSetting = getParsedValue(
        currentSettingData.value,
        currentSettingData.type
      );
      const confirmUnavailableAutomation = _get(
        settingKeyInput,
        'automation.confirm_unavailable.value',
        false
      );
      if (
        confirmUnavailableAutomation !==
        _get(currentSetting, 'automation.confirm_unavailable.value', false)
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'confirm_unavailable',
          confirmUnavailableAutomation
        );
      }
      const refundAutomation = _get(
        settingKeyInput,
        'automation.refund.value',
        false
      );
      if (
        refundAutomation !==
        _get(currentSetting, 'automation.refund.value', false)
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'refund',
          refundAutomation
        );
      }
      const awaitShippingPickUpAutomation = _get(
        settingKeyInput,
        'automation.await_shipping_pickup.value',
        false
      );
      if (
        awaitShippingPickUpAutomation !==
        _get(currentSetting, 'automation.await_shipping_pickup.value', false)
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'await_shipping_pickup',
          awaitShippingPickUpAutomation
        );
      }
      const unshippedOrderAutomation = _get(
        settingKeyInput,
        'automation.backlog_unshipped_orders.value',
        false
      );
      if (
        unshippedOrderAutomation !==
        _get(currentSetting, 'automation.backlog_unshipped_orders.value', false)
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'backlog_unshipped_orders',
          unshippedOrderAutomation
        );
      }
      const unpickupOrderAutomation = _get(
        settingKeyInput,
        'automation.backlog_unpicked_up_orders.value',
        false
      );
      if (
        unpickupOrderAutomation !=
        _get(
          currentSetting,
          'automation.backlog_unpicked_up_orders.value',
          false
        )
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'await_shipping_pickup',
          unpickupOrderAutomation
        );
      }
      const backlogInTransitOrderAutomation = _get(
        settingKeyInput,
        'automation.backlog_intransit_orders.value',
        false
      );
      if (
        backlogInTransitOrderAutomation !=
        _get(currentSetting, 'automation.backlog_intransit_orders.value', false)
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'await_shipping_pickup',
          backlogInTransitOrderAutomation
        );
      }
      const [err, setting] =
        await this.deltaMachineRepository.updateOMStatusAutomationSubmoduleSetting(
          settingKeyInput
        );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
          setting.toString()
        );
      }
      return getParsedValue(setting.value, setting.type);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
          exception.message
        );
      }
    }
  }
  async createActivityLogUpdateSettingEvent(
    userId: string,
    username: string,
    settingType: string,
    isOn: boolean
  ) {
    try {
      const eventType = Constants.activity_log_template.SETTING_TOGGLE;
      // get msg template to create log
      const msgSignInTemplateRequest: EventLogTemplateRequest = {
        eventType: eventType,
        setting: settingType,
        settingValue: isOn ? 'On' : 'Off',
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgSignInTemplateRequest
      );
      const eventLogAddUserRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        value: msgTemplate,
        module: 'settings',
      };
      await createEventLog(eventLogAddUserRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }
  async createActivityLogSignInEvent(userId: string, username: string) {
    try {
      const eventType = Constants.activity_log_template.USER_MANAGEMENT;
      // get msg template to create log
      const msgSignInTemplateRequest: EventLogTemplateRequest = {
        eventType: eventType,
        isSignIn: true,
        userId: userId,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgSignInTemplateRequest
      );
      const eventLogAddUserRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        value: msgTemplate,
        module: 'user',
      };
      await createEventLog(eventLogAddUserRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }
  async createActivityLogToDMUserAccountEvent(
    creatorId: string,
    newUsername: string,
    creatorUsername: string,
    isDeleted: boolean
  ) {
    try {
      const eventType = Constants.activity_log_template.USER_MANAGEMENT;
      // get msg template to create log
      const msgAddUserTemplateRequest: EventLogTemplateRequest = {
        eventType: eventType,
        isAddedUser: !isDeleted,
        username: newUsername,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgAddUserTemplateRequest
      );
      const eventLogAddUserRequest: EventLogRequest = {
        eventType: eventType,
        userId: creatorId,
        username: creatorUsername,
        value: msgTemplate,
        module: 'user',
      };
      await createEventLog(eventLogAddUserRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }
  async createActivityLogPayoutRefundEvent(
    userId: string,
    username: string,
    orderId: string,
    status: string,
    typeMethod: string = 'Payout'
  ) {
    try {
      const eventType =
        typeMethod === 'Payout'
          ? Constants.activity_log_template.PAYOUT_SUBMITTED
          : Constants.activity_log_template.REFUND_SUBMITTED;
      const order = await this.orderService.findOrderById(orderId);
      // get msg template to create log
      const msgPayoutRefundTemplateRequest: EventLogTemplateRequest = {
        eventType: eventType,
        orderNumber: order.order_number,
        transactionStatus: status,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgPayoutRefundTemplateRequest
      );
      const eventLogPayoutRefundRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        orderId: orderId,
        orderNumber: order.order_number,
        value: msgTemplate,
        module: 'payout',
      };
      await createEventLog(eventLogPayoutRefundRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }
  async createActivityLogEvent(
    dmoId: string,
    statusId: string,
    userId: string,
    username: string
  ) {
    try {
      const [, dmoObj] = await this.deltaMachineRepository.getById(dmoId);
      const dmoDocument = dmoObj.result as DeltaMachineOrderDocument;
      const order = await this.orderService.findOrderById(dmoDocument.orderId);
      // get current status
      const [, currentStatusData] =
        await this.deltaMachineRepository.getStatusById(dmoDocument.statusId);
      const currentStatusDocument =
        currentStatusData.result as DeltaMachineStatusDocument;
      // get updated status
      const [, data] = await this.deltaMachineRepository.getStatusById(
        statusId
      );
      const dmoStatusDocument = data.result as DeltaMachineStatusDocument;
      // get msg template to create log
      const msgTemplateRequest: EventLogTemplateRequest = {
        eventType: Constants.activity_log_template.STATUS_CHANGE,
        orderNumber: order.order_number,
        currentStatus: currentStatusDocument.displayName,
        changedStatus: dmoStatusDocument.displayName,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgTemplateRequest
      );
      const eventLogRequest: EventLogRequest = {
        eventType: Constants.activity_log_template.STATUS_CHANGE,
        userId: userId,
        username: username,
        orderId: dmoDocument.orderId,
        orderNumber: order.order_number,
        value: msgTemplate,
        module: 'order',
      };
      await createEventLog(eventLogRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }
  async updateAirTableRecordStatus(dmoId: string, statusId: string) {
    try {
      const [dmoErr, dmoObj] = await this.deltaMachineRepository.getById(dmoId);
      if (dmoErr) {
        this.error.errorCode = dmoObj.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmoObj.result.toString();
        this.error.errorDetail = dmoObj.message;
        throw this.error;
      }
      const dmoDocument = dmoObj.result as DeltaMachineOrderDocument;
      const order = await this.orderService.findOrderById(dmoDocument.orderId);
      const [err, data] = await this.deltaMachineRepository.getStatusById(
        statusId
      );
      if (err) {
        this.error.errorCode = dmoObj.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmoObj.result.toString();
        this.error.message = dmoObj.message;
        throw this.error;
      }
      const dmoStatusDocument = data.result as DeltaMachineStatusDocument;
      const recordId: string = await AirTable.getAirTableRecordById(
        order.order_number
      );
      let shippedAtSMSA = false;
      let deliveredAtSMSA = false;
      if (dmoStatusDocument.name === 'in-transit') {
        shippedAtSMSA = true;
      }
      if (dmoStatusDocument.name === 'item-delivered') {
        deliveredAtSMSA = true;
      }
      await AirTable.updateAirTableRecordStatusById(
        recordId,
        dmoStatusDocument.displayName,
        shippedAtSMSA,
        deliveredAtSMSA
      );
      return { dmoStatusDocument, seller: order?.seller };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_AIRTABLE_RECORD,
          exception
        );
      }
    }
  }

  async createAirTableDisputeRecord(dmoId: string, disputeObj: any) {
    try {
      const [dmoErr, dmoObj] = await this.deltaMachineRepository.getById(dmoId);
      if (dmoErr) {
        this.error.errorCode = dmoObj.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmoObj.result.toString();
        this.error.errorDetail = dmoObj.message;
        throw this.error;
      }
      const dmoDocument = dmoObj.result as DeltaMachineOrderDocument;
      await AirTable.createAirTableDisputeRecord(
        dmoDocument?.orderData.orderNumber,
        disputeObj
      );
      return true;
    } catch (exception) {
      console.log(exception);
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_AIRTABLE_RECORD,
          exception
        );
      }
    }
  }

  async addNewUser(userInput: DeltaMachineNewUserInput) {
    try {
      const [errDmoUser, dmUser] = await this.deltaMachineRepository.addNewUser(
        userInput
      );
      if (errDmoUser) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmUser.result.toString();
        this.error.message = dmUser?.message;
        throw this.error;
      }
      return dmUser.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_USER,
          exception.message
        );
      }
    }
  }

  async updatePickUpSettingByKey(
    userId: string,
    username: string,
    settingKeyInput: PickupServiceSettingSubmoduleInputType
  ) {
    try {
      // trigger activity log event with toggle setting
      const [, currentSettingData] =
        await this.deltaMachineRepository.getSettingByKey(
          'setting_pickup_service_offering'
        );
      const currentSetting = getParsedValue(
        currentSettingData.value,
        currentSettingData.type
      );
      if (
        settingKeyInput.service.pickupToggle.value !=
        currentSetting.service.pickupToggle.value
      ) {
        await this.createActivityLogUpdateSettingEvent(
          userId,
          username,
          'setting_pickup_service_offering',
          settingKeyInput.service.pickupToggle.value
        );
      }

      const [err, setting] =
        await this.deltaMachineRepository.updateTogglePickupServiceSetting(
          settingKeyInput
        );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          setting.toString()
        );
      }
      return getParsedValue(setting.value, setting.type);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
          exception.message
        );
      }
    }
  }

  async updateUserRole(userId: string, roleId: string) {
    try {
      const [errDmoUser, dmUser] =
        await this.deltaMachineRepository.updateUserRole(userId, roleId);
      if (errDmoUser) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmUser.result.toString();
        this.error.message = dmUser.message;
        throw this.error;
      }
      return dmUser.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
          exception.message
        );
      }
    }
  }

  async updateUserGroup(userId: string, groupId: string) {
    try {
      const [errDmoUser, dmUser] =
        await this.deltaMachineRepository.updateUserGroup(userId, groupId);
      if (errDmoUser) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmUser.result.toString();
        this.error.message = dmUser.message;
        throw this.error;
      }
      return dmUser.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
          exception.message
        );
      }
    }
  }
  async getUsers(offset: number, limit: number) {
    try {
      const [err, data] = await this.deltaMachineRepository.getUsers(
        offset,
        limit
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const userData = data.result as UserListResponse;
      for await (const user of userData.data as DeltaMachineUserDocument[]) {
        if (user.roleId) {
          user.role = await GetRole({
            id: user.roleId,
          });
        }
      }
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_USER,
        exception.message
      );
    }
  }
  async getUserByNumber(phoneNumber: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getUserByNumber(
        phoneNumber
      );
      const userDoc = data.result as DeltaMachineUserDocument;
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return userDoc;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      }
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_USER,
        exception.message
      );
    }
  }
  private async createAirTableRecord(
    dmOrderDocument: DeltaMachineOrderDocument,
    orderData: any
  ) {
    try {
      dmOrderDocument.orderData.sellerPhone =
        dmOrderDocument.orderData.sellerPhone?.substring(1);
      dmOrderDocument.orderData.buyerPhone =
        dmOrderDocument.orderData.buyerPhone?.substring(1);

      const expectedDeliveryTime = orderData?.isUAEListing
        ? { minDeliveryTime: '3', maxDeliveryTime: '8' }
        : await this.expectedDeliveryTime(dmOrderDocument);
      const result = await AirTable.createAirTableRecord(
        dmOrderDocument,
        expectedDeliveryTime,
        orderData.addOnsSummary
      );
      return result;
    } catch (err) {
      console.log('Airtable error:', err);
      return false;
    }
  }

  async getWhatsappMsgs(offset: number, limit: number) {
    try {
      const [dmoerr, dmodata] = await this.deltaMachineRepository.getList({
        offset,
        limit,
        submodule: null,
        searchOption: { sendOutBoundMessage: true },
      });
      if (dmoerr) {
        this.error.errorCode = dmodata.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmodata.result.toString();
        this.error.message = dmodata.message;
        throw this.error;
      }
      const dmoResponse = dmodata.result as OrdersListResponse;
      const dmOrdersList = dmoResponse.data as DeltaMachineOrderDocument[];

      const [err, data] = await this.whatsAppMsgRepository.getListByDmoIds(
        dmOrdersList.map(i => i.id)
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const whatsappMsgs = data.result as WhatsAppMsgDocument[];
      // ----Start---- TODO: Remove check msg status from freshchat
      const needToUpdate: WhatsAppMsgDocument[] = whatsappMsgs.filter(
        msg => msg?.status !== FreshchatMessageStatus.READ
      );
      const needToUpdateInDb: WhatsAppMsgDocument[] = [];
      const needToUpdateMap: any = {};
      needToUpdate.forEach(item => {
        needToUpdateMap[item.requestId] = item;
      });
      const outboundMsgs = await Promise.all(
        needToUpdate.map(item => getOutboundMsg(item.requestId))
      );
      outboundMsgs.forEach(msg => {
        // If status is updated at freshChat
        if (msg) {
          if (
            needToUpdateMap[msg?.outbound_messages[0].request_id]['status'] !=
            msg?.outbound_messages[0]?.status
          ) {
            needToUpdateInDb.push(
              needToUpdateMap[msg?.outbound_messages[0].request_id]
            );
            needToUpdateMap[msg?.outbound_messages[0].request_id]['status'] =
              msg?.outbound_messages[0]?.status;
          }
        }
      });
      // Update DB with latest status
      await Promise.all(
        needToUpdateInDb.map(item =>
          this.whatsAppMsgRepository.update(
            { _id: item.id },
            { status: needToUpdateMap[item.requestId]['status'] }
          )
        )
      );
      // ----END---- Remove check msg status from freshchat
      const whatsapMsgsMap: any = {};
      whatsappMsgs.forEach(item => {
        if (whatsapMsgsMap[item.orderId]) {
          whatsapMsgsMap[item.orderId][item.templateName] = item;
        } else {
          whatsapMsgsMap[item.orderId] = { orderNumber: item.orderNumber };
          whatsapMsgsMap[item.orderId][item.templateName] = item;
        }
      });
      const templateNames = new Set(
        whatsappMsgs.map(item => item.templateName)
      );

      const [dmoErr, dmoData] =
        await this.deltaMachineRepository.getListByOrderIds(
          whatsappMsgs.map(item => item.orderId)
        );
      if (dmoErr) {
        this.error.errorCode = dmoData.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmoData.result.toString();
        this.error.message = dmoData.message;
        throw this.error;
      }
      const dmos = dmoData.result as DeltaMachineOrderDocument[];
      dmoResponse.data = [];
      dmos.forEach(item => {
        const el: any = {
          orderId: item.orderId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          statusId: item.statusId,
        };
        if (whatsapMsgsMap[item.orderId]) {
          el.orderNumber = whatsapMsgsMap[item.orderId]['orderNumber'];
        }
        templateNames.forEach(template => {
          if (whatsapMsgsMap[item.orderId][template]) {
            el[template] = {
              id: whatsapMsgsMap[item.orderId][template]['id'],
              createdAt: whatsapMsgsMap[item.orderId][template]['createdAt'],
              updatedAt: whatsapMsgsMap[item.orderId][template]['updatedAt'],
              status: whatsapMsgsMap[item.orderId][template]['status'],
            };
            const itemReqId =
              whatsapMsgsMap[item.orderId][template]['requestId'];
            if (itemReqId in needToUpdateMap) {
              el[template]['status'] = needToUpdateMap[itemReqId]['status'];
            }
          } else {
            el[template] = null;
          }
        });
        dmoResponse.data.push(el);
      });
      return dmoResponse;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async sendWhatsAppMessageForDispute(orderId: string) {
    try {
      const [err, settingObj] =
        await this.deltaMachineRepository.getSettingByKey(
          'setting_wa_automation_dmo_phase_1'
        );
      const templateName = process.env.FRESHCHAT_TEMPLATE_BUYER_DISPUTE;
      const orders = await this.orderService.findOrdersById([orderId]);
      if (err || !orders.length) {
        logger.error(
          `Error out while sending "${templateName}" cannot get product`
        );
        return;
      }
      const settingValue: WhatsappAutomationSettingSubmoduleInputType =
        JSON.parse(settingObj.value);
      if (settingValue?.whatsapp?.dispute_message?.value) {
        const orderData = this.populateOrdersData(orders[0]);
        await this.freshchatService.sendOutboundMsg({
          templateName: process.env.FRESHCHAT_TEMPLATE_BUYER_DISPUTE,
          phoneNumber: orderData.buyerPhone,
          productId: orderData.productId,
          productName: orderData.productName,
          orderId: orderData.orderNumber,
        });
      }
    } catch (error) {
      console.log('Error on sending buyer msg');
    }
  }

  async getOrdersStatus(ordersId: string[]) {
    try {
      const [dmoErr, dmOrders] =
        await this.deltaMachineRepository.getListByOrderIds(ordersId);
      if (dmoErr) {
        this.error.errorCode = dmOrders.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmOrders.result.toString();
        this.error.message = dmOrders.message;
        throw this.error;
      }
      return dmOrders.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_USER_ORDERS,
          exception
        );
      }
    }
  }
  async getWalletInfo(userId: string, orderId: string, userType: string) {
    try {
      const wallet = await GetWallet({ ownerId: userId });
      let pendingTransaction;
      if (userType === UserType.SELLER) {
        // get pending transaction
        const transactions: GetTransactionsResponse = await GetTransactions({
          orderId: orderId,
        });
        pendingTransaction = (transactions?.data || []).find(
          (transaction: TransactionResponse) =>
            transaction?.walletId === wallet?.id
        );
      }

      return {
        balance: wallet?.balance,
        id: wallet?.id,
        status: wallet?.status,
        pendingTransactions: wallet?.pendingTransactions,
        onholdBalance: wallet?.onholdBalance,
        availableBalance: wallet?.availableBalance,
        totalBalance: wallet?.totalBalance,
        tag: wallet?.tag,
        creditStatus: pendingTransaction?.status || '',
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_WALLET,
          exception
        );
      }
    }
  }

  async getDMOrderByOrderId(orderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getByOrderId(
        orderId
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return (data as any).result as DeltaMachineOrderDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception
        );
      }
    }
  }

  async getDMOrderByOrderNumber(orderNumber: string) {
    try {
      const [err, data] =
        await this.deltaMachineRepository.getDMOrderByOrderNumber(
          orderNumber.toString()
        );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return (data as any).result as DeltaMachineOrderDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception
        );
      }
    }
  }

  async getDMUser(userId: string) {
    try {
      const [errUser, userRes] = await this.deltaMachineRepository.getUserById(
        userId
      );
      if (errUser) {
        this.error.errorCode = (userRes as any).code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = (userRes as any).result.toString();
        this.error.message = (userRes as any).message;
        throw this.error;
      }
      return (userRes as any).result as DeltaMachineUserDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_WALLET,
          exception
        );
      }
    }
  }
  async getIBANInfo(userId: string) {
    try {
      const [userErr, userRes] = await this.userRepository.getIBANInformation(
        userId
      );
      if (userErr) {
        this.error.errorCode = userRes.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = userRes.result.toString();
        this.error.message = userRes.message;
        throw this.error;
      }
      const user = userRes.result as UserLegacyDocument;
      let currentIBAN = '';
      let currentBankBIC = '';
      let currentAccountName = '';
      let bankData: BankDocument;
      if ((user.bankDetail || {}).hasOwnProperty('accountId')) {
        try {
          currentIBAN = decryptIBAN(user.bankDetail.accountId, user.secretKey);
        } catch (err) {}
      }
      if ((user.bankDetail || {}).hasOwnProperty('bankBIC')) {
        currentBankBIC = decrypt(user.bankDetail.bankBIC, user.secretKey);
        const [, resBank] = await this.bankRepository.getBankDetailViaCode(
          currentBankBIC
        );
        bankData = resBank.result as BankDocument;
      }
      if ((user.bankDetail || {}).hasOwnProperty('accountHolderName')) {
        currentAccountName = user.bankDetail.accountHolderName;
      }
      return {
        iban: currentIBAN,
        accountName: currentAccountName,
        bankId: bankData?._id || '',
        bankName: bankData?.bankName || '',
        bankCode: bankData?.bankCode || '',
        bankNameAr: bankData?.bankName_ar || '',
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_USER,
          exception
        );
      }
    }
  }

  async sendAwaitingSellerToShipOutboundMsg(
    dmOrderId: string,
    orderId: string,
    statusId: string
  ) {
    const templateName = process.env.FRESHCHAT_TEMPLATE_AWAITING_SELLER_TO_SHIP;

    if (!templateName) {
      logger.error(
        `Error out while executing "sendAwaitingSellerToShipOutboundMsg" cannot get "templateName"`
      );
      return;
    }

    try {
      const [errOrder, orderData] = await this.orderRepository.getById(orderId);
      if (errOrder) {
        logger.error(
          `Error out while sending "${templateName}" cannot get order`
        );
        return;
      }
      const order = orderData.result as OrderDocument;
      const [productErr, productData] =
        await this.productRepository.getProductDetail(order?.product);

      if (productErr) {
        logger.error(
          `Error out while sending "${templateName}" cannot get product`
        );
        return;
      }
      const product = productData.result;
      const user = await this.userRepository.getUserById(product.user_id);

      if (!user) {
        logger.error(
          `Error out while sending "${templateName}" cannot get user`
        );
        return;
      }
      const userPhoneNumber = `+${user.countryCode}${user.mobileNumber}`;
      await this.freshchatService.sendOutboundMsg({
        templateName,
        phoneNumber: userPhoneNumber,
        productName: product?.models?.model_name,
        userId: product.user_id,
      });
      await this.update(dmOrderId, {
        statusId,
      });
    } catch (exception) {
      // we dont want to block the cronjob
      logger.error(`Error out while sending "${templateName}" ${exception}`);
      return;
    }
  }

  async sendFirstPublishOutboundMsg(productId: string) {
    const templateName = process.env.FRESHCHAT_TEMPLATE_FIRST_PUBLISHED_V2;

    if (!templateName) {
      logger.error(
        `Error out while executing "sendFirstPublishOutboundMsg" cannot get "templateName"`
      );
      return;
    }

    try {
      const settings = await this.getSettingByKey(
        'setting_wa_automation_dmo_phase_1'
      );

      if (!settings) return;

      if (!settings?.whatsapp?.seller_publishing?.value) return;

      const [productErr, productData] =
        await this.productRepository.getProductDetail(productId);

      if (productErr) {
        logger.error(
          `Error out while sending "${templateName}" cannot get product`
        );
        return;
      }
      const product = productData.result;
      const user = await this.userRepository.getUserById(product.user_id);

      if (!user) {
        logger.error(
          `Error out while sending "${templateName}" cannot get user`
        );
        return;
      }

      const userPhoneNumber = `+${user.countryCode}${user.mobileNumber}`;

      const [err, data] = await this.whatsAppMsgRepository.find({
        userId: product.user_id,
        templateName,
      });
      let isNewMsg = true;

      // if there is no error,
      // means that 'first_publish_success_new' has already been sent
      if (!err) {
        const whatsAppMsg = data.result;
        const diffInTime =
          new Date().getTime() - new Date(whatsAppMsg.updatedAt).getTime();
        const diffInDays = diffInTime / (1000 * 3600 * 24);
        await this.whatsAppMsgRepository.update(
          {
            userId: product.user_id,
            templateName,
          },
          { updatedAt: new Date() }
        );
        if (diffInDays <= 30) {
          return;
        }
        isNewMsg = false;
      }
      await this.freshchatService.sendOutboundMsg(
        {
          templateName,
          phoneNumber: userPhoneNumber,
          productId: productId,
          productName: product?.models?.model_name,
          userId: product.user_id,
          categoryId: product?.category_id,
        },
        isNewMsg
      );
    } catch (exception) {
      // we dont want to block approving the product
      logger.error(`Error out while sending "${templateName}" ${exception}`);
      return;
    }
  }
  async getDetailsOfOrder(orderId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const [err, data] = await this.orderRepository.getById(orderId);
        if (err) {
          reject(err);
        } else {
          resolve(data.result);
        }
      } catch (exception) {
        if (exception instanceof ErrorResponseDto) {
          reject(exception);
        } else {
          reject(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
              exception.message
            )
          );
        }
      }
    });
  }
  async deleteUser(userId: string, adName: string) {
    try {
      return await this.deltaMachineRepository.deleteUser(userId, adName);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
          exception.message
        );
      }
    }
  }
  async getRoles() {
    try {
      const inputReq: GetUserRolesRequest = {};
      return await GetUserRoles(inputReq);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_USER_ROLE,
          exception.message
        );
      }
    }
  }
  async updatePayoutCreditCommission(editPayoutInput: UpdatePayoutOrderInput) {
    try {
      const [err, data] = await this.orderService.getOrderDetail(
        editPayoutInput.order_id,
        'seller'
      );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ORDER_DETAIL,
          data.message
        );
      }
      const currentCommission = Number(data.order.setting_commission);
      if (currentCommission != editPayoutInput.commission) {
        await this.productService.updateSellerCommission({
          sellerNewCommission: editPayoutInput.commission,
          product: {
            id: data.order.product._id.toString(),
          },
        });
      }
      // get total amount after change commission
      const [, updatedOrder] = await this.orderService.getOrderDetail(
        editPayoutInput.order_id,
        'seller'
      );
      const recordId: string = await AirTable.getAirTableRecordById(
        data.order.order_number
      );
      await AirTable.updateAirTableRecordCommissionAmountById(
        recordId,
        formatPriceInDecimalPoints(updatedOrder.order.commission)
      );
      // get pending transaction
      const transactions: GetTransactionsResponse = await GetTransactions({
        orderId: editPayoutInput.order_id,
      });
      const pendingTransaction = transactions.data.find(
        (transaction: TransactionResponse) =>
          transaction.status === 'Pending' && transaction.type === 'Credit'
      );
      // update credit wallet amount
      await UpdatePendingAmountTransaction({
        transactionId: pendingTransaction.id,
        amount: updatedOrder.order.grand_total,
      });
      return Constants.MESSAGE.UPDATE_PAYOUT_CREDIT_COMMISSION_SUCCESSFULLY;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_SELLER_COMMISSION_ORDER,
          exception.message
        );
      }
    }
  }
  async cancelCreditTransaction(order: OrderDocument) {
    const creditTransactions: any = await GetCreditsByOrderIds({
      orderIds: [order._id],
    });
    let pendingCredit: TransactionResponse = null;
    if (creditTransactions.data) {
      creditTransactions.data.forEach((element: TransactionResponse) => {
        if (
          element.ownerId == order.seller._id.toString() &&
          element.status === WalletTransactionStatus.PENDING
        ) {
          pendingCredit = element;
        }
      });
    }
    if (pendingCredit) {
      // Update credit transaction for seller
      await UpdateTransaction({
        transactionId: pendingCredit.id,
        status: WalletTransactionStatus.CANCELED,
      });
    }
  }

  async checkActiveDMOrders(
    sellerId: string,
    productsCount: number
  ): Promise<boolean> {
    const orders = await this.findOrdersByUserId(sellerId);
    if (orders.length < productsCount) return true;
    if (orders.length) {
      const orderIds = [];
      for (const order of orders) {
        orderIds.push(order._id);
      }
      const dmOrders: DeltaMachineOrderDocument[] = await this.findDMOrdersById(
        orderIds
      );
      const statuses = await this.getStatusList();
      for (const dmOrder of dmOrders) {
        const currentStatusDocument = (
          statuses as DeltaMachineStatusDocument[]
        ).find(
          status =>
            status.toObject().id.toString() === dmOrder.statusId.toString()
        );
        if (
          currentStatusDocument?.submodule !==
          DeltaMachineStatusSubmodule.CLOSED
        )
          return true;
      }
      return false;
    }
    return true;
  }

  private async findOrdersByUserId(id: string) {
    return await this.orderService.findOrdersByUserId(id);
  }

  async findDMOrdersById(
    orderIds: string[]
  ): Promise<DeltaMachineOrderDocument[]> {
    const [dmoErr, dmOrders] =
      await this.deltaMachineRepository.getListByOrderIds(orderIds);
    if (dmoErr) {
      this.error.errorCode = dmOrders.code;
      this.error.errorType = Constants.ERROR_TYPE.API;
      this.error.errorKey = dmOrders.result.toString();
      this.error.message = dmOrders.message;
      throw this.error;
    }
    return dmOrders.result as DeltaMachineOrderDocument[];
  }

  async getDMOrdersBySeller(sellerId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: SellerDMOrder[] | string;
        message?: string;
      }
    ]
  > {
    return await this.deltaMachineRepository.getDMOrdersOfSeller(sellerId);
  }

  async getDMOrdersByUserId(
    sellerId: string,
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
    return await this.deltaMachineRepository.getDMOrdersByUserId(
      sellerId,
      submodule,
      limit,
      skip,
      statusIds
    );
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
    return await this.deltaMachineRepository.getDMOrdersByBuyerId(buyerId);
  }

  async trackOrderStatusInSMSA(trackingNumber: string): Promise<string> {
    const secomResponse = await Secom.trackOrder(trackingNumber);
    if (secomResponse.error) {
      return '';
    } else {
      return secomResponse?.result?.status || '';
    }
  }

  async trackOrderStatusesInSMSA(dmOrders: DeltaMachineOrderDocument[]) {
    const promises: any[] = [];
    dmOrders.forEach(dmOrder => {
      promises.push(
        new Promise(resolve => {
          this.trackOrderStatusInSMSA(dmOrder.trackingNumber).then(
            (orderStatusInSMSA: string) => {
              resolve({
                orderStatusInSMSA,
                dmOrderId: dmOrder.id,
                orderId: dmOrder.orderId,
                tracningNumber: dmOrder.trackingNumber,
              });
            }
          );
        })
      );
    });
    return promises;
  }

  async updateStatuses(dmOrderId: string, statusId: string) {
    await this.createActivityLogEvent(dmOrderId, statusId, '', '');
    const { dmoStatusDocument } = await this.updateAirTableRecordStatus(
      dmOrderId,
      statusId
    );
    let updateData: any = {
      statusId: statusId,
    };
    const dmOrderRes = await this.getById(dmOrderId);
    if (dmoStatusDocument?.name === DeltaMachineStatusName.ITEM_DELIVERED) {
      const isDelivered = dmOrderRes?.orderData?.deliveryDate;
      updateData = {
        statusId: statusId,
        'orderData.deliveryDate': isDelivered ? isDelivered : new Date(),
      };
    }
    if (dmoStatusDocument?.name === DeltaMachineStatusName.IN_TRANSIT) {
      const isShipped = dmOrderRes?.orderData?.shippingDate;
      updateData = {
        statusId: statusId,
        'orderData.shippingDate': isShipped ? isShipped : new Date(),
      };
    }
    const data = await this.update(dmOrderId, updateData);
    const dmOrder = data?.result as DeltaMachineOrderDocument;
    const toggleSettings = await this.getSettingByKey(
      'setting_om_status_automation'
    );
    if (dmoStatusDocument?.name === DeltaMachineStatusName.IN_TRANSIT) {
      if (
        toggleSettings?.automation?.backlog_intransit_orders?.value === true
      ) {
        let delay =
          new Date().getTime() - dmOrder?.orderData?.shippingDate?.getTime();
        delay = delay >= 432000000 ? 0 : 432000000; // 120 hours delay
        this.bullMQService.addJob(
          {
            id: dmOrderId,
            type: JobTypes.IN_TRANSIT,
          },
          {
            delay,
            removeOnComplete: true,
          }
        );
      }
    }
    if (dmoStatusDocument?.name === DeltaMachineStatusName.ITEM_DELIVERED) {
      if (
        toggleSettings?.automation?.setting_item_delivered_automation?.value ===
        true
      ) {
        let delay =
          new Date().getTime() - dmOrder?.orderData?.deliveryDate?.getTime();
        delay = delay >= 86400000 ? 0 : delay; // 24 hours delay
        this.bullMQService.addJob(
          {
            id: dmOrderId,
            type: JobTypes.ITEM_DELIVERED,
          },
          {
            delay,
            removeOnComplete: true,
          }
        );
        this.bullMQService.addJob(
          {
            id: dmOrderId,
            type: JobTypes.SEND_MESSAGE_ON_DM_STATUS_CHANGE,
          },
          {
            delay: 0,
            removeOnComplete: true,
          }
        );
      }
    }
  }

  async getDMOrderByTrackingNo(trackingId: string, reverse: boolean = false) {
    try {
      const [err, data] =
        await this.deltaMachineRepository.getOrderByTrackingNo(
          trackingId,
          reverse
        );
      if (!err) {
        return data?.result as DeltaMachineOrderDocument;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  async getDMOrderByLastMileTrackingNo(lastMileTrackingNumber: string) {
    try {
      const [err, data] =
        await this.deltaMachineRepository.getDMOrderByLastMileTrackingNo(
          lastMileTrackingNumber
        );
      if (!err) {
        return data?.result as DeltaMachineOrderDocument;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  async updateStatusByTrackingId(
    dmOrderId: string,
    trackingId: string,
    statusId: string,
    reverse: boolean = false,
    isInTransit: boolean = false
  ) {
    try {
      await this.createActivityLogEvent(
        dmOrderId,
        statusId,
        '',
        'SMSA automation'
      );
      const [err] = await this.deltaMachineRepository.updateByTrackingId(
        trackingId,
        statusId,
        reverse
      );
      if (!err) {
        await this.updateAirTableRecordStatus(dmOrderId, statusId);
      }
      if (isInTransit) {
        const toggleSettings = await this.getSettingByKey(
          'setting_om_status_automation'
        );
        if (
          toggleSettings?.automation?.backlog_intransit_orders?.value === true
        ) {
          const dmOrder = await this.getById(dmOrderId);
          const timeDifference =
            new Date().getTime() - dmOrder?.orderData?.shippingDate?.getTime();
          let delay = 432000000 - timeDifference;
          delay = delay < 0 ? 0 : delay; // 120 hours delay
          this.bullMQService.addJob(
            {
              id: dmOrderId,
              type: JobTypes.IN_TRANSIT,
            },
            {
              delay,
              removeOnComplete: true,
            }
          );
          this.bullMQService.addJob(
            {
              id: dmOrderId,
              type: JobTypes.SEND_MESSAGE_ON_DM_STATUS_CHANGE,
            },
            {
              delay: 0,
              removeOnComplete: true,
            }
          );
        }
      }
    } catch (err) {
      // do nothing
    }
  }

  async updateStatusByLastMileTrackingId(
    dmOrderId: string,
    trackingId: string,
    statusId: string
  ) {
    try {
      await this.createActivityLogEvent(
        dmOrderId,
        statusId,
        '',
        'SMSA automation'
      );
      const [err] =
        await this.deltaMachineRepository.updateByLastMileTrackingId(
          trackingId,
          statusId
        );
      if (!err) {
        await this.updateAirTableRecordStatus(dmOrderId, statusId);
      }
    } catch (err) {
      // do nothing
    }
  }

  async sendWECreateOrderEvent(result: OrderData): Promise<void> {
    const product = await this.productRepository.findProductById(
      result?.productId
    );
    const condition = await getProductCondition({
      id: product.condition_id,
      variantId: product.varient_id,
      sellPrice: product.sell_price,
    } as GetProductCatConRequest);
    const priceRange = condition?.priceQuality?.name || null;
    const webEngageData = {
      'Seller ID': result?.sellerId,
      'Seller Name': result?.sellerName || '',
      'Model Name': result?.modelName,
      Variants: result?.varient || '',
      'Product ID': result?.productId || '',
      'Timestamp of the listing creation': result?.createdAt || '',
      'Sell Price': result?.sellPrice || '',
      'Category Name': result?.categoryName || '',
      'Brand Name': result?.brandName,
      Condition: result?.productCondition,
      'Buy Price': result?.grandTotal,
      'Price Range': priceRange,
    };
    const webEngageDataSold = {
      'Seller ID': result?.sellerId,
      'Seller Name': result?.sellerName || '',
      'Model Name': result?.modelName,
      Variants: result?.varient || '',
      'Product ID': result?.productId || '',
      'Created Time': result?.createdAt || '',
      'Sell Price': result?.sellPrice || '',
      'Category Name': result?.categoryName || '',
      'Brand Name': result?.brandName,
      'Listing Condition': result?.productCondition,
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      result?.sellerId || 'Dave ID',
      'Order Tracking Medium Timer',
      dateFormat,
      webEngageData
    );

    await sendEventData(
      result?.sellerId || 'Dave ID',
      'Product Sold',
      dateFormat,
      webEngageDataSold
    );
  }

  async sendWEUpdateOrderEvent(orderId: string = ''): Promise<void> {
    const [, orderData] = await this.orderService.getOrderDetail(orderId);
    const [, userData] = await this.userService.getUserInfo(
      orderData?.order?.seller,
      'name'
    );
    const webEngageData = {
      'Seller ID': orderData?.order?.seller,
      'Seller Name': userData?.name || '',
      'Model Name': orderData?.order?.product?.model?.model_name || '',
      Variants: orderData?.order?.product?.varient || '',
      'Product ID': orderData?.order?.product?._id || '',
      'Order ID': orderId || '',
    };

    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

    await sendEventData(
      orderData?.order?.seller || 'Dave ID',
      'Order Tracking Head Nearest Shipping',
      dateFormat,
      webEngageData
    );
  }

  async generateReverseTrackingNumber(orderId: string) {
    try {
      const orders = await this.orderService.findOrdersById([orderId]);
      const orderData = this.populateOrdersData(orders[0]);
      const switchPhone = orderData.buyerPhone;
      orderData.buyerPhone = orderData.sellerPhone;
      orderData.sellerPhone = switchPhone;
      const [errAddress, data] = await this.userService.getListUserAddress(
        orders[0]?.seller
      );
      if (!errAddress) {
        const sellerAddresses = data.result as AddressDocument[];
        if (sellerAddresses.length) {
          const sellerAddress = sellerAddresses.pop();
          orderData.buyerCity = sellerAddress?.city || orderData.sellerCity;
          if (sellerAddress?.street) {
            orderData.buyerAddress = `${sellerAddress?.street}
              ${sellerAddress?.district || ''}
              ${sellerAddress?.postal_code || ''}`;
          }
          orderData.buyerStreet =
            sellerAddress?.street || orderData.sellerStreet;
          orderData.buyerPostalCode =
            sellerAddress?.postal_code || orderData.sellerPostalCode;
          orderData.buyerDistrict =
            sellerAddress?.district || orderData.sellerDistrict;
        }
      }
      const [errBuyerAddress, buyerData] =
        await this.userService.getListUserAddress(orders[0]?.buyer);
      if (!errBuyerAddress) {
        const buyerAddresses = buyerData.result as AddressDocument[];
        if (buyerAddresses.length) {
          const buyerAddress = buyerAddresses.pop();
          orderData.sellerCity = buyerAddress?.city || orderData.buyerCity;
          if (buyerAddress?.street) {
            orderData.sellerAddress = `${buyerAddress?.street}
              ${buyerAddress?.district || ''}
              ${buyerAddress?.postal_code || ''}`;
          }
          orderData.sellerStreet =
            buyerAddress?.street || orderData.buyerStreet;
          orderData.sellerPostalCode =
            buyerAddress?.postal_code || orderData.buyerPostalCode;
          orderData.sellerDistrict =
            buyerAddress?.district || orderData.buyerDistrict;
        }
      }
      const switchName = orderData.sellerName;
      orderData.sellerName = orderData.buyerName;
      orderData.buyerName = switchName;
      // const reverseTrackingNumber = await this.generatetrackingNumber(
      //   orderId,
      //   orderData
      // );

      const reverseTrackingNumber = await this.handleShipmentCreation(
        ShipmentTypeEnum.REVERSE_LAST_MILE,
        orderData,
        orderId
      );
      if (reverseTrackingNumber) {
        await this.deltaMachineRepository.update(
          { orderId: orderId },
          { reverseSMSATrackingNumber: reverseTrackingNumber }
        );
      }
      return reverseTrackingNumber;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GENERATE_TO_REVERSE_TRACKING_NUMBER,
          exception.message
        );
      }
    }
  }
  async sendWEConfirmedAvailabilityEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageData = {
      'Product ID': orderData?.productId || '',
      'Buyer ID': orderData?.buyerId || '',
      'Buyer phone number': orderData?.buyerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };

    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

    await sendEventData(
      orderData?.buyerId || 'Dave ID',
      'OM - Buyer - Confirmed Availability',
      dateFormat,
      webEngageData
    );
  }

  async sendWEDisputeEvent(
    orderId: string,
    invalidDispute: boolean
  ): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataBuyer = {
      'Product ID': orderData?.productId || '',
      'Buyer ID': orderData?.buyerId || '',
      'Buyer phone number': orderData?.buyerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };
    const webEngageDataSeller = {
      'Product ID': orderData?.productId || '',
      'Seller ID': orderData?.sellerId || '',
      'Seller phone number': orderData?.sellerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };

    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

    await sendEventData(
      orderData?.buyerId,
      invalidDispute
        ? 'OM - Buyer - Valid Dispute'
        : 'OM - Buyer - Invalid Dispute',
      dateFormat,
      webEngageDataBuyer
    );
    await sendEventData(
      orderData?.sellerId,
      invalidDispute
        ? 'OM - Seller - Valid Dispute'
        : 'OM - Seller - Invalid Dispute',
      dateFormat,
      webEngageDataSeller
    );
  }
  async sendWEDisputeActionEvent(
    orderId: string,
    eventSeller: string,
    eventBuyer: string
  ): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataBuyer = {
      'Product ID': orderData?.productId || '',
      'Buyer ID': orderData?.buyerId || '',
      'Buyer phone number': orderData?.buyerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };
    const webEngageDataSeller = {
      'Product ID': orderData?.productId || '',
      'Seller ID': orderData?.sellerId || '',
      'Seller phone number': orderData?.sellerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };

    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

    await sendEventData(
      orderData?.buyerId,
      eventBuyer,
      dateFormat,
      webEngageDataBuyer
    );
    await sendEventData(
      orderData?.sellerId,
      eventSeller,
      dateFormat,
      webEngageDataSeller
    );
  }
  async sendWEConfirmedUnAvailabilityEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageData = {
      'Product ID': orderData?.productId || '',
      'Buyer ID': orderData?.buyerId || '',
      'Buyer phone number': orderData?.buyerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };

    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;

    await sendEventData(
      orderData?.buyerId,
      'OM - Buyer - Confirmed UnAvailability',
      dateFormat,
      webEngageData
    );
  }
  async updateDMO(id: string, dataToUpdate: any) {
    try {
      const [err, data] = await this.deltaMachineRepository.update(
        { _id: id },
        { ...dataToUpdate, ...{ updatedAt: new Date() } }
      );

      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_UPDATE_DMO,
          exception.message
        );
      }
    }
  }

  async sendWEDisputeRaisedEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataSeller = {
      'Product ID': orderData?.productId,
      'Seller ID': orderData?.sellerId,
      'Seller phone number': orderData?.sellerPhone,
      'Order ID': orderId,
      'Order Number': orderData?.orderNumber,
      'Product Name': orderData?.productName,
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderData?.sellerId,
      'OM - Seller - Dispute Raised',
      dateFormat,
      webEngageDataSeller
    );
  }
  async sendWEConfirmDropOffEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataBuyer = {
      'Product ID': orderData?.productId || '',
      'Buyer ID': orderData?.buyerId || '',
      'Buyer phone number': orderData?.buyerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };
    const webEngageDataSeller = {
      'Product ID': orderData?.productId || '',
      'Seller ID': orderData?.sellerId || '',
      'Seller phone number': orderData?.sellerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderData?.buyerId,
      'OM - Buyer - in transit',
      dateFormat,
      webEngageDataBuyer
    );
    await sendEventData(
      orderData?.sellerId,
      'OM - Seller - in transit',
      dateFormat,
      webEngageDataSeller
    );
  }
  async sendWEConfirmedDeliveryEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataBuyer = {
      'Product ID': orderData?.productId,
      'Buyer ID': orderData?.buyerId,
      'Buyer phone number': orderData?.buyerPhone,
      'Order ID': orderId,
      'Order Number': orderData?.orderNumber,
      'Product Name': orderData?.productName,
    };
    const webEngageDataSeller = {
      'Product ID': orderData?.productId,
      'Seller ID': orderData?.sellerId,
      'Seller phone number': orderData?.sellerPhone,
      'Order ID': orderId,
      'Order Number': orderData?.orderNumber,
      'Product Name': orderData?.productName,
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderData?.buyerId,
      'OM - Buyer - Delivered',
      dateFormat,
      webEngageDataBuyer
    );
    await sendEventData(
      orderData?.sellerId,
      'OM - Seller - Delivered',
      dateFormat,
      webEngageDataSeller
    );
  }
  async sendWEConfirmDeliveryEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataBuyer = {
      'Product ID': orderData?.productId || '',
      'Buyer ID': orderData?.buyerId || '',
      'Buyer phone number': orderData?.buyerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
      'Return/Warranty': orderData.returnWarranty,
    };
    const webEngageDataSeller = {
      'Product ID': orderData?.productId || '',
      'Seller ID': orderData?.sellerId || '',
      'Seller phone number': orderData?.sellerPhone || '',
      'Order ID': orderId || '',
      'Order Number': orderData?.orderNumber || '',
      'Product Name': orderData?.productName || '',
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderData?.buyerId,
      'OM - Buyer - Order Item-Delivered',
      dateFormat,
      webEngageDataBuyer
    );
    await sendEventData(
      orderData?.sellerId,
      'OM - Seller - Order Item-Delivered',
      dateFormat,
      webEngageDataSeller
    );
  }

  async sendWEConfirmedPayoutEvent(orderId: string): Promise<void> {
    const orders = await this.orderService.findOrdersById([orderId]);
    const orderData = this.populateOrdersData(orders[0]);
    const webEngageDataBuyer = {
      'Product ID': orderData?.productId,
      'Buyer ID': orderData?.buyerId,
      'Buyer phone number': orderData?.buyerPhone,
      'Order ID': orderId,
      'Order Number': orderData?.orderNumber,
      'Product Name': orderData?.productName,
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderData?.buyerId,
      'OM - Buyer - Payout Requested',
      dateFormat,
      webEngageDataBuyer
    );
  }
  async handleShipmentCreation(
    shipemntType: ShipmentTypeEnum,
    order: any,
    orderId: string
  ) {
    const vaultSettings = await getSecretData('/secret/data/apiv2');
    const excludedCategories = JSON.parse(
      vaultSettings['excludedCategoryForShipment'] || '[]'
    );

    // Check if the order's category is in the excluded list
    if (excludedCategories.includes(order.categoryId)) {
      return null; // Return null to indicate no shipment should be created
    }

    const shipmentService: any =
      vaultSettings['shipmentService'] || ShipmentServiceEnum.SMSA;
    let awbNo = null;
    if (shipmentService === ShipmentServiceEnum.SMSA) {
      if (shipemntType == ShipmentTypeEnum.LAST_MILE) {
        awbNo = await this.generatetrackingNumber(`${orderId}_lastmile`, order);
      } else if (shipemntType == ShipmentTypeEnum.FIRST_MILE) {
        awbNo = await this.generatetrackingNumber(`${orderId}`, order);
      } else if (shipemntType == ShipmentTypeEnum.REVERSE_LAST_MILE) {
        awbNo = await this.generatetrackingNumber(`${orderId}`, order);
      } else if (shipemntType == ShipmentTypeEnum.POST_INSPECTION) {
        awbNo = await this.generatetrackingNumber(
          `${orderId}_post_inspection`,
          order
        );
      }
    } else if (shipmentService === ShipmentServiceEnum.TOROD) {
      awbNo = await this.createShipmentOrderAndTrackingNumber(
        order,
        shipemntType
      );
    }
    return awbNo;
  }
  async createPickUpForOrder(
    orderId: string,
    dmOrderId: string,
    isRiyadhSpecificPickup: boolean = false
  ): Promise<boolean> {
    try {
      const [, sysSettings] = await this.settingService.getSettingsObjectByKeys(
        ['disable_be_one']
      );
      const isBeOneDisabled = sysSettings['disable_be_one'];
      if (isBeOneDisabled) return false;
      const orders = await this.orderService.findOrdersById([orderId]);
      const [, data] = await this.deltaMachineRepository.getById(dmOrderId);
      const dmOrder = data?.result as DeltaMachineOrderDocument;
      if (orders?.length === 0) {
        return false;
      }
      const orderData = this.populateOrdersData(orders[0]);
      const description: string = orderData?.addOns
        ? `${orderData.productName},
        ${orderData?.addOns}`
        : orderData.productName;
      const pickUpObj = await CreatePickupForOrder({
        referenceNo: orderData?.orderNumber,
        originCity: orderData?.sellerCity,
        destinationCity: orderData?.buyerCity,
        senderName: orderData?.sellerName,
        senderPhone: orderData?.sellerPhone,
        senderAddress: orderData?.sellerAddress,
        receiverName: orderData?.buyerName,
        receiverPhone: orderData?.buyerPhone,
        receiverAddress: orderData?.buyerAddress,
        trackingNumber: dmOrder?.trackingNumber,
        description,
      });
      if (pickUpObj?.awbNo) {
        let trackingNumber = dmOrder?.trackingNumber || '';
        if (isRiyadhSpecificPickup) {
          trackingNumber = pickUpObj?.awbNo;
        }
        const recordId: string = await AirTable.getAirTableRecordById(
          orderData.orderNumber
        );
        await AirTable.updateAirTableRecord(
          recordId,
          pickUpObj?.awbNo,
          trackingNumber
        );
        await this.update(dmOrderId, {
          pickUpTrackingNumber: pickUpObj.awbNo,
          trackingNumber,
        });
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  }

  async createPickUpForAccessories(
    dmOrderId: string,
    orderData: OrderData
  ): Promise<boolean> {
    try {
      const [, sysSettings] = await this.settingService.getSettingsObjectByKeys(
        ['disable_be_one']
      );
      const isBeOneDisabled = sysSettings['disable_be_one'];
      if (isBeOneDisabled) return false;
      const description: string = orderData?.addOns;
      const pickUpAccessoriesObj: CreatePickupForAccessoriesRequest = {
        referenceNo: `${orderData?.orderNumber}-1`,
        originCity: orderData?.sellerCity,
        destinationCity: orderData?.buyerCity,
        senderName: orderData?.sellerName,
        senderPhone: orderData?.sellerPhone,
        senderAddress: orderData?.sellerAddress,
        receiverName: orderData?.buyerName,
        receiverPhone: orderData?.buyerPhone,
        receiverAddress: orderData?.buyerAddress,
        trackingNumber: orderData?.trackingNumber,
        description,
        skudetails: [],
      };
      const addOns = orderData?.addOns.split(',');
      for (let item of addOns) {
        if (item === 'Apple 20W USB C Charger') {
          item = 'CHG-AP20W-UC-WH';
        } else if (item === 'Apple USB C To Lightning Cable (1M)') {
          item = 'CBL-AP-UC-LT-1M-WH';
        } else if (item === 'Apple USB To Lightning Cable (1M)') {
          item = 'CBL-AP-USB-LT-1M-WH';
        }
        pickUpAccessoriesObj.skudetails.push({
          sku: item,
          description: item,
          cod: '0',
          piece: '1',
          weight: '1',
        });
      }
      const pickUpObj = await createPickUpForAccessories(pickUpAccessoriesObj);
      if (pickUpObj?.awbNo) {
        await this.update(dmOrderId, {
          pickUpAddOnsTrackingNumber: pickUpObj.awbNo,
        });
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  async handleConfirmationJob(dmOrderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (!err) {
        const dmOrder = data.result as DeltaMachineOrderDocument;
        const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
        if (
          dmOrderStatus.name === DeltaMachineStatusName.CONFIRMED_AVAILABILITY
        ) {
          const [errAddress, data] = await this.userService.getListUserAddress(
            dmOrder?.orderData?.sellerId
          );
          if (!errAddress) {
            const sellerAddresses = data.result as AddressDocument[];
            if (sellerAddresses?.length) {
              const sellerAddress = sellerAddresses.pop();
              const sellerCity = sellerAddress?.city;
              let statusId: '';
              if (
                sellerCity === Cities.RIYADH_AR ||
                sellerCity === Cities.RIYADH
              ) {
                const dmOrderStatusObj = await this.getStatusByName(
                  DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP
                );
                statusId = dmOrderStatusObj.id;
              } else {
                const dmOrderStatusObj = await this.getStatusByName(
                  DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP
                );
                statusId = dmOrderStatusObj.id;
              }
              await this.createActivityLogEvent(
                dmOrderId,
                statusId,
                '',
                'Automation'
              );
              await this.update(dmOrderId, { statusId });
              await this.updateAirTableRecordStatus(dmOrderId, statusId);
            }
          }
        }
      }
    } catch (err) {}
  }

  async handleAwaitingSellerToShipJob(dmOrderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (!err) {
        const dmOrder = data.result as DeltaMachineOrderDocument;
        const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
        if (
          dmOrderStatus.name === DeltaMachineStatusName.AWAITING_SELLER_TO_SHIP
        ) {
          const dmOrderStatusObj = await this.getStatusByName(
            DeltaMachineStatusName.BACKLOG_AWAITING_SELLER_TO_SHIP
          );
          await this.createActivityLogEvent(
            dmOrderId,
            dmOrderStatusObj.id,
            '',
            'Automation'
          );
          await this.update(dmOrderId, { statusId: dmOrderStatusObj.id });
          await this.updateAirTableRecordStatus(dmOrderId, dmOrderStatusObj.id);
        }
      }
    } catch (err) {}
  }

  async handleAwaitingCourierToPickUpJob(dmOrderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (!err) {
        const dmOrder = data.result as DeltaMachineOrderDocument;
        const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
        if (
          dmOrderStatus.name ===
          DeltaMachineStatusName.AWAITING_COURIER_TO_PICKUP
        ) {
          const dmOrderStatusObj = await this.getStatusByName(
            DeltaMachineStatusName.BACKLOG_AWAITING_COURIER_TO_PICK_UP
          );
          await this.createActivityLogEvent(
            dmOrderId,
            dmOrderStatusObj.id,
            '',
            'Automation'
          );
          await this.update(dmOrderId, { statusId: dmOrderStatusObj.id });
          await this.updateAirTableRecordStatus(dmOrderId, dmOrderStatusObj.id);
        }
      }
    } catch (err) {}
  }

  async handleNewOrdersJob(dmOrderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (!err) {
        const dmOrder = data.result as DeltaMachineOrderDocument;
        if (
          dmOrder?.orderData?.orderType === OrderType.SOUM_RIYADH_TO_RIYADH ||
          dmOrder?.orderData?.orderType === OrderType.SOUM_RIYADH_TO_OTHER
        ) {
          return;
        }
        const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
        if (
          dmOrderStatus.name === DeltaMachineStatusName.NEW_ORDER ||
          dmOrderStatus.name === DeltaMachineStatusName.TO_CONFIRM_AVAILABILITY
        ) {
          const dmOrderStatusObj = await this.getStatusByName(
            DeltaMachineStatusName.REFUND_TO_BUYER
          );
          await this.createActivityLogEvent(
            dmOrderId,
            dmOrderStatusObj.id,
            '',
            'Automation'
          );
          await this.update(dmOrderId, { statusId: dmOrderStatusObj.id });
          await this.updateAirTableRecordStatus(dmOrderId, dmOrderStatusObj.id);
          await this.createDmoNCTReason(
            {
              dmoId: dmOrder?.id,
              orderId: dmOrder?.orderId,
            },
            {
              userId: 'adId',
              nctReasonName: 'passed-24-hrs-with-no-response',
            }
          );
          await this.sendWEConfirmedUnAvailabilityEvent(dmOrder?.orderId);
          const automationSettings = await this.getSettingByKey(
            'setting_om_status_automation'
          );
          const omAutomationRefundUnavailable =
            automationSettings?.automation?.refund_confirmed_timeout;
          if (omAutomationRefundUnavailable?.value) {
            await this.handleBuyerRefund(
              dmOrder?.orderId,
              dmOrder?.id,
              false,
              'Automation',
              ''
            );
          }
        }
      }
    } catch (err) {}
  }

  async handleOrderStatusUpdateFreshChatMessage(
    dmOrderId: string,
    enableWA?: boolean
  ) {
    try {
      const [, sysSettings] = await this.settingService.getSettingsObjectByKeys(
        ['item_delivered_in_transit_messages']
      );
      const canSendMessage = sysSettings['item_delivered_in_transit_messages'];
      if (canSendMessage === false && !enableWA) return;
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (err) {
        return false;
      }
      const dmOrder = data.result as DeltaMachineOrderDocument;
      const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
      const orders = await this.orderService.findOrdersById([dmOrder.orderId]);
      const orderData = this.populateOrdersData(orders[0]);
      let templateName: string = null;
      const payload = {
        phoneNumber: orderData.buyerPhone,
        productName: orderData.productName,
        orderNumber: orderData.orderNumber,
        remainingAmount: orderData?.remainingAmount || 0,
      };
      if (dmOrderStatus.name === DeltaMachineStatusName.IN_TRANSIT) {
        templateName = process.env.FRESHCHAT_IN_TRANSIT_V1;
      }
      if (dmOrderStatus.name === DeltaMachineStatusName.ITEM_DELIVERED) {
        templateName = process.env.FRESHCHAT_ITEM_DELIVERED_V1;
      }

      if (
        dmOrderStatus.name === DeltaMachineStatusName.WAITING_FOR_FULL_AMOUNT
      ) {
        templateName =
          process.env.FRESHCHAT_TEMPLATE_RESERVATION_COMPLETE_PAYMENT;
        const [buyerErr, orderDetailBuyer] =
          await this.orderService.getOrderDetail(dmOrder.orderId, 'buyer');

        if (!buyerErr) {
          payload.remainingAmount =
            orderDetailBuyer?.order?.reservation?.reservationRemainingAmount;
        }
      }

      if (templateName) {
        await this.freshchatService.sendOutboundMsg({
          templateName,
          ...payload,
        });
      }
    } catch (err) {
      console.log({ err });
    }
  }

  async handleBacklogIntransitOrderJob(dmOrderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (err) {
        return false;
      }
      const dmOrder = data.result as DeltaMachineOrderDocument;
      const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
      if (dmOrderStatus.name === DeltaMachineStatusName.IN_TRANSIT) {
        const dmOrderStatusObj = await this.getStatusByName(
          DeltaMachineStatusName.BACKLOG_IN_TRANSIT
        );
        await this.createActivityLogEvent(
          dmOrderId,
          dmOrderStatusObj.id,
          '',
          'Automation'
        );
        await this.update(dmOrderId, { statusId: dmOrderStatusObj.id });

        await this.updateAirTableRecordStatus(dmOrderId, dmOrderStatusObj.id);
      }
    } catch (err) {}
  }

  async handleB1StatusAutomation(
    statusId: string,
    isDelivered: boolean,
    statuses: DeltaMachineStatusDocument[]
  ) {
    try {
      const dmOrders = await this.getOrdersByStatus(statuses, true);
      const awbNumbers: any = {
        awbNo: [],
        isDelivered,
      };
      dmOrders.forEach(dmOrder => {
        awbNumbers.awbNo.push(dmOrder.pickUpTrackingNumber);
      });
      const data = await GetPickupStatuses(awbNumbers);
      let canUpdate = true;
      if (data?.awbNo?.length) {
        for (const awbNo of data.awbNo) {
          canUpdate = true;
          const dmOrder = dmOrders.find(
            dmOrder => dmOrder.pickUpTrackingNumber === awbNo
          );
          if (isDelivered) {
            let buyerCity = '';
            let sellerCity = '';
            const [errAddress, data] =
              await this.userService.getListUserAddress(
                dmOrder?.orderData?.buyerId
              );
            if (!errAddress) {
              const buyerAddresses = data.result as AddressDocument[];
              if (buyerAddresses.length) {
                const buyerAddress = buyerAddresses.pop();
                dmOrder.orderData.buyerCity = buyerAddress?.city;
              }
            }
            const [errAddressSeller, sellerData] =
              await this.userService.getListUserAddress(
                dmOrder?.orderData?.sellerId
              );
            if (!errAddressSeller) {
              const sellerAddresses = sellerData.result as AddressDocument[];
              if (sellerAddresses.length) {
                const sellerAddress = sellerAddresses.pop();
                dmOrder.orderData.sellerCity = sellerAddress?.city;
              }
            }
            if (
              dmOrder?.orderData?.buyerCity === Cities.RIYADH ||
              dmOrder?.orderData?.buyerCity === Cities.RIYADH_AR
            ) {
              buyerCity = Cities.RIYADH;
            } else if (
              dmOrder?.orderData?.buyerCity === Cities.JEDDAH ||
              dmOrder?.orderData?.buyerCity === Cities.JEDDAH_AR
            ) {
              buyerCity = Cities.JEDDAH;
            }
            if (
              dmOrder?.orderData?.sellerCity === Cities.RIYADH ||
              dmOrder?.orderData?.sellerCity === Cities.RIYADH_AR
            ) {
              sellerCity = Cities.RIYADH;
            } else if (
              dmOrder?.orderData?.sellerCity === Cities.JEDDAH ||
              dmOrder?.orderData?.sellerCity === Cities.JEDDAH_AR
            ) {
              sellerCity = Cities.JEDDAH;
            }
            if (
              buyerCity === sellerCity &&
              buyerCity !== Cities.JEDDAH &&
              buyerCity !== Cities.RIYADH
            ) {
              canUpdate = false;
            }
            if (buyerCity !== sellerCity) {
              canUpdate = false;
            }
          }
          try {
            if (canUpdate) {
              const recordId: string = await AirTable.getAirTableRecordById(
                dmOrder?.orderData?.orderNumber
              );
              await this.updateAirTableRecordStatus(dmOrder?.id, statusId);
              await AirTable.updateAirTableRecordPickupStatus(
                recordId,
                isDelivered
              );
              await this.update(dmOrder.id, { statusId });
            }
          } catch (err) {}
        }
      }
      return data?.awbNo?.length;
    } catch (err) {}
  }

  async handleItemDeliveriedJob(dmOrderId: string) {
    try {
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (!err) {
        const dmOrder = data.result as DeltaMachineOrderDocument;
        const dmOrderStatus = await this.getStatusById(dmOrder.statusId);
        if (dmOrderStatus.name === DeltaMachineStatusName.ITEM_DELIVERED) {
          const dmOrderStatusObj = await this.getStatusByName(
            DeltaMachineStatusName.PAYOUT_TO_SELLER
          );
          await this.createActivityLogEvent(
            dmOrderId,
            dmOrderStatusObj.id,
            '',
            'Automation'
          );
          await this.updateAirTableRecordStatus(dmOrderId, dmOrderStatusObj.id);
          await this.update(dmOrderId, { statusId: dmOrderStatusObj.id });
        }
      }
    } catch (err) {}
  }

  async sendGenerativeQASeller(productId: string, categoryId: string) {
    try {
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const generatetiveQAToggle = JSON.parse(
        vaultSettings['generative_qa_toggle'] || 'false'
      );
      const generativeQAs = JSON.parse(
        vaultSettings['generative_qa_question_list'] || '{}'
      );
      if (
        generatetiveQAToggle &&
        Object.keys(generativeQAs)?.length > 0 &&
        Object.keys(generativeQAs)?.includes(categoryId)
      ) {
        const generativeQuestions = generativeQAs[categoryId] || [];
        const generativeQACountdownInHours = JSON.parse(
          vaultSettings['generative_qa_countdown'] || '0'
        );
        let generativeQACountdownValInMS =
          generativeQACountdownInHours * 60 * 60 * 1000;
        generativeQACountdownValInMS =
          generativeQACountdownValInMS < 1
            ? 30000
            : generativeQACountdownValInMS;
        this.bullMQService.addJob(
          {
            id: productId,
            type: JobTypes.GENERATIVE_QA_TO_SELLER,
            questions: generativeQuestions,
            sellerPhone: generativeQACountdownValInMS,
          },
          {
            delay: generativeQACountdownValInMS,
            removeOnComplete: true,
          }
        );
      }
    } catch (error) {
      logger.error(`Fail to sendGenerativeQASeller ${error}`);
    }
  }

  async createSellerDeletionNudgeJob(
    productId: string,
    sellerPhone: string,
    isFirstTime: boolean = false
  ) {
    try {
      const [errProductData, productRes] =
        await this.productRepository.getProductById(productId);
      if (errProductData) return;
      const product = productRes.result as ILegacyProductModel;
      const modelId = product?.model_id;
      const [errSettings, sysSettings] =
        await this.settingService.getSettingsObjectByKeys([
          'deactivation_message_countdown',
          'send_deactivation_messages',
          'price_nudge_message_countdown',
          'seller_price_nudge_message',
        ]);
      if (errSettings) return;
      // price nudge message
      const sellerPriceNudegeMsgStr = sysSettings['seller_price_nudge_message'];
      if (sellerPriceNudegeMsgStr) {
        const priceNudgeCountdownInHours =
          sysSettings['price_nudge_message_countdown'];
        let priceNudgeCountdownValInMS =
          priceNudgeCountdownInHours * 60 * 60 * 1000;
        priceNudgeCountdownValInMS =
          priceNudgeCountdownValInMS < 1 ? 30000 : priceNudgeCountdownValInMS;
        this.bullMQService.addJob(
          {
            id: productId,
            sellerPhone: sellerPhone,
            type: JobTypes.PRICE_NUDGE_MESSAGE,
          },
          {
            delay: priceNudgeCountdownValInMS,
            removeOnComplete: true,
          }
        );
      }
      const categoryId = product?.category_id;
      await this.sendGenerativeQASeller(productId, categoryId?.toString());
      const modelsStr = sysSettings['send_deactivation_messages'];
      const modelExists = modelsStr?.includes(modelId);
      if (modelExists) return;

      const settings = await this.getSettingByKey(
        'setting_wa_automation_dmo_phase_1'
      );
      if (!settings.whatsapp.seller_detection_nudge?.value) return;
      if (product?.status !== ProductStatus.Active) return;
      const user = await this.userRepository.getUserById(product.user_id);
      const isKeySeller = user?.isKeySeller || false;
      const isMerchantSeller = user?.isMerchant || false;
      if (isKeySeller) return;
      if (isMerchantSeller) return;
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const firstMessageCountdown = JSON.parse(
        vaultSettings['first_message_countdown'] || '8'
      );
      const countdownValInHours = isFirstTime
        ? parseFloat(firstMessageCountdown)
        : sysSettings['deactivation_message_countdown'];
      let countdownValInMS = countdownValInHours * (60 * 60 * 1000);
      countdownValInMS = countdownValInMS < 1 ? 30000 : countdownValInMS;
      this.bullMQService.addJob(
        {
          id: productId,
          sellerPhone: sellerPhone,
          type: JobTypes.SELLER_DELETION_NUDGE,
        },
        {
          delay: countdownValInMS,
          removeOnComplete: true,
        }
      );
    } catch (err) {}
  }
  async validateSellerDetectionNudge() {
    try {
      const settings = await this.getSettingByKey(
        'setting_wa_automation_dmo_phase_1'
      );
      return {
        isActiveSellerDetectionNudge:
          settings.whatsapp.seller_detection_nudge?.value || false,
      } as ValidateSellerDetectionNudgeResponse;
    } catch (err) {}
  }

  async handleProductApprovedMessageJob(
    productId: string,
    sellerPhone: string
  ) {
    try {
      const [errProduct, productData] =
        await this.productRepository.getDetailProduct(productId);
      if (errProduct) return;
      const product = productData.result;
      if (!sellerPhone) {
        sellerPhone = '+' + product.seller_country_code + product.seller_phone;
      }
      await this.freshchatService.sendOutboundMsg({
        templateName: process.env.FRESHCHAT_TEMPLATE_FIRST_PUBLISHED_V2,
        phoneNumber: sellerPhone,
        productName: product?.models?.model_name_ar || '',
        categoryId: product?.category_id,
      });
    } catch (err) {}
  }
  async sendShippingInfoMessage(sellerPhone: string) {
    try {
      await this.freshchatService.sendOutboundMsg({
        templateName: process.env.FRESHCHAT_TEMPLATE_SHIPPING_INFO_V2,
        phoneNumber: sellerPhone,
      });
    } catch (err) {}
  }
  async createSellerEngagementJob(productId: string, sellerPhone: string) {
    try {
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const sellerEngagementMessageToggle = JSON.parse(
        vaultSettings['seller_engagement_message'] || 'false'
      );
      if (!sellerEngagementMessageToggle) return;
      const [err, data] = await this.productRepository.getProductById(
        productId
      );
      if (err) return;
      const product = data.result as ILegacyProductModel;
      if (product?.status !== ProductStatus.Active) return;
      const user = await this.userRepository.getUserById(product.user_id);
      const isKeySeller = user?.isKeySeller || false;
      const isMerchantSeller = user?.isMerchant || false;
      if (isKeySeller) return;
      if (isMerchantSeller) return;
      const countdownValInHours = JSON.parse(
        vaultSettings['engagement_message_countdown'] || '0'
      );
      const countdownValInMS =
        countdownValInHours < 1 ? 30000 : countdownValInHours * 60 * 60 * 1000;
      this.bullMQService.addJob(
        {
          id: productId,
          sellerPhone: sellerPhone,
          type: JobTypes.SELLER_ENGAGEMENT_MESSAGE,
        },
        {
          delay: countdownValInMS,
          removeOnComplete: true,
        }
      );
    } catch (err) {}
  }

  async handleSellerEngagementJob(productId: string, sellerPhone: string) {
    try {
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const sellerEngagementMessageToggle = JSON.parse(
        vaultSettings['seller_engagement_message'] || 'false'
      );
      if (!sellerEngagementMessageToggle) return;
      const [errProduct, productData] =
        await this.productRepository.getProductDetailById(productId);
      if (errProduct) return;
      const product = productData.result;
      if (product?.status !== ProductStatus.Active) return;
      const user = await this.userRepository.getUserById(product.user_id);
      const sellerName = user?.name || '';
      const sellPrice = product?.sell_price || 0;
      const imagesQualityScore = product?.imagesQualityScore;
      let suggestedSellPrice = 0;
      const [errVariant, varientData] =
        await this.variantService.getShortVariantByID(product?.varient_id);
      if (!errVariant) {
        const varient = (varientData as any).result as VariantDocument;
        suggestedSellPrice = varient?.current_price;
      }
      const productViews = await UFR.getProductViewslById(productId);
      let templateName = '';
      if (sellPrice <= suggestedSellPrice && imagesQualityScore > 7) {
        templateName =
          process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_IDEAL_LISTING;
      } else if (sellPrice > suggestedSellPrice && imagesQualityScore > 7) {
        templateName =
          process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_HIGH_SCORE;
      } else if (sellPrice > suggestedSellPrice && imagesQualityScore < 7) {
        templateName =
          process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_NOT_IDEAL_LISTING;
      } else if (sellPrice < suggestedSellPrice && imagesQualityScore < 7) {
        templateName =
          process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_BAD_IMAGES;
      }
      let isNewMessage = false;
      const [err, data] =
        await this.whatsAppMsgRepository.getSellerEngagementMessageByPhone(
          sellerPhone
        );
      if (err) {
        isNewMessage = true;
      } else {
        const whatsAppMsg = data?.result as WhatsAppMsgDocument;
        if (whatsAppMsg?.productId.toString() !== productId.toString()) {
          whatsAppMsg.productId = productId;
          await this.whatsAppMsgRepository.update(
            { _id: whatsAppMsg.id },
            whatsAppMsg
          );
        }
      }
      await this.freshchatService.sendOutboundMsg(
        {
          templateName,
          phoneNumber: sellerPhone,
          productId,
          sellerName,
          sellPrice,
          suggestedSellPrice,
          productName: product?.models?.model_name_ar || '',
          productViews,
          templateType: 'seller_engagement_message',
        },
        isNewMessage
      );
      await this.createSellerEngagementJob(productId, sellerPhone);
    } catch (error) {
      console.log('Error on sending unresponsiveness msg: ', error);
    }
  }

  async handleSellerDeletionNudgeJob(productId: string, sellerPhone: string) {
    try {
      let templateName = '';
      const settings = await this.getSettingByKey(
        'setting_wa_automation_dmo_phase_1'
      );
      if (!settings.whatsapp.seller_detection_nudge?.value) return;
      const [errProduct, productData] =
        await this.productRepository.getProductDetailById(productId);
      if (errProduct) return;
      const product = productData.result;
      if (product?.status !== ProductStatus.Active) return;
      let isNewMsg = false;
      let whatsAppMsg;
      templateName = process.env.FRESHCHAT_TEMPLATE_SELLER_DELETION_NUDGE_V3;
      const [err, data] = await this.whatsAppMsgRepository.getByPhone(
        sellerPhone,
        templateName,
        productId
      );
      if (err) {
        isNewMsg = true;
      } else {
        whatsAppMsg = data?.result as WhatsAppMsgDocument;
        if (whatsAppMsg?.userResponse === 'no') {
          return;
        }
      }
      let willNotFulfill = false;
      const productLabel = await UFR.getProductUFRLabelById(productId);
      if (whatsAppMsg) {
        whatsAppMsg.productUFRLabel = productLabel;
        whatsAppMsg.productUFRLabels = whatsAppMsg.productUFRLabels || [];
        whatsAppMsg.productUFRLabels.push(productLabel);
        await this.whatsAppMsgRepository.update(
          { _id: whatsAppMsg.id },
          whatsAppMsg
        );
      }
      let sellerPayout = '0';
      if (productLabel === UFRLabelType.WILL_NOT_FULFILL) {
        templateName =
          process.env.FRESHCHAT_TEMPLATE_WILL_NOT_FULFILL_DEACTIVATION;
        this.productService.updateProductActivationStatus(productId, false);
        willNotFulfill = true;
      } else {
        const data: any = {
          orderId: null,
          productId,
          isBuyer: false,
          isOriginalBreakDown: product.promocode ? false : true,
        };
        const productCommission = await getProductSummaryCommission(data);
        sellerPayout = productCommission?.grandTotal?.toString() || '0';
      }
      await this.freshchatService.sendOutboundMsg(
        {
          templateName,
          phoneNumber: sellerPhone,
          productId,
          productName: product?.models?.model_name,
          sellerPayout,
        },
        isNewMsg
      );
      if (willNotFulfill) return;
      await this.createSellerDeletionNudgeJob(productId, sellerPhone);
      const [errSettings, sysSettings] =
        await this.settingRepository.getSettingsObjectByKeys([
          'deactivation_unresponsiveness_countdown',
        ]);
      if (errSettings) return;
      const countdownValInHours =
        sysSettings['deactivation_unresponsiveness_countdown'];
      let countdownValInMS = countdownValInHours * 60 * 60 * 1000;
      countdownValInMS = countdownValInMS < 1 ? 60000 : countdownValInMS;
      this.bullMQService.addJob(
        {
          id: productId,
          sellerPhone: sellerPhone,
          type: JobTypes.SELLER_UNRESPONSIVE_NUDGE,
        },
        {
          delay: countdownValInMS,
          removeOnComplete: true,
        }
      );
    } catch (error) {
      console.log('Error on sending unresponsiveness msg: ', error);
    }
  }

  async handleSellerDeactivationNudgeJob(
    productId: string,
    sellerPhone: string
  ) {
    try {
      const [err, data] = await this.whatsAppMsgRepository.getByPhone(
        sellerPhone,
        process.env.FRESHCHAT_TEMPLATE_SELLER_DELETION_NUDGE_V3,
        productId
      );
      if (err) return;
      const whatsAppMsg = data?.result as WhatsAppMsgDocument;
      if (whatsAppMsg?.userResponse === '') {
        const settings = await this.getSettingByKey(
          'setting_wa_automation_dmo_phase_1'
        );
        if (
          settings.whatsapp.deletion_nudge_unresponsiveness_deactivation?.value
        ) {
          const templateName =
            process.env.FRESHCHAT_TEMPLATE_SELLER_UNRESPONSIVE_MESSAGE;
          this.productService.updateProductActivationStatus(productId, false);
          await this.freshchatService.sendOutboundMsg(
            {
              templateName,
              phoneNumber: sellerPhone,
              productId,
            },
            false
          );
        }
      }
    } catch (error) {
      console.log('Error on sending activation msg: ', error);
    }
  }

  async handleFreshChatAutomation(
    userId: string,
    conversationId: string,
    sellerPhone: string,
    messageText: string
  ) {
    try {
      const templateName =
        process.env.FRESHCHAT_TEMPLATE_SELLER_DELETION_NUDGE_V3;
      const [whatsAppMsgErr, whatsAppMsgData] =
        await this.whatsAppMsgRepository.getByPhone(
          sellerPhone,
          templateName,
          ''
        );
      let userResponse = '';
      let userUnavailabilityResponse = '';
      switch (messageText) {
        case FreshchatResponse.PRODUCT_NOT_AVAILABLE:
          userResponse = 'no';
          const settings = await this.getSettingByKey(
            'setting_wa_automation_dmo_phase_1'
          );
          if (
            settings?.whatsapp.deletion_nudge_unresponsiveness_deactivation
              ?.value
          ) {
            if (whatsAppMsgErr) return;
            const whatsAppMsg = whatsAppMsgData?.result as WhatsAppMsgDocument;
            this.productService.updateProductActivationStatus(
              whatsAppMsg?.productId,
              false
            );
          }
          break;
        case FreshchatResponse.PRODUCT_NOT_AVAILABLE_ENGAGEMENT_MESSAGE:
          const [err, data] =
            await this.whatsAppMsgRepository.getSellerEngagementMessageByPhone(
              sellerPhone
            );
          if (err) return;
          const whatsAppMsg = data?.result as WhatsAppMsgDocument;
          this.productService.updateProductActivationStatus(
            whatsAppMsg?.productId,
            false
          );
          break;
        case FreshchatResponse.PRODUCT_IS_AVAILABLE:
          userResponse = 'yes';
          break;
        case FreshchatResponse.SOLD_ELSEWHERE:
        case FreshchatResponse.NOT_SATISFIED:
        case FreshchatResponse.KEPT_IT:
        case FreshchatResponse.UNCLEAR_SHIPPING_PROCESS:
        case FreshchatResponse.ANOTHER_REASON:
          userUnavailabilityResponse = messageText;
          break;
        default:
          userResponse = '';
          userUnavailabilityResponse = '';
      }
      if (whatsAppMsgErr) return;
      const whatsAppMsg = whatsAppMsgData?.result as WhatsAppMsgDocument;
      if (userResponse !== '') {
        whatsAppMsg.userResponse = userResponse;
        whatsAppMsg.userResponses = whatsAppMsg.userResponses || [];
        whatsAppMsg.userResponses.push(userResponse);
      }
      if (userUnavailabilityResponse !== '') {
        whatsAppMsg.userUnavailabilityResponse = userUnavailabilityResponse;
      }
      if (userResponse !== '' || userUnavailabilityResponse !== '') {
        whatsAppMsg.freshchatUserId = userId;
        whatsAppMsg.freshchatConversationId = conversationId;
        await this.whatsAppMsgRepository.update(
          { _id: whatsAppMsg.id },
          whatsAppMsg
        );
      }
    } catch (error) {}
  }

  addPayoutInvoiceJob(orderId: string) {
    this.invoiceBullMQService.addJob(
      {
        id: orderId,
        type: InvoiceJobType.SELLER_INVOICE_TYPE,
        requestType: InvoiceFormats.ZATCA,
      },
      {
        delay: 0,
        removeOnComplete: true,
      }
    );
    this.invoiceBullMQService.addJob(
      {
        id: orderId,
        type: InvoiceJobType.BUYER_INVOICE_TYPE,
        requestType: InvoiceFormats.ZATCA,
      },
      {
        delay: 0,
        removeOnComplete: true,
      }
    );
  }
  addCreditNotesJob(orderId: string) {
    this.invoiceBullMQService.addJob(
      {
        id: orderId,
        type: InvoiceJobType.SELLER_INVOICE_TYPE,
        requestType: InvoiceFormats.ZATCA_CREDIT_NOTE,
      },
      {
        delay: 0,
        removeOnComplete: true,
      }
    );
    this.invoiceBullMQService.addJob(
      {
        id: orderId,
        type: InvoiceJobType.BUYER_INVOICE_TYPE,
        requestType: InvoiceFormats.ZATCA_CREDIT_NOTE,
      },
      {
        delay: 0,
        removeOnComplete: true,
      }
    );
  }
  async handleInvoiceGenerationJob(
    orderId: string,
    invoiceType: InvoiceJobType,
    reqType: InvoiceFormats
  ) {
    try {
      await this.orderService.generatePdfDMInvoice(
        orderId,
        invoiceType,
        reqType
      );
      return;
    } catch (err) {
      logger.error(err);
      return;
    }
  }

  addSellerResponseDailyReportJob() {
    this.dailyReportBullMQService.addJob(
      {},
      {
        delay: 0,
        removeOnComplete: true,
      }
    );
  }
  async handleDailyReportJob() {
    try {
      const sendTo = (
        process.env.SELLER_REPONSE_SENDGRID_NOTIFIED_USER as string
      ).split(',');
      const sendToDev = (process.env.SENDGRID_TO_DEV as string).split(',');
      const [err, result] =
        await this.whatsAppMsgRepository.getWAMResponseWithinPeriod();
      if (err) {
        return await sendMail({
          to: sendToDev,
          subject: '[Alert] Daily seller repsponse report - Get Data Failed',
          text: result.message,
        });
      }
      // Create Excel file
      const title = `Deletion Message Daily Report From ${moment()
        .subtract(1, 'days')
        .format('D-MMM')} to ${moment().format('D-MMM')}`;
      const [genError, sheetContent] =
        await generateDelectionMessageSellerResponseSheet(
          result.result as WhatsAppMsgReportDto[],
          title
        );
      if (genError) {
        return await sendMail({
          to: sendToDev,
          subject:
            '[Alert] Daily seller response report - Generated Sheet Failed',
          text: JSON.stringify(sheetContent),
        });
      }

      // Send Email
      const [sendError, sendingResult] = await sendMail({
        to: sendTo,
        subject: `[Deletion Message Daily Report]- ${title}`,
        // eslint-disable-next-line max-len
        html: '<p>Dear Soum Admin!</p><p> This is auto generated email for <strong>Daily Seller Response Report</strong>.</p><p>Thanks in advance</p><p>Tech Team</p>',
        fileName: `summary_whatsapp_responses_${new Date().toDateString()}.xlsx`,
        fileContent: sheetContent,
      });

      return [
        sendError,
        {
          message: Constants.MESSAGE.EMAIL_SENT,
          result: JSON.stringify(sendingResult),
        },
      ];
    } catch (err) {
      logger.error(err);
      return;
    }
  }

  async decreasePromoUsageCount(orderId: string) {
    const order = await this.getDetailsOfOrder(orderId);
    const promoCodeId = order.promos?.buyerPromocodeId;
    if (promoCodeId) {
      const decrementCountResult = await updatePromoCodeUsageCount({
        promoCodeId: promoCodeId,
        count: -1,
      });
      if (!decrementCountResult.ok) {
        SlackUtil.emitSlackMessageAlert(
          `Failed to increment promo code ${promoCodeId} on ${order?.orderNumber}.`
        );
      }
    }
  }
  async handleBuyerRefund(
    orderId: string,
    dmoId: string,
    canAccessAll: boolean = false,
    adName: string,
    adId: string,
    amountBuyer?: number,
    accountName?: string,
    iban?: string,
    bankId?: string
  ) {
    try {
      const order = await this.getDetailsOfOrder(orderId);
      if (order.payment_type === PaymentProviderType.Tabby) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MAKE_INSTANT_REFUND_TABBY_TYPE,
          Constants.MESSAGE.FAILED_TO_MAKE_INSTANT_REFUND_FOR_ORDER_TABBY_TYPE
        );
      }
      if (order.payment_type === PaymentProviderType.TAMARA) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_MAKE_INSTANT_REFUND_TAMARA_TYPE,
          Constants.MESSAGE.FAILED_TO_MAKE_INSTANT_REFUND_FOR_ORDER_TAMARA_TYPE
        );
      }
      const isDonePayoutOrRefund = await this.isDonePayoutOrRefund(
        orderId,
        canAccessAll
      );
      if (isDonePayoutOrRefund) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.LIMIT_PAYOUT_REFUND_FOR_ORDER,
          Constants.MESSAGE.LIMIT_PAYOUT_REFUND_FOR_ORDER
        );
      }
      if (!bankId) {
        const bankInfo = await this.getIBANInfo(order.buyer);
        bankId = bankInfo.bankId;
        accountName = bankInfo.accountName;
        iban = bankInfo.iban;
      }
      const [errBank, bank] = await this.bankRepository.getById(bankId);
      if (errBank) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          bank.result.toString(),
          bank.message
        );
      }
      const bankDetail = bank.result as BankDocument;
      const bankDetailRequest: BankDetailInput = {
        iban: iban,
        bankBIC: bankDetail.bankCode,
        bankName: bankDetail.bankName,
        accountHolderName: accountName,
      };
      await this.updateBankUserDetail(orderId, bankDetailRequest);
      const statusObj = await this.getStatusByName(
        DeltaMachineStatusName.REFUND_FAILED
      );
      const updateData = {
        statusId: statusObj.id,
      };
      const orders = await this.orderService.findOrdersById([orderId]);
      if (orders.length === 0) {
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
          Constants.MESSAGE.FAILED_TO_GET_ORDER
        );
      }
      const orderData = this.populateOrdersData(orders[0]);
      if (!amountBuyer) {
        amountBuyer = order.grand_total;
      }
      if (orderData?.isReservation || orderData?.isFinancing) {
        const [buyerrErr, orderDetailBuyer] =
          await this.orderService.getOrderDetail(orderId, 'buyer');
        if (!buyerrErr) {
          amountBuyer = orderDetailBuyer?.order?.reservation?.reservationAmount;
        }
      }
      try {
        const [err, data] = await this.payoutOrderHyperSplit(
          adId,
          orderId,
          amountBuyer,
          adName,
          DisplayName.InstantRefund,
          'buyer'
        );
        if (err) {
          await this.updateAirTableRecordStatus(dmoId, statusObj.id);
          await this.update(dmoId, updateData);
          return new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            data.result.toString(),
            data.message
          );
        } else {
          // trigger activity log
          await this.createActivityLogPayoutRefundEvent(
            adId,
            adName,
            orderId,
            data.result.transactionStatus,
            PaymentMethod.InstantRefund
          );
          // Cancel seller credit transaction
          await this.cancelCreditTransaction(order);
          const webEngageData = {
            'Product ID': orderData?.productId,
            'Buyer ID': orderData?.buyerId,
            'Buyer Phone Number': orderData?.buyerPhone,
            'Order ID': orderId,
            'Order Number': orderData?.orderNumber,
            'Refund Amount': amountBuyer,
            'Product Name': orderData?.productName,
          };
          const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
          await sendEventData(
            orderData?.buyerId,
            'Order Refunded',
            dateFormat,
            webEngageData
          );
          const dmOrderStatus = await this.getStatusByName(
            DeltaMachineStatusName.REFUNDED
          );
          const targetStatusId = dmOrderStatus._id;
          await this.updateAirTableRecordStatus(dmoId, targetStatusId);
          await this.createActivityLogEvent(
            dmoId,
            targetStatusId,
            adId,
            adName
          );
          const updateData = {
            ...{
              statusId: targetStatusId,
            },
          };
          await this.update(dmoId, updateData);
          const promoCodeId = order.promos?.buyerPromocodeId;
          if (promoCodeId) {
            const decrementCountResult = await updatePromoCodeUsageCount({
              promoCodeId: promoCodeId,
              count: -1,
            });
            if (!decrementCountResult.ok) {
              SlackUtil.emitSlackMessageAlert(
                `Failed to increment promo code ${promoCodeId} on ${orderData?.orderNumber}.`
              );
            }
          }
          return data.result;
        }
      } catch (err) {
        await this.updateAirTableRecordStatus(dmoId, statusObj.id);
        await this.update(dmoId, updateData);
        return new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          err?.result?.toString(),
          err?.message
        );
      }
    } catch (err) {
      const statusObj = await this.getStatusByName(
        DeltaMachineStatusName.REFUND_FAILED
      );
      const updateData = {
        statusId: statusObj.id,
      };
      await this.updateAirTableRecordStatus(dmoId, statusObj.id);
      await this.update(dmoId, updateData);
      logger.error(err);
      return;
    }
  }
  async handlePriceNudgeMessage(productId: string, userPhoneNumber: string) {
    try {
      const templateName = process.env.FRESHCHAT_TEMPLATE_PRICE_NUDGE_MESSAGE;
      const [productErr, productData] =
        await this.productRepository.getProductDetail(productId);

      if (productErr) {
        logger.error(
          `Error out while sending "${templateName}" cannot get product`
        );
        return;
      }
      const product = productData.result;
      if (!product?.recommended_price || product?.status !== 'Active') {
        return;
      }
      const user = await this.userRepository.getUserById(product?.user_id);
      if (!user) {
        logger.error(
          `Error out while sending "${templateName}" cannot get user`
        );
        return;
      }
      const isIndividualSellerType = !user?.isMerchant && !user?.isKeySeller;
      const isPriceNudge = product?.sell_price > product?.recommended_price;
      if (!(isIndividualSellerType && isPriceNudge)) {
        return;
      }
      await this.freshchatService.sendOutboundMsg({
        templateName,
        phoneNumber: userPhoneNumber,
        productName: product?.models?.model_name,
        userId: product?.user_id,
        sellPrice: product?.sell_price,
        recommendedPrice: product?.recommended_price,
      });
      return;
    } catch (error) {
      logger.error(error);
      return;
    }
  }
  async handleGenerativeQASelerJob(
    productId: string,
    generativeQuestions: string[],
    generativeQACountdownValInMS?: number
  ) {
    try {
      const [productErr, productData] =
        await this.productRepository.getProductDetail(productId);

      if (productErr) {
        logger.error(`Error out while cannot get product`);
        return;
      }
      const product = productData.result;
      if (product?.status !== 'Active') {
        logger.error(`Error out while product is not active`);
        return;
      }
      const user = await this.userRepository.getUserById(product?.user_id);
      if (!user) {
        logger.error(`Error out while cannot get user`);
        return;
      }
      const isIndividualSellerType = !user?.isMerchant && !user?.isKeySeller;
      if (!isIndividualSellerType) return;
      const generativeQuestion =
        generativeQuestions[
          Math.floor(Math.random() * generativeQuestions.length)
        ];
      await this.productRepository.addGenerativeQASeller(
        productId,
        generativeQuestion
      );
      generativeQuestions = generativeQuestions.filter(
        question => question !== generativeQuestion
      );
      if (generativeQuestions?.length > 0) {
        this.bullMQService.addJob(
          {
            id: productId,
            type: JobTypes.GENERATIVE_QA_TO_SELLER,
            questions: generativeQuestions,
            sellerPhone: generativeQACountdownValInMS,
          },
          {
            delay: generativeQACountdownValInMS,
            removeOnComplete: true,
          }
        );
      }
      return;
    } catch (error) {
      logger.error(error);
      return;
    }
  }
  async handleBuyerWithdrawalJob(
    dmoId: string,
    orderId: string = ''
  ): Promise<boolean> {
    try {
      let dmoNCTReason;
      dmoNCTReason = await this.findDmoNCTReasonByOrderId(dmoId);
      if (!dmoNCTReason && orderId?.length > 0) {
        dmoNCTReason = await this.findDmoNCTReasonByOrderId(orderId);
      }
      if (!dmoNCTReason) {
        return false;
      }
      const nctReason = await this.getSpecificNCTReasons({
        name: NCTReasonName.BUYER_WITHDRAW,
      });
      if (
        nctReason?._id?.toString() !== dmoNCTReason?.nctReasonId?.toString()
      ) {
        return false;
      }
      const dmoStatus = await this.getStatusByName(
        DeltaMachineStatusName.REFUND_TO_BUYER
      );
      let dmo = await this.getById(dmoId);
      if (!dmo && orderId?.length > 0) {
        dmo = await this.getDmoById(orderId, dmoId);
      }
      if (dmoStatus?._id?.toString() !== dmo?.statusId?.toString()) {
        return false;
      }
      const cancellation = await GetCancellationFee({});
      const cancelFee = cancellation?.cancelFee || 0;
      await this.update(dmo._id, {
        'orderData.cancellationFee': cancelFee,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async addJobToAutoConfirmAvailability(dmoId: string, sellerId: string) {
    try {
      const vaultSettings = await getSecretData('/secret/data/apiv2');
      const fbsSellersSetting = JSON.parse(
        vaultSettings?.['fbsSellers'] || '[]'
      );
      if (fbsSellersSetting && fbsSellersSetting.includes(sellerId)) {
        this.bullMQService.addJob(
          {
            id: dmoId,
            type: JobTypes.FBS_SELLER_AUTO_CONFIRM_AVAILABILITY,
          },
          {
            delay: 0,
            removeOnComplete: true,
          },
          Queues.DM_ORDERS
        );
      }
      return;
    } catch (error) {
      logger.error(`Fail to addJobToAutoConfirmAvailability ${error}`);
      return;
    }
  }

  async handleFbsSellerAutoDeliveredToIC(dmoId: string) {
    try {
      const [, deliveredToInspectionCenterData] =
        await this.deltaMachineRepository.getStatusByName(
          'delivered-to-inspection-center'
        );
      const deliveredToInspectionCenter =
        deliveredToInspectionCenterData.result as DeltaMachineStatusDocument;
      await this.deltaMachineRepository.update(
        { _id: dmoId },
        {
          statusId: deliveredToInspectionCenter.id,
          ...{ updatedAt: new Date() },
        }
      );
      await this.updateAirTableRecordStatus(
        dmoId,
        deliveredToInspectionCenter.id
      );
      await this.createActivityLogEvent(
        dmoId,
        deliveredToInspectionCenter.id,
        '',
        ''
      );
    } catch (err) {
      console.log({ err });
      throw err;
    }
  }

  async getDmoById(
    orderId: string,
    dmoId: string
  ): Promise<DeltaMachineOrderDocument> {
    try {
      const [err, dmoData] = await this.deltaMachineRepository.getDmoById(
        orderId,
        dmoId
      );
      if (err) {
        return null;
      }
      return dmoData?.result as DeltaMachineOrderDocument;
    } catch (error) {
      logger.log(error);
      return null;
    }
  }
  async isDonePayoutOrRefund(
    orderId: string,
    isAdmin: boolean = false
  ): Promise<boolean> {
    if (isAdmin) {
      const isSuccessPayout = await this.getSuccessPayoutRefundTransaction(
        orderId,
        'Payout',
        'Transfer'
      );
      const isSuccessRefund = await this.getSuccessPayoutRefundTransaction(
        orderId,
        'Refund',
        'Instant Refund'
      );
      if (isAdmin && isSuccessPayout && isSuccessRefund) {
        return true;
      }
    } else {
      return await this.getSuccessPayoutRefundTransaction(orderId);
    }
    return false;
  }
  async updateOrderToTransferStatus(
    dmOrder: DeltaMachineOrderDocument
  ): Promise<void> {
    try {
      const dmOrderStatusObj = await this.getStatusByName(
        DeltaMachineStatusName.TRANSFERRED
      );
      await this.createActivityLogEvent(
        dmOrder?.id,
        dmOrderStatusObj.id,
        '',
        'Automation'
      );
      await this.update(dmOrder?.id, { statusId: dmOrderStatusObj.id });
      await this.updateAirTableRecordStatus(dmOrder?.id, dmOrderStatusObj.id);
    } catch (err) {
      console.log(err);
    }
  }

  async relistProduct(
    productId: string,
    orderId: string,
    dmoId: string,
    adId: string,
    adName: string
  ) {
    const error = new ErrorResponseDto(
      Constants.ERROR_CODE.BAD_REQUEST,
      Constants.ERROR_TYPE.API,
      Constants.ERROR_MAP.FAILED_TO_UPDATE_SELLER_COMMISSION_ORDER,
      Constants.ERROR_MAP.FAILED_TO_UPDATE_SELLER_COMMISSION_ORDER
    );
    try {
      const isSuccess =
        await this.productService.updateProductStatusForRelisting(productId);
      if (!isSuccess) {
        throw error;
      }
      await this.searchService.addProducts([productId]);
      const updateData = {
        isProductRelisted: true,
      };
      await this.createActivityLogProductRelistingEvent(adId, adName, orderId);
      return await this.update(dmoId, updateData);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw error;
      }
    }
  }

  async createActivityLogProductRelistingEvent(
    userId: string,
    username: string,
    orderId: string
  ) {
    try {
      const eventType =
        Constants.activity_log_template.PRODUCT_RELISTING_SUBMITTED;
      // get msg template to create log
      const msgPayoutRelistingTemplateRequest: EventLogTemplateRequest = {
        eventType,
        orderId,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgPayoutRelistingTemplateRequest
      );
      const eventLogRelistingRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        orderId,
        value: msgTemplate,
        module: 'closed',
      };
      await createEventLog(eventLogRelistingRequest);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_CREATE_ACTIVITY_LOG,
          exception
        );
      }
    }
  }

  async confirmAvailabilityAutomation(statuses: DeltaMachineStatusDocument[]) {
    try {
      const orders = await this.getOrdersByStatus(statuses, false, true);

      return orders;
    } catch (exception) {
      console.log(exception);
    }
  }

  async getAWSPresignedUrlForDispute(
    userId: string,
    dmOrderId: string,
    count: string = '1',
    extensions: string
  ) {
    try {
      const numberOfUrls = parseInt(count);
      return await AWSService.createPresignedUrl(
        userId,
        dmOrderId,
        numberOfUrls,
        extensions
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_CREATE_PRE_SIGNED_URL,
        exception
      );
    }
  }

  async submitDispute(
    dmOrderId: string,
    disputeReason: string,
    description: string,
    images: any[],
    preferredContactNumber: string
  ) {
    try {
      const dmOrder = await this.getById(dmOrderId);
      if (dmOrder?.disputeData?.isDisputeRaised) {
        dmOrder.disputeData.disputeDate = dmOrder.orderData.disputeDate;
        return dmOrder.disputeData;
      }
      const [, dmOrderStatus] =
        await this.deltaMachineRepository.getStatusByName(
          DeltaMachineStatusName.DISPUTED
        );
      const deltaMachineStatusDocument =
        dmOrderStatus.result as DeltaMachineStatusDocument;
      const statusId = deltaMachineStatusDocument?.id;
      const updateObj = {
        statusId,
        'orderData.disputeDate': new Date(),
        'disputeData.isDisputeRaised': true,
        'disputeData.hasDisputeRaisedBefore': false,
        'disputeData.disputeReason': disputeReason,
        'disputeData.description': description,
        'disputeData.preferredContactNumber': preferredContactNumber,
        'disputeData.images': images,
      };
      await this.updateAirTableRecordStatus(dmOrderId, statusId);
      await this.update(dmOrderId, updateObj);
      await this.createAirTableDisputeRecord(dmOrderId, updateObj);
      return updateObj;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_SUBMIT_DISPUTE,
        exception
      );
    }
  }

  async submitRating(
    name: string,
    mobileNumber: string,
    notes: string,
    rating: string,
    timeSTamp: string
  ) {
    try {
      await AirTable.createAirTableRatingRecord(
        name,
        mobileNumber,
        notes,
        rating,
        timeSTamp
      );
      return true;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_SUBMIT_DISPUTE,
        exception
      );
    }
  }

  async cancelDispute(dmOrderId: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const dmOrder = await this.getById(dmOrderId);
        if (dmOrder?.disputeData?.isDisputeRaised) {
          const [, dmOrderStatus] =
            await this.deltaMachineRepository.getStatusByName(
              DeltaMachineStatusName.CANCELED_DISPUTE
            );
          const deltaMachineStatusDocument =
            dmOrderStatus.result as DeltaMachineStatusDocument;
          const statusId = deltaMachineStatusDocument?._id;
          await this.update(dmOrderId, {
            statusId,
            'disputeData.isDisputeRaised': false,
            'disputeData.hasDisputeRaisedBefore': true,
          });
          await this.updateAirTableRecordStatus(dmOrderId, statusId);
          resolve('dispute cancelled');
        } else {
          reject('no dispute raised against this order');
        }
      } catch (exception) {
        reject(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_CANCEL_DISPUTE,
            exception
          )
        );
      }
    });
  }

  async getlDisputeData(dmOrderId: string) {
    try {
      const dmOrder = await this.getById(dmOrderId);
      return {
        isDisputeRaised: dmOrder?.disputeData?.isDisputeRaised || false,
        hasDisputeRaisedBefore:
          dmOrder?.disputeData?.hasDisputeRaisedBefore || false,
        desciption: dmOrder?.disputeData?.description || '',
        disputeReason: dmOrder?.disputeData?.disputeReason || [],
        images: dmOrder?.disputeData?.images || [],
        contactNumber: dmOrder?.disputeData?.preferredContactNumber || '',
        disputeDate: dmOrder?.orderData?.disputeDate,
      };
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_DISPUTE,
        exception
      );
    }
  }

  async updateDMOrderStatusByName(orderId: string, statusName: string) {
    try {
      const [errDMOStatus, dmOrderStatus] =
        await this.deltaMachineRepository.getStatusByName(statusName);
      if (errDMOStatus) {
        this.error.errorCode = dmOrderStatus.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = dmOrderStatus.result.toString();
        this.error.message = dmOrderStatus.message;
        throw this.error;
      }
      const deltaMachineStatusDocument =
        dmOrderStatus?.result as DeltaMachineStatusDocument;
      const [err, data] = await this.deltaMachineRepository.update(
        { orderId: orderId },
        {
          statusId: deltaMachineStatusDocument.id,
          ...{ updatedAt: new Date() },
        }
      );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      const deltaMachineOrder = data.result;
      await this.updateAirTableRecordStatus(
        deltaMachineOrder.id,
        deltaMachineStatusDocument.id
      );
      await this.createActivityLogEvent(
        deltaMachineOrder.id,
        deltaMachineStatusDocument.id,
        '',
        'Automation'
      );
      return {
        deltaMachineOrder,
        status: deltaMachineStatusDocument,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
          exception.message
        );
      }
    }
  }

  async getDmOrderStatus(
    deltaMachineOrder: DeltaMachineOrderDocument
  ): Promise<DeltaMachineStatusDocument> {
    try {
      const dmoStatus = await this.deltaMachineRepository.getStatusById(
        deltaMachineOrder.statusId
      );
      return dmoStatus[1].result as DeltaMachineStatusDocument;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PAYMENT_HISTORY,
          exception.message
        );
      }
    }
  }

  async handleAutomationForSellerProcessing(
    sellerPhone: string,
    messageText: string
  ) {
    try {
      const sellerProcessingV4templateName =
        process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V4;
      const [whatsAppMsgErr, whatsAppMsgData] =
        await this.whatsAppMsgRepository.getByPhone(
          sellerPhone,
          sellerProcessingV4templateName,
          ''
        );
      if (whatsAppMsgErr) return;
      const orderStatusName =
        messageText === FreshchatResponse.CONFIRMED_AVAILABILITY
          ? DeltaMachineStatusName.CONFIRMED_AVAILABILITY
          : DeltaMachineStatusName.REFUND_TO_BUYER;
      const whatsAppMsg = whatsAppMsgData?.result as WhatsAppMsgDocument;
      const dmOrderId = whatsAppMsg.dmoId;
      const [err, data] = await this.deltaMachineRepository.getById(dmOrderId);
      if (err) {
        throw err;
      }
      const dmOrder = data.result as DeltaMachineOrderDocument;
      const currentStatus = await this.getDmOrderStatus(dmOrder);

      if (
        currentStatus.name === DeltaMachineStatusName.CONFIRMED_AVAILABILITY ||
        currentStatus.name === DeltaMachineStatusName.REFUND_TO_BUYER
      ) {
        return;
      }
      await this.updateDMOrderStatusByName(dmOrder.orderId, orderStatusName);
      const templateName =
        orderStatusName === DeltaMachineStatusName.CONFIRMED_AVAILABILITY
          ? process.env.FRESHCHAT_CONFIRMED_AVAILABILITY_V1
          : process.env.FRESHCHAT_CONFIRMED_UNAVAILABILITY_V1;
      const orders = await this.orderService.findOrdersById([dmOrder.orderId]);
      const categoryId = (orders[0] as OrderDocument & { category_id: string })
        ?.category_id;
      await this.freshchatService.sendOutboundMsg({
        templateName: templateName,
        phoneNumber: sellerPhone,
        orderNumber: dmOrder.orderData.orderNumber,
        categoryId,
      });
    } catch (err) {
      console.log({ err });
    }
  }

  async handleCreateDMorder(orderId: string, retryCount: number) {
    try {
      const orderObj: any = { orderId };
      const orderStatus = await this.orderService.checkOrderStatus(orderId);
      if (orderStatus == 'Success') {
        await this.create(orderObj);
      } else if (orderStatus == 'Pending' && retryCount < 4) {
        this.bullMQService.addJob(
          {
            id: orderId,
            type: JobTypes.CREATE_DM_ORDER,
            retryCount: retryCount + 1,
          },
          { delay: 10 * 60 * 1000 }, // 10 min delay
          Queues.DM_ORDERS
        );
      }
    } catch (err) {
      console.log(err);
    }
  }
  async handleValidatePromoCodeUsage(orderId: string) {
    const [, orderResult] = await this.orderRepository.getById(orderId);
    const order = orderResult.result as OrderDocument;
    if (order.transaction_status !== 'Success') {
      await updatePromoCodeUsageCount({
        promoCodeId: order.promos.buyerPromocodeId,
        count: -1,
      });
    }
  }

  async updateProductSyncStatus(orderId: string) {
    const [, orderResult] =
      await this.orderRepository.getOrderDataWithProductDetails(orderId);
    const order = orderResult.result as OrderDocument;
    if (order.transaction_status !== 'Success') {
      const productId = order.product._id.toString();
      await this.productRepository.updateProductStatus(
        productId,
        ProductOrderStatus.Available
      );
      await this.searchService.addProducts([productId]);
    }
  }

  async createSMSATracking(
    id: string,
    inspectionStatus: string,
    inspectionCenter: string
  ) {
    let postInspectionTrackingNumber = '';
    try {
      const dmOrder = await this.getDMOrderByOrderNumber(id);
      const orders = await this.orderService.findOrdersById([dmOrder.orderId]);
      let statusObj = await this.getStatusByName(
        DeltaMachineStatusName.PASSED_INSPECTION
      );
      if (orders?.length) {
        const orderData = this.populateOrdersData(orders[0]);
        const recordId: string = await AirTable.getAirTableRecordById(
          orderData.orderNumber
        );
        if (inspectionStatus === 'Failed') {
          statusObj = await this.getStatusByName(
            DeltaMachineStatusName.FAILED_INSPECTION
          );
          orderData.buyerAddress = orderData.sellerAddress;
          orderData.buyerCity = orderData.sellerCity;
          orderData.buyerName = orderData.sellerName;
          orderData.buyerPhone = orderData.sellerPhone;
        }
        orderData.sellerAddress = process.env.SOUM_SELLER_RIYADH_ADDRESS;
        orderData.sellerCity = Cities.RIYADH;
        if (inspectionCenter.toString() === Cities.JEDDAH) {
          orderData.sellerAddress = process.env.SOUM_SELLER_JEDDAH_ADDRESS;
          orderData.sellerCity = Cities.JEDDAH;
        }
        orderData.sellerName = process.env.SOUM_SELLER_NAME;
        orderData.sellerPhone = process.env.SOUM_NUMBER;
        orderData.orderNumber = `${orderData.orderNumber}_post_inspection`;

        // postInspectionTrackingNumber = await this.generatetrackingNumber(
        //   `${dmOrder.orderId}_post_inspection`,
        //   orderData
        // );

        postInspectionTrackingNumber = await this.handleShipmentCreation(
          ShipmentTypeEnum.POST_INSPECTION,
          orderData,
          dmOrder.orderId
        );
        await AirTable.updatePostInspectionTrackingNumber(
          recordId,
          postInspectionTrackingNumber
        );
        await AirTable.updateAirTableRecordStatusById(
          recordId,
          statusObj.displayName,
          false,
          false
        );
        await this.update(dmOrder.id, {
          postInspectionTrackingNumber,
          statusId: statusObj.id,
        });
      }
      return postInspectionTrackingNumber;
    } catch (exception) {
      return postInspectionTrackingNumber;
    }
  }

  async getMySalesCount(userId: string) {
    try {
      const [error, mySalesResult] = await this.getDMOrdersByUserId(userId, '');
      if (error) {
        throw new Error('Cannot get my sales data');
      }

      const dmOrders =
        (mySalesResult?.result as DeltaMachineOrderDocument[]) || [];
      const statuses = await this.getStatusList();
      const payoutToSellerStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.PAYOUT_TO_SELLER);
      const deliveredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.ITEM_DELIVERED
      );
      const transferredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.TRANSFERRED
      );
      const refundedStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.REFUNDED
      );
      const refundToBuyerStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.REFUND_TO_BUYER);
      const refundHoldStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.REFUND_HOLD
      );
      const buyerWithdrawlStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.BUYER_WITHDRAW);
      const backlogRefundStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.BACKLOG_REFUND);
      const confirmedUnavailabilityStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY
      );
      const deliveredToInspectionCenterStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === DeltaMachineStatusName.DELIVERED_TO_INSPECTION_CENTER
      );
      const count = await this.productService.getPendingProductsCountByUserId(
        userId
      );
      const consignmentProducts =
        await this.productService.getConsignmentProductsByUserId(userId);
      const listingsCount = {
        active: count?.active || 0,
        inProgress: 0,
        completed: 0,
        cancelled: 0,
        consignment: consignmentProducts?.result?.length || 0,
        requiresRenewel: count?.requiresRenewel || 0,
      };
      const consignmentProductsSet = new Set();
      for (const product of consignmentProducts?.result || []) {
        if (product && typeof product === 'object' && '_id' in product) {
          consignmentProductsSet.add(
            (product._id as Types.ObjectId).toString()
          );
        }
      }
      for (const order of dmOrders) {
        if (
          order?.orderData?.productId &&
          consignmentProductsSet.has(order.orderData.productId.toString())
        ) {
          continue;
        }
        if (
          order?.statusId.toString() === refundedStatus?.id.toString() ||
          order?.statusId.toString() === refundToBuyerStatus?.id.toString() ||
          order?.statusId.toString() === refundHoldStatus?.id.toString() ||
          order?.statusId.toString() === buyerWithdrawlStatus?.id.toString() ||
          order?.statusId.toString() === backlogRefundStatus?.id.toString() ||
          order?.statusId.toString() ===
            confirmedUnavailabilityStatus?.id.toString()
        ) {
          listingsCount.cancelled++;
        } else if (
          order?.statusId.toString() === deliveredStatus?.id.toString() ||
          order?.statusId.toString() === transferredStatus?.id.toString() ||
          order?.statusId.toString() === payoutToSellerStatus?.id.toString() ||
          order?.statusId.toString() ===
            deliveredToInspectionCenterStatus?.id.toString()
        ) {
          listingsCount.completed++;
        } else {
          listingsCount.inProgress++;
        }
      }
      return listingsCount;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_COUNT_LISTINGS,
          exception.message
        );
      }
    }
  }

  async getMySalesProducts(
    userId: string,
    submodule: string,
    limit: number = 19,
    skip: number = 0,
    sort?: string
  ) {
    try {
      let dmOrders = [];
      const productIds = [];
      const dmData: any = {};
      const statuses = await this.getStatusList();
      let statusIds: string[] = [];
      if (submodule === '') throw new Error('Cannot get my sales data');
      const payoutToSellerStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.PAYOUT_TO_SELLER);
      const deliveredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.ITEM_DELIVERED
      );
      const transferredStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.TRANSFERRED
      );
      const refundedStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.REFUNDED
      );
      const refundToBuyerStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.REFUND_TO_BUYER);
      const refundHoldStatus = (statuses as DeltaMachineStatusDocument[]).find(
        status => status.name === DeltaMachineStatusName.REFUND_HOLD
      );
      const buyerWithdrawlStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.BUYER_WITHDRAW);
      const backlogRefundStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(status => status.name === DeltaMachineStatusName.BACKLOG_REFUND);
      const confirmedUnavailabilityStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY
      );
      const deliveredToInspectionCenterStatus = (
        statuses as DeltaMachineStatusDocument[]
      ).find(
        status =>
          status.name === DeltaMachineStatusName.DELIVERED_TO_INSPECTION_CENTER
      );
      if (submodule === 'completed') {
        statusIds = [
          deliveredStatus?.id,
          transferredStatus?.id,
          deliveredToInspectionCenterStatus?.id,
          payoutToSellerStatus?.id,
        ];
      }
      if (submodule === 'cancelled') {
        statusIds = [
          refundedStatus?.id,
          refundToBuyerStatus?.id,
          refundHoldStatus?.id,
          buyerWithdrawlStatus?.id,
          backlogRefundStatus?.id,
          confirmedUnavailabilityStatus?.id,
        ];
      } else if (submodule === 'in-progress') {
        statusIds = [
          deliveredStatus?.id,
          transferredStatus?.id,
          deliveredToInspectionCenterStatus?.id,
          payoutToSellerStatus?.id,
          refundedStatus?.id,
          refundToBuyerStatus?.id,
          refundHoldStatus?.id,
          buyerWithdrawlStatus?.id,
          backlogRefundStatus?.id,
          confirmedUnavailabilityStatus?.id,
        ];
      }
      if (submodule !== 'active' && submodule !== 'idle') {
        const [error, mySalesResult] = await this.getDMOrdersByUserId(
          userId,
          submodule,
          limit,
          skip,
          statusIds
        );
        if (error) throw new Error('Cannot get my sales data');
        dmOrders = (mySalesResult?.result as DeltaMachineOrderDocument[]) || [];
        for (const order of dmOrders) {
          productIds.push(order?.orderData.productId);
          dmData[order.orderData.productId] = order;
        }
      }
      const [err, result] =
        await this.productService.getMySellProductsBySubmodule(
          userId,
          submodule,
          productIds,
          limit,
          skip,
          sort
        );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          result.toString()
        );
      } else {
        if (submodule !== 'active' && submodule !== 'idle') {
          for (const product of result) {
            const orderData = dmData[product?._id];
            if (orderData) {
              const statusDoc = (statuses as DeltaMachineStatusDocument[]).find(
                status =>
                  status.id.toString() === orderData?.statusId.toString()
              );
              product.statusName = statusDoc.name;
              product.dmOrderId = orderData?.id;
              product.orderId = orderData?.orderId;
              product.modelName = orderData?.orderData?.productName;
              product.modelNameAr = orderData?.orderData?.productNameAr;
              product.timeLeft = 0;
              if (orderData.confirmationDeadline) {
                product.timeLeft = Math.round(
                  (orderData.confirmationDeadline.getTime() -
                    new Date().getTime()) /
                    36e5
                );
              }
            }
          }
        }
        return result;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception
        );
      }
    }
  }

  async getOrderSaleAnalytics(
    sellerId: string,
    range: string
  ): Promise<DeltaMachineOrderDocument[] | string> {
    try {
      const [, data] = await this.deltaMachineRepository.getOrderSaleAnalytics(
        sellerId,
        range
      );
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }
  async getPendingPayoutAnalytics(
    sellerId: string
  ): Promise<DeltaMachineOrderDocument[] | string> {
    try {
      const [, data] =
        await this.deltaMachineRepository.getPendingPayoutAnalytics(sellerId);
      return data.result;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async getPendingPayoutPagination(
    sellerId: string,
    page: number,
    size: number,
    search: string
  ): Promise<{
    data: DeltaMachineOrderDocument[] | string;
    message?: string;
    totalItems?: number;
    totalPages?: number;
    currentPage?: number;
  }> {
    try {
      return await this.deltaMachineRepository.getPendingPayoutPagination(
        sellerId,
        page,
        size,
        search
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_DMO,
          exception.message
        );
      }
    }
  }

  async getPenalizedOrders(
    dmoIds: string[],
    page: number,
    size: number
  ): Promise<{
    data: PenalizedOrder[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    try {
      return await this.deltaMachineRepository.getPenalizedOrders(
        dmoIds,
        page,
        size
      );
    } catch (exception) {
      return {
        data: [],
        totalItems: 0,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0,
      };
    }
  }

  async getPendingPenaltyTotalAmount(
    userId: string,
    range: string
  ): Promise<number> {
    try {
      return await this.deltaMachineRepository.getPendingPenaltyTotalAmount(
        userId,
        range
      );
    } catch (exception) {
      return 0;
    }
  }
  async getDMOrdersByBuyerUserId(
    buyerId: string,
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
    return await this.deltaMachineRepository.getDMOrdersByBuyerUserId(
      buyerId,
      submodule,
      limit,
      page,
      statusIds
    );
  }

  getOrderStatusModuleMapForPurchaseOrders(
    statuses: DeltaMachineStatusDocument[]
  ): {
    [key: string]: string[];
  } {
    const findStatusFromStatuses = (statusName: string) => {
      return statuses.find(status => status.name === statusName);
    };
    // cancelled statuses
    const refundedStatus = findStatusFromStatuses(
      DeltaMachineStatusName.REFUNDED
    );
    const refundToBuyerStatus = findStatusFromStatuses(
      DeltaMachineStatusName.REFUND_TO_BUYER
    );
    const refundHoldStatus = findStatusFromStatuses(
      DeltaMachineStatusName.REFUND_HOLD
    );
    const buyerWithdrawlStatus = findStatusFromStatuses(
      DeltaMachineStatusName.BUYER_WITHDRAW
    );
    const backlogRefundStatus = findStatusFromStatuses(
      DeltaMachineStatusName.BACKLOG_REFUND
    );
    const confirmedUnavailabilityStatus = findStatusFromStatuses(
      DeltaMachineStatusName.CONFIRMED_UNAVAILABILITY
    );

    //completed status
    const itemDeliveredStatus = findStatusFromStatuses(
      DeltaMachineStatusName.ITEM_DELIVERED
    );
    const payoutToSellerStatus = findStatusFromStatuses(
      DeltaMachineStatusName.PAYOUT_TO_SELLER
    );
    const transferredStatus = findStatusFromStatuses(
      DeltaMachineStatusName.TRANSFERRED
    );
    const deliveredToInspectionCenterStatus = findStatusFromStatuses(
      DeltaMachineStatusName.DELIVERED_TO_INSPECTION_CENTER
    );

    const cancelledStatusIds: any[] = [
      new mongoose.Types.ObjectId(refundedStatus.id),
      new mongoose.Types.ObjectId(refundToBuyerStatus.id),
      new mongoose.Types.ObjectId(refundHoldStatus.id),
      new mongoose.Types.ObjectId(buyerWithdrawlStatus.id),
      new mongoose.Types.ObjectId(backlogRefundStatus.id),
      new mongoose.Types.ObjectId(confirmedUnavailabilityStatus.id),
    ];
    const completedStatusesIds: any[] = [
      new mongoose.Types.ObjectId(itemDeliveredStatus.id),
      new mongoose.Types.ObjectId(transferredStatus.id),
      new mongoose.Types.ObjectId(payoutToSellerStatus.id),
      new mongoose.Types.ObjectId(deliveredToInspectionCenterStatus.id),
    ];
    return {
      completed: completedStatusesIds,
      cancelled: cancelledStatusIds,
      'in-progress': [...cancelledStatusIds, ...completedStatusesIds],
    };
  }
  async getMyPurchaseProducts(
    userId: string,
    submodule: string,
    limit: number = 19,
    page: number = 0
  ) {
    try {
      const productIds = [];
      if (submodule === '') throw new Error('Cannot get my order data');
      const statuses =
        (await this.getStatusList()) as DeltaMachineStatusDocument[];
      const getOrderStatusModuleMapForPurchaseOrders =
        this.getOrderStatusModuleMapForPurchaseOrders(statuses);
      const statusIds: string[] =
        getOrderStatusModuleMapForPurchaseOrders[submodule];

      const [error, myOrdersPaginatedResponse] =
        await this.getDMOrdersByBuyerUserId(
          userId,
          submodule,
          limit,
          page,
          statusIds
        );
      if (error) throw new Error('Cannot get my order data');
      const {
        docs: dmOrders,
        hasNextPage,
        totalDocs,
      } = myOrdersPaginatedResponse.result as PaginationDto<DeltaMachineOrderDocument>;
      let recentlyPurchasedProducts: OrderDocument[] = [];
      if (submodule !== 'active' && submodule !== 'idle') {
        // if (page === 1 && submodule === 'in-progress') {
        recentlyPurchasedProducts =
          await this.orderRepository.getRecentlyBoughtProducts(userId);
        for (const order of recentlyPurchasedProducts) {
          productIds.push(order.product);
        }
      }
      for (const order of dmOrders) {
        productIds.push(order?.orderData.productId);
      }
      const [err, products] = await this.productService.getProductDetails(
        productIds
      );
      if (err) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          products.toString()
        );
      }

      let productIdMap: { [key: string]: any } = {};
      productIds.forEach(productId => {
        productIdMap = {
          ...productIdMap,
          [productId]: products.find(
            (product: any) => product._id.toString() === productId.toString()
          ),
        };
      });

      const [, deliverySettings] = await this.settingRepository.getSettingByKey(
        'delivery_rules'
      );
      const parsedSetting = JSON.parse(deliverySettings.value);

      const allAttributes = await this.attributeService.getAllAttributes(
        '',
        true,
        1,
        200
      );

      let response = await Promise.all(
        recentlyPurchasedProducts.map(async order => {
          const product = productIdMap[order.product];

          const attributes = await mapAttributes(
            product?.varient_id?.attributes,
            allAttributes as any
          );

          return {
            order: {
              id: order.id,
              date: order.created_at,
              dmStatus: null,
              grandTotal: order?.grand_total,
              orderNumber: order?.order_number,
            },
            productImages: product?.product_images,
            productId: product._id.toString(),
            isMerchant: product.sellerIsMerchant || false,
            sellerName: product.sellerName,
            sellerId: product.sellerId,
            deliveryTime: getDeliveryTime(
              order?.seller?.address?.city,
              order?.buyer?.address?.city,
              parsedSetting
            ),
            deliveryDetails: order?.buyer?.address,
            model: {
              id: product.model_id?._id,
              arName: product.model_id?.model_name_ar,
              enName: product.model_id?.model_name,
            },
            category: {
              id: product.category_id?._id,
              arName: product.category_id?.category_name_ar,
              enName: product.category_id?.category_name,
            },
            brand: {
              id: product.brand_id?._id,
              arName: product.brand_id?.brand_name,
              enName: product.brand_id?.brand_name_ar,
            },
            variant: {
              id: product?.varient_id?._id,
              arName: product.varient_id?.varient_ar,
              enName: product.varient_id?.varient,
            },
            attributes: attributes,
          };
        })
      );

      // Process dmOrders the same way
      const dmOrderResponses = await Promise.all(
        dmOrders.map(async dmOrder => {
          const product = productIdMap[dmOrder.orderData?.productId];
          const attributes = await mapAttributes(
            product?.varient_id?.attributes,
            allAttributes as any
          );
          return {
            order: {
              id: dmOrder.orderId,
              date: dmOrder.createdAt,
              dmStatus: statuses.find(
                status => status.id.toString() === dmOrder.statusId.toString()
              ),
              grandTotal: parseFloat(dmOrder?.orderData?.grandTotal),
              orderNumber: dmOrder?.orderData?.orderNumber?.toString(),
            },
            productId: dmOrder.orderData.productId,
            productImages: product?.product_images,
            isMerchant: product.sellerIsMerchant || false,
            sellerName: dmOrder.orderData.sellerName,
            sellerId: dmOrder.orderData.sellerId,
            deliveryTime: getDeliveryTime(
              dmOrder?.orderData?.sellerCity,
              dmOrder?.orderData?.buyerCity,
              parsedSetting
            ),
            deliveryDetails: (dmOrder.orderData as any)?.deliveryAddress,
            model: {
              id: product.model_id?._id,
              arName: product.model_id?.model_name_ar,
              enName: product.model_id?.model_name,
            },
            category: {
              id: product.category_id?._id,
              arName: product.category_id?.category_name_ar,
              enName: product.category_id?.category_name,
            },
            brand: {
              id: product.brand_id?._id,
              arName: product.brand_id?.brand_name,
              enName: product.brand_id?.brand_name_ar,
            },
            variant: {
              id: product?.varient_id?._id,
              arName: product.varient_id?.varient_ar,
              enName: product.varient_id?.varient,
            },
            attributes: attributes,
          };
        })
      );
      // Combine both responses
      response = [...response, ...dmOrderResponses];

      return {
        docs: response,
        hasNextPage: hasNextPage,
        totalDocs: totalDocs + recentlyPurchasedProducts.length,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_PRODUCT_PAGINATION,
          exception
        );
      }
    }
  }

  async cacheUserOrdersCount(userId: string) {
    const key = `user_${userId}_order_count`;

    const statuses =
      (await this.getStatusList()) as DeltaMachineStatusDocument[];
    const getOrderStatusModuleMapForPurchaseOrders =
      this.getOrderStatusModuleMapForPurchaseOrders(statuses);
    const [
      inProgressCount,
      completedCount,
      cancelledCount,
      reservationOrderCount,
    ] = await Promise.all([
      this.deltaMachineRepository.countDmOrdersForBuyer(
        userId,
        'in-progress',
        getOrderStatusModuleMapForPurchaseOrders['in-progress']
      ),
      this.deltaMachineRepository.countDmOrdersForBuyer(
        userId,
        'completed',
        getOrderStatusModuleMapForPurchaseOrders['completed']
      ),
      this.deltaMachineRepository.countDmOrdersForBuyer(
        userId,
        'cancelled',
        getOrderStatusModuleMapForPurchaseOrders['cancelled']
      ),
      this.deltaMachineRepository.countReservationOrdersForBuyer(userId),
    ]);

    const result = {
      inProgressCount: inProgressCount[1].result,
      completedCount: completedCount[1].result,
      cancelledCount: cancelledCount[1].result,
      reservationOrderCount: reservationOrderCount[1].result,
    };
    await setCache(key, result);
    return result;
  }

  async getProductSellDateFromDmOrders(productIds: string[]) {
    try {
      const [error, dmOrdersResults] =
        await this.deltaMachineRepository.getDmOrdersByProductIds(productIds);
      if (error) {
        throw error;
      }
      const dmOrders = dmOrdersResults.result as DeltaMachineOrderDocument[];
      const result: Record<string, Date> = {};
      dmOrders.forEach(dmOrder => {
        if (dmOrder.orderData?.productId) {
          result[dmOrder.orderData?.productId] = dmOrder.createdAt;
        }
      });
      return result;
    } catch (error) {
      return {};
    }
  }

  async replaceOrder(
    orderId: string,
    replacedProductId: string,
    transaction?: any
  ) {
    return new Promise(async (resolve, reject) => {
      let replacedProduct;
      try {
        try {
          replacedProduct = await this.productRepository.findProductById(
            replacedProductId
          );
        } catch (err) {
          return reject('Invalid product ID');
        }
        if (
          replacedProduct?.sell_status !== ProductOrderStatus.Available ||
          replacedProduct?.status !== ProductStatus.Active ||
          replacedProduct?.isApproved === false
        ) {
          return reject('Product is not active');
        }
        let [orderErr, orderData] = await this.orderRepository.getById(orderId);
        if (orderErr) {
          return reject('Failed to get order');
        }
        const order = orderData.result as OrderDocument;
        const product = await this.productRepository.findProductById(
          order?.product
        );
        if (product?.sell_status === ProductOrderStatus.Available) {
          return reject('Reference Product is not sold');
        }

        const buyer = await this.userService.getUserAddresses(order?.buyer);
        const purchaseProductDto: PurchaseProductDto = {
          productId: replacedProduct._id,
          orderId: '',
          promoCodeId: order?.promos?.buyerPromocodeId,
          paymentType: order?.payment_type as PaymentProviderType,
          paymentProvider:
            transaction?.paymentOption?.paymentProvider || order?.payment_type,
          actionType: order?.buy_type,
          returnUrls: null,
          paymentId: '',
        };
        const newOrderData = await this.orderService.createOrder(
          buyer,
          purchaseProductDto,
          order?.sourcePlatform,
          order?.gtmClientId,
          order?.gtmSessionId
        );
        [orderErr, orderData] = await this.orderRepository.getById(
          newOrderData?.orderId
        );
        if (orderErr) {
          return reject('Failed to create order');
        }
        const newOrder = orderData?.result as OrderDocument;
        let grandTotal = order?.grand_total;
        let discount = 0;
        let buyerCommission = 0;
        if (product?.sell_price > replacedProduct?.sell_price) {
          discount = 0;
          buyerCommission = order?.grand_total - replacedProduct?.sell_price;
          grandTotal =
            replacedProduct?.sell_price +
            (order?.grand_total - replacedProduct?.sell_price);
        } else if (product?.sell_price < replacedProduct?.sell_price) {
          buyerCommission = 0;
          discount = replacedProduct?.sell_price - order?.grand_total;
          grandTotal =
            replacedProduct?.sell_price -
            (replacedProduct?.sell_price - order?.grand_total);
        }
        const commissionUpdateData = {
          productId: replacedProduct?._id.toString(),
          orderId: newOrder?._id.toString(),
          sellPrice: replacedProduct?.sell_price,
          grandTotal: grandTotal.toFixed(2),
          payout: 0,
          buyerCommission,
          discount,
        };
        await forceUpdateCommission(commissionUpdateData);
        await this.updateOrderStatusesAfterReplacement(newOrder, order);
        return resolve(newOrder);
      } catch (error) {
        if (process.env.NODE_ENV === 'production') {
          console.log({ error });
        }
        return reject(Constants.ERROR_MAP.FAILED_TO_UPDATE_ORDER);
      }
    });
  }

  private async updateOrderStatusesAfterReplacement(
    newOrder: OrderDocument,
    referenceOrder: OrderDocument
  ) {
    const paymentOrderUpdateDto = {
      orderId: newOrder?._id,
      response: referenceOrder?.transaction_detail,
      transactionId: referenceOrder?.transaction_id,
      status: TransactionOrderStatus.SUCCESS,
      paymentReceivedFromBuyer: 'Yes',
      buyerAddress: referenceOrder?.buyer_address,
    } as PaymentOrderUpdateDto;
    await this.orderRepository.updateOrderAfterPayment(paymentOrderUpdateDto);
    await this.productRepository.updateProductStatus(
      newOrder?.product,
      ProductOrderStatus.Sold
    );
    await this.searchService.deleteOneOrManyProducts([newOrder?.product]);

    // Add this order to DM
    await this.create({
      orderId: newOrder?._id,
    } as DeltaMachineOrderDocument);

    let dmOrder;
    try {
      dmOrder = await this.getDMOrderByOrderId(newOrder?._id);
    } catch (err) {
      console.log({ err });
      throw err;
    }
    let statusObj = await this.getStatusByName(
      DeltaMachineStatusName.CONFIRMED_AVAILABILITY
    );
    await this.update(dmOrder?.id, {
      statusId: statusObj.id,
    });
    try {
      await this.updateAirTableRecordStatus(dmOrder?.id, statusObj.id);
    } catch (err) {}
    try {
      dmOrder = await this.getDMOrderByOrderId(referenceOrder._id);
    } catch (err) {
      console.log({ err });
      throw err;
    }
    statusObj = await this.getStatusByName(DeltaMachineStatusName.REPLACED);
    const updateObj = {
      statusId: statusObj.id,
      'orderData.replacedOrderId': newOrder?.order_number,
      'orderData.replacedProductId': newOrder?.product,
    };
    await this.update(dmOrder?.id, updateObj);
    try {
      await this.updateAirTableRecordStatus(dmOrder?.id, statusObj.id);
    } catch (err) {}
  }

  async createFailedInspectionLabel(
    orderId: string,
    orderData: OrderData,
    inspectionCenter: string
  ) {
    let failedInspectionTrackingNumber = '';
    try {
      orderData.buyerAddress = orderData.sellerAddress;
      orderData.buyerCity = orderData.sellerCity;
      orderData.buyerName = orderData.sellerName;
      orderData.buyerPhone = orderData.sellerPhone;
      orderData.sellerAddress = process.env.SOUM_SELLER_RIYADH_ADDRESS;
      orderData.sellerCity = Cities.RIYADH;
      if (inspectionCenter.toString() === Cities.JEDDAH) {
        orderData.sellerAddress = process.env.SOUM_SELLER_JEDDAH_ADDRESS;
        orderData.sellerCity = Cities.JEDDAH;
      }
      orderData.sellerName = process.env.SOUM_SELLER_NAME;
      orderData.sellerPhone = process.env.SOUM_NUMBER;
      orderData.orderNumber = `${orderData.orderNumber}_failed_inspection`;
      failedInspectionTrackingNumber = await this.generatetrackingNumber(
        `${orderId}_failed_inspection`,
        orderData
      );
      return failedInspectionTrackingNumber;
    } catch (exception) {
      return failedInspectionTrackingNumber;
    }
  }
}
