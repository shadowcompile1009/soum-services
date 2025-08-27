import { Request, Response, Router } from 'express';
import { Container } from 'typedi';
import { Types } from 'mongoose';
import { body, param, validationResult } from 'express-validator';
import { Constants } from '../../constants/constant';
import { ErrorResponseDto } from '../../dto/errorResponseDto';
import { DeltaMachineService } from '../../services/deltaMachineService';
import IController from './IController';
import {
  DeltaMachineNewUserInput,
  DeltaMachineUserDocument,
} from '../../models/DeltaMachineUsers';
import { AuthGuardDM } from '../../middleware/authGuardDM';
import permit from '../../middleware/authorizationGuard';

export class DeltaMachineUsersController implements IController {
  path = 'dm-users/';
  router: Router;
  deltaMachineService: DeltaMachineService;

  constructor(router: Router) {
    this.router = router;
    this.deltaMachineService = Container.get(DeltaMachineService);
  }

  initializeRoutes() {
    this.router.get('/', AuthGuardDM, permit('', true), this.viewUsers);
    this.router.put(
      '/:userId/role',
      [
        AuthGuardDM,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('roleId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ROLE_ID),
      ],
      this.updateUserRole
    );
    this.router.put(
      '/:userId/group',
      [
        AuthGuardDM,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
        body('groupId')
          .notEmpty()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.ROLE_ID),
      ],
      this.updateUserGroup
    );
    this.router.post(
      '/',
      [
        AuthGuardDM,
        permit('', true),
        body('username')
          .notEmpty()
          .withMessage(
            'username' + Constants.VALIDATE_REQUEST_MSG.EMPTY_NULL_COMMON_MSG
          )
          .isLength({ min: 6 })
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_USERNAME_LENGTH)
          .custom(value => !/\s/.test(value))
          .withMessage(
            Constants.VALIDATE_REQUEST_MSG.NO_SPACE_ALLOWED_IN_USERNAME
          ),
        body('email').optional(),
        body('phoneNumber').optional(),
        body('password', Constants.VALIDATE_REQUEST_MSG.INVALID_PASSWORD)
          .trim()
          .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1,
            minNumbers: 1,
          }),
        body('roleId').optional(),
        body('groupId').optional(),
      ],
      this.addNewUser
    );
    this.router.delete(
      '/:userId',
      [
        AuthGuardDM,
        param('userId')
          .trim()
          .isString()
          .withMessage(
            'userId' + Constants.VALIDATE_REQUEST_MSG.INVALID_STRING_VALUE
          ),
      ],
      this.deleteUser
    );
    this.router.get('/roles', AuthGuardDM, this.getRoles);
  }

  viewUsers = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            JSON.stringify(errors.array())
          )
        );
      }
      const offset = parseInt(req.query?.offset?.toString()) || 0;
      let limit = parseInt(req.query?.limit?.toString()) || 10;
      if (limit > 100) limit = 100;

      const result = await this.deltaMachineService.getUsers(offset, limit);
      res.sendOk(result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER,
            exception.message
          )
        );
      }
    }
  };

  getRoles = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER_ROLE,
            JSON.stringify(errors.array())
          )
        );
      }
      const result = await this.deltaMachineService.getRoles();
      return res.sendOk(result.roles);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_GET_USER_ROLE,
            exception.message
          )
        );
      }
    }
  };

  addNewUser = async (req: Request, res: Response) => {
    try {
      if ((req.body?.email || '').length > 0) {
        await body('email')
          .trim()
          .isEmail()
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_EMAIL)
          .custom(value => /soum.sa/.test(value))
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_DOMAIN_EMAIL)
          .run(req);
      }
      if ((req.body?.phoneNumber || '').length > 0) {
        await body('phoneNumber')
          .trim()
          .custom(value =>
            Constants.VISION_API.SAUDI_PHONE_NUMBER_REGEX.test(value)
          )
          .withMessage(Constants.VALIDATE_REQUEST_MSG.INVALID_PHONE)
          .run(req);
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_USER,
            errors.array({ onlyFirstError: true })[0].msg
          )
        );
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const adName = (req.userInfo as any)?.username;
      const newUserInput: DeltaMachineNewUserInput = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email || '',
        phoneNumber: req.body.phoneNumber || '',
        createdBy: adName,
        roleId: req.body.roleId,
        groupId: req.body.groupId,
      };
      const data = await this.deltaMachineService.addNewUser(newUserInput);
      // trigger activity log with added user event
      await this.deltaMachineService.createActivityLogToDMUserAccountEvent(
        (req as any).userInfo._id,
        (data as DeltaMachineUserDocument).username,
        (req as any).userInfo.username,
        false
      );
      return res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_ADD_USER,
            exception.message
          )
        );
      }
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
            JSON.stringify(errors.array())
          )
        );
      }
      const userId = req.params.userId || null;
      if (!Types.ObjectId.isValid(userId)) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
            'Invalid User Id'
          )
        );
      }
      const adName = (req as any).userInfo.username;
      const [errUserDel, user] = await this.deltaMachineService.deleteUser(
        userId,
        adName
      );
      if (errUserDel) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            user.toString()
          )
        );
      }
      await this.deltaMachineService.createActivityLogToDMUserAccountEvent(
        (req as any).userInfo._id,
        (user.result as DeltaMachineUserDocument).username,
        (req as any).userInfo.username,
        true
      );
      return res.sendOk(user.result);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        return res.sendError(exception);
      } else {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_REMOVE_USER_ACCOUNT,
            exception.message
          )
        );
      }
    }
  };

  updateUserRole = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            errors.array({ onlyFirstError: true })[0].msg
          )
        );
      }
      const data = await this.deltaMachineService.updateUserRole(
        req.params.userId,
        req.body.roleId
      );
      res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            exception.message
          )
        );
      }
    }
  };

  updateUserGroup = async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            errors.array({ onlyFirstError: true })[0].msg
          )
        );
      }
      const data = await this.deltaMachineService.updateUserGroup(
        req.params.userId,
        req.body.groupId
      );
      res.sendOk(data);
    } catch (exception) {
      if (exception instanceof ErrorResponseDto) {
        res.sendError(exception);
      } else {
        res.sendError(
          new ErrorResponseDto(
            Constants.ERROR_CODE.BAD_REQUEST,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.FAILED_TO_UPDATE_USER,
            exception.message
          )
        );
      }
    }
  };
}
