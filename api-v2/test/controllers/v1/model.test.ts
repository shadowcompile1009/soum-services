import { Types } from 'mongoose';
import request from 'supertest';
import { Container } from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { BrandRepository } from '../../../src/repositories/brandRepository';
import { CategoryRepository } from '../../../src/repositories/categoryRepository';
import { ModelRepository } from '../../../src/repositories/modelRepository';
import { getBrandViaId } from '../../_data/brand';
import { getCategoryViaId } from '../../_data/category';
import { getIpadModel } from '../../_data/model';

const baseURL = '/rest/api/v1';

describe('POST /rest/api/v1/model/', () => {
  const mockGetCategoryById = jest.spyOn(
    Container.get(CategoryRepository),
    'getById'
  );
  mockGetCategoryById.mockImplementation((categoryId: string) => {
    expect(categoryId).toEqual('60661c60fdc090d1ce2d4914');
    return Promise.resolve([
      false,
      { code: Constants.SUCCESS_CODE.SUCCESS, result: getCategoryViaId as any },
    ]);
  });
  const mockGetBrandById = jest.spyOn(
    Container.get(BrandRepository),
    'getById'
  );
  mockGetBrandById.mockImplementation((brandId: string) => {
    expect(brandId).toEqual('6069faf484541d77f553167a');
    return Promise.resolve([
      false,
      { code: Constants.SUCCESS_CODE.SUCCESS, result: getBrandViaId as any },
    ]);
  });

  const mockGetModelsViaLinkedIdOfCategoryBrand = jest.spyOn(
    Container.get(ModelRepository),
    'getModelsViaLinkedIdOfCategoryBrand'
  );
  mockGetModelsViaLinkedIdOfCategoryBrand.mockImplementation(
    (categoryId: string, brandId: string) => {
      expect(categoryId).toEqual('60661c60fdc090d1ce2d4914');
      expect(brandId).toEqual('6069faf484541d77f553167a');
      return Promise.resolve([
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: getIpadModel as any },
      ]);
    }
  );

  test('should return 200 OK with list of brand linked category and brand', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/model?categoryId=60661c60fdc090d1ce2d4914&brandId=6069faf484541d77f553167a`
      )
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toEqual('success');
    expect(response.body.responseData.length).toBeGreaterThan(0);
  });

  test('should return 400 Bad Request with invalid category id', async () => {
    const response = await request(app)
      .get(
        baseURL +
          `/model?categoryId=${Types.ObjectId()}&brandId=6069faf484541d77f553167a`
      )
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(400);
    expect(response.body.status).toEqual('fail');
    expect(response.body.violations[0].message).toBe('Fail to get model');
  });
});
