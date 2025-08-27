import { UserStatusDef } from './../../constants/user';
import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private apiService: ApiService
  ) { }

  getUsers(page: number, limit: number, searchValue: string, filterParams:any) {
    return this.apiService.secondEnvgetApi(endpoint.users(page, limit, searchValue, filterParams));
  }

  getBetaUserLists(page: number, limit: number, searchValue: string) {
    return this.apiService.getApi(endpoint.betaUsers(page, limit, searchValue));
  }

  getBidsLists(page: number, limit: number, searchValue: string) {
    return this.apiService.getApi(endpoint.bidsListing(page, limit, searchValue));
  }
  getBidsLogs(page: number, limit: number, searchValue: string) {
    return this.apiService.microServiceGetApi(endpoint.bidsLogs(page, limit, searchValue));
  }
  getBidLogDetails(id: string) {
    return this.apiService.microServiceGetApi(endpoint.bidLogDetails(id));
  }

  getBidsReferances() {
    return this.apiService.microServiceEnvgetApi(endpoint.bidsRefeances());
  }
  getBidSettings() {
    return this.apiService.microServiceEnvgetApi(endpoint.bidSettings());
  }
  postBidSettings(id:string, payload) {
    return this.apiService.microServiceSecondPutApi(endpoint.bidSettingsUpdate(id), payload, 2);
  }

  changeUserStatus(user_id: string, payload: UserStatus) {
    return this.apiService.putSecondApi(endpoint.changeUserStatusV2(user_id), payload, 1);
  }

  deleteUser(user_id: string) {
    return this.apiService.deleteApi(endpoint.deleteUser(user_id));
  }

  updateUser(user_id: string, payload: UpdateUser) {
    return this.apiService.putApi(endpoint.editUser(user_id), payload, 1);
  }

  updateUserV2(user_id: string, payload: UpdateUser) {
    return this.apiService.putSecondApi(endpoint.editUserV2(user_id), payload, 1);
  }

  getUserDetail(user_id: string) {
    return this.apiService.getApi(endpoint.userDetail(user_id));
  }
}

export class UserStatus {
  status: UserStatusDef;

  constructor(status: UserStatusDef) {
    this.status = status;
  }
}

export class UpdateUser {
  name: string;
  isBetaUser?: boolean;
  isKeySeller?: boolean;
  isMerchant?: boolean;
  isUAE?: boolean;
  isCompliant?: boolean;

  constructor(name: string, isBetaUser?: boolean, isKeySeller?: boolean, isMerchant?: boolean, isUAE?: boolean,isCompliant?: boolean) {
    this.name = name;
    this.isBetaUser = isBetaUser || false;
    this.isKeySeller = isKeySeller || false;
    this.isMerchant = isMerchant || false;
    this.isUAE = isUAE || false;
    this.isCompliant = isCompliant || false;
  }
}
