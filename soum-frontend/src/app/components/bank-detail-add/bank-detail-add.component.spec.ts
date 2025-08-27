import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BankDetailAddComponent } from './bank-detail-add.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Router } from '@angular/router';

describe('BankDetailAddComponent', () => {
  let component: BankDetailAddComponent;
  let fixture: ComponentFixture<BankDetailAddComponent>;
  const mockRouter = {
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
        { provide: Router, useValue: mockRouter }
      ],
      declarations: [BankDetailAddComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BankDetailAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
