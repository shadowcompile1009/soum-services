import request from 'supertest';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { _get } from '../../../src/util/common';

const baseURL = '/rest/api/v1';

let token = '';
let testSettingId = '';
beforeAll(async () => {
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
  token = _get(response, 'body.responseData.token', '');
});

describe('POST /rest/api/v1/setting/', () => {
  test('should return 201 when adding Setting successful', async () => {
    const response = await request(app)
      .post(baseURL + '/setting')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        name: 'border-width',
        description: 'The width of border',
        type: 'string',
        category: 'Global',
        value: '3px',
        status: 'Enabled',
      });

    testSettingId = response.body.responseData._id;
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.SETTING_ADD_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData.name).toEqual('border-width');
  });
});

describe('GET /rest/api/v1/setting/', () => {
  test('should return 200 get all settings', async () => {
    const response = await request(app)
      .get(baseURL + '/setting')
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.SETTING_GET_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData?.length).toBeGreaterThan(0);
  });
});

describe('PUT /rest/api/v1/setting/:settingId', () => {
  test('should return 200 update setting successful', async () => {
    const response = await request(app)
      .put(baseURL + `/setting/${testSettingId}`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        description: 'The standard width of border',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.SETTING_UPDATED_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData.description).toEqual(
      'The standard width of border'
    );
  });
});

describe('DELETE /rest/api/v1/setting/:settingId', () => {
  test('should return 200 remove setting successful', async () => {
    const response = await request(app)
      .delete(baseURL + `/setting/${testSettingId}`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.SETTING_REMOVED_SUCCESS
    );
  });
});
describe('GET /rest/api/v1/setting/region/value', () => {
  test('should return 200 get region settings', async () => {
    const response = await request(app)
      .get(baseURL + '/setting')
      .set('Accept', 'application/json');

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.SETTING_GET_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
  });
});
