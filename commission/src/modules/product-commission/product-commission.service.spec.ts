import { Test, TestingModule } from '@nestjs/testing';
import { ProductCommissionService } from './product-commission.service';

describe('ProductCommissionService', () => {
  let service: ProductCommissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCommissionService],
    }).compile();

    service = module.get<ProductCommissionService>(ProductCommissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
