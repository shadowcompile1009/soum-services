import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';
import { authorize } from '../util/authentication';
import { _get } from '../util/common';
// import { readSecret } from '../libs/vault';

export const AuthGuard = function (req: any, res: Response, next: any) {
  // let jwtSecret = process.env.JWT_SECRET_KEY_ADMIN;
  const token = req.headers['token'];
  const clientId: string = _get(req.headers, 'client-id', '');

  let jwtSecret = process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
  if (clientId.trim() === 'admin-web') {
    jwtSecret = process.env.JWT_SECRET_KEY_ADMIN;
  }
  if (!token) {
    return res.status(401).send({ auth: false, message: 'No token provided.' });
  }
  // const clientId: string = _get(req.headers, 'client-id', '');
  // if (clientId.trim() !== 'admin-web') {
  //   jwtSecret = await readSecret('/secret/data/authz/auth');
  // }
  jwt.verify(
    token as string,
    jwtSecret,
    {
      ignoreExpiration: true,
    },
    (err: jwt.VerifyErrors, decoded: jwt.JwtPayload) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          const error = new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.TOKEN_EXPIRED,
            err.toString()
          );
          return res.sendError(error);
        } else {
          const error = new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.UNAUTHORIZED,
            err.toString()
          );
          return res.sendError(error);
        }
      } else {
        req.user = decoded;
        return authorize(clientId, req.user).then(i => {
          const [isAuthorized, returned] = i;
          if (!isAuthorized) {
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

export const CheckTokenIfFound = function (req: any, res: Response, next: any) {
  const token = req.headers['token'];
  const jwtSecret = process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
  if (token) {
    jwt.verify(
      token as string,
      jwtSecret,
      {
        ignoreExpiration: true,
      },
      (err: jwt.VerifyErrors, decoded: jwt.JwtPayload) => {
        if (!err) {
          req.user = decoded;
        } else {
          if (err.name === 'TokenExpiredError') {
            const error = new ErrorResponseDto(
              Constants.ERROR_CODE.UNAUTHORIZED,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.TOKEN_EXPIRED,
              err.toString()
            );
            return res.sendError(error);
          } else {
            const error = new ErrorResponseDto(
              Constants.ERROR_CODE.UNAUTHORIZED,
              Constants.ERROR_TYPE.API,
              Constants.ERROR_MAP.UNAUTHORIZED,
              err.toString()
            );
            return res.sendError(error);
          }
        }

        // pause to add log at this time
        // const eventLogAddUserRequest: EventLogRequest = {
        //   eventType: Constants.activity_log_template.USER_ACTIVITY_REPORTS,
        //   userId: req?.user?.id || '',
        //   username: req?.user?.id || '',
        //   value: Constants.activity_log_template.USER_ACTIVITY,
        //   module: 'userActivity',
        // };
        // createEventLog(eventLogAddUserRequest);

        next();
      }
    );
  } else next();
};

export const tamaraAuthGuard = function (req: any, res: Response, next: any) {
  const token = req.query['tamaraToken'];
  const jwtSecret = process.env.TAMARA_NOTIFICATION_PRIVATE_KEY;
  if (token) {
    jwt.verify(
      token as string,
      jwtSecret,
      (err: jwt.VerifyErrors, decoded: jwt.JwtPayload) => {
        if (err) {
          return res
            .status(401)
            .send({ auth: false, message: Constants.ERROR_MAP.TOKEN_EXPIRED });
        } else {
          req.tamaraData = decoded;
          next();
        }
      }
    );
  } else
    return res.status(401).send({ auth: false, message: 'No token provided.' });
};
