import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { _get } from '../../../src/util/common';
import { Constants } from '../../../src/constants/constant';
import { AdminChangePriceHistoryRepository } from '../../../src/repositories/adminChangePriceHistoryRepository';
import { adminEditPriceLog } from '../../_data/adminLog';

const baseURL = '/rest/api/v1';

let adminToken = '';
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
  adminToken = _get(response, 'body.responseData.token', '');
});

describe('GET /rest/api/v1/product/{productId}/log', () => {
  test('should return 200 OK with changed log history', async () => {
    const mockGetEditProduct = jest.spyOn(
      Container.get(AdminChangePriceHistoryRepository),
      'getAdminLog'
    );
    mockGetEditProduct.mockImplementation((productId: string) => {
      expect(productId).toEqual('60d23755ddd9c4d7dcaa1cbc');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: adminEditPriceLog as any,
        },
      ]);
    });

    const response = await request(app)
      .get(baseURL + '/product/60d23755ddd9c4d7dcaa1cbc/log')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
    expect(response.body.responseData?.length).toBeGreaterThan(0);
  });
});
