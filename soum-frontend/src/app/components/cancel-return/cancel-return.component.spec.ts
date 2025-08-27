import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { BuyService } from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';
import { HttpWrapperService } from 'src/app/services/core/http-wrapper/http-wrapper.service';

import { CancelReturnComponent } from './cancel-return.component';

fdescribe('CancelReturnComponent', () => {
  let component: CancelReturnComponent;
  let fixture: ComponentFixture<CancelReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelReturnComponent],
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
        HttpWrapperService,
        BuyService,
        NgxImageCompressService,
        CommonService,
        { provide: MatDialog, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelReturnComponent);
    component = fixture.componentInstance;
    component.reason = '';
    component.order_id = '';
    fixture.detectChanges();
  });

  fit('test should create cancel component', () => {
    expect(component).toBeTruthy();
  });

  fit('test cancelOrder function to see reason', () => {
    component.cancelOrder();
    expect(component.reason).toBeDefined();
  });

  fit('test order have id or not', () => {
    expect(component.order_id).toBeDefined();
  });
});
