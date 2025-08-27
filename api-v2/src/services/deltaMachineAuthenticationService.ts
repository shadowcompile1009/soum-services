import { Inject, Service } from 'typedi';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { DeltaMachineAuthenticationRepository } from '../repositories/deltaMachineAuthenticationRepository';

@Service()
export class DeltaMachineAuthenticationService {
  @Inject()
  error: ErrorResponseDto;
  @Inject()
  deltaMachineAuthenticationRepository: DeltaMachineAuthenticationRepository;

  async getAuthentication(
    username: string,
    password: string,
    ip: string
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      return await this.deltaMachineAuthenticationRepository.verifyUser(
        username,
        password,
        ip
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
        exception.message
      );
    }
  }
  async verifyRefreshToken(token: any, ip: any) {
    try {
      return await this.deltaMachineAuthenticationRepository.verifyRefreshToken(
        token,
        ip
      );
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_VERIFY_TOKEN,
        exception.message
      );
    }
  }

  async logout(token: any, ip: any) {
    try {
      return await this.deltaMachineAuthenticationRepository.logout(token, ip);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_VERIFY_TOKEN,
        exception.message
      );
    }
  }

  async getUser(
    userId: string
  ): Promise<[boolean, { code: number; message: string; result: any }]> {
    try {
      return await this.deltaMachineAuthenticationRepository.getUser(userId);
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
        exception.message
      );
    }
  }

  async enableMFA(userId: string) {
    try {
      const [err, data] =
        await this.deltaMachineAuthenticationRepository.enableMFA(userId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
        exception.message
      );
    }
  }

  async saveSecret(userId: string, mfaSecret: string) {
    try {
      const [err, data] =
        await this.deltaMachineAuthenticationRepository.saveSecret(
          userId,
          mfaSecret
        );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
        exception.message
      );
    }
  }

  async disableMFA(userId: string) {
    try {
      const [err, data] =
        await this.deltaMachineAuthenticationRepository.disableMFA(userId);
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
        exception.message
      );
    }
  }

  async getAuthenticateSetting(userId: string) {
    try {
      const [err, data] =
        await this.deltaMachineAuthenticationRepository.getAuthenticateSetting(
          userId
        );
      if (err) {
        this.error.errorCode = data.code;
        this.error.errorType = Constants.ERROR_TYPE.API;
        this.error.errorKey = data.result.toString();
        this.error.message = data.message;
        throw this.error;
      }
      return data;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }

  verifyToken(userSecret: string, userToken: string) {
    try {
      return speakeasy.totp.verify({
        secret: userSecret,
        encoding: 'base32',
        token: userToken,
      });
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_GET_SETTING,
        exception.message
      );
    }
  }

  getQRCodeSecret() {
    try {
      const secret = speakeasy.generateSecret({
        name: process.env.GOOGLE_AUTH_APP_NAME,
      });
      return {
        otpauthUrl: secret.otpauth_url,
        base32: secret.base32,
      };
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
        exception.message
      );
    }
  }

  async getQRCodeImage(otpAuthUrl: string) {
    try {
      const qrImage = await QRCode.toDataURL(otpAuthUrl);
      return qrImage;
    } catch (exception) {
      throw new ErrorResponseDto(
        Constants.ERROR_CODE.BAD_REQUEST,
        Constants.ERROR_TYPE.API,
        Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
        exception.message
      );
    }
  }
}
