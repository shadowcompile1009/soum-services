import { setCookie } from 'nookies';

import { ISessionData } from '@/types';

export function setSessionData(sessionData: ISessionData) {
  const { token, username, roleName, roleId, userId, response } = sessionData;

  setCookie({ res: response }, 'x-auth-token', token, {
    maxAge: 3 * 24 * 60 * 60,
    path: '/',
    sameSite: true,
    secure: true,
  });
  setCookie({ res: response }, 'x-user-name', username, {
    maxAge: 3 * 24 * 60 * 60,
    path: '/',
    sameSite: true,
    secure: true,
  });
  setCookie({ res: response }, 'x-user-roleName', roleName, {
    maxAge: 3 * 24 * 60 * 60,
    path: '/',
    sameSite: true,
    secure: true,
  });
  setCookie({ res: response }, 'x-user-roleId', roleId, {
    maxAge: 3 * 24 * 60 * 60,
    path: '/',
    sameSite: true,
    secure: true,
  });
  setCookie({ res: response }, 'x-user-id', userId, {
    maxAge: 3 * 24 * 60 * 60,
    path: '/',
    sameSite: true,
    secure: true,
  });
}
