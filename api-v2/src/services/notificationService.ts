import { BatchResponse, Message, TokenMessage } from 'firebase-admin/messaging';
import _isEmpty from 'lodash/isEmpty';
import { ObjectId } from 'mongodb';
import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import {
  composeMessage,
  PushNotificationMessageInput,
  sendMessageInBatchToDevices,
} from '../libs/firebase';
import { DeviceTokenDocument, DeviceTokenInput } from '../models/DeviceToken';
import { NotificationWithPushTokens } from '../models/Notification';
import { NotificationRepository } from '../repositories/notificationRepository';
import {
  formatCurrency,
  getObjectId,
  trimAndRemoveLineBreaks,
} from '../util/common';
@Service()
export class NotificationService {
  @Inject()
  notificationRepository: NotificationRepository;

  async getAllDeviceTokens(page: number, size: number) {
    try {
      return await this.notificationRepository.getAllDeviceTokens(page, size);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.DEVICE_TOKEN_NOT_FOUND,
        exception.message
      );
    }
  }

  async getUserDeviceTokens(
    userId: string
  ): Promise<[boolean, string | DeviceTokenDocument[]]> {
    try {
      return await this.notificationRepository.getUserDeviceTokens(userId);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.DEVICE_TOKEN_NOT_FOUND,
        exception.message
      );
    }
  }

  async getDeviceTokensOfListUsers(
    userIds: string[]
  ): Promise<[boolean, string | DeviceTokenDocument[]]> {
    try {
      return await this.notificationRepository.getDeviceTokensOfListUsers(
        userIds
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.DEVICE_TOKEN_NOT_FOUND,
        exception.message
      );
    }
  }

  async addDeviceToken(obj: DeviceTokenInput) {
    try {
      return await this.notificationRepository.addDeviceToken(obj);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ADD_DEVICE_TOKEN,
          exception.message
        );
      }
    }
  }

  async updateDeviceToken(
    obj: DeviceTokenInput
  ): Promise<[boolean, DeviceTokenDocument | string]> {
    try {
      const [error, result] =
        await this.notificationRepository.updateDeviceToken(obj);
      return [error, result];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_SETTING,
        exception.message
      );
    }
  }

  async removeDeviceToken(fcmToken: string, userId: string) {
    try {
      return await this.notificationRepository.removeDeviceToken(
        fcmToken,
        userId
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
          exception.message
        );
    }
  }

  async removeUserDeviceToken(userId: string) {
    try {
      return await this.notificationRepository.removeUserDeviceToken(userId);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_REMOVE_DEVICE_TOKEN,
          exception.message
        );
    }
  }

  generateMessageContent(data: NotificationWithPushTokens, lang: string) {
    // We will think a better solution to compose message later,  for now use switch
    const productName = (
      lang === 'ar'
        ? // eslint-disable-next-line max-len
          `${trimAndRemoveLineBreaks(
            data.productData.brandNameAr
          )} ${trimAndRemoveLineBreaks(data.productData.modelNameAr)}`
        : `${trimAndRemoveLineBreaks(
            data.productData.brandName
          )} ${trimAndRemoveLineBreaks(data.productData.modelName)}`
    ).trim();
    if (lang === 'ar') {
      switch (data.activityType) {
        case 'BuyerBidAccepted':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'اكمل عملية الشراء الآن!',
            `تم قبول سومتك لمنتج ${productName} بسعر ${formatCurrency(
              data.productData.bidValue
            )}`,
            'MyBidsScreen',
          ];
        case 'BuyerBidRejected':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'ادخل سومة أعلى!',
            // eslint-disable-next-line max-len
            `سومتك للمنتج ${productName} بالسعر ${formatCurrency(
              data.productData.bidValue
            )} غير مناسبة للبائع، مازال البائع يبحث عن عرض اعلى.`,
            'MyBidsScreen',
          ];
        case 'Bidding':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'اقبل أو ارفض السومة',
            `قام شخص آخر بوضع سومة أعلى من سومتك على المنتج ${productName} `,
            'MyProductsScreen',
          ];
        case 'AskQuestion':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'فضلاً أجب على السؤال!',
            `لقد تلقيت سؤال جديد عن المنتج ${productName}`,
            'ProductDetailsScreen',
          ];
        case 'AnswerQuestion':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            '',
            `قام بائع المنتج ${productName} بالرد على سؤالك`,
            'ProductDetailsScreen',
          ];
        case 'ProductExpired':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'أعرض المنتج مرة أخرى!',
            `مدة صلاحية عرض منتجك ${productName} انتهت.`,
            'MyProductsScreen',
          ];
        case 'BuyerPaymentCompleted':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            '',
            `تم بيع منتجك ${productName}. سيتم التواصل معك لاستلام منتجك.`,
            'MyOrdersScreen',
          ];
      }
    } else {
      switch (data.activityType) {
        case 'BuyerBidAccepted':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'Complete the purchase now!',
            `Your ${formatCurrency(
              data.productData.bidValue,
              'en'
            )} bid on ${productName} is accepted.`,
            'MyBidsScreen',
          ];
        case 'BuyerBidRejected':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'Place a new bid',
            `Your ${formatCurrency(
              data.productData.bidValue,
              'en'
            )} bid on ${productName} is rejected.`,
            'MyBidsScreen',
          ];
        case 'Bidding':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'Accept or reject the bid',
            `Someone placed a ${formatCurrency(
              data.productData.bidValue,
              'en'
            )} bid on your ${productName}`,
            'MyProductsScreen',
          ];
        case 'AskQuestion':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'Answer the question',
            `You received a new question about your ${productName}`,
            'ProductDetailsScreen',
          ];
        case 'AnswerQuestion':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            '',
            `The seller answered your question about ${productName}`,
            'ProductDetailsScreen',
          ];
        case 'ProductExpired':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            'Renew',
            `Your ${productName} listing has expired.`,
            'MyProductsScreen',
          ];
        case 'BuyerPaymentCompleted':
          if (!productName) {
            return ['', '', ''];
          }
          return [
            '',
            `Your ${productName} got sold. The team will contact you to pick it up.`,
            'ProductDetailsScreen',
          ];
      }
    }
  }

  async getNotificationData(
    activityTypes?: string[] | string,
    page?: number,
    pageSize?: number
  ) {
    try {
      return await this.notificationRepository.getNotificationList(
        activityTypes,
        page,
        pageSize
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.NOTIFICATION_NOT_FOUND,
        exception.message
      );
    }
  }

  async getNotificationLog(page: number, size: number) {
    try {
      return await this.notificationRepository.getAllNotificationLogs(
        page,
        size
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.NOTIFICATION_LOG_FAILURE,
        exception.message
      );
    }
  }

  checkDuplicate(addingMessage: Message, messages: Message[]): boolean {
    return (
      messages.findIndex(
        t =>
          t.data?.type === addingMessage.data?.type &&
          t.data?.id === addingMessage.data?.id &&
          t.notification?.body === addingMessage.notification.body &&
          (t as TokenMessage).token === (addingMessage as TokenMessage).token
      ) !== -1
    );
  }

  generateListPushMessage(
    notificationList: NotificationWithPushTokens[]
  ): [Message[], ObjectId[], ObjectId[]] {
    const messages: Message[] = []; // 500 messages per time
    const proceedingIds: ObjectId[] = [];
    const sentPushIds: ObjectId[] = [];
    notificationList.forEach((item: NotificationWithPushTokens) => {
      if (item.push_tokens.length > 0) {
        const [title, body, screenPage] = this.generateMessageContent(
          item,
          item.push_tokens[0]?.lang || 'ar'
        );
        if (!body) return;

        item.push_tokens.forEach(token => {
          const pushMessInput: PushNotificationMessageInput = {
            title: String(title),
            body: String(body),
            screenPage: String(screenPage),
            fcmToken: token.fcm_token,
          };
          const data = {
            type: String(screenPage),
            ...(item.productData.productId && {
              id: String(getObjectId(item.productData.productId)),
            }),
            title: String(title),
            body: String(body),
          };
          const fbMessage = composeMessage(pushMessInput, data);
          if (fbMessage && !this.checkDuplicate(fbMessage, messages)) {
            messages.push(fbMessage);
            sentPushIds.push(getObjectId(item._id));
          } else {
            proceedingIds.push(getObjectId(item._id));
          }
        });
      } else {
        proceedingIds.push(getObjectId(item._id));
      }
    });

    return [messages, sentPushIds, proceedingIds];
  }

  async sendNotificationMessage(
    activityTypes: string[],
    page: number,
    size: number
  ): Promise<[boolean, BatchResponse | NotificationWithPushTokens[] | string]> {
    try {
      const [error, notificationList] =
        await this.notificationRepository.getNotificationList(
          activityTypes,
          page,
          size
        );
      if (error) {
        return [error, notificationList];
      }

      const [messages, sentPushIds, proceedingIds] =
        this.generateListPushMessage(
          notificationList as NotificationWithPushTokens[]
        );

      // Mark as notification sent
      await this.notificationRepository.markNotificationProceeded(
        proceedingIds
      );
      await this.notificationRepository.markNotificationSent(sentPushIds);

      if (_isEmpty(messages)) {
        return [false, notificationList];
      }
      const response: BatchResponse = await sendMessageInBatchToDevices(
        messages
      );
      // Save this data, later, we can view how many messages sent
      await this.notificationRepository.saveNotificationLogs(
        notificationList,
        messages,
        response,
        activityTypes
      );

      return [false, response];
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      else
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_SEND_PUSH_MESSAGE,
          exception.message
        );
    }
  }

  async deleteNotificationLog(id: string = 'all'): Promise<[boolean, string]> {
    try {
      await this.notificationRepository.deleteNotificationLogs(id);
      return [false, 'Delete Notification log successful'];
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.NOTIFICATION_NOT_FOUND,
        exception.message
      );
    }
  }
}
