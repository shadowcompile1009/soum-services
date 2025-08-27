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
import { SecondScreenLoginComponent } from '../../login/second-screen-login/second-screen-login.component';

import { SignupPasswordComponent } from './signup-password.component';

fdescribe('SignupPasswordComponent', () => {
  let component: SignupPasswordComponent;
  let fixture: ComponentFixture<SignupPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupPasswordComponent],
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
        { provide: MatDialogRef, useValue: {} },
        CommonService,
        StorageService,
        AuthorizationService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
