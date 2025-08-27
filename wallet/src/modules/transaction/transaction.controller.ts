import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard, LegacyAdminOnlyJwtAuthGuard } from '@src/auth/auth.guard';
// import { ApiPaginatedResponse } from 'src/decorators/api-paginated-response.decorator';
import { MongoIdDto } from '@src/dto/valid-id.dto';
// import { BaseTransactionDto } from './dto/base-transaction.dto';
import { CreateTransactionDto } from '@modules/transaction/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@modules/transaction/dto/update-transaction.dto';
import { RefundTransactionDto } from '@modules/transaction/dto/refund-transaction.dto';
import { ReleaseCreditDto } from '@modules/transaction/dto/release-credit.dto';
import { TransactionService } from '@modules/transaction/transaction.service';
import { WalletSettingsGuard } from '@modules/wallet-settings/wallet-settings.guard';
import { CancelTabbyOrderTransactionDto } from '@src/modules/transaction/dto/cancel-tabby-order-transaction.dto';
import { RolesGuard } from '@src/auth/roles.guard';
import { Role } from '@src/enum/roles.enum';

@Controller('transactions')
@ApiTags('Transaction')
@UseGuards(JwtAuthGuard)
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  async list(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('type') type = 'withdrawal',
    @Query('status') status = '',
    @Query('search') search = '',
  ) {
    return await this.transactionService.getTransactionsWithWallet({
      offset,
      limit,
      search,
      type,
      status,
    });
  }

  @Get('my-transactions')
  @UseGuards(JwtAuthGuard)
  async listMytransactions(
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
    @Query('type') type,
    @Query('search') search = '',
    @Req() request: any,
  ) {
    return await this.transactionService.getTransactionsOfAWallet({
      offset,
      limit,
      search,
      type,
      userId: request.user.userId,
    });
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Req() request: any,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    createTransactionDto.ownerId = request.user.userId;
    return await this.transactionService.create(createTransactionDto);
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param() params: MongoIdDto,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(params.id, updateTransactionDto);
  }

  @Get('pending-credits-sum')
  @UseGuards(JwtAuthGuard)
  async getSumPendingCredits(@Req() req: any) {
    return this.transactionService.getSumPendingCredits(req);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async load(@Param() params: MongoIdDto) {
    return this.transactionService.getWithdrawalRequest(params.id);
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  // @UseGuards(RolesGuard([Role.Admin, Role.Accountant]))
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  @Post(':id/complete')
  async completeWithdrawal(@Req() request: any, @Param() params: MongoIdDto) {
    return await this.transactionService.completeWithdrawal({
      id: params.id,
      agentId: request.user.userId,
    });
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @Post('buyer-refund')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async buyerRefund(
    @Req() request: any,
    @Body() refundBuyerDto: RefundTransactionDto,
  ) {
    await this.transactionService.refundToBuyerWallet({
      agentId: request.user.userId,
      walletId: refundBuyerDto.walletId,
      orderId: refundBuyerDto.orderId,
      refundAmount: refundBuyerDto.refundAmount,
    });

    return { status: HttpStatus.CREATED };
  }

  @UseGuards(WalletSettingsGuard('walletToggle'))
  @UseGuards(RolesGuard([Role.Admin, Role.Accountant]))
  @Post('release-credit')
  async releaseCreditToWallet(
    @Req() request: any,
    @Body() releaseCreditDto: ReleaseCreditDto,
  ) {
    await this.transactionService.releaseCreditToWallet({
      agentId: request.user.userId,
      walletId: releaseCreditDto.walletId,
      orderId: releaseCreditDto.orderId,
      releaseAmount: releaseCreditDto.releaseAmount,
    });

    return { status: HttpStatus.CREATED };
  }

  @Get('owner/:ownerId/order/:orderId')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getByOwnerAndOrder(@Req() request: any) {
    return await this.transactionService.getByOwnerAndOrder({
      ownerId: request.params.ownerId,
      orderId: request.params.orderId,
    });
  }

  @Get('order/:orderId')
  async getTransactionHistory(@Req() request: Request) {
    const transactions =
      await this.transactionService.getTransactionHistoryByOrderId({
        orderId: request.params.orderId,
      });
    return this.transactionService.mappingTransactionHistory(transactions);
  }
  @Get('owner/:ownerId/order/:orderId/credit')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async getSelletWalletCreditPayout(@Req() request: any) {
    return await this.transactionService.getSelletWalletCreditPayout({
      ownerId: request.params.ownerId,
      orderId: request.params.orderId,
    });
  }

  @Post('cancel-tabby-order-transaction')
  @UseGuards(LegacyAdminOnlyJwtAuthGuard)
  async cancelTabbyOrderTransaction(
    @Req() req: any,
    @Body() cancelTabbyOrderTransactionDto: CancelTabbyOrderTransactionDto,
  ) {
    return await this.transactionService.cancelCreditTransaction(
      cancelTabbyOrderTransactionDto.ownerId,
      cancelTabbyOrderTransactionDto.orderId,
      cancelTabbyOrderTransactionDto.walletId,
      req?.user?.userId,
    );
  }
}
