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
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { OfferService } from './offer.service';
import { CreateBidDto } from '../bid/dto/create-bid.dto';
import { UpdateOffer } from './dto/updateOfferDto';

@Controller('offers')
export class OfferController {
  constructor(private readonly service: OfferService) {}

  @Post('/calculate')
  @UseGuards(JwtAuthGuard)
  async calculate(@Req() request: any, @Body() createOfferDto: CreateBidDto) {
    createOfferDto.userId = request.user.userId;
    return this.service.calculate(createOfferDto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addBid(@Req() request: any, @Body() createOfferDto: CreateBidDto) {
    createOfferDto.userId = request.user.userId;
    return this.service.create(createOfferDto);
  }

  @Get('/count')
  @UseGuards(JwtAuthGuard)
  async getOfferCount(@Req() request: any) {
    const userId = request.user.userId;

    return await this.service.getCurrentUserOffersCount(userId);
  }

  @Get('product/:id')
  @UseGuards(JwtAuthGuard)
  async getOffersForSellerOrBuyer(
    @Req() request: any,
    @Param() params: any,
    @Query() query: any,
  ) {
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const userId = request.user.userId;

    return this.service.getOffersForSellerOrBuyer({
      offset,
      limit,
      productId: params.id,
      userId,
    });
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getOffers(@Req() request: any, @Query() query: any) {
    const offset = query.offset || 0;
    const limit = query.limit || 100;
    const userId = request.user.userId;

    return this.service.getCurrentUserOffers({
      offset,
      limit,
      userId,
    });
  }


  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async acceptOrRejectOffer(
    @Param() params: any,
    @Body() updateOffer: UpdateOffer,
  ) {
    updateOffer.id = params.id;
    return this.service.acceptOrReject(updateOffer);
  }
}
