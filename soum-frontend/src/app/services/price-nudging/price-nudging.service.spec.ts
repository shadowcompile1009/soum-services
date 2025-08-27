import { TestBed } from '@angular/core/testing';

import { PriceNudgingService } from './price-nudging.service';

describe('PriceNudgingService', () => {
  let service: PriceNudgingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PriceNudgingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
