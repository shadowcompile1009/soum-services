import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { MongoOrderIdDto } from '@src/dto/valid-order-id.dto';
import { GetStatusDto } from './dto/get-statuses.dto';
import {
  UpdateFinanceReasoningDto,
  UpdateOrderDto,
} from './dto/update-order.dto';
import { StatusSubmodule } from './enums/status.enum';
import { OrdersService } from './orders.service';

@Controller('orders')
@ApiTags('orders')
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get('/')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiQuery({ type: Number, name: 'offset' })
  @ApiQuery({ type: Number, name: 'limit' })
  @ApiQuery({ type: String, name: 'submodule' })
  async list(@Query() query: any) {
    const offset = +query.offset || 0;
    const limit = +query.limit || 30;
    let submodule: StatusSubmodule =
      query?.submodule?.toString() as StatusSubmodule;
    if (
      !submodule ||
      !Object.values(StatusSubmodule).includes(submodule as StatusSubmodule)
    ) {
      submodule = StatusSubmodule.ALL;
    }
    const statuses =
      (query.statuses?.toString() || '').length > 0
        ? (query.statuses?.toString() || '').split(',')
        : [];
    const orderType =
      (query.orderType?.toString() || '').length > 0
        ? (query.orderType?.toString() || '').split(',')
        : [];
    const operatingModel =
      (query.operatingModel?.toString() || '').length > 0
        ? (query.operatingModel?.toString() || '').split(',')
        : [];
    const sellerType =
      (query.sellerType?.toString() || '').length > 0
        ? (query.sellerType?.toString() || '').split(',')
        : [];
    const sellerCategory =
      (query.sellerCategory?.toString() || '').length > 0
        ? (query.sellerCategory?.toString() || '').split(',')
        : [];
    return this.service.list(
      submodule,
      limit,
      offset,
      statuses,
      orderType,
      operatingModel,
      sellerType,
      sellerCategory,
      query.q,
      query.startDate,
      query.endDate,
    );
  }

  @Get('/:dmOrderId/statuses/:submodule')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async listByDmOrderId(@Param() params: GetStatusDto) {
    return this.service.listByDmOrderId(params.dmOrderId, params.submodule);
  }

  @Get('/:id/detail')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getOrderDetailById(@Param() params: MongoIdDto) {
    return this.service.getOrderDetailById(params.id);
  }

  @Get('/:id/detail/:type')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getOrderInfo(@Param() params: any) {
    return this.service.getOrderInfo(params.id, params.type);
  }

  @Post('/request/:dmOrderId/:submodule')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async requestRefundOrPayout(@Param() params: GetStatusDto) {
    return this.service.requestRefundOrPayout(
      params.dmOrderId,
      params.submodule,
    );
  }

  @Get('/finance-reasoning')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getFinanceReasoningList() {
    return this.service.getFinanceReasoningList();
  }

  @Post('/finance-reasoning')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async createFinanceReasoning(
    @Body() updateFinanceReasoningDto: UpdateFinanceReasoningDto,
  ) {
    return this.service.createFinanceReasoning(
      updateFinanceReasoningDto.id,
      updateFinanceReasoningDto.payoutPendingReason,
    );
  }

  @Post()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async create(@Body() createOrderDto: MongoOrderIdDto) {
    return this.service.create(createOrderDto.orderId);
  }

  @Put()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async update(@Body() updateOrderDto: UpdateOrderDto, @Req() request: any) {
    return this.service.update(
      updateOrderDto,
      request.user.userId,
      request.user.userName,
    );
  }
}
