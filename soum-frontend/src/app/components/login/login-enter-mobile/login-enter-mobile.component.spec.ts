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
import { ProfileService } from 'src/app/services/profile/profile.service';

import { LoginEnterMobileComponent } from './login-enter-mobile.component';

fdescribe('LoginEnterMobileComponent', () => {
  let component: LoginEnterMobileComponent;
  let fixture: ComponentFixture<LoginEnterMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginEnterMobileComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        NgxImageCompressService,
        CommonService,
        ProfileService,
        StorageService,
        AuthorizationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginEnterMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
