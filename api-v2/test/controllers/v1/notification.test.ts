import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { UserRepository } from '../../../src/repositories/userRepository';
import { generateJWT } from '../../../src/util/authentication';
import { _get } from '../../../src/util/common';
import { getTestingUser } from '../../_data/user';
jest.mock('../../../src/libs/firebase', () => {
  const fireBaseOrigin = jest.requireActual('../../../src/libs/firebase');

  return {
    __esModule: true,
    ...fireBaseOrigin,
    sendMessageInBatchToDevices: jest.fn(() => {
      return Promise.resolve({
        responses: [
          {
            success: false,
            error: {
              code: 'messaging/registration-token-not-registered',
              message: 'Requested entity was not found.',
              toJSON: null,
            },
          },
        ],
        successCount: 0,
        failureCount: 1,
      });
    }),
  };
});
const baseURL = '/rest/api/v1';

let token = '';
let adminToken = '';
let user: any = null;
beforeAll(async () => {
  const mockGetTestingUserForNotification = jest.spyOn(
    Container.get(UserRepository),
    'findNotDeletedUserByMobile'
  );
  mockGetTestingUserForNotification.mockImplementation(
    (countryCode: string, phoneNumber: string) => {
      expect(countryCode).toEqual('966');
      expect(phoneNumber).toEqual('11111111111');
      return Promise.resolve([
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: getTestingUser },
      ]);
    }
  );

  const [err, authUser] = await Container.get(
    UserRepository
  ).findNotDeletedUserByMobile('966', '11111111111');
  if (!err) {
    user = authUser.result;
    token = generateJWT(user);
  }

  const response = await request(app)
    .post(baseURL + '/authentication/login')
    .set('Accept', 'application/json')
    .set({
      'client-id': 'admin-web',
    })
    .send({
      email: 't.nguyen@soum.sa',
      password: '123456',
    });
  adminToken = _get(response, 'body.responseData.token', '');
});

describe('POST /rest/api/v1/user/:userId/fcm', () => {
  test('should return 201 when adding Device token successful', async () => {
    const response = await request(app)
      .post(baseURL + `/user/${user._id}/fcm`)
      .set({
        token: token,
        'client-id': 'client-web',
      })
      .send({
        fcm_token: 'test_token',
        lang: 'ar',
        device_id: 'unique_device_id',
        platform: 'ios',
        app_version: 'string',
        status: 'Enabled',
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.DEVICE_TOKEN_ADD_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData.fcm_token).toEqual('test_token');
  });
});

describe('POST /rest/api/v1/user/:userId/fcm', () => {
  test('should return 400 when adding duplicate Device token', async () => {
    const response = await request(app)
      .post(baseURL + `/user/${user._id}/fcm`)
      .set({
        token: token,
        'client-id': 'client-web',
      })
      .send({
        device_id: 'unique_device_id',
        fcm_token: 'test_token',
        platform: 'ios',
        lang: 'en',
        app_version: 'string',
        status: 'Enabled',
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.DEVICE_TOKEN_DUPLICATE
    );
  });
});

describe('GET /rest/api/v1/user/:userId/fcm', () => {
  test('should return 200 get all user device tokens', async () => {
    const response = await request(app)
      .get(baseURL + `/user/${user._id}/fcm`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.DEVICE_TOKEN_GET_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData?.length).toBeGreaterThan(0);
  });
});

describe('PUT /rest/api/v1/notification/refresh-fcm', () => {
  test('should return 200 refresh device token successful', async () => {
    const response = await request(app)
      .put(baseURL + `/notification/refresh-fcm`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'client-web',
      })
      .send({
        user_id: user._id,
        fcm_token: 'test_token',
      });

    expect(response.body.message).toEqual(
      Constants.MESSAGE.DEVICE_TOKEN_UPDATED_SUCCESS
    );
    expect(response.statusCode).toBe(200);
    expect(response.body.responseData).not.toBeNull();
  });
});

describe('DELETE /rest/api/v1/user/:userId/fcm/', () => {
  test('should return 200 remove all device tokens of user successful', async () => {
    const response = await request(app)
      .delete(baseURL + `/user/${user._id}/fcm/`)
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.DEVICE_TOKEN_REMOVED_SUCCESS
    );
  });
});
