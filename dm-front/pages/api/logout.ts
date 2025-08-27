import { NextApiRequest, NextApiResponse } from 'next';
import { parseCookies } from 'nookies';

import { apiClientV1 } from '@/api/index';
import { UserEndpoints } from '@/models/User';
import { unsetSessionData } from '@/helpers/unSetSessionData';

export default async function logout(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const cookies = parseCookies({ req });
    const token = cookies['x-auth-token'];

    await apiClientV1.client.get(UserEndpoints.adminLogout, {
      headers: {
        token,
      },
    });

    unsetSessionData({ response: res });
    res.status(200).send({});
  } catch (error) {
    unsetSessionData({ response: res });
    res.status(200).send({});
  }
}
