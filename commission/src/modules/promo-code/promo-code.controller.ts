import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { PromoCodeService } from '@modules/promo-code/promo-code.service';
import {
  IncreaseUsageCountDto,
  ValidatePromoCodeDto,
  WritePromoCodeDto,
} from './dto';
import { PromoCodeGenerationTaskService } from './promo-code-generation-task.service';
import { LegacyAdminJwtStrategy } from '@src/auth/strategies/legacy-admin-jwt.strategy';

@Controller('promo-codes')
export class PromoCodeController {
  constructor(
    private readonly promoCodeService: PromoCodeService,
    private readonly promoCodeGenerationTaskService: PromoCodeGenerationTaskService,
  ) {}

  @Get()
  @UseGuards(LegacyAdminJwtStrategy)
  async list(@Query() query: any) {
    const page = (query.page || 1) > 0 ? query.page : 1;
    const limit = +query.limit || 100;
    const searchValue = query.searchValue || '';
    const parentPromoCodeId = query.parentPromoCodeId || '';

    const offset = (page - 1) * limit;
    return await this.promoCodeService.listPromos({
      offset,
      limit,
      searchValue,
      parentPromoCodeId,
    });
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const promoCode = await this.promoCodeService.getPromoCodeById(id);
    if (!promoCode) {
      throw new HttpException('PromoCode not found', HttpStatus.NOT_FOUND);
    }
    return promoCode;
  }

  @Post('validate-promo-code')
  @UseGuards(JwtAuthGuard)
  async validatePromoCodeUsage(
    @Body() promoCodeDto: ValidatePromoCodeDto,
    @Headers() headers: Record<string, string>,
    @Req() request: any,
  ) {
    const language = headers['lang'] || 'en';
    const userId = request.user.userId;
    return await this.promoCodeService.validatePromoCodeUsage(
      promoCodeDto.code,
      promoCodeDto.productId,
      promoCodeDto.paymentProvider,
      promoCodeDto.paymentProviderType,
      language,
      userId,
    );
  }

  @Post()
  @UseGuards(LegacyAdminJwtStrategy)
  async create(@Body() promoCodeDto: WritePromoCodeDto) {
    if (promoCodeDto.totalCodes > 1) {
      return await this.promoCodeGenerationTaskService.bulkGeneratePromoCodes(
        promoCodeDto,
      );
    }
    return await this.promoCodeService.create(promoCodeDto);
  }

  @Put(':id')
  @UseGuards(LegacyAdminJwtStrategy)
  async update(
    @Param('id') id: string,
    @Body() promoCodeDto: WritePromoCodeDto,
  ) {
    return await this.promoCodeService.update(id, promoCodeDto);
  }

  @Delete(':id')
  @UseGuards(LegacyAdminJwtStrategy)
  async delete(@Param('id') id: string) {
    return await this.promoCodeService.delete(id);
  }

  @Post('/increase-usage-count')
  async increaseUsageCount(@Body() promoCodeDto: IncreaseUsageCountDto) {
    return await this.promoCodeService.updateUsageCount(promoCodeDto.id, 1);
  }
}
