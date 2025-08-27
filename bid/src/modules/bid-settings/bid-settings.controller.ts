import { Controller, Get, Body, Put, Param, UseGuards } from '@nestjs/common';
import { MongoIdDto } from '@src/dto/valid-id.dto';
import { LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { BidSettingsService } from './bid-settings.service';
import { BidSettingsValidationPipe } from './pipes/bid-settings.validation.pipe';
import { BiddingBaseReference } from './enums/bid.reference.enum';

@Controller('bid-settings')
@ApiTags('Bid Settings')
export class BidSettingsController {
  constructor(private readonly bidSettingsService: BidSettingsService) {}

  @Get()
  async getBidSettings() {
    return this.bidSettingsService.getBidSettings();
  }

  @Get('/bid-reference')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getBiddingBaseReference() {
    return Object.values(BiddingBaseReference);
  }

  @Put('/:id')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async updateBidSettingsConfig(
    @Param() params: MongoIdDto,
    @Body(new BidSettingsValidationPipe()) config: any,
  ) {
    return this.bidSettingsService.updateBidSettings(params.id, config);
  }
}
