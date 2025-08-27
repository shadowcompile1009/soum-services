import { Controller, Get, Query } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { RateService } from './rate.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('/rate')
@ApiTags('Rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Get('/user/')
  @MessagePattern('getRateByRevieweeId')
  async getRateByRevieweeId(@Query() query: any) {
    const id = query.id || '';
    const data = await this.rateService.findByReviewee(id);

    return data ? data : { message: 'RevieweeID not found' };
  }
}
