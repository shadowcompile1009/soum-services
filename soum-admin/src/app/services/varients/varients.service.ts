import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class VarientV2Service {

  constructor(
    private apiService: ApiService
  ) { }

  getVarientList(modelId) {
    return this.apiService.secondEnvgetApi(endpoint.getVarientList(modelId));
  }

  getVarientById(id) {
    return this.apiService.secondEnvgetApi(endpoint.getVarientById(id));
  }

  addVarient(payload) {
    return this.apiService.secondEnvpostApi(endpoint.getVarientList(payload.modelId), payload, 2);
  }

  editVarient(payload) {
    return this.apiService.putSecondApi(endpoint.editVarientList(payload.id), payload, 2);
  }

  deleteVarient(id) {
    return this.apiService.deleteSecondApi(endpoint.deleteVarientById(id));
  }

}

export class VarientsStatus {
  status: "Active" | "Inactive";

  constructor(status: "Active" | "Inactive") {
    this.status = status;
  }
}
