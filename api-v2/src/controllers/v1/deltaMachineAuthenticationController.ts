import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { body, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { DeltaMachineService } from '../../services/deltaMachineService';
import { DeltaMachineAuthenticationService } from '../../services/deltaMachineAuthenticationService';
import IController from './IController';
import { getUserIdFromToken } from '../../util/deltaMachineAuthentication';
import { jwtSignIn } from '../../util/deltaMachineAuthentication';
import {
  DeltaMachineUserDocument,
  UserJWTTokenInput,
  UserJWTTokenResponse,
} from '../../models/DeltaMachineUsers';
import { AuthenticateSettingDocument } from '../../models/AuthenticateSetting';
import { AuthGuardDM, getUser } from '../../middleware/authGuardDM';

export class DeltaMachineAuthenticationController implements IController {
  path = 'dm-auth/';
  deltaMachineService: DeltaMachineService;
  deltaMachineAuthenticationService: DeltaMachineAuthenticationService;
  error: ErrorResponseDto;
  router: Router;
  constructor(router: Router) {
    this.deltaMachineService = Container.get(DeltaMachineService);
    this.deltaMachineAuthenticationService = Container.get(
      DeltaMachineAuthenticationService
    );
    this.error = Container.get(ErrorResponseDto);
    this.router = router;
  }

  initializeRoutes() {
    this.router.post(
      '/login',
      [
        body('username')
          .notEmpty()
          .withMessage(
            'username ' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
        body('password')
          .notEmpty()
          .withMessage(
            'password ' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          ),
      ],
      this.login
    );
    this.router.put(
      '/mfa/enable',
      [
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
      ],
      this.enableMFA
    );
    this.router.get('/refresh', [], this.refresh);
    this.router.get('/logout', [], this.logout);
    this.router.put('/mfa/disable', [AuthGuardDM], this.disableMFA);
    this.router.get('/mfa/status', [AuthGuardDM], this.getMFAStatus);
    this.router.post(
      '/mfa/auth',
      [
        body('mfaCode')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.MFA_CODE),
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
      ],
      this.verifyMFAForLogin
    );
    this.router.post(
      '/mfa/enable/auth',
      [
        body('mfaCode')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.MFA_CODE),
        body('userId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.USER_ID),
      ],
      this.verifyMFA
    );
  }

  login = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_LOGIN,
            JSON.stringify(errors.array())
          )
        );
      }
      const username = !req.body.username ? null : req.body.username;
      const password = req.body.password || null;

      const ip = req.ip || null;
      const [err, result] =
        await this.deltaMachineAuthenticationService.getAuthentication(
          username,
          password,
          ip
        );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
      }
      const user = result.result;
      const dataObj =
        await this.deltaMachineAuthenticationService.getAuthenticateSetting(
          user._id
        );
      const authenticateSetting = dataObj.result as AuthenticateSettingDocument;
      let isMFAEnabled = false;
      if (user?.username === process.env.TEST_AUTOMATION_USER) {
        isMFAEnabled = true;
      }
      if (authenticateSetting) {
        isMFAEnabled = authenticateSetting.isMFAEnabled;
      }
      return res.sendOk(
        { isMFAEnabled, userId: user._id },
        isMFAEnabled
          ? Constants.MESSAGE.MFA_ENABLED
          : Constants.MESSAGE.MFA_DISABLED
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      }
      return res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_AUTHENTICATE,
          exception.message
        )
      );
    }
  };
  refresh = async (req: Request, res: Response) => {
    try {
      const refreshToken = req.headers.token;
      const ip = req.ip;
      const [err, response] =
        await this.deltaMachineAuthenticationService.verifyRefreshToken(
          refreshToken,
          ip
        );
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            response.code,
            Constants.ERROR_TYPE.API,
            response.result.toString(),
            response.message
          )
        );
      }
      const user = response.result;
      const jwtTokenResponse: UserJWTTokenResponse = {
        token: user.token,
        refreshToken: user.refreshToken,
      };
      return res.sendOk(
        jwtTokenResponse,
        Constants.MESSAGE.REFRESH_TOKEN_SUCCESS
      );
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REFRESH_TOKEN
          )
        );
      }
    }
  };
  logout = async (req: Request, res: Response) => {
    try {
      const token = req.headers.token;
      const ip = req.ip;
      const [err, response] =
        await this.deltaMachineAuthenticationService.logout(token, ip);
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            response.code,
            Constants.ERROR_TYPE.API,
            response.result.toString(),
            response.message
          )
        );
      }
      return res.sendOk(response.result);
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
  getMFAStatus = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const token = req.headers['token'] as string;
      const userId = getUserIdFromToken(token);
      const data =
        await this.deltaMachineAuthenticationService.getAuthenticateSetting(
          userId
        );
      const authenticateSetting = data.result as AuthenticateSettingDocument;
      res.sendOk(
        { mfaStatus: authenticateSetting?.isMFAEnabled },
        Constants.MESSAGE.MFA_STATUS
      );
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_GET_MFA_STATUS,
          exception.message
        )
      );
    }
  };

  disableMFA = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const token = req.headers['token'] as string;
      const userId = getUserIdFromToken(token);
      const result = await this.deltaMachineAuthenticationService.disableMFA(
        userId
      );
      res.sendOk(result.result, Constants.MESSAGE.MFA_DISABLED);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
          exception.message
        )
      );
    }
  };

  enableMFA = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.body.userId;
      const secret = this.deltaMachineAuthenticationService.getQRCodeSecret();
      const qrCodeImage =
        await this.deltaMachineAuthenticationService.getQRCodeImage(
          secret.otpauthUrl
        );
      await this.deltaMachineAuthenticationService.saveSecret(
        userId,
        secret.base32
      );
      res.sendOk({ qrCode: qrCodeImage }, Constants.MESSAGE.QR_CODE_GENERATED);
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_ENABLE_OR_DISABLE_MFA,
          exception.message
        )
      );
    }
  };

  verifyMFAForLogin = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.body.userId;
      const [err, result] =
        await this.deltaMachineAuthenticationService.getUser(req.body.userId);
      if (err) {
        return res.sendError(
          new ErrorResponseDto(
            result.code,
            Constants.ERROR_TYPE.API,
            result.result,
            result.message
          )
        );
      }
      const user = result.result;
      let verified = false;
      let authenticateSetting;
      if (user?.username === process.env.TEST_AUTOMATION_USER) {
        verified = true;
      } else {
        const data =
          await this.deltaMachineAuthenticationService.getAuthenticateSetting(
            userId
          );
        authenticateSetting = data.result as AuthenticateSettingDocument;
        const userSecret = authenticateSetting.mfaSecret;
        verified = this.deltaMachineAuthenticationService.verifyToken(
          userSecret,
          req.body.mfaCode
        );
      }
      if (verified) {
        const ip = req.ip || null;
        const [err, roleData] = await getUser(req.body.userId);
        let userObj;
        if (!err) {
          userObj = roleData.result as DeltaMachineUserDocument;
        }
        const userRole = userObj?.role;
        // Create a token
        const data: UserJWTTokenInput = {
          id: req.body.userId,
          userName: user.username,
          roleId: userRole?.id || '',
          roleName: userRole?.name || '',
        };
        const token = jwtSignIn(ip, data);
        const response: UserJWTTokenResponse = {
          userId: userId,
          token: token,
          firstName: user?.firstName,
          lastName: user?.lastName,
          username: user?.username,
          email: user?.email,
          phoneNumber: user?.phoneNumber,
          isMFAEnabled: authenticateSetting?.isMFAEnabled,
          roleName: userRole?.displayName || '',
          roleId: userRole?.id || '',
        };
        // trigger activity log with sign in event
        await this.deltaMachineService.createActivityLogSignInEvent(
          userId,
          user.username
        );
        res.sendOk(response, Constants.MESSAGE.LOGIN_SUCCESS);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VERIFY_MFA_CODE,
            Constants.ERROR_MAP.FAILED_TO_VERIFY_MFA_CODE
          )
        );
      }
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_VERIFY_MFA_CODE,
          exception.message
        )
      );
    }
  };

  verifyMFA = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_ORDER,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.body.userId;
      const data =
        await this.deltaMachineAuthenticationService.getAuthenticateSetting(
          userId
        );
      const authenticateSetting = data.result as AuthenticateSettingDocument;
      const userSecret = authenticateSetting.mfaSecret;
      const verified = this.deltaMachineAuthenticationService.verifyToken(
        userSecret,
        req.body.mfaCode
      );
      if (verified) {
        await this.deltaMachineAuthenticationService.enableMFA(userId);
        res.sendOk({ authenticated: true }, Constants.MESSAGE.MFA_ENABLED);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_VERIFY_MFA_CODE,
            Constants.ERROR_MAP.FAILED_TO_VERIFY_MFA_CODE
          )
        );
      }
    } catch (exception) {
      res.sendError(
        new ErrorResponseDto(
          Constants.ERROR_CODE.BAD_REQUEST,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.FAILED_TO_VERIFY_MFA_CODE,
          exception.message
        )
      );
    }
  };
}
