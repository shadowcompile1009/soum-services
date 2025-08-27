import { Constants } from '../../../src/constants/constant';
import { OrderRepository } from '../../../src/repositories/orderRepository';
import { orderTabbyType } from '../../_data/order';
import { OrderModel } from '../../../src/models/Order';
import { ErrorResponseDto } from '../../../src/dto/errorResponseDto';

const orderRepository = new OrderRepository();

const mockResponseErrRefundTabbyOrder = jest.fn();
mockResponseErrRefundTabbyOrder.mockReturnValueOnce(
  new ErrorResponseDto(
    Constants.ERROR_CODE.BAD_REQUEST,
    Constants.ERROR_TYPE.API,
    Constants.ERROR_MAP.FAILED_TO_MAKE_INSTANT_REFUND_TABBY_TYPE
  )
);

describe('POST /rest/api/v1/dm-orders/refund/{orderId}', () => {
  test('should return 400 because of tabby payment type which not allow to instant refund', async () => {
    const mockGetOrderById = jest.spyOn(OrderModel, 'findById');
    mockGetOrderById.mockImplementation((orderId: string) => {
      expect(orderId).toEqual('62011a0856369558e66ca207');
      return orderTabbyType as any;
    });

    const mockGetOrderWithTabbyType = jest.spyOn(orderRepository, 'getById');
    mockGetOrderWithTabbyType.mockImplementation((orderId: string) => {
      expect(orderId).toEqual('62011a0856369558e66ca207');
      return Promise.resolve([
        false,
        { code: Constants.SUCCESS_CODE.SUCCESS, result: orderTabbyType as any },
      ]);
    });
    const [err, response] = await orderRepository.getById(
      '62011a0856369558e66ca207'
    );
    expect(err).toBe(false);
    expect(response.code).toBe(Constants.SUCCESS_CODE.SUCCESS);

    const data: ErrorResponseDto = mockResponseErrRefundTabbyOrder();
    expect(data.errorCode).toBe(Constants.ERROR_CODE.BAD_REQUEST);
    expect(data.errorKey).toBe(
      Constants.ERROR_MAP.FAILED_TO_MAKE_INSTANT_REFUND_TABBY_TYPE
    );
  });
});
