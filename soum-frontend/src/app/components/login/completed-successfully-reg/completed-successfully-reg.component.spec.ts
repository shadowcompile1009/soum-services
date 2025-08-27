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
import { CommonService } from 'src/app/services/common/common.service';

import { CompletedSuccessfullyRegComponent } from './completed-successfully-reg.component';

fdescribe('CompletedSuccessfullyRegComponent', () => {
  let component: CompletedSuccessfullyRegComponent;
  let fixture: ComponentFixture<CompletedSuccessfullyRegComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompletedSuccessfullyRegComponent],
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
        CommonService,
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedSuccessfullyRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
