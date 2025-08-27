import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Model, Query } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';
import { WalletService } from '@modules/wallet/wallet.service';
import { fakeUser } from '../../../test/mock-data/user';
import { fakeWallets } from '../../../test/mock-data/wallet';
import { HyperpayService } from '../hyperpay/hyperpay.service';
import {
  Transaction,
  TransactionDocument,
} from '../transaction/schemas/transaction.schema';
import { TransactionService } from '../transaction/transaction.service';
import { V2Service } from '../v2/v2.service';
import { Wallet, WalletDocument } from './schemas/wallet.schema';

const mockWallet = (): Wallet => ({
  id: '6391cf4f5b777f088e2ea6ed',
  ownerId: '627bc734b74ee8213ab83d7e',
  tag: 'W16705001755567',
  balance: 0,
  status: 'Active',
  createdAt: new Date('2023-01-04T14:33:02.894Z'),
  updatedAt: new Date('2023-01-04T14:33:02.894Z'),
  phoneNumber: '966551325412',
  userName: 'Martin',
  pendingTransactions: 0,
  onholdBalance: 0,
  availableBalance: 0,
  totalBalance: 0,
});

const mockWalletDoc = (mock?: Partial<Wallet>): Partial<WalletDocument> => ({
  id: mock?.id || '6391cf4f5b777f088e2ea6ed',
  ownerId: mock?.ownerId || '627bc734b74ee8213ab83d7e',
  tag: mock?.tag || 'W16705001755567',
  balance: mock?.balance || 0,
  status: mock?.status || 'Active',
  createdAt: mock?.createdAt || new Date('2023-01-04T14:33:02.894Z'),
  updatedAt: mock?.updatedAt || new Date('2023-01-04T14:33:02.894Z'),
});

const mockCreditPendingTransactionDoc = (
  mock?: Partial<Transaction>,
): Partial<TransactionDocument> => ({
  _id: mock?.id || '6396ef386684b4dfc5036f02',
  ownerId: mock?.ownerId || '627bc734b74ee8213ab83d7e',
  walletId: mock?.walletId || '6395d2bd8e0aef45ff6920b2',
  orderId: mock?.orderId || '6396ef107433570028cf1197',
  amount: mock?.amount || 0.94,
  status: mock?.status || 'Pending',
  type: mock?.type || 'Credit',
  history: mock?.history || [],
  description: mock?.description || '',
  metadata: mock?.metadata || null,
  createdAt: mock?.createdAt || new Date('2023-01-04T14:33:02.894Z'),
  updatedAt: mock?.updatedAt || new Date('2023-01-04T14:33:02.894Z'),
});

const mockCreditPendingTransactionArray: Partial<TransactionDocument>[] = [
  mockCreditPendingTransactionDoc(),
];
const mockWithdrawalPendingTransactionDoc = (
  mock?: Partial<Transaction>,
): Partial<TransactionDocument> => ({
  _id: mock?.id || '6396ef386684b4dfc5036f02',
  ownerId: mock?.ownerId || '627bc734b74ee8213ab83d7e',
  walletId: mock?.walletId || '6395d2bd8e0aef45ff6920b2',
  orderId: mock?.orderId || '6396ef107433570028cf1197',
  amount: mock?.amount || 0.94,
  status: mock?.status || 'Pending',
  type: mock?.type || 'Withdrawal',
  history: mock?.history || [],
  description: mock?.description || '',
  metadata: mock?.metadata || null,
  createdAt: mock?.createdAt || new Date('2023-01-04T14:33:02.894Z'),
  updatedAt: mock?.updatedAt || new Date('2023-01-04T14:33:02.894Z'),
});

const mockWithdrawalPendingTransactionArray: Partial<TransactionDocument>[] = [
  mockWithdrawalPendingTransactionDoc(),
];

describe('WalletService - findOne', () => {
  let walletService: WalletService;
  let v2Service: V2Service;
  let walletModel: Model<WalletDocument>;
  let transactionModel: Model<TransactionDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        WalletService,
        {
          provide: 'WalletModel',
          useValue: {
            new: jest.fn().mockResolvedValue(mockWallet()),
            constructor: jest.fn().mockResolvedValue(mockWallet()),
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
            new: jest.fn().mockResolvedValue(mockWallet()),
            constructor: jest.fn().mockResolvedValue(mockWallet()),
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
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    v2Service = module.get<V2Service>(V2Service);
    walletModel = module.get<Model<WalletDocument>>('WalletModel');
    transactionModel =
      module.get<Model<TransactionDocument>>('TransactionModel');
  });

  it('walletService should be defined', () => {
    expect(walletService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should getOne by id', async () => {
    jest.spyOn(walletModel, 'findById').mockReturnValueOnce(
      createMock<Query<WalletDocument, WalletDocument>>({
        exec: jest.fn().mockResolvedValueOnce(
          mockWalletDoc({
            id: '6391cf4f5b777f088e2ea6ed',
            ownerId: '627bc734b74ee8213ab83d7e',
            tag: 'W16705001755567',
            balance: 0,
            status: 'Active',
            createdAt: new Date('2023-01-04T14:33:02.894Z'),
            updatedAt: new Date('2023-01-04T14:33:02.894Z'),
          }),
        ),
      }),
    );
    const findMockWallet = {
      id: '6391cf4f5b777f088e2ea6ed',
      ownerId: '627bc734b74ee8213ab83d7e',
      tag: 'W16705001755567',
      balance: 0,
      status: 'Active',
      createdAt: new Date('2023-01-04T14:33:02.894Z'),
      updatedAt: new Date('2023-01-04T14:33:02.894Z'),
      phoneNumber: '966551325412',
      userName: 'Martin'
    };
    jest.spyOn(v2Service, 'getUserById').mockImplementation(({ id }) => {
      expect(id).toEqual(fakeWallets[0].ownerId);
      return Promise.resolve({ ...fakeUser, id } as any);
    });
    jest.spyOn(transactionModel, 'find').mockReturnValue({
      exec: jest
        .fn()
        .mockResolvedValueOnce(mockWithdrawalPendingTransactionArray),
    } as unknown as Query<TransactionDocument[], TransactionDocument>);
    jest.spyOn(transactionModel, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(mockCreditPendingTransactionArray),
    } as unknown as Query<TransactionDocument[], TransactionDocument>);
    jest.spyOn(Array.prototype, 'reduce').mockReturnValue(0);
    jest
      .spyOn(walletService, 'getWalletBalances')
      .mockImplementation((wallet, ownerId) => {
        expect(ownerId).toEqual('627bc734b74ee8213ab83d7e');
        return Promise.resolve({
          ...wallet
        });
      });
    const foundWallet = await walletService.findOne('6391cf4f5b777f088e2ea6ed');
    expect(foundWallet).toMatchObject(findMockWallet);
  });
});
