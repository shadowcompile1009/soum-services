import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { getSecretData } from '@src/utils/vault.util';
import _cloneDeep from 'lodash/cloneDeep';
import mongoose, { Document, Model } from 'mongoose';
import {
  _get,
  decrypt,
  decryptIBAN,
  formatPriceInDecimalPoints,
} from '../../utils/common.util';
import { BullMQService, Queues } from '../bull-mq/bull-mq.service';
import { CategoryService } from '../category/category.service';
import { CommissionService } from '../commission/commission.service';
import { GetProductCatConRequest } from '../grpc/proto/category.pb';
import { CreateInvoiceRequest } from '../grpc/proto/dmbackend.pb';
import { ShipmentTypeEnum } from './enums/shipmentType.enum';
import {
  GetTransactionsResponse,
  TransactionResponse,
} from '../grpc/proto/wallet.pb';
import { InvoiceService } from '../invoice/invoice.service';
import { LerService } from '../ler/ler.service';
import { PenaltyService } from '../penalty/penalty.service';
import { StatusName } from '../statuses/enums/status-name.enum';
import { StatusSchemaDocument } from '../statuses/schemas/status.schema';
import { StatusesService } from '../statuses/statuses.service';
import { V2Service } from '../v2/v2.service';
import { WalletService } from '../wallet/wallet.service';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AddonType } from './enums/add-ons.enum';
import { Cities, CitiesNames, isCityMatch } from './enums/cities.enum';
import { OrderType } from './enums/order.enum';
import { PaymentProviderType, PayoutType } from './enums/payment.enum';
import {
  DeltaMachineBNPLStatuses,
  DeltaMachineFEStatus,
  FinanceReasoningForPendingPayout,
  StatusSubmodule,
} from './enums/status.enum';
import {
  SellerType,
  UserBusinessModel,
  UserOperatingModel,
  UserSellerCategory,
  UserSellerType,
  UserType,
} from './enums/user.enum';
import { OrderData, OrderDocument } from './intefaces/order.interface';
import { Order, OrderSchemaDocument } from './schemas/order.schema';
import { ProductService } from '../product/product.service';
import { ConsignmentStatus } from './enums/consignmnetStatus.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly model: Model<OrderSchemaDocument>,
    @Inject(forwardRef(() => BullMQService))
    private bullMQService: BullMQService,
    private readonly statusesService: StatusesService,
    private readonly v2Service: V2Service,
    private readonly walletService: WalletService,
    private readonly categoryService: CategoryService,
    private readonly commissionService: CommissionService,
    private readonly lerService: LerService,
    private readonly invoiceService: InvoiceService,
    private readonly penaltyService: PenaltyService,
    private readonly productService: ProductService,
  ) {}

  async list(
    submodule: string,
    limit: number,
    offset: number,
    statuses: string[],
    orderType: string[],
    operatingModel: string[],
    sellerType: string[],
    sellerCategory: string[],
    searchStr: string = '',
    startDate?: Date,
    endDate?: Date,
  ): Promise<{ orders: OrderSchemaDocument[]; count: number }> {
    const allStatuses = await this.statusesService.listAll();
    if (submodule === StatusSubmodule.NEW_DISPUTE && !statuses?.length) {
      const newDisputeStatusesNames = [
        StatusName.ITEM_DELIVERED,
        StatusName.NEW_DISPUTE,
        StatusName.VALID_DISPUTE,
        StatusName.INVALID_DISPUTE,
        StatusName.RETURN_TO_SELLER,
        StatusName.RETURN_TO_SOUM,
        StatusName.SELLER_RETURN_AWAITED,
        StatusName.SOUM_RETURN_AWAITED,
        StatusName.SOUM_RETURN_IN_TRANSIT,
        StatusName.SELLER_RETURN_IN_TRANSIT,
        StatusName.RETURNED_TO_SOUM,
        StatusName.RETURNED_TO_SELLER,
      ];
      (allStatuses as StatusSchemaDocument[]).forEach(
        (status: StatusSchemaDocument) => {
          if (
            newDisputeStatusesNames.includes(
              status.toObject().name as StatusName,
            )
          ) {
            statuses.push(status._id);
          }
        },
      );
    } else if (submodule === StatusSubmodule.NEW_PAYOUT && !statuses?.length) {
      const newPayoutStatusesNames = [
        StatusName.PAYOUT_REQUESTED,
        StatusName.PAYOUT_INFO_PENDING,
        StatusName.PAYOUT_PROCESSED,
      ];
      (allStatuses as StatusSchemaDocument[]).forEach(
        (status: StatusSchemaDocument) => {
          if (
            newPayoutStatusesNames.includes(
              status.toObject().name as StatusName,
            )
          ) {
            statuses.push(status._id);
          }
        },
      );
    } else if (submodule === StatusSubmodule.NEW_REFUND && !statuses?.length) {
      const newRefundStatusesNames = [
        StatusName.REFUND_REQUESTED,
        StatusName.REFUND_PROCESSED,
        StatusName.INFORMATION_PENDING,
        StatusName.REFUND_FAILED,
      ];
      (allStatuses as StatusSchemaDocument[]).forEach(
        (status: StatusSchemaDocument) => {
          if (
            newRefundStatusesNames.includes(
              status.toObject().name as StatusName,
            )
          ) {
            statuses.push(status._id);
          }
        },
      );
    }
    let matchCondition = {};
    let statusIds = [];
    if (statuses?.length > 0) {
      statusIds = statuses;
    }
    if (statusIds?.length) {
      statusIds = statusIds.map((statusId) => {
        return new mongoose.Types.ObjectId(statusId);
      });
      if (submodule === StatusSubmodule.NEW_REFUND) {
        matchCondition = { refundStatusId: { $in: statusIds } };
      } else if (submodule === StatusSubmodule.NEW_PAYOUT) {
        matchCondition = { payoutStatusId: { $in: statusIds } };
      } else {
        matchCondition = { statusId: { $in: statusIds } };
      }
    }
    if (searchStr?.length) {
      matchCondition = {
        ...matchCondition,
        'orderData.orderNumber': searchStr.trim(),
      };
    }
    if (orderType.length) {
      matchCondition = {
        ...matchCondition,
        'orderData.orderType': { $in: orderType },
      };
    }
    if (operatingModel.length) {
      matchCondition = {
        ...matchCondition,
        'userData.operatingModel': { $in: operatingModel },
      };
    }
    if (sellerType.length) {
      matchCondition = {
        ...matchCondition,
        'userData.sellerType': { $in: sellerType },
      };
    }
    if (sellerCategory.length) {
      matchCondition = {
        ...matchCondition,
        'userData.sellerCategory': { $in: sellerCategory },
      };
    }
    if (startDate && endDate) {
      matchCondition = {
        ...matchCondition,
        createdAt: {
          $gte: new Date(startDate).getTime(),
          $lte: new Date(endDate).getTime(),
        },
      };
    }
    const ordersList = await this.model
      .find(matchCondition as any)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();
    const ordersCount = await this.model.countDocuments(matchCondition as any);

    const servicesMap = new Map();
    const vendorsMap = new Map();
    const logisticService = await this.lerService.getLogisticServices({});
    (logisticService?.services || []).forEach((service) => {
      servicesMap.set(service.serviceId, service);
    });
    (logisticService?.vendors || []).forEach((vendor) => {
      vendorsMap.set(vendor.vendorId, vendor);
    });
    for (const dmOrder of ordersList) {
      const currentStatusDocument = (
        allStatuses as StatusSchemaDocument[]
      ).find(
        (status) =>
          status.toObject().id.toString() === dmOrder.statusId.toString(),
      );
      dmOrder.orderData.orderStatus = currentStatusDocument.displayName;
      dmOrder.userData = dmOrder.userData || {
        operatingModel: UserOperatingModel.NORMAL,
        sellerCategory: UserSellerCategory.NO_VALUE,
        sellerType: UserSellerType.NO_VALUE,
        businessModel: UserBusinessModel.INDIVIDUAL,
        buyerBusinessModel: UserBusinessModel.INDIVIDUAL,
      };
      const orderStatuses = this.checkOrderStatuses(
        currentStatusDocument as StatusSchemaDocument,
        dmOrder,
      );
      dmOrder.refundStatus =
        dmOrder?.refundStatus || orderStatuses.refundStatus;
      dmOrder.payoutStatus =
        dmOrder?.payoutStatus || orderStatuses.payoutStatus;
      dmOrder.disputeStatus =
        dmOrder?.disputeStatus || orderStatuses.disputeStatus;
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
      if (submodule === StatusSubmodule.NEW_REFUND) {
        dmOrder.orderData.refundAmount = parseFloat(
          dmOrder?.orderData?.grandTotal,
        );
        if (
          dmOrder?.orderData?.isReservation ||
          dmOrder?.orderData?.isFinancing
        ) {
          const orderDetailBuyer =
            await this.v2Service.getOrderDetailByUserType({
              orderId: dmOrder.orderId.toString(),
              userType: 'buyer',
            });
          const orderDetailObj = JSON.parse(orderDetailBuyer?.response);
          dmOrder.orderData.refundAmount =
            orderDetailObj?.order?.reservation?.reservationAmount;
        }
      }
      if (submodule === StatusSubmodule.NEW_PAYOUT) {
        const orderIds = ordersList.map((dmo) => dmo.orderId.toString());
        const walletCreditsSet = new Set();
        const creditTransactions: any =
          await this.walletService.getCreditsByOrderIds({
            orderIds,
          });
        if (creditTransactions.data) {
          creditTransactions.data.forEach((element: { orderId: any }) => {
            walletCreditsSet.add(element.orderId);
          });
        }
        const orderDetailBuyer = await this.v2Service.getOrderDetailByUserType({
          orderId: dmOrder.orderId.toString(),
          userType: 'buyer',
        });
        const orderDetailObj = JSON.parse(orderDetailBuyer?.response);
        dmOrder.orderData.payoutAmount = orderDetailObj?.order?.grand_total;
        dmOrder.orderData.sellPrice = orderDetailObj?.order?.sell_price;
        dmOrder.payoutType = PayoutType.PAYOUT;
        if (walletCreditsSet.has(String(dmOrder.orderId))) {
          dmOrder.payoutType = PayoutType.WALLET_CREDIT;
        } else {
          dmOrder.payoutType = PayoutType.PAYOUT;
        }
      }
    }
    return {
      orders: ordersList,
      count: ordersCount,
    };
  }

  async findById(dmoId: string): Promise<OrderSchemaDocument> {
    try {
      const data = await this.model.findById(dmoId).exec();
      return data instanceof Document ? data.toObject() : data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findByOrderId(orderId: string): Promise<OrderSchemaDocument> {
    const data = await this.model
      .findOne({ orderId: new mongoose.Types.ObjectId(orderId) })
      .exec();
    return data instanceof Document ? data.toObject() : data;
  }

  async listByDmOrderId(
    dmOrderId: string,
    submodule: string,
  ): Promise<StatusSchemaDocument[]> {
    try {
      const dmOrder = await this.findById(dmOrderId);
      if (!dmOrder) {
        throw new Error(`Order with id ${dmOrderId} not found`);
      }
      let orderStatus = await this.statusesService.findById(
        dmOrder?.statusId?.toString(),
      );
      if (submodule === 'refund') {
        orderStatus = await this.statusesService.findById(
          dmOrder?.refundStatusId?.toString(),
        );
        submodule = 'order';
      } else if (submodule === 'payout') {
        orderStatus = await this.statusesService.findById(
          dmOrder?.payoutStatusId?.toString(),
        );
        submodule = 'order';
      } else if (submodule === 'dispute') {
        orderStatus = await this.statusesService.findById(
          dmOrder?.disputeStatusId?.toString(),
        );
      }
      return this.statusesService.findStatusGroupByOrderStatus(
        orderStatus?.name,
        dmOrder?.userData?.operatingModel,
        submodule,
      );
    } catch (exception) {
      throw exception;
    }
  }

  async update(
    updateOrderDto: UpdateOrderDto,
    userId: string,
    userName: string,
  ) {
    try {
      const dmOrder = await this.findById(updateOrderDto.id);
      const dmoStatusDocument = await this.statusesService.findById(
        dmOrder.statusId.toString(),
      );
      const statusId = new mongoose.Types.ObjectId(updateOrderDto.statusId);
      let updateData: any = {
        statusId,
      };
      if (updateOrderDto.penalty) {
      }
      if (updateOrderDto.statusId) {
        if (dmoStatusDocument?.name === StatusName.CONFIRMED_AVAILABILITY) {
          const isConfirmed = dmOrder?.orderData?.confirmationDate;
          updateData = {
            statusId,
            'orderData.confirmationDate': isConfirmed
              ? isConfirmed
              : new Date(),
          };
        } else if (dmoStatusDocument?.name === StatusName.ITEM_DELIVERED) {
          const isDelivered = dmOrder?.orderData?.deliveryDate;
          updateData = {
            statusId,
            'orderData.deliveryDate': isDelivered ? isDelivered : new Date(),
          };
        } else if (
          dmoStatusDocument?.name === StatusName.REFUND_REQUESTED ||
          dmoStatusDocument?.name === StatusName.INFORMATION_PENDING
        ) {
          updateData = {
            refundStatusId: statusId,
            refundStatus: DeltaMachineFEStatus.REQUESTED,
          };
        } else if (dmoStatusDocument?.name === StatusName.REFUND_PROCESSED) {
          updateData = {
            refundStatusId: statusId,
            refundStatus: DeltaMachineFEStatus.COMPLETED,
          };
        } else if (
          dmoStatusDocument?.name === StatusName.PAYOUT_REQUESTED ||
          dmoStatusDocument?.name === StatusName.PAYOUT_INFO_PENDING
        ) {
          updateData = {
            payoutStatusId: statusId,
            payoutStatus: DeltaMachineFEStatus.REQUESTED,
          };
        } else if (dmoStatusDocument?.name === StatusName.PAYOUT_PROCESSED) {
          updateData = {
            payoutStatusId: statusId,
            payoutStatus: DeltaMachineFEStatus.COMPLETED,
          };
        } else if (
          dmoStatusDocument?.name === StatusName.NEW_DISPUTE ||
          dmoStatusDocument?.name === StatusName.VALID_DISPUTE ||
          dmoStatusDocument?.name === StatusName.RETURN_TO_SELLER ||
          dmoStatusDocument?.name === StatusName.SELLER_RETURN_AWAITED ||
          dmoStatusDocument?.name === StatusName.SELLER_RETURN_IN_TRANSIT ||
          dmoStatusDocument?.name === StatusName.RETURN_TO_SOUM ||
          dmoStatusDocument?.name === StatusName.SOUM_RETURN_AWAITED ||
          dmoStatusDocument?.name === StatusName.SOUM_RETURN_IN_TRANSIT
        ) {
          const isDisputed = dmOrder?.orderData?.disputeDate;
          updateData = {
            disputeStatusId: statusId,
            disputeStatus: DeltaMachineFEStatus.OPEN_DISPUTE,
            'orderData.disputeDate': isDisputed ? isDisputed : new Date(),
          };
        } else if (
          dmoStatusDocument?.name === StatusName.INVALID_DISPUTE ||
          dmoStatusDocument?.name === StatusName.RETURNED_TO_SOUM ||
          dmoStatusDocument?.name === StatusName.RETURNED_TO_SELLER
        ) {
          updateData = {
            disputeStatusId: statusId,
            disputeStatus: DeltaMachineFEStatus.COMPLETED,
          };
        }
        await this.model.findByIdAndUpdate(dmOrder.id, {
          ...updateData,
          ...{ updatedAt: new Date() },
        });
      }
      updateData.statusId =
        updateData.statusId ||
        updateData.refundStatusId ||
        updateData.payoutStatusId;
      const request = {
        updateData,
        dmOrderId: dmOrder.id,
        nctReasonId: updateOrderDto.dmoNctReasonId,
        userId,
        userName,
      };
      // V2 call to create same order in V2 service and will be removed after full migration
      const updatedDmoResponse = await this.v2Service.updateDMOrder({
        request: JSON.stringify(request),
      });
      await this.handleInvoiceGeneration(dmOrder, updateData?.statusId);
      return updatedDmoResponse;
    } catch (err) {
      throw err;
    }
  }

  async getFinanceReasoningList() {
    try {
      return [
        FinanceReasoningForPendingPayout.NO_BANK_DETAIL,
        FinanceReasoningForPendingPayout.INVALID_IBAN,
        FinanceReasoningForPendingPayout.RESTRICTED,
        FinanceReasoningForPendingPayout.PROCESS_MANUALLY,
      ];
    } catch (err) {
      throw err;
    }
  }

  async createFinanceReasoning(
    dmOrderId: string,
    payoutPendingReason: FinanceReasoningForPendingPayout,
  ) {
    try {
      const dmOrder = await this.findById(dmOrderId);
      if (!dmOrder) {
        throw new Error(`Order with id ${dmOrderId} not found`);
      }
      const dataToUpdate: any = {
        'orderData.payoutPendingReason': payoutPendingReason,
      };
      await this.model.findByIdAndUpdate(dmOrderId, {
        ...dataToUpdate,
        ...{ updatedAt: new Date() },
      });
      return true;
    } catch (err) {
      throw err;
    }
  }

  async requestRefundOrPayout(dmOrderId: string, submodule: string) {
    try {
      const dmOrder = await this.findById(dmOrderId);
      const statuses = await this.statusesService.listAll();
      const dmOrderStatusObj = (statuses as StatusSchemaDocument[]).find(
        (status) =>
          status?.toObject().id?.toString() === dmOrder.statusId.toString(),
      );
      const refundRequestedStatus = (statuses as StatusSchemaDocument[]).find(
        (status) => (status.name as StatusName) === StatusName.REFUND_REQUESTED,
      );
      const payoutRequestedStatus = (statuses as StatusSchemaDocument[]).find(
        (status) => (status.name as StatusName) === StatusName.PAYOUT_REQUESTED,
      );

      const orderStatuses = this.checkOrderStatuses(
        dmOrderStatusObj as StatusSchemaDocument,
        dmOrder,
      );
      if (
        orderStatuses.isRequestRefundEnabled === false &&
        submodule === StatusSubmodule.REFUND
      ) {
        return false;
      }
      if (
        orderStatuses.isRequestPayoutEnabled === false &&
        submodule === StatusSubmodule.PAYOUT
      ) {
        return false;
      }
      let dataToUpdate: any = {};
      if (submodule === StatusSubmodule.REFUND) {
        dataToUpdate = {
          refundStatusId: new mongoose.Types.ObjectId(
            refundRequestedStatus?.toObject().id,
          ),
          refundStatus: DeltaMachineFEStatus.REQUESTED,
        };
      } else if (submodule === StatusSubmodule.PAYOUT) {
        dataToUpdate = {
          payoutStatusId: new mongoose.Types.ObjectId(
            refundRequestedStatus?.toObject().id,
          ),
          payoutStatus: DeltaMachineFEStatus.REQUESTED,
        };
      }
      await this.model.findByIdAndUpdate(dmOrderId, {
        ...dataToUpdate,
        ...{ updatedAt: new Date() },
      });
      return true;
    } catch (exception) {
      return false;
    }
  }

  async create(orderId: string, retryCount: number = 0): Promise<boolean> {
    const orderObj = await this.v2Service.getOrderDetailById({ orderId });
    const order = JSON.parse(orderObj?.response);
    if (order?.transaction_status == 'Fail') {
      return false;
    }
    if (order.transaction_status == 'Pending') {
      this.bullMQService.addJob(
        {
          id: orderId,
          type: 'createDmOrder',
          retryCount: retryCount + 1,
        },
        { delay: 10 * 60 * 1000 }, // 10 min delay
        Queues.DM_ORDERS,
      );
      return false;
    }
    const orderStatusData = await this.statusesService.findByName('new-order');
    const orderStatus = orderStatusData?.toJSON();
    const newOrder: OrderDocument = {
      orderId: new mongoose.Types.ObjectId(orderId),
      statusId: new mongoose.Types.ObjectId(orderStatus?.id),
    };
    const orderData: OrderData = this.populateOrdersData(order);

    newOrder.paymentType = orderData.paymentType;
    newOrder.userData = order.userData;
    newOrder.userData.buyerBusinessModel =
      order?.buyerUserData?.businessModel || UserBusinessModel.INDIVIDUAL;

    newOrder.isRiyadhSpecificPickup = false;
    newOrder.trackingNumber = ' ';
    newOrder.isAirTableSynched = true;
    newOrder.sendOutBoundMessage = true;

    orderData.buyerCity = order.buyerAddress?.city || orderData.buyerCity;
    if (order.buyerAddress?.street) {
      orderData.buyerAddress = `${order.buyerAddress?.street}
      ${order.buyerAddress?.district || ''}
      ${order.buyerAddress?.postal_code || ''}`;
    }
    orderData.buyerStreet = order.buyerAddress?.street || orderData.buyerStreet;
    orderData.buyerPostalCode =
      order.buyerAddress?.postal_code || orderData.buyerPostalCode;
    orderData.buyerDistrict =
      order.buyerAddress?.district || orderData.buyerDistrict;

    orderData.sellerCity = order.sellerAddress?.city || orderData.sellerCity;
    if (order.sellerAddress?.street) {
      orderData.sellerAddress = `${order.sellerAddress?.street}
      ${order.sellerAddress?.district || ''}
      ${order.sellerAddress?.postal_code || ''}`;
    }
    orderData.sellerStreet =
      order.sellerAddress?.street || orderData.sellerStreet;
    orderData.sellerPostalCode =
      order.sellerAddress?.postal_code || orderData.sellerPostalCode;
    orderData.sellerDistrict =
      order.sellerAddress?.district || orderData.sellerDistrict;
    orderData.orderType = this.setOrderType(orderData);
    const isRiyadhSpecificPickup = order?.isRiyadhSpecificPickup;

    const isSellerCityRiyadh = isCityMatch(
      orderData.sellerCity,
      CitiesNames.RIYADH,
    );
    const isSellerCityJeddah = isCityMatch(
      orderData.sellerCity,
      CitiesNames.JEDDAH,
    );

    const sellerId = orderData?.sellerId?.toString();

    const vaultSettings = await getSecretData('/secret/data/apiv2');
    const limitSMSASettings = JSON.parse(vaultSettings['limitSMSA'] || '[]');

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
    if (isSellerCityJeddah) {
      const selectSellersForAutomation = JSON.parse(
        vaultSettings['selectSellersForAutomation'] || '[]',
      );
      if (
        selectSellersForAutomation.find(
          (sellerPhoneNumber: string) =>
            sellerPhoneNumber === orderData?.sellerPhone,
        )
      ) {
        orderDataCopy.sellerAddress = process.env.SOUM_SELLER_JEDDAH_ADDRESS;
        orderDataCopy.sellerCity = Cities.JEDDAH;
        canGenerateTrackingNumber = false;
        newOrder.isRiyadhSpecificPickup = true;
      }
    }
    if (
      limitSMSASettings.find((limitSMSAId: string) => limitSMSAId === sellerId)
    ) {
      newOrder.trackingNumber = ' ';
      canGenerateTrackingNumber = false;
      orderData.failedInspectionFlag = true;
    }
    orderDataCopy.orderNumber = `${orderDataCopy.orderNumber}_lastmile`;
    const requestObj = JSON.stringify({
      orderData: orderDataCopy,
      orderid: `${newOrder.orderId}_lastmile`,
      shipmentType: ShipmentTypeEnum.LAST_MILE,
    });
    const response = await this.v2Service.generateSMSATracking({
      request: requestObj,
    });
    newOrder.lastMileTrackingNumber = response?.trackingNumber;

    // Generate first mile tracking number
    if (canGenerateTrackingNumber) {
      orderDataCopy.sellerAddress = orderData.sellerAddress;
      orderDataCopy.sellerPhone = orderData.sellerPhone;
      orderDataCopy.sellerName = orderData.sellerName;
      orderDataCopy.sellerCity = orderData.sellerCity;
      orderDataCopy.buyerAddress = isSellerCityJeddah
        ? process.env.SOUM_SELLER_JEDDAH_ADDRESS
        : process.env.SOUM_SELLER_RIYADH_ADDRESS;
      orderDataCopy.buyerPhone = process.env.SOUM_NUMBER;
      orderDataCopy.buyerName = process.env.SOUM_SELLER_NAME;
      orderDataCopy.buyerCity = isSellerCityJeddah
        ? Cities.JEDDAH
        : Cities.RIYADH;
      orderDataCopy.orderNumber = orderData.orderNumber;
      const requestObj = JSON.stringify({
        orderData: orderDataCopy,
        orderid: newOrder.orderId,
        shipmentType: ShipmentTypeEnum.FIRST_MILE,
      });
      const response = await this.v2Service.generateSMSATracking({
        request: requestObj,
      });
      newOrder.trackingNumber = response?.trackingNumber;
    }
    try {
      orderData.sellerIBAN = decryptIBAN(
        _get(orderData, 'sellerIBAN', ''),
        _get(orderData, 'sellerSecretKey', ''),
      );
    } catch (err) {}
    orderData.trackingNumber = newOrder.trackingNumber;
    orderData.lastMileTrackingNumber = newOrder.lastMileTrackingNumber;
    orderData.payoutAmount = order?.sellerData?.payoutAmount;
    orderData.sellPrice = order?.sellerData?.sellPrice || orderData.sellPrice;
    orderData.sellerPromoCode = order?.sellerData?.sellerPromoCode;
    orderData.commissionAmount =
      order?.sellerData?.commissionAmount?.toString();
    orderData.vatAmount = order?.sellerData?.vatAmount?.toString();
    orderData.deliveryFee = order?.sellerData?.deliveryFee;

    orderData.grandTotal = order?.buyerData?.grandTotal;
    orderData.buyerPromoCode = order?.buyerData?.buyerPromoCode;
    orderData.deliveryFee = order?.buyerData?.deliveryFee;
    orderData.shippingAmount = order?.buyerData?.shippingAmount;
    try {
      const location = orderData.failedInspectionFlag
        ? Cities.JEDDAH
        : Cities.RIYADH;
      const mappingOrderData = _cloneDeep(orderData);
      newOrder.orderData.failedInspectionLabel =
        await this.createFailedInspectionLabel(
          newOrder.orderId.toString(),
          mappingOrderData,
          location,
        );
    } catch (err) {}

    // check if seller has any holding penalty balance
    const penaltyBalance = await this.penaltyService.getHoldingPenaltyBalance(
      orderData?.sellerId,
    );
    const penaltyFee = Number(penaltyBalance?.amount || 0);
    if (penaltyFee > 0) {
      const condition = await this.categoryService.getProductCondition({
        id: orderData?.conditionId,
        variantId: orderData?.variantId,
        sellPrice: Number(orderData?.sellPrice),
      } as GetProductCatConRequest);
      const priceRange = condition?.priceQuality?.name || null;
      try {
        await this.commissionService.addSellerCommissionPenalty({
          product: {
            id: orderData?.productId,
            priceRange: priceRange?.toString() || '',
            sellPrice: null,
            source: null,
            categoryId: null,
            modelId: '',
            varientId: '',
            conditionId: '',
          },
          sellerNewCommission: penaltyFee,
        });
      } catch (err) {}
      const orderPenaltyData = await this.v2Service.getOrderDetailByUserType({
        orderId: orderId,
        userType: 'seller',
      });
      const orderPenaltyObj = JSON.parse(orderPenaltyData?.response);
      orderData.payoutAmount = orderPenaltyObj.order.grand_total;
      orderData.commissionAmount = orderPenaltyObj.order.commission.toString();
      orderData.vatAmount = orderPenaltyObj.order.vat.toString();
    }
    orderData.availableLogisticsServices = ' ';
    let isAvailableToPickup = false;
    let vendorId = '';
    let isAvailableToOneService = false;
    let serviceId = '';
    if (orderData) {
      try {
        const sellerCityTierObj = await this.lerService.getCityTiers({
          name: orderData.sellerCity,
        });
        const buyerCityTierObj = await this.lerService.getCityTiers({
          name: orderData.buyerCity,
        });
        if (sellerCityTierObj?.sellerTier && buyerCityTierObj?.buyerTier) {
          const sellerCityTier = sellerCityTierObj?.sellerTier;
          const buyerCityTier = buyerCityTierObj?.buyerTier;
          const logisticServiceObj = await this.lerService.mapLogisticsServices(
            {
              sellerCityTier: sellerCityTier,
              buyerCityTier: buyerCityTier,
              isKeySeller: orderData.isKeySeller,
            },
          );
          orderData.availableLogisticsServices =
            logisticServiceObj?.logisticServices || ' ';
          isAvailableToPickup = logisticServiceObj?.isAvailableToPickup;
          vendorId = logisticServiceObj?.vendorId;
          serviceId = logisticServiceObj?.serviceId;
          isAvailableToOneService = logisticServiceObj?.isAvailableToOneService;
        }
      } catch (err) {}
    }
    if (isAvailableToPickup) {
      newOrder.isAvailableToPickup = isAvailableToPickup;
    }
    if (isAvailableToOneService) {
      newOrder.vendorId = vendorId;
      newOrder.serviceId = serviceId;
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
    };
    if (orderData?.isConsignment) {
      const consignmentOrderNumber = orderData?.orderNumber.split('_')[0];
      await this.productService.updateConsignmentStatus({
        status: ConsignmentStatus.PAYOUT_TO_SELLER,
        orderNumber: consignmentOrderNumber,
      });
    }
    if (
      orderData?.paymentType === PaymentProviderType.TAMARA ||
      orderData?.paymentType === PaymentProviderType.Tabby
    ) {
      newOrder.captureStatus = DeltaMachineBNPLStatuses.NOT_CAPTURED;
      newOrder.orderData.captureStatus = DeltaMachineBNPLStatuses.NOT_CAPTURED;
    }
    if (order?.addOns) {
      const orderAddOns = order.addOns as any;
      newOrder.orderData.addOns =
        orderAddOns.selectedAddOns
          ?.map((addOn: any) => {
            const name = addOn?.addOnName ? addOn.addOnName : addOn.name;
            return `${name}`;
          })
          .join(',') || '';

      const warrantyAddOn = orderAddOns.selectedAddOns.find(
        (addOn: any) => addOn.addOnType === AddonType.WARRANTY,
      );
      if (warrantyAddOn) {
        newOrder.orderData.addOnsDescription = warrantyAddOn.description || '';
        newOrder.orderData.addOnsValidity = warrantyAddOn.validity || '';
        orderData.addOnsDescription = warrantyAddOn.description || '';
        orderData.addOnsValidity = warrantyAddOn.validity || '';
      }
    }
    orderData.brandName = orderData.brandName;
    orderData.productImgs = orderData.productImgs;
    orderData.canGenerateTrackingNumber = canGenerateTrackingNumber;
    const createdDmo = await this.model.create(newOrder);
    if (penaltyFee > 0) {
      // deduct holding penalty after seller payout action
      await this.penaltyService.deductHoldingPenaltyBalance(
        sellerId,
        createdDmo.id,
      );
    }
    const request = {
      order,
      newOrder: createdDmo,
      orderData,
    };
    // V2 call to create same order in V2 service and will be removed after full migration
    await this.v2Service.createDMOrder({
      request: JSON.stringify(request),
    });
    await this.handleInvoiceGeneration(createdDmo, '');
    return true;
  }

  async getOrderInfo(orderId: string, userType: string = 'buyer') {
    try {
      const dmOrder = await this.findByOrderId(orderId);
      const orderObj = await this.v2Service.getOrderDetailById({ orderId });
      const order = JSON.parse(orderObj?.response);
      const creditTransactions: any =
        await this.walletService.getCreditsByOrderIds({
          orderIds: [orderId],
        });
      let isSuccessRefundToWallet = false;
      let isSuccessPayoutToWallet = false;
      if (creditTransactions.data) {
        creditTransactions.data.forEach((element: any) => {
          if (
            element.ownerId == order.buyer._id.toString() &&
            element.status === 'Success'
          ) {
            isSuccessRefundToWallet = true;
          }
          if (
            element.ownerId == order.seller._id.toString() &&
            element.status === 'Success'
          ) {
            isSuccessPayoutToWallet = true;
          }
        });
      }
      if (userType === 'buyer') {
        const cancellationFee = dmOrder?.orderData?.cancellationFee || 0;
        let refundAmountToPay = order?.grand_total;
        if (dmOrder?.orderData?.isReservation) {
          refundAmountToPay = order?.reservation?.reservationAmount;
        }
        if (dmOrder?.orderData?.isFinancing) {
          const dmStatus = await this.statusesService.findById(
            dmOrder?.statusId.toString(),
          );
          if (
            [
              StatusName.NEW_ORDER,
              StatusName.WAITING_FOR_APPROVAL,
              StatusName.REJECTED_BY_FINANCE_COMPANY,
              StatusName.APPROVED_BY_FINANCE_COMPANY,
            ].find((val) => val === dmStatus.name)
          ) {
            refundAmountToPay = 0;
          } else {
            refundAmountToPay = order?.reservation?.reservationAmount;
          }
        }
        const refundAmountWithFeeToPay = formatPriceInDecimalPoints(
          (refundAmountToPay || 0) - cancellationFee,
        );
        let isBNPL = false;
        if (
          dmOrder?.orderData?.paymentType === PaymentProviderType.TAMARA ||
          dmOrder?.orderData?.paymentType === PaymentProviderType.Tabby
        ) {
          isBNPL = true;
        }
        const dataToSend: any = {
          refundAmmountToPay: refundAmountWithFeeToPay,
          buyerPaymentMethod: order.paymentType,
          grandTotalForBuyer: order.grand_total,
          cancellationFee,
          refundAmountWithFeeToPay,
          orderDate: order.order_date,
          shippingCharges: order.delivery_fee,
          deliveryFee: order.delivery_fee,
          sellPrice: parseFloat((order.sell_price || 0).toFixed(2)),
          buyerCommision: order.commission,
          discountTotal: order.sell_discount,
          vat: order.vat,
          isSuccessPayout: order.isSuccessPayout,
          isSuccessRefund: order.isSuccessRefund,
          isSuccessReversal: order.isSuccessReversal,
          isSuccessRefundToWallet: isSuccessRefundToWallet,
          isSuccessPayoutToWallet: isSuccessPayoutToWallet,
          paymentMethods: order?.paymentMethods,
          bankDetail: order?.bankDetail,
          sellerWalletDetail: await this.getWalletInfo(
            dmOrder?.orderData?.sellerId,
            orderId,
            userType,
          ),
          walletDetail: await this.getWalletInfo(
            dmOrder?.orderData?.buyerId,
            orderId,
            userType,
          ),
          seller: order.seller,
          buyer: order.buyer,
          listingFee: order.listingFee,
          captureStatus: dmOrder?.captureStatus,
          reservation: order?.reservation,
          isQuickPayout: dmOrder?.orderData?.isQuickPayout || false,
          isBNPL,
          refundStatus: isBNPL
            ? DeltaMachineFEStatus.CANT_BE_PROCESSED
            : dmOrder?.refundStatus,
        };
        if (order?.buyerData) {
          dataToSend.shippingCharges = order.buyerData.shippingCharges || 0;
          dataToSend.discountTotal = order.buyerData.discount || 0;
          dataToSend.listingFee = order.buyerData.listingFee || 0;
          dataToSend.orderDate = dmOrder?.createdAt || null;
        }
        return dataToSend;
      } else {
        const dataToSend: any = {
          paymentAmoutToPay: order.grand_total,
          baseBuyPrice: parseFloat((order.sell_price || 0).toFixed(2)),
          sellerCommisionAmount: order.commission,
          discount: order?.sellerData?.discount || 0,
          shippingCharges: order.shipping_charge,
          vat: order.vat,
          grandTotalForSeller: order.grand_total,
          sellerCommission: order.setting_commission,
          isSuccessPayout: order.isSuccessPayout,
          isSuccessRefund: order.isSuccessRefund,
          isSuccessReversal: order.isSuccessReversal,
          isSuccessRefundToWallet: isSuccessRefundToWallet,
          isSuccessPayoutToWallet: isSuccessPayoutToWallet,
          bankDetail: order?.bankDetail,
          walletDetail: await this.getWalletInfo(
            dmOrder?.orderData?.buyerId,
            orderId,
            userType,
          ),
          seller: order.seller,
          buyer: order.buyer,
          isQuickPayout: dmOrder?.orderData?.isQuickPayout || false,
        };
        dataToSend.sellerAccountName =
          order?.seller?.bankDetail?.accountHolderName;
        if (order?.seller?.bankDetail) {
          try {
            dataToSend.sellerBIC = decrypt(
              _get(order.seller.bankDetail, 'bankBIC', ''),
              _get(order.seller, 'secretKey', ''),
            );
            dataToSend.sellerIBAN = decryptIBAN(
              _get(order.seller.bankDetail, 'accountId', ''),
              _get(order.seller, 'secretKey', ''),
            );
          } catch (err) {
            throw err;
          }
        }
        return dataToSend;
      }
    } catch (exception) {
      throw exception;
    }
  }

  async getOrderDetailById(orderId: string) {
    try {
      const dmOrder = await this.findByOrderId(orderId);
      const orderObj = await this.v2Service.getOrderDetailById({ orderId });
      const order = JSON.parse(orderObj?.response);
      if (dmOrder?.serviceId) {
        const servicesMap = new Map();
        const vendorsMap = new Map();
        const logisticService = await this.lerService.getLogisticServices({});
        (logisticService?.services || []).forEach((service) => {
          servicesMap.set(service.serviceId, service);
        });
        (logisticService?.vendors || []).forEach((vendor) => {
          vendorsMap.set(vendor.vendorId, vendor);
        });
        if (
          servicesMap.has(dmOrder?.serviceId) ||
          vendorsMap.has(dmOrder?.vendorId)
        ) {
          dmOrder.logistic =
            (vendorsMap.has(dmOrder?.vendorId)
              ? vendorsMap.get(dmOrder?.vendorId)?.vendorName?.trim()
              : '') +
            ' - ' +
            (servicesMap.has(dmOrder?.serviceId)
              ? servicesMap.get(dmOrder?.serviceId)?.serviceName?.trim()
              : '');
        }
      }
      const dmoId = dmOrder?.id;
      const confirmationDate = dmOrder?.orderData.confirmationDate || '';
      const deliveryDate = dmOrder?.orderData.deliveryDate || '';
      const disputeDate = dmOrder?.orderData.disputeDate || '';
      const shippingDate = dmOrder?.orderData.shippingDate || '';
      dmOrder.orderData = this.populateOrdersData(order);
      const standingPenaltyRes =
        await this.penaltyService.getPenaltyPerDMO(dmoId);
      dmOrder.orderData.penalty = standingPenaltyRes?.amount || 0;
      const cancellationFee = dmOrder?.orderData?.cancellationFee || 0;
      dmOrder.orderData.cancellationFee = cancellationFee;

      if (order?.buyerAddress) {
        const buyerAddress = order?.buyerAddress;
        if (buyerAddress?.street) {
          dmOrder.orderData.buyerAddress = `${buyerAddress?.street}
            ${buyerAddress?.district || ''}
            ${buyerAddress?.postal_code || ''}`;
        }

        dmOrder.orderData.buyerCity =
          buyerAddress?.city || dmOrder.orderData.buyerCity;
        dmOrder.orderData.buyerPostalCode =
          buyerAddress?.postal_code || dmOrder.orderData.buyerPostalCode;
        dmOrder.orderData.buyerDistrict =
          buyerAddress?.district || dmOrder.orderData.buyerDistrict;
      }

      if (order?.sellerAddress) {
        const sellerAddress = order?.sellerAddress;
        if (sellerAddress?.street) {
          dmOrder.orderData.sellerAddress = `${sellerAddress?.street}
            ${sellerAddress?.district || ''}
            ${sellerAddress?.postal_code || ''}`;
        }
        dmOrder.orderData.sellerCity =
          sellerAddress?.city || dmOrder.orderData.sellerCity;
        dmOrder.orderData.sellerPostalCode =
          sellerAddress?.postal_code || dmOrder.orderData.sellerPostalCode;
        dmOrder.orderData.sellerDistrict =
          sellerAddress?.district || dmOrder.orderData.sellerDistrict;
      }

      dmOrder.orderData.orderType = this.setOrderType(dmOrder.orderData);
      if (order?.sellerData) {
        dmOrder.orderData.payoutAmount = order.sellerData.payoutAmount;
        dmOrder.orderData.sellPrice = order.sellerData.sellPrice;
        dmOrder.orderData.sellerPromoCode = order.sellerData.sellerPromoCode;
      }

      if (order?.buyerData) {
        dmOrder.orderData.grandTotal = order.buyerData.grandTotal;
        dmOrder.orderData.buyerPromoCode = order.buyerData.buyerPromoCode;
      }

      const statuses = await this.statusesService.listAll();
      const status = (statuses as StatusSchemaDocument[]).find(
        (status) =>
          status.toObject().id.toString() === dmOrder.statusId.toString(),
      );
      const orderStatuses = this.checkOrderStatuses(
        status as StatusSchemaDocument,
        dmOrder,
      );
      const nctReasonData = (order?.nctReasons || []).find(
        (nctReason) =>
          nctReason?.id === (order?.dmoNCTReason?.nctReasonId || '').toString(),
      );
      dmOrder.orderData.dmoNCTReason = nctReasonData;
      dmOrder.orderData.orderStatus = status.toObject().displayName;
      dmOrder.orderData.confirmationDate = confirmationDate as Date;
      dmOrder.orderData.disputeDate = disputeDate as Date;
      dmOrder.orderData.shippingDate = shippingDate as Date;
      dmOrder.orderData.deliveryDate = deliveryDate as Date;
      dmOrder.refundStatus =
        dmOrder?.refundStatus || orderStatuses.refundStatus;
      dmOrder.payoutStatus =
        dmOrder?.payoutStatus || orderStatuses.payoutStatus;
      dmOrder.disputeStatus =
        dmOrder?.disputeStatus || orderStatuses.disputeStatus;
      dmOrder.orderData.isRequestRefundEnabled =
        orderStatuses.isRequestRefundEnabled;
      dmOrder.orderData.isRequestPayoutEnabled =
        orderStatuses.isRequestPayoutEnabled;
      return dmOrder;
    } catch (exception) {
      throw exception;
    }
  }

  async createInvoice(payload: CreateInvoiceRequest) {
    try {
      const dmOrder = await this.findByOrderId(payload.orderId);
      if (!dmOrder) {
        return '';
      }
      const payoutRequestedStatusObj = await this.statusesService.findByName(
        StatusName.PAYOUT_REQUESTED,
      );
      const updateData = {
        payoutStatusId: payoutRequestedStatusObj?.id,
        payoutStatus: DeltaMachineFEStatus.REQUESTED,
      };
      await this.model.findByIdAndUpdate(dmOrder?.id, {
        ...updateData,
        ...{ updatedAt: new Date() },
      });
      const buyerBusinessModel =
        dmOrder?.userData?.buyerBusinessModel || UserBusinessModel.INDIVIDUAL;
      const sellerBusinessModel =
        dmOrder?.userData?.businessModel || UserBusinessModel.INDIVIDUAL;
      await this.invoiceService.createInvoice({
        orderId: dmOrder?.orderId.toString(),
        userType: payload.invoiceType,
        invoiceType: payload?.invoiceType,
        buyerBusinessModel,
        sellerBusinessModel,
        eventName: payload?.eventName,
      });
    } catch (exception) {
      return '';
    }
  }

  async handleInvoiceGeneration(
    dmOrder: OrderSchemaDocument,
    statusId: string,
  ) {
    try {
      const buyerInvoiceData = {
        invoiceType: '',
        invoiceType1: '',
      };
      const sellerInvoiceData = {
        invoiceType: '',
        invoiceType1: '',
      };
      const statusFrom = await this.statusesService.findById(
        dmOrder?.statusId.toString(),
      );
      let statusTo;
      if (statusId !== '') {
        statusTo = await this.statusesService.findById(statusId);
      } else {
        statusTo = await this.statusesService.findByName(StatusName.NIL);
      }
      // let isInventoryPurchaseDoc = false;
      const operatingModel =
        dmOrder?.userData?.operatingModel || UserOperatingModel.NORMAL;
      const buyerBusinessModel =
        dmOrder?.userData?.buyerBusinessModel || UserBusinessModel.INDIVIDUAL;
      const sellerBusinessModel =
        dmOrder?.userData?.businessModel || UserBusinessModel.INDIVIDUAL;
      if (statusId === '') {
        buyerInvoiceData.invoiceType = 'invoice';
      } else if (
        statusFrom.name === StatusName.LOST_SHIPMENT &&
        statusTo.name === StatusName.REFUND_REQUESTED
      ) {
        buyerInvoiceData.invoiceType = 'credit-note';
      } else if (
        statusFrom.name === StatusName.UNFULFILLED &&
        statusTo.name === StatusName.REFUND_REQUESTED
      ) {
        buyerInvoiceData.invoiceType = 'credit-note';
      } else if (
        statusFrom.name === StatusName.RETURNED_TO_SOUM &&
        statusTo.name === StatusName.REFUND_REQUESTED
      ) {
        buyerInvoiceData.invoiceType = 'credit-note';
        if (operatingModel !== UserOperatingModel.SOUM) {
          buyerInvoiceData.invoiceType = 'credit-note';
        }
      } else if (
        statusFrom.name === StatusName.CANCELLED_BY_BUYER &&
        statusTo.name === StatusName.REFUND_REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.EARLY) {
          buyerInvoiceData.invoiceType = 'credit-note';
        }
      } else if (
        statusFrom.name === StatusName.ITEM_DELIVERED &&
        statusTo.name === StatusName.PAYOUT_REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.NORMAL) {
          sellerInvoiceData.invoiceType = 'invoice';
        }
      } else if (
        statusFrom.name === StatusName.RETURNED_TO_SOUM &&
        statusTo.name === StatusName.PAYOUT_REQUESTED
      ) {
        if (operatingModel !== UserOperatingModel.NORMAL) {
          sellerInvoiceData.invoiceType = 'credit-note';
          sellerInvoiceData.invoiceType1 = 'invoice';
          // isInventoryPurchaseDoc = true;
        }
      } else if (
        statusFrom.name === StatusName.REPAID_BY_BUYER &&
        statusTo.name === StatusName.PAYOUT_REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.NORMAL) {
          buyerInvoiceData.invoiceType = 'invoice';
          sellerInvoiceData.invoiceType = 'invoice';
        }
      } else if (
        statusFrom.name === StatusName.BUYER_DUAL_RECEIPT &&
        statusTo.name === StatusName.REPAID_BY_BUYER
      ) {
        if (operatingModel === UserOperatingModel.EARLY) {
          buyerInvoiceData.invoiceType = 'invoice';
          sellerInvoiceData.invoiceType = 'invoice';
        }
      } else if (
        statusFrom.name === StatusName.IN_TRANSIT &&
        statusTo.name === StatusName.PAYOUT_REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.EARLY) {
          sellerInvoiceData.invoiceType = 'invoice';
        }
      } else if (
        statusFrom.name === StatusName.RETURNED_TO_SELLER &&
        statusTo.name === StatusName.PAYOUT_REQUESTED &&
        dmOrder?.payoutStatus === DeltaMachineFEStatus.NOT_REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.NORMAL) {
          buyerInvoiceData.invoiceType = 'credit-note';
        } else if (operatingModel === UserOperatingModel.EARLY) {
          sellerInvoiceData.invoiceType = 'credit-note';
          buyerInvoiceData.invoiceType = 'credit-note';
        }
      } else if (
        statusFrom.name === StatusName.RETURNED_TO_SELLER &&
        statusTo.name === StatusName.PAYOUT_REQUESTED &&
        dmOrder?.payoutStatus === DeltaMachineFEStatus.REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.NORMAL) {
          sellerInvoiceData.invoiceType = 'credit-note';
          buyerInvoiceData.invoiceType = 'credit-note';
        } else if (operatingModel === UserOperatingModel.EARLY) {
          sellerInvoiceData.invoiceType = 'credit-note';
          buyerInvoiceData.invoiceType = 'credit-note';
        }
      } else if (
        statusFrom.name === StatusName.INVALID_DISPUTE &&
        statusTo.name === StatusName.PAYOUT_REQUESTED
      ) {
        if (operatingModel === UserOperatingModel.NORMAL) {
          sellerInvoiceData.invoiceType = 'invoice';
        }
      }
      if (buyerInvoiceData?.invoiceType) {
        await this.invoiceService.createInvoice({
          orderId: dmOrder?.orderId.toString(),
          userType: 'buyer',
          invoiceType: buyerInvoiceData.invoiceType,
          buyerBusinessModel,
          sellerBusinessModel,
          eventName: `${statusFrom.displayName} to ${statusTo.displayName}`,
        });
      }
      if (buyerInvoiceData?.invoiceType1) {
        await this.invoiceService.createInvoice({
          orderId: dmOrder?.orderId.toString(),
          userType: 'buyer',
          invoiceType: buyerInvoiceData.invoiceType,
          buyerBusinessModel,
          sellerBusinessModel,
          eventName: `${statusFrom.displayName} to ${statusTo.displayName}`,
        });
      }
      if (sellerInvoiceData?.invoiceType) {
        await this.invoiceService.createInvoice({
          orderId: dmOrder?.orderId.toString(),
          userType: 'seller',
          invoiceType: sellerInvoiceData.invoiceType,
          buyerBusinessModel,
          sellerBusinessModel,
          eventName: `${statusFrom.displayName} to ${statusTo.displayName}`,
        });
      }
      if (sellerInvoiceData?.invoiceType1) {
        await this.invoiceService.createInvoice({
          orderId: dmOrder?.orderId.toString(),
          userType: 'seller',
          invoiceType: sellerInvoiceData.invoiceType,
          buyerBusinessModel,
          sellerBusinessModel,
          eventName: `${statusFrom.displayName} to ${statusTo.displayName}`,
        });
      }
    } catch (err) {
      console.error(err);
      return;
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

  async getWalletInfo(userId: string, orderId: string, userType: string) {
    try {
      const wallet = await this.walletService.getWallet({ ownerId: userId });
      let pendingTransaction;
      if (userType === UserType.SELLER) {
        // get pending transaction
        const transactions: GetTransactionsResponse =
          await this.walletService.getTransaction({
            orderId: orderId,
          });
        pendingTransaction = (transactions?.data || []).find(
          (transaction: TransactionResponse) =>
            transaction?.walletId === wallet?.id,
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
      return null;
    }
  }

  private getImagesLinks(imagesArr: string[]): string {
    let images = '';
    if (imagesArr && imagesArr.length) {
      imagesArr.forEach((image) => {
        if (images === '') {
          images = image;
        } else {
          images += `, ${image}`;
        }
      });
    }
    return images;
  }

  private populateOrdersData(matchedOrder: any): OrderData {
    let IBAN: string;
    let bankCode: string;
    let buyerIBAN: string;
    let buyerBankCode: string;
    if (matchedOrder.seller_iban) {
      IBAN = decryptIBAN(
        matchedOrder.seller_iban,
        matchedOrder.seller_secret_key,
      );
    }
    if (matchedOrder.seller_bank_bic) {
      bankCode = decrypt(
        matchedOrder.seller_bank_bic,
        matchedOrder.seller_secret_key,
      );
    }
    if (matchedOrder.buyer_iban) {
      buyerIBAN = decryptIBAN(
        matchedOrder.buyer_iban,
        matchedOrder.buyer_secret_key,
      );
    }
    if (matchedOrder.buyer_bank_bic) {
      buyerBankCode = decrypt(
        matchedOrder.buyer_bank_bic,
        matchedOrder.buyer_secret_key,
      );
    }
    const sellerType = matchedOrder?.is_merchant_seller
      ? SellerType.MERCHANT
      : matchedOrder?.is_key_seller
      ? SellerType.SIS
      : SellerType.INDIVIDUAL;
    const orderData = {
      productId: matchedOrder.product?._id?.toString(),
      productName: matchedOrder.model_name || '',
      productNameAr: matchedOrder?.model_name_ar || '',
      inventoryId: matchedOrder?.product?.inventoryId || '',
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
      isConsignment: matchedOrder?.isConsignment || false,
      conditionId: matchedOrder.product?.condition_id?.toString(),
      isUAEListing: matchedOrder?.isUAE || false,
      productDescription: matchedOrder?.productDescription || '',
      productImgs: matchedOrder?.images || [],
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
        orderData.addOns.length - 1,
      );
    }
    return orderData;
  }

  private checkOrderStatuses(
    status: StatusSchemaDocument,
    dmo: OrderSchemaDocument,
  ) {
    const returnedData: any = {
      isRequestRefundEnabled: false,
      isRequestPayoutEnabled: false,
      disputeStatus: DeltaMachineFEStatus.NO_DISPUTE,
      refundStatus: DeltaMachineFEStatus.NOT_REQUESTED,
      payoutStatus: DeltaMachineFEStatus.NOT_REQUESTED,
    };

    if (
      dmo?.orderData?.orderStatus === StatusName.INFORMATION_PENDING ||
      dmo?.orderData?.orderStatus === StatusName.REFUND_REQUESTED
    ) {
      returnedData.refundStatus = DeltaMachineFEStatus.REQUESTED;
    } else if (dmo?.orderData?.orderStatus === StatusName.REFUND_PROCESSED) {
      returnedData.refundStatus = DeltaMachineFEStatus.COMPLETED;
    }

    if (dmo?.orderData?.orderStatus === StatusName.PAYOUT_REQUESTED) {
      returnedData.payoutStatus = DeltaMachineFEStatus.REQUESTED;
    } else if (dmo?.orderData?.orderStatus === StatusName.PAYOUT_PROCESSED) {
      returnedData.payoutStatus = DeltaMachineFEStatus.COMPLETED;
    }

    const disputeStatusesNames = [
      StatusName.NEW_DISPUTE,
      StatusName.VALID_DISPUTE,
      StatusName.RETURN_TO_SELLER,
      StatusName.SELLER_RETURN_AWAITED,
      StatusName.SELLER_RETURN_IN_TRANSIT,
      StatusName.RETURN_TO_SOUM,
      StatusName.SOUM_RETURN_AWAITED,
      StatusName.SOUM_RETURN_IN_TRANSIT,
    ];
    const invalidDisputeStatusesNames = [
      StatusName.INVALID_DISPUTE,
      StatusName.RETURNED_TO_SELLER,
      StatusName.RETURNED_TO_SOUM,
    ];
    const requestRefundStatusesNames = [
      StatusName.LOST_SHIPMENT,
      StatusName.UNFULFILLED,
      StatusName.RETURNED_TO_SELLER,
      StatusName.RETURNED_TO_SOUM,
      StatusName.CANCELLED_BY_BUYER,
      StatusName.INFORMATION_PENDING,
    ];
    const requestPayoutStatusesNames = [
      StatusName.ITEM_DELIVERED,
      StatusName.REPAID_BY_BUYER,
      StatusName.INVALID_DISPUTE,
      StatusName.RETURNED_TO_SOUM,
      StatusName.IN_TRANSIT,
    ];
    if (disputeStatusesNames.includes(status?.toObject().name as StatusName)) {
      returnedData.disputeStatus = DeltaMachineFEStatus.OPEN_DISPUTE;
    } else if (
      invalidDisputeStatusesNames.includes(
        status?.toObject().name as StatusName,
      )
    ) {
      returnedData.disputeStatus = DeltaMachineFEStatus.COMPLETED;
    }
    if (
      requestRefundStatusesNames.includes(status?.toObject().name as StatusName)
    ) {
      returnedData.isRequestRefundEnabled = true;
      if (
        dmo?.refundStatus === DeltaMachineFEStatus.REQUESTED ||
        dmo?.refundStatus === DeltaMachineFEStatus.COMPLETED
      ) {
        returnedData.isRequestRefundEnabled = false;
      }
    }
    if (
      requestPayoutStatusesNames.includes(status?.toObject().name as StatusName)
    ) {
      returnedData.isRequestPayoutEnabled = true;
      if (
        dmo?.payoutStatus === DeltaMachineFEStatus.REQUESTED ||
        dmo?.payoutStatus === DeltaMachineFEStatus.COMPLETED
      ) {
        returnedData.isRequestPayoutEnabled = false;
      }
    }
    return returnedData;
  }

  private async createFailedInspectionLabel(
    orderId: string,
    orderData: OrderData,
    inspectionCenter: string,
  ) {
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
      const requestObj = JSON.stringify({
        orderData,
        orderid: orderId,
        shipmentType: ShipmentTypeEnum.FAILED_INSPECTION,
      });
      const response = await this.v2Service.generateSMSATracking({
        request: requestObj,
      });
      const failedInspectionTrackingNumber = response?.trackingNumber || '';
      return failedInspectionTrackingNumber;
    } catch (exception) {
      return '';
    }
  }
}
