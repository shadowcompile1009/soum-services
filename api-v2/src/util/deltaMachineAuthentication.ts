import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import { UserJWTTokenInput } from '../models/DeltaMachineUsers';
import { Constants } from '../constants/constant';
export function jwtSignIn(
  ip: string,
  user: UserJWTTokenInput,
  isAccessToken: boolean = true
) {
  return jwt.sign(
    {
      iat: moment().subtract(30, 's').unix(),
      expiresIn: isAccessToken
        ? Constants.EXPIRES
        : Constants.REFRESH_TOKEN_EXPIRES,
      expiryDate: isAccessToken
        ? moment().add(Constants.EXPIRES, 's').format()
        : moment().add(Constants.REFRESH_TOKEN_EXPIRES, 's').format(),
      ip: ip,
      userId: user.id,
      roleId: user.roleId,
      userName: user.userName,
    },
    process.env.PRIVATE_KEY_AUTHENTICATION
  );
}

export function getUserIdFromToken(token: string): string {
  const decoded: JwtPayload = jwt.verify(
    token,
    process.env.PRIVATE_KEY_AUTHENTICATION
  ) as JwtPayload;
  return decoded.userId;
}

export function getUserIdFromTokenForNonAdminUsers(token: string): string {
  const decoded: JwtPayload = jwt.verify(
    token,
    process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
  ) as JwtPayload;
  return decoded.id;
}

export function jwtVerify(token: string): JwtPayload {
  const decoded: JwtPayload = jwt.verify(
    token,
    process.env.PRIVATE_KEY_AUTHENTICATION
  ) as JwtPayload;
  return decoded;
}
