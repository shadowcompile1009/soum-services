import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Constants } from '../constants/constant';
import { ErrorResponseDto } from '../dto/errorResponseDto';

export const AuthUserGuard = function (req: any, res: any, next: any) {
  const token = req.headers['token'];

  if (!token)
    return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(
    token as string,
    process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY,
    (err: jwt.VerifyErrors, decoded: jwt.JwtPayload) => {
      // check for error
      if (!err) {
        // get expired date
        const dateNow = moment().unix();
        const expiryDate = +decoded.iat + Constants.EXPIRES;

        // check expiration
        if (dateNow < expiryDate) {
          // set user
          req.user = decoded;
        } else {
          const error = new ErrorResponseDto(
            Constants.ERROR_CODE.UNAUTHORIZED,
            Constants.ERROR_TYPE.API,
            Constants.ERROR_MAP.TOKEN_EXPIRED
          );
          return res.sendError(error);
        }
      } else {
        const error = new ErrorResponseDto(
          Constants.ERROR_CODE.UNAUTHORIZED,
          Constants.ERROR_TYPE.API,
          Constants.ERROR_MAP.UNAUTHORIZED
        );
        return res.sendError(error);
      }

      // keep moving
      next();
    }
  );
};
