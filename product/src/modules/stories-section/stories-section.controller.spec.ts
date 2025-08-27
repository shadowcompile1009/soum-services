import { Test, TestingModule } from '@nestjs/testing';
import { StoriesSectionController } from './stories-section.controller';

describe('StoriesSectionController', () => {
  let controller: StoriesSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoriesSectionController],
    }).compile();

    controller = module.get<StoriesSectionController>(StoriesSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
