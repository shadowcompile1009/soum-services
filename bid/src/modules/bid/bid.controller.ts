import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Body,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { PaginatedBidDto } from '@src/dto/paginated.dto';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { CalculateBidDto } from './dto/calculate-bid.dto';
import { Bid } from '../bid/schemas/bid.schema';

@Controller('/')
@ApiTags('Bids')
export class BidController {
  constructor(private readonly service: BidService) {}

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Get()
  @ApiOkResponse({ type: PaginatedBidDto })
  @UseGuards(JwtAuthGuard)
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async list(@Query() query: any) {
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const search = query.q || '';
    return await this.service.findAll({
      offset,
      limit,
      search,
    });
  }

  @Get('/detail/:id')
  @UseGuards(JwtAuthGuard)
  async getBidDetail(@Req() request: any, @Param() params: MongoIdDto) {
    return await this.service.getBidDetails(params.id);
  }

  @Get('/bid-summary/:id')
  @UseGuards(JwtAuthGuard)
  async getBidSummary(@Param() params: MongoIdDto) {
    const currentHighestBid = await this.service.getHighestBid({
      productId: params.id,
    });
    const bidSummary = await this.service.getBidBasicSummary({
      productId: params.id,
      bid: currentHighestBid.amount,
    });
    return bidSummary;
  }

  @Post('/bid-calculation/:id')
  @UseGuards(JwtAuthGuard)
  async getBidCalCulation(
    @Req() request: any,
    @Param() params: MongoIdDto,
    @Body() calculateBidDto: CalculateBidDto,
  ) {
    const userId = request.user.userId;
    if (!calculateBidDto.allPayments) {
      const bidSummary = await this.service.getBidBasicSummary({
        productId: params.id,
        bid: calculateBidDto.bidAmount,
        userId,
      });
      return bidSummary;
    } else if (calculateBidDto.allPayments) {
      const bidSummary = await this.service.getBidPaymentSummaries({
        productId: params.id,
        bid: calculateBidDto.bidAmount,
        userId,
      });
      return bidSummary;
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addBid(@Req() request: any, @Body() createBidDto: CreateBidDto) {
    createBidDto.userId = request.user.userId;
    createBidDto.lang = request?.headers['lang'] || 'AR';
    return await this.service.create(createBidDto);
  }

  @Post('/accept-bid/:id')
  @ApiOkResponse({ type: Bid })
  @UseGuards(JwtAuthGuard)
  async acceptBid(@Req() request: any, @Param() params: MongoIdDto) {
    const clientType = request?.headers['client-id'] || '';
    return await this.service.acceptBid({ id: params.id, clientType });
  }

  @Get('/by-product/:id')
  @ApiOkResponse({ type: PaginatedBidDto })
  async listByProduct(@Query() query: any, @Param() params: MongoIdDto) {
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    return await this.service.findByProduct({
      offset,
      limit,
      productId: params.id,
    });
  }

  @Get('/my-bids')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBidDto })
  async listMyBids(@Req() request: any, @Query() query: any) {
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    const userId = request.user.userId;
    return await this.service.findMyBids({
      offset,
      limit,
      userId,
    });
  }

  @Get('/clear-expired')
  @ApiOkResponse({ type: PaginatedBidDto })
  async clearExpiredBids(@Query() query: { productId?: string }) {
    const options =
      query.productId !== undefined ? { productIds: [query.productId] } : {};

    return await this.service.clearExpiredBids(options);
  }

  @Get('/tracking-bids')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBidDto })
  async getTrackingMyBids(@Req() request: any, @Query() query: any) {
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    const userId = request.user.userId;
    return await this.service.getTrackingMyBids({
      offset,
      limit,
      userId,
    });
  }

  @Get('/:id/highest')
  @ApiOkResponse({ type: PaginatedBidDto })
  async getHighestBid(@Param() params: MongoIdDto) {
    return await this.service.getHighestBid({
      productId: params.id,
    });
  }

  @Get('/price-range')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBidDto })
  async getStartingPrice(@Query() query: any) {
    const variantId = query.variantId || null;
    const conditionId = query.conditionId || null;

    return await this.service.getStartingPrice({ conditionId, variantId });
  }

  @Get('/:id/detail-with-product-status')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBidDto })
  async getDetailWithProductStatues(@Param() params: MongoIdDto) {
    return await this.service.getDetailWithProductStatues({
      id: params.id,
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBidDto })
  async load(@Param() params: MongoIdDto) {
    return await this.service.load({
      id: params.id,
    });
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBidDto })
  async delete(@Req() request: any, @Param() params: MongoIdDto) {
    return await this.service.delete({
      id: params.id,
      userId: request.user.userId,
    });
  }
}
