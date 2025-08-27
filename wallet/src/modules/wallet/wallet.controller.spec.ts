import { Test, TestingModule } from '@nestjs/testing';

import { WalletController } from '@modules/wallet/wallet.controller';
import { WalletService } from './wallet.service';
import { V2Service } from '../v2/v2.service';
import { TransactionService } from '../transaction/transaction.service';
import { HyperpayService } from '../hyperpay/hyperpay.service';
import { HttpService } from '@nestjs/axios';
import { WalletSettingsService } from '../wallet-settings/wallet-settings.service';
import { ConfigService } from '@nestjs/config';

describe('WalletController', () => {
  let controller: WalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletController],
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
        TransactionService,
        V2Service,
        WalletSettingsService,
        HyperpayService,
        ConfigService,
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
      ],
    }).compile();

    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
