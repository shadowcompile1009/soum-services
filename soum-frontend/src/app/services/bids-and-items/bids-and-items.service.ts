import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class BidsAndItemsService {
  currentRouter = false;

  private routerSub = new BehaviorSubject<any>(this.currentRouter);
  public observableRouter = this.routerSub.asObservable();

  sendRouter(loading) {
    this.routerSub.next(loading);
  }
  constructor(
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService
  ) {}

  getFavoritedProductList() {
    return this.httpWrapper.get(ApiEndpoints.favoritedProductList);
  }

  getMyBiddingProducts() {
    return this.httpWrapper.get(ApiEndpoints.myBidProducts);
  }
  getMySellProducts() {
    return this.httpWrapper.get(ApiEndpoints.mySellProducts);
  }
  getAllProducts(size, page) {
    return this.httpWrapper.getV2(ApiEndpoints.AllProducts(size, page));
  }
  getAllExpiredProducts(size, page) {
    return this.httpWrapper.getV2(ApiEndpoints.AllExpiredProducts(size, page));
  }
  getAllActivebids() {
    return this.httpWrapper.getV2(ApiEndpoints.AllActiveBids());
  }
  getBoughtProducts() {
    return this.httpWrapper.get(ApiEndpoints.boughtProducts);
  }

  getSoldProducts() {
    return this.httpWrapper.get(ApiEndpoints.SoldProducts);
  }

  getBoughtAndSoldProducts() {
    return this.httpWrapper.get(ApiEndpoints.boughtProducts);
  }

  async markOrdersNotified() {
    return this.httpWrapper
      .get(ApiEndpoints.notifyUserWithOrder)
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

  removeBid(payload: RemoveBid) {
    return this.httpWrapper.post(ApiEndpoints.removeBid, payload);
  }

  renewProduct(product_id: string, days: number) {
    return this.httpWrapper
      .put(ApiEndpoints.renewProduct(product_id, days), {})
      .pipe(
        map(async (res) => {
          if (res.code == 200) {
            await this.commonService.presentAlert({
              header: await this.commonService.getTranslatedString(
                'alertPopUpTexts.congratulations'
              ),
              message: await this.commonService.getTranslatedString(
                'alertPopUpTexts.productRenewed'
              ),
              button1: {
                text: await this.commonService.getTranslatedString(
                  'alertPopUpTexts.ok'
                ),
                handler: () => {
                  return res;
                }
              }
            });
          }
          return res;
        })
      )
      .toPromise()
      .catch((error) => {
        this.commonService.errorHandler(error);
      });
  }

  acceptBid(payload: AcceptBid) {
    return this.httpWrapper.post(ApiEndpoints.acceptBid, payload);
  }

  rejectBid(payload: RejectBid) {
    return this.httpWrapper.post(ApiEndpoints.rejectBid, payload);
  }
}

export class RemoveBid {
  product_id: string;
  bid_id;
  constructor(product_id: string, bid_id: string) {
    this.product_id = product_id;
    this.bid_id = bid_id;
  }
}

export class AcceptBid {
  product_id: string;
  bid_id: string;

  constructor(product_id: string, bid_id: string) {
    this.product_id = product_id;
    this.bid_id = bid_id;
  }
}

export class RejectBid {
  productId: string;
  bidId: string;

  constructor(product_id: string, bid_id: string) {
    this.productId = product_id;
    this.bidId = bid_id;
  }
}
