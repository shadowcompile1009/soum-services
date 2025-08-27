import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CommissionsService {

  constructor(
    private apiService: ApiService
  ) { }

  changeOrderForCollection(payload: any) {
    return this.apiService.secondEnvpostApi(endpoint.changeCollectionOrder, payload, 1);
  }
  getSellerArrayTypes() {
    return this.apiService.commissionEnvget(endpoint.getSellerArrayTypes());
  }
  getCollectionsTypes() {
    return this.apiService.commissionEnvget(endpoint.getCommissionsTypes());
  }

  getCommissions(tab , queryParams) {
    return this.apiService.commissionEnvget(endpoint.getCommissions(tab, queryParams));
  }
  handleDeleteoption(id){
    return this.apiService.deleteApicomm(endpoint.deleteComissionbyID(id));

  }
  getCommissionList() {
    return this.apiService.commissionEnvget(endpoint.getCommissionList());
  }

  addCommission(payload) {
    return this.apiService.commEnvpostApi(endpoint.postCommission(), payload, 2);
  }
  saveCommission(payload) {
    return this.apiService.putSecondApiTypeResponseComm(endpoint.saveCommission(payload.id), payload, 2);
  }

  editCollection(payload) {
    return this.apiService.putSecondApiTypeResponse(endpoint.editCollectionsList(), payload, 2);
  }

  handleCollectionStatus(payload) {
    return this.apiService.putSecondApiTypeResponse(endpoint.changeCollectionStatus(), payload, 2);
  }

  validateProduct(payload) {
    return this.apiService.secondEnvpostApi(endpoint.productValidation(), payload, 2);
  }

}

export class CollectionStatus {
  status: "Active" | "Inactive";

  constructor(status: "Active" | "Inactive") {
    this.status = status;
  }
}
