import { instanceToPlain } from 'class-transformer';

import { apiClientV2 } from '@/api/client';
import { IOrderStatus } from '@/models/Order';

export enum EWhatsAppMessageStatuses {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
  Read = 'Read',
  Accepted = 'Accepted',
  Sent = 'Sent',
  Inprogress = 'In progress',
  Delivered = 'Delivered',
}

export const OrderedWhatsAppMessageStatuses = [
  EWhatsAppMessageStatuses.Pending,
  EWhatsAppMessageStatuses.Success,
  EWhatsAppMessageStatuses.Failed,
  EWhatsAppMessageStatuses.Read,
  EWhatsAppMessageStatuses.Accepted,
  EWhatsAppMessageStatuses.Sent,
  EWhatsAppMessageStatuses.Inprogress,
  EWhatsAppMessageStatuses.Delivered,
];

const messagesStatusesMap: Record<string, EWhatsAppMessageStatuses> = {
  READ: EWhatsAppMessageStatuses.Read,
  PENDING: EWhatsAppMessageStatuses.Pending,
  SUCCESSS: EWhatsAppMessageStatuses.Success,
  FAILED: EWhatsAppMessageStatuses.Failed,
  ACCEPTED: EWhatsAppMessageStatuses.Accepted,
  SENT: EWhatsAppMessageStatuses.Sent,
  IN_PROGRESS: EWhatsAppMessageStatuses.Inprogress,
  DELIVERED: EWhatsAppMessageStatuses.Delivered,
};

interface WhatsAppMessage {
  templateName: string;
  status: EWhatsAppMessageStatuses;
  date: Date;
}

interface IResponseProcessing {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
}
interface IReponseWhatsAppMessage {
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
  statusId: string;
  orderNumber: string;
  seller_processing: IResponseProcessing;
  buyer_processing: IResponseProcessing;
}

interface IMessage {
  orderNumber: string;
  date: Date;
  orderStatus: IOrderStatus;
  buyerMessages: WhatsAppMessage;
  sellerMessages: WhatsAppMessage;
}

export const MessageEndpoints = {
  processingMessages(limit: string, offset: string) {
    return `rest/api/v1/dm-orders/whatsapp-msgs?limit=${limit}&offset=${offset}`;
  },
};

export class Message {
  static async getProcessingMessages({
    limit,
    offset,
  }: {
    limit: string;
    offset: string;
  }) {
    const result = await apiClientV2.client.get(
      MessageEndpoints.processingMessages(limit, offset)
    );
    return result.data.responseData;
  }

  static mapMessages(
    messages: IReponseWhatsAppMessage[] = [],
    statuses: IOrderStatus[] = []
  ) {
    const result = messages.map((message) => {
      const orderStatus = statuses.find(
        (status) => message.statusId === status.id
      )!;
      return new Message({
        orderNumber: message?.orderNumber,
        orderStatus: orderStatus,
        date: message?.createdAt,
        buyerMessages: {
          templateName: 'buyer_processing',
          status: messagesStatusesMap[message?.buyer_processing?.status],
          date: message?.buyer_processing?.updatedAt,
        },
        sellerMessages: {
          templateName: 'seller_processing',
          status: messagesStatusesMap[message?.seller_processing?.status],
          date: message?.seller_processing?.updatedAt,
        },
      });
    });

    return instanceToPlain(result) as Message[];
  }

  public orderNumber: string;
  public date: Date;
  public orderStatus: IOrderStatus;
  public buyerMessages: WhatsAppMessage;
  public sellerMessages: WhatsAppMessage;

  constructor({
    orderNumber,
    orderStatus,
    date,
    buyerMessages,
    sellerMessages,
  }: IMessage) {
    this.orderNumber = orderNumber;
    this.orderStatus = orderStatus;
    this.date = date;
    this.buyerMessages = buyerMessages;
    this.sellerMessages = sellerMessages;
  }
}
