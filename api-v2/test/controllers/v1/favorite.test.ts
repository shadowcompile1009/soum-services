import request from 'supertest';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
const baseURL = '/rest/api/v1';

describe('POST /rest/api/v1/favorite/', () => {
  test('should return 200 OK', async () => {
    const response = await request(app)
      .get(baseURL + '/favorite')
      .set('Accept', 'application/json')
      .set({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJpYXQiOjE2MjkzNTg3MTMsImV4cGlyZXNJbiI6NDMyMCwiaXAiOiI6OjEiLCJl' +
          'bWFpbF9hZGRyZXNzIjoidGVzdGVyQHlvcG1haWwuY29tIiwidXNlcm5hbWUiOiJ0ZXN0' +
          'ZXIiLCJpZCI6IjYxMTBlZjY5OWZlNjk4MTA4YzA4NTQ5MCJ9.HvyR0DQTooBTElpTkkfqJaeZ4P81tmnKDewHxd0Ibi4',
      })
      .send({
        productId: '6064064a929f92c76a347b13',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });
});

describe('DELETE /rest/api/v1/favorite', () => {
  test('should return 200 remove product from favorites successful', async () => {
    const response = await request(app)
      .delete(baseURL + `/favorite/`)
      .set('Accept', 'application/json')
      .set({
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
          'eyJpYXQiOjE2MjkzNTg3MTMsImV4cGlyZXNJbiI6NDMyMCwiaXAiOiI6OjEiLCJl' +
          'bWFpbF9hZGRyZXNzIjoidGVzdGVyQHlvcG1haWwuY29tIiwidXNlcm5hbWUiOiJ0ZXN0' +
          'ZXIiLCJpZCI6IjYxMTBlZjY5OWZlNjk4MTA4YzA4NTQ5MCJ9.HvyR0DQTooBTElpTkkfqJaeZ4P81tmnKDewHxd0Ibi4',
      });
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toEqual(
      Constants.MESSAGE.FAVORITE_PRODUCT_NOT_FOUND
    );
  });
});
