import { HttpWrapperService } from './../core/http-wrapper/http-wrapper.service';
import { CommonService } from 'src/app/services/common/common.service';
import { TestBed } from '@angular/core/testing';

import { AuthorizationService } from './authorization.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SecondScreenLoginComponent } from 'src/app/components/login/second-screen-login/second-screen-login.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

fdescribe('AuthorizationService', () => {
  let service: AuthorizationService;
  let commonService: CommonService;
  let httpWrapper: HttpWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule.withRoutes([
          { path: 'login/continue', component: SecondScreenLoginComponent }
        ]),
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
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(AuthorizationService);
    commonService = TestBed.inject(CommonService);
    httpWrapper = TestBed.inject(HttpWrapperService);
  });

  fit('should be created', () => {
    expect(service).toBeTruthy();
  });

  fit('should call login function', () => {
    let payload = {
      countryCode: '966',
      mobileNumber: '0534747462',
      password: '111111'
    };
    spyOn(httpWrapper, 'post').and.callThrough();
    service.login(payload);
    expect(httpWrapper.post).toHaveBeenCalled();
  });

  fit('should send Otp code', () => {
    let payload = {
      countryCode: '966',
      mobileNumber: '0534747462',
      password: '111111'
    };
    spyOn(httpWrapper, 'post').and.callThrough();
    service.resendOtp(payload);
    expect(httpWrapper.post).toHaveBeenCalled();
  });
});
