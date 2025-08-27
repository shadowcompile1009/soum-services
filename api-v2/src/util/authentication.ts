import crypto from 'crypto';
import cryptoJS from 'crypto-js';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import _isEmpty from 'lodash/isEmpty';
import _get from 'lodash/get';
import { Constants } from '../constants/constant';
import { Admin, AdminDocument } from '../models/Admin';
import { LegacyUser, UserLegacyDocument } from '../models/LegacyUser';
import moment from 'moment';
import { getUser } from '../middleware/authGuardDM';
import { DeltaMachineUserDocument } from '../models/DeltaMachineUsers';

export function isFromAdminRequest(req: Request) {
  return (_get(req.headers, 'client-id', '') as string).trim() === 'admin-web';
}
export function isWebRequest(req: Request) {
  return (_get(req.headers, 'client-id', '') as string).trim() === 'client-web';
}
export function encrypt_string(incoming_string: string, isAdminRule: boolean) {
  const secret = isAdminRule
    ? process.env.JWT_SECRET_KEY_ADMIN
    : process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY;
  // set up hash
  const hash_string = crypto
    .createHash('md5')
    .update(secret, 'utf-8')
    .digest('hex')
    .toUpperCase();

  // build iv
  const iv = Buffer.alloc(16);

  // set up cipher
  const cipher = crypto.createCipheriv('aes-256-cbc', hash_string, iv);

  // set up encrypted data cipher
  const encryptedData =
    cipher.update(incoming_string, 'utf8', 'hex') + cipher.final('hex');

  // return encrypted data
  return encryptedData.toUpperCase();
}

export async function authorize(
  clientId: string,
  decoded: any
): Promise<
  [
    boolean,
    {
      code: number;
      result:
        | string
        | AdminDocument
        | UserLegacyDocument
        | DeltaMachineUserDocument;
    }
  ]
> {
  if (clientId !== 'admin-web') {
    const userId = decoded.id || decoded.userId;
    if (_isEmpty(userId)) {
      return [
        false,
        { code: Constants.ERROR_CODE.UNAUTHORIZED, result: 'Token is invalid' },
      ];
    }
    const user = await LegacyUser.findById(userId).exec();
    if (!_isEmpty(user)) {
      // We don't authorized the frontend user, but will in future.
      return [true, { code: 200, result: user }];
    }
    return [
      false,
      { code: Constants.ERROR_CODE.UNAUTHORIZED, result: 'User not found' },
    ];
  } else {
    const [isNotAuthorized, returned] = await getUser(decoded.userId);
    if (isNotAuthorized) {
      return [
        false,
        { code: Constants.ERROR_CODE.UNAUTHORIZED, result: 'User not found' },
      ];
    }
    return [true, { code: 200, result: returned.result }];
  }
}

export function isAdminAccess(req: Request) {
  const clientId = _get(req.headers, 'client-id', '');
  return clientId === 'admin-web' && !_isEmpty(_get(req, 'userInfo', null));
}

export function generateJWT(
  user: UserLegacyDocument | AdminDocument,
  ip: string = '',
  adminSecret: boolean = false
) {
  const email = user instanceof Admin ? (user as AdminDocument).email : '';
  const token = jwt.sign(
    {
      iat: moment().subtract(30, 's').unix(),
      expiresIn: Constants.EXPIRES,
      ip: ip,
      email_address: email,
      id: user._id,
    },
    adminSecret
      ? process.env.JWT_SECRET_KEY_ADMIN
      : process.env.JWT_ACCESS_TOKEN_PUBLIC_KEY
  );

  return token;
}

export const encryptMobilePhone = (mobilePhone: string): string => {
  const encryptedValue = cryptoJS.AES.encrypt(
    mobilePhone,
    process.env.PHONE_NUMBER_SECRET || 'FB-WebEngage-MobileNumber'
  );
  return encryptedValue.toString();
};

export const decryptMobilePhone = (encryptedData: string): string => {
  const decryptedValue = cryptoJS.AES.decrypt(
    encryptedData,
    process.env.PHONE_NUMBER_SECRET || 'FB-WebEngage-MobileNumber'
  );
  return decryptedValue.toString(cryptoJS.enc.Utf8);
};
