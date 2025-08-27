import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AmazonService } from './aws.service';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';

@Controller('aws')
export class AwsController {
  constructor(private readonly service: AmazonService) {}

  @Get('/pre-signed-url')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getPresignedUrl(@Query() query: any) {
    const count = +query?.count || 0;
    const imageModule = query?.imageModule || '';
    const fileExtension = query?.fileExtension || 'png';
    return await this.service.getPresignedUrl(
      { count, imageModule, fileExtension },
      null,
    );
  }
}
