import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/auth/auth.guard';
import { Response } from 'express';
import { RecommendService } from './recommend.service';

@Controller('recommend')
@ApiTags('Recommend')
@Controller('recommend')
export class RecommendController {
  constructor(private readonly recommendService: RecommendService) {}

  @Post('/price')
  @ApiOperation({ summary: 'Get recommended price' })
  @UseGuards(JwtAuthGuard)
  async postVariantData(
    @Body() data: { variant_id: string; condition_id: string },
    @Res() res: Response,
  ) {
    const result = await this.recommendService.postVariantData(data);

    res.status(result.statusCode).send(result.data);
  }
}
