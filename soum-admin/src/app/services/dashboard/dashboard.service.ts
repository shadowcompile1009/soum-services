import { Injectable } from '@angular/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private apiService: ApiService) {}

  getSystemSetting() {
    return this.apiService.getApi(endpoint.systemSettings);
  }
  getBanners(page, lang, position) {
    return this.apiService.secondEnvgetApi(
      endpoint.bannersArray(page, lang, position)
    );
  }
  addBanner(obj) {
    return this.apiService.secondEnvpostApi(endpoint.addBanner, obj, 2);
  }
  editBanner(id: string, obj) {
    return this.apiService.putSecondApi(endpoint.editBanner(id), obj, 2);
  }
  updateBannerPosition(obj) {
    return this.apiService.putSecondApi(endpoint.editBannerPosition(), obj, 2);
  }
  getSystemSettingArray() {
    return this.apiService.secondEnvgetApi(endpoint.getSettings);
  }

  updateSystemSettings(id: string, payload: SystemSetting) {
    return this.apiService.putApi(endpoint.editSystemSettings(id), payload, 1);
  }

  getAllAdmins(current_page: number, limit: number) {
    return this.apiService.getApi(endpoint.adminList(current_page, limit));
  }

  deleteAdmin(admin_id: string) {
    return this.apiService.deleteApi(endpoint.deleteAdmin(admin_id));
  }

  deleteBanner(id: string) {
    return this.apiService.deleteSecondApi(endpoint.deleteBanner(id));
  }
  addAdmin(payload: FormData) {
    return this.apiService.postApi(endpoint.addAdmin, payload, 2);
  }

  editAdmin(admin_id: string, payload: FormData) {
    return this.apiService.putApi(endpoint.editAdmin(admin_id), payload, 2);
  }
}

export class SystemSetting {
  skip_defect_photos: boolean;
  product_approval: boolean;
  theme_color: string;
  buyer_commission_percentage: number;
  seller_commission_percentage: number;
  shipping_charge_percentage: number;
  vat_percentage: number;
  bidding_amount: number;
  start_bid_percentage: number;
  referral_fixed_amount: number;
  referral_discount_type: string;
  referral_percentage: number;
  referral_credit_type: string;
  referral_credit_amount: number;
  constructor(payload: {
    skip_defect_photos: boolean;
    product_approval: boolean;
    theme_color: string;
    buyer_commission_percentage: number;
    seller_commission_percentage: number;
    shipping_charge_percentage: number;
    vat_percentage: number;
    start_bid_percentage: number;
    bidding_amount: number;
    referral_fixed_amount: number;
    referral_discount_type: string;
    referral_percentage: number;
    referral_credit_type: string;
    referral_credit_amount: number;
  }) {
    if (payload) {
      this.skip_defect_photos = payload.skip_defect_photos;
      this.product_approval = payload.product_approval;
      this.theme_color = payload.theme_color;
      this.buyer_commission_percentage = Number(
        payload.buyer_commission_percentage
      );
      this.seller_commission_percentage = Number(
        payload.seller_commission_percentage
      );
      this.shipping_charge_percentage = Number(
        payload.shipping_charge_percentage
      );
      this.vat_percentage = Number(payload.vat_percentage);
      this.bidding_amount = Number(payload.bidding_amount);
      this.start_bid_percentage = Number(payload.start_bid_percentage);
      this.referral_discount_type = payload.referral_discount_type;
      this.referral_fixed_amount = Number(payload.referral_fixed_amount);
      this.referral_percentage = Number(payload.referral_percentage);
      this.referral_credit_type = payload.referral_credit_type;
      this.referral_credit_amount = Number(payload.referral_credit_amount);
    }
  }
}

export class AddAdmin {
  name: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';
  profilePic: any = '';
}

export class EditAdmin {
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  profilePic: string = '';
}
