import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductCommissionService } from './product-commission.service';
import {
  CreateCommissionSummaryRequest,
  CommissionSummaryResponse,
  ProductCommissionSummaryRequest,
  ProductCommissionSummaryResponse,
  CalculateCommissionSummaryRequest,
  CalculateCommissionSummaryResponse,
} from '../grpc/proto/commission.pb';

@Controller('product-commission')
export class ProductCommissionController {
  constructor(
    private readonly productCommissionService: ProductCommissionService,
  ) {}

  @Post()
  async calculateAndSaveCommission(
    @Body() payload: CreateCommissionSummaryRequest,
  ): Promise<CommissionSummaryResponse> {
    return this.productCommissionService.calculateAndSaveCommission(
      payload,
      null,
    );
  }
  @Post()
  async calculateCommissions(
    @Body() payload: CalculateCommissionSummaryRequest,
  ): Promise<CalculateCommissionSummaryResponse> {
    return this.productCommissionService.calculateCommissions(
      { ...payload, order: null, addOns: null, paymentOption: null },
      null,
      payload.allPayments,
    );
  }

  @Get()
  async getProductCommissionSummary(
    @Query() query: any,
  ): Promise<ProductCommissionSummaryResponse[]> {
    const payload: ProductCommissionSummaryRequest = {
      ...query,
    };
    const offset = +query.offset || 0;
    const limit = +query.limit || 100;
    return this.productCommissionService.getCommissions(payload, limit, offset);
  }

  @Get('/installment-plan')
  async paymentBreakdown(@Query() query: any): Promise<any> {
    const { paymentProvideType, paymentAmount } = query;
    return this.productCommissionService.getInstallmentPlan(
      paymentProvideType,
      paymentAmount,
    );
  }
}
