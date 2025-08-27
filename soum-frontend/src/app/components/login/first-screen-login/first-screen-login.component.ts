import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { LocalizeService } from 'src/app/services/core/localization/localize.service';

@Component({
  selector: 'app-first-screen-login',
  templateUrl: './first-screen-login.component.html',
  styleUrls: ['./first-screen-login.component.scss']
})
export class FirstScreenLoginComponent implements OnInit {
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
    private commonService: CommonService,
    public translate: TranslateService,
    private localizeService: LocalizeService
  ) {}

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
  returnToFirst() {
    this.showFirst = true;
    this.showSecond = false;
  }
  hideFirst() {
    this.showFirst = false;
    this.showSecond = true;
  }
  hideSecond() {
    this.showFirst = false;
    this.showSecond = false;
    this.showThird = true;
    this.router.navigate(['/login/continue']);
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
    this.router.navigate(['/products']);
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
}
