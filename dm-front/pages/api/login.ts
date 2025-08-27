import { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { apiClientV2 } from '@/api/index';
import { UserEndpoints } from '@/models/User';

export default async function login(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const result = await apiClientV2.client.post(
      UserEndpoints.adminLogin,
      req.body
    );

    const { data } = result;
    if (data.status !== 'success') {
      res.status(400).send({
        error: 'LOGIN_FAILED',
      });
      return;
    }

    const { isMFAEnabled, userId } = data.responseData;

    res.status(200).send({
      isMFAEnabled,
      userId,
    });
    return;
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
