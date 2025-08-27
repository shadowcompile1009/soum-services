import { Controller, Get, Query, Req } from '@nestjs/common';
import { OrderService } from './order.service';
import { CustomResponse, CustomResponseStatus } from '@src/customResponse';
import { CustomCodeErrors } from '@src/customErrorCodes.enum';
import { PaginatedDto } from '@src/dto/paginated.dto';

@Controller('')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  @Get('recently-sold/products')
  async getRecentlySoldProducts(
    @Query()
    {
      hours = 6,
      limit = 10,
      offset = 0,
    }: {
      hours?: number;
      limit?: number;
      offset?: number;
    },
    @Req() request: any
  ) {
    try {
      const products = await this.orderService.getRecentlySoldProducts(
        hours,
        limit,
        offset,
        request?.query?.categoryId,
      );
      return {
        status: CustomResponseStatus.SUCCESS,
        data: {
          items: products,
          limit,
          offset,
          total: (products as []).length || 0,
        } as PaginatedDto<any>,
        code: 200,
      } as CustomResponse<any>;
    } catch (error) {
      console.log(error);
      return {
        status: CustomResponseStatus.FAIL,
        data: {
          items: [],
          limit: 10,
          offset: 0,
          total: 0,
        } as PaginatedDto<any>,
        code: 400,
        message: CustomCodeErrors.FAIL_GET_PRODUCTS,
      } as CustomResponse<any>;
    }
  }

  @Get('recently-sold/products/:categoryId')
  async getRecentlySoldProductsByCategory(
    @Query()
    {
      hours = 6,
      limit = 10,
      offset = 0,
    }: {
      hours?: number;
      limit?: number;
      offset?: number;
    },
    @Req() request: any
  ) {
    try {
      const products = await this.orderService.getRecentlySoldProductsByCategory(
        hours,
        limit,
        offset,
        request?.params?.categoryId,
      );
      return {
        status: CustomResponseStatus.SUCCESS,
        data: {
          items: products,
          limit,
          offset,
          total: (products as []).length || 0,
        } as PaginatedDto<any>,
        code: 200,
      } as CustomResponse<any>;
    } catch (error) {
      console.log(error);
      return {
        status: CustomResponseStatus.FAIL,
        data: {
          items: [],
          limit: 10,
          offset: 0,
          total: 0,
        } as PaginatedDto<any>,
        code: 400,
        message: CustomCodeErrors.FAIL_GET_PRODUCTS,
      } as CustomResponse<any>;
    }
  }
}
