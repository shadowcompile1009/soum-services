import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { endpoint } from 'src/app/constants/endpoint';

@Injectable({
  providedIn: 'root'
})
export class AddonsService {

  constructor(private apiService: ApiService) { }

  getAddonsList(model_id: string) {
    return this.apiService.microServiceGetApi(endpoint.getAddonsByModel(model_id));
  }

  deleteAddonById(addon_id: string) {
    return this.apiService.microServiceDeleteApi(endpoint.deleteAddonById(addon_id));
  }

  addNewAddons(payload: any) {
    return this.apiService.microServicePostApi(endpoint.addNewAddons(), payload, true);
  }

  updateAddons(payload: any, addonId: string) {
    return this.apiService.microServicePutApi(endpoint.updateAddons(addonId), payload, 1);
  }

}
