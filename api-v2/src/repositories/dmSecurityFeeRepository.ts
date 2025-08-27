import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { DMSecurityFee, DMSecurityFeeDocument } from '../models/DMSecurityFee';

@Service()
export class DMSecurityFeeRepository {
  async getByUserId(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DMSecurityFeeDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DMSecurityFee.findOne({ userId }).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: null,
            message: Constants.MESSAGE.FAILED_TO_GET_DM_SECURITY_FEE,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_DM_SECURITY_FEE,
          message: exception.message,
        },
      ];
    }
  }

  async create(newSecurityFeeObj: DMSecurityFeeDocument): Promise<
    [
      boolean,
      {
        code: number;
        result: DMSecurityFeeDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const newDMSecurityFee = new DMSecurityFee();
      newDMSecurityFee.transactionId = newSecurityFeeObj.transactionId;
      newDMSecurityFee.userId = newSecurityFeeObj.userId;
      newDMSecurityFee.status = newSecurityFeeObj.status;
      const data = await newDMSecurityFee.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: data,
          message: 'Create new security fee successfully',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_CREATE_DM_SECURITY_FEE,
            message: exception.message,
          },
        ];
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_CREATE_DM_SECURITY_FEE,
          message: exception.message,
        },
      ];
    }
  }

  async update(
    id: string,
    securityFeeObj: DMSecurityFeeDocument
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: DMSecurityFeeDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const doc = await DMSecurityFee.findOneAndUpdate(
        { _id: id },
        {
          $set: securityFeeObj,
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: doc,
          message: 'Update security fee successfully',
        },
      ];
    } catch (exception) {
      if (exception.name === 'MongoError') {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
            message: exception.message,
          },
        ];
      }
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_UPDATE_DM_SECURITY_FEE,
          message: exception.message,
        },
      ];
    }
  }
}
