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

import { FirstScreenLoginComponent } from './first-screen-login.component';

fdescribe('FirstScreenLoginComponent', () => {
  let component: FirstScreenLoginComponent;
  let fixture: ComponentFixture<FirstScreenLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FirstScreenLoginComponent],
      imports: [
        RouterTestingModule,
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
        AuthorizationService,
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstScreenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
