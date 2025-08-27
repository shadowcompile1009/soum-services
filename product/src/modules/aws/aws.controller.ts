import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { AmazonService } from './aws.service';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('AWS')
@Controller('aws')
export class AwsController {
  constructor(private readonly service: AmazonService) {}

  @Get('/pre-signed-url')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pre-signed URL (user)' })
  @ApiQuery({
    name: 'count',
    required: false,
    type: Number,
    description: 'Number of URLs to generate',
  })
  @ApiQuery({
    name: 'imageModule',
    required: false,
    type: String,
    description: 'Image module name',
  })
  @ApiQuery({
    name: 'fileExtention',
    required: false,
    type: String,
    description: 'File extension (e.g., png, jpg)',
  })
  async getPresignedUrl(@Query() query: any, @Req() request: any) {
    const count = +query.count || 0;
    const imageModule = query.imageModule || '';
    const fileExtention = query.fileExtention || 'png';
    const userId = request.user.userId;
    return await this.service.getPresignedUrl(
      { count, imageModule, fileExtension: fileExtention },
      userId,
    );
  }

  @Get('admin/pre-signed-url')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pre-signed URL (admin)' })
  @ApiQuery({
    name: 'count',
    required: false,
    type: Number,
    description: 'Number of URLs to generate',
  })
  @ApiQuery({
    name: 'imageModule',
    required: false,
    type: String,
    description: 'Image module name',
  })
  @ApiQuery({
    name: 'fileExtention',
    required: false,
    type: String,
    description: 'File extension (e.g., png, jpg)',
  })
  @ApiQuery({
    name: 'userId',
    required: true,
    type: String,
    description: 'Target user ID',
  })
  async getPresignedUrlForadmin(@Query() query: any) {
    const count = +query.count || 0;
    const imageModule = query.imageModule || '';
    const fileExtention = query.fileExtention || 'png';
    const userId = query.userId;
    return await this.service.getPresignedUrl(
      { count, imageModule, fileExtension: fileExtention },
      userId,
    );
  }
}