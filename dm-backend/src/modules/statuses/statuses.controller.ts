import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StatusesService } from './statuses.service';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { CreateStatusDto } from './dto/create-status.dto';
import { GetStatusBySubmoduleDto } from './enums/get-statuses.dto';
import { CreateStatusGroupDto } from './dto/create-status-group.dto';

@Controller('statuses')
@ApiTags('statuses')
export class StatusesController {
  constructor(private readonly service: StatusesService) {}

  @Get()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async get() {}

  @Get()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async list() {
    return this.service.listAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findById(@Param() params: MongoIdDto) {
    return this.service.findById(params.id);
  }

  @Get('/order/:id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async findByDmOrderId(@Param() params: MongoIdDto) {
    return this.service.findById(params.id);
  }

  @Get('/submodule/:submodule')
  async findBySubmodule(@Param() params: GetStatusBySubmoduleDto) {
    return this.service.findBySubmodule(params.submodule);
  }

  @Post()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async create(@Body() CreateStatusDto: CreateStatusDto[]) {
    return this.service.create(CreateStatusDto);
  }

  @Post('/group')
  async createStatusGroup(
    @Body() createStatusGroupDto: CreateStatusGroupDto[],
  ) {
    return this.service.createStatusGroup(createStatusGroupDto);
  }
}
