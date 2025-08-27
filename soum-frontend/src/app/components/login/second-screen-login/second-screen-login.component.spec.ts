import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalizeService } from 'src/app/services/core/localization/localize.service';
import { SecondScreenLoginComponent } from './second-screen-login.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

fdescribe('SecondScreenLoginComponent', () => {
  let component: SecondScreenLoginComponent;
  let fixture: ComponentFixture<SecondScreenLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SecondScreenLoginComponent],
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
        NgxImageCompressService,
        CommonService,
        LocalizeService,
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondScreenLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call translate service', inject(
    [TranslateService],
    (translateService: TranslateService) => {
      spyOn(translateService, 'getDefaultLang').and.callThrough();
      component.getDefaultLanguage();
      expect(translateService.getDefaultLang).toHaveBeenCalled();
    }
  ));
});
