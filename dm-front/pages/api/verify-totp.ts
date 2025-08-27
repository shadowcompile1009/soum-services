import { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { apiClientV2 } from '@/api/index';
import { UserEndpoints } from '@/models/User';
import { setSessionData } from '@/helpers/setSessionData';

export default async function verifyTotp(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const result = await apiClientV2.client.post(
      UserEndpoints.adminverifyTotp,
      req.body
    );

    const { data } = result;
    if (data.status !== 'success') {
      res.status(400).send({
        error: 'LOGIN_FAILED',
      });
      return;
    }

    const { token, username, userId, roleName, roleId } = data.responseData;

    if (!token) {
      res.status(400).send({
        error: 'LOGIN_FAILED',
      });
      return;
    }

    setSessionData({
      response: res,
      token,
      username,
      roleName,
      roleId,
      userId,
    });

    res.status(200).send({
      ...data?.responseData,
    });
  } catch (error) {
    if (error instanceof AxiosError) {
      res
        .status(Number(error.response?.status))
        .send(error.response?.statusText);
      return;
    }

    const serverError = new Error('Something went wrong');
    res.status(500).send(serverError);
  }
}
