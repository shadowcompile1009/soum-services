import request from 'supertest';
import { Container } from 'typedi';
import app from '../../../src/app';
import { Constants } from '../../../src/constants/constant';
import { InvoiceRepository } from '../../../src/repositories/invoiceRepository';
import { OrderRepository } from '../../../src/repositories/orderRepository';
import {
  detailBuyerOrderHasNullPromo,
  detailSellerOrder,
  existingBuyerInvoiceHasNoPromo,
  existingSellerInvoice,
} from '../../_data/invoice';

const baseURL = '/rest/api/v1';

describe('POST /rest/api/v1/order/{orderId}', () => {
  test('should return 200 OK with invoice detail for seller which none discount', async () => {
    const mockGetOrderDataForInvoice = jest.spyOn(
      Container.get(OrderRepository),
      'getOrderDataForGeneratingInvoice'
    );
    mockGetOrderDataForInvoice.mockImplementation((orderId: string) => {
      expect(orderId).toEqual('607031b81f2faf7520d109c5');
      return Promise.resolve([
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: detailSellerOrder },
      ]);
    });

    const mockGetInvoiceWithOrderId = jest.spyOn(
      Container.get(InvoiceRepository),
      'getInvoiceWithOrderId'
    );
    mockGetInvoiceWithOrderId.mockImplementation((orderId: string) => {
      expect(orderId).toEqual('607031b81f2faf7520d109c5');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: existingSellerInvoice as any,
        },
      ]);
    });

    const response = await request(app)
      .get(baseURL + `/order/607031b81f2faf7520d109c5?type=seller`)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
  });

  test('should return 200 OK (#4 SGSE-208) buyer invoice detail which has null value in promo code', async () => {
    const mockGetOrderDataForInvoice = jest.spyOn(
      Container.get(OrderRepository),
      'getOrderDataForGeneratingInvoice'
    );
    mockGetOrderDataForInvoice.mockImplementation((orderId: string) => {
      expect(orderId).toEqual('611bbd978582ab289b4e4392');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: detailBuyerOrderHasNullPromo,
        },
      ]);
    });

    const mockGetInvoiceWithOrderId = jest.spyOn(
      Container.get(InvoiceRepository),
      'getInvoiceWithOrderId'
    );
    mockGetInvoiceWithOrderId.mockImplementation((orderId: string) => {
      expect(orderId).toEqual('611bbd978582ab289b4e4392');
      return Promise.resolve([
        false,
        {
          code: Constants.SUCCESS_CODE.SUCCESS,
          result: existingBuyerInvoiceHasNoPromo as any,
        },
      ]);
    });

    const response = await request(app)
      .get(baseURL + `/order/611bbd978582ab289b4e4392?type=buyer`)
      .set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeNull();
  });
});
