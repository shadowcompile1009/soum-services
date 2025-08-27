import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Service } from './entities/service.entity';
import { ServiceService } from './service.service';
import { LogisticServiceDto } from './dto/logistic-service.dto';
import { LegacyAdminOnlyJwtAuthGuard } from '../auth/auth.guard';
import { CommonExceptionFilter } from '@src/exception-filters/common-exception.filter';

@Controller('service')
@UseFilters(CommonExceptionFilter)
export class ServiceController {
  @Inject(ServiceService)
  private readonly serviceService: ServiceService;

  @Get()
  public find(): Promise<Service[]> {
    return this.serviceService.find();
  }

  @Put('logistic')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  public async updateLogisticService(
    @Body() logisticServiceDto: LogisticServiceDto,
  ) {
    if (
      logisticServiceDto?.dmoId?.length === 0 ||
      logisticServiceDto?.serviceId.length === 0 ||
      logisticServiceDto?.vendorId.length === 0
    ) {
      throw new BadRequestException('Invalid service Id, vendor Id or dmoId');
    }
    return await this.serviceService.updateLogistic(logisticServiceDto);
  }
}
