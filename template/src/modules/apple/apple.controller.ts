import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { AppleService } from './apple.service';
import { CreateAppleDto } from './dto/create-apple.dto';

@Controller('/')
@ApiTags('Apples')
export class AppleController {
  constructor(private readonly service: AppleService) {}

  @Get()
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

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() request: any, @Body() createAppleDto: CreateAppleDto) {
    createAppleDto.userId = request.user.userId;
    return await this.service.create(createAppleDto);
  }
}
