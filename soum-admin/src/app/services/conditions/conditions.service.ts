import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConditionsService {

  constructor(private apiService: ApiService, private http: HttpClient) { }


  getConditionsByVariantId(variantId: string) {
    return this.apiService.commissionEnvget(endpoint.getConditionsByVariantId(variantId));
  }

  addNewCondition(varientid: string) {
    return this.apiService.secondEnvpostApi(endpoint.addNewCondition, {variantID: varientid}, 1);
  }

  updateConditionsByID(varientid: string, data: any) {
    return this.apiService.putApicomm(endpoint.updateConditionsByID(varientid), data, 1);
  }

  requestUrlToUploadImage(count: number, extension: string, imageModule: string) {
    return this.apiService.microServiceGetApi(endpoint.requestCategoryUrlToUploadImage(count, extension, imageModule));
  }

  uploadImageToServer(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'content-type': 'multipart/form-data'
    });
    return this.http.put<any>(url, data, { headers });
  }

  getAllConditions(catID , page, limit){
    return this.apiService.commissionEnvget(endpoint.getConditions(catID, page, limit));
  }
  postCondition(body){
    return this.apiService.commEnvpostApi(endpoint.addNewConditionV2, body, 1);
  }

  deleteConditionById(conditionId:string) {
    return this.apiService.deleteApicomm(endpoint.deleteConditionById(conditionId))
  }

  updateConditionById(conditionId:string, data: any) {
    return this.apiService.putApicomm(endpoint.updateConditionById(conditionId), data, 1)
  }
}
