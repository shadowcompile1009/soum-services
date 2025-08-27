import { Injectable } from '@angular/core';
import { ApiEndpoints } from '../core/http-wrapper/api-endpoints.constant';
import { HttpWrapperService } from '../core/http-wrapper/http-wrapper.service';

@Injectable({
  providedIn: 'root'
})
export class PriceNudgingService {
  constructor(private httpWrapper: HttpWrapperService) {}

  getConditionPriceNudging(varientID: any) {
    return this.httpWrapper.get(
      ApiEndpoints.getConditionPriceNudging(varientID)
    );
  }
}
