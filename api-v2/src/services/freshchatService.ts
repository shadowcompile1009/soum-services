import { logger } from '@sentry/utils';
import config from 'config';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { sendOutboundMessage } from '../libs/freshchat/services';
import { getSecretData } from '../libs/vault';
import { WhatsAppMsg } from '../models/WhatsAppMsg';
import { OrderRepository } from '../repositories/orderRepository';
const freshChatConfig: { [key: string]: string } = config.get('freshchat');

export type SendOutboundMessageType = {
  readonly templateName: string;
  readonly phoneNumber: string;
  [propName: string]: any;
};
@Service()
export class FreshchatService {
  constructor(
    public orderRepository: OrderRepository,
    public error: ErrorResponseDto
  ) {}
  createTemplate(params: SendOutboundMessageType) {
    const template = {
      from: {
        phone_number: freshChatConfig.sender,
      },
      provider: 'whatsapp',
      to: [
        {
          phone_number: params.phoneNumber,
        },
      ],
      data: {
        message_template: {
          storage: 'conversation',
          template_name: params.templateName,
          namespace: freshChatConfig.namespace,
          language: {
            policy: freshChatConfig.lang_policy,
            code: freshChatConfig.lang,
          },
          rich_template_data: {},
        },
      },
    };

    switch (params.templateName) {
      case process.env.FRESHCAT_TEMPLATE_SUCCESSFUL_CAR_RESERVATION_FINANCING:
        template.data.message_template.rich_template_data = {};
        break;
      case process.env.FRESHCHAT_TEMPLATE_SHIPPING_INFO_V2:
        template.data.message_template.rich_template_data = {
          header: {
            type: 'image',
            media_url: process.env.FRESHCHAT_OPTIMIZED_IMAGE_SHIPPING_URL,
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V4:
        template.data.message_template.rich_template_data = {
          header: {
            type: 'image',
            media_url: process.env.FRESHCHAT_OPTIMIZED_IMAGE_SELLING_URL,
          },
          body: {
            params: [
              {
                data: params.productName,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_CONFIRMED_AVAILABILITY_V1:
        template.data.message_template.rich_template_data = {
          header: {
            type: 'image',
            media_url: process.env.FRESHCHAT_OPTIMIZED_IMAGE_SHIPPING_URL,
          },
          body: {
            params: [
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_CONFIRMED_UNAVAILABILITY_V1:
        template.data.message_template.rich_template_data = {};
        break;
      case process.env.FRESHCHAT_IN_TRANSIT_V1:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_ITEM_DELIVERED_V1:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_BUYER_PROCESSING:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_BUYER_PURCHASE:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.sellerShippingTime,
              },
              {
                data: params.timeForDelivery,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
              {
                data: params.availabilityConfirmationTime,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_BUYER_EXPRESS_DELIVERY:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.timeForDelivery,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_BUYER_PURCHASE_UAE:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V2:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
              {
                data: params.pdfLink,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V3:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.orderNumber,
              },
              {
                data: params.pdfLink,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_PICKUP:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.orderNumber,
              },
            ],
          },
        };
        break;
      case process.env
        .FRESHCHAT_TEMPLATE_SELLER_PROCESSING_WHEN_WALLET_PAYOUT_ON:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.productId,
              },
              {
                data: params.orderNumber,
              },
              {
                data: params.pdfLink,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_BUYER_DISPUTE:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.orderId,
              },
              {
                data: params.productId,
              },
              {
                data: params.productName,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_FIRST_PUBLISHED_V2:
        template.data.message_template.rich_template_data = {
          header: {
            type: 'image',
            media_url: process.env.FRESHCHAT_OPTIMIZED_IMAGE_POST_SALE_URL,
          },
          body: {
            params: [
              {
                data: params.productName,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_AWAITING_SELLER_TO_SHIP:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_DELETION_NUDGE_V3:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.sellerPayout,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_DELETION_NUDGE_MODEL_NAME:
      case process.env.FRESHCHAT_TEMPLATE_POST_RESERVATION:
      case process.env.FRESHCHAT_TEMPLATE_BUYER_CAR_PLATES:
      case process.env.FRESHCHAT_TEMPLATE_SELLER_CAR_PLATES:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_PRICE_NUDGE_MESSAGE:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.productName,
              },
              {
                data: params.sellPrice,
              },
              {
                data: params.recommendedPrice,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_SELLER_REMINDER:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.modelName,
              },
              {
                data: params.buyerName,
              },
              {
                data: params.question,
              },
            ],
          },
          button: {
            subType: 'url',
            params: [
              {
                data: params.questionId,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_SELLER_SPP_PENDING_QUESTIONS:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.numberOfPendingQuestions,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_IDEAL_LISTING:
      case process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_NOT_IDEAL_LISTING:
      case process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_HIGH_SCORE:
      case process.env.FRESHCHAT_TEMPLATE_SELLER_ENGAGEMENT_BAD_IMAGES:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.sellerName,
              },
              {
                data: params.productName,
              },
              {
                data: params.sellPrice,
              },
              {
                data: params.suggestedSellPrice,
              },
              {
                data: params.productViews,
              },
            ],
          },
        };
        break;
      case process.env.FRESHCHAT_TEMPLATE_FIRST_PUBLISHED:
      case process.env.FRESHCHAT_TEMPLATE_SELLER_UNRESPONSIVE_MESSAGE:
      case process.env.FRESHCHAT_TEMPLATE_WILL_NOT_FULFILL_DEACTIVATION:
        return template;
      case process.env.FRESHCHAT_TEMPLATE_RESERVATION_COMPLETE_PAYMENT:
        template.data.message_template.rich_template_data = {
          body: {
            params: [
              {
                data: params.remainingAmount,
              },
            ],
          },
        };
        break;
      default:
        template.data.message_template.rich_template_data = {
          body: {
            params: params,
          },
        };
        break;
    }
    return template;
  }

  async sendOutboundMsg(
    msg: SendOutboundMessageType,
    isNewMsg: boolean = true
  ) {
    return new Promise(async (resolve, reject) => {
      try {
        const skipToSendWA = await this.limitToSendWA(msg);
        if (skipToSendWA) {
          return resolve('Skip to send outbound message');
        }
        let sendMessageResult: any;
        if (
          Constants.VISION_API.SAUDI_PHONE_NUMBER_REGEX.test(msg.phoneNumber)
        ) {
          const template: any = this.createTemplate(msg);
          sendMessageResult = await sendOutboundMessage(template);
        }
        if (isNewMsg) {
          const waMsg = new WhatsAppMsg({
            ...msg,
            requestId: sendMessageResult?.request_id || '',
            outboundMessageId: sendMessageResult?.message_id || '',
            status: sendMessageResult?.status || 'FAILED',
            lang: 'ar',
          });
          waMsg.save();
        }
        resolve('Sending outbound message successfully');
      } catch (exception) {
        logger.error(`${exception}`);
        reject('Failed to send outbound msg');
      }
    });
  }

  async limitToSendWA(params: SendOutboundMessageType): Promise<boolean> {
    if (!params?.categoryId) return false;
    let skipToSendWA = false;
    switch (params.templateName) {
      case process.env.FRESHCHAT_TEMPLATE_FIRST_PUBLISHED_V2:
      case process.env.FRESHCHAT_TEMPLATE_SHIPPING_INFO_V2:
      case process.env.FRESHCHAT_TEMPLATE_SELLER_PROCESSING_V4:
      case process.env.FRESHCHAT_CONFIRMED_AVAILABILITY_V1:
      case process.env.FRESHCHAT_CONFIRMED_UNAVAILABILITY_V1: {
        const vaultSettings = await getSecretData('/secret/data/apiv2');
        const limitWASetting = JSON.parse(vaultSettings['limitWA'] || '[]');
        if (
          limitWASetting.find(
            (categoryId: string) =>
              categoryId === params?.categoryId?.toString()
          )
        ) {
          skipToSendWA = true;
        }
        break;
      }
      default:
        skipToSendWA = false;
        break;
    }
    return skipToSendWA;
  }
}
