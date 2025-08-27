import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PromoCodeService {

  constructor(private apiService: ApiService) { }


  // list promo codes
  getListPromoCode(page: number, limit: number, searchValue: string) {
    return this.apiService.getApi(endpoint.getListPromoCode(page, limit ,searchValue));
  }

  // add new promo code
  addNewPromoCode(promo: any) {
    return this.apiService.postApi(endpoint.addPromoCode, promo, 1);
  }

  // update promoCode
  updatePromoCode(promoID: string, promo:any) {
    return this.apiService.putApi(endpoint.updatePromoCode(promoID), promo, 1);
  }

  // delete promoCode
  deletePromoCode(promoID: string) {
    return this.apiService.deleteApi(endpoint.deletePromoCode(promoID));
  }

  // active / inactive promo code
  activeInactivePromoCode(promoId: any) {
    return this.apiService.putApi(endpoint.activeInactivePromoCode(promoId),{}, 1);
  }

}
