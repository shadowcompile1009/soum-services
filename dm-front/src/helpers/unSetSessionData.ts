import { destroyCookie } from 'nookies';

import { ISessionData } from '@/types';

export function unsetSessionData(sessionData: Pick<ISessionData, 'response'>) {
  const { response } = sessionData;

  destroyCookie({ res: response }, 'x-auth-token', {
    path: '/',
    sameSite: true,
    secure: true,
  });

  destroyCookie({ res: response }, 'x-user-name', {
    path: '/',
    sameSite: true,
    secure: true,
  });

  destroyCookie({ res: response }, 'x-user-roleName', {
    path: '/',
    sameSite: true,
    secure: true,
  });

  destroyCookie({ res: response }, 'x-user-roleId', {
    path: '/',
    sameSite: true,
    secure: true,
  });

  destroyCookie({ res: response }, 'x-user-id', {
    path: '/',
    sameSite: true,
    secure: true,
  });
}
