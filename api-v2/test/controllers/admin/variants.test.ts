import request from 'supertest';
import { Container } from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { _get } from '../../../src/util/common';
import { VariantRepository } from '../../../src/repositories/variantRepository';
import {
  createNewVariants,
  getListVariantLinkModelId,
  getVariantViaId,
  updateVariant,
} from '../../_data/variants';
import { VariantDocument } from '../../../src/models/Variant';

const baseURL = '/rest/api/v1';

let token = '';
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

describe('POST /rest/api/v1/variant/', () => {
  test('should return 201 when adding Variant successful', async () => {
    const mockCreateVariant = jest.spyOn(
      Container.get(VariantRepository),
      'createVarient'
    );
    mockCreateVariant.mockImplementation((newVariant: VariantDocument) => {
      expect(newVariant.category_id?.length).toBeGreaterThan(0);
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: createNewVariants as any,
        },
      ]);
    });

    const response = await request(app)
      .post(baseURL + '/variant')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        varientAr: '32GB',
        status: 'Active',
        categoryId: '6063f95f929f926b67347b0d',
        brandId: '60640602929f92968a347b12',
        modelId: '6064064a929f92c76a347b13',
        varientEn: '32GB',
        position: 1,
        currentPrice: 7877,
      });
    const result = response.body.responseData?.result;
    expect(response.statusCode).toBe(200);
    expect(response.body.responseData).not.toBeNull();
    expect(result).not.toBeNull();
    expect(result.model_id).not.toBeNull;
    expect(result.brand_id).not.toBeNull;
    expect(result.category_id).not.toBeNull;
    expect(result.current_price).not.toBeNull;
    expect(result.varient).not.toBeNull;
  });
});

describe(`GET /rest/api/v1/variant?modelId`, () => {
  test('should return 200 get all Varients based on modelId', async () => {
    const mockVariantViaModelId = jest.spyOn(
      Container.get(VariantRepository),
      'getVariantViaModelId'
    );
    mockVariantViaModelId.mockImplementation((modelId: string) => {
      expect(modelId).toBe('6064064a929f92c76a347b13');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getListVariantLinkModelId as any,
        },
      ]);
    });
    const response = await request(app)
      .get(baseURL + `/variant?modelId=6064064a929f92c76a347b13`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData?.result).not.toBeNull();
  });
});

describe(`GET /rest/api/v1/variant/:varientId`, () => {
  test('should return 200 get all Varients based on variantId', async () => {
    const mockGetVariantViaId = jest.spyOn(
      Container.get(VariantRepository),
      'getById'
    );
    mockGetVariantViaId.mockImplementation((variantId: string) => {
      expect(variantId).toBe('6346678b2a6f2a003428d5bb');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getVariantViaId as any,
        },
      ]);
    });
    const response = await request(app)
      .get(baseURL + `/variant/6346678b2a6f2a003428d5bb`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      });
    const result = response.body.responseData;
    expect(response.statusCode).toBe(200);
    expect(response.body.responseData).not.toBeNull();
    expect(result).not.toBeNull();
    expect(result.model_id).not.toBeNull;
    expect(result.brand_id).not.toBeNull;
    expect(result.category_id).not.toBeNull;
    expect(result.current_price).not.toBeNull;
    expect(result.varient).not.toBeNull;
  });
});

describe('PUT /rest/api/v1/variant/:varientId', () => {
  test('should return 200 update variant successful', async () => {
    const mockUpdateVariantViaId = jest.spyOn(
      Container.get(VariantRepository),
      'updateVarient'
    );
    mockUpdateVariantViaId.mockImplementation(
      (variantId: string, updatedVariant: VariantDocument) => {
        expect(variantId).toBe('6346678b2a6f2a003428d5bb');
        expect(updatedVariant.category_id?.length).toBeGreaterThan(0);
        return Promise.resolve([
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: updateVariant as any,
          },
        ]);
      }
    );
    const response = await request(app)
      .put(baseURL + `/variant/6346678b2a6f2a003428d5bb`)
      .set('Accept', 'application/json')
      .set({
        token: token,
        'client-id': 'admin-web',
      })
      .send({
        varientAr: '128GB',
        status: 'Active',
        categoryId: '6063f95f929f926b67347b0d',
        brandId: '60640602929f92968a347b12',
        modelId: '6064064a929f92c76a347b13',
        varientEn: '128GB',
        position: 1,
        currentPrice: 7877,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.responseData).not.toBeNull();
    expect(response.body.responseData?.result).not.toBeNull();
  });
});
