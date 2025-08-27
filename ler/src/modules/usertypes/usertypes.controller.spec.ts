import { Test, TestingModule } from '@nestjs/testing';
import { UserTypesController } from './usertypes.controller';

describe('UserTypesController', () => {
  let controller: UserTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTypesController],
    }).compile();

    controller = module.get<UserTypesController>(UserTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
