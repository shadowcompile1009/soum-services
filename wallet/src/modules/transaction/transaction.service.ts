import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import isEmpty from 'lodash/isEmpty';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import { PaginatedDto } from '@src/dto/paginated.dto';
import { CreateTransactionDto } from '@modules/transaction/dto/create-transaction.dto';
import { UpdateTransactionDto } from '@modules/transaction/dto/update-transaction.dto';
import {
  Transaction,
  TransactionDocument,
  TransactionHistory,
  TransactionHistoryDocument,
} from '@modules/transaction/schemas/transaction.schema';
import { WalletService } from '@modules/wallet/wallet.service';
import { TransactionType } from '@modules/transaction/enums/transaction.type.enum';
import { TransactionStatus } from '@modules/transaction/enums/transaction.status.enum';
import { Wallet } from '@modules/wallet/schemas/wallet.schema';
import { V2Service } from '@modules/v2/v2.service';
import { HyperpayService } from '@modules/hyperpay/hyperpay.service';
import { GetUsersResponse_User } from '@modules/grpc/proto/v2.pb';
import { WalletStatus } from '@modules/wallet/enums/wallet.status.enum';
import { TransactionDescription } from './enums/transaction.description.enum';
import { CreditType } from './enums/transaction.creditType.enum';
import { sendEventData } from '@src/utils/webEngageEvents';
import {
  createEventLog,
  EventLogRequest,
  EventLogTemplateRequest,
  getTemplateMsgToCreateEventLog,
} from '@src/utils/activitylogs.util';

interface DmUser {
  id: string;
  username: string;
}
interface User {
  name: string;
  phoneNumber: string;
  totalDeposits?: number;
  totalWithdrawals?: number;
}

interface Bank {
  iban: string;
  name: string;
  accountName: string;
}
export interface EnrichedTransaction extends Transaction {
  wallet: Wallet;
  user?: User;
  bank?: Bank;
  transactionHistory?: TransactionHistoryDocument[];
}

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(HyperpayService.name);

  constructor(
    @InjectModel(Transaction.name)
    public readonly model: Model<TransactionDocument>,
    @Inject(forwardRef(() => WalletService))
    readonly walletService: WalletService,
    readonly v2Service: V2Service,
    readonly hyperpayService: HyperpayService,
    @InjectQueue('hyperpay-transactions') private readonly hyperpayQueue: Queue,
  ) {}

  private checkWalletStatus(wallet) {
    if (!wallet.status) {
      throw new BadRequestException('Invalid wallet document');
    }

    const walletIsActive = wallet.status === WalletStatus.ACTIVE;

    if (!walletIsActive) {
      throw new ForbiddenException(`Wallet status is ${wallet.status}`);
    }

    return walletIsActive;
  }

  async findAll({
    offset,
    limit,
    search,
    type,
    walletId = null,
    status = '',
  }): Promise<PaginatedDto<Transaction>> {
    const typeMatch = { type: { $regex: new RegExp(type, 'i') } };
    const walletMatch = { walletId: walletId };
    let statusMatch = {};
    if (status.includes(',')) {
      statusMatch = {
        status: { $regex: new RegExp(status.replace(',', '|'), 'i') },
      };
    } else {
      statusMatch = { status: { $regex: new RegExp(status, 'i') } };
    }
    let matchCondition: any = search
      ? {
          $text: { $search: search },
          ...typeMatch,
        }
      : typeMatch;
    let customOffset = offset;
    if (search) customOffset = 0;
    if (new RegExp(/^[0-9]+$/).test(search?.trim())) {
      try {
        const getUserByPhoneNumberRes =
          await this.v2Service.getUserByPhoneNumber({
            phoneNumber: '+' + search.trim(),
          });
        if (getUserByPhoneNumberRes?.users) {
          matchCondition = {
            ownerId: { $in: getUserByPhoneNumberRes?.users?.map((i) => i.id) },
            ...typeMatch,
          };
        } else {
          return {
            items: [],
            total: 0,
            limit: limit,
            offset: offset,
          };
        }
      } catch (error) {
        return {
          items: [],
          total: 0,
          limit: limit,
          offset: offset,
        };
      }
    }
    if (walletId) matchCondition = { ...matchCondition, ...walletMatch };
    if (status) matchCondition = { ...matchCondition, ...statusMatch };

    const res = await this.model
      .find(matchCondition)
      .skip(customOffset)
      .limit(limit)
      .sort({ createdAt: -1 })
      .exec();

    const count = await this.model.count(matchCondition).exec();
    return {
      items: res,
      total: count,
      limit: limit,
      offset: offset,
    };
  }
  async getTransactionsWithWallet({
    offset,
    limit,
    search,
    type,
    status,
  }: {
    offset: number;
    limit: number;
    search: string;
    type: string;
    status: string;
  }): Promise<PaginatedDto<EnrichedTransaction>> {
    const result = await this.findAll({
      offset,
      limit,
      search,
      type,
      status,
    });

    const walletIds = await this.collectWalletIds(result.items);

    const wallets = await this.walletService.findByIds([...walletIds]);

    const transactionWithWallet = await this.addWalletToTransaction(
      result.items,
      wallets,
    );

    const transactionWithUser = await this.addUserToTransaction(
      transactionWithWallet,
    );

    return {
      items: transactionWithUser,
      total: result.total,
      limit: result.limit,
      offset: result.offset,
    };
  }

  private async addUserToTransaction(transactions: any) {
    const userIds = [];
    transactions.forEach((t) => {
      if (t.ownerId) userIds.push(t.ownerId);
    });
    const getUsersResponse = await this.v2Service.getUsersByIds({
      userIds: userIds,
    });
    const usersMap = new Map<string, User>();
    const bankMap = new Map<string, Bank>();
    if (getUsersResponse.users) {
      getUsersResponse.users.forEach((user: GetUsersResponse_User) => {
        const temp: GetUsersResponse_User = JSON.parse(JSON.stringify(user));
        bankMap.set(user.id, {
          name: temp.bankDetail.bankName,
          accountName: temp.bankDetail.accountHolderName,
          iban: temp.bankDetail.accountId,
        });
        delete temp.bankDetail;
        usersMap.set(user.id, temp);
      });
    }
    const res = transactions.map((transaction: any) => {
      return {
        ...transaction,
        bank: bankMap.get(transaction.ownerId),
        user: usersMap.get(transaction.ownerId),
      } as EnrichedTransaction;
    }) as EnrichedTransaction[];
    return Promise.all(res);
  }

  private async addWalletToTransaction(
    transactions: Transaction[],
    wallets: Record<string, Wallet>,
  ) {
    return transactions.map((transaction: TransactionDocument) => {
      const tranactionWallet = wallets[transaction.walletId];

      return {
        ...transaction.toObject(),
        wallet: {
          ...tranactionWallet,
        },
      };
    }) as EnrichedTransaction[];
  }

  private async collectWalletIds(transactions: Transaction[]) {
    const walletIds = new Set<string>();

    transactions.forEach((transaction) => walletIds.add(transaction.walletId));

    return walletIds;
  }

  async findOne(id: string): Promise<Transaction> {
    return await this.model.findById(id).exec();
  }

  async getWithdrawalRequest(id: string): Promise<EnrichedTransaction> {
    const transaction = (await this.findOne(id)) as TransactionDocument;

    if (!transaction) {
      throw new BadRequestException(`Transaction with id ${id} not found`);
    }

    const wallets = await this.walletService.findByIds([transaction.walletId]);

    const transactionWithWallet = await this.addWalletToTransaction(
      [transaction],
      wallets,
    );
    const transactionWithUser = await this.addUserToTransaction(
      transactionWithWallet,
    );
    return transactionWithUser.pop();
  }

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    let wallet: any = await this.walletService.findOneByUserId(
      createTransactionDto.ownerId,
    );
    wallet = wallet.toObject();

    this.checkWalletStatus(wallet);

    // If transaction type is withdrawal
    if (
      createTransactionDto.type === undefined ||
      createTransactionDto.type === TransactionType.WITHDRAWAL
    ) {
      const pendingWithdrawals: any = await this.model.find({
        ownerId: createTransactionDto.ownerId,
        type: TransactionType.WITHDRAWAL,
        status: TransactionStatus.PENDING,
      });
      let pendingAmount = 0;
      pendingWithdrawals.forEach((element) => {
        pendingAmount += element.amount;
      });
      // We are setting by default all available balance to transaction amount
      if (createTransactionDto.amount === undefined) {
        createTransactionDto.amount = wallet.balance - pendingAmount;
      }
      if (
        createTransactionDto.amount <= 0 ||
        createTransactionDto.amount > wallet.balance - pendingAmount
      ) {
        throw new HttpException('Not enough balance', HttpStatus.BAD_REQUEST);
      }
    }

    // If transaction type is credit
    if (createTransactionDto.type === TransactionType.CREDIT) {
      if (createTransactionDto.orderId && createTransactionDto.amount > 0) {
        const pendingCreditForOrder: TransactionDocument[] =
          await this.model.find({
            orderId: createTransactionDto.orderId,
            ownerId: createTransactionDto.ownerId,
            type: TransactionType.CREDIT,
            status: {
              $in: [TransactionStatus.PENDING, TransactionStatus.SUCCESS],
            },
            amount: { $gte: 0 },
          });
        if (pendingCreditForOrder.length) {
          throw new HttpException(
            'There is credit transaction for this order',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
    }
    if (createTransactionDto.type === TransactionType.DEPOSIT) {
      if (createTransactionDto.status === TransactionStatus.SUCCESS) {
        await this.walletService.creditToWallet(
          wallet.id,
          createTransactionDto.amount,
        );
      }
    }

    createTransactionDto.walletId = wallet.id;
    if (!createTransactionDto.amount) {
      createTransactionDto.amount = wallet.balance;
    }
    return await new this.model({
      ...createTransactionDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    return await this.model
      .findByIdAndUpdate(
        id,
        { ...updateTransactionDto, ...{ updatedAt: new Date() } },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
  }

  async updatePendingAmountTransaction(
    id: string,
    amount: number,
  ): Promise<Transaction> {
    return await this.model
      .findByIdAndUpdate(
        id,
        {
          amount: amount,
          updatedAt: new Date(),
        },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
  }

  async getSumPendingCredits(req: any): Promise<any> {
    const pendingCredits: any = await this.model.find({
      ownerId: req.user.userId,
      type: TransactionType.CREDIT,
      status: TransactionStatus.PENDING,
    });
    let pendingAmount = 0;
    pendingCredits.forEach((element) => {
      pendingAmount += element.amount;
    });
    return { sum: pendingAmount };
  }

  async findByOrderIds(
    orderIds: string[],
    type: TransactionType[] = [
      TransactionType.CREDIT,
      TransactionType.DEPOSIT,
      TransactionType.WITHDRAWAL,
    ],
    status: TransactionStatus[] = [
      TransactionStatus.SUCCESS,
      TransactionStatus.PENDING,
      TransactionStatus.FAILED,
      TransactionStatus.CANCELED,
    ],
  ): Promise<Transaction[]> {
    return this.model
      .find({
        orderId: { $in: orderIds },
        type: { $in: type },
        status: { $in: status },
      })
      .exec();
  }

  async findByWalletId(
    walletId: string,
    type: TransactionType[] = [
      TransactionType.CREDIT,
      TransactionType.DEPOSIT,
      TransactionType.WITHDRAWAL,
    ],
    status: TransactionStatus[] = [
      TransactionStatus.SUCCESS,
      TransactionStatus.PENDING,
      TransactionStatus.FAILED,
      TransactionStatus.CANCELED,
    ],
  ): Promise<Transaction[]> {
    return this.model
      .find({
        walletId: walletId,
        type: { $in: type },
        status: { $in: status },
      })
      .exec();
  }

  async getOnlyDmUserName(userId: string) {
    const dmUser = await this.v2Service.getDmUserById({
      userId,
    });
    return dmUser.username;
  }

  async getDmUserName(userId: string) {
    const dmUser = await this.v2Service.getDmUserById({
      userId,
    });

    let formattedName = null;

    if (dmUser.firstName) {
      formattedName = dmUser.firstName;
    }

    if (dmUser.lastName && !isEmpty(formattedName)) {
      formattedName += ` ${dmUser.lastName}`;
    }

    if (dmUser.lastName) {
      formattedName = dmUser.lastName;
    }

    return !isEmpty(formattedName) ? formattedName : dmUser.username;
  }

  async completeWithdrawal({ id, agentId }): Promise<any> {
    const pendingWithdrawal: TransactionDocument = await this.model.findOne({
      _id: id,
      status: { $in: [TransactionStatus.PENDING, TransactionStatus.FAILED] },
    });
    if (!pendingWithdrawal) {
      throw new HttpException('Transaction not found', HttpStatus.NOT_FOUND);
    }

    let wallet: any = await this.walletService.findOneByUserId(
      pendingWithdrawal.ownerId,
    );
    wallet = wallet.toObject();

    this.checkWalletStatus(wallet);

    if (wallet.balance < pendingWithdrawal.amount) {
      await this.update(id, {
        status: TransactionStatus.FAILED,
      });
      throw new HttpException(
        'Not enough balance in wallet to withdraw',
        HttpStatus.CONFLICT,
      );
    }

    const user = await this.v2Service.getUserById({
      id: pendingWithdrawal.ownerId,
    });

    const response = await this.hyperpayService.createDepositTransaction({
      user,
      transaction: pendingWithdrawal.toObject(),
    });

    const agentName = await this.getDmUserName(agentId);

    const job = await this.hyperpayQueue.add(
      {
        accountId: response.beneficiary[0].accountId,
        uniqueId: response.uniqueId,
        transaction: pendingWithdrawal,
        agentId: agentId,
        agentName,
        amount: pendingWithdrawal.amount,
        userPhoneNumber: user.phoneNumber,
      },
      {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
        removeOnComplete: true,
        removeOnFail: true,
        timeout: 10000,
      },
    );

    // trigger event to create log
    const username = await this.getOnlyDmUserName(agentId);
    await this.createActivityLogTransferWithdrawEvent(
      agentId,
      username,
      wallet.id,
    );

    return { jobId: job.id };
  }

  async createActivityLogTransferWithdrawEvent(
    userId: string,
    username: string,
    walletId: string,
  ) {
    try {
      const eventType = 'SOUM Wallet';
      // get msg template to create log
      const msgToggleWalletSettingTemplateRequest: EventLogTemplateRequest = {
        eventType: 'transferredWithdrawal',
        walletId: walletId,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgToggleWalletSettingTemplateRequest,
      );
      const eventLogAddUserRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        value: msgTemplate,
        module: 'settings',
      };
      await createEventLog(eventLogAddUserRequest);
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async createTransactionHistory(
    params: TransactionHistory,
  ): Promise<TransactionDocument> {
    return this.model.findOneAndUpdate(
      { _id: params.transactionId },
      {
        $push: { history: params },
      },
    );
  }

  private async find(filters: FilterQuery<TransactionDocument>) {
    const transaction = await this.model.find(filters);
    return transaction;
  }

  public checkBounds({
    targetNumber,
    checkNumber,
    boundPercentage,
  }: {
    targetNumber;
    checkNumber;
    boundPercentage;
  }) {
    const percentage = ((checkNumber - targetNumber) * 100) / targetNumber;
    return Math.abs(percentage) <= boundPercentage;
  }

  async refundToBuyerWallet({
    agentId,
    walletId,
    orderId,
    refundAmount,
  }: {
    agentId: string;
    walletId: string;
    orderId: string;
    refundAmount: number;
  }) {
    const order = await this.v2Service.getOrderDetailById({ orderId });

    const wallet = await this.walletService.findOne(walletId);

    this.checkWalletStatus(wallet);

    if (
      !this.checkBounds({
        targetNumber: order.buyerOrderDetail.grandTotal,
        checkNumber: refundAmount,
        boundPercentage: 10,
      })
    ) {
      throw new BadRequestException(`Refund amount out of bounds`);
    }

    if (wallet.ownerId !== order.buyerId) {
      throw new BadRequestException(`Wallet and owner mismatch`);
    }

    let sellerWallet = await this.walletService.findOneByUserId(order.sellerId);
    sellerWallet = (sellerWallet as any).toObject();
    this.logger.debug('sellerWallet', sellerWallet);

    const sellerTransaction = await this.find({
      orderId,
      ownerId: order.sellerId,
      walletId: sellerWallet.id,
    });

    if (!isEmpty(sellerTransaction)) {
      await this.update(sellerTransaction[0].toObject().id, {
        status: TransactionStatus.CANCELED,
      });
    }

    let transaction = (await this.create({
      ownerId: wallet.ownerId,
      walletId,
      type: TransactionType.CREDIT,
      amount: refundAmount,
      orderId,
      status: TransactionStatus.PENDING,
      description: TransactionDescription.WALLET_REFUND,
      metadata: { creditType: CreditType.REFUND },
    } as CreateTransactionDto)) as TransactionDocument;

    transaction = transaction.toObject();

    await this.walletService.creditToWallet(walletId, refundAmount);

    const updatedTransaction = await this.update(transaction.id, {
      status: TransactionStatus.SUCCESS,
    } as UpdateTransactionDto);

    const agentName = await this.getDmUserName(agentId);

    await this.createTransactionHistory({
      transactionId: transaction.id,
      agentId,
      agentName,
      status: updatedTransaction.status,
      createdAt: new Date(),
      updatedAt: new Date(),
      hyperpayCreatedAt: null,
      hyperpayBatchId: null,
      hyperpayUniqueId: null,
      amount: updatedTransaction.amount,
      userPhoneNumber: null,
    });

    // webengage event trigger
    const orderDetail = await this.v2Service.getOrderDetailById({ orderId });
    const webEngageData = {
      'Product ID': orderDetail?.productId,
      'Buyer ID': orderDetail?.sellerId,
      'Buyer Phone Number': orderDetail?.sellerPhoneNumber,
      'Order ID': orderId,
      'Order Number': orderDetail?.orderNumber,
      'Refund Amount': refundAmount,
      'Product Name': orderDetail?.productName,
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderDetail?.buyerId,
      'Order Refunded',
      dateFormat,
      webEngageData,
    );
    // trigger event to create log
    const username = await this.getOnlyDmUserName(agentId);
    await this.createActivityLogRefundReleaseToWalletEvent(
      agentId,
      username,
      orderId,
      order.orderNumber,
      'refund',
    );
  }

  async createActivityLogRefundReleaseToWalletEvent(
    userId: string,
    username: string,
    orderId: string,
    orderNumber: string,
    reqType: string,
  ) {
    try {
      const eventType = 'SOUM Wallet';
      // get msg template to create log
      const msgToggleWalletSettingTemplateRequest: EventLogTemplateRequest = {
        eventType: reqType === 'refund' ? 'refundToWallet' : 'releasedToWallet',
        orderNumber: orderNumber,
      };
      const msgTemplate = await getTemplateMsgToCreateEventLog(
        msgToggleWalletSettingTemplateRequest,
      );
      const eventLogAddUserRequest: EventLogRequest = {
        eventType: eventType,
        userId: userId,
        username: username,
        value: msgTemplate,
        orderId: orderId,
        orderNumber: orderNumber,
        module: 'settings',
      };
      await createEventLog(eventLogAddUserRequest);
    } catch (exception) {
      this.logger.error(exception.message);
    }
  }

  async releaseCreditToWallet({
    agentId,
    walletId,
    orderId,
    releaseAmount,
  }: {
    agentId: string;
    walletId: string;
    orderId: string;
    releaseAmount: number;
  }) {
    const order = await this.v2Service.getOrderDetailById({ orderId });

    let wallet = await this.walletService.findOne(walletId);
    wallet = (wallet as any).toObject();

    this.checkWalletStatus(wallet);

    if (wallet.ownerId !== order.sellerId) {
      throw new BadRequestException(`Wallet and owner mismatch`);
    }

    const transactions = await this.find({
      orderId,
      ownerId: order.sellerId,
      walletId: wallet.id,
      status: TransactionStatus.PENDING,
    });

    if (isEmpty(transactions)) {
      throw new BadRequestException(`Transaction not found`);
    }

    const transaction = transactions[0].toObject();

    if (
      !this.checkBounds({
        targetNumber: transaction.amount,
        checkNumber: releaseAmount,
        boundPercentage: 10,
      })
    ) {
      throw new BadRequestException(`Release amount out of bounds`);
    }

    await this.update(transaction.id, {
      description: TransactionDescription.PAYOUT_RELEASE,
    });
    if (transaction.amount !== releaseAmount) {
      await this.update(transaction.id, {
        amount: releaseAmount,
      });
    }

    await this.walletService.creditToWallet(walletId, releaseAmount);

    await this.update(transaction.id, {
      status: TransactionStatus.SUCCESS,
    });

    const agentName = await this.getDmUserName(agentId);

    await this.createTransactionHistory({
      transactionId: transaction.id,
      agentId,
      agentName,
      status: TransactionStatus.SUCCESS,
      createdAt: new Date(),
      updatedAt: new Date(),
      hyperpayCreatedAt: null,
      hyperpayBatchId: null,
      hyperpayUniqueId: null,
      amount: transaction.amount,
      userPhoneNumber: null,
    });
    // trigger event to create log
    const username = await this.getOnlyDmUserName(agentId);
    await this.createActivityLogRefundReleaseToWalletEvent(
      agentId,
      username,
      orderId,
      order.orderNumber,
      'release',
    );
    // webengage event trigger
    const orderDetail = await this.v2Service.getOrderDetailById({ orderId });
    const sellerWebEngageData = {
      'Product ID': orderDetail?.productId,
      'Seller ID': orderDetail?.sellerId,
      'Seller Phone Number': orderDetail?.sellerPhoneNumber,
      'Order ID': orderId,
      'Order Number': orderDetail?.orderNumber,
      'Payout Amount': releaseAmount,
      'Product Name': orderDetail?.productName,
    };
    const buyerWebEngageData = {
      'Product ID': orderDetail?.productId,
      'Buyer ID': orderDetail?.buyerId,
      'Buyer Phone Number': orderDetail?.buyerPhoneNumber,
      'Order ID': orderId,
      'Order Number': orderDetail?.orderNumber,
      'Payout Amount': releaseAmount,
      'Product Name': orderDetail?.productName,
    };
    const dateFormat = `${new Date().toISOString().split('.')[0]}-0000`;
    await sendEventData(
      orderDetail?.sellerId,
      'Order Paid Out',
      dateFormat,
      sellerWebEngageData,
    );
    await sendEventData(
      orderDetail?.buyerId,
      'Order Paid Out - Buyer',
      dateFormat,
      buyerWebEngageData,
    );
  }

  async getByOwnerAndOrder({
    ownerId,
    orderId,
  }: {
    ownerId: string;
    orderId: string;
  }): Promise<EnrichedTransaction> {
    const transactions = await this.find({
      orderId,
      ownerId: ownerId,
    });
    if (isEmpty(transactions)) {
      throw new BadRequestException(`Transaction not found`);
    }

    const wallets = await this.walletService.findByIds([
      transactions[0].walletId,
    ]);

    const transactionWithWallet = await this.addWalletToTransaction(
      transactions,
      wallets,
    );
    return transactionWithWallet.pop();
  }

  async getTransactionsOfAWallet({
    offset,
    limit,
    search,
    type,
    userId,
  }: {
    offset: number;
    limit: number;
    search: string;
    type: string;
    userId: string;
  }): Promise<PaginatedDto<Transaction>> {
    let wallet = await this.walletService.findOneByUserId(userId);
    wallet = (wallet as any).toObject();

    return this.findAll({
      offset,
      limit,
      search,
      type,
      walletId: wallet.id,
    });
  }

  mappingTransactionHistory(transactions: TransactionDocument[]) {
    if (transactions.length === 0) return [];
    const res = transactions.map((transaction: TransactionDocument) => {
      return {
        walletId: transaction?.walletId,
        transactionId: transaction?._id.toString(),
        agentId: transaction?.history ? transaction?.history[0]?.agentId : '',
        agentName: transaction?.history
          ? transaction?.history[0]?.agentName
          : '',
        status: transaction?.status,
        type:
          (transaction?.description || '').length > 0
            ? transaction?.description
            : transaction?.type,
        description: transaction?.description,
        amount: transaction?.amount,
        createdAt: transaction?.createdAt,
      };
    });
    return res;
  }

  async getTransactionHistoryByOrderId({
    orderId,
  }: {
    orderId: string;
  }): Promise<TransactionDocument[]> {
    const transactions = await this.find({
      orderId,
      'metadata.creditType': {
        $in: [CreditType.PAYOUT, CreditType.REFUND],
      },
    });

    if (isEmpty(transactions)) {
      return [];
    }
    return transactions;
  }

  async getSelletWalletCreditPayout({
    ownerId,
    orderId,
  }: {
    ownerId: string;
    orderId: string;
  }): Promise<any> {
    const transactions = await this.find({
      orderId,
      ownerId,
      type: TransactionType.CREDIT,
      status: TransactionStatus.PENDING,
    });
    if (isEmpty(transactions)) {
      return {};
    }
    return transactions.pop();
  }

  async cancelCreditTransaction(
    ownerId: string,
    orderId: string,
    walletId: string,
    userId: string,
  ) {
    const sellerTransaction = await this.find({
      orderId,
      ownerId,
      walletId,
      type: TransactionType.CREDIT,
    });

    if (isEmpty(sellerTransaction)) {
      throw new BadRequestException(`Transaction not found`);
    }
    await this.v2Service.cancelOrder({
      userId,
      orderId,
    });
    return await this.update(sellerTransaction[0].toObject().id, {
      status: TransactionStatus.CANCELED,
    });
  }
}
