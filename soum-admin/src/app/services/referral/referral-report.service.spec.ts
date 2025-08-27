import { TestBed } from '@angular/core/testing';

import { ReferralReportService } from './referral-report.service';

describe('ReferralReportService', () => {
  let service: ReferralReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferralReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
