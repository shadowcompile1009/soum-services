import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  constructor(
    private apiService: ApiService
  ) { }

  getAttributeList() {
    return this.apiService.secondEnvgetApi(endpoint.getAttributesList());
  }

  getNewAttributeList(size: number, page: number, optionsIncluded: boolean) {
    return this.apiService.microServiceGetApi(endpoint.getNewAttributesList(size, page, optionsIncluded));
  }

  addNewAttributeOption(data) {
    return this.apiService.microServicePostApi(endpoint.addNewAttributeOption(), data, 2);
  }

  addNewAttribute(data) {
    return this.apiService.microServicePostApi(endpoint.AddNewAttribut(), data, 2);
  }

  updateNewAttributeOption(data, optionId) {
    return this.apiService.microServicePutApi(endpoint.updateNewAttributeOption(optionId), data, 2);
  }

  updateNewAttribute(data, atributeId) {
    return this.apiService.microServicePutApi(endpoint.updateNewAttribute(atributeId), data, 2);
  }

  getAttributeOtionsList(attributeID, size, page, search='') {
    return this.apiService.microServiceGetApi(endpoint.getAttributeOptionsList(attributeID, size, page, search));
  }

  deleteAttributeOption(optionId: string) {
    return this.apiService.microServiceDeleteApi(endpoint.deleteAttributeOption(optionId));
  }

  deleteNewAttribute(attributeId: string) {
    return this.apiService.microServiceDeleteApi(endpoint.deleteNewAttribute(attributeId));
  }

  getAttributeById(id) {
    return this.apiService.secondEnvgetApi(endpoint.getAttributeById(id));
  }

  addAttribute(payload) {
    return this.apiService.secondEnvpostApi(endpoint.getAttributesList(), payload, 2);
  }

  editAttribute(payload) {
    return this.apiService.putSecondApi(endpoint.editAttributesList(payload.id), payload, 2);
  }

  deleteAttribute(id) {
    return this.apiService.deleteSecondApi(endpoint.deleteAttribute(id));
  }

}

export class AttributesStatus {
  status: "Active" | "Inactive";

  constructor(status: "Active" | "Inactive") {
    this.status = status;
  }
}
