import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateService,
  TranslateModule,
  TranslateLoader,
  TranslateFakeLoader
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common/common.service';
import { EventsService } from 'src/app/services/core/events/events.service';
import { HttpWrapperService } from 'src/app/services/core/http-wrapper/http-wrapper.service';
import { StorageService } from 'src/app/services/core/storage/storage.service';

import { ProfileComponent } from './profile.component';

fdescribe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        RouterTestingModule,
        MatDialogModule,
        RouterModule.forRoot([]),
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        CommonService,
        { provide: MatDialogRef, useValue: {} },
        HttpWrapperService,
        TranslateService,
        NgxImageCompressService,
        StorageService,
        NgxSpinnerService,
        EventsService,
        DatePipe
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    component.sampleBoughtProduct = {
      buy_amount: 1520,
      buy_type: 'Direct',
      buyer: {
        countryCode: '966',
        mobileNumber: '11111111111',
        name: 'Lucky User',
        profilePic: '',
        _id: '60da07f53bde511843c59cf0'
      },
      buyer_address: {
        address: 'c',
        address_id: '60da07f53bde511843c59cef',
        address_type: '',
        city: 'dddd',
        latitude: '',
        longitude: '',
        postal_code: '11111'
      },
      checkout_id: 'D6FE0CC4C115CC86A66ED0E529BA60B2.uat01-vm-tx03',
      commission: 76,
      created_at: '2021-07-13T13:14:44.719Z',
      delivery_desc: '',
      dispute: 'No',
      dispute_comment: '',
      dispute_validity: '',
      grand_total: 1607.4,
      isUserNotified: true,
      order_number: 'SOUM16261820858928',
      paymentMadeToSeller: 'No',
      paymentReceivedFromBuyer: 'Yes',
      payment_type: 'STC_PAY',
      pickup_detail: {},
      product: {
        answer_to_questions: '[{"question":"How are you","answer":"1"}]',
        answer_to_questions_ar: '[{"question":"كيف حالك","answer":"1"}]',
        bid_price: 1400,
        bidding: [],
        body_cracks: 'no',
        brand_id: {
          brand_name: 'Apple',
          brand_name_ar: 'أبل',
          _id: '606d91d0072588f44e164050'
        },
        category_id: {
          category_name: 'Laptop',
          category_name_ar: 'لابتوب',
          _id: '6063f9b0929f92ef7f347b0e'
        },
        code: 'FGOqGBX',
        createdDate: '2021-07-12T13:21:17.967Z',
        current_bid_price: 1400,
        defected_images: [],
        description: 'good',
        expiryDate: '2021-08-11T13:21:17.967Z',
        favourited_by: [],
        grade: 'Extensive use',
        isApproved: true,
        isExpired: false,
        isListedBefore: false,
        model_id: {
          current_price: 50,
          model_name: 'Macbook Pro',
          model_name_ar: 'ماكب بوك برو',
          _id: '607055651343a00374c66ab8'
        },
        pick_up_address: '60da07f53bde511843c59cfb',
        previous_grade: '',
        previous_score: 0,
        product_images: [
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/user-1626096077796.svg'
        ],
        questionnaire_migration_status: 'COMPLETED',
        score: 0,
        sell_price: 1520,
        sell_status: 'Sold',
        status: 'Active',
        unansweredquestions:
          '[{"_id":"614a842f93787a68907fc802","answers":[],"choices":[{"_id":"614a842f93787a68907fc803","yes_answers":null,"option_en":"96-100","option_ar":"96-100","score":0,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a842f93787a68907fc804","yes_answers":null,"option_en":"90-95","option_ar":"90-95","score":0,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a842f93787a68907fc805","yes_answers":null,"option_en":"85-89","option_ar":"85-89","score":-1.6,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a842f93787a68907fc806","yes_answers":null,"option_en":"80-84","option_ar":"80-84","score":-2.5,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a842f93787a68907fc807","yes_answers":null,"option_en":"75-79","option_ar":"75-79","score":-4.3,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a842f93787a68907fc808","yes_answers":null,"option_en":"70-74","option_ar":"70-74","score":-6.4,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a842f93787a68907fc809","yes_answers":null,"option_en":"less than 70","option_ar":"less than 70","score":-8,"icon":"string","yes_question":null,"no_questions":null}],"questionnaire_id":"6149d98f9d55e756087932c9","order":5,"question_en":"Whats is your battery maximum charging level? (you can find it in Settings > Battery > Battery Health","question_ar":"(ماهو عمر البطارية الحالي؟ ـ(يمكنك إيجاده من الإعدادات > البطارية > عمر البطارية)","type":"dropdown"},{"_id":"614a830b93787a68907fc7fd","answers":[{"_id":"614a830b93787a68907fc7fe","sub_choices":[{"_id":"614a830b93787a68907fc800","yes_answers":null,"option_en":"Original Charger","option_ar":"شاحن أصلي ","score":0,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a830b93787a68907fc801","yes_answers":null,"option_en":"Original Box","option_ar":"كرتون أصلي ","score":0,"icon":"string","yes_question":null,"no_questions":null}],"yes_answers":null,"answer_en":"Yes","answer_ar":"نعم","score":0,"yes_question":null,"no_questions":null},{"_id":"614a830b93787a68907fc7ff","sub_choices":[],"yes_answers":null,"answer_en":"No","answer_ar":"لا","score":0,"yes_question":null,"no_questions":null}],"choices":[],"questionnaire_id":"6149d98f9d55e756087932c9","order":4,"question_en":"Do you have any of the follwing (Strap, Box or charger)?","question_ar":"هل لديك أحد ملحقات الساعة الأصلية؟","type":"yes-no-with-options"},{"_id":"614a824e93787a68907fc7f2","answers":[{"_id":"614a824e93787a68907fc7f3","sub_choices":[{"_id":"614a824e93787a68907fc7f5","yes_answers":null,"option_en":"Problems with WiFi","option_ar":"مشاكل في الواي فاي","score":-4.3,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7f6","yes_answers":null,"option_en":"Problems with Bluetooth ","option_ar":"مشاكل في البلوتوث","score":-4.3,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7f7","yes_answers":null,"option_en":"Issues with speakers","option_ar":"مشكلة في سماعات الجهاز ","score":-3.2,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7f8","yes_answers":null,"option_en":"Issues with Camera","option_ar":"مشكلة في كاميرة الجهاز ","score":-3.2,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7f9","yes_answers":null,"option_en":"Problems with the Microphone","option_ar":"مشكلة في المايكرفون","score":-3.7,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7fa","yes_answers":null,"option_en":"one of the keys isn\'t working ","option_ar":"مشكلة في أحد ازرار أو مفاتيح الجهاز","score":-3.2,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7fb","yes_answers":null,"option_en":"Touch problems","option_ar":"مشاكل في اللمس","score":-5.3,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7fc","yes_answers":null,"option_en":"battery charging plug-in doesn\'t work properly","option_ar":"منطقة إدخال الشاحن لا تعمل أحيانا","score":-8,"icon":"string","yes_question":null,"no_questions":null}],"yes_answers":null,"answer_en":"Yes","answer_ar":"نعم","score":0,"yes_question":null,"no_questions":null},{"_id":"614a824e93787a68907fc7f4","sub_choices":[],"yes_answers":null,"answer_en":"No","answer_ar":"لا","score":0,"yes_question":null,"no_questions":null}],"choices":[],"questionnaire_id":"6149d98f9d55e756087932c9","order":3,"question_en":"Functional problems with the watch (wifi, speaker, touch, etc.)","question_ar":"مشاكل في مزايا الساعة (وايفاي، اللمس، البطارية..)","type":"yes-no-with-options"},{"_id":"614a80ab93787a68907fc7ea","answers":[{"_id":"614a80ab93787a68907fc7eb","sub_choices":[{"_id":"614a80ab93787a68907fc7ed","yes_answers":null,"option_en":"Minor Break","option_ar":"كسر بسيط ","score":-10.6,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a80ab93787a68907fc7ee","yes_answers":null,"option_en":"Major Break","option_ar":"كسر رئيسي","score":-13.3,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a80ab93787a68907fc7ef","yes_answers":null,"option_en":"Dead pixels، black dots or colored lines","option_ar":"مناطق سوداء او خطوط ملونة (خطوط او نقاط على الشاشة)","score":-3.7,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a80ab93787a68907fc7f0","yes_answers":null,"option_en":"Major scratches that can be seen easily","option_ar":"خدوش رئيسية يمكن رؤيتها بسهولة","score":-3.2,"icon":"string","yes_question":null,"no_questions":null},{"_id":"614a80ab93787a68907fc7f1","yes_answers":null,"option_en":"Minor scratches that can bearly be seen","option_ar":"خدوش بسيطة يمكن رؤيتها بصعوبة","score":-1.6,"icon":"string","yes_question":null,"no_questions":null}],"yes_answers":null,"answer_en":"Yes","answer_ar":"نعم","score":0,"yes_question":null,"no_questions":null},{"_id":"614a80ab93787a68907fc7ec","sub_choices":[],"yes_answers":null,"answer_en":"No","answer_ar":"لا","score":0,"yes_question":null,"no_questions":null}],"choices":[],"questionnaire_id":"6149d98f9d55e756087932c9","order":2,"question_en":"Problems with the Laptop screen or body(scratches, dents, cracks, dead pixels, lines)","question_ar":" عيوب في الشاشة او الشكل الخارجي للجهاز (خدوش، كسور، خطوط او دوائر ملونة، صدمات)","type":"yes-no-with-options"},{"_id":"614a7e8e93787a68907fc7e7","answers":[{"_id":"614a7e8e93787a68907fc7e8","sub_choices":[],"yes_answers":null,"answer_en":"Yes","answer_ar":"نعم","score":-5.3,"yes_question":null,"no_questions":null},{"_id":"614a7e8e93787a68907fc7e9","sub_choices":[],"yes_answers":null,"answer_en":"No","answer_ar":"لا","score":0,"yes_question":null,"no_questions":null}],"choices":[],"questionnaire_id":"6149d98f9d55e756087932c9","order":1,"question_en":"Screen replacement or a repair requiring opening the laptop","question_ar":"استبدلت الشاشة أو فتحت الجهاز للصيانة","type":"yes-no-without-options"}]',
        unmatchedquestions: '',
        updatedDate: '2021-09-29T10:28:30.931Z',
        user_id: '60da07f53bde511843c59cfc',
        varient: 'i7',
        varient_ar: 'i7',
        varient_id: '607055901343a0f99ac66ab9',
        __v: 0,
        _id: '60ec41cd8a12d83db121a307'
      },
      return_reason: '',
      seller: {
        countryCode: '966',
        mobileNumber: '11111111117',
        name: 'DummyUser17',
        profilePic: '',
        _id: '60da07f53bde511843c59cfc'
      },
      shipment_detail: {},
      shipping_charge: 0,
      status: 'Active',
      transaction_detail:
        '{"id":"8ac7a4a27a9d60a2017aa001b9c11d08","paymentType":"DB","paymentBrand":"STC_PAY","amount":"1607.40","currency":"SAR","descriptor":"5715.4341.5926 Soum online","merchantTransactionId":"SOUM16261820858928","result":{"code":"000.100.110","description":"Request successfully processed in \'Merchant in Integrator Test Mode\'"},"resultDetails":{"ExtendedDescription":"Approved or completed successfully","clearingInstituteName":"Simulator_Test","ConnectorTxID1":"8ac7a4a2715570060171588b74922040","ConnectorTxID3":"26K00247","ConnectorTxID2":"4372","AcquirerResponse":"00","risk.score":"0","reconciliationId":"122181249086315863284555830375"},"customer":{"givenName":"DummyUser11","surname":"DummyUser11","mobile":"111111111111","ip":"197.52.28.64","ipCountry":"EG"},"billing":{"street1":"c","city":"dddd","state":"DDDD","postcode":"11111","country":"SA"},"customParameters":{"SHOPPER_payment_mode":"mobile"},"risk":{"score":"0"},"buildNumber":"21ede6eea18306c1066a91e117f6602c1feed77a@2021-07-12 03:42:30 +0000","timestamp":"2021-07-13 13:15:05+0000","ndc":"D6FE0CC4C115CC86A66ED0E529BA60B2.uat01-vm-tx03"}',
      transaction_id: '8ac7a4a27a9d60a2017aa001b9c11d08',
      transaction_status: 'Success',
      updated_at: '2021-07-13T13:14:44.719Z',
      vat: 11.4,
      __v: 0,
      _id: '60ed91c4690dc8ae82a01bf2'
    };
    component.showHistoryBuys = false;
    component.showHistorySold = false;
    fixture.detectChanges();
  });

  fit('Component should have title', () => {
    expect(component.title).toBe('ProfileComponent');
  });

  fit('check on product buy type', () => {
    expect(component.sampleBoughtProduct?.buy_type).toBeDefined();
  });

  fit('check on buyer mobile number', () => {
    expect(component.sampleBoughtProduct?.buyer?.mobileNumber).toBeDefined();
  });

  fit('check on on seller mobile number', () => {
    expect(component.sampleBoughtProduct?.seller?.mobileNumber).toBeDefined();
  });

  fit('check existing brand_name', () => {
    expect(
      component.sampleBoughtProduct?.product?.brand_id?.brand_name
    ).toBeDefined();
  });

  fit('check existing category_name', () => {
    expect(
      component.sampleBoughtProduct?.product?.category_id?.category_name
    ).toBeDefined();
  });

  fit('check existing varient', () => {
    expect(component.sampleBoughtProduct?.product?.varient).toBeDefined();
  });

  fit('check existing model_name', () => {
    expect(
      component.sampleBoughtProduct?.product?.model_id?.model_name
    ).toBeDefined();
  });

  fit('check existing transaction_id', () => {
    expect(component.sampleBoughtProduct?.transaction_id).toBeDefined();
  });
});
