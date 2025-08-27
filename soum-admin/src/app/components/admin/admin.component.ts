import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { endpoint } from 'src/app/constants/endpoint';
import { ApiService } from 'src/app/services/api.service';
import { CommonService } from 'src/app/services/common/common.service';
import { StorageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { SettingService } from 'src/app/services/setting/setting.service';

declare var $: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  menusForAllAdmins = [
    // { route: '/admin/dashboard', icon: 'ri-dashboard-line', name: 'admin.dashboard' },
    {
      route: '/admin/system-settings',
      icon: 'ri-settings-2-line',
      name: 'admin.systemSetting',
    },
    {
      route: '/admin/settings',
      icon: 'ri-settings-2-line',
      name: 'admin.settings',
    },
    {
      route: '/admin/users',
      icon: 'mdi mdi-account-group-outline',
      name: 'admin.users',
    },
    {
      route: '/admin/trade-in',
      icon: 'mdi mdi-account-group-outline',
      name: 'admin.tradein',
    },
    {
      route: '/admin/beta-users',
      icon: 'mdi mdi-account-group-outline',
      name: 'admin.betaUsers',
    },
    {
      route: '/admin/seller-fees',
      icon: 'mdi mdi-account-group-outline',
      name: 'admin.sellerFees',
    },
    {
      route: '/admin/categories',
      icon: 'ri-file-list-line',
      name: 'admin.categories',
    },
    {
      route: '/admin/master-questions',
      icon: 'ri-question-line',
      name: 'admin.masterQuestion',
    },
    {
      route: '/admin/questions',
      icon: 'ri-question-line',
      name: 'admin.Question',
    },
    {
      route: '/admin/products',
      icon: 'ri-file-list-line',
      name: 'admin.product',
    },
    {
      route: '/admin/products/flagged-listings',
      icon: 'ri-file-list-line',
      name: 'admin.frontLiners',
    },
    { route: '/admin/orders', icon: 'ri-list-unordered', name: 'admin.orders' },
    {
      route: '/admin/bids',
      icon: 'ri-money-dollar-circle-line',
      name: 'admin.bids',
    },
    {
      route: '/admin/comments',
      icon: 'ri-message-2-line',
      name: 'admin.comments',
    },
    // { route: '/admin/promo-list', icon: 'ri-gift-fill', name: 'admin.promos' },
    // {
    //   route: '/admin/promos-report',
    //   icon: 'ri-gift-fill',
    //   name: 'admin.promosReport',
    // },
    // {
    //   route: '/admin/referral-log',
    //   icon: 'ri-gift-fill',
    //   name: 'admin.referralLog',
    // },
    {
      route: '/admin/collections',
      icon: 'ri-briefcase-5-line',
      name: 'admin.collections',
    },
    {
      route: '/admin/collections-car',
      icon: 'ri-briefcase-5-line',
      name: 'admin.collectionsCar',
    },
    {
      route: '/admin/attributes',
      icon: 'ri-briefcase-5-line',
      name: 'admin.attributes',
    },
    {
      route: '/admin/banners',
      icon: 'ri-list-unordered',
      name: 'admin.banners',
    },
    {
      route: '/admin/bid-settings',
      icon: 'ri-list-unordered',
      name: 'admin.bid_settings',
    },
    {
      route: '/admin/bid-logs',
      icon: 'ri-list-unordered',
      name: 'admin.bid_logs',
    },
    {
      route: '/admin/commissions',
      icon: 'ri-list-unordered',
      name: 'admin.Commissions',
    },
    {
      route: '/admin/conditions',
      icon: 'ri-list-unordered',
      name: 'admin.Conditions',
    },
    {
      route: '/admin/image-restructions',
      icon: 'ri-image-fill',
      name: 'admin.imageRestructions',
    },
  ];

  menusForBetaAdmin = [
    {
      route: '/admin/products/flagged-listings',
      icon: 'ri-file-list-line',
      name: 'admin.frontLiners',
    },
  ];

  selectedMenu: any;
  sidePanelEnabled: boolean = false;
  arabic: boolean;
  english: boolean;
  userDetails: any;
  changePasswordForm: FormGroup;
  menus: any[] = [];
  regionSettings: any = {};
  constructor(
    private router: Router,
    private commonService: CommonService,
    private translate: TranslateService,
    private storage: StorageService,
    private settingService: SettingService,
    private apiService: ApiService
  ) {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[StorageKeys.loginDetails]) {
      this.userDetails = savedData[StorageKeys.loginDetails];
    }

    this.menus = !this.userDetails?.isBetaAdmin
      ? this.menusForAllAdmins
      : this.menusForBetaAdmin;
    let selectedMenu = this.menus.find((menu) => {
      return menu.route === this.router.url.split('?')[0];
    });
    this.selectedMenu = selectedMenu ? selectedMenu : this.menus[0];
    this.getDefaultLanguage();

    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      newPassword: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
        ])
      ),
      confirmPassword: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });
  }

  ngOnInit(): void {
    this.getSettings();
  }

  getSettings() {
    this.settingService.getRegion().subscribe((res) => {
      if (res.body) {
        this.regionSettings = res.body.responseData;
        localStorage.setItem('region', JSON.stringify(this.regionSettings));
      }
    });
  }

  getDefaultLanguage() {
    let defaultLanguage = this.translate.getDefaultLang();
    switch (defaultLanguage) {
      case 'en':
        this.english = true;
        this.arabic = false;
        document.getElementsByTagName('body')[0].dir = 'ltr';
        break;

      case 'ar':
        this.english = false;
        this.arabic = true;
        document.getElementsByTagName('body')[0].dir = 'rtl';
        break;
    }
  }

  navigateTo(menu: any) {
    this.selectedMenu = menu;
    this.router.navigate([menu.route]);
  }

  enableSidePanel() {
    this.sidePanelEnabled = !this.sidePanelEnabled;
  }

  logout() {
    this.commonService.logout();
  }

  onLanguageChange(lang: 'en' | 'ar') {
    switch (lang) {
      case 'en':
        if (this.english) {
          this.translate.setDefaultLang('en');
          document.getElementsByTagName('body')[0].dir = 'ltr';
          this.storage.set(StorageKeys.defaultLang, 'en');
          this.arabic = false;
          this.english = true;
        } else {
          this.translate.setDefaultLang('ar');
          document.getElementsByTagName('body')[0].dir = 'rtl';
          this.storage.set(StorageKeys.defaultLang, 'ar');
          this.english = false;
          this.arabic = true;
        }
        break;

      case 'ar':
        if (this.arabic) {
          this.translate.setDefaultLang('ar');
          document.getElementsByTagName('body')[0].dir = 'rtl';
          this.storage.set(StorageKeys.defaultLang, 'ar');
          this.english = false;
          this.arabic = true;
        } else {
          this.translate.setDefaultLang('en');
          document.getElementsByTagName('body')[0].dir = 'ltr';
          this.storage.set(StorageKeys.defaultLang, 'en');
          this.arabic = false;
          this.english = true;
        }
        break;
    }
  }

  openChangePasswordModal() {
    $('#change-password').modal('show');
  }

  closeModal(id: string) {
    $(`#${id}`).modal('hide');
  }

  changePassword() {
    let payload = new ChangePassword(this.changePasswordForm.value);
    this.commonService.presentSpinner();
    this.apiService.putApi(endpoint.ChangePassword, payload, 1).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.changePasswordForm.reset();
          this.commonService.successToaster(res.body.message);
          this.closeModal('change-password');
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.changePasswordForm.reset();
        this.closeModal('change-password');
        this.commonService.errorHandler(error);
      }
    );
  }
}

export class ChangePassword {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  constructor(payload: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) {
    if (payload) {
      this.oldPassword = payload.oldPassword;
      this.newPassword = payload.newPassword;
      this.confirmPassword = payload.confirmPassword;
    }
  }
}
