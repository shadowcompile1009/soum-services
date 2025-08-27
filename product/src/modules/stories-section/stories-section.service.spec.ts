import { Test, TestingModule } from '@nestjs/testing';
import { StoriesSectionService } from './stories-section.service';

describe('StoriesSectionService', () => {
  let service: StoriesSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoriesSectionService],
    }).compile();

    service = module.get<StoriesSectionService>(StoriesSectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
