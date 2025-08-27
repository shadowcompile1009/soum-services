import request from 'supertest';
import app from '../../../src/app';
import { Brand } from '../../../src/models/Brand';

const baseURL = '/rest/api/v1';
let categoryId: string;
let brandId: string;

beforeAll(async () => {
  const brand: any = await Brand.findOne({ status: 'Active' }).exec();
  categoryId = brand.category_id;
  brandId = brand?._id;
});

describe('GET /rest/api/v1/brand/brands', () => {
  test('should return 200 OK with all brands', async () => {
    const response = await request(app)
      .get(baseURL + '/brand/brands')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });
});

describe('GET /rest/api/v1/brand', () => {
  test('should return 200 OK', async () => {
    const response = await request(app)
      .get(baseURL + '/brand/' + brandId)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
  });
});

describe('GET /rest/api/v1/brand/{categoryId}', () => {
  test('should return 200 OK with list of brand linked category id', async () => {
    const response = await request(app)
      .get(baseURL + `/brand/category/${categoryId}`)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });

  test('should return 400 Bad Request with invalid category id', async () => {
    const response = await request(app)
      .get(baseURL + '/brand/category/6063f95f929f926b67347123')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe(
      'Category id is not found'
    );
  });
});
