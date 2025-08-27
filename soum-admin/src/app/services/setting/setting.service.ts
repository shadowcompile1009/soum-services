import { HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoint } from '../../../app/constants/endpoint';
import { ApiService } from '../api.service';

export interface SettingType {
  _id?: any;
  name: string;
  description?: string;
  type?: string;
  setting_category: string;
  value: any;
  possible_values: any[];
  status?: string;
  created_date?: Date;
  updated_date?: Date;
  deleted_date?: Date;
}

export interface SettingResponse {
  message: string,
  responseData: SettingType | SettingType[],
  status: string,
  timeStamp: string,
  violations: any[],
}
@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(
    private apiService: ApiService
  ) { }

  getAllSettings(): Observable<HttpResponse<SettingResponse>> {
    return this.apiService.getApiWithTypeResponse<SettingResponse>(endpoint.getSettings);
  }
  getRegion(): Observable<HttpResponse<SettingResponse>> {
    return this.apiService.getApiWithTypeResponse<SettingResponse>(endpoint.getRegion);
  }
  getSetting(settingId: string): Observable<HttpResponse<SettingResponse>> {
    return this.apiService.getApiWithTypeResponse<SettingResponse>(endpoint.getSetting(settingId));
  }

  filterSettings(categories: string, status?: string): Observable<HttpResponse<SettingResponse>> {
    return this.apiService.postApiWithTypeResponse<SettingResponse>(endpoint.filterSettings , { categories, status } , 1);
  }

  addSetting(setting: SettingType) {
    return this.apiService.postApiWithTypeResponse<SettingResponse>(endpoint.getSettings, setting, 1);
  }

  updateSetting(setting: SettingType) {
    return this.apiService.putSecondApiTypeResponse<SettingResponse>(endpoint.getSetting(setting._id), setting, 1);
  }

  deleteSetting(settingId: string) {
    return this.apiService.deleteSecondApiTypeResponse<SettingResponse>(endpoint.getSetting(settingId), 1);
  }
}
