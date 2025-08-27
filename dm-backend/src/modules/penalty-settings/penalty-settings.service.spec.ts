import { Test, TestingModule } from '@nestjs/testing';
import { PenaltySettingsService } from './penalty-settings.service';

describe('PenaltySettingsService', () => {
  let service: PenaltySettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PenaltySettingsService],
    }).compile();

    service = module.get<PenaltySettingsService>(PenaltySettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
