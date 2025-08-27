import { Test, TestingModule } from '@nestjs/testing';
import { LerService } from './ler.service';

describe('LerService', () => {
  let service: LerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LerService],
    }).compile();

    service = module.get<LerService>(LerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
