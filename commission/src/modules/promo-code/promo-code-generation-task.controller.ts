import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { PromoCodeGenerationTaskService } from './promo-code-generation-task.service';

@Controller('promo-codes-generation-task')
export class PromoCodeController {
  constructor(
    private readonly promoCodeGenerationTaskService: PromoCodeGenerationTaskService,
  ) {}

  @Get(':id')
  async getById(@Param('id') id: string) {
    const promoCode = await this.promoCodeGenerationTaskService.getById(id);
    if (!promoCode) {
      throw new HttpException(
        'PromoCode Generation Task not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return promoCode;
  }
}
