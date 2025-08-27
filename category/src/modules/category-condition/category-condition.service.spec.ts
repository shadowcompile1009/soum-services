import { Test, TestingModule } from '@nestjs/testing';
import { CategoryConditionService } from './category-condition.service';

describe('CategoryConditionService', () => {
  let service: CategoryConditionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryConditionService],
    }).compile();

    service = module.get<CategoryConditionService>(CategoryConditionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
