import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralReportService {
  constructor(private apiService: ApiService) {}

  getReferralReports(page: number, limit: number, searchValue: string) {
    return this.apiService.getApi(endpoint.referralReportsListing(page, limit, searchValue));
  }
}
