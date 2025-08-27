import { Test, TestingModule } from '@nestjs/testing';
import { CategoryConditionController } from './category-condition.controller';

describe('CategoryConditionController', () => {
  let controller: CategoryConditionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryConditionController],
    }).compile();

    controller = module.get<CategoryConditionController>(CategoryConditionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
