import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ReferralLogsService {
  constructor( private apiService: ApiService) { }
  
  getReferralLogs(currentPage: number, limit: any, searchValue: string) {
    return this.apiService.getApi(endpoint.referralLogs(currentPage, limit, searchValue));
  }

}
