import config from 'config';
import crypto from 'crypto';
import { Service } from 'typedi';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { UserRepository } from '../repositories/userRepository';
import { UserLegacyDocument } from '../models/LegacyUser';
import { NotificationRepository } from '../repositories/notificationRepository';

const Config = config.get('App') as any;
const smsKey = Config.twilio.secretKey;

@Service()
export class AuthService {
  constructor(
    public userRepository: UserRepository,
    public notificationRepository: NotificationRepository,
    public error: ErrorResponseDto
  ) {}

  async getAdminAuthentication(
    username: any,
    emailAddress: any,
    password: any,
    ip: any
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      // const encryptPass = encrypt_string(password);
      return await this.userRepository.verifyAdminUser(
        emailAddress,
        username,
        password,
        ip
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE
      );
    }
  }

  async getAuthentication(
    countryCode: string,
    phoneNumber: string,
    password: any,
    ip: any
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      // const encryptPass = encrypt_string(password);
      return await this.userRepository.verifyLoginUser(
        countryCode,
        phoneNumber,
        password,
        ip
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE
      );
    }
  }

  async logoutUser(
    userId: string,
    token: string,
    fcmToken?: string
  ): Promise<[boolean, string]> {
    try {
      const loggingOutUser: UserLegacyDocument =
        await this.userRepository.getUserById(userId);
      if (loggingOutUser && loggingOutUser.token) {
        const foundIndex = loggingOutUser.token.indexOf(token);
        if (foundIndex > -1) {
          loggingOutUser.token.splice(foundIndex, 1);

          if (fcmToken) {
            const [errorRemoveFcm] =
              await this.notificationRepository.removeDeviceToken(
                fcmToken,
                userId
              );

            if (errorRemoveFcm) {
              return [true, Constants.MESSAGE.LOGOUT_UNSUCCESSFUL_NO_FCM];
            }
          }

          await loggingOutUser.save();
        }

        return [
          false,
          Constants.MESSAGE.LOGOUT_SUCCESS.replace(
            '%%user%%',
            loggingOutUser.mobileNumber
          ),
        ];
      }

      return [true, Constants.MESSAGE.LOGOUT_UNSUCCESSFUL_NO_USER];
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE
      );
    }
  }

  async verifyToken(token: any, ip: any, isAdminRule: boolean) {
    try {
      return await this.userRepository.verifyToken(token, ip, isAdminRule);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_VERIFY_TOKEN
      );
    }
  }

  async verifyOTP(phone: any, hash: any, otp: any, ip: any) {
    try {
      const [hashValue, expires] = hash.split('.');

      const now = Date.now();
      if (now > parseInt(expires)) {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.TIME_OUT_PHONE_OTP;

        throw this.error;
      }

      const data = `${phone}.${otp}.${expires}`;
      const newCalculatedHash = crypto
        .createHmac('sha256', smsKey)
        .update(data)
        .digest('hex');
      if (newCalculatedHash === hashValue) {
        const [err, isLogin] = await this.userRepository.findUserViaPhoneNumber(
          phone,
          ip,
          true
        );
        if (err) {
          return [err, isLogin];
        }
        if (!isLogin) {
          // sign up user
          return await this.userRepository.addUserWithPhoneNumber(phone);
        } else {
          // login with verified phone number
          return [false, isLogin];
        }
      } else {
        this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = Constants.ERROR_MAP.INCORRECT_VERIFIED_PHONE_OTP;

        throw this.error;
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) throw exception;
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_VERIFIED_PHONE_OTP
      );
    }
  }
}
