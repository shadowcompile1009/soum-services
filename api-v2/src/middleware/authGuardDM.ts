import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { GetRole } from '../grpc/authz';
import {
  DeltaMachineUser,
  DeltaMachineUserDocument,
} from '../models/DeltaMachineUsers';
const USER_ROLES_CACHE: any = {};

export const AuthGuardDM = async function (req: any, res: Response, next: any) {
  const token = req.headers['token'];
  const jwtSecret = process.env.PRIVATE_KEY_AUTHENTICATION;
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(
    token as string,
    jwtSecret,
    (err: jwt.VerifyErrors, decoded: jwt.JwtPayload) => {
      if (err) {
        let error;
        if (err.name === 'TokenExpiredError') {
          error = new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.TOKEN_EXPIRED,
            err.toString()
          );
          return res.sendError(error);
        }
        error = new ErrorResponseDto(
          Constants.ERROR_CODE.UNAUTHORIZED,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.UNAUTHORIZED,
          err.toString()
        );
        return res.sendError(error);
      } else {
        req.user = decoded;
        return getUser(decoded.userId).then(i => {
          const [isNotAuthorized, returned] = i;
          if (isNotAuthorized) {
            const error = new ErrorResponseDto(
              returned.code,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.UNAUTHORIZED,
              returned.result.toString()
            );
            return res.sendError(error);
          }
          req.userInfo = returned.result;
          // keep moving
          next();
        });
      }
    }
  );
};

export async function getUser(
  userId: string
): Promise<
  [boolean, { code: number; result: string | DeltaMachineUserDocument }]
> {
  const adminUser = await DeltaMachineUser.findById(userId).exec();
  if (adminUser) {
    if (adminUser?.roleId) {
      if (USER_ROLES_CACHE[adminUser.roleId]) {
        adminUser.role = USER_ROLES_CACHE[adminUser.roleId];
        return [false, { code: 200, result: adminUser }];
      } else {
        try {
          const roleObj = await GetRole({
            id: adminUser.roleId,
          });
          if (roleObj) {
            USER_ROLES_CACHE[adminUser.roleId] = roleObj;
            adminUser.role = roleObj;
          }
          return [false, { code: 200, result: adminUser }];
        } catch (err) {
          return [false, { code: 200, result: adminUser }];
        }
      }
    } else {
      return [false, { code: 200, result: adminUser }];
    }
  }
  return [
    true,
    { code: Constants.ERROR_CODE.UNAUTHORIZED, result: `User not found` },
  ];
}
