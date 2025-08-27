import { TestBed } from '@angular/core/testing';

import { ImageRestructionsService } from './image-restructions.service';

describe('ImageRestructionsService', () => {
  let service: ImageRestructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageRestructionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
