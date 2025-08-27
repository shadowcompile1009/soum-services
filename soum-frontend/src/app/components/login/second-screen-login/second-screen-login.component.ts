import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalizeService } from 'src/app/services/core/localization/localize.service';
import { Location } from '@angular/common';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-second-screen-login',
  templateUrl: './second-screen-login.component.html',
  styleUrls: ['./second-screen-login.component.scss']
})
export class SecondScreenLoginComponent implements OnInit {
  showSecond = false;
  showFirst = true;
  showThird = false;
  showForth = false;
  selectedCategory: any;
  products: any = [];
  userDetail: any;
  filterApplied: boolean;
  sortingApplied: boolean;
  arabic: boolean;
  apiHit: boolean;
  carouselOptions = {
    rtl: false,
    loop: false,
    autoplay: false,
    center: false,
    dots: true,
    items: 4,
    margin: 10,
    stagePadding: 15,
    width: 70
  };

  constructor(
    private router: Router,
    private _location: Location,
    public translate: TranslateService,
    private commonService: CommonService,
    private profileService: ProfileService,
    private localizeService: LocalizeService
  ) {
    let state = this.router.getCurrentNavigation().extras.state;
    if (state && !state.loggedUser) {
      this.commonService.isLoggedIn = false;
    }
  }

  ngOnInit(): void {
    this.getDefaultLanguage();

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Login'
    };
    window['dataLayer'].push(productGTM);
    clearTimeout(this.commonService.referralTimer);
  }
  hideFirst() {
    this.showFirst = false;
    this.showSecond = true;
  }
  hideSecond() {
    this.showFirst = false;
    this.showSecond = false;
    this.showThird = true;
  }
  hideThird() {
    this.showFirst = false;
    this.showSecond = false;
    this.showThird = false;
    this.showForth = true;
    this.router.navigate(['/signup/enter-mobile']);
  }
  showMainPAge() {
    this.commonService.isLoggedIn = true;
    sessionStorage.removeItem('redirectURL');
    this.router.navigate(['/products']);
    this.commonService.ReferralPopupAppearance();
  }
  getDefaultLanguage() {
    let defaultLanguage = this.translate.getDefaultLang();
    switch (defaultLanguage) {
      case 'en':
        this.arabic = false;
        this.carouselOptions.rtl = false;
        break;

      case 'ar':
        this.arabic = true;
        this.carouselOptions.rtl = true;
        break;
    }
  }
  changeLanguage() {
    this.arabic = !this.arabic;
    let defaultLanguage = 'en';
    if (this.arabic) {
      defaultLanguage = 'ar';
    } else {
      defaultLanguage = 'en';
    }
    this.localizeService.changeLanguage(defaultLanguage);
  }

  goBack() {
    this._location.back();
  }
}
