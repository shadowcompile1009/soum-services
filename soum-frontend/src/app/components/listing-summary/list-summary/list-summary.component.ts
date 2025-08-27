import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import {
  AskQuestion,
  HomeService,
  PostAnswer
} from 'src/app/services/home/home.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import firebase from 'firebase';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { Subscription } from 'rxjs';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-list-summary',
  templateUrl: './list-summary.component.html',
  styleUrls: ['./list-summary.component.scss']
})
export class ListSummaryComponent implements OnInit {
  showBidsPopUp: boolean;
  showBuyPopup: boolean;
  profileData: any;
  productId: any;
  hideDays = false;
  showModal = false;
  showCondition = false;
  difference: any = 0;
  hourRate;
  dayRate;
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
  loggedUserId: string;
  cards: any;
  queryParams: any;
  answer_to_questions_ar: any[];
  answer_to_questions: any[];
  userMobileNumber: any;
  previousUrl = false;
  subscriptions: Subscription[] = [];
  homeService: HomeService;
  commonService: CommonService;
  storage: StorageService;
  profileService: ProfileService;
  modalService: ModalService;
  translate: TranslateService;
  bidsAndItemsService: BidsAndItemsService;
  sharingServ: SharingDataService;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private injector: Injector
  ) {
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.bidsAndItemsService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);

    firebase.analytics().logEvent('product_view_summary');
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.product) {
        this.queryParams = params;
        this.productId = params.product;
        this.getProductDetail();
        this.getRouting();
        this.openSuccesbidModal();
        this.openGradeModal();
      }
    });

    this.sharingServ.userData.subscribe((data: any) => {
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
    if (this.commonService.isLoggedIn) {
      this.subscriptions.push(
        this.profileService.observableprofile.subscribe((sett) => {
          this.profileData = sett;
        })
      );
      const savedData = this.storage.getSavedData();
      this.userDetail = savedData[storageKeys.userDetails];
    } else {
      this.userDetail = null;
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Product-summary'
    };
    window['dataLayer'].push(productGTM);
  }
  openOrderPage(product) {
    this.router.navigate(['/order/']);
    // this.router.navigate(['/dashboard/order'])
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
    firebase.analytics().logEvent('bid_from_details');
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

  getProductDetail() {
    this.homeService.getProductDetail(this.productId).subscribe(
      (res) => {
        if (res && res.responseData) {
          this.product = res.responseData.result;
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
      },
      (error) => {
        this.router.navigate(['/products']);
      }
    );
  }

  getSimilarModels() {
    this.homeService.getProductsByModel(this.product.model_id).subscribe(
      (res) => {
        if (res && res.productList) {
          res.productList.forEach((product: any) => {
            let alreadyExist = this.similarModels.find((sm) => {
              if (sm.product_id == product.product_id) {
                sm.favourited = product.favourited;
                return true;
              }
            });
            if (
              product._id !== this.product.product_id &&
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
    this.router.navigate(['/devices'], {
      queryParams: {
        //  model_name: product.model_name,
        model: product.model_id,
        brand: product.brand_id
      }
    });
  }

  goBack() {
    this.router.navigate(['/devices'], {
      queryParams: {
        // model_name: this.product?.models?.model_name,
        model: this.product?.model_id,
        brand: this.product?.brand_id
      }
    });
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
          product_id: this.product.product_id,
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
    this.homeService
      .postAnswer(
        new PostAnswer({
          product_id: this.product.product_id,
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

  navigateTo(route: string, product: any) {
    let options: NavigationExtras = {};
    if (route === '/product-detail' && product) {
      options.queryParams = {
        product: product.product_id
      };
    }

    if (route === '/order' && product) {
      options.queryParams = {
        order: product._id || product.product_id
      };
    }
    this.router.navigate([route], options);
  }

  favorite(product: any) {
    if (this.userDetail) {
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotWishlist');
        return;
      }
    } else {
      this.commonService.presentModalForNotLogin();
    }
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  refreshList() {
    this.getProductDetail();
    this.getSimilarModels();
    this.getSimilarProducts();
  }
  openSuccesbidModal() {
    this.modalService.openCancelListing({
      value: true
    });
  }
  openGradeModal() {
    this.modalService.openModalGrade({
      value: true
    });
  }
  showmodalGrade() {
    this.showCondition = true;
    this.openGradeModal();
  }
  showmodal() {
    this.showModal = true;
    this.openSuccesbidModal();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
