import { Request, Response, Router } from 'express';
import { _get } from '../../util/common';
import { Container } from 'typedi';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { sendSMSViaProvider } from '../../libs/provider';
import { AuthGuard } from '../../middleware/authGuard';
import { AuthService } from '../../services/authService';
import { isFromAdminRequest } from '../../util/authentication';
import IController from './IController';

export class AuthenticationController implements IController {
  path = 'authentication/';
  authenticationService: AuthService;
  error: ErrorResponseDto;
  router: Router;
  constructor(router: Router) {
    this.authenticationService = Container.get(AuthService);
    this.error = Container.get(ErrorResponseDto);
    this.router = router;
  }

  initializeRoutes() {
    this.router.post('/login', this.login);
    this.router.get('/logout', AuthGuard, this.logout);
    this.router.get('/refresh', AuthGuard, this.refresh);
    this.router.post('/sendOTP', this.sendOTP);
    this.router.post('/verifyOTP', this.verifyOTP);
  }

  login = async (req: Request, res: Response) => {
    try {
      const isAdminRule = isFromAdminRequest(req);
      const username = !req.body.username
        ? null
        : req.body.username.toLowerCase();
      const email = !req.body.email ? null : req.body.email.toLowerCase();
      const countryCode = req.body.country_code || null;
      const phoneNumber = req.body.phone_number || null;
      const password = req.body.password || null;
      const ip = req.body.ip || null;
      const [err, result] = isAdminRule
        ? await this.authenticationService.getAdminAuthentication(
            username,
            email,
            password,
            ip
          )
        : await this.authenticationService.getAuthentication(
            countryCode,
            phoneNumber,
            password,
            ip
          );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
      } else {
        res.sendOk(result.result, Constants.MESSAGE.LOGIN_SUCCESS);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
            exception.message
          )
        );
      }
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const user = _get(req, 'user', null);
      const userInfo = _get(req, 'userInfo', null);
      const token = _get(req.headers, 'token', '');
      const fcmToken = _get(req.headers, 'fcm-token', '');
      if (user) {
        const [error, result] = await this.authenticationService.logoutUser(
          user.id,
          token,
          fcmToken
        );
        if (error) {
          res.sendError(
            new ErrorResponseDto(
              Constants.ERROR_CODE.BAD_REQUEST,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
              result.toString()
            )
          );
        }

        return res.sendOk({ userInfo }, result);
      }

      res.sendOk(null, 'No user found');
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
            exception.message
          )
        );
      }
    }
  };

  refresh = async (req: Request, res: Response) => {
    try {
      const isAdminRule = isFromAdminRequest(req);
      const token = req.headers.token;
      const ip = req.ip;
      const [err, result] = await this.authenticationService.verifyToken(
        token,
        ip,
        isAdminRule
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REFRESH_TOKEN
          )
        );
      }
    }
  };

  sendOTP = async (req: Request, res: Response) => {
    try {
      const phone = req.body.phone || '';
      // if (!validatePhone(phone)) {
      //   this.error.errorCode = Constants.ERROR_CODE.BAD_REQUEST;
      //   this.error.errorType = Constants.ERROR_TYPE.API;
      //   this.error.errorKey = Constants.ERROR_MAP.INVALID_PHONE_NUMBER;
      //   throw this.error;
      // }
      const result = sendSMSViaProvider(
        null,
        Constants.providers.TWILIO,
        phone,
        Constants.templates.PHONE_VERIFICATION_OTP_CODE
      );
      res.sendOk(result);
    } catch (exception) {
      res.sendError(exception);
    }
  };

  verifyOTP = async (req: Request, res: Response) => {
    try {
      const phone = req.body.phone || null;
      const hash = req.body.hash || null;
      const otp = req.body.otp || null;
      const ip = req.ip || null;
      const [err, result] = await this.authenticationService.verifyOTP(
        phone,
        hash,
        otp,
        ip
      );
      if (err) {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            result.toString()
          )
        );
      } else {
        res.sendOk(result);
      }
    } catch (exception) {
      res.sendError(exception);
    }
  };
}
