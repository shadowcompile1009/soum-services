import { Test, TestingModule } from '@nestjs/testing';
import { ImageSectionController } from './image-section.controller';

describe('ImageSectionController', () => {
  let controller: ImageSectionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageSectionController],
    }).compile();

    controller = module.get<ImageSectionController>(ImageSectionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
