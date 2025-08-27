import { apiGatewayClient } from '@/api';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { instanceToPlain } from 'class-transformer';

export enum ConsignmentStatus {
  NEW = 'New',
  RECEIVED = 'Received',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CLOSED = 'Closed',
  CLOSED_FULFILLED = 'Closed-fulfilled',
  CLOSED_UNFULFILLED = 'Closed-unfulfilled',
  PAYOUT_TO_SELLER = 'Payout-to-seller',
  PAYOUT_PROCESSING = 'Payout-processing',
  TRANSFERRED = 'Transferred',
}

export const SUBMODULE_UPFRONT_QUERY_KEYS_MAP = {
  [ConsignmentStatus.NEW]: QUERY_KEYS.newUpfront,
  [ConsignmentStatus.APPROVED]: QUERY_KEYS.approvedUpfront,
  [ConsignmentStatus.CLOSED]: QUERY_KEYS.closeUpfront,
  [ConsignmentStatus.CLOSED_FULFILLED]: QUERY_KEYS.closeFulfilledUpfront,
  [ConsignmentStatus.CLOSED_UNFULFILLED]: QUERY_KEYS.closeUnfulfilledUpfront,
  [ConsignmentStatus.REJECTED]: QUERY_KEYS.rejectedUpfront,
  [ConsignmentStatus.PAYOUT_TO_SELLER]: QUERY_KEYS.payoutToSellerUpfront,
  [ConsignmentStatus.TRANSFERRED]: QUERY_KEYS.transferredUpfront,
  [ConsignmentStatus.RECEIVED]: QUERY_KEYS.recievedUpfront,
};

export interface IUpfrontsResponse {
  id: string;
  product: string;
  status: string;
  userId: string;
  payoutAmount: number;
  orderNumber: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber: string;
  shippingLabel: string;
}

export const UpfrontsEndpoints = {
  upfrontsList(
    submodule: string,
    limit: string,
    offset: string,
    search?: string
  ) {
    const params = new URLSearchParams({
      limit,
      offset,
    });

    if (search) {
      params.append('search', search);
    }

    return `product/adm/consignment?status=${encodeURIComponent(
      submodule
    )}&${params.toString()}`;
  },
  changeUpfrontStatus(orderId: string) {
    return `product/adm/consignment/${orderId}/status`;
  },
  payoutToSeller(orderId: string) {
    return `product/adm/consignment/${orderId}/payout`;
  },
  payoutToSellerDetails(orderId: string) {
    return `product/adm/consignment/${orderId}/payout/details`;
  },
};

export class Upfronts {
  static async getUpfrontsList({
    submodule,
    limit,
    offset,
    search,
  }: {
    submodule: string;
    limit: string;
    offset: string;
    search?: string;
  }) {
    const endPoint = UpfrontsEndpoints.upfrontsList(
      submodule,
      limit,
      offset,
      search
    );
    const result = await apiGatewayClient.client.get(endPoint);
    return result.data;
  }

  static async changeUpfrontStatus(orderId: string, status: string) {
    const result = await apiGatewayClient.client.patch(
      UpfrontsEndpoints.changeUpfrontStatus(orderId),
      { status: status }
    );

    return result.data.responseData;
  }

  static mapUpfronts(upfronts: IUpfrontsResponse[] = []): Upfronts[] {
    const mappedUpfronts = upfronts.map(
      (upfront) =>
        new Upfronts({
          id: upfront?.id,
          product: upfront?.product,
          status: upfront?.status,
          userId: upfront?.userId,
          payoutAmount: upfront?.payoutAmount,
          orderNumber: upfront?.orderNumber,
          createdAt: upfront?.createdAt,
          updatedAt: upfront?.updatedAt,
          trackingNumber: upfront?.trackingNumber,
          shippingLabel: upfront?.shippingLabel,
        })
    );

    return instanceToPlain(mappedUpfronts) as Upfronts[];
  }

  static async payoutToSeller(orderId: string,payoutAmount:number): Promise<void> {

    await apiGatewayClient.client.post(
      UpfrontsEndpoints.payoutToSeller(orderId),{
        payoutAmount
      }
    );
  }

  static async payoutToSellerDetails(orderId: string) {
    const result = await apiGatewayClient.client.get(
      UpfrontsEndpoints.payoutToSellerDetails(orderId)
    );
    return result.data;
  }

  static async checkPayoutStatus(orderId: string): Promise<any> {
    const response = await apiGatewayClient.client.get(
      `product/adm/consignment/${orderId}/payout/status`
    );
    return response.data;
  }

  public id: string;
  public product: string;
  public status: string;
  public userId: string;
  public payoutAmount: number;
  public orderNumber: string;
  public createdAt: string;
  public updatedAt: string;
  public trackingNumber: string;
  public shippingLabel: string;

  constructor({
    id,
    product,
    status,
    userId,
    payoutAmount,
    orderNumber,
    createdAt,
    updatedAt,
    trackingNumber,
    shippingLabel,
  }: IUpfrontsResponse) {
    this.id = id;
    this.product = product;
    this.status = status;
    this.userId = userId;
    this.payoutAmount = payoutAmount;
    this.orderNumber = orderNumber;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.trackingNumber = trackingNumber;
    this.shippingLabel = shippingLabel;
  }
}
