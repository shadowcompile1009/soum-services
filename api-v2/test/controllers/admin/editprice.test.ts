import request from 'supertest';
import Container from 'typedi';
import app from '../../../src/app';
import { _get } from '../../../src/util/common';
import { Constants } from '../../../src/constants/constant';
import { ProductRepository } from '../../../src/repositories/productRepository';
import { AdminChangePriceHistoryRepository } from '../../../src/repositories/adminChangePriceHistoryRepository';
import { ProductService } from '../../../src/services/productService';
import {
  getEditListingProduct,
  updatePriceListingProduct,
  getUserRequestInfo,
  createEditBidPriceLog,
  productHasAcceptedBid,
  productHasSellStatusSold,
  productHasActiveBid,
} from '../../_data/adminEditPrice';
import { AdminRepository } from '../../../src/repositories/adminRepository';

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

describe('PUT /rest/api/v1/product/{productId}/price', () => {
  test('should return 200 OK with edited product detail', async () => {
    const mockGetEditProduct = jest.spyOn(
      Container.get(ProductRepository),
      'getEditListingProduct'
    );
    mockGetEditProduct.mockImplementation((productId: string) => {
      expect(productId).toEqual('60d23755ddd9c4d7dcaa1cbc');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getEditListingProduct as any,
        },
      ]);
    });

    const mockUpdatePriceProduct = jest.spyOn(
      Container.get(ProductRepository),
      'updatePriceListing'
    );
    mockUpdatePriceProduct.mockImplementation(
      (productId: string, sellPrice: number, bidPrice: number) => {
        expect(productId.toString()).toEqual('60d23755ddd9c4d7dcaa1cbc');
        expect(typeof sellPrice).toBe('number');
        expect(typeof bidPrice).toBe('number');
        return Promise.resolve([
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: updatePriceListingProduct as any,
          },
        ]);
      }
    );

    const mockGetRequestUserInfo = jest.spyOn(
      Container.get(AdminRepository),
      'getById'
    );
    mockGetRequestUserInfo.mockImplementation((userId: string) => {
      expect(userId.toString()).toEqual('612ddb16089d7528d3a6fa22');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: getUserRequestInfo as any,
        },
      ]);
    });

    const mockCreateAdminLog = jest.spyOn(
      Container.get(AdminChangePriceHistoryRepository),
      'createLog'
    );
    mockCreateAdminLog.mockImplementation(
      (userId: string, productId: string, des: string) => {
        expect(userId.toString()).toEqual('612ddb16089d7528d3a6fa22');
        expect(productId.toString()).toEqual('60d23755ddd9c4d7dcaa1cbc');
        expect(typeof des).toBe('string');
        return Promise.resolve([
          false,
          {
            code: Constants.SUCCESS_CODE.SUCCESS,
            result: createEditBidPriceLog as any,
          },
        ]);
      }
    );

    const mockInsertAdminLog = jest.spyOn(
      Container.get(ProductService),
      'insertAdminLog'
    );
    mockInsertAdminLog.mockImplementation(
      (
        currentPrice: number,
        newPrice: number,
        editorName: string,
        userId: string,
        productId: string,
        logType: string
      ) => {
        expect(typeof currentPrice).toBe('number');
        expect(typeof newPrice).toBe('number');
        expect(typeof editorName).toBe('string');
        expect(userId.toString()).toEqual('612ddb16089d7528d3a6fa22');
        expect(productId.toString()).toEqual('60d23755ddd9c4d7dcaa1cbc');
        expect(typeof logType).toBe('string');
        return Promise.resolve(true);
      }
    );

    const response = await request(app)
      .put(baseURL + '/product/60d23755ddd9c4d7dcaa1cbc/price')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        sell_price: 35,
        bid_price: 22,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
  });

  test('should return 400 with product has accepted bid', async () => {
    const mockGetEditProduct = jest.spyOn(
      Container.get(ProductRepository),
      'getEditListingProduct'
    );
    mockGetEditProduct.mockImplementation((productId: string) => {
      expect(productId).toEqual('61cdb0224a386f3c35d15078');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: productHasAcceptedBid as any,
        },
      ]);
    });

    const response = await request(app)
      .put(baseURL + '/product/61cdb0224a386f3c35d15078/price')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        sell_price: 35,
        bid_price: 22,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.violations[0].message).toEqual(
      'Product has accepted bid'
    );
    expect(response.body.responseData).toBeNull();
  });

  test('should return 400 with product be sold', async () => {
    const mockGetEditProduct = jest.spyOn(
      Container.get(ProductRepository),
      'getEditListingProduct'
    );
    mockGetEditProduct.mockImplementation((productId: string) => {
      expect(productId).toEqual('6064066e929f922184347b15');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: productHasSellStatusSold as any,
        },
      ]);
    });

    const response = await request(app)
      .put(baseURL + '/product/6064066e929f922184347b15/price')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        sell_price: 35,
        bid_price: 22,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.violations[0].message).toEqual(
      'Unable to edit price, product sold'
    );
    expect(response.body.responseData).toBeNull();
  });

  test('should return 400 with product has active bid', async () => {
    const mockGetEditProduct = jest.spyOn(
      Container.get(ProductRepository),
      'getEditListingProduct'
    );
    mockGetEditProduct.mockImplementation((productId: string) => {
      expect(productId).toEqual('614a38a14cb19e73f1c5770f');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: productHasActiveBid as any,
        },
      ]);
    });

    const response = await request(app)
      .put(baseURL + '/product/614a38a14cb19e73f1c5770f/price')
      .set('Accept', 'application/json')
      .set({
        token: adminToken,
        'client-id': 'admin-web',
      })
      .send({
        sell_price: 35,
        bid_price: 22,
      });
    expect(response.statusCode).toBe(400);
    expect(response.body.violations[0].message).toEqual(
      'You have active bids, please reject your active bids before editing'
    );
    expect(response.body.responseData).toBeNull();
  });
});
