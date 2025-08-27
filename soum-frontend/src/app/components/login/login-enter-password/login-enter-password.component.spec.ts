import {
  AuthorizationService,
  SendOtp
} from 'src/app/services/auth/authorization.service';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader,
  TranslateService
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalizeService } from 'src/app/services/core/localization/localize.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

import { LoginEnterPasswordComponent } from './login-enter-password.component';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { SecondScreenLoginComponent } from '../second-screen-login/second-screen-login.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

fdescribe('LoginEnterPasswordComponent', () => {
  let component: LoginEnterPasswordComponent;
  let fixture: ComponentFixture<LoginEnterPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginEnterPasswordComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login/continue', component: SecondScreenLoginComponent }
        ]),
        MatDialogModule,
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
        CommonService,
        { provide: MatDialogRef, useValue: {} },
        ProfileService,
        StorageService,
        AuthorizationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEnterPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset otp', inject(
    [AuthorizationService],
    (authService: AuthorizationService) => {
      spyOn(authService, 'resendOtp').and.callThrough();
      component.resendOtp();
      expect(component.otp1).toBeUndefined();
    }
  ));
});
