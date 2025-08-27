import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { CategoryRepository } from '../../../src/repositories/categoryRepository';
import { getAllActiveCategory, getCategoryViaId } from '../../_data/category';

const baseURL = '/rest/api/v1';

describe('GET /rest/api/v1/category', () => {
  test('should return 200 OK', async () => {
    const mockGetAllActiveCategory = jest.spyOn(
      Container.get(CategoryRepository),
      'getAllCategory'
    );
    mockGetAllActiveCategory.mockImplementation(() => {
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getAllActiveCategory as any,
        },
      ]);
    });
    const response = await request(app)
      .get(baseURL + '/category')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });
});

describe('GET /rest/api/v1/category/{categoryId}', () => {
  test('should return 200 OK with valid product id', async () => {
    const mockGetCategoryById = jest.spyOn(
      Container.get(CategoryRepository),
      'getById'
    );
    mockGetCategoryById.mockImplementation((categoryId: string) => {
      expect(categoryId).toEqual('60661c60fdc090d1ce2d4914');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getCategoryViaId as any,
        },
      ]);
    });
    const response = await request(app)
      .get(baseURL + `/category/60661c60fdc090d1ce2d4914`)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData._id).toEqual('60661c60fdc090d1ce2d4914');
  });

  test('should return 400 Bad Request with invalid category id', async () => {
    const response = await request(app)
      .get(baseURL + '/category/6063f95f929f926b67347b12')
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe('Fail to get category');
  });
});

describe('PUT /rest/api/v1/category/{categoryId}', () => {
  // test("should return 200 OK with updated category", async () => {
  //   const response = await request(app).put(baseURL + "/category/6063fa7b929f92496d347b0f")
  //     .set('Content-type', 'multipart/form-data')
  //     .field("category_name_en", "Smart Watch")
  //     .field("category_name_ar", "ساعة ذكية")
  //     .field("status", "Active")
  //     .field("category_icon", "")
  //     .field("listing_photo", "")
  //     .field("browsing_photo", "")
  //     .field("position", 5);
  //   expect(response.statusCode).toBe(200);
  //   expect(response.body.status).toEqual("success");
  // });

  test('should return 400 Bad request with invalid category id', async () => {
    const response = await request(app)
      .put(baseURL + '/category/6063fa7b929f92496d347234')
      .set('Content-type', 'multipart/form-data')
      .field('category_name_en', 'Smart Watch')
      .field('category_name_ar', 'ساعة ذكية')
      .field('status', 'Active')
      .field('category_icon', '')
      .field('listing_photo', '')
      .field('browsing_photo', '')
      .field('position', 5);
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe(
      'Category id is not found'
    );
  });
});
