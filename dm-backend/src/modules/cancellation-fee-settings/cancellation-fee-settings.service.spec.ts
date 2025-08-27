import { Test, TestingModule } from '@nestjs/testing';
import { CancellationFeeSettingsService } from './cancellation-fee-settings.service';

describe('CancellationFeeSettingsService', () => {
  let service: CancellationFeeSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CancellationFeeSettingsService],
    }).compile();

    service = module.get<CancellationFeeSettingsService>(
      CancellationFeeSettingsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
