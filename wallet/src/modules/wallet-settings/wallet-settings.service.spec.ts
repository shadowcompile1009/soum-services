import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  WalletSettingsConfig,
  WalletSettingsConfigDocument,
} from '@src/modules/wallet-settings/schemas/wallet-settings-config.schema';
import {
  WalletSettings,
  WalletSettingsSchemaDocument,
} from '@src/modules/wallet-settings/schemas/wallet-settings.schema';
import { WalletSettingsService } from './wallet-settings.service';
import { Model, Query } from 'mongoose';

const mockWalletSettings = (
  name = 'sellerDepositList',
  display = 'Seller Deposit List',
  description = 'Toggle that enable seller listing fees',
  type = 'Seller Deposit',
  configurable = true,
  value = true,
  createdAt = new Date('2023-01-04T14:33:02.894Z'),
): WalletSettings => ({
  name,
  display,
  description,
  type,
  configurable,
  value,
  createdAt,
});
const mockWalletSettingsDoc = (
  mock?: Partial<WalletSettings>,
): Partial<WalletSettingsSchemaDocument> => ({
  name: mock?.name || 'sellerDepositList',
  display: mock?.display || 'Seller Deposit List',
  description: mock?.description || 'Toggle that enable seller listing fees',
  type: mock?.type || 'Seller Deposit',
  configurable: mock?.configurable || true,
  value: mock?.value || true,
  createdAt: mock?.createdAt || new Date('2023-01-04T14:33:02.894Z'),
  updatedAt: mock?.updatedAt || new Date('2023-01-04T14:33:02.894Z'),
});
const mockWalletSettingsArray: Partial<WalletSettingsSchemaDocument>[] = [
  mockWalletSettingsDoc(),
  mockWalletSettingsDoc({
    name: 'sellerWalletPayout',
    display: 'Seller Wallet Payout',
    description:
      'Toggle the Automated Seller Wallet Payout (Sensitive do not modify)',
    type: 'Automation',
    configurable: false,
    value: false,
    createdAt: new Date('2023-01-04T14:33:02.894Z'),
  }),
];

const mockWalletSettingsConfig = (
  walletSettingsId = '6391bfd4b137ee77372f84d0',
  config = '[{"name":"minDepositFee","display":"Minimum Deposit Fee","value":20}]',
  createdAt = new Date('2023-01-04T14:33:02.894Z'),
  updatedAt = new Date('2023-01-04T14:33:02.894Z'),
): WalletSettingsConfig => ({
  walletSettingsId,
  config,
  createdAt,
  updatedAt,
});

describe('WalletSettingsService', () => {
  let walletSettingsService: WalletSettingsService;
  let walletSettingsModel: Model<WalletSettingsSchemaDocument>;
  let walletSettingsConfigModel: Model<WalletSettingsConfigDocument>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletSettingsService,
        {
          provide: 'WalletSettingsModel',
          useValue: {
            new: jest.fn().mockResolvedValue(mockWalletSettings()),
            constructor: jest.fn().mockResolvedValue(mockWalletSettings()),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            count: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            skip: jest.fn(),
            limit: jest.fn(),
            sort: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: 'WalletSettingsConfigModel',
          useValue: {
            new: jest.fn().mockResolvedValue(mockWalletSettingsConfig()),
            constructor: jest
              .fn()
              .mockResolvedValue(mockWalletSettingsConfig()),
            find: jest.fn(),
            findOne: jest.fn(),
            exec: jest.fn(),
          },
        },
        ConfigService,
        {
          provide: HttpService,
          useValue: createMock<HttpService>(),
        },
      ],
    }).compile();
    walletSettingsService = module.get<WalletSettingsService>(
      WalletSettingsService,
    );
    walletSettingsModel = module.get<Model<WalletSettingsSchemaDocument>>(
      'WalletSettingsModel',
    );
    walletSettingsConfigModel = module.get<Model<WalletSettingsConfigDocument>>(
      'WalletSettingsConfigModel',
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('walletSettingsService should be defined', () => {
    expect(walletSettingsService).toBeDefined();
  });

  it('should findByNames', async () => {
    jest.spyOn(walletSettingsModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockWalletSettingsArray),
    } as unknown as Query<WalletSettingsSchemaDocument[], WalletSettingsSchemaDocument>);
    const foundWalletSettings = await walletSettingsService.findByNames('test');
    expect(foundWalletSettings[0]).toMatchObject(mockWalletSettingsArray[0]);
  });

  it('should getListingFee', async () => {
    jest.spyOn(walletSettingsModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue({
        _id: '6391bfd4b137ee77372f84d0',
        name: 'sellerListingFee',
        display: 'Seller Listing Fee',
        description: 'Seller Listing Fee',
        type: 'Seller Listing Fee',
        configurable: true,
        value: true,
        createdAt: new Date('2023-01-04T14:33:02.894Z')
      }),
    } as unknown as Query<WalletSettingsSchemaDocument, WalletSettingsSchemaDocument>);
    jest.spyOn(walletSettingsConfigModel, 'findOne').mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockWalletSettingsConfig()),
    } as unknown as Query<WalletSettingsConfigDocument, WalletSettingsConfigDocument>);
    const findWalletSettingsConfigDoc = mockWalletSettingsConfig(
      '6391bfd4b137ee77372f84d0',
      '[{"name":"minDepositFee","display":"Minimum Deposit Fee","value":20}]',
      new Date('2023-01-04T14:33:02.894Z'),
      new Date('2023-01-04T14:33:02.894Z'),
    );
    const foundWalletSettingsConfig = await walletSettingsService.getListingFee(
      'test',
    );
    expect(foundWalletSettingsConfig).toMatchObject(
      findWalletSettingsConfigDoc,
    );
  });
});
