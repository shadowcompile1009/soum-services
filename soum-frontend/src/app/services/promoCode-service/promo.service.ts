import { Injectable } from '@angular/core';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class PromoService {
  constructor(private httpWrapper: HttpWrapperService) {}

  validatePromCode(code: string, userType: string, productId: string) {
    return this.httpWrapper.get(
      ApiEndpoints.validatePromoCode(code, userType, productId)
    );
  }
}
