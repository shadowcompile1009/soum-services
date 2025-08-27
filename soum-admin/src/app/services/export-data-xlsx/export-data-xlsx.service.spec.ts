import { TestBed } from '@angular/core/testing';

import { ExportDataXlsxService } from './export-data-xlsx.service';

describe('ExportDataXlsxService', () => {
  let service: ExportDataXlsxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportDataXlsxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
