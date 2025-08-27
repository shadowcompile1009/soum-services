import mongoose from 'mongoose';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { mappingMongoError } from '../libs/mongoError';
import { Response, ResponseInput, ResponseType } from '../models/Response';

@Service()
export class ResponseRepository {
  async updateResponse(
    responseId: string,
    request: ResponseInput
  ): Promise<
    [boolean, { code: number; result: string | ResponseType; message?: string }]
  > {
    try {
      const response = await Response.findById(responseId).exec();
      if (request.product_id) {
        response.product =
          response.product || new mongoose.Types.ObjectId(request.product_id);
      }

      response.responses = request.responses;
      response.markModified('responses');
      const updatedRes = await response.save({});
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: updatedRes },
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
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_RESPONSE,
            message: exception.message,
          },
        ];
      }
    }
  }
  async addResponse(
    request: ResponseInput
  ): Promise<[boolean, { code: number; result: string | ResponseType }]> {
    try {
      if (request.responses.length > 0) {
        const response: ResponseType = new Response({
          responses: request.responses,
        });
        if (request.product_id) {
          const existingResponse = await Response.findOne({
            product: request.product_id,
          }).exec();

          if (existingResponse) {
            existingResponse.responses = existingResponse.responses.concat(
              request.responses
            );
            const updateResponse = await existingResponse.save();
            return [
              false,
              { code: Constants.SUCCESS_CODE.SUCCESS, result: updateResponse },
            ];
          } else {
            response.product = new mongoose.Types.ObjectId(request.product_id);
          }
        }
        const newRes = await response.save();
        return [
          false,
          { code: Constants.SUCCESS_CODE.SUCCESS, result: newRes },
        ];
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Response request is empty',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        const mappingErrorCode = mappingMongoError(exception.code);
        return [
          true,
          { code: Constants.ERROR_CODE.BAD_REQUEST, result: mappingErrorCode },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_RESPONSE,
          },
        ];
      }
    }
  }

  async getResponse(
    id: string
  ): Promise<
    [boolean, { code: number; result: string | ResponseType; message?: string }]
  > {
    try {
      const response = await Response.findById(id).exec();

      if (!response) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.RESPONSE_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: response },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          message: exception.message,
        },
      ];
    }
  }

  async getFilterResponse(
    productId: string
  ): Promise<
    [boolean, { code: number; result: string | ResponseType; message?: string }]
  > {
    try {
      const response = await Response.findOne({
        product: new mongoose.Types.ObjectId(productId),
      }).exec();

      if (!response) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.RESPONSE_NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: response.responses },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_RESPONSE,
          message: exception.message,
        },
      ];
    }
  }

  async removeResponse(
    responseId: string
  ): Promise<
    [boolean, { code: number; result: string | ResponseType; message?: string }]
  > {
    try {
      await Response.findByIdAndDelete(responseId).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: 'Done to remove response',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_REMOVE_RESPONSE,
          message: exception.message,
        },
      ];
    }
  }
}
