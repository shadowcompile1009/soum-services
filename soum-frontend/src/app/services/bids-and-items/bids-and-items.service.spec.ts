import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService
} from '@ngx-translate/core';
import { NgxImageCompressService } from 'ngx-image-compress';
import { CommonService } from '../common/common.service';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';
import { BidsAndItemsService } from './bids-and-items.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

fdescribe('BidsAndItemsService', () => {
  let bidAndItemsService: BidsAndItemsService;
  let httpMock: HttpTestingController;

  interface FavouritesList {
    bid_price: number;
    body_cracks: string;
    brand_id: string;
    brands: {
      brand_icon: string;
      brand_name: string;
      brand_name_ar: string;
    };
    category_id: string;
    current_bid_price: number;
    current_price: number;
    defected_images: any;
    description: string;
    discount: string;
    favourited: true;
    grade: string;
    grade_ar: string;
    model_id: string;
    models: {
      current_price: number;
      model_icon: string;
      model_name: string;
      model_name_ar: string;
    };
    product_id: string;
    product_images: any;
    score: number;
    sell_price: number;
    seller_id: string;
    seller_name: string;
    user_id: string;
    varient: string;
    _id: string;
  }

  interface BidsProduct {
    answer_to_questions: string;
    answer_to_questions_ar: string;
    bid_id: string;
    bid_price: number;
    bid_status: string;
    bidding: [
      {
        bid_date: string;
        bid_id: string;
        bid_price: number;
        bid_status: string;
        buy_amount: number;
        checkout_id: string;
        commission: string;
        grand_total: string;
        order_number: string;
        pay_bid_amount: string;
        payment_take: string;
        payment_type: string;
        remaining_bid_amount: string;
        shipping_charge: string;
        transaction_detail: string;
        transaction_id: string;
        transaction_status: string;
        user_id: string;
        vat: string;
      }
    ];
    body_cracks: string;
    brand_id: {
      brand_name: string;
      brand_name_ar: string;
    };
    category_id: {
      category_name: string;
      category_name_ar: string;
    };
    current_bid_price: number;
    current_price: number;
    defected_images: [];
    description: string;
    discount: string;
    grade: string;
    grand_total: string;
    model_id: {
      current_price: number;
      model_name: string;
      model_name_ar: string;
    };
    my_bid: number;
    pay_amount: string;
    payment_take: string;
    product_id: string;
    product_images: any;
    remaining_bid_amount: string;
    score: number;
    sell_price: number;
    seller_id: string;
    seller_name: string;
    user_id: string;
    varient: string;
    varient_id: {
      current_price: number;
      varient: string;
    };
    _id: string;
  }

  interface SoldProducts {
    answer_to_questions: string;
    answer_to_questions_ar: string;
    bid_data: {
      bid_date: string;
      bid_id: string;
      bid_price: string;
      bid_status: string;
      buy_amount: string;
      checkout_id: string;
      commission: number;
      grand_total: number;
      order_number: string;
      pay_bid_amount: string;
      payment_take: string;
      payment_type: string;
      remaining_bid_amount: string;
      shipping_charge: string;
      transaction_status: string;
      user_id: string;
      vat: number;
    };
    bidding: [
      {
        bid_date: string;
        bid_id: string;
        bid_price: string;
        bid_status: string;
        buy_amount: string;
        checkout_id: string;
        commission: number;
        grand_total: number;
        order_number: string;
        pay_bid_amount: string;
        payment_take: string;
        payment_type: string;
        remaining_bid_amount: string;
        shipping_charge: string;
        transaction_status: string;
        user_id: string;
        vat: number;
      }
    ];
    bid_price: number;
    body_cracks: string;
    brand_id: {
      brand_icon: string;
      brand_name: string;
      brand_name_ar: string;
      category_id: string;
      created_at: string;
      position: number;
      status: string;
      updated_at: string;
      __v: number;
      _id: string;
    };
    category_id: {
      category_icon: string;
      category_name: string;
      category_name_ar: string;
      created_at: string;
      position: number;
      status: string;
      updated_at: string;
      __v: number;
      _id: string;
    };
    createdDate: string;
    current_bid_price: number;
    defected_images: any;
    description: string;
    discount: string;
    expiryDate: string;
    grade: string;
    grade_ar: string;
    model_id: {
      brand_id: string;
      category_id: string;
      created_at: string;
      current_price: number;
      model_icon: string;
      model_name: string;
      model_name_ar: string;
      position: number;
      questions: any;
      status: string;
      updated_at: string;
      __v: number;
      _id: string;
    };
    product_images: any;
    promocode: {};
    save_as_draft_step: string;
    score: number;
    sell_price: number;
    sell_status: string;
    user_id: string;
    varient: string;
    varient_id: {
      brand_id: string;
      category_id: string;
      created_at: string;
      model_id: string;
      status: string;
      updated_at: string;
      varient: string;
      varient_ar: string;
      __v: number;
      _id: string;
    };
    _id: string;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatDialogModule,
        RouterModule.forRoot([]),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        TranslateService,
        NgxImageCompressService,
        CommonService,
        HttpWrapperService,
        { provide: MatDialogRef, useValue: {} }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    bidAndItemsService = TestBed.inject(BidsAndItemsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  fit('BidsAndItemsService Should be created', () => {
    expect(bidAndItemsService).toBeDefined();
  });

  fit('check function sendRouter must be found ', () => {
    expect(bidAndItemsService.sendRouter('')).toBeUndefined();
  });

  fit('check data returned from getFavoritedProductList function', () => {
    const favouritesList: FavouritesList = {
      bid_price: 7.2,
      body_cracks: 'no',
      brand_id: '60640602929f92968a347b12',
      brands: {
        brand_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/brands/Apple-1618249395831.png',
        brand_name: 'أبل',
        brand_name_ar: 'أبل'
      },
      category_id: '6063f95f929f926b67347b0d',
      current_bid_price: 7.2,
      current_price: 1000,
      defected_images: [],
      description: '',
      discount: '99',
      favourited: true,
      grade: 'Fair',
      grade_ar: 'حالة جيدة',
      model_id: '607486e11dda2e34cd145bcb',
      models: {
        current_price: 1000,
        model_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/models/iPhone-8-1618249441123.jpg',
        model_name: 'ايفون  8',
        model_name_ar: 'ايفون  8'
      },
      product_id: '61c06214299491bd64919268',
      product_images: [],
      score: 84.7,
      sell_price: 9,
      seller_id: '61307633bd9022f835e84001',
      seller_name: 'Abdullah Al Rajhi',
      user_id: '61307633bd9022f835e84001',
      varient: '256 GB',
      _id: '61c06214299491bd64919268'
    };

    bidAndItemsService
      .getFavoritedProductList()
      .subscribe((favs: FavouritesList) => {
        expect(favs).toBe(favouritesList);
      });

    const req = httpMock.expectOne(
      'https://api.qa.soum.sa/api/v1/product/favourite/list'
    );
    req.flush(favouritesList);
  });

  fit('check data returned from getMyBiddingProducts function', () => {
    const bidProducts: BidsProduct = {
      answer_to_questions: '',
      answer_to_questions_ar: '',
      bid_id: '61c23981c790723f3ddb6f68',
      bid_price: 96,
      bid_status: 'active',
      bidding: [
        {
          bid_date: '2021-12-21T20:30:57.084Z',
          bid_id: '61c23981c790723f3ddb6f68',
          bid_price: 97,
          bid_status: 'active',
          buy_amount: 97,
          checkout_id: 'F4A075C12D0C2A8CD5729C0325DEF2BE.uat01-vm-tx01',
          commission: '4.85',
          grand_total: '102.58',
          order_number: 'SOUM16401186576085',
          pay_bid_amount: '0.10',
          payment_take: 'full',
          payment_type: 'STC_PAY',
          remaining_bid_amount: '102.58',
          shipping_charge: '0',
          transaction_detail:
            '{"id":"8ac7a4a27ddc6239017ddeb0b54c6857","paymentType":"DB","paymentBrand":"STC_PAY","amount":"0.10","currency":"SAR","descriptor":"5242.9757.5332 Soum online","merchantTransactionId":"SOUM16401186576085","result":{"code":"000.100.110","description":"Request successfully processed in \'Merchant in Integrator Test Mode\'"},"resultDetails":{"ExtendedDescription":"Transaction succeeded","AcquirerResponse":"000.000.000","risk.score":"01","clearingInstituteName":"Simulator_Test","ConnectorTxID1":"8ac7a4a27ddc6239017ddeb0b54c6857"},"customer":{"givenName":"DummyUser13","surname":"DummyUser13","ip":"197.52.130.177","ipCountry":"EG"},"billing":{"street1":"Cairo","city":"Cairo","state":"CAIRO","postcode":"90242","country":"SA"},"customParameters":{"SHOPPER_payment_mode":"qr_code"},"risk":{"score":"0"},"buildNumber":"d32f3f32d2e4068242e61427fea24aeac7a91bbc@2021-12-20 12:03:32 +0000","timestamp":"2021-12-21 20:31:09+0000","ndc":"F4A075C12D0C2A8CD5729C0325DEF2BE.uat01-vm-tx01"}',
          transaction_id: '8ac7a4a27ddc6239017ddeb0b54c6857',
          transaction_status: 'Success',
          user_id: '60da07f53bde511843c59cf4',
          vat: '0.73'
        }
      ],
      body_cracks: 'no',
      brand_id: {
        brand_name: 'أبل',
        brand_name_ar: 'أبل'
      },
      category_id: {
        category_name: 'جوال',
        category_name_ar: 'جوال'
      },
      current_bid_price: 97,
      current_price: 123,
      defected_images: [],
      description: '',
      discount: '2',
      grade: 'Lightly Used',
      grand_total: '102.58',
      model_id: {
        current_price: 1000,
        model_name: 'ايفون  8',
        model_name_ar: 'ايفون  8'
      },
      my_bid: 97,
      pay_amount: '102.58',
      payment_take: 'full',
      product_id: '61b1ed8db6af1b6d9c27ef95',
      product_images: [
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/images-1639050637261.jpg',
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/iPhone-11-64GB-Black-491901638-i-1-1200Wx1200H-1639050637262.jpg',
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/download-1639050637263.jpg'
      ],
      remaining_bid_amount: '102.58',
      score: 94.9,
      sell_price: 120,
      seller_id: '60da07f53bde511843c59cfc',
      seller_name: 'Mona Soliman',
      user_id: '60da07f53bde511843c59cfc',
      varient: '256 GB',
      varient_id: {
        current_price: 123,
        varient: '256 GB'
      },
      _id: '61b1ed8db6af1b6d9c27ef95'
    };

    bidAndItemsService.getMyBiddingProducts().subscribe((bids: BidsProduct) => {
      expect(bids).toBe(bidProducts);
    });

    const req = httpMock.expectOne(
      'https://api.qa.soum.sa/api/v1/user/my-bid-products'
    );
    req.flush(bidProducts);
  });

  fit('check data returned from getMySellProducts function', () => {
    const soldProducts: SoldProducts = {
      answer_to_questions: '',
      answer_to_questions_ar: '',
      bid_data: {
        bid_date: '2022-01-05T21:11:52.405Z',
        bid_id: '61d6099829c3b6007db697d0',
        bid_price: '82',
        bid_status: 'open',
        buy_amount: '82',
        checkout_id: '',
        commission: 4.1,
        grand_total: 86.71499999999999,
        order_number: 'SOUM16414171129348',
        pay_bid_amount: '0.00',
        payment_take: 'full',
        payment_type: 'STC_PAY',
        remaining_bid_amount: '86.71',
        shipping_charge: '0',
        transaction_status: 'Success',
        user_id: '60da07f53bde511843c59d5e',
        vat: 0.6149999999999999
      },
      bidding: [
        {
          bid_date: '2022-01-05T21:11:52.405Z',
          bid_id: '61d6099829c3b6007db697d0',
          bid_price: '82',
          bid_status: 'open',
          buy_amount: '82',
          checkout_id: '',
          commission: 4.1,
          grand_total: 86.71499999999999,
          order_number: 'SOUM16414171129348',
          pay_bid_amount: '0.00',
          payment_take: 'full',
          payment_type: 'STC_PAY',
          remaining_bid_amount: '86.71',
          shipping_charge: '0',
          transaction_status: 'Success',
          user_id: '60da07f53bde511843c59d5e',
          vat: 0.6149999999999999
        }
      ],
      bid_price: 83,
      body_cracks: 'no',
      brand_id: {
        brand_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/brands/Apple-1618249395831.png',
        brand_name: 'أبل',
        brand_name_ar: 'أبل',
        category_id: '6063f95f929f926b67347b0d',
        created_at: '2021-03-31T04:11:56.704Z',
        position: 1,
        status: 'Active',
        updated_at: '2021-03-31T04:11:56.704Z',
        __v: 0,
        _id: '60640602929f92968a347b12'
      },
      category_id: {
        category_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/category/Frame-178listing%203-1636974974228.png',
        category_name: 'جوال',
        category_name_ar: 'جوال',
        created_at: '2021-03-31T04:11:56.653Z',
        position: 1,
        status: 'Active',
        updated_at: '2021-03-31T04:11:56.653Z',
        __v: 0,
        _id: '6063f95f929f926b67347b0d'
      },
      createdDate: '2022-01-04T13:44:13.218Z',
      current_bid_price: 83,
      defected_images: [],
      description: '',
      discount: 'NaN',
      expiryDate: '2022-01-18T13:44:13.218Z',
      grade: 'Lightly Used',
      grade_ar: 'استخدام خفيف',
      model_id: {
        brand_id: '60640602929f92968a347b12',
        category_id: '6063f95f929f926b67347b0d',
        created_at: '2021-04-12T12:03:38.607Z',
        current_price: 25,
        model_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/models/iPhene-12%20Pro%20Max-1618249537295.jpeg',
        model_name: 'ايفون 12 برو ماكس',
        model_name_ar: 'ايفون 12 برو ماكس',
        position: 9,
        questions: [],
        status: 'Active',
        updated_at: '2021-04-12T12:03:38.607Z',
        __v: 0,
        _id: '607487411dda2ef02b145bd0'
      },
      product_images: [
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/tablrt-uxui-1641303853062.png',
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/watches-uxui-1641303853070.png',
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/laptop-uxui-1641303853099.png'
      ],
      promocode: {},
      save_as_draft_step: '',
      score: 94.9,
      sell_price: 100,
      sell_status: 'Available',
      user_id: '60da07f53bde511843c59cf4',
      varient: '256 GB',
      varient_id: {
        brand_id: '60640602929f92968a347b12',
        category_id: '6063f95f929f926b67347b0d',
        created_at: '2021-04-12T12:03:37.196Z',
        model_id: '607487411dda2ef02b145bd0',
        status: 'Active',
        updated_at: '2021-04-12T12:03:37.196Z',
        varient: '256 GB',
        varient_ar: '256 GB',
        __v: 0,
        _id: '607487b7f3eafa7d52cd4711'
      },
      _id: '61d44f2dc3ce4c6927423582'
    };

    bidAndItemsService.getMySellProducts().subscribe((solds: SoldProducts) => {
      expect(solds).toBe(soldProducts);
    });

    const req = httpMock.expectOne(
      'https://api.qa.soum.sa/api/v1/user/my-sell-products'
    );
    req.flush(soldProducts);
  });

  fit('check data returned from getBoughtProducts function', () => {
    const boughtProducts: SoldProducts = {
      answer_to_questions: '',
      answer_to_questions_ar: '',
      bid_data: {
        bid_date: '2022-01-05T21:11:52.405Z',
        bid_id: '61d6099829c3b6007db697d0',
        bid_price: '82',
        bid_status: 'open',
        buy_amount: '82',
        checkout_id: '',
        commission: 4.1,
        grand_total: 86.71499999999999,
        order_number: 'SOUM16414171129348',
        pay_bid_amount: '0.00',
        payment_take: 'full',
        payment_type: 'STC_PAY',
        remaining_bid_amount: '86.71',
        shipping_charge: '0',
        transaction_status: 'Success',
        user_id: '60da07f53bde511843c59d5e',
        vat: 0.6149999999999999
      },
      bidding: [
        {
          bid_date: '2022-01-05T21:11:52.405Z',
          bid_id: '61d6099829c3b6007db697d0',
          bid_price: '82',
          bid_status: 'open',
          buy_amount: '82',
          checkout_id: '',
          commission: 4.1,
          grand_total: 86.71499999999999,
          order_number: 'SOUM16414171129348',
          pay_bid_amount: '0.00',
          payment_take: 'full',
          payment_type: 'STC_PAY',
          remaining_bid_amount: '86.71',
          shipping_charge: '0',
          transaction_status: 'Success',
          user_id: '60da07f53bde511843c59d5e',
          vat: 0.6149999999999999
        }
      ],
      bid_price: 83,
      body_cracks: 'no',
      brand_id: {
        brand_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/brands/Apple-1618249395831.png',
        brand_name: 'أبل',
        brand_name_ar: 'أبل',
        category_id: '6063f95f929f926b67347b0d',
        created_at: '2021-03-31T04:11:56.704Z',
        position: 1,
        status: 'Active',
        updated_at: '2021-03-31T04:11:56.704Z',
        __v: 0,
        _id: '60640602929f92968a347b12'
      },
      category_id: {
        category_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/category/Frame-178listing%203-1636974974228.png',
        category_name: 'جوال',
        category_name_ar: 'جوال',
        created_at: '2021-03-31T04:11:56.653Z',
        position: 1,
        status: 'Active',
        updated_at: '2021-03-31T04:11:56.653Z',
        __v: 0,
        _id: '6063f95f929f926b67347b0d'
      },
      createdDate: '2022-01-04T13:44:13.218Z',
      current_bid_price: 83,
      defected_images: [],
      description: '',
      discount: 'NaN',
      expiryDate: '2022-01-18T13:44:13.218Z',
      grade: 'Lightly Used',
      grade_ar: 'استخدام خفيف',
      model_id: {
        brand_id: '60640602929f92968a347b12',
        category_id: '6063f95f929f926b67347b0d',
        created_at: '2021-04-12T12:03:38.607Z',
        current_price: 25,
        model_icon:
          'https://soum01.fra1.digitaloceanspaces.com/soum-dev/models/iPhene-12%20Pro%20Max-1618249537295.jpeg',
        model_name: 'ايفون 12 برو ماكس',
        model_name_ar: 'ايفون 12 برو ماكس',
        position: 9,
        questions: [],
        status: 'Active',
        updated_at: '2021-04-12T12:03:38.607Z',
        __v: 0,
        _id: '607487411dda2ef02b145bd0'
      },
      product_images: [
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/tablrt-uxui-1641303853062.png',
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/watches-uxui-1641303853070.png',
        'https://soum01.fra1.digitaloceanspaces.com/soum-dev/products/laptop-uxui-1641303853099.png'
      ],
      promocode: {},
      save_as_draft_step: '',
      score: 94.9,
      sell_price: 100,
      sell_status: 'Available',
      user_id: '60da07f53bde511843c59cf4',
      varient: '256 GB',
      varient_id: {
        brand_id: '60640602929f92968a347b12',
        category_id: '6063f95f929f926b67347b0d',
        created_at: '2021-04-12T12:03:37.196Z',
        model_id: '607487411dda2ef02b145bd0',
        status: 'Active',
        updated_at: '2021-04-12T12:03:37.196Z',
        varient: '256 GB',
        varient_ar: '256 GB',
        __v: 0,
        _id: '607487b7f3eafa7d52cd4711'
      },
      _id: '61d44f2dc3ce4c6927423582'
    };

    bidAndItemsService
      .getBoughtProducts()
      .subscribe((boughts: SoldProducts) => {
        expect(boughts).toBe(boughtProducts);
      });

    const req = httpMock.expectOne(
      'https://api.qa.soum.sa/api/v1/user/bought-sold'
    );
    req.flush(boughtProducts);
  });
});
