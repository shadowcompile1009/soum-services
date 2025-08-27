import { Test, TestingModule } from '@nestjs/testing';
import { ImageSectionService } from './image-section.service';

describe('ImageSectionService', () => {
  let service: ImageSectionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageSectionService],
    }).compile();

    service = module.get<ImageSectionService>(ImageSectionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
