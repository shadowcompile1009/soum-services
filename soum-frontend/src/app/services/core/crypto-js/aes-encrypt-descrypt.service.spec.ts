import { TestBed } from '@angular/core/testing';

import { AesEncryptDescryptService } from './aes-encrypt-descrypt.service';

describe('AesEncryptDescryptService', () => {
  let service: AesEncryptDescryptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AesEncryptDescryptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
