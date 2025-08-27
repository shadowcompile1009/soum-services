import { DatePipe, Location } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import {
  AcceptBid,
  BidsAndItemsService,
  RejectBid,
  RemoveBid
} from 'src/app/services/bids-and-items/bids-and-items.service';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { SellerService } from 'src/app/services/seller/seller.service';

declare var $: any;

let numOfRenewDays = 1;

/**
 * @title Dialog elements
 */
@Component({
  selector: 'renew-modal.component',
  templateUrl: './renew-modal.component.html'
})
export class RenewModalParentComponent {
  productToRenew: any;
  days: number = 1;

  constructor(
    @Inject(MatDialog) public data: any,
    public dialog: MatDialog,
    public translate: TranslateService,
    private commonService: CommonService
  ) {}

  renewProductListing() {
    this.dialog.closeAll();
    this.productToRenew = this.data.productID;
    this.commonService.renewProduct();
  }

  changingValue(val) {
    numOfRenewDays = val;
  }
}

@Component({
  selector: 'app-bids-and-items',
  templateUrl: './bids-and-items.component.html',
  styleUrls: ['./bids-and-items.component.scss']
})
export class BidsAndItemsComponent implements OnInit {
  showPage = false;
  bid_id;
  sum = 10;
  expiredSum = 10;
  bidsSum = 10;
  paginationExpiredTotal = 0;
  paginationBidsTotal = 0;
  paginationAllTotal = 0;
  page = 1;
  myActiveBidsList = [];
  myExpiredItemsList = [];
  myAllProducts = [];
  bidsAndWish?: string = 'bought-sold';
  currentTab: string = 'bought-sold';
  currentTab2: string = 'allProducts';
  bidSellTab: string = 'bid';
  wishlist: any;
  biddingProducts: any;
  showEmpty = false;
  sellProducts: any = [];
  userDetail: any;
  BoughtAndSoldProducts: any;
  showBids: boolean;
  bids: any[];
  bidProductId: string;
  queryParams: any;
  productToDelete: string;
  productToRenew: any;
  days: number = 1;
  bidToRemove: any;
  bidId: any;
  productId: any;
  profileData: any;
  selectedSellProduct: any = null;
  showModal = false;
  empty: boolean = false;
  sellerService: SellerService;
  translate: TranslateService;
  modalService: ModalService;
  profileService: ProfileService;
  storage: StorageService;
  homeService: HomeService;
  bidsAndItemService: BidsAndItemsService;
  commonService: CommonService;
  notificationState: any = null;
  language: string = 'ar';
  is_BiddingDisabled: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private datePipe: DatePipe,
    private events: EventsService,
    public dialog: MatDialog,
    private injector: Injector
  ) {
    const defaultLang = JSON.parse(localStorage.getItem('defaultLang'));
    this.language = JSON.parse(defaultLang);
    this.sellerService = this.injector.get<SellerService>(SellerService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.bidsAndItemService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.commonService = this.injector.get<CommonService>(CommonService);

    const tokenData = localStorage.getItem('userDetails')
      ? localStorage.getItem('userDetails')
      : null;
    if (!tokenData) {
      this.commonService.isLoggedIn = false;
      this.router.navigate(['/login/continue']);
      return;
    }

    this.notificationState = this.router.getCurrentNavigation().extras.state || null;

    if (!this.commonService.isLoggedIn) {
      this._location.back();
    }

    if (this.commonService.isLoggedIn) {
      const savedData = this.storage.getSavedData();
      this.userDetail = savedData[storageKeys.userDetails];
    } else {
      this.userDetail = null;
    }

    this.getCurrentTabAndSubTab();

    this.events.subscribe(EventsKey.removeItem, () => {
      this.delete(this.productToDelete);
    });

    this.events.subscribe(EventsKey.renewItem, () => {
      this.renew(this.productToRenew);
    });
    this.events.subscribe(EventsKey.removeBid, () => {
      this.removeBid(this.bidToRemove);
    });
    this.events.subscribe(EventsKey.rejectBid, () => {
      this.applyAcrionOnBid(this.productId, this.bidId, 'reject');
    });

    this.events.subscribe(EventsKey.acceptBid, () => {
      this.applyAcrionOnBid(this.productId, this.bidId, 'accept');
    });

    if (this.sellerService.selectedProductTab) {
      this.sellerService.selectedProductTab = false;
    }
    const appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    this.is_BiddingDisabled = appSetting?.is_bidding_enabled || false;
  }

  ngOnInit(): void {
    this.commonService.presentSpinner();
    this.profileService.observableprofile.subscribe((sett) => {
      this.profileData = sett;
    });
    this.bidsAndItemService.sendRouter(true);
    this.checkLoginBeforeFetch();

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Bids-and-items'
    };
    window['dataLayer'].push(productGTM);
    this.commonService.dismissSpinner();
  }

  getCurrentTabAndSubTab() {
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      if (queryParams) {
        this.queryParams = queryParams;
        if (queryParams.tab) {
          this.currentTab = queryParams.tab;
        }
        if (queryParams.subTab) {
          this.bidSellTab = queryParams.subTab;
        }
        this.selectTab(this.currentTab);
        this.selectTabSecond('allProducts');
      }
    });
  }

  refreshList() {
    this.getWishlist();
    this.getMyBiddingProducts();
    this.getAllExpiredProducts();
    this.getAllProducts();
    this.getMyActiveBids();
  }
  onScrollDown(ev: any, tab) {
    this.commonService.presentSpinner();
    if (ev.currentScrollPosition > 1600) {
      this.page = 1;
      if (tab == 'expired') {
        this.expiredSum = this.expiredSum + 10;
        if (this.expiredSum - 10 < this.paginationExpiredTotal) {
          this.getAllExpiredProducts();
        }
      } else if (tab == 'bids') {
        this.bidsSum = this.bidsSum + 10;
        if (this.bidsSum - 10 < this.paginationBidsTotal) {
          this.getMyActiveBids();
        }
      } else {
        this.sum = this.sum + 10;
        if (this.sum - 10 < this.paginationAllTotal) {
          this.getAllProducts();
        }
      }
    }
    this.commonService.dismissSpinner();
  }

  openSuccesbidModal() {
    this.modalService.proceedToBidSuccess({
      value: true
    });
  }
  checkLoginBeforeFetch() {
    if (this.commonService.isLoggedIn) {
      this.refreshList();
      this.openModalForProductToBuy();
      this.openModalForProductToBid();
    } else {
      this.commonService.loginRequested = {
        commands: ['/bids-and-items']
      };
    }
  }

  selectTab(type) {
    this.currentTab = type;
    if (type == 'bid-sell') {
      firebase.analytics().logEvent('view_bids');
      this.bidSellTab = 'bid';
    } else {
      this.bidSellTab = '';
    }
    let navExtras: NavigationExtras = {
      queryParams: { tab: type }
    };
    if (this.bidSellTab) {
      navExtras.queryParams.subTab = this.bidSellTab;
    }
    this.router.navigate([], navExtras);
  }
  selectTabSecond(type: "allProducts" | "activeBids" | "productExpired") {
    if(this.notificationState && this.notificationState.fromNotification) {
      this.currentTab2 = "activeBids";
      this.notificationState = null;
      return;
    }
    this.currentTab2 = type;
  }
  selectedBidSellTab(type: 'bid' | 'sell') {
    this.bidSellTab = type;

    this.router.navigate([], {
      queryParams: { tab: this.currentTab, subTab: this.bidSellTab }
    });
  }

  async navigateTo(route: string, product: any) {
    localStorage.setItem('selectedBrand', JSON.stringify(product.brand_id));
    localStorage.setItem('selectedDevice', JSON.stringify(product.category_id));
    localStorage.setItem('selectedModel', JSON.stringify(product.model_id));
    localStorage.setItem('selectedVarient', JSON.stringify(product.varient_id));
    localStorage.setItem('productIDForDraft', JSON.stringify(product._id));
    let sellerID;
    if (product.user_id) {
      sellerID = product.user_id;
    } else {
      sellerID = product.seller_id;
    }

    if (
      this.userDetail &&
      this.userDetail.userId != sellerID &&
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
      if (route == '/track-order' && product) {
        if (product.dispute == 'Yes') {
          return;
        }

        options.queryParams = {
          order: product._id
        };

        options.state = {
          product: product
        };
      }
      if (route == '/selected-photos/product' && product) {
        options.queryParams = {
          product: product._id
        };
      }
      if (route == '/question-answer' && product) {
        options.queryParams = {
          product: product._id
        };
      }
      if (route == '/product-price' && product) {
        options.queryParams = {
          product: product._id
        };
      }
      if (route == '/pick-up-address' && product) {
        route = '/product-price';
        options.queryParams = {
          product: product._id
        };
      }
      this.router.navigate([route], options);
    }
  }

  openModalForProductToBuy() {
    firebase.analytics().logEvent('buy_now');
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBuy]) {
      let product = { ...savedData[storageKeys.productToBuy] };
      this.storage.removeItem(storageKeys.productToBuy);
      if (product.bidAccepted) {
        this.openBuyModalWhenBidAccepted(product);
      } else {
        this.openBuyModal(product);
      }
    }
  }

  openBuyModal(product: any) {
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
      address: this.profileData.address ? this.profileData.address : null,
      amountConfigForBuy: this.commonService.calculatePriceForBuyModal(
        product,
        'calculate'
      )
    });
  }

  openBuyModalWhenBidAccepted(product: any) {
    let bidAcceptedProduct = { ...product };
    if (this.userDetail) {
      if (this.userDetail.userId == bidAcceptedProduct.user_id) {
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

    const amountConfigForBuyDetials =
      this.commonService.calculatePriceForBuyModalWhenBidAccepted(
        bidAcceptedProduct,
        'calculate'
      );

    this.modalService.proceedToBuy({
      product: bidAcceptedProduct,
      address: this.profileData.address ? this.profileData.address : null,
      amountConfigForBuy: amountConfigForBuyDetials,
      bidAccepted: true,
      bid_id: bidAcceptedProduct.bid_id
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

  getWishlist() {
    this.commonService.presentSpinner();
    this.bidsAndItemService.getFavoritedProductList().subscribe(
      (res) => {
        if (res) {
          this.wishlist = res.productList;
          this.commonService.dismissSpinner();
        } else {
          this.wishlist = [];
          this.commonService.dismissSpinner();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  navigateToDisclamer() {
    this.router.navigate(['/disclaimer']);
  }
  favorite(product: any) {
    this.commonService.presentSpinner();
    this.homeService
      .favorite(
        this.userDetail.userId,
        product,
        product._id,
        product.favourited ? 'unfavorite' : 'favorite'
      )
      .then((res) => {
        this.commonService.dismissSpinner();
        if (!product.favourited) {
          firebase
            .analytics()
            .logEvent('user_clicks_like', { product_id: product._id });
        }
        if (res) {
          this.getWishlist();
        }
      });
  }

  getMyBiddingProducts() {
    this.commonService.presentSpinner();
    this.bidsAndItemService.getMyBiddingProducts().subscribe(
      (res) => {
        if (res) {
          this.biddingProducts = res.productList;
          this.biddingProducts.sort((a, b) => {
            if (a.bidding[0].bid_date > b.bidding[0].bid_date) return -1;
            if (a.bidding[0].bid_date < b.bidding[0].bid_date) return 1;
            if (a.bidding[0].bid_date == b.bidding[0].bid_date) return 0;
          });

          this.biddingProducts.forEach((product) => {
            product.bid_price = product.current_bid_price;
            if (product.current_bid_price == Number(product.my_bid)) {
              product.class = 'lightly-products';
            } else if (
              product.current_bid_price > Number(product.my_bid) ||
              product.bid_status == 'rejected'
            ) {
              product.class = 'heavily-products';
            } else if (product.bid_status == 'accepted') {
              product.class = 'excellent-products';
            }
          });
          this.commonService.dismissSpinner();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  getMySellProducts() {
    this.commonService.presentSpinner();
    let day2 = 2 * 24 * 60 * 60 * 1000;
    this.bidsAndItemService.getMySellProducts().subscribe(
      (res) => {
        if (res) {
          this.sellProducts = res.productList;
          if (res.productList.length == 0) {
            this.showEmpty = true;
          }
          this.sellProducts.forEach((sellProduct) => {
            let uploadDate = new Date(sellProduct.createdDate);
            let dateOfExpiry = new Date(sellProduct.expiryDate);
            let aboutToExpireStartDate = new Date(
              new Date(sellProduct.expiryDate).getTime() - day2
            );
            sellProduct.uploadDate = uploadDate;
            sellProduct.dateOfExpiry = dateOfExpiry;
            sellProduct.aboutToExpireStartDate = aboutToExpireStartDate;
            sellProduct.currentDate = new Date();
            if (new Date().getTime() >= sellProduct.dateOfExpiry.getTime()) {
              sellProduct.expired = true;
              sellProduct.aboutToExpire = false;
            } else {
              sellProduct.expired = false;
              if (new Date() >= sellProduct.aboutToExpireStartDate) {
                sellProduct.aboutToExpire = true;
              } else {
                sellProduct.aboutToExpire = false;
              }
            }
          });
          this.commonService.dismissSpinner();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
  getMyActiveBids() {
    this.commonService.presentSpinner();
    let day2 = 2 * 24 * 60 * 60 * 1000;
    this.bidsAndItemService.getAllActivebids().subscribe(
      (res) => {
        if (res) {
          this.myActiveBidsList = res.responseData;
          if (res.responseData.length == 0) {
            // this.showEmpty = true;
          }
          this.myActiveBidsList.forEach((sellProduct) => {
            let uploadDate = new Date(sellProduct.createdDate);
            let dateOfExpiry = new Date(sellProduct.expiryDate);
            let aboutToExpireStartDate = new Date(
              new Date(sellProduct.expiryDate).getTime() - day2
            );
            sellProduct.uploadDate = uploadDate;
            sellProduct.dateOfExpiry = dateOfExpiry;
            sellProduct.aboutToExpireStartDate = aboutToExpireStartDate;
            sellProduct.currentDate = new Date();
            if (new Date().getTime() >= sellProduct.dateOfExpiry.getTime()) {
              sellProduct.expired = true;
              sellProduct.aboutToExpire = false;
            } else {
              sellProduct.expired = false;
              if (new Date() >= sellProduct.aboutToExpireStartDate) {
                sellProduct.aboutToExpire = true;
              } else {
                sellProduct.aboutToExpire = false;
              }
            }
          });
          this.commonService.dismissSpinner();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  getAllExpiredProducts() {
    let day2 = 2 * 24 * 60 * 60 * 1000;
    this.myExpiredItemsList = [];
    this.commonService.presentSpinner();
    this.bidsAndItemService
      .getAllExpiredProducts(this.expiredSum, this.page)
      .subscribe(
        (res) => {
          if (res) {
            if (res.responseData.length != 0) {
              this.myExpiredItemsList = res.responseData.productList;
              this.paginationExpiredTotal = res.responseData.pagination.total;
              this.myExpiredItemsList.forEach((sellProduct) => {
                let uploadDate = new Date(sellProduct.createdDate);
                let dateOfExpiry = new Date(sellProduct.expiryDate);
                let aboutToExpireStartDate = new Date(
                  new Date(sellProduct.expiryDate).getTime() - day2
                );
                sellProduct.uploadDate = uploadDate;
                sellProduct.dateOfExpiry = dateOfExpiry;
                sellProduct.aboutToExpireStartDate = aboutToExpireStartDate;
                sellProduct.currentDate = new Date();
                if (
                  new Date().getTime() >= sellProduct.dateOfExpiry.getTime()
                ) {
                  sellProduct.expired = true;
                  sellProduct.aboutToExpire = false;
                } else {
                  sellProduct.expired = false;
                  if (new Date() >= sellProduct.aboutToExpireStartDate) {
                    sellProduct.aboutToExpire = true;
                  } else {
                    sellProduct.aboutToExpire = false;
                  }
                }
              });
            }
            if (res.responseData.length == 0) {
              this.showEmpty = true;
            }

            this.commonService.dismissSpinner();
          }
        },
        (error) => {
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(error);
        }
      );
  }
  getAllProducts() {
    this.commonService.presentSpinner();
    let day2 = 2 * 24 * 60 * 60 * 1000;
    this.bidsAndItemService.getAllProducts(this.sum, this.page).subscribe(
      (res) => {
        if (res) {
          this.showPage = true;
          if (res.responseData && res.responseData.length != 0) {
            this.sellProducts = res.responseData.productList;
            this.paginationAllTotal = res.responseData.pagination.total;
            this.sellProducts.forEach((sellProduct) => {
              let uploadDate = new Date(sellProduct.createdDate);
              let dateOfExpiry = new Date(sellProduct.expiryDate);
              let aboutToExpireStartDate = new Date(
                new Date(sellProduct.expiryDate).getTime() - day2
              );
              sellProduct.uploadDate = uploadDate;
              sellProduct.dateOfExpiry = dateOfExpiry;
              sellProduct.aboutToExpireStartDate = aboutToExpireStartDate;
              sellProduct.currentDate = new Date();
              if (new Date().getTime() >= sellProduct.dateOfExpiry.getTime()) {
                sellProduct.expired = true;
                sellProduct.aboutToExpire = false;
              } else {
                sellProduct.expired = false;
                if (new Date() >= sellProduct.aboutToExpireStartDate) {
                  sellProduct.aboutToExpire = true;
                } else {
                  sellProduct.aboutToExpire = false;
                }
              }
            });
          }
          if (res.responseData && res.responseData.productList.length == 0) {
            this.showEmpty = true;
          }

          this.commonService.dismissSpinner();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }
  goToWish() {
    this.router.navigate(['/products']);
  }
  goToBid() {
    this.router.navigate(['/products']);
  }
  goToProduct() {
    this.router.navigate(['/select-devices']);
  }

  getBoughtProducts() {
    this.bidsAndItemService.getBoughtProducts().subscribe(
      (res) => {
        if (res) {
          this.BoughtAndSoldProducts = res.productList;
        } else {
          this.BoughtAndSoldProducts = [];
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  removeBidPopup(product: any) {
    this.bidToRemove = product.product_id;
    this.bid_id = product.bid_id;

    this.commonService.removeBid();
  }

  removeBid(product_id: string) {
    this.bidsAndItemService
      .removeBid(new RemoveBid(product_id, this.bid_id))
      .subscribe(
        (res) => {
          if (res) {
            this.getMyBiddingProducts();
            this.getMyActiveBids();
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  showPopUpForYourProduct(
    action: 'cannotBuy' | 'cannotBid' | 'cannotWishlist'
  ) {
    this.commonService.showPopUpForYourProduct(action);
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  deleteProduct(product_id: string) {
    if (product_id !== null || typeof product_id !== 'undefined') {
      this.productToDelete = product_id;
      this.commonService.removeProductModal();
    }
  }

  deleteDraftProduct(product_id: string) {
    if (product_id !== null || typeof product_id !== 'undefined') {
      this.productToDelete = product_id;
      this.showModal = true;
      this.modalService.openDeleteListingModal({
        value: true
      });
    }
  }

  openDialog(product_id: any, expired: boolean) {
    if (expired) {
      this.productToRenew = product_id;
      this.dialog.open(RenewModalParentComponent, {
        data: {
          productID: this.productToRenew
        }
      });
    }
  }

  delete(product_id) {
    this.commonService.presentSpinner();
    if (product_id) {
      this.homeService.deleteProduct(product_id).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.productToDelete = '';
          if (res) {
            this.getMyBiddingProducts();
            this.getAllExpiredProducts();
            this.getAllProducts();
            this.getMyActiveBids();
            firebase
              .analytics()
              .logEvent('user_removes_sell', { product_id: product_id });
          }
        },
        (error) => {
          this.commonService.errorHandler(error, true);
        }
      );
    }
  }

  showAllBid(bids: Array<any>, product: any) {
    let product_id = product._id;
    this.showBids = !this.showBids;
    if (product_id) {
      this.bidProductId = product_id;
    } else {
      this.bidProductId = '';
    }
    this.bids = bids;
    this.bids.forEach((bid) => {
      if (bid) {
        let bidEndDate = new Date(
          new Date(bid.bid_date).getTime() + 5 * 24 * 60 * 60 * 1000
        );
        bid.bidEndDate = this.datePipe.transform(bidEndDate, 'dd/MM/yyyy');
        bid.isExpired = bidEndDate < new Date() ? true : false;
        bid.bid_price = JSON.parse(bid.bid_price);
        bid.commission = JSON.parse(bid.commission);
        bid.vat = JSON.parse(bid.vat);
        bid.shipping_charge = JSON.parse(bid.shipping_charge);

        if (product.promocode) {
          if (
            product.promocode.percentage &&
            product.promocode.percentage > 0
          ) {
            let couponValue = Number(
              ((bid.bid_price * product.promocode.percentage) / 100).toFixed(2)
            );
            bid.promoCode =
              couponValue <= product.promocode.discount
                ? couponValue
                : product.promocode.discount;
          } else {
            bid.promoCode = product.promocode.discount;
          }

          bid.commissionWithPromo =
            bid.promoCode >= bid.commission
              ? 0
              : bid.commission - bid.promoCode;
          bid.vatWithPromo = Number(
            Number(bid.commissionWithPromo * 0.15).toFixed(2)
          );
        }
      }
    });
  }

  renew(product_id: string) {
    if (typeof product_id !== undefined) {
      this.commonService.presentSpinner();
      this.bidsAndItemService
        .renewProduct(product_id, numOfRenewDays)
        .then((res) => {
          numOfRenewDays = 1;
          this.commonService.dismissSpinner();
          if (res) {
            this.refreshList();
          }
        });
    }
  }

  getBidsBlockedAmount(amount) {
    return Number((amount * 0.25).toFixed(2));
  }

  acceptBid(product_id: string, bid_id: string) {
    this.commonService.presentSpinner();
    let payload = new AcceptBid(product_id, bid_id);
    this.bidsAndItemService.acceptBid(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.showAllBid([], '');
          this.getMyBiddingProducts();
          this.getMySellProducts();
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  sellerChangeBidStatus(product_id: string, sellProduct: any, status: string) {
    if (sellProduct.expired) {
      this.commonService.presentModalForExpireProducts();
      return;
    }
    this.productId = product_id;
    this.bidId = sellProduct?.bidding[0].bid_id;
    this.selectedSellProduct = sellProduct;
    this.selectedSellProduct.status = status;
  }

  acceptedBidFunction() {
    if (this.selectedSellProduct.status == 'reject') {
      this.applyAcrionOnBid(this.productId, this.bidId, 'reject');
      this.commonService.rejectBid();
    } else if (this.selectedSellProduct.status == 'accept') {
      this.applyAcrionOnBid(this.productId, this.bidId, 'accept');
      this.commonService.acceptBid();
    }
  }

  // remove bid from buyer side
  removeAcceptedBid(product_id: any, status: string) {
    this.commonService.presentSpinner();
    if (status == 'remove') {
      this.bidsAndItemService
        .removeBid(new RemoveBid(product_id._id, product_id.bid_id))
        .subscribe(
          (res) => {
            this.commonService.dismissSpinner();
            this.commonService.removeBidAfterAccept();
            if (res) {
              this.getMyBiddingProducts();
              this.getAllExpiredProducts();
              this.getAllProducts();
              this.getMyActiveBids();
            }
          },
          (error) => {
            this.commonService.errorHandler(error);
          }
        );
    }
  }

  calculate_Total_Price_For_Sell_Product() {
    const commession = Number(
      Number(this.selectedSellProduct?.bidding[0]?.commission).toFixed(2)
    );
    const charging = Number(
      Number(this.selectedSellProduct?.bidding[0]?.shipping_charge).toFixed(2)
    );
    const vat = Number(
      Number(this.selectedSellProduct?.bidding[0]?.vat).toFixed(2)
    );
    const bid_price = Number(
      Number(this.selectedSellProduct?.bidding[0]?.bid_price).toFixed(2)
    );
    return bid_price - (commession + charging + vat);
  }

  applyAcrionOnBid(product_id: string, bid_id: string, action: string) {
    this.commonService.presentSpinner();
    if (action == 'accept') {
      let payload = new AcceptBid(product_id, bid_id);
      this.bidsAndItemService.acceptBid(payload).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.getMyBiddingProducts();
            this.getAllExpiredProducts();
            this.getAllProducts();
            this.getMyActiveBids();
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
    } else if (action == 'reject') {
      let payload = new RejectBid(product_id, bid_id);
      this.bidsAndItemService.rejectBid(payload).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          if (res) {
            this.getMyBiddingProducts();
            this.getAllExpiredProducts();
            this.getAllProducts();
            this.getMyActiveBids();
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
    }
  }
  checkGrade(grade) {
    if (grade) {
      if (grade.includes('Like New')) {
        return 'excellent';
      }
      if (grade.includes('Lightly Used')) {
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
}
