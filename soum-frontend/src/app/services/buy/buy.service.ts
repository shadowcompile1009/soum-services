import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';
import { Router } from '@angular/router';
import firebase from 'firebase';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root'
})
export class BuyService {
  constructor(
    private router: Router,
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService,
    private cookieService: CookieService
  ) {}
  buyModelPayload;

  buyProduct(payload: BuyPayload) {
    this.buyModelPayload = payload;
    localStorage.setItem('buyPrice', payload.grand_total);
    return this.httpWrapper.post(ApiEndpoints.buyProductnew, payload);
  }

  buyProductWhenBidAccepted(payload: BuyPayloadWhenBidAccepted) {
    return this.httpWrapper.post(ApiEndpoints.buyProductnew, payload);
  }

  saveTransaction(payload: TransactionSavePayload) {
    var buyPrice = localStorage.getItem('buyPrice');
    return this.httpWrapper
      .post(ApiEndpoints.transactionSave, payload)
      .pipe(
        map((res) => {
          firebase.analytics().logEvent('success_buy_transaction', {
            buy_price: buyPrice,
            product_id: payload.product_id,
            order_id: payload.order_id
          });

          const orderIdLayerCookie = this.cookieService.get('orderIdLayer');

          if (orderIdLayerCookie !== payload.order_id) {
            this.addGTM(payload);
          }

          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        // comment this line to prevent popup from appear
        // this.commonService.errorHandler(error, true);
      });
  }

  addGTM(payload) {
    this.getOrderDetails(payload.order_id).subscribe(
      (data) => {
        if (data) {
          window['dataLayer'] = window['dataLayer'] || [];
          const dataGMT = {
            event: 'purchase',
            ecommerce: {
              currency: 'SAR', // currency code
              value: data.OrderData.grand_total || 0, // revenue (transaction value)
              affiliation: 'soum.sa',
              transaction_id: data.OrderData.transaction_id || '', // transaction id
              coupon: data.OrderData.product.promoCode || '', // promocode if needed
              items: [
                {
                  item_name: data.OrderData.product.model_id.model_name || '',
                  item_id: data.OrderData.product._id || '',
                  price: data.OrderData.product.sell_price || 0,
                  item_brand: data.OrderData.product.brand_id.brand_name || '',
                  item_category:
                    data.OrderData.product.category_id.category_name || '',
                  quantity: '1'
                }
              ]
            }
          };
          this.cookieService.set('orderIdLayer', payload.order_id);
          window['dataLayer'].push(dataGMT);
        }
      },
      (error) => this.commonService.errorHandler(error)
    );
  }

  cancelTransaction(payload: TransactionCancelPayload) {
    return this.httpWrapper.post(ApiEndpoints.cancelTransaction, payload);
  }

  getShippingDetails(order_id: string) {
    return this.httpWrapper.get(ApiEndpoints.shippingDetail(order_id));
  }

  getOrderDetails(order_id: string) {
    return this.httpWrapper.get(ApiEndpoints.orderDetail(order_id));
  }

  getOrderDetailsV2(order_id: string, userType: string) {
    return this.httpWrapper.getV2(
      ApiEndpoints.orderDetails(order_id, userType)
    );
  }

  cancelOrder(payload: CancelOrder) {
    return this.httpWrapper.post(ApiEndpoints.cancelOrder, payload);
  }

  bidTransactionSave(product_id: string, bid_id: string, checkout_id: string) {
    return this.httpWrapper
      .post(ApiEndpoints.bidTransactionDone, {
        product_id: product_id,
        bid_id: bid_id,
        checkout_id: checkout_id
      })
      .pipe(
        map((res) => {
          const bidOrderIdLayerCookie =
            this.cookieService.get('bidOrderIdLayer');
          if (bidOrderIdLayerCookie !== bid_id) {
            window['dataLayer'] = window['dataLayer'] || [];
            const vidValue = localStorage.getItem('bidValue');
            const bidLayerData = {
              event: 'bid_completed',
              bid_id: bid_id,
              bid_value: vidValue
            };
            window['dataLayer'].push(bidLayerData);
            this.cookieService.set('bidOrderIdLayer', bid_id);
            localStorage.removeItem('bidValue');
          }

          firebase.analytics().logEvent('success_bid_transaction', {
            product_id: product_id,
            bid_id: bid_id
          });
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.bidTransactionCancel(product_id, bid_id);
        this.commonService.errorHandler(error, true);
        this.router.navigate(['/products']);
      });
  }

  bidTransactionCancel(product_id: string, bid_id: string) {
    return this.httpWrapper
      .post(ApiEndpoints.bidTransactionCancel, {
        product_id: product_id,
        bid_id: bid_id
      })
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

  confirmDelivery(order_id: string) {
    return this.httpWrapper.post(ApiEndpoints.confirmDelivery, {
      order_id: order_id
    });
  }

  trackOrder(shipmentIndentificationNumber: string, order_id: string) {
    return this.httpWrapper.post(ApiEndpoints.trackOrder, {
      shipment_identification_number: shipmentIndentificationNumber,
      order_id: order_id
    });
  }
}

export class BuyPayload {
  product_id: string;
  address_id: string;
  buy_amount: string;
  vat: string;
  commission: string;
  grand_total: string;
  shipping_charge: string;
  buyerDiscount?: number;
  buyerPromocodeId?: string;
  payment_type?: string = '';

  constructor(payload: {
    product_id: string;
    address_id: string;
    buy_amount: string;
    vat: string;
    commission: string;
    grand_total: string;
    shipping_charge: string;
    buyerDiscount?: number;
    buyerPromocodeId?: string;
  }) {
    if (payload) {
      this.product_id = payload.product_id;
      this.address_id = payload.address_id;
      this.buy_amount = payload.buy_amount;
      this.vat = payload.vat;
      this.commission = payload.commission;
      this.grand_total = payload.grand_total;
      this.shipping_charge = payload.shipping_charge;
      this.buyerDiscount = payload.buyerDiscount;
      this.buyerPromocodeId = payload.buyerPromocodeId;
    }
  }
}

export class BuyPayloadWhenBidAccepted {
  product_id: string;
  bid_id: string;
  address_id: string;
  payment_type?: string = '';
  buyerDiscount?: number;
  buyerPromocodeId?: string;

  constructor(payload: {
    product_id: string;
    bid_id: string;
    address_id: string;
    payment_type?: string;
    buyerDiscount?: number;
    buyerPromocodeId?: string;
  }) {
    if (payload) {
      this.product_id = payload.product_id;
      this.address_id = payload.address_id;
      this.bid_id = payload.bid_id;
      this.buyerDiscount = payload.buyerDiscount;
      this.buyerPromocodeId = payload.buyerPromocodeId;
    }
  }
}

export class BuyPayloadnew {
  address_id?: string;
  productId: string;
  paymentType?: string = '';
  actionType: string = '';
  buyerPromocodeId?: string = '';

  constructor(payload: {
    address_id?: string;
    productId: string;
    paymentType?: string;
    actionType: string;
    buyerPromocodeId?: string;
  }) {
    if (payload) {
      this.address_id = payload.address_id;
      this.productId = payload.productId;
      this.paymentType = payload.paymentType;
      this.actionType = payload.actionType;
      this.buyerPromocodeId = payload.buyerPromocodeId;
    }
  }
}

export class BuyPayloadWhenBidAcceptednew {
  address_id?: string;
  productId: string;
  paymentType?: string = '';
  actionType: string = '';
  buyerPromocodeId?: string = '';
  bidId?: string = '';

  constructor(payload: {
    address_id?: string;
    productId: string;
    paymentType?: string;
    actionType: string;
    buyerPromocodeId?: string;
    bidId?: string;
  }) {
    if (payload) {
      this.address_id = payload.address_id;
      this.productId = payload.productId;
      this.paymentType = payload.paymentType;
      this.actionType = payload.actionType;
      this.buyerPromocodeId = payload.buyerPromocodeId;
      this.bidId = payload.bidId;
    }
  }
}
export class TransactionSavePayload {
  product_id: string;
  checkout_id: string;
  order_id: string;
  transaction_detail: string = '';

  constructor(payload: {
    product_id: string;
    checkout_id: string;
    order_id: string;
    transaction_detail: string;
  }) {
    if (payload) {
      this.checkout_id = payload.checkout_id;
      this.product_id = payload.product_id;
      this.order_id = payload.order_id;
      this.transaction_detail = payload.transaction_detail;
    }
  }
}

export class TransactionCancelPayload {
  product_id: string;
  order_id: string;

  constructor(payload: { product_id: string; order_id: string }) {
    if (payload) {
      this.product_id = payload.product_id;
      this.order_id = payload.order_id;
    }
  }
}

export class CancelOrder {
  order_id: string;
  return_reason: string;

  constructor(order_id: string, return_reason: string) {
    this.order_id = order_id;
    this.return_reason = return_reason;
  }
}
