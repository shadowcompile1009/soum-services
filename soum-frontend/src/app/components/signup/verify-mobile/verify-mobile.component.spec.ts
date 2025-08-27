import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { AuthorizationService } from 'src/app/services/auth/authorization.service';
import { CommonService } from 'src/app/services/common/common.service';
import { StorageService } from 'src/app/services/core/storage/storage.service';

import { VerifyMobileComponent } from './verify-mobile.component';

fdescribe('VerifyMobileComponent', () => {
  let component: VerifyMobileComponent;
  let fixture: ComponentFixture<VerifyMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerifyMobileComponent],
      imports: [
        MatDialogModule,
        RouterTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        NgxImageCompressService,
        { provide: MatDialogRef, useValue: {} },
        CommonService,
        StorageService,
        AuthorizationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
