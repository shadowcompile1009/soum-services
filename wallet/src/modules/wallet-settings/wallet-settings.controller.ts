import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Put,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MongoIdDto } from '@src/dto/valid-id.dto';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { WalletSettingsService } from '@modules/wallet-settings/wallet-settings.service';
import { BaseWalletSettingsDto } from '@modules/wallet-settings/dto/base-wallet-settings.dto';
import { WalletSettingsValidationPipe } from '@modules/wallet-settings/pipes/wallet-settings.validation.pipe';
import { RolesGuard } from '@src/auth/roles.guard';
import { Role } from '@src/enum/roles.enum';

@Controller('wallet-settings')
@ApiTags('Wallet Settings')
@UseGuards(JwtAuthGuard)
export class WalletSettingsController {
  constructor(private readonly walletSettingsService: WalletSettingsService) {}

  @UseGuards(RolesGuard([Role.Admin, Role.Accountant]))
  @Get()
  async list(@Query() query) {
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    const search = query.q || '';

    return this.walletSettingsService.getSettingsWithConfig({
      offset,
      limit,
      search,
    });
  }

  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @UseGuards(RolesGuard([Role.Admin]))
  @Post()
  async create(@Body() walletSettingsDto: BaseWalletSettingsDto) {
    return this.walletSettingsService.create(walletSettingsDto);
  }

  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @UseGuards(RolesGuard([Role.Admin]))
  @Put('config/:id')
  async updateWalletSettingsConfig(
    @Param() params: MongoIdDto,
    @Body(new WalletSettingsValidationPipe()) config: any,
  ) {
    return this.walletSettingsService.updateWalletConfig(params.id, config);
  }

  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @UseGuards(RolesGuard([Role.Admin]))
  @Put(':id')
  async toggleSettingsValue(@Req() request: any, @Param() params: MongoIdDto) {
    return this.walletSettingsService.toggleSettingsValue(
      request.user.userId,
      params.id,
    );
  }
}
