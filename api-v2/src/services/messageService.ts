import { Inject, Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { MessageRepository } from '../repositories/messageRepository';

@Service()
export class MessageService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  messageRepository: MessageRepository;

  async getMessage(language: string, client_type: string, key: string) {
    try {
      if (!language || !client_type || !key) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      return await this.messageRepository.getMessage(
        language,
        client_type,
        key
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_MESSAGE
      );
    }
  }

  async updateMessage(
    language: string,
    client_type: string,
    key: string,
    value: string
  ) {
    try {
      if (!language || !client_type || !key) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      return await this.messageRepository.updateMessage(
        language,
        client_type,
        key,
        value
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_UPDATE_MESSAGE
      );
    }
  }

  async createMessage(client_type: string, value: string) {
    try {
      if (!client_type || !value) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.MISSING_REQUIRED_FIELDS;
        throw this.error;
      }
      return await this.messageRepository.createMessage(client_type, value);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_CREATE_MESSAGE
      );
    }
  }

  async removeMessage(id: string) {
    try {
      return await this.messageRepository.removeMessage(id);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_DELETE_MESSAGE
      );
    }
  }
}
