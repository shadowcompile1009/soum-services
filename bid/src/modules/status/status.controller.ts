import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { StatusService } from './status.service';
import { ListStatusDto } from './dto/list-status.dto';
import { CreateStatusDto } from './dto/create-status.dto';

@Controller('/statuses')
@ApiTags('Statuses')
@UseGuards(JwtAuthGuard)
export class StatusController {
  constructor(private readonly service: StatusService) {}

  // usage not found.
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @Get()
  @ApiOkResponse({
    description: 'Bid status object',
    type: ListStatusDto,
    isArray: true,
  })
  async list() {
    return await this.service.findAll();
  }

  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @Post()
  async create(@Body() createWalletDto: CreateStatusDto[]) {
    return await this.service.create(createWalletDto);
  }
}
