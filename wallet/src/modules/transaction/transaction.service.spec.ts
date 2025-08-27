import { Test, TestingModule } from '@nestjs/testing';

import { TransactionService } from '@modules/transaction/transaction.service';
import { V2Service } from '@modules/v2/v2.service';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionService],
      imports: [],
    })
      .useMocker((token) => {
        if (token === V2Service) {
          return {
            getDmUserById: jest.fn().mockResolvedValue({
              id: 'mock_id',
              status: 'Active',
              email: 'mock@email.com',
              username: 'mockUser',
            }),
          };
        }
        return {};
      })
      .compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDmUserById', () => {
    it('returns username if first name and last name are not present', async () => {
      const dmUserName = await service.getDmUserName('mock_id');
      expect(dmUserName).toBe('mockUser');
    });
  });

  describe('checkBounds', () => {
    it('returns true if a two numbers are within a certain percentage bound', () => {
      const result = service.checkBounds({
        targetNumber: 100,
        checkNumber: 110,
        boundPercentage: 10,
      });

      expect(result).toBe(true);
    });

    it('returns false if a two numbers are out of a certain percentage bound', () => {
      const result = service.checkBounds({
        targetNumber: 100,
        checkNumber: 111,
        boundPercentage: 10,
      });

      expect(result).toBe(false);
    });
  });
});
