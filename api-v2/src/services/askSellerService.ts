import moment from 'moment';
import Container, { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { AskSellerRepository } from '../repositories/askSellerRepository';
import { VariantRepository } from '../repositories/variantRepository';
import { WhatsAppMsgRepository } from '../repositories/whatsAppMsgRepository';
import { AskSellerType } from '../enums/AskSeller';
import { ProductService } from './productService';
import { SellerUserType } from '../grpc/proto/commission/sellerType.enum';

import { FreshchatService } from './freshchatService';

enum DisplayNotificationToSendReminderEnum {
  CANT_ASK = 'cant_ask',
  CAN_ASK = 'can_ask',
  ALREADY_ASKED = 'already_asked',
}
@Service()
export class AskSellerService {
  productService: ProductService;
  constructor(
    public askSellerRepository: AskSellerRepository,
    public variantRepository: VariantRepository,
    public error: ErrorResponseDto,
    public whatsAppMsgRepository: WhatsAppMsgRepository,
    public freshchatService: FreshchatService
  ) {
    this.productService = Container.get(ProductService);
  }
  async getAskSeller(
    page: number,
    size: number,
    type?: string,
    sellerTypeBoolean?: boolean,
    isAnswered?: boolean
  ) {
    try {
      const [err, data] = await this.askSellerRepository.getAskSeller(
        page,
        size,
        type,
        sellerTypeBoolean,
        isAnswered
      );

      if (err) {
        throw err;
      }

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
          exception.message
        );
      }
    }
  }

  async deleteQuestion(questionID: string, reason: string) {
    try {
      const [err, data] = await this.askSellerRepository.deleteQuestion(
        questionID,
        reason
      );

      if (err) {
        throw err;
      }

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
          exception.message
        );
      }
    }
  }

  async countPendingQuestionByUserID(userID: string, productId?: string) {
    try {
      const [err, data] =
        await this.askSellerRepository.countPendingQuestionByUserID(
          userID,
          productId
        );

      if (err) {
        throw err;
      }

      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_GET_PENDING_QUESTIONS,
          exception.message
        );
      }
    }
  }

  async updateAnswerByQuestionID(questionID: string, answer: string) {
    try {
      const [err, data] =
        await this.askSellerRepository.updateAnswerByQuestionID(
          questionID,
          answer
        );
      if (err) {
        throw err;
      }
      return data;
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAIL_TO_UPDATE_ASK_SELLER
      );
    }
  }

  async getQuestionByUserId(
    userId: string,
    page: number,
    size: number,
    type: string = AskSellerType.BUYER_QUESTIONS,
    productID?: string
  ) {
    try {
      const [err, data] = await this.askSellerRepository.getQuestionsWithType(
        userId,
        page,
        size,
        type,
        productID
      );

      if (err) {
        throw err;
      }

      const result = await Promise.all(
        data?.result?.map(async (item: any) => {
          let variantWithAttributes: any = null;
          if (item.variant_id) {
            const vResult =
              await this.variantRepository.getVarientWithAttributes(
                item.variant_id
              );

            variantWithAttributes = vResult[1]?.result;
          }

          const { userType } = await this.productService.getSellerUserType(
            item.sellerId
          );
          const hours = moment().diff(
            moment(item.questionCreatedDate),
            'hours'
          );
          const sellerReceivedReminderForAProductAskSeller =
            await this.whatsAppMsgRepository.sellerReceivedReminderForAProductAskSeller(
              item.sellerId,
              item.product_id,
              userId
            );

          let displayNotificationToSendReminder =
            DisplayNotificationToSendReminderEnum.CANT_ASK;
          if (sellerReceivedReminderForAProductAskSeller) {
            displayNotificationToSendReminder =
              DisplayNotificationToSendReminderEnum.ALREADY_ASKED;
          } else if (
            userType === SellerUserType.INDIVIDUAL_SELLER &&
            !item.answer &&
            hours >= 24
          ) {
            displayNotificationToSendReminder =
              DisplayNotificationToSendReminderEnum.CAN_ASK;
          }

          return {
            ...item,
            ...{ variant: variantWithAttributes },
            displayNotificationToSendReminder,
          };
        })
      );

      return {
        code: data.code,
        message: data.message,
        result: result,
      };
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_GET_PENDING_QUESTIONS,
          exception.message
        );
      }
    }
  }

  async sendReminderNotification(productId: string, askSellerID: string) {
    try {
      const [askSellerError, askSellerResponse] =
        await this.askSellerRepository.getAskSellerDetailsForReminder(
          askSellerID
        );

      if (askSellerError) {
        throw new ErrorResponseDto(
          askSellerResponse.code,
          Constants.ERROR_TYPE.API,
          askSellerResponse.message,
          askSellerResponse.result
        );
      }
      const askSellerObject = askSellerResponse.result;

      const sellerReceivedReminderForAProductAskSeller =
        await this.whatsAppMsgRepository.sellerReceivedReminderForAProductAskSeller(
          askSellerObject.sellerId,
          productId,
          askSellerObject.questionerId
        );
      if (sellerReceivedReminderForAProductAskSeller) {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.SELLER_ALREADY_RECEIVED_MESSAGE_FOR_PRODUCT,
          Constants.MESSAGE.SELLER_ALREADY_RECEIVED_MESSAGE_FOR_PRODUCT
        );
      }
      await this.freshchatService.sendOutboundMsg({
        templateName: process.env.FRESHCHAT_SELLER_REMINDER,
        phoneNumber: `+${askSellerObject.sellerCountryCode}${askSellerObject.sellerPhone}`,
        userId: askSellerObject.sellerId,
        productId: productId,
        question: askSellerObject.question,
        modelName: askSellerObject.productName,
        buyerName: askSellerObject.buyerName,
        questionId: askSellerID,
        senderId: askSellerObject.questionerId,
      });
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        throw exception;
      } else {
        throw new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAIL_TO_GET_PENDING_QUESTIONS,
          exception.message
        );
      }
    }
  }
}
