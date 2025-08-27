import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { CancellationFeeSettingsService } from './cancellation-fee-settings.service';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { MongoIdDto } from '@src/dto/valid-id.dto';

@Controller('cancellation-fee-settings')
export class CancellationFeeSettingsController {
  constructor(
    private readonly cancellationFeeSettingsService: CancellationFeeSettingsService,
  ) {}
  @Get()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getCancellationFeeSettings() {
    return this.cancellationFeeSettingsService.getCancellationFeeSettings();
  }
  @Put('/:id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updatePenaltySettingsConfig(
    @Param() params: MongoIdDto,
    @Body() config: any,
  ) {
    return this.cancellationFeeSettingsService.updateCancellationFeeSettings(
      params.id,
      config,
    );
  }
}
