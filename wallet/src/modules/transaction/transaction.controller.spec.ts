import { Test, TestingModule } from '@nestjs/testing';

import { TransactionController } from '@modules/transaction/transaction.controller';
import { WalletService } from '../wallet/wallet.service';
import { V2Service } from '../v2/v2.service';
import { HyperpayService } from '../hyperpay/hyperpay.service';
import { TransactionService } from './transaction.service';
import { HttpService } from '@nestjs/axios';
import { WalletSettingsService } from '../wallet-settings/wallet-settings.service';
import { ConfigService } from '@nestjs/config';

describe('TransactionController', () => {
  let controller: TransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        WalletService,
        {
          provide: 'WalletModel',
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: 'WalletSettingsModel',
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: 'TransactionModel',
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: 'WalletSettingsConfigModel',
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        V2Service,
        HyperpayService,
        {
          provide: 'BullQueue_hyperpay-transactions',
          useValue: '',
        },
        {
          provide: 'v2',
          useValue: '',
        },
        {
          provide: 'CONFIGURATION(hyperpay)',
          useValue: '',
        },
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: '',
        },
        HttpService,
        TransactionService,
        WalletSettingsService,
        ConfigService
      ]
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
