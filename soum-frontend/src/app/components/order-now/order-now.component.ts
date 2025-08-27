import { AddAddress } from './../../services/profile/profile.service';
import { Location } from '@angular/common';
import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import {
  AskQuestion,
  HomeService,
  PostAnswer
} from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { PromoService } from 'src/app/services/promoCode-service/promo.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { BuyPayloadnew } from '../../services/buy/buy.service';
import {
  AuthorizationService,
  SetPassword
} from 'src/app/services/auth/authorization.service';
import { PopupNewAddressComponent } from './../../shared-components/popup-new-address/popup-new-address.component';
import { MatDialog } from '@angular/material/dialog';
import cities from 'src/assets/SA-cities/new-cities.json';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-order-now',
  templateUrl: './order-now.component.html',
  styleUrls: ['./order-now.component.scss']
})
export class OrderNowComponent implements OnInit {
  promoCode: any = '';
  promoCodeValid: any = null;
  promoCodeInfo: any = null;
  waitingVerify: boolean = false;
  BackendErrorMessage: any = '!!!';
  amountConfig;
  calculationProduct: any = null;
  originalProduct: any = null;
  commissionDiscount: number = 0;
  devicePriceDiscount: number = 0;
  showBidsPopUp: boolean;
  showBuyPopup: boolean;
  profileData: any;
  productId: any;
  hideDays = false;
  difference: any = 0;
  hourRate;
  dayRate;
  imgUrl;
  customOptions = {
    loop: false,
    autoplay: false,
    center: true,
    dots: true,

    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  };
  DateSingle = false;
  product: any;
  productOnPopup: any;
  similarProducts: any = [];
  amountConfigForBuy: BuyModalPrice;
  similarModels: any = [];
  userDetail: any;
  question: string;
  answer: string;
  addresses: any;
  selectedAddress: string;
  cards: any;
  queryParams: any;
  answer_to_questions_ar: any[];
  answer_to_questions: any[];
  userMobileNumber: any;
  previousUrl = false;
  couponVariance = 0;
  loggedUserId;
  userLoggedIn: boolean = true;
  remainingCommission = 0;
  subscriptions: Subscription[] = [];
  userDetails: any = null;
  empty: boolean = false;
  showLoginInModal: boolean = false;
  showCoupon: boolean = false;
  // guest fields for collect data
  setUsername;
  newAddress;
  newCity;
  newPostelCode;
  newDistrict;
  searchValue: any = '';
  showCitiesModal: boolean = false;
  cities: { name_ar: string; name_en: string }[];
  copy_cities: any[] = [];
  language: any;

  homeService: HomeService;
  commonService: CommonService;
  storage: StorageService;
  profileService: ProfileService;
  modalService: ModalService;
  promoServ: PromoService;
  sharingServ: SharingDataService;
  bidsAndItemsService: BidsAndItemsService;
  userAddress: any;
  userNewAddressExist: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public translate: TranslateService,
    private events: EventsService,
    private _location: Location,
    private injector: Injector,
    private authSerivce: AuthorizationService,
    private dialog: MatDialog
  ) {
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.promoServ = this.injector.get<PromoService>(PromoService);
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);
    this.bidsAndItemsService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);

    if (!this.commonService.isLoggedIn) {
      this.router.navigate(['/login/continue']);
    } else {
      this.subscriptions.push(
        this.activatedRoute.queryParams.subscribe((params) => {
          if (params && params.order) {
            this.queryParams = params;
            this.productId = params.order;
            this.getProductCalculationPrice();
            this.getProductDetail();
            this.getRouting();
          }
        })
      );
    }

    this.cities = cities;
    this.cities.sort((a, b) => {
      return a.name_en.localeCompare(b.name_en);
    });
    this.copy_cities = this.cities;
    this.userNewAddressExist = this.commonService.checkExistAddress();
    this.getNewUserAddress();
    this.sharingServ.userData.subscribe((data: any) => {
      this.userDetails = data ? data : null;
      this.loggedUserId = data ? data.userId : '';
      this.userMobileNumber = data ? data.mobileNumber : '';
    });
  }
  getRouting() {
    this.subscriptions.push(
      this.bidsAndItemsService.observableRouter.subscribe((router) => {
        if (router === true) {
          this.previousUrl = true;
        } else {
          this.previousUrl = false;
        }
      })
    );
  }
  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }
  diff_days(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / (1000 * 3600 * 24);

    return Math.abs(Math.round(diff));
  }

  ngOnInit(): void {
    const savedData = this.storage.getSavedData();
    const checkSavedDetails = savedData[storageKeys.userDetails];

    if (this.commonService.isLoggedIn && checkSavedDetails) {
      this.subscriptions.push(
        this.profileService.observableprofile.subscribe((sett) => {
          this.profileData = sett || {};
          this.setUsername = this.profileData?.name;
          this.newAddress = this.userNewAddressExist
            ? this.userAddress?.street
            : '';
          this.newCity = this.userNewAddressExist ? this.userAddress?.city : '';
          this.newPostelCode = this.userNewAddressExist
            ? this.userAddress?.postal_code
            : '';
          this.newDistrict = this.userNewAddressExist
            ? this.userAddress?.district
            : '';
        })
      );
      this.userDetail = savedData[storageKeys.userDetails];

      this.openModalForProductToBuy();
      this.openModalForProductToBid();
    } else {
      this.userDetail = null;
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Order-now'
    };
    window['dataLayer'].push(productGTM);
  }
  openOrderPage(product) {
    this.router.navigate(['/order/']);
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

  openBuyModal(product: any) {
    firebase.analytics().logEvent('buy_from_details');
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
      address: this.userAddress ? this.userAddress : null,
      amountConfigForBuy: this.commonService.calculatePriceForBuyModal(
        product,
        'calculate'
      )
    });
  }

  openconfig(product: any) {
    this.amountConfig = this.commonService.calculatePriceForBuyModal(
      product,
      'calculate'
    );
  }
  openModalForProductToBid() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBid]) {
      this.openBidModal(savedData[storageKeys.productToBid]);
    }
  }

  buyProduct(address_id?) {
    // this.product = product
    if (!this.userDetail) {
      this.openLoginModal();
    } else if (this.userDetail) {
      firebase.analytics().logEvent('place_an_order');
      if (this.userAddress || typeof this.userAddress !== 'undefined') {
        let payload = new BuyPayloadnew({
          address_id:
            this.userAddress && this.userNewAddressExist
              ? this.userAddress._id
              : null,
          productId: this.product?._id || this.product?.product_id,
          actionType: 'buy',
          buyerPromocodeId: this.promoCodeInfo ? this.promoCodeInfo._id : null
        });

        if (!this.setUsername) {
          return;
        }
        this.handleRegisterName();

        if (!payload.address_id) {
          this.addNewAddress();
          return;
        }

        if (!this.userNewAddressExist) {
          this.dialog.open(PopupNewAddressComponent, {
            data: { closeInSamePage: true }
          });
          return;
        }

        firebase.analytics().logEvent('user_buys_item');
        this.router.navigate(
          [
            '/payment-options',
            this.product?._id || this.product?.product_id,
            'buy'
          ],
          { state: { payload: payload } }
        );
      } else {
        this.addNewAddress();
      }
    }
  }

  addNewAddress() {
    if (
      !this.newAddress ||
      !this.newCity ||
      !this.newPostelCode ||
      !this.newDistrict
    ) {
      this.dialog.open(PopupNewAddressComponent, {
        data: { closeInSamePage: true }
      });
      return;
    }
    const payload: AddAddress = {
      street: this.newAddress,
      city: this.newCity,
      postal_code: this.newPostelCode,
      district: this.newDistrict,
      address_type: '',
      latitude: '',
      longitude: ''
    };

    const userLogged = JSON.parse(localStorage.getItem('userDetails'));
    const loggedUser = JSON.parse(userLogged);
    this.profileService.addNewAddressV2(loggedUser.userId, payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.profileService.getNewUserAddressFormat().subscribe((res) => {
            this.userAddress =
              res.responseData.length > 0
                ? res.responseData[res.responseData.length - 1]
                : null;
            localStorage.setItem(
              'userAddress',
              JSON.stringify(this.userAddress)
            );
            this.userNewAddressExist = this.commonService.checkExistAddress();
            this.getAddressAfterAddOrUpdate(this.userAddress._id);
          });
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  getAddressAfterAddOrUpdate(address_id) {
    this.commonService.presentSpinner();
    this.profileService.getProfileData().then((profileData: any) => {
      this.commonService.dismissSpinner();
      if (profileData) {
        this.buyProduct(address_id);
      }
    });
  }

  handleRegisterName() {
    this.commonService.presentSpinner();
    const payload = new SetPassword({ name: this.setUsername, password: '' });
    this.authSerivce.setPassword(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          // No need for checking here.
          firebase.analytics().logEvent('user_registeres');
          // Event Ends
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  async checkAddress() {
    this.presentAlert({
      message: await this.getTranslatedString('alertPopUpTexts.checkAddress'),
      button1: {
        text: await this.getTranslatedString(`alertPopUpTexts.addAddressLater`),
        handler: () => {
          this.empty = true;
        },
        cssClass: 'custom-alert-font'
      },
      button2: {
        text: await this.getTranslatedString(`alertPopUpTexts.addAddress`),
        handler: () => {
          if (!this.userDetail) {
            this.commonService.handleNavigationChange();
            this.commonService.isLoggedIn = false;
          } else {
            sessionStorage.setItem('redirectURL', this.router.url);
            this.router.navigate(['/add-address']);
          }
        },
        cssClass: 'custom-alert-font'
      }
    });
  }
  openBidModal(product: any) {
    if (!this.userDetail) {
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
      return;
    }

    firebase.analytics().logEvent('bid_from_details');
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotBid');
        return;
      }
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

  getProductDetail() {
    this.homeService.getProductDetail(this.productId).subscribe(
      (res) => {
        if (res && res.responseData) {
          this.product = res.responseData.result;
          this.imgUrl = this.product.product_images[0];
          this.openconfig(this.product);
          if (
            this.product &&
            typeof this.product.answer_to_questions == 'string'
          ) {
            if (this.product.answer_to_questions) {
              this.answer_to_questions = JSON.parse(
                this.product.answer_to_questions
              );
            } else {
              this.answer_to_questions = [];
            }
          }
          if (
            this.product &&
            typeof this.product.answer_to_questions_ar == 'string'
          ) {
            if (this.product.answer_to_questions_ar) {
              this.answer_to_questions_ar = JSON.parse(
                this.product.answer_to_questions_ar
              );
            } else {
              this.answer_to_questions_ar = [];
            }
          }
          this.product.product_questions.forEach((question: any) => {
            question.editAnswer = false;
          });
          var dt1 = new Date();
          var dt2 = new Date(this.product.createdDate);
          this.difference = this.diff_hours(dt1, dt2);
          if (this.difference >= 24) {
            this.dayRate = this.diff_days(dt1, dt2);
            this.hideDays = false;
            if (this.dayRate == 1) {
              this.DateSingle = true;
            } else {
              if (this.dayRate >= 5) {
                this.hideDays = true;
              }
              this.DateSingle = false;
            }
          } else {
            this.hourRate = this.difference;
            if (this.hourRate == 1) {
              this.DateSingle = true;
            } else {
              this.DateSingle = false;
            }
          }
          this.getSimilarModels();
          this.getSimilarProducts();
        }
        // check when no product details or no product found redirect to products and print the error not issue happend
      },
      (error) => {
        this.router.navigate(['/products']);
      }
    );
  }

  // function to calucalte commission, vat, charging, sell price, totalPrice
  getProductCalculationPrice() {
    this.homeService
      .getProductCalculationPrice('', this.productId, '', 'buy', '')
      .subscribe(
        (res) => {
          this.calculationProduct = res?.sellData;
          this.originalProduct = res?.sellData;

          // @ts-ignore
          // new TabbyPromo({
          //   selector: "#TabbyPromo", // required, content of tabby Promo Snippet will be placed in element with that selector
          //   currency: "SR", // required, currency of your product
          //   price: this.calculationProduct.sellPrice, // required, price or your product
          //   installmentsCount: 5, // Optional - custom installments number for tabby promo snippet (if not downpayment + 3 installments)
          //   lang: this.translate.getDefaultLang(), // optional, language of snippet and popups, if the property is not set, then it is based on the attribute 'lang' of your html tag
          //   source: "product", // optional, snippet placement; `product` for product page and `cart` for cart page
          //   api_key: "PUBLIC_API_KEY", // optional, public key which identifies your account when communicating with tabby
          // });
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  getSellerPrice() {
    if (this.product) {
      return this.product.sell_price;
    }
  }

  getSimilarModels() {
    this.homeService.getProductsByModel(this.product.model_id).subscribe(
      (res) => {
        if (res && res.productList) {
          res.productList.forEach((product: any) => {
            let alreadyExist = this.similarModels.find((sm) => {
              if (sm.product_id == product?.product_id) {
                sm.favourited = product.favourited;
                return true;
              }
            });
            if (
              product._id !== this.product?.product_id &&
              !alreadyExist &&
              !(this.similarModels.length >= 2)
            ) {
              this.similarModels.push(product);
            }
          });
        } else {
          this.similarModels = [];
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  goToDeviceList(product: any) {
    this.router.navigate(['/product-detail'], {
      queryParams: {
        product: product?._id
      }
    });
  }

  goBack() {
    this._location.back();
  }

  viewQuestion() {
    document.getElementById('answersToQuestion').scrollIntoView();
  }

  getSimilarProducts() {
    this.similarProducts = [];
    this.homeService.getProducts(this.product.category_id).subscribe(
      (res) => {
        if (res) {
          res.productList.forEach((product: any) => {
            if (
              product.model_id !== this.product.model_id &&
              !(this.similarProducts.length >= 2)
            ) {
              this.similarProducts.push(product);
            }
          });
        } else {
          this.similarProducts = [];
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  askQuestion() {
    if (!this.question) {
      return;
    }
    if (!this.commonService.isLoggedIn) {
      this.commonService.loginRequested = {
        commands: [this.router.url.split('?')[0]],
        extras: { queryParams: this.queryParams }
      };
      this.router.navigate(['/login/continue']);
      return;
    }

    // check by regex user not written any phone number
    const regex =
      /([\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}[0-9]{1,}[\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}){6,}/g;
    const matching_regex = this.question.match(regex);
    let wordQuestion = this.question;
    if (matching_regex) {
      matching_regex.forEach((matchReg) => {
        wordQuestion = wordQuestion.replace(matchReg, ' ');
      });
      this.question = wordQuestion;
    }

    this.homeService
      .askQuestion(
        new AskQuestion({
          product_id: this.product?.product_id,
          question: this.question
        })
      )
      .subscribe(
        (res) => {
          if (res) {
            this.getProductDetail();
            this.question = '';
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  editAnswer(question: any) {
    question.editAnswer = !question.editAnswer;
    if (question.editAnswer) {
      this.answer = question.answer;
      setTimeout(() => {
        document.getElementById('post-answer').scrollIntoView();
      }, 500);
    } else {
      this.answer = '';
    }
  }

  postAnswer(question: any) {
    // check by regex user not written any phone number
    const regex =
      /([\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}[\u0660-\u0669\u06F0-\u06F90-9]{1,}[\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}){6,}/g;
    const matching_regex = this.answer.match(regex);
    let wordAnswer = this.answer;
    if (matching_regex) {
      matching_regex.forEach((matchReg) => {
        wordAnswer = wordAnswer.replace(matchReg, ' ');
      });
      this.answer = wordAnswer;
    }

    this.homeService
      .postAnswer(
        new PostAnswer({
          product_id: this.product?.product_id,
          question_id: question._id || '',
          answer: this.answer
        })
      )
      .subscribe(
        (res) => {
          if (res) {
            this.getProductDetail();
            this.answer = '';
          }
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  async navigateTo(route: string, product: any) {
    // checking on the seller id return inside product and set ? to check if it not exist
    if (
      this.userDetail &&
      this.userDetail?.userId != product?.seller_id &&
      new Date(product?.expiryDate) < new Date()
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
          product: product?.product_id
        };
      }
      if (route === '/order' && product) {
        firebase.analytics().logEvent('buy_from_details');
        options.queryParams = {
          order: product._id
        };
      }
      this.router.navigate([route], options);
    }
  }

  favorite(product: any) {
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotWishlist');
        return;
      }
    } else {
      this.commonService.presentModalForNotLogin();
      return;
    }
    this.homeService
      .favorite(
        this.userDetail.userId,
        product,
        product?.product_id,
        product.favourited ? 'unfavorite' : 'favorite'
      )
      .then((res) => {
        if (!product.favourited) {
          firebase.analytics().logEvent('user_clicks_like'); // This is the evevnt.
        }
        if (res) {
          this.getSimilarModels();
        }
      });
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  refreshList() {
    this.getProductDetail();
  }

  async verifyCoupon() {
    if (!this.userDetails) {
      this.userLoggedIn = false;
      this.openLoginModal();
      return;
    }
    this.waitingVerify = true;
    this.promoCodeValid = null;
    this.promoCodeInfo = null;

    this.subscriptions.push(
      this.promoServ
        .validatePromCode(this.promoCode, 'Buyer', this.productId)
        .subscribe(
          (data) => {
            // calculate data product prices if promo code exist
            this.homeService
              .getProductCalculationPrice(
                '',
                this.productId,
                data?.promocodeDate?._id,
                'buy',
                ''
              )
              .subscribe(
                (res) => {
                  this.calculationProduct = res?.discountData;
                  const oldCommission = this.convertStringToNumber(
                    res?.sellData?.commission
                  );
                  if (
                    this.convertStringToNumber(res?.discountData?.disValue) <=
                    oldCommission
                  ) {
                    this.commissionDiscount = this.convertStringToNumber(
                      res?.discountData?.disValue
                    );
                    this.devicePriceDiscount = 0;
                  } else {
                    this.commissionDiscount = oldCommission;
                    this.devicePriceDiscount =
                      this.convertStringToNumber(res?.discountData?.disValue) -
                      this.commissionDiscount;
                  }
                  this.promoCodeValid = true;
                },
                (error) => {
                  this.promoCodeValid = false;
                  this.waitingVerify = false;
                  this.promoCodeInfo = null;
                  this.BackendErrorMessage = null;
                  this.amountConfig.coupon = 0;
                  this.commissionDiscount = 0;
                  this.devicePriceDiscount = 0;
                  this.getProductCalculationPrice();
                  this.commonService.errorHandler(error);
                }
              );
            this.waitingVerify = false;
            this.promoCodeInfo = data.promocodeDate;
          },
          (err) => {
            this.promoCodeValid = false;
            this.waitingVerify = false;
            this.promoCodeInfo = null;
            this.amountConfig.coupon = 0;
            this.getProductCalculationPrice();
            this.commissionDiscount = 0;
            this.devicePriceDiscount = 0;
            this.BackendErrorMessage = err.error.message;
          }
        )
    );
  }

  convertStringToNumber(value) {
    return Number(Number(value).toFixed(2));
  }

  redirectToLogin() {
    this.router.navigate(['/login/continue']);
    this.commonService.isLoggedIn = false;
  }

  presentAlert(options: AlertControllerInterface) {
    this.events.publish(EventsKey.alertController, options);
  }

  async getTranslatedString(text: string, value?: Object) {
    return this.translate
      .get(text, value)
      .pipe(
        map((txt) => {
          return txt;
        })
      )
      .toPromise();
  }

  openLoginModal() {
    this.showLoginInModal = true;
    this.modalService.openLoginModal({
      value: 'openLoginModal'
    });
  }

  closeModal() {
    this.showLoginInModal = false;
  }

  checkLoginState() {
    window.location.reload();
  }

  getNewUserAddress() {
    this.profileService.getNewUserAddress();
    this.userAddress = JSON.parse(localStorage.getItem('userAddress')) || null;
  }

  openCitiesModal() {
    this.showCitiesModal = true;
  }

  closeCitiesModal() {
    this.showCitiesModal = false;
  }

  selectCity(cityName) {
    this.newCity = cityName;
    this.showCitiesModal = false;
  }

  filterByCityName() {
    if (this.searchValue == '') {
      this.copy_cities = [];
      this.copy_cities = this.cities;
    } else {
      this.copy_cities = [];
      this.copy_cities = this.cities.filter((city) =>
        city[this.language == 'en' ? 'name_en' : 'name_ar']
          .trim()
          .toLowerCase()
          .includes(this.searchValue.trim().toLowerCase())
      );
    }
  }

  clearSearchFilter() {
    this.searchValue = '';
    this.newCity = null;
    this.copy_cities = this.cities;
  }

  revertCoupon() {
    this.showCoupon = !this.showCoupon;
    this.promoCodeValid = false;
    this.waitingVerify = false;
    this.promoCodeInfo = null;
    this.promoCode = '';
    this.BackendErrorMessage = '';
    this.amountConfig.coupon = 0;
    this.getProductCalculationPrice();
    this.commissionDiscount = 0;
    this.devicePriceDiscount = 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}

export interface AlertControllerInterface {
  header?: string;
  message: string;
  button1: {
    text: string;
    handler?: any;
    cssClass?: string;
  };
  button2?: {
    text: string;
    cssClass?: string;
    handler?: any;
  };
}
