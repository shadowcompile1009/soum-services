import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PenaltySettingsService } from './penalty-settings.service';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { PenaltySettingsValidationPipe } from './pipes/penalty-settings.validation.pipe';

@Controller('penalty-settings')
@ApiTags('Penalty Settings')
export class PenaltySettingsController {
  constructor(
    private readonly penaltySettingsService: PenaltySettingsService,
  ) {}

  @Get()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getPenaltySettings() {
    return this.penaltySettingsService.getPenaltySettings();
  }

  @Put('/:id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updatePenaltySettingsConfig(
    @Param() params: MongoIdDto,
    @Body(new PenaltySettingsValidationPipe()) config: any,
  ) {
    return this.penaltySettingsService.updatePenaltySettings(params.id, config);
  }
}
