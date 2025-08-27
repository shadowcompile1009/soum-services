import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PaginatedDto } from '@src/dto/paginated.dto';
import { CreateWalletDto } from '@modules/wallet/dto/create-wallet.dto';
import { UpdateWalletDto } from '@modules/wallet/dto/update-wallet.dto';
import { Wallet, WalletDocument } from '@modules/wallet/schemas/wallet.schema';
import { TransactionService } from '@modules/transaction/transaction.service';
import { TransactionType } from '@modules/transaction/enums/transaction.type.enum';
import { Transaction } from '@modules/transaction/schemas/transaction.schema';
import { TransactionStatus } from '@modules/transaction/enums/transaction.status.enum';
import { V2Service } from '@modules/v2/v2.service';
import { GetDmUsersResponse_DmUser } from '@modules/grpc/proto/v2.pb';

import { WalletStatus } from './enums/wallet.status.enum';
import { GetUsersResponse_User } from '../grpc/proto/v2.pb';

interface DmUser {
  id: string;
  username: string;
  phoneNumber: string;
}

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private readonly model: Model<WalletDocument>,
    @Inject(forwardRef(() => TransactionService))
    readonly transactionService: TransactionService,
    readonly v2Service: V2Service,
  ) {}
  async findAll({
    offset,
    limit,
    search,
    phoneNumber,
  }): Promise<PaginatedDto<Wallet>> {
    let matchCondition: any = search ? { $text: { $search: search } } : {};
    if (phoneNumber) {
      try {
        const formatPhone = /^(00966|966|\+966)/.test(phoneNumber.trim())
          ? phoneNumber
          : '966' + phoneNumber;
        const getUserByPhoneNumberRes =
          await this.v2Service.getUserByPhoneNumber({
            phoneNumber: '+' + formatPhone.trim(),
          });
        if (getUserByPhoneNumberRes?.users) {
          matchCondition = {
            ownerId: { $in: getUserByPhoneNumberRes?.users?.map((i) => i.id) },
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
    const wallets = await this.model
      .find(matchCondition)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: 1 })
      .exec();

    const count = await this.model.count(matchCondition).exec();

    return {
      items: wallets,
      total: count,
      limit: limit,
      offset: offset,
    };
  }

  async findOne(id: string): Promise<Wallet> {
    let wallet: Wallet = await this.model.findById(id).exec();
    if (wallet) {
      const user = await this.v2Service.getUserById({
        id: wallet.ownerId,
      });
      if (user) {
        wallet.phoneNumber = user.phoneNumber;
        wallet.userName = user.name;
      }
      wallet = await this.getWalletBalances(wallet, wallet.ownerId);
    }
    return wallet;
  }

  async findByIds(walletIds: string[]): Promise<Record<string, Wallet>> {
    const wallets = await this.model.find({ _id: { $in: walletIds } });
    return wallets.reduce((acc, curr) => {
      return {
        ...acc,
        [curr._id]: {
          ...curr.toObject(),
        },
      };
    }, {});
  }

  async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
    return await new this.model({
      ...createWalletDto,
      tag: this.generateWalletTag(),
      status: WalletStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).save();
  }

  async update(id: string, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    return await this.model
      .findByIdAndUpdate(
        id,
        { ...updateWalletDto, ...{ updatedAt: new Date() } },
        {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        },
      )
      .exec();
  }

  async creditToWallet(
    walletId: string,
    amountToCredit: number,
  ): Promise<Wallet> {
    const wallet: WalletDocument = await this.model.findById(walletId).exec();
    amountToCredit = Math.round(amountToCredit * 100) / 100;
    wallet.balance = Math.round((wallet.balance + amountToCredit) * 100) / 100;
    return await wallet.save();
  }

  async delete(id: string): Promise<Wallet> {
    return await this.model.findByIdAndDelete(id).exec();
  }

  async findOneByUserId(userId: string): Promise<Wallet> {
    let wallet: Wallet = await this.model.findOne({ ownerId: userId }).exec();
    if (!wallet) {
      wallet = await new this.model({
        ownerId: userId,
        tag: this.generateWalletTag(),
        status: 'Active',
        createdAt: new Date(),
        updatedAt: new Date(),
      }).save();
    }
    return await this.getWalletBalances(wallet, wallet.ownerId);
  }

  private generateWalletTag = () => {
    return (
      'W' +
      Math.round(new Date().getTime() / 1000) +
      Math.floor(1000 + Math.random() * 9000)
    );
  };

  async withdraw(walletId: string, amount: number): Promise<unknown> {
    amount = Math.round(amount * 100) / 100;
    const wallet: WalletDocument = await this.model.findById(walletId).exec();
    wallet.balance = Math.round((wallet.balance - amount) * 100) / 100;
    return await wallet.save();
  }

  async getWalletTransactionsOwner(walletId: string) {
    let transactions: any = await this.transactionService.findByWalletId(
      walletId,
    );
    transactions = transactions.map((t: any) => {
      t = t.toObject();
      t.createdAt = new Date(t.createdAt).toISOString();
      t.updatedAt = new Date(t.updatedAt).toISOString();
      return t;
    });
    return transactions;
  }

  async findWalletById(walletId: string): Promise<Wallet> {
    const wallet = await this.model.findById(walletId).exec();
    return await this.getWalletBalances(wallet, wallet.ownerId);
  }

  async mappingDMUserInWallets(wallets: Wallet[]): Promise<Wallet[]> {
    const userIds = wallets.map((wallet: Wallet) => wallet.ownerId);
    const owners = await this.v2Service.getDmUsersByIds({ userIds: userIds });
    const users = owners?.users || [];
    const dmUsersMap = new Map<string, DmUser>();
    if (users.length > 0) {
      users.forEach((user: GetDmUsersResponse_DmUser) => {
        const temp: GetDmUsersResponse_DmUser = JSON.parse(
          JSON.stringify(user),
        );
        dmUsersMap.set(user.id, temp);
      });
    }
    const res = wallets.map((wallet: Wallet) => {
      if (dmUsersMap.has(wallet.ownerId)) {
        wallet.userName = dmUsersMap.get(wallet.ownerId)?.username;
        wallet.phoneNumber = dmUsersMap.get(wallet.ownerId)?.phoneNumber;
      }
      return wallet;
    });
    return res;
  }

  async mappingUserInWallets(wallets: Wallet[]): Promise<Wallet[]> {
    const userIds = [];
    wallets.forEach((t) => {
      if (t.ownerId) userIds.push(t.ownerId);
    });
    const getUsersResponse = await this.v2Service.getUsersByIds({
      userIds: userIds,
    });

    const usersMap = new Map<string, GetUsersResponse_User>();
    if (getUsersResponse.users) {
      getUsersResponse.users.forEach((user: GetUsersResponse_User) => {
        const temp: GetUsersResponse_User = JSON.parse(JSON.stringify(user));
        usersMap.set(user.id, temp);
      });
    }

    const res = wallets.map((wallet: Wallet) => {
      if (usersMap.has(wallet.ownerId)) {
        wallet.phoneNumber = usersMap.get(wallet.ownerId)?.phoneNumber;
        wallet.userName = usersMap.get(wallet.ownerId)?.name;
      }
      return wallet;
    });

    return res;
  }
  async getWalletBalances(wallet: Wallet, userId: string): Promise<Wallet> {
    const allPendingWithdrawals: Transaction[] =
      await this.transactionService.model.find({
        ownerId: userId,
        type: TransactionType.WITHDRAWAL,
        status: { $in: [TransactionStatus.PENDING, TransactionStatus.FAILED] },
      });
    const allCreditAndDepositTransactions: Transaction[] =
      await this.transactionService.model.find({
        ownerId: userId,
        type: { $in: [TransactionType.CREDIT, TransactionType.DEPOSIT] },
        status: TransactionStatus.PENDING,
      });

    wallet.pendingTransactions = allPendingWithdrawals.reduce((acc, obj) => {
      return acc + obj.amount;
    }, 0);

    wallet.onholdBalance = allCreditAndDepositTransactions.reduce(
      (acc, obj) => {
        return acc + obj.amount;
      },
      0,
    );

    wallet.availableBalance = wallet.balance - wallet.pendingTransactions;
    if (wallet.availableBalance < 0) wallet.availableBalance = 0;

    wallet.totalBalance = wallet.availableBalance + wallet.onholdBalance;

    return wallet;
  }
}
