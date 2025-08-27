import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueStalled,
} from '@nestjs/bull';
import { HyperPayQueueJobDto } from '@src/modules/hyperpay/dto/hyperpay.queue.dto';
import { PayoutStatus } from '@src/modules/hyperpay/enums/payout.status.enum';
import { HyperpayService } from '@src/modules/hyperpay/hyperpay.service';
import { WalletService } from '@src/modules/wallet/wallet.service';
import { Job } from 'bull';
import moment from 'moment';
import { TransactionStatus } from '../enums/transaction.status.enum';
import { TransactionService } from '../transaction.service';

@Processor('hyperpay-transactions')
export class HyperpayQueueConsumer {
  constructor(
    readonly hyperpayService: HyperpayService,
    readonly walletService: WalletService,
    readonly transactionService: TransactionService,
  ) {}

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id}`);
  }

  @OnQueueCompleted()
  onQueueCompleted(job: Job) {
    console.log(`Job ${job.id} has completed`);
  }

  @OnQueueStalled()
  onQueueStalled(job: Job) {
    console.log(`Job ${job.id} is stalled`);
  }

  @Process()
  async checkTransaction(job: Job<HyperPayQueueJobDto>, done: any) {
    const batchId = await this.hyperpayService.getSpecificOrder({
      accountId: job.data.accountId,
      uniqueId: job.data.uniqueId,
    });
    if (!batchId) {
      return done(new Error(`BatchId is still null`));
    }

    const payout = await this.hyperpayService.getSpecificPayout({
      batchId,
    });

    if (payout.status === PayoutStatus.PROCESSING) {
      return done(new Error(`Job ${job.id} is still processing...`));
    }

    if (payout.status === PayoutStatus.COMPLETED) {
      await this.walletService.withdraw(
        job.data.transaction.walletId,
        job.data.transaction.amount,
      );
      await this.transactionService.update(job.data?.transaction.id, {
        status: TransactionStatus.SUCCESS,
      });
    } else {
      await this.transactionService.update(job.data?.transaction.id, {
        status: TransactionStatus.FAILED,
      });
    }

    await this.transactionService.createTransactionHistory({
      transactionId: job.data.transaction.id,
      status: payout.status,
      agentId: job.data.agentId,
      agentName: job.data.agentName,
      hyperpayCreatedAt: new Date(
        moment(payout.createdAt).format('DD/MM/YYYY hh:mm:ss A'),
      ),
      hyperpayBatchId: batchId,
      hyperpayUniqueId: job.data.uniqueId,
      amount: job.data.amount,
      userPhoneNumber: job.data.userPhoneNumber,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    done();
  }
}
