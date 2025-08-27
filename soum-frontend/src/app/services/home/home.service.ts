import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { map } from 'rxjs/internal/operators/map';
import { Filter } from 'src/app/components/filter/filter.component';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  empty: boolean = false;
  constructor(
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService,
    private router: Router
  ) {}

  getProducts(categoryID: string, payload?: Filter) {
    firebase.analytics().logEvent('category_view', { category_id: categoryID });
    return this.httpWrapper.post(
      ApiEndpoints.products(categoryID),
      payload || {}
    );
  }

  getProductsV2(category_id: string, payload?: Filter) {
    firebase.analytics().logEvent('category_view', { category_id });
    return this.httpWrapper.getV2(
      ApiEndpoints.productsV2(category_id, payload || {})
    );
  }

  getExploreProductsV2(payload) {
    firebase.analytics().logEvent('Explore_Products', { payload });
    return this.httpWrapper.getV2(
      ApiEndpoints.exploreProducts(payload || {})
    );
  }

  getProductsByModel(
    model_id: string,
    sum?: number,
    page?: number,
    payload?: Filter
  ) {
    return this.httpWrapper.getV2(
      ApiEndpoints.productListByModel(model_id, sum, page, payload || {})
    );
  }

  getProductsByCategory(category_id: string, limit, page, payload?: Filter) {
    return this.httpWrapper.post(
      ApiEndpoints.productListByCategory(category_id, limit, page),
      payload || {}
    );
  }

  getProductDetail(productId: string) {
    return this.httpWrapper.getV2(ApiEndpoints.productDetail(productId));
  }

  async getImage(imageURL: string) {
    return this.httpWrapper
      .getImage(imageURL)
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  async getSpecificProduct(productId: string) {
    return this.httpWrapper
      .getV2(ApiEndpoints.specificProduct(productId))
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.router.navigate(['/products']);
      });
  }

  async getCategory(categoryId: string) {
    return this.httpWrapper
      .getV2(ApiEndpoints.specificCategory(categoryId))
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.router.navigate(['/products']);
      });
  }

  async getBrand(brandId: string) {
    return this.httpWrapper
      .getV2(ApiEndpoints.specificBrand(brandId))
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.router.navigate(['/products']);
      });
  }

  async getModel(modelId: string) {
    return this.httpWrapper
      .getV2(ApiEndpoints.specificModel(modelId))
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.router.navigate(['/products']);
      });
  }

  async getVariant(variantId: string) {
    return this.httpWrapper
      .getV2(ApiEndpoints.specificVariant(variantId))
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.router.navigate(['/products']);
      });
  }

  getProductCalculationPrice(
    bidId: any = '',
    productId: any = '',
    promoId: any = '',
    actionType: any = '',
    bidValue: any = ''
  ) {
    return this.httpWrapper.get(
      ApiEndpoints.getProductCalculationPrice(
        bidId,
        productId,
        promoId,
        actionType,
        bidValue
      )
    );
  }

  async favorite(
    loggedInUser,
    product,
    product_id: string,
    type: 'favorite' | 'unfavorite'
  ) {
    if (
      loggedInUser != product.seller_id &&
      new Date(product.expiryDate) < new Date()
    ) {
      this.commonService.presentAlert({
        header: await this.commonService.getTranslatedString(
          'alertPopUpTexts.oops'
        ),
        message: await this.commonService.getTranslatedString(
          'alertPopUpTexts.ExpiredProduct'
        ),
        button1: {
          text: await this.commonService.getTranslatedString(
            'alertPopUpTexts.ok'
          ),
          handler: () => {
            this.empty = true;
          }
        }
      });
    } else {
      let endpoint =
        type == 'favorite'
          ? ApiEndpoints.favoriteProduct
          : ApiEndpoints.unfavoriteProduct;
      return this.httpWrapper
        .post(endpoint, new Favorite(product_id))
        .pipe(
          map((res) => {
            return res;
          })
        )
        .toPromise()
        .catch((error) => {
          this.commonService.errorHandler(error);
        });
    }
  }

  async putBid(payload: PutBid) {
    return this.httpWrapper
      .post(ApiEndpoints.bid, payload)
      .pipe(
        map((res) => {
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        var en = error.error.message.includes('ddress');
        var ar = error.error.message.includes('عنوان');
        this.commonService.errorHandler(error, true);
        if (en || ar) {
          this.router.navigate(['/profile/add-address']);
        }
        //
      });
  }

  askQuestion(payload: AskQuestion) {
    return this.httpWrapper.post(ApiEndpoints.askQuestion, payload);
  }

  postAnswer(payload: PostAnswer) {
    return this.httpWrapper.post(ApiEndpoints.postAnswer, payload);
  }

  deleteProduct(product_id: string) {
    return this.httpWrapper.delete(ApiEndpoints.deleteProduct(product_id));
  }

  validateBidPrice(payload) {
    return this.httpWrapper.post(ApiEndpoints.validateBidPrice, payload);
  }

  getCurrentUserCity(payload) {
    return this.httpWrapper.getV2(
      ApiEndpoints.UserCity(payload || {})
    );
  }
}

export class Favorite {
  product_id: string;

  constructor(product_id: string) {
    this.product_id = product_id;
  }
}

export class PutBid {
  product_id: string;
  bid_price: string;
  payment_type?: string = '';
  vat: string;
  commission: string;
  grand_total: string;
  shipping_charge: string;
  bidding_amount: string;

  constructor(payload: {
    product_id: string;
    bid_price: string;
    vat: string;
    commission: string;
    grand_total: string;
    shipping_charge: string;
    bidding_amount: string;
  }) {
    this.product_id = payload.product_id;
    this.bid_price = payload.bid_price;
    this.vat = payload.vat;
    this.commission = payload.commission;
    this.grand_total = payload.grand_total;
    this.shipping_charge = payload.shipping_charge;
    this.bidding_amount = payload.bidding_amount;
  }
}

export class AskQuestion {
  product_id: string;
  question: string;

  constructor(payload: { product_id: string; question: string }) {
    this.product_id = payload.product_id;
    this.question = payload.question;
  }
}

export class PostAnswer {
  product_id: string;
  question_id: string;
  answer: string;

  constructor(payload: {
    product_id: string;
    question_id: string;
    answer: string;
  }) {
    this.product_id = payload.product_id;
    this.question_id = payload.question_id;
    this.answer = payload.answer;
  }
}

export class FilterRequest {
  brand: Array<string>;
  model: Array<string>;
  size: Array<string>;
  price: { from: string; to: string };
  grade: string = 'execellent';
  sort: string;

  constructor(payload?: {
    brand: Array<string>;
    model: Array<string>;
    size: Array<string>;
    price: { from: string; to: string };
    grade: string;
    sort: string;
  }) {
    if (payload) {
      // make logic here
    }
  }
}
