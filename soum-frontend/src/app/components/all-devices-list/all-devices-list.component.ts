import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { environment } from 'src/environments/environment';
import { Filter, FilterByModel } from '../filter/filter.component';
import firebase from 'firebase';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { Product } from 'src/app/shared-components/product-model/product-model.interface';

@Component({
  selector: 'app-all-devices-list',
  templateUrl: './all-devices-list.component.html',
  styleUrls: ['./all-devices-list.component.scss']
})
export class AllDevicesListComponent implements OnInit, OnDestroy {
  categoryName;
  showBidsPopUp: boolean;
  showBuyPopup: boolean;
  productList: Product[] = [];
  product: any;
  userMobileNumber: string;
  loggedUserId: string;
  model: any;
  amountConfigForBuy: BuyModalPrice;
  modelName: any;
  userDetail: any;
  addresses: any;
  selectedAddress: string;
  brand: any;
  filterApplied: boolean;
  sortingApplied: boolean;
  cards: any[];
  queryParams: any;
  apiHit: boolean;
  category: any;
  profileData: any;
  sortModelProductBy: any;
  listArray: string[] = [];
  limitPerPage = 10;
  page = 1;
  direction = '';
  subscriptions: Subscription[] = [];
  empty: boolean = false;
  appSetting;
  sharingServ: SharingDataService;
  bidService: BidsAndItemsService;
  modalService: ModalService;
  profileService: ProfileService;
  commonService: CommonService;
  homeService: HomeService;
  translate: TranslateService;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storage: StorageService,
    private injector: Injector
  ) {
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);
    this.bidService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.translate = this.injector.get<TranslateService>(TranslateService);

    this.appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    firebase.analytics().logEvent('product_list_view');
    const savedData = this.storage.getSavedData();
    this.sortModelProductBy = savedData?.filterByModel?.filterData?.sort
      ? savedData?.filterByModel?.filterData?.sort
      : 'low';

    let loggedUserDetails: any = null;
    this.sharingServ.userData.subscribe((data: any) => {
      loggedUserDetails = data ? data : null;
      this.userMobileNumber = data ? data?.mobileNumber : null;
    });
    this.loggedUserId = loggedUserDetails ? loggedUserDetails.userId : '';

    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params && params.category) {
          this.queryParams = params;

          this.category = params.category;
          this.getProductsByCategory();
        } else {
          this.router.navigate(['/products']);
        }
      })
    );

    if (this.commonService.isLoggedIn) {
      const saved_Data = this.storage.getSavedData();
      this.userDetail = saved_Data[storageKeys.userDetails] || {};
    } else {
      this.userDetail = null;
    }
  }
  onScrollDown(ev: any) {
    if (ev.currentScrollPosition > 640) {
      this.page += 1;
      this.getProductsByCategory();
    }
    this.direction = 'scroll down';
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.profileService.observableprofile.subscribe((sett) => {
        this.profileData = sett;
      })
    );
    this.bidService.sendRouter(false);
    if (this.commonService.isLoggedIn) {
      this.openModalForProductToBuy();
      this.openModalForProductToBid();
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Devices'
    };
    window['dataLayer'].push(productGTM);
  }

  // *********************** BID AND BUY *******************************
  openModalForProductToBuy() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBuy]) {
      let product = { ...savedData[storageKeys.productToBuy] };
      this.storage.removeItem(storageKeys.productToBuy);
      this.openBuyModal(product);
    }
  }

  async openBuyModal(product: any) {
    firebase.analytics().logEvent('buy_now');
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotBuy');
        return;
      }
    } else {
      this.storage.set(storageKeys.productToBuy, product);
      this.commonService.loginRequested = {
        commands: [this.router.url.split('?')[0]],
        extras: { queryParams: this.queryParams }
      };
      this.router.navigate(['/login/continue']);
      return;
    }
    this.modalService.proceedToBuy({
      product: product,
      // "addresses": this.profileService.addresses,
      address: this.profileData.address ? this.profileData.address : null,
      amountConfigForBuy: this.commonService.calculatePriceForBuyModal(
        product,
        'calculate'
      )
      // "selectedAddress": selectedAddress
    });
  }

  openModalForProductToBid() {
    const savedData = this.storage.getSavedData();

    if (savedData && savedData[storageKeys.productToBid]) {
      this.openBidModal(savedData[storageKeys.productToBid]);
    }
  }

  openBidModal(product: any) {
    firebase.analytics().logEvent('bid_now');
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotBid');
        return;
      }
    } else {
      this.storage.set(storageKeys.productToBid, product);
      this.commonService.loginRequested = {
        commands: [this.router.url.split('?')[0]],
        extras: { queryParams: this.queryParams }
      };
      this.router.navigate(['/login/continue']);
      return;
    }

    let selectedCard = '';
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBid]) {
      selectedCard = this.profileService.cards.length
        ? this.profileService.cards[this.profileService.cards.length - 1].cardId
        : '';
      this.storage.removeItem(storageKeys.productToBid);
    }
    this.modalService.proceedToBid({
      cardList: this.profileService.cards || [],
      product: product,
      selectedCard: selectedCard
    });
  }
  // *********************** END: BID AND BUY *******************************

  getProductsByCategory() {
    this.commonService.presentSpinner();
    const savedData = this.storage.getSavedData();
    let payload: Filter = {};
    if (
      savedData &&
      savedData[storageKeys.filterByModel] &&
      savedData[storageKeys.filterByModel].category === this.category
    ) {
      let filterPayload = new FilterByModel(
        savedData[storageKeys.filterByModel]
      ).filterData;
      payload = filterPayload;
      this.filterApplied =
        filterPayload.grade.length ||
        (filterPayload.price &&
          (filterPayload.price.from > 0 ||
            filterPayload.price.to < environment.filterMaxRange))
          ? true
          : false;
      if (this.filterApplied && this.brand) {
        payload.brand.push(this.brand);
      }
      this.sortingApplied = false;
    } else {
      this.filterApplied = false;
      this.sortingApplied = false;
    }
    payload.sort = this.sortModelProductBy;

    this.homeService
      .getProductsByCategory(
        this.category,
        this.limitPerPage,
        this.page,
        payload
      )
      .subscribe(
        (res) => {
          this.commonService.dismissSpinner();

          if (res.productList.length !== 0) {
            this.productList = [...this.productList, ...res.productList];
            let defaultLanguage = this.translate.getDefaultLang();

            // TODO refactor v1
            if (this.productList[0].category.category_name == 'Mobile') {
              if (defaultLanguage == 'en') {
                this.categoryName = 'Mobile Phones';
              }
              if (defaultLanguage == 'ar') {
                this.categoryName = 'الجوالات';
              }
            }
            if (this.productList[0].category.category_name == 'Tablets') {
              if (defaultLanguage == 'en') {
                this.categoryName = 'Tablets';
              }
              if (defaultLanguage == 'ar') {
                this.categoryName = 'الأجهزة اللوحية';
              }
            }
            if (this.productList[0].category.category_name == 'Laptop') {
              if (defaultLanguage == 'en') {
                this.categoryName = 'Laptops';
              }
              if (defaultLanguage == 'ar') {
                this.categoryName = 'اللابتوبات';
              }
            }
            if (
              this.productList[0].category.category_name == 'Gaming Console'
            ) {
              if (defaultLanguage == 'en') {
                this.categoryName = 'Gaming';
              }
              if (defaultLanguage == 'ar') {
                this.categoryName = 'العاب الفيديو';
              }
            }
            if (this.productList[0].category.category_name == 'Smart Watch') {
              if (defaultLanguage == 'en') {
                this.categoryName = 'Watches';
              }
              if (defaultLanguage == 'ar') {
                this.categoryName = 'الساعات الذكية';
              }
            }
            if (this.productList[0].category.category_name == 'Mac Desktop') {
              if (defaultLanguage == 'en') {
                this.categoryName = 'Desktops';
              }
              if (defaultLanguage == 'ar') {
                this.categoryName = 'الكمبيوترات المكتبية';
              }
            }
          }

          this.apiHit = true;
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }
  async navigateTo(route: string, product: any) {
    if (
      this.userDetail &&
      this.userDetail.userId != product.seller_id &&
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
      let options: NavigationExtras = {};
      if (route === '/product-detail' && product) {
        options.queryParams = {
          product: product._id
        };
      }
      if (route === '/order' && product) {
        options.queryParams = {
          order: product._id
        };
      }
      this.router.navigate([route], options);
    }
  }

  navigateToFilter() {
    this.router.navigate(['/filter'], {
      queryParams: { modelCategory: this.category }
    });
  }

  favorite(product: any) {
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotWishlist');
        return;
      }
    } else {
      this.router.navigate(['/login/continue']);
      return;
    }
    this.homeService
      .favorite(
        this.userDetail.userId,
        product,
        product._id,
        product.favourited ? 'unfavorite' : 'favorite'
      )
      .then((res) => {
        if (!product.favourited) {
          firebase
            .analytics()
            .logEvent('user_clicks_like', { product_id: product._id });
        }
        if (res) {
          this.apiHit = false;
          this.getProductsByCategory();
        }
      });
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
