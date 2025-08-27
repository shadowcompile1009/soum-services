import { Test, TestingModule } from '@nestjs/testing';
import { UsertypesService } from './usertypes.service';

describe('UsertypesService', () => {
  let service: UsertypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsertypesService],
    }).compile();

    service = module.get<UsertypesService>(UsertypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
