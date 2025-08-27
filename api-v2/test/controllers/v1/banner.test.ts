import request from 'supertest';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { _get } from '../../../src/util/common';
import { creds } from '../../_data/creds';
import { TestConstants } from '../../constants';

const baseURL = TestConstants.BASE_URL;

let token = '';
let testBannerId = '';
beforeAll(async () => {
  const response = await request(app)
    .post(baseURL + '/authentication/login')
    .set('Accept', 'application/json')
    .set({
      'client-id': 'admin-web',
    })
    .send({
      email: creds.email,
      password: creds.password,
    });
  token = _get(response, 'body.responseData.token', '');
});

describe('POST /rest/api/v1/banner/', () => {
  test('should return 201 when adding banner successful', async () => {
    const response = await request(app)
      .post(baseURL + '/banner')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        banner_name: 'Season deals',
        banner_page: 'home',
        banner_type: 'mpp',
        banner_value: '6362359ab8a771d21288c1f5',
        region: 'ksa',
        lang: 'ar',
      });
    testBannerId = response.body.responseData._id;
    expect(response.statusCode).toBe(201);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.BANNER_CREATE_SUCCESS
    );
    expect(response.body.data).not.toBeNull();
    expect(response.body.responseData.status).toEqual('active');
  });
});

describe('GET /rest/api/v1/banner/', () => {
  test('should return 200 all banners', async () => {
    const response = await request(app)
      .get(baseURL + '/banner')
      .set('Accept', 'application/json')
      .query({
        bannerPage: 'home',
        region: 'ksa',
        lang: 'ar',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(Constants.MESSAGE.GET_BANNER_SUCCESS);
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData?.length).toBeGreaterThan(0);
  });
});

describe('PUT /rest/api/v1/banner/position', () => {
  test('should return 200 update banner position successful', async () => {
    const response = await request(app)
      .put(baseURL + `/banner/position`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send([
        {
          id: `${testBannerId}`,
          position: 1,
        },
      ]);
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.BANNER_UPDATE_SUCCESS
    );
    expect(response.body.responseData).not.toBeNull();
  });
});

describe('DELETE /rest/api/v1/banner/:bannerId', () => {
  test('should return 200 remove banner successful', async () => {
    const response = await request(app)
      .delete(baseURL + `/banner/${testBannerId}`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.BANNER_REMOVED_SUCCESSFULLY
    );
  });
});
