import { Service } from 'typedi';
import bcrypt from 'bcrypt';
import moment from 'moment';
import { Constants } from '../constants/constant';
import { BaseRepository } from './BaseRepository';
import {
  DeltaMachineUser,
  DeltaMachineUserDocument,
  UserJWTTokenInput,
} from '../models/DeltaMachineUsers';
import {
  AuthenticateSetting,
  AuthenticateSettingDocument,
} from '../models/AuthenticateSetting';
import { jwtSignIn, jwtVerify } from '../util/deltaMachineAuthentication';
import { UserStatus } from '../enums/UserStatus';
@Service()
export class DeltaMachineAuthenticationRepository implements BaseRepository {
  async getById(id: string): Promise<
    [
      boolean,
      {
        code: number;
        result: DeltaMachineUserDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await DeltaMachineUser.findById(id).exec();
      if (!data) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          },
        ];
      }
      return [false, { code: Constants.SUCCESS_CODE.SUCCESS, result: data }];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }
  async verifyUser(
    userName: string,
    password: string,
    ip: string
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      const user = await DeltaMachineUser.findOne({
        username: userName,
        status: UserStatus.ACTIVE,
      }).exec();
      if (!user) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.WRONG_USERNAME,
            message: Constants.MESSAGE.INVALID_USERNAME,
          },
        ];
      }
      // Check password
      if (!bcrypt.compareSync(password, user.password)) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.UNAUTHORIZED,
            result: Constants.ERROR_MAP.INVALID_PASSWORD,
            message: Constants.MESSAGE.PASSWORD_IS_INVALID,
          },
        ];
      }
      // Create a token
      const data: UserJWTTokenInput = {
        id: user._id,
        roleId: user.roleId,
        userName: user.username,
      };
      user.token = jwtSignIn(ip, data);
      user.refreshToken = jwtSignIn(ip, data, false);
      const savedUser = await user.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.LOGIN_SUCCESS,
          result: savedUser,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
          message: exception.message,
        },
      ];
    }
  }
  async verifyRefreshToken(
    token: any,
    ip: any
  ): Promise<[boolean, { code: number; message?: string; result: any }]> {
    try {
      const decoded = jwtVerify(token);

      // Get expired date
      const dateNow = moment().unix();
      const expiryDate = +decoded.iat + Constants.REFRESH_TOKEN_EXPIRES;

      if (decoded.ip !== ip) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.UNAUTHORIZED,
            result: Constants.ERROR_MAP.UNAUTHORIZED_USER,
          },
        ];
      }
      // Check expiration
      if (dateNow < expiryDate) {
        const user = await DeltaMachineUser.findById(decoded.userId).exec();

        if (!user) {
          return [
            true,
            {
              code: Constants.ERROR_CODE.BAD_REQUEST,
              result: Constants.ERROR_MAP.USER_NOT_FOUND,
            },
          ];
        }
        // refresh token
        const data: UserJWTTokenInput = {
          id: user._id,
          roleId: user.roleId,
          userName: user.username,
        };
        user.token = jwtSignIn(ip, data);
        user.refreshToken = jwtSignIn(ip, data, false);
        const refreshUser = await user.save();
        return [
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            message: Constants.MESSAGE.USER_VERIFY_SUCCESSFUL,
            result: refreshUser,
          },
        ];
      } else {
        return [
          true,
          {
            code: Constants.ERROR_CODE.UNAUTHORIZED,
            result: Constants.ERROR_MAP.TOKEN_EXPIRED,
            message: Constants.MESSAGE.EXPIRED_TOKEN,
          },
        ];
      }
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_VERIFY_TOKEN,
          message: exception.message,
        },
      ];
    }
  }
  async logout(
    token: any,
    ip: any
  ): Promise<[boolean, { code: number; message?: string; result: any }]> {
    try {
      const decoded = jwtVerify(token);
      if (decoded.ip !== ip) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.UNAUTHORIZED,
            result: Constants.ERROR_MAP.UNAUTHORIZED_USER,
          },
        ];
      }
      const user = await DeltaMachineUser.findById(decoded.userId).exec();
      if (!user) {
        return [
          true,
          {
            code: Constants.ERROR_CODE.BAD_REQUEST,
            result: Constants.ERROR_MAP.USER_NOT_FOUND,
          },
        ];
      }
      user.token = '';
      user.refreshToken = '';
      await user.save();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: Constants.MESSAGE.LOGOUT_SUCCESS.replace(
            '%%user%%',
            user.username
          ),
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_VERIFY_TOKEN,
          message: exception.message,
        },
      ];
    }
  }
  async getUser(
    userId: string
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      const user = await DeltaMachineUser.findOne({
        _id: userId,
      })
        .select('_id email firstName lastName username phoneNumber')
        .exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.USER_IS_FOUND,
          result: user,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_USER,
          message: exception.message,
        },
      ];
    }
  }
  async enableMFA(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: AuthenticateSettingDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await AuthenticateSetting.findOneAndUpdate(
        { userId },
        {
          $set: {
            isMFAEnabled: true,
          },
        }
      ).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.MFA_ENABLED,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
          message: exception.message,
        },
      ];
    }
  }

  async getAuthenticateSetting(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: AuthenticateSettingDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      const data = await AuthenticateSetting.findOne({ userId }).exec();
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.SETTING_GET_SUCCESS,
          result: data,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
          message: exception.message,
        },
      ];
    }
  }

  async saveSecret(
    userId: string,
    mfaSecret: string
  ): Promise<
    [
      boolean,
      {
        code: number;
        result: AuthenticateSettingDocument | string;
        message?: string;
      }
    ]
  > {
    try {
      let authenticateSetting = await AuthenticateSetting.findOneAndUpdate(
        { userId: userId },
        { mfaSecret },
        {
          new: true,
        }
      ).exec();
      if (!authenticateSetting) {
        authenticateSetting = new AuthenticateSetting({
          userId,
          mfaSecret,
        });
        await authenticateSetting.save();
      }
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.MFA_ENABLED,
          result: authenticateSetting,
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
          message: exception.message,
        },
      ];
    }
  }

  async disableMFA(userId: string): Promise<
    [
      boolean,
      {
        code: number;
        result: string;
        message?: string;
      }
    ]
  > {
    try {
      await AuthenticateSetting.findOneAndUpdate(
        { userId },
        {
          $set: {
            isMFAEnabled: false,
            mfaSecret: '',
          },
        }
      );
      return [
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          message: Constants.MESSAGE.MFA_DISABLED,
          result: 'success',
        },
      ];
    } catch (exception) {
      return [
        true,
        {
          code: Constants.ERROR_CODE.BAD_REQUEST,
          result: Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
          message: exception.message,
        },
      ];
    }
  }
}
