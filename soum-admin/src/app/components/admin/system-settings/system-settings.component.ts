import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common/common.service';
import {
  DashboardService,
  SystemSetting,
} from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-system-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss'],
})
export class SystemSettingsComponent implements OnInit {
  vatEdit: boolean;
  buyCommissionEdit: boolean;
  sellerCommissionEdit: boolean;
  shippingChargesEdit: boolean;
  referralFixedAmountEdit: boolean;
  referralPercentageEdit: boolean;
  systemSetting: any = {};
  backupSystemSeting: any;
  systemSettingArray: any = {};
  backupSystemSetingArray: any;
  bidding_amountEdit: boolean;
  bidding_percentEdit: boolean;
  referralDiscountType: any;
  referralCreditAmountEdit: boolean;
  invalideSettings: any = {};
  constructor(
    private dashboardService: DashboardService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getSystemSetting();
  }

  editAppSettings(
    type:
      | 'buyerCommission'
      | 'sellerCommission'
      | 'VAT'
      | 'shippingCharges'
      | 'bidding_amount'
      | 'bidding_percentage'
      | 'referralFixedAmount'
      | 'referralCreditAmount'
      | 'referralPercentage',
    value: boolean,
    update: boolean
  ) {
    switch (type) {
      case 'bidding_percentage':
        this.bidding_percentEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;
      case 'buyerCommission':
        this.buyCommissionEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;

      case 'sellerCommission':
        this.sellerCommissionEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;

      case 'VAT':
        this.vatEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;

      case 'bidding_amount':
        this.bidding_amountEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;

      case 'shippingCharges':
        this.shippingChargesEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;
      case 'referralFixedAmount':
        this.referralFixedAmountEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;

      case 'referralPercentage':
        this.referralPercentageEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;
      case 'referralCreditAmount':
        this.referralCreditAmountEdit = value;
        if (update) {
          this.updateSystemSetting();
        } else {
          this.systemSetting = { ...this.backupSystemSeting };
        }
        break;
    }
  }

  getSystemSetting() {
    this.dashboardService.getSystemSetting().subscribe(
      (res) => {
        this.systemSetting = { ...res.body.settingData };
        this.backupSystemSeting = { ...res.body.settingData };
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    );

    this.dashboardService.getSystemSettingArray().subscribe(
      (res) => {
        this.systemSettingArray = { ...res.body.settingData };
        this.backupSystemSetingArray = { ...res.body.settingData };
      },
      (error) => {
        this.commonService.errorToast(error.error.message);
      }
    );
  }

  updateSystemSetting() {
    if (!this.checkSettings()) {
      let payload = new SystemSetting(this.systemSetting);
      this.dashboardService
        .updateSystemSettings(this.systemSetting._id, payload)
        .subscribe(
          (res) => {
            if (res) {
              this.getSystemSetting();
            }
          },
          (error) => {
            this.systemSetting = { ...this.backupSystemSeting };
            this.commonService.errorHandler(error);
          }
        );
    }
  }
  checkSettings() {
    if (
      this.systemSetting.referral_fixed_amount > 999 ||
      this.systemSetting.referral_fixed_amount <= 0
    )
      this.invalideSettings.referral_fixed_amount = true;
    else this.invalideSettings.referral_fixed_amount = false;

    if (
      this.systemSetting.referral_percentage > 99 ||
      this.systemSetting.referral_percentage <= 0
    )
      this.invalideSettings.referral_percentage = true;
    else this.invalideSettings.referral_percentage = false;

    Object.keys(this.invalideSettings).forEach((key) => {
      if (this.invalideSettings[key] == true) return true;
    });
    return false;
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if (charCode == 46 && !event.target.value.includes('.')) {
        return true;
      }
      return false;
    } else {
      return true;
    }
  }

  numberOnlyForPer(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      if (charCode == 46 && !event.target.value.includes('.')) {
        return true;
      }
      return false;
    }
    if (parseInt(event.key) > 100) {
      return false;
    }
    if (
      parseInt(
        (document.getElementById('input-h') as HTMLInputElement).value +
          event.key
      ) > 100
    ) {
      return false;
    } else {
      return true;
    }
  }

  ChangeReferralDiscountType(discountType) {
    this.systemSetting.referral_discount_type = discountType;
    this.updateSystemSetting();
  }
}
