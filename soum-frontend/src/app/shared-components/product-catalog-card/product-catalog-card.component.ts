import { storageKeys } from './../../services/core/storage/storage-keys';
import { HomeService } from './../../services/home/home.service';
import { StorageService } from './../../services/core/storage/storage.service';
import {
  BuyModalPrice,
  CommonService
} from './../../services/common/common.service';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';

@Component({
  selector: 'app-product-catalog-card',
  templateUrl: './product-catalog-card.component.html',
  styleUrls: ['./product-catalog-card.component.scss']
})
export class ProductCatalogCard implements OnInit {
  @Input() product;
  @Input() userDetail;
  @Input() userMobileNumber;
  @Input() withDiscount: boolean = false;
  @Output() getProductsByModel = new EventEmitter<any>();
  apiHit: boolean = false;
  empty: boolean = false;
  appSetting;
  variants =[];
  constructor(
    public translate: TranslateService,
    private commonService: CommonService,
    private router: Router,
    private storage: StorageService,
    private homeService: HomeService,
    private bidsAndItemsService: BidsAndItemsService,
  ) {}

  ngOnInit(): void {
    this.variants = this.product.attributes;
    this.appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
  }
  checkDefaultLangForVariants(text) {
    let defaultLanguage = this.translate.getDefaultLang();

    if (defaultLanguage == 'ar') {
      return text.arName;

    }
    else {
      return text.enName;
    }
  }
  async navigateTo(route: string, product: any) {
    if (route == '/order' && !this.userDetail) {
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
      return;
    }

    if (
      this.userDetail &&
      this.userDetail.userId != product.sellerId &&
      new Date(product.expiryDate) < new Date()
    ) {
      this.commonService.presentAlert({
        header: await this.commonService.getTranslatedString(
          'alertPopUpTexts.oops'
        ),
        message: await this.commonService.getTranslatedString(
          'alertPopUpTexts.ExpiredProduct'
        ),
        button1: {
          text: await this.commonService.getTranslatedString(
            'alertPopUpTexts.ok'
          ),
          handler: () => {
            this.empty = true;
          }
        }
      });
    } else {
      this.handleScrollingWhenClick();
      let options: NavigationExtras = {};
      if (route === '/product-detail' && product) {
        options.queryParams = { product: product.productId };
        this.bidsAndItemsService.sendRouter(true);
      }
      if (route === '/order' && product) {
        options.queryParams = { order: product.productId };
      }
      this.router.navigate([route], options);
    }
  }

  handleScrollingWhenClick() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollY == 0) {
      this.storage.removeItem(storageKeys.devicesScrollPos);
    } else {
      this.storage.set(storageKeys.devicesScrollPos, scrollY);
    }
  }

  favorite(product: any) {
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotWishlist');
        return;
      }
    } else {
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
      return;
    }
    this.homeService
      .favorite(
        this.userDetail.userId,
        product,
        product.productId,
        product.liked ? 'unfavorite' : 'favorite'
      )
      .then((res) => {
        if (!product.liked) {
          firebase
            .analytics()
            .logEvent('user_clicks_like', { product_id: product.productId });
        }
        if (res) {
          this.apiHit = false;
          this.getProductsByModel.emit(true);
        }
      });
  }

  checkGrade(grade: string) {
    if (grade) {
      if (grade.includes('Like New')) {
        return 'excellent';
      }
      if (grade.toLowerCase().includes('lightly used')) {
        return 'great';
      }
      if (grade.includes('Fair')) {
        return 'good';
      }
      if (grade.includes('Extensive Use')) {
        return 'extensive';
      }
    }
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  getProductDiscountPercent() {
    return parseInt(this.product?.discount);
  }
}
