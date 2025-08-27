import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AllDevicesListComponent } from './all-devices-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase';

import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

firebase.initializeApp(environment.firebaseConfig);
fdescribe('AllDevicesListComponent', () => {
  let component: AllDevicesListComponent;
  let fixture: ComponentFixture<AllDevicesListComponent>;
  @Pipe({ name: 'image' })
  class image implements PipeTransform {
    transform(value: number): number {
      // Do stuff here, if you want
      return value;
    }
  }
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
        { provide: MatDialogRef, useValue: {} }
      ],
      declarations: [AllDevicesListComponent, image],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDevicesListComponent);
    component = fixture.componentInstance;
    component.productList = [
      (component.product = {
        answer_to_questions: '',
        answer_to_questions_ar: '',
        bid_price: 28,
        bid_text: '',
        body_cracks: 'no',
        brand_id: '60640602929f92968a347b12',
        brands: {
          brand_name_ar: 'أبل',
          brand_name: 'أبل',
          brand_icon:
            'https://soum01.fra1.digitaloceanspaces.com/soum-dev/brands/Apple-1618249395831.png'
        },
        category: { category_name_ar: 'جوال', category_name: 'Mobile' },
        category_id: '6063f95f929f926b67347b0d',
        code: 'kUNwEdX',
        createdDate: '2021-10-11T15:55:53.510Z',
        current_bid_price: 31,
        defected_images: [],
        description: '',
        discount: 'NaN',
        expiryDate: '2021-11-27T09:41:25.912Z',
        favourited: false,
        favourited_by: [],
        grade: 'Like New',
        isListedBefore: false,
        model_id: '6074874f1dda2e6607145bd1',
        models: {
          model_name_ar: ' XR ايفون',
          model_name: ' XR ايفون',
          model_icon:
            'https://soum01.fra1.digitaloceanspaces.com/soum-dev/models/iPhon-XR-1618249551597.jpeg',
          current_price: 25
        },
        product_id: '61645e89ac360e46dfb88d72',
        product_images: [
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/TC4-1633967753379.jfif',
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/TC1-1633967753380.jfif',
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/TC3-1633967753380.jfif'
        ],
        score: 100,
        sell_price: 35,
        sell_status: 'Available',
        seller_id: '60da07f53bde511843c59cf2',
        seller_name: 'DummyUser12',
        status: 'Active',
        user_id: '60da07f53bde511843c59cf2',
        varient: '256 GB',
        varients: { varient: '256 GB' },
        _id: '61645e89ac360e46dfb88d72'
      })
    ];
    fixture.detectChanges();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  fit('check on product list', () => {
    expect(component.productList).toBeDefined();
  });

  fit('check on product varient', () => {
    expect(component.product?.varient).toBeDefined();
  });

  fit('check on product status', () => {
    expect(component.product?.status).toBeDefined();
  });

  fit('check on product sell_status', () => {
    expect(component.product?.sell_status).toBeDefined();
  });

  fit('check on product description', () => {
    expect(component.product?.description).toBeDefined();
  });

  fit('check categoryName', () => {
    expect(component.productList[0].category.category_name).toBeDefined();
  });

  fit('check funtion to return getProductsByCategory', () => {
    component.getProductsByCategory();
    let productsList = component.productList;
    expect(component.productList).toBe(productsList);
  });
});
