import { Test, TestingModule } from '@nestjs/testing';
import { BidSettingsService } from './bid-settings.service';

describe('BidSettingsService', () => {
  let service: BidSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BidSettingsService],
    }).compile();

    service = module.get<BidSettingsService>(BidSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
