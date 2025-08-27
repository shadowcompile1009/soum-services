import mongoose from 'mongoose';
import { AskSeller } from '../models/AskSeller';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { lookup, unwind } from '../util/queryHelper';
import { mappingMongoError } from '../libs/mongoError';
import { AskSellerType } from '../enums/AskSeller';

@Service()
export class AskSellerRepository {
  async getAskSeller(
    page: number,
    size: number,
    type?: string,
    sellerTypeBoolean?: boolean,
    isAnswered?: boolean
  ) {
    try {
      const conditions: Array<Record<string, any>> = [];

      if (sellerTypeBoolean) {
        conditions.push({
          $match: {
            'seller.isMerchant': true,
          },
        });
      } else if (sellerTypeBoolean === false) {
        conditions.push({
          $match: {
            'seller.isMerchant': false,
          },
        });
      }

      if (isAnswered === false) {
        conditions.push({
          $match: {
            answer: null,
          },
        });
      } else if (isAnswered === true) {
        conditions.push({
          $match: {
            answer: { $ne: null },
          },
        });
      }

      const aggregate: Array<Record<string, any>> = [
        {
          $match: {
            status: type || 'Active',
          },
        },
        {
          $sort: {
            created_date: -1, //Sort by Date DESC
          },
        },
        lookup('users', 'questioner_id', '_id', 'buyer'),
        unwind('$buyer', false),
        lookup('products', 'product_id', '_id', 'product'),
        unwind('$product', false),
        lookup('users', 'product.user_id', '_id', 'seller'),
        unwind('$seller', false),
        ...conditions,
        { $skip: (page - 1) * size },
        { $limit: size },
        {
          $project: {
            _id: 1,
            product_id: 1,
            question: 1,
            answer: 1,
            status: 1,
            created_date: 1,
            deleted_date: 1,
            deleted_by: 1,
            deleted_reason: 1,
            'buyer._id': 1,
            'buyer.name': 1,
            'buyer.mobileNumber': 1,
            'seller._id': 1,
            'seller.name': 1,
            'seller.mobileNumber': 1,
          },
        },
      ];

      const total = await AskSeller.count({
        status: type || 'Active',
      });
      const returnedResult = await AskSeller.aggregate(aggregate);

      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: { listComments: returnedResult, totalResult: total },
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAIL_TO_GET_ASK_SELLER,
          message: exception.message,
        },
      ];
    }
  }

  async deleteQuestion(questionID: string, reason: string) {
    try {
      if (!questionID) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const result = await AskSeller.findByIdAndUpdate(
        questionID,
        {
          status: 'Delete',
          deleted_date: new Date(),
          deleted_reason: reason,
          deleted_by: 'Admin',
        },
        { new: true }
      );

      return [false, result];
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
            result: Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
            message: exception.message,
          },
        ];
      }
    }
  }

  async updateAnswerByQuestionID(questionID: string, answer: string) {
    try {
      if (!questionID) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.ID_NOT_FOUND,
          },
        ];
      }
      const result = await AskSeller.findByIdAndUpdate(
        questionID,
        {
          answer: answer,
          updated_date: new Date(),
        },
        { new: true }
      );

      return [false, result];
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
            result: Constants.ERROR_MAP.FAIL_TO_UPDATE_ASK_SELLER,
            message: exception.message,
          },
        ];
      }
    }
  }

  async countPendingQuestionByUserID(userID: string, productId?: string) {
    try {
      const returnedResult = await AskSeller.count({
        seller_id: new mongoose.Types.ObjectId(userID),
        ...(productId && {
          product_id: new mongoose.Types.ObjectId(productId),
        }),
        status: 'Active',
        answer: null,
      });

      return [false, returnedResult];
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
            result: Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getQuestionsWithType(
    userId: string,
    page: number,
    size: number,
    type: string = AskSellerType.BUYER_QUESTIONS,
    productID?: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      if (!mongoose.isValidObjectId(userId)) {
        return [true, { code: 400, result: [], message: 'Invalid user id' }];
      }
      const match: Record<string, any> = {
        $match: {
          status: 'Active',
        },
      };

      if (type === AskSellerType.BUYER_QUESTIONS) {
        match.$match.questioner_id = new mongoose.Types.ObjectId(userId);
      } else if (type === AskSellerType.SELLER_PENDING_QUESTIONS) {
        match.$match.seller_id = new mongoose.Types.ObjectId(userId);
        match.$match.answer = null;
      }

      if (productID) {
        match.$match.product_id = new mongoose.Types.ObjectId(productID);
      }
      if (!match) {
        return [false, { code: 200, result: [] }];
      }

      const aggregates: Array<Record<string, any>> = [
        match,
        lookup('products', 'product_id', '_id', 'product'),
        unwind('$product', false),
        lookup('device_models', 'product.model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('users', 'questioner_id', '_id', 'buyer'),
        unwind('$buyer', false),
        lookup('users', 'product.user_id', '_id', 'seller'),
        unwind('$seller', false),
        {
          $skip: (page - 1) * size,
        },
        {
          $limit: size,
        },
        {
          $project: {
            question: 1,
            answer: 1,
            sellerId: '$seller._id',
            questionCreatedDate: '$created_date',
            product_id: '$product_id',
            product_name: '$model.model_name',
            product_name_ar: '$model.model_name_ar',
            product_images: '$product.product_images',
            sell_price: '$product.sell_price',
            condition: '$product.grade',
            variant_id: '$product.varient_id',
            created_date: '$product.createdDate',
            buyer_name: '$buyer.name',
          },
        },
      ];
      const result = await AskSeller.aggregate(aggregates);
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result,
          message: 'Get Questions successfully',
        },
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
            result: Constants.ERROR_MAP.FAIL_TO_DELETE_QUESTION,
            message: exception.message,
          },
        ];
      }
    }
  }

  async getAskSellerDetailsForReminder(
    questionId: string
  ): Promise<[boolean, { code: number; result: any; message?: string }]> {
    try {
      const aggregates = [
        {
          $match: {
            _id: new mongoose.Types.ObjectId(questionId),
          },
        },
        lookup('products', 'product_id', '_id', 'product'),
        unwind('$product', false),
        lookup('device_models', 'product.model_id', '_id', 'model'),
        unwind('$model', false),
        lookup('users', 'questioner_id', '_id', 'buyer'),
        unwind('$buyer', false),
        lookup('users', 'product.user_id', '_id', 'seller'),
        unwind('$seller', false),
        {
          $project: {
            question: 1,
            productName: '$model.model_name',
            buyerName: '$buyer.name',
            sellerPhone: '$seller.mobileNumber',
            sellerCountryCode: '$seller.countryCode',
            sellerId: '$seller._id',
            questionerId: '$questioner_id',
          },
        },
      ];

      const result = await AskSeller.aggregate(aggregates);
      if (result.length === 0) {
        return [
          true,
          {
            message: 'Not found',
            result: null,
            code: Constants.ERROR_CODE.NOT_FOUND,
          },
        ];
      }
      return [
        false,
        { result: result[0], code: Constants.SUCCESS_CODE.SUCCESS },
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
            result: null,
            message: exception.message,
          },
        ];
      }
    }
  }
}
