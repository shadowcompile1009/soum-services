import { Test, TestingModule } from '@nestjs/testing';

import { HyperpayService } from '@modules/hyperpay/hyperpay.service';
import { HttpService } from '@nestjs/axios';

describe('HyperpayService', () => {
  let service: HyperpayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HyperpayService,
        {
          provide: 'CONFIGURATION(hyperpay)',
          useValue: '',
        },
        {
          provide: 'AXIOS_INSTANCE_TOKEN',
          useValue: '',
        },
        HttpService
      ],
    }).compile();

    service = module.get<HyperpayService>(HyperpayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
