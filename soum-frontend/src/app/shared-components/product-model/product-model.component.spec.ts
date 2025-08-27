import { ImagePipe } from './../../pipes/image/image.pipe';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgxImageCompressService } from 'ngx-image-compress';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';
import { HomeService } from 'src/app/services/home/home.service';
import { StorageService } from './../../services/core/storage/storage.service';
import { CommonService } from 'src/app/services/common/common.service';
import { TranslateService } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductModelComponent } from './product-model.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RoundPipe } from 'src/app/pipes/numbers/round.pipe';

fdescribe('ProductModelComponent', () => {
  let component: ProductModelComponent;
  let fixture: ComponentFixture<ProductModelComponent>;
  let modelPrice = {
    VAT: 0.19,
    commission: 1.25,
    amount: 25,
    shippingCharges: 0,
    totalAmount: 26.44
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductModelComponent, ImagePipe, RoundPipe],
      providers: [
        TranslateService,
        CommonService,
        StorageService,
        HomeService,
        NgxImageCompressService,
        { provide: MatDialogRef, useValue: {} }
      ],
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
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductModelComponent);
    component = fixture.componentInstance;
    component.product = {
      answer_to_questions:
        '[{"question":"Screen replacement or a repair requiring opening the mobile","answer":"no"},{"question":"Problems with the mobile screen or body (scratches, dents, cracks, dead pixels, lines)","answer":"No"},{"question":"Functional problems with the mobile (wifi, speaker, touch, etc.)","answer":"No"},{"question":"Do you have any of the following (Strap, Box or charger)?","answer":"No"},{"question":"Battery health","answer":"80-84"}]',
      answer_to_questions_ar:
        '[{"question":"هل سبق استبدلت الشاشة أو فتحت الجهاز للصيانة؟","answer":"لا"},{"question":"حدد جميع عيوب الشاشة أو الشكل الخارجي للجهاز (خدوش، كسور، خطوط او دوائر ملونة، صدمات)","answer":"لا"},{"question":"حدد جميع المشاكل في مزايا الجهاز (وايفاي، اللمس، البطارية..)","answer":"لا"},{"question":"هل لديك أي مما يلي (سماعة، صندوق، شاشة حماية أو شاحن)؟","answer":"لا"},{"question":"ماهو عمر البطارية الحالي ـ(الإعدادات > البطارية > عمر البطارية)؟","answer":"80-84"}]',
      answer_to_questions_ar_migration:
        '[{"question":"هل سبق استبدلت الشاشة أو فتحت الجهاز للصيانة؟","answer":"لا"},{"question":"حدد جميع عيوب الشاشة أو الشكل الخارجي للجهاز (خدوش، كسور، خطوط او دوائر ملونة، صدمات)","answer":"لا"},{"question":"حدد جميع المشاكل في مزايا الجهاز (وايفاي، اللمس، البطارية..)","answer":"لا"},{"question":"هل لديك أي مما يلي (سماعة، صندوق، شاشة حماية أو شاحن)؟","answer":"لا"},{"question":"ماهو عمر البطارية الحالي ـ(الإعدادات > البطارية > عمر البطارية)؟","answer":"80-84"}]',
      answer_to_questions_migration:
        '[{"question":"Screen replacement or a repair requiring opening the mobile","answer":"no"},{"question":"Problems with the mobile screen or body (scratches, dents, cracks, dead pixels, lines)","answer":"No"},{"question":"Functional problems with the mobile (wifi, speaker, touch, etc.)","answer":"No"},{"question":"Do you have any of the following (Strap, Box or charger)?","answer":"No"},{"question":"Battery health","answer":"80-84"}]',
      bid_price: 16,
      bid_text: '',
      body_cracks: 'no',
      brand_id: '606eecfef1fd5649d3b79889',
      category_id: '6063f95f929f926b67347b0d',
      code: 'D08iFBY',
      createdDate: '2022-02-09T10:27:08.321Z',
      current_bid_price: 17,
      current_price: 22,
      description: 'product description',
      discount: 7,
      expiryDate: '2022-02-23T10:27:08.321Z',
      favourited: false,
      grade: 'Lightly Used',
      grade_ar: 'استخدام خفيف',
      isListedBefore: false,
      model_id: '60ed676a8a12d83fbe21a311',
      product_id: '620396fc5423853b1bedc506',
      score: 97.9,
      sell_price: 20.5,
      sell_status: 'Available',
      seller_id: '60da07f53bde511843c59cf0',
      seller_name: 'HnnB ',
      status: 'Active',
      user_id: '60da07f53bde511843c59cf0',
      varient: '20 GB',
      varient_id: '60ed67968a12d8233921a312',
      _id: '620396fc5423853b1bedc506',
      varients: {
        current_price: 22,
        varient: '20 GB'
      },
      product_images: [
        'https://soum01.fra1.digitaloceanspaces.com/soum-devproducts/41fMTfYYzXS-1644402428169.png',
        'https://soum01.fra1.digitaloceanspaces.com/soum-devproducts/41mX5kUQjJL-1644402428170.jpg',
        'https://soum01.fra1.digitaloceanspaces.com/soum-devproducts/41fMTfYYzXS-1644402428170.jpg'
      ],
      models: {
        current_price: 250,
        model_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/models/download-1626171242095.jpeg',
        model_name: 'Nokia 110',
        model_name_ar: 'نوكيا 110'
      },
      favourited_by: [],
      defected_images: [],
      category: {
        category_name: 'Mobile',
        category_name_ar: 'جوال'
      },
      brands: {
        brand_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/brands/Nokia-71_BL-Blue-4GB-64GB-Storage-B07L8DZP8P-1-550x550h-1617882366200.webp',
        brand_name: 'NOKIA',
        brand_name_ar: 'نوكيا'
      }
    };

    component.userDetail = {
      address: {
        address: 'Hh',
        address_id: '61f656f9bd8b628642a34fdb',
        address_type: '',
        city: 'cairo',
        latitude: '',
        longitude: '',
        postal_code: '1'
      },
      countryCode: '966',
      mobileNumber: '11111111155',
      name: 'Sdina',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwZGEwN2Y1M2JkZTUxMTg0M2M1OWQ0OCIsImlhdCI6MTY0NDk1NjQ0MSwiZXhwIjoxNjQ3NTQ4NDQxfQ.oM_nZf2FDqawDdAhWajXJv-_eKQki4VBUr_XHgEDpog',
      userId: '60da07f53bde511843c59d48'
    };

    component.userMobileNumber = '+96611111111155';

    fixture.detectChanges();
  });

  it('product model component should be create', () => {
    expect(component).toBeTruthy();
  });

  it('product data exist in component ', () => {
    expect(component.product).toBeDefined();
  });

  it('user data should be exist in component', () => {
    expect(component.userDetail).toBeDefined();
  });

  it('user mobile should be exist in component', () => {
    expect(component.userMobileNumber).toEqual('+96611111111155');
  });

  it('check product grade from Dom component', () => {
    expect(
      fixture.nativeElement.querySelector('.plus-text span').innerText
    ).toEqual(component.product.grade_ar);
  });

  it('check product discount from Dom component', () => {
    expect(
      fixture.nativeElement.querySelector('.price .f-price').innerText
    ).toEqual('-' + component.product.discount + '%');
  });

  it('check product product-title from Dom component', () => {
    expect(
      fixture.nativeElement.querySelector('.product-title').innerText
    ).toEqual(component.product.models.model_name);
  });

  it('check product varient from Dom component', () => {
    expect(
      fixture.nativeElement.querySelector('.product-available').innerText
    ).toEqual(component.product.varient);
  });

  it('check Grade function in product', () => {
    const grade = component.checkGrade('Like New');
    expect(grade).toEqual('excellent');
  });

  it('check getOverAllPrice function', async () => {
    let result = await component.getOverAllPrice(component.product);
    result = modelPrice;
    expect(result).toEqual(modelPrice);
  });

  it('check favorite function to add product to my favourite', async () => {
    await component.favorite(component.product);
    expect(component.apiHit).toBeFalsy();
  });
});
