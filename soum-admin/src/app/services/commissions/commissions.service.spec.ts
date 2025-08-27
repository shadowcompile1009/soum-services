import { TestBed } from '@angular/core/testing';

import { CommissionsService } from './commissions.service';

describe('CollectionsService', () => {
  let service: CommissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
