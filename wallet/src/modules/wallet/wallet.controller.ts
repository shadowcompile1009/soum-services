import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { MongoIdDto } from '@src/dto/valid-id.dto';
import {
  JwtAuthGuard,
  LegacyAdminOnlyJwtAuthGuard,
} from '@src/auth/auth.guard';
import { CreateWalletDto } from '@modules/wallet/dto/create-wallet.dto';
import { UpdateWalletDto } from '@modules/wallet/dto/update-wallet.dto';
import { WalletService } from '@modules/wallet/wallet.service';
import { WalletSettingsGuard } from '@modules/wallet-settings/wallet-settings.guard';
import { PaginatedWalletDto } from '@src/dto/paginated.dto';
import { BaseWalletDto } from './dto/base-wallet.dto';

@Controller('/')
@ApiTags('Wallet')
export class WalletController {
  constructor(private readonly service: WalletService) {}

  @Get('/status')
  async getStatus() {
    return { statu: 'OK' };
  }

  @Get()
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @ApiOkResponse({ type: PaginatedWalletDto })
  async list(@Query() query: any) {
    const offset = query.offset || 0;
    const limit = query.limit || 10;
    const search = query.q || '';
    const phoneNumber = query.phone || '';
    const wallets = await this.service.findAll({
      offset,
      limit,
      search,
      phoneNumber,
    });
    let mappingWallets = await this.service.mappingDMUserInWallets(
      wallets.items,
    );
    mappingWallets = await this.service.mappingUserInWallets(mappingWallets);

    return {
      items: mappingWallets,
      total: wallets.total,
      limit: wallets.limit,
      offset: wallets.offset,
    };
  }

  @Get('my-wallet')
  @UseGuards(JwtAuthGuard)
  async getByUserId(@Req() request: any) {
    return await this.service.findOneByUserId(request.user.userId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id' })
  @ApiOkResponse({ type: BaseWalletDto })
  async load(@Param() params: MongoIdDto) {
    const wallet: any = await this.service.findWalletById(params.id);

    let mappingWallets = await this.service.mappingDMUserInWallets([wallet]);
    mappingWallets = await this.service.mappingUserInWallets(mappingWallets);
    const transaction = await this.service.getWalletTransactionsOwner(
      wallet._id.toString(),
    );
    return {
      wallet: mappingWallets.pop(),
      transaction: transaction,
    };
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.service.create(createWalletDto);
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @Put(':id')
  async update(
    @Param() params: MongoIdDto,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return await this.service.update(params.id, updateWalletDto);
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @Delete(':id')
  async delete(@Param() params: MongoIdDto) {
    return await this.service.delete(params.id);
  }
}
