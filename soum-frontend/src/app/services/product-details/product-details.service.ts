import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import { CommonService } from '../common/common.service';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class ProductDetailsService {
  currentRouter = true;

  private routerSub = new BehaviorSubject<any>(this.currentRouter);
  public observableRouter = this.routerSub.asObservable();

  sendRouter(loading) {
    this.routerSub.next(loading);
  }
  constructor(
    private httpWrapper: HttpWrapperService,
    private commonService: CommonService
  ) {}

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
}
