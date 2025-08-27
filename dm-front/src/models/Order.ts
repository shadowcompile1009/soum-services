import { DeepKeys } from '@tanstack/react-table';
import isEmpty from 'lodash.isempty';
import { instanceToPlain } from 'class-transformer';

import { QUERY_KEYS } from '@src/constants/queryKeys';
import { apiClientV2, apiGatewayClient } from '@src/api/client';
import { statusesSubmodules } from '@src/components/Order/EditOrderDetails/Select/SelectOrderStatus';

import { StatusGroup, StatusGroups } from './StatusGroup';
import { Seller, Buyer } from './Customer';
import { Action, IAction } from './Action';

export interface Column {
  accessor: DeepKeys<Order>;
  header: string;
}

export enum EOrderModules {
  NEW = 'new',
  ACTIVE = 'active',
  CLOSED = 'closed',
  REFUND = 'refund',
  PAYOUT = 'payout',
  NEW_PAYOUT = 'new-payout',
  BNPL = 'bnpl',
  RESERVATION = 'reservation',
  FINANCE = 'finance',
  REPLACEMENT = 'replacement',
  NEW_REFUND = 'new-refund',
}

export const EOrderV2Modules = {
  CONFIRM: 'confirmation',
  Delivery: 'delivery',
  Shipping: 'shipping',
  Dispute: 'dispute',
  Backlog: 'backlog',
} as const;

export type EOrderV2Module = keyof typeof EOrderV2Modules;
export type EOrderV2ModuleValues = typeof EOrderV2Modules[EOrderV2Module];

export const EOrderV3Modules = {
  DISPUTE: 'new-dispute',
  ALL: 'all',
} as const;

export type EOrderV3Module = keyof typeof EOrderV3Modules;
export type EOrderV3ModuleValues = typeof EOrderV3Modules[EOrderV3Module];

export const SUBMODULE_QUERY_KEYS_MAP = {
  [EOrderModules.NEW]: QUERY_KEYS.newOrders,
  [EOrderModules.ACTIVE]: QUERY_KEYS.activeOrders,
  [EOrderModules.REFUND]: QUERY_KEYS.buyerRefunds,
  [EOrderModules.NEW_REFUND]: QUERY_KEYS.newBuyerRefunds,
  [EOrderModules.BNPL]: QUERY_KEYS.bnplOrders,
  [EOrderModules.PAYOUT]: QUERY_KEYS.sellerPayouts,
  [EOrderModules.NEW_PAYOUT]: QUERY_KEYS.newSellerPayouts,
  [EOrderModules.CLOSED]: QUERY_KEYS.closedOrders,
  [EOrderModules.RESERVATION]: QUERY_KEYS.reservationOrders,
  [EOrderModules.FINANCE]: QUERY_KEYS.listingCarRealState,
  [EOrderModules.REPLACEMENT]: QUERY_KEYS.replacementOrders,
};

export interface PaginationData {
  total: number;
  limit: number;
  offset: number;
}

export interface PaginationDataV3 {
  total: number;
}

export type OrderStatusNameType =
  | 'new-order'
  | 'to-confirm-availability'
  | 'confirmed-label-to-be-sent'
  | 'awaiting-seller-to-ship'
  | 'picked-up'
  | 'ready-to-ship'
  | 'refund-to-buyer'
  | 'in-transit'
  | 'item-delivered'
  | 'payout-to-seller'
  | 'transferred'
  | 'disputed'
  | 'valid-dispute'
  | 'return-label-sent'
  | 'return-in-transit'
  | 'refunded'
  | 'captured'
  | 'not-captured'
  | 'waiting-for-approval'
  | 'approved-by-finance-company'
  | 'rejected-by-finance-company'
  | 'waiting-for-visit'
  | 'cancelled-visit'
  | 'waiting-for-full-amount'
  | 'full-amount-paid'
  | 'cancelled-reservation';

export interface IOrderStatus {
  id: string;
  name: OrderStatusNameType;
  displayName: string;
}

export interface INCTReasonsResponse {
  id: string;
  name: OrderStatusNameType;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  sellerWithdrawal: boolean;
}
export interface INCTReasons {
  id: string;
  name: OrderStatusNameType;
  displayName: string;
}

export interface IResponseOrderStatus {
  id: string;
  name: OrderStatusNameType;
  displayName: string;
}

export enum EOrderType {
  'R_R' = 'R-R', // (Seller & Buyer City = Riyadh)& (Seller is not in(SoumSellers))
  'R_O' = 'R-O', // (Seller City = Riyadh) & (Seller City != Buyer City) & (Seller not in (SoumSellers))
  'S_O' = 'S-O', // (Seller City = Riyadh) & (Seller City != Buyer City) & (Seller is in (SoumSellers))
  'S_R' = 'S-R', // (Seller & Buyer City = Riyadh) & (Seller is in (SoumSellers)),
  'Cross' = 'Cross', // (Seller City != Riyadh) & (Seller City != Buyer City),
  'Same_City' = 'Same City', // (Seller City != Riyadh) & (Seller City = Buyer City)
}

export enum EOrderPaymentStatus {
  Pending = 'Pending',
  Success = 'Success',
  Fail = 'Fail',
}

export enum ECaptureOrderStatus {
  Captured = 'Captured',
  NotCaptured = 'Not Captured',
}

export enum EOrderPaymentType {
  Mada = 'MADA',
  VisaMaster = 'VISA_MASTER',
  ApplePay = 'APPLEPAY',
  StcPay = 'STC_PAY',
}

export interface IOrder {
  orderNumber: string;
  dmOrderId: string;
  id: string;
  date: Date;
  productId: string;
  orderType: EOrderType;
  seller: Seller;
  buyer: Buyer;
  grandTotal: number;
  payoutAmount: number;
  payment: Payment;
  payoutStatus: string;
  trackingNumber: number;
  reverseSMSATrackingNumber: string;
  orderStatus: IOrderStatus;
  productName: string;
  payoutType: string;
  paymentType?: string;
  paymentStatus?: string;
  captureOrder: CaptureOrder;
  captureTransaction?: string;
  paidAmount?: string;
  remainingAmount?: string;
  replacedOrderId?: string;
  replacedProductId?: string;
  issueReplacement?: boolean;
}

export interface IOrderV2 {
  actions: IAction[];
  orderNumber: string;
  dmOrderId: string;
  id: string;
  date: Date;
  orderType: EOrderType;
  orderStatus: string;
  logisticService: string;
  updatedAt: Date;
  createdAt: Date;
  disputeDate: Date;
  deliveryDate: Date;
  shippingDate: Date;
  payment?: Payment;
  captureOrder?: CaptureOrder;
  captureTransaction?: string;
  seller?: Seller;
}

export interface IOrderV3 {
  actions: IAction[];
  orderId: string;
  orderNumber: string;
  date: Date;
  disputeDate: Date;
  deliveryDate: Date;
  disputeStatus: string;
  orderType: EOrderType;
  logisticService: string;
  operatingModel: string;
  sellerType: string;
  sellerCategory: string;
  orderStatus: string;
}

export const OrderEndpoints = {
  exportNewOrders: 'rest/api/v1/dm-orders/export?submodule=new',
  exportActiveOrders: 'rest/api/v1/dm-orders/export?submodule=active',
  ordersV2(
    submodule: EOrderV2ModuleValues,
    limit: string,
    offset: string,
    search?: string,
    statusId?: string,
    services?: string
  ) {
    const hasServices = !isEmpty(services);

    const queryService = hasServices ? `&services=${services}` : '';

    if (isEmpty(search) && isEmpty(statusId)) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}${queryService}`;
    }

    if (!isEmpty(statusId) && isEmpty(search)) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&statuses=${statusId}${queryService}`;
    }

    if (!isEmpty(search) && isEmpty(statusId)) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&q=${search}${queryService}`;
    }

    return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&q=${search}&statuses=${statusId}${queryService}`;
  },
  financeOrders(
    submodule: EFinanceOrderModuleValues,
    limit: string,
    offset: string,
    search?: string,
    statusId?: string,
    services?: string
  ) {
    const hasServices = !isEmpty(services);

    const queryService = hasServices ? `&services=${services}` : '';

    if (isEmpty(search) && isEmpty(statusId)) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}${queryService}`;
    }

    if (!isEmpty(statusId) && isEmpty(search)) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&statuses=${statusId}${queryService}`;
    }

    if (!isEmpty(search) && isEmpty(statusId)) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&q=${search}${queryService}`;
    }

    return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&q=${search}&statuses=${statusId}${queryService}`;
  },
  ordersV3(
    submodule: EOrderV3ModuleValues,
    limit: string,
    offset: string,
    search?: string,
    statusId?: string,
    startDate?: string,
    endDate?: string,
    operatingModel?: string,
    orderType?: string,
    sellerCategory?: string,
    sellerType?: string,
    orderStatus?: string,
    disputeStatus?: string
  ) {
    const params = {
      limit,
      offset,
      submodule,
      q: search,
      statuses: statusId,
      startDate,
      endDate,
      operatingModel,
      orderType,
      sellerCategory,
      sellerType,
    };

    let queryString = Object.entries(params)
      .filter(([, value]) => !isEmpty(value))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    if (orderStatus) {
      queryString += `&statuses=${orderStatus}`;
    }

    if (disputeStatus) {
      queryString += `&statuses=${disputeStatus}`;
    }

    if (orderStatus && disputeStatus) {
      queryString += `&statuses=${orderStatus},${disputeStatus}`;
    }

    return `/dm-backend/orders?${queryString}`;
  },
  orders(
    submodule: EOrderModules,
    limit: string,
    offset: string,
    search?: string,
    replacementStatus?: string
  ) {
    if (!search && !replacementStatus) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}`;
    }

    if (search && !replacementStatus) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&q=${search}`;
    }

    if (!search && replacementStatus) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&replacementStatus=${replacementStatus}`;
    }
    return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}&q=${search}`;
  },
  BNPLCaptureOrders(
    submodule: EOrderModules,
    limit: string,
    offset: string,
    search?: string,
    capturestatus?: string,
    replacementStatus?: string
  ) {
    if (!search && !capturestatus && !replacementStatus) {
      return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}`;
    }
    // return search if exist and capture status if exist using template literals
    return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=${submodule}${
      search ? `&q=${search}` : ``
    }${capturestatus ? `&capturestatus=${capturestatus}` : ``}${
      replacementStatus ? `&replacementStatus=${replacementStatus}` : ``
    }`;
  },
  BNPLPayoutOrders(
    submodule: EOrderModules,
    limit: string,
    offset: string,
    search?: string,
    capturestatus?: string,
    replacementStatus?: string,
    orderType?: string,
    payoutStatus?: string,
    refundStatus?: string
  ) {
    const params = {
      limit,
      offset,
      submodule,
      q: search,
      capturestatus,
      replacementStatus,
      orderType,
    };

    let queryString = Object.entries(params)
      .filter(([, value]) => !isEmpty(value))
      .map(([key, value]) => `${key}=${value}`)
      .join('&');

    if (payoutStatus) {
      queryString += `&statuses=${payoutStatus}`;
    }

    if (refundStatus) {
      queryString += `&statuses=${refundStatus}`;
    }

    if (payoutStatus && refundStatus) {
      queryString += `&statuses=${payoutStatus},${refundStatus}`;
    }

    return `/dm-backend/orders?${queryString}`;
  },
  activeOrders(
    limit: string,
    offset: string,
    search: string,
    statuses: string
  ) {
    return `rest/api/v1/dm-orders?limit=${limit}&offset=${offset}&submodule=active&q=${search}&statuses=${statuses}`;
  },
  orderFilterStatusesV3(submodule: string) {
    return `dm-backend/statuses/submodule/${submodule}`;
  },

  orderStatusesByCurrentStatus(id: string, submodule: statusesSubmodules) {
    return `dm-backend/orders/${id}/statuses/${submodule}`;
  },
  orderStatuses(submodule?: EOrderModules) {
    if (!submodule) return 'rest/api/v1/dm-orders/statuses';

    return `rest/api/v1/dm-orders/statuses?submodule=${submodule}`;
  },
  financeReasons() {
    return `dm-backend/orders/finance-reasoning`;
  },
  editOrderStatuses(orderId: string) {
    return `rest/api/v1/dm-orders/statuses/${orderId}`;
  },
  disputeStatuses(orderId: string) {
    return `rest/api/v1/dm-orders/statuses/${orderId}?submodule=dispute`;
  },
  changeOrderStatus(orderId: string) {
    return `rest/api/v1/dm-orders/${orderId}`;
  },
  orderDetail(orderId: string) {
    return `rest/api/v1/dm-orders/${orderId}`;
  },
  changeOrderDetailsV3() {
    return `dm-backend/orders`;
  },
  orderDetailV3(orderId: string) {
    return `dm-backend/orders/${orderId}/detail`;
  },
  invoiceDetails(orderId: string, page: string, size: string) {
    return `/invoice/taxilla?page=${page}&size=${size}&orderId=${orderId}`;
  },
  requestRefundOrPayout(id: string, type: 'refund' | 'payout') {
    return `dm-backend/orders/request/${id}/${type}`;
  },
  NCTReasons(orderId?: string) {
    if (orderId) {
      return `rest/api/v1/dm-orders/nct-reasons/${orderId}`;
    } else {
      return `rest/api/v1/dm-orders/nct-reasons`;
    }
  },
  ReverseSmsaTracking() {
    return `rest/api/v1/dm-orders/reverse-tracking-number`;
  },
  updateProductListing(dmoId: string) {
    return `rest/api/v1/dm-orders/relist/${dmoId}`;
  },
  createNCTReasons() {
    return `rest/api/v1/dm-orders/dmo-nct-reasons`;
  },
  captureIndividualTransaction(orderId: string) {
    return `rest/api/v1/dm-orders/capture/${orderId}`;
  },
  captureAllTransaction() {
    return `rest/api/v1/dm-orders/capture/orders/all`;
  },
  updateNCTReasons(orderId: string) {
    return `rest/api/v1/dm-orders/${orderId}/nct-reasons`;
  },
  getPenalties() {
    return `dm-backend/penalty-settings`;
  },
  updatePenalty() {
    return `dm-backend/penalty`;
  },
  replaceProductId(orderId: string, replacedProductId: string) {
    return `rest/api/v1/dm-orders/replacement/${orderId}/${replacedProductId}`;
  },
};

type PaymentTextColorType =
  | 'static.reds.300'
  | 'static.greens.300'
  | 'static.orange';

const PaymentTextColor: Record<string, PaymentTextColorType> = {
  [EOrderPaymentStatus.Success]: 'static.greens.300',
  [EOrderPaymentStatus.Fail]: 'static.reds.300',
  [EOrderPaymentStatus.Pending]: 'static.orange',
};
export class Payment {
  public status: EOrderPaymentStatus;
  public paymentType: EOrderPaymentType;
  public textColor: PaymentTextColorType;
  constructor(
    paymentStatus: EOrderPaymentStatus,
    paymentType: EOrderPaymentType
  ) {
    this.status = paymentStatus || EOrderPaymentStatus.Success;
    this.textColor = PaymentTextColor[paymentStatus];
    this.paymentType = paymentType;
  }
}

type CaptureTextColorType = 'static.reds.300' | 'static.greens.300';

const CaptureTextColor: Record<string, CaptureTextColorType> = {
  [ECaptureOrderStatus.Captured]: 'static.greens.300',
  [ECaptureOrderStatus.NotCaptured]: 'static.reds.300',
};

export class CaptureOrder {
  public captureStatus: ECaptureOrderStatus;
  public textColor: CaptureTextColorType;
  constructor(captureStatus: ECaptureOrderStatus) {
    this.captureStatus = captureStatus;
    this.textColor = CaptureTextColor[captureStatus];
  }
}

export class Order {
  static async getOrders({
    submodule,
    limit,
    offset,
    search,
    replacementStatus,
  }: {
    submodule: EOrderModules;
    limit: string;
    offset: string;
    search?: string;
    replacementStatus?: string;
  }) {
    const result = await apiClientV2.client.get(
      OrderEndpoints.orders(submodule, limit, offset, search, replacementStatus)
    );
    return result.data.responseData;
  }

  static async getCaptureOrders({
    submodule,
    limit,
    offset,
    search,
    capturestatus,
    replacementStatus,
  }: {
    submodule: EOrderModules;
    limit: string;
    offset: string;
    search?: string;
    capturestatus?: string;
    replacementStatus?: string;
  }) {
    const result = await apiClientV2.client.get(
      OrderEndpoints.BNPLCaptureOrders(
        submodule,
        limit,
        offset,
        search,
        capturestatus,
        replacementStatus
      )
    );
    return result.data.responseData;
  }

  static async getPayoutOrders({
    submodule,
    limit,
    offset,
    search,
    capturestatus,
    replacementStatus,
    orderType,
    payoutStatus,
    refundStatus,
  }: {
    submodule: EOrderModules;
    limit: string;
    offset: string;
    search?: string;
    capturestatus?: string;
    replacementStatus?: string;
    orderType?: string;
    payoutStatus?: string;
    refundStatus?: string;
  }) {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.BNPLPayoutOrders(
        submodule,
        limit,
        offset,
        search,
        capturestatus,
        replacementStatus,
        orderType,
        payoutStatus,
        refundStatus
      )
    );

    return result;
  }

  static async getActiveOrders({
    limit,
    offset,
    search,
    statuses,
  }: {
    limit: string;
    offset: string;
    search: string;
    statuses: string;
  }) {
    const result = await apiClientV2.client.get(
      OrderEndpoints.activeOrders(limit, offset, search, statuses)
    );
    return result.data.responseData;
  }

  static async exportActiveOrders() {
    const result = await apiClientV2.client.get(
      OrderEndpoints.exportActiveOrders
    );

    return result.data;
  }
  static async exportNewOrders() {
    const result = await apiClientV2.client.get(OrderEndpoints.exportNewOrders);

    return result.data;
  }

  static async changeOrderStatus(orderId: string, statusId: string) {
    const result = await apiClientV2.client.put(
      OrderEndpoints.changeOrderStatus(orderId),
      { statusId }
    );

    return result.data.responseData;
  }

  static async changeOrderDetails({
    id,
    statusId,
    dmoNctReasonId,
    penalty,
  }: {
    id: string;
    statusId: string;
    dmoNctReasonId: string;
    penalty: string;
  }) {
    const result = await apiGatewayClient.client.put(
      OrderEndpoints.changeOrderDetailsV3(),
      {
        id: id,
        statusId: statusId || null,
        dmoNctReasonId: dmoNctReasonId || null,
        penalty: penalty || null,
      }
    );

    return result.data.responseData;
  }

  static async getOrderDetail(id: string) {
    const result = await apiClientV2.client.get(OrderEndpoints.orderDetail(id));

    return result.data.responseData;
  }

  static async getOrderDetailV3(id: string) {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.orderDetailV3(id)
    );

    return result.data;
  }

  static async replaceProductId(orderId: string, replacedProductId: string) {
    const result = await apiClientV2.client.post(
      OrderEndpoints.replaceProductId(orderId, replacedProductId)
    );

    return result.data;
  }

  static async requestRefundOrPayout(id: string, type: 'refund' | 'payout') {
    const result = await apiGatewayClient.client.post(
      OrderEndpoints.requestRefundOrPayout(id, type)
    );

    return result.data;
  }

  static async getNCTReasons() {
    const result = await apiClientV2.client.get(OrderEndpoints.NCTReasons());

    return result.data.responseData;
  }

  static async getPenalties() {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.getPenalties()
    );

    return result.data;
  }

  static mapNCTReasons(reasons: INCTReasonsResponse[]) {
    return reasons.map((reason: INCTReasons) => ({
      id: reason.id,
      displayName: reason.displayName,
      name: reason.name,
    }));
  }

  static async getNCTReasonByOrderId(id: string) {
    const result = await apiClientV2.client.get(OrderEndpoints.NCTReasons(id));

    return result.data.responseData;
  }

  static async getReverseSmsaTrackingById(id: string) {
    const result = await apiClientV2.client.post(
      OrderEndpoints.ReverseSmsaTracking(),
      {
        orderId: id,
      }
    );

    return result.data.responseData;
  }

  static async updateProductStatusForRelisting(dmoId: string) {
    const result = await apiClientV2.client.put(
      OrderEndpoints.updateProductListing(dmoId),
      {
        dmoId,
      }
    );

    return result.data.responseData;
  }

  static async createNCTReason(
    nctReasonId: string,
    dmoId: string,
    orderId: string
  ) {
    const result = await apiClientV2.client.post(
      OrderEndpoints.createNCTReasons(),
      { nctReasonId, dmoId, orderId }
    );

    return result.data.result;
  }

  static async captureIndividualTransaction(orderId: string) {
    const result = await apiClientV2.client.post(
      OrderEndpoints.captureIndividualTransaction(orderId),
      {}
    );

    return result.data.result;
  }

  static async captureAllTransaction(orders: any[]) {
    const result = await apiClientV2.client.post(
      OrderEndpoints.captureAllTransaction(),
      { orders: orders }
    );

    return result.data.result;
  }

  static async updateNCTReason(orderId: string, nctReasonId: string) {
    const result = await apiClientV2.client.put(
      OrderEndpoints.updateNCTReasons(orderId),
      { orderId, nctReasonId }
    );

    return result.data.result;
  }

  static async updatePenalty(sellerId: string, id: string, penalty: any) {
    const result = await apiGatewayClient.client.post(
      OrderEndpoints.updatePenalty(),
      {
        userId: sellerId,
        dmoId: id,
        amount: penalty.id,
      }
    );

    return result.data.result;
  }

  static async getEditOrderStatuses(orderId: string) {
    const result = await apiClientV2.client.get(
      OrderEndpoints.editOrderStatuses(orderId)
    );

    return result.data.responseData;
  }

  static async getOrderStatusesByCurrentStatus(
    id: string,
    submodule: statusesSubmodules
  ) {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.orderStatusesByCurrentStatus(id, submodule)
    );

    const responseData = result.data;

    if (responseData.length === 1 && responseData[0] === null) {
      return null;
    }

    if (responseData.length > 1 && responseData[0] === null) {
      return responseData.slice(1);
    }

    return responseData;
  }

  static async getOrderStatuses(submodule?: EOrderModules) {
    const result = await apiClientV2.client.get(
      OrderEndpoints.orderStatuses(submodule)
    );

    return result.data.responseData;
  }

  static mapOrderStatuses({ statuses }: { statuses: IResponseOrderStatus[] }) {
    return statuses?.map((status: IResponseOrderStatus) => ({
      id: status.id,
      displayName: status.displayName,
      name: status.name,
    }));
  }

  static async getDisputeStatuses(id: string) {
    const result = await apiClientV2.client.get(
      OrderEndpoints.disputeStatuses(id)
    );

    return result.data.responseData;
  }

  static mapOrders({
    orders,
    statuses,
  }: {
    orders: unknown[];
    statuses: IResponseOrderStatus[];
  }): Order[] {
    const mappedStatuses: IOrderStatus[] = Order.mapOrderStatuses({ statuses });
    const newOrders = orders?.map((order: any) => {
      const orderStatus = mappedStatuses.find(
        (status) => status.id === order.statusId
      ) as IOrderStatus;

      return new Order({
        payoutType: order?.payoutType || '',
        orderNumber: order?.orderData?.orderNumber,
        dmOrderId: order?.id,
        id: order?.orderId,
        date: order?.createdAt,
        productId: order?.orderData?.productId,
        orderType: order?.orderData?.orderType,
        seller: new Seller({
          id: order?.orderData?.sellerId,
          phone: order?.orderData?.sellerPhone || '',
          city: order?.orderData?.sellerCity || '',
          name: order?.orderData?.sellerName,
          address: order?.orderData?.sellerAddress,
          payoutAmount: order?.orderData?.payoutAmount,
        }),
        buyer: new Buyer({
          id: order?.orderData?.buyerId,
          phone: order?.orderData?.buyerPhone || '',
          city: order?.orderData?.buyerCity || '',
          promo: order?.orderData?.buyerPromoCode,
          name: order?.orderData?.buyerName,
          address: order?.orderData?.buyerAddress,
          refundAmount: order?.orderData?.refundAmount,
        }),
        grandTotal: order?.orderData?.grandTotal,
        payoutAmount: order?.orderData?.payoutAmount,
        orderStatus: orderStatus || '',
        trackingNumber: order?.trackingNumber,
        reverseSMSATrackingNumber: order?.reverseSMSATrackingNumber || '',
        payment: new Payment(
          order?.orderData?.paymentStatus,
          order?.orderData?.paymentType
        ),
        paymentStatus: order?.orderData?.paymentStatus,
        productName: order?.orderData?.productName,
        paymentType: order?.orderData?.paymentType,
        payoutStatus: order?.payoutStatus,
        captureOrder: new CaptureOrder(order?.orderData?.captureStatus),
        paidAmount: order?.orderData?.paidAmount,
        remainingAmount: order?.orderData?.remainingAmount,
        replacedOrderId: order?.orderData?.replacedOrderId,
        replacedProductId: order?.orderData?.replacedProductId,
      });
    });

    return instanceToPlain(newOrders) as Order[];
  }

  public orderNumber: string;
  public dmOrderId: string;
  public id: string;
  public date: Date;
  public productId: string;
  public orderType: EOrderType;
  public seller: Seller;
  public buyer: Buyer;
  public grandTotal: number;
  public payoutAmount: number;
  public trackingNumber: number;
  public reverseSMSATrackingNumber: string;
  public orderStatus: IOrderStatus;
  public payment: Payment;
  public payoutStatus: string;
  public productName: string;
  public payoutType: string;
  public paymentType: string | undefined;
  public paymentStatus: string | undefined;
  public captureOrder: CaptureOrder;
  public captureTransaction: string | undefined;
  public paidAmount: string | undefined;
  public remainingAmount: string | undefined;
  public replacedOrderId?: string;
  public replacedProductId?: string;
  public issueReplacement?: boolean;
  constructor({
    orderNumber,
    dmOrderId,
    id,
    date,
    productId,
    orderType,
    seller,
    buyer,
    grandTotal,
    payoutAmount,
    trackingNumber,
    reverseSMSATrackingNumber,
    orderStatus,
    payment,
    payoutStatus,
    productName,
    payoutType,
    paymentType,
    paymentStatus,
    captureOrder,
    captureTransaction,
    paidAmount,
    remainingAmount,
    replacedOrderId,
    replacedProductId,
    issueReplacement,
  }: IOrder) {
    this.orderNumber = orderNumber;
    this.dmOrderId = dmOrderId;
    this.id = id;
    this.date = date;
    this.productId = productId;
    this.orderType = orderType;
    this.seller = seller;
    this.buyer = buyer;
    this.grandTotal = grandTotal;
    this.payoutAmount = payoutAmount;
    this.trackingNumber = trackingNumber;
    this.reverseSMSATrackingNumber = reverseSMSATrackingNumber;
    this.orderStatus = orderStatus;
    this.payment = payment;
    this.payoutStatus = payoutStatus;
    this.productName = productName;
    this.payoutType = payoutType;
    this.paymentType = paymentType;
    this.paymentStatus = paymentStatus;
    this.captureOrder = captureOrder;
    this.captureTransaction = captureTransaction;
    this.paidAmount = paidAmount;
    this.remainingAmount = remainingAmount;
    this.replacedOrderId = replacedOrderId;
    this.replacedProductId = replacedProductId;
    this.issueReplacement = issueReplacement;
  }
}

export class OrderV2 {
  static async getOrdersV2({
    submodule,
    limit,
    offset,
    search,
    statusId,
    services,
  }: {
    submodule: EOrderV2ModuleValues;
    limit: string;
    offset: string;
    search?: string;
    statusId?: string;
    services?: string;
  }): Promise<{
    orders: OrderV2[];
    paginationData: PaginationData;
  }> {
    const result = await apiClientV2.client.get(
      OrderEndpoints.ordersV2(
        submodule,
        limit,
        offset,
        search,
        statusId,
        services
      )
    );

    if (isEmpty(result))
      return {
        orders: [] as OrderV2[],
        paginationData: {} as PaginationData,
      };
    if (isEmpty(result?.data?.responseData))
      return {
        orders: [] as OrderV2[],
        paginationData: {} as PaginationData,
      };

    const statuses = await StatusGroup.getStatusGroup({
      group: StatusGroups[submodule],
    });

    const actions = await Action.getAction({ statusId });

    const orderResponse = result.data.responseData.data;

    const orders = await OrderV2.mapOrdersV2({
      orders: orderResponse,
      statuses,
      actions,
    });

    return {
      orders: instanceToPlain(orders) as OrderV2[],
      paginationData: {
        total: result.data.responseData.total,
        limit: result.data.responseData.limit,
        offset: result.data.responseData.offset,
      },
    };
  }

  static async mapOrdersV2({
    orders,
    actions,
  }: {
    orders: any[];
    statuses: StatusGroup[];
    actions: Action[];
  }) {
    return orders.map((order: any) => {
      return new OrderV2({
        orderType: order?.orderData?.orderType,
        orderNumber: order?.orderData?.orderNumber,
        dmOrderId: order?.id,
        id: order?.orderId,
        date: order?.createdAt,
        orderStatus: order?.orderData?.orderStatus,
        actions,
        updatedAt: order?.updatedAt,
        createdAt: order?.createdAt,
        disputeDate: order?.orderData?.disputeDate || '',
        deliveryDate: order?.orderData?.deliveryDate || '',
        logisticService: order?.logistic ?? 'N/A',
        shippingDate: order?.orderData?.shippingDate || '',
        payment: order?.orderData?.payment || null,
        captureOrder: order?.orderData?.captureOrder || null,
        captureTransaction: order?.orderData?.captureTransaction || '',
        seller: order?.orderData?.seller || null,
      });
    });
  }

  public actions: IAction[];
  public orderNumber: string;
  public dmOrderId: string;
  public id: string;
  public date: Date;
  public orderType: EOrderType;
  public orderStatus: string;
  public logisticService: string;
  public updatedAt: Date;
  public createdAt: Date;
  public deliveryDate: Date;
  public disputeDate: Date;
  public shippingDate: Date;
  public payment?: Payment;
  public captureOrder?: CaptureOrder;
  public captureTransaction?: string;
  public seller?: Seller;

  constructor({
    actions,
    orderNumber,
    orderStatus,
    orderType,
    date,
    dmOrderId,
    id,
    updatedAt,
    createdAt,
    logisticService,
    deliveryDate,
    disputeDate,
    shippingDate,
    payment,
  }: IOrderV2) {
    this.id = id;
    this.actions = actions;
    this.orderNumber = orderNumber;
    this.orderStatus = orderStatus;
    this.orderType = orderType;
    this.date = date;
    this.dmOrderId = dmOrderId;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.logisticService = logisticService;
    this.deliveryDate = deliveryDate;
    this.disputeDate = disputeDate;
    this.shippingDate = shippingDate;
    this.payment = payment;
  }
}

export interface IFinanceOrder {
  actions: IAction[];
  orderNumber: string;
  productId: string;
  productName: string;
  grandTotal: number;
  remainingAmount: number;
  paidAmount: number;
  trackingNumber: string;
  paymentType: string;
  dmOrderId: string;
  id: string;
  date: Date;
  orderType: EOrderType;
  orderStatus: StatusGroup;
  logisticService: string;
  updatedAt: Date;
  createdAt: Date;
  disputeDate: Date;
  deliveryDate: Date;
  shippingDate: Date;
  payment?: Payment;
  captureOrder?: CaptureOrder;
  captureTransaction?: string;
  seller?: Seller;
  isReservation: boolean;
  isFinancing: boolean;
  reservationAmount?: number;
  financingFee?: number;
}

export const EFinanceOrderModules = {
  Finance: 'finance',
} as const;

export type EFinanceOrderModule = keyof typeof EFinanceOrderModules;
export type EFinanceOrderModuleValues =
  typeof EFinanceOrderModules[EFinanceOrderModule];

export class FinanceOrder {
  static async getFinanceOrders({
    submodule,
    limit,
    offset,
    search,
    statusId,
    services,
  }: {
    submodule: EFinanceOrderModuleValues;
    limit: string;
    offset: string;
    search?: string;
    statusId?: string;
    services?: string;
  }): Promise<{
    orders: FinanceOrder[];
    paginationData: PaginationData;
  }> {
    const result = await apiClientV2.client.get(
      OrderEndpoints.financeOrders(
        submodule,
        limit,
        offset,
        search,
        statusId,
        services
      )
    );

    if (isEmpty(result))
      return {
        orders: [] as FinanceOrder[],
        paginationData: {} as PaginationData,
      };
    if (isEmpty(result?.data?.responseData))
      return {
        orders: [] as FinanceOrder[],
        paginationData: {} as PaginationData,
      };

    const statuses = await Order.getOrderStatuses();

    const actions = await Action.getAction({ statusId });

    const orderResponse = result.data.responseData.data;

    const orders = await FinanceOrder.mapFinanceOrder({
      orders: orderResponse,
      statuses,
      actions,
    });

    return {
      orders: instanceToPlain(orders) as FinanceOrder[],
      paginationData: {
        total: result.data.responseData.total,
        limit: result.data.responseData.limit,
        offset: result.data.responseData.offset,
      },
    };
  }

  static mapFinanceOrder({
    orders,
    statuses,
    actions,
  }: {
    orders: any[];
    statuses: IResponseOrderStatus[];
    actions: Action[];
  }): FinanceOrder[] {
    return orders.map((order: any) => {
      const orderStatus = statuses.find(
        (status) => status.id === order.statusId
      ) as StatusGroup;

      return new FinanceOrder({
        orderType: order?.orderData?.orderType,
        orderNumber: order?.orderData?.orderNumber,
        dmOrderId: order?.id,
        id: order?.orderId,
        date: order?.createdAt,
        orderStatus: orderStatus || 'New Order',
        actions,
        updatedAt: order?.updatedAt,
        createdAt: order?.createdAt,
        disputeDate: order?.orderData?.disputeDate || '',
        deliveryDate: order?.orderData?.deliveryDate || '',
        logisticService: order?.logistic ?? 'N/A',
        shippingDate: order?.orderData?.shippingDate || '',
        payment: order?.orderData?.payment || null,
        captureOrder: order?.orderData?.captureOrder || null,
        captureTransaction: order?.orderData?.captureTransaction || '',
        seller: order?.orderData?.seller || null,
        productId: order?.orderData?.productId,
        productName: order?.orderData?.productName,
        grandTotal: order?.orderData?.grandTotal,
        paidAmount: order?.orderData?.paidAmount,
        trackingNumber: order?.orderData?.trackingNumber,
        paymentType: order?.orderData?.paymentType,
        isReservation: order?.orderData?.isReservation || false,
        isFinancing: order?.orderData?.isFinancing || false,
        reservationAmount: order?.orderData?.reservationAmount || 0,
        financingFee: order?.orderData?.financingFee || 0,
        remainingAmount: order?.orderData?.remainingAmount || 0,
      });
    });
  }

  public actions: IAction[];
  public orderNumber: string;
  public productId: string;
  public productName: string;
  public grandTotal: number;
  public paidAmount: number;
  public remainingAmount: number;
  public trackingNumber: string;
  public paymentType: string;
  public dmOrderId: string;
  public id: string;
  public date: Date;
  public orderType: EOrderType;
  public orderStatus: StatusGroup;
  public logisticService: string;
  public updatedAt: Date;
  public createdAt: Date;
  public deliveryDate: Date;
  public disputeDate: Date;
  public shippingDate: Date;
  public payment?: Payment;
  public captureOrder?: CaptureOrder;
  public captureTransaction?: string;
  public seller?: Seller;
  public isReservation?: boolean;
  public isFinancing?: boolean;
  public paymentMethod?: string;
  public reservationAmount?: string;
  public financingFee?: string;

  constructor({
    actions,
    orderNumber,
    productId,
    productName,
    grandTotal,
    paidAmount,
    trackingNumber,
    paymentType,
    orderStatus,
    orderType,
    date,
    dmOrderId,
    id,
    updatedAt,
    createdAt,
    logisticService,
    deliveryDate,
    disputeDate,
    shippingDate,
    payment,
    isReservation,
    isFinancing,
    reservationAmount,
    financingFee,
    remainingAmount,
  }: IFinanceOrder) {
    this.id = id;
    this.actions = actions;
    this.orderNumber = orderNumber;
    this.productId = productId;
    this.productName = productName;
    this.grandTotal = grandTotal;
    this.paidAmount = paidAmount;
    this.trackingNumber = trackingNumber;
    this.isFinancing = isFinancing;
    this.isReservation = isReservation;
    this.financingFee =
      this.isFinancing && financingFee && financingFee > 0
        ? financingFee?.toString()
        : '-';
    this.reservationAmount =
      this.paidAmount > 0 ? reservationAmount?.toString() : '-';
    this.paymentType = this.isFinancing ? 'Financing' : 'Cash';
    this.remainingAmount = remainingAmount;
    this.orderStatus = orderStatus;
    this.orderType = orderType;
    this.date = date;
    this.dmOrderId = dmOrderId;
    this.updatedAt = updatedAt;
    this.createdAt = createdAt;
    this.logisticService = logisticService;
    this.deliveryDate = deliveryDate;
    this.disputeDate = disputeDate;
    this.shippingDate = shippingDate;
    this.payment = payment;
    this.paymentMethod = paymentType;
  }
}

export interface IOrderV3 {
  actions: IAction[];
  orderId: string;
  orderNumber: string;
  date: Date;
  orderType: EOrderType;
  logisticService: string;
  operatingModel: string;
  sellerType: string;
  sellerCategory: string;
  orderStatus: string;
  dateCreatedAt: Date;
}

export class OrderV3 {
  static async getOrdersV3({
    submodule,
    limit,
    offset,
    search,
    statusId,
    startDate,
    endDate,
    operatingModel,
    orderType,
    sellerCategory,
    sellerType,
    orderStatus,
    disputeStatus,
  }: {
    submodule: EOrderV3ModuleValues;
    limit: string;
    offset: string;
    search?: string;
    statusId?: string;
    startDate?: string;
    endDate?: string;
    operatingModel?: string;
    orderType?: string;
    sellerCategory?: string;
    sellerType?: string;
    orderStatus?: string;
    disputeStatus?: string;
  }): Promise<{
    orders: OrderV3[];
    paginationData: PaginationDataV3;
  }> {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.ordersV3(
        submodule,
        limit,
        offset,
        search,
        statusId,
        startDate,
        endDate,
        operatingModel,
        orderType,
        sellerCategory,
        sellerType,
        orderStatus,
        disputeStatus
      )
    );

    if (isEmpty(result)) {
      return {
        orders: [] as OrderV3[],
        paginationData: {} as PaginationData,
      };
    }

    const orders = await OrderV3.mapOrdersV3({
      orders: result.data.orders,
      actions: [],
    });

    return {
      orders: instanceToPlain(orders) as OrderV3[],
      paginationData: {
        total: result.data.count,
      },
    };
  }

  static async getOrderFilterStatusesV3(submodule: string) {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.orderFilterStatusesV3(submodule)
    );

    return result.data;
  }

  static async getInvoiceDetails(orderId: string, page: string, size: string) {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.invoiceDetails(orderId, page, size)
    );

    return result.data;
  }

  static async getFinanceReasons() {
    const result = await apiGatewayClient.client.get(
      OrderEndpoints.financeReasons()
    );

    return result.data;
  }

  static async changeFinanceReason(dmOrderId: string, financeReason: string) {
    const result = await apiGatewayClient.client.post(
      OrderEndpoints.financeReasons(),
      {
        id: dmOrderId,
        payoutPendingReason: financeReason,
      }
    );

    return result.data;
  }

  static async mapOrdersV3({
    orders,
    actions,
  }: {
    orders: any[];
    actions: Action[];
  }) {
    return orders.map((order: any) => {
      return new OrderV3({
        actions,
        orderId: order?.orderId,
        orderNumber: order?.orderData?.orderNumber,
        date: order?.updatedAt,
        dateCreatedAt: order?.orderData?.createdAt,
        orderType: order?.orderData?.orderType,
        logisticService: order?.logistic ?? 'N/A',
        operatingModel: order?.userData?.operatingModel ?? 'N/A',
        sellerType: order?.userData?.sellerType ?? 'N/A',
        sellerCategory: order?.userData?.sellerCategory ?? 'N/A',
        orderStatus: order?.orderData?.orderStatus ?? 'N/A',
        disputeDate: order?.orderData?.disputeDate ?? '',
        deliveryDate: order?.orderData?.deliveryDate ?? '',
        disputeStatus: order?.disputeStatus ?? 'N/A',
      });
    });
  }

  public actions: IAction[];
  public orderId: string;
  public orderNumber: string;
  public date: Date;
  public dateCreatedAt: Date;
  public orderType: EOrderType;
  public logisticService: string;
  public operatingModel: string;
  public sellerType: string;
  public sellerCategory: string;
  public orderStatus: string;
  public disputeDate: Date;
  public deliveryDate: Date;
  public disputeStatus: string;

  constructor({
    actions,
    orderId,
    orderNumber,
    date,
    dateCreatedAt,
    orderType,
    logisticService,
    operatingModel,
    sellerType,
    sellerCategory,
    orderStatus,
    disputeDate,
    deliveryDate,
    disputeStatus,
  }: IOrderV3) {
    this.actions = actions;
    this.orderId = orderId;
    this.orderNumber = orderNumber;
    this.date = date;
    this.dateCreatedAt = dateCreatedAt;
    this.orderType = orderType;
    this.logisticService = logisticService;
    this.operatingModel = operatingModel;
    this.sellerType = sellerType;
    this.sellerCategory = sellerCategory;
    this.orderStatus = orderStatus;
    this.disputeDate = disputeDate;
    this.deliveryDate = deliveryDate;
    this.disputeStatus = disputeStatus;
  }
}
