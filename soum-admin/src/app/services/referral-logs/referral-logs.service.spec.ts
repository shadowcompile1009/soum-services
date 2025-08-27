import { TestBed } from '@angular/core/testing';

import { ReferralLogsService } from './referral-logs.service';

describe('ReferralLogsService', () => {
  let service: ReferralLogsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralLogsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
