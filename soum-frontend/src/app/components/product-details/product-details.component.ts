import { Location } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
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
import { ProductDetailsService } from 'src/app/services/product-details/product-details.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { PhotoSliderComponent } from './../../shared-components/photo-slider/photo-slider.component';
import { SellerService } from 'src/app/services/seller/seller.service';
import { Subscription } from 'rxjs';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { filter } from 'rxjs/operators';

let numOfRenewDays = 1;

/**
 * @title Dialog elements
 */
@Component({
  selector: 'renew-modal.component',
  templateUrl: './renew-modal.component.html'
})
export class RenewModalComponent {
  productToRenew: any;
  days: number = 1;

  constructor(
    @Inject(MatDialog) public data: any,
    public dialog: MatDialog,
    public translate: TranslateService,
    private commonService: CommonService
  ) {

  }

  renewProductListing() {
    this.dialog.closeAll();
    this.productToRenew = this.data.prodID;
    this.commonService.renewDetailedProduct();
  }

  changingValue(val) {
    numOfRenewDays = val;
  }
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  variants = [];

  showCondition = false;
  showDelete = false;
  showExpire = false;
  batteryList;
  AccessList = [];
  showBidsPopUp: boolean;
  panelOpenState = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  panelOpenState4 = false;
  showBuyPopup: boolean;
  profileData: any;
  productId: any;
  hideDays = false;
  difference: any = 0;
  hourRate;
  dayRate;
  productToRenew: any;
  productToDelete: any;
  days: number = 1;
  expectedDeliveryTime;
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
  listQuestions = [];
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
  questionsList = [];
  subscriptions: Subscription[] = [];
  loggedUserDetails: any = null;
  empty: boolean = false;
  validQuestion: boolean = true;
  validQuestionPromo: boolean = true;
  productType: boolean = false;
  showWishListIcon;
  sharingServ: SharingDataService;
  homeService: HomeService;
  commonService: CommonService;
  storage: StorageService;
  profileService: ProfileService;
  modalService: ModalService;
  translate: TranslateService;
  bidsAndItemsService: BidsAndItemsService;
  sellerService: SellerService;
  productDetailsService: ProductDetailsService;
  productID = null;
  is_BiddingDisabled: boolean = false;
  constructor(
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private events: EventsService,
    public dialog: MatDialog,
    private injector: Injector
  ) {
    const appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    this.is_BiddingDisabled = appSetting?.is_bidding_enabled || false;
    this.sharingServ =
      this.injector.get<SharingDataService>(SharingDataService);
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.bidsAndItemsService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.sellerService = this.injector.get<SellerService>(SellerService);
    this.productDetailsService = this.injector.get<ProductDetailsService>(
      ProductDetailsService
    );

    this.openGradeModal();
    this.openDeleteModal();
    this.openExpireModal(null);
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((params) => {
        if (params && params.product) {
          this.expectedDeliveryTime = +params.expectedDeliveryTime;
          this.queryParams = params;
          this.productId = params.product;
          // product Type old || new
          this.productType = params.type ? true : false;
          this.getProductDetail();
          this.getRouting();
        }
      })
    );

    this.sharingServ.userData.subscribe((data) => {
      this.loggedUserDetails = data ? data : null;
      this.userMobileNumber = data ? data.mobileNumber : null;
      this.loggedUserId = data ? data.userId : '';
    });
    this.subscriptions.push(
      this.events.subscribe(EventsKey.renewDetailedItem, () => {
        this.renew(this.productToRenew, numOfRenewDays);
      })
    );

    this.events.subscribe(EventsKey.removeItem, () => {
      this.delete(this.productToDelete);
    });

  this.router.events.pipe(filter(event => event instanceof NavigationEnd))
  .subscribe((event: NavigationEnd) => {
    if(event.url.includes('/listing-confirmation')){
      localStorage.setItem('productIDCon', this.productId);
    }
  });
  
  }
  refreshData(ID) {
    this.getProductDetail();
  }
  delete(product_id) {
    this.commonService.presentSpinner();
    if (product_id) {
      this.homeService.deleteProduct(product_id).subscribe(
        (res) => {
          this.commonService.dismissSpinner();
          this.productToDelete = '';
          if (res) {
            this.router.navigate(['/bids-and-items'], {
              queryParams: { tab: 'bought-sold' }
            });
          }
        },
        (error) => {
          this.commonService.errorHandler(error, true);
        }
      );
    }
  }

  deleteProduct(product_id: string) {
    if (product_id !== null || typeof product_id !== 'undefined') {
      this.productToDelete = product_id;
      this.commonService.removeProductModal();
    }
  }

  openDialog(product_id) {
    this.productToRenew = product_id;
    this.dialog.open(RenewModalComponent, {
      data: {
        prodID: this.productToRenew
      }
    });
  }
  getlist(id) {
    this.subscriptions.push(
      this.sellerService
        .getAnswersToProduct(this.productId)
        .subscribe((ques) => {
          this.questionsList = ques.responseData;
          this.listQuestions = [];
          for (var i = 0; i < this.questionsList?.length; i++) {
            let str = this.questionsList[i].question_en;
            let strAr = this.questionsList[i].question_ar;
            if (
              str.includes('Battery') ||
              str.includes('battery') ||
              str.includes('Health') ||
              str.includes('health')
            ) {
              if (this.questionsList[i].choices[0] != undefined) {
                this.batteryList = {
                  answer_ar: this.questionsList[i].choices[0].option_ar,
                  answer_en: this.questionsList[i].choices[0].option_en
                };
              }
            }
            if (strAr.includes('ملحقات') || str.includes('charger')) {
              if (
                this.questionsList[i].answers[0] &&
                this.questionsList[i].answers[0].answer_ar == 'نعم'
              ) {
                if (this.questionsList[i].answers[0].sub_choices.length) {
                  this.AccessList = [];
                  for (
                    var k = 0;
                    k < this.questionsList[i].answers[0].sub_choices.length;
                    k++
                  ) {
                    var obj = {
                      answer_ar:
                        this.questionsList[i].answers[0].sub_choices[k]
                          .option_ar,
                      answer_en:
                        this.questionsList[i].answers[0].sub_choices[k]
                          .option_en,
                      icon: this.questionsList[i].answers[0].sub_choices[k].icon
                    };
                    this.AccessList.push(obj);
                  }
                }
              }
            } else {
              if (
                this.questionsList[i].question_type == 'yes-no-with-options'
              ) {
                if (
                  this.questionsList[i].answers[0].sub_choices[0] != undefined
                ) {
                  var object = [];
                  var objof = [];
                  for (
                    var t = 0;
                    t < this.questionsList[i].answers[0].sub_choices.length;
                    t++
                  ) {
                    object.push({
                      subChoice_ar:
                        this.questionsList[i].answers[0].sub_choices[t]
                          .option_ar,
                      icon: this.questionsList[i].answers[0].sub_choices[t].icon
                    });
                    objof.push({
                      subChoice_en:
                        this.questionsList[i].answers[0].sub_choices[t]
                          .option_en,
                      icon: this.questionsList[i].answers[0].sub_choices[t].icon
                    });
                  }
                  this.listQuestions.push({
                    question_ar: this.questionsList[i].question_ar,
                    question_en: this.questionsList[i].question_en,
                    answer_ar: this.questionsList[i].answers[0].answer_ar || '',
                    answer_en: this.questionsList[i].answers[0].answer_en || '',

                    subChoice_ar: object,
                    subChoice_en: objof
                  });
                } else {
                  this.listQuestions.push({
                    question_ar: this.questionsList[i].question_ar,
                    question_en: this.questionsList[i].question_en,
                    answer_ar: this.questionsList[i].answers[0].answer_ar || '',
                    answer_en: this.questionsList[i].answers[0].answer_en || ''
                  });
                }
              } else if (
                this.questionsList[i].question_type == 'yes-no-without-options'
              ) {
                this.listQuestions.push({
                  question_ar: this.questionsList[i].question_ar,
                  question_en: this.questionsList[i].question_en,
                  answer_ar: this.questionsList[i].answers[0].answer_ar || '',
                  answer_en: this.questionsList[i].answers[0].answer_en || ''
                });
              } else {
                if (this.questionsList[i].choices[0] != undefined) {
                  this.listQuestions.push({
                    question_ar: this.questionsList[i].question_ar,
                    question_en: this.questionsList[i].question_en,
                    answer_ar: this.questionsList[i].choices[0].option_ar,
                    answer_en: this.questionsList[i].choices[0].option_en
                  });
                } else {
                  this.listQuestions.push({
                    question_ar: this.questionsList[i].question_ar,
                    question_en: this.questionsList[i].question_en
                  });
                }
              }
            }
          }
        })
    );
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
      this.userDetail = savedData[storageKeys.userDetails] || {};
      this.openModalForProductToBuy();
      this.openModalForProductToBid();
    } else {
      this.userDetail = null;
    }    
    this.showWishListIcon = !this.isEmpty(this.userDetail);
    this.panelOpenState = !this.panelOpenState;
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
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
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

  openModalForProductToBid() {
    const savedData = this.storage.getSavedData();
    if (savedData && savedData[storageKeys.productToBid]) {
      this.openBidModal(savedData[storageKeys.productToBid]);
    }
  }

  openBidModal(product: any) {
    if (this.loggedUserDetails) {
      firebase.analytics().logEvent('bid_from_details');
      if (this.userDetail.userId == product.user_id) {
        this.commonService.showPopUpForYourProduct('cannotBid');
        return;
      }
    } else {
      this.commonService.isLoggedIn = false;
      this.commonService.handleNavigationChange();
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
  checkDefaultLangForVariants(text){
    let defaultLanguage = this.translate.getDefaultLang();

  if(defaultLanguage == 'ar'){
    return text.arName;

  }
  else{
    return text.enName;
  }
  }
  // *********************** END: BID AND BUY *******************************
  // in this function check if product expired and click ok back to the last page
  getProductDetail() {
    this.homeService.getProductDetail(this.productId).subscribe(
      async (res) => {
        if (res && res.responseData.result) {
          this.variants = res.responseData.result.attributes;
          if (
            this.loggedUserId != res.responseData.result.seller_id &&
            new Date(res.responseData.result.expiryDate) < new Date()
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
                  // back from here
                  this._location.back();
                }
              }
            });
            return;
          } else {

            /**
             * Start Analytics
             * if this the first time this api was called
             * we consider it has one page view and send data
             * to analytics only once when it was undefined or null
             */
            if(!this.product) {
              const extraProductDetails = res.responseData.result; 
              const eventParams = {
                productId: extraProductDetails?.product_id,
                model: extraProductDetails?.models?.model_name,
                variant: extraProductDetails?.varient,
                grade: extraProductDetails?.grade,
                category: extraProductDetails?.category.category_name,
                brand: extraProductDetails?.brands.brand_name,
                created: extraProductDetails?.createdDate,
                sellPrice: extraProductDetails?.sell_price
              }
              
              firebase.analytics().logEvent('product_view', {
                ...eventParams
              });
              window['dataLayer'] = window['dataLayer'] || [];
              // Add GTM
              const productGTM = {
                event: 'pageview',
                pagePath: this.router.url,
                pageTitle: 'Product-details',
                ...eventParams
              };
              window['dataLayer'].push(productGTM);
            }
            /**
             * End Analytics
             */

            this.product = res.responseData.result;
            this.getlist(this.product.category_id);
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
            this.product.product_questions = this.checkReturnedAnswers();
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
        //model_name: product.model_name,
        model: product.model_id,
        brand: product.brand_id
      }
    });
  }

  goBack() {
    if (this.productType) {
      this.router.navigate(['/bids-and-items'], {
        queryParams: { tab: 'bought-sold' }
      });
      this.productType = false;
      return;
    }

    if (this.previousUrl === true) {
      this._location.back();
    } else {
      if (this.product && this.product.models) {
        this.router.navigate(['/devices'], {
          queryParams: {
            // model_name: this.product.models.model_name,
            model: this.product.model_id,
            brand: this.product.brand_id
          }
        });
      } else {
        this.router.navigate(['/products']);
      }
    }
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

  validateQuestion(value: string) {
    this.validQuestion = this.commonService.validateDescAndComment(value);
    this.validQuestionPromo =
      this.commonService.validateDescAndCommentPromo(value);
  }

  askQuestion() {
    if (!this.loggedUserDetails) {
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
      return;
    }

    if (!this.question) {
      return;
    }
    if (!this.commonService.isLoggedIn) {
      this.commonService.loginRequested = {
        commands: [this.router.url.split('?')[0]],
        extras: { queryParams: this.queryParams }
      };
      this.commonService.handleNavigationChange();
      this.commonService.isLoggedIn = false;
      return;
    }

    // check by regex user not written any phone number
    const regex =
      /([\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}[\u0660-\u0669\u06F0-\u06F90-9]{1,}[\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}){6,}/g;
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

  async navigateTo(route: string, product: any) {
    // if(!this.userDetail) {
    //   this.commonService.isLoggedIn = false;
    //   this.commonService.handleNavigationChange();
    //   return;
    // }
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
          product: product.product_id
        };
      }

      if (route === '/order' && product) {
        this.commonService.isLoggedIn = true;
        options.queryParams = {
          order: product._id || product.product_id
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
      this.router.navigate(['/login/continue']);
      return;
    }
    this.homeService
      .favorite(
        this.userDetail.userId,
        product,
        product.product_id,

        product.favourited ? 'unfavorite' : 'favorite'
      )
      .then((res) => {
        if (!product.favourited) {
          firebase
            .analytics()
            .logEvent('user_clicks_like', { product_id: product.product_id });
        }
        if (res) {
          this.getSimilarModels();
          this.getProductDetail();
        }
      });
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  showHideQuestion(q_date: string) {
    const question_date = new Date(q_date);
    const Q_year = question_date.getFullYear();
    const Q_month = question_date.getMonth();
    const Q_date = question_date.getDate();

    const date_now = new Date();
    const now_year = date_now.getFullYear();
    const now_month = date_now.getMonth();
    const now_date = date_now.getDate();

    if (now_year >= Q_year && now_month >= Q_month) {
      if (now_date - Q_date > 5) {
        return false;
      }
    }
  }

  formatDate(date: string) {
    const Question_date = new Date(date);
    return Question_date;
  }

  renew(product_id: string, days: number) {
    if (typeof product_id != 'undefined') {
      this.commonService.presentSpinner();
      this.productDetailsService.renewProduct(product_id, days).then((res) => {
        numOfRenewDays = 1;
        this.commonService.dismissSpinner();
        if (res) {
          this.refreshList();
        }
      });
    }
  }

  isExpired(expiryDate) {
    if (new Date(expiryDate) < new Date()) {
      return true;
    }
    return false;
  }

  refreshList() {
    this.getProductDetail();
    this.getSimilarModels();
    this.getSimilarProducts();
  }
  openGradeModal() {
    this.modalService.openModalGrade({
      value: true
    });
  }
  showExpiryModal(ID) {
    this.showExpire = true;
    this.openExpireModal(ID);
  }

  openExpireModal(ID) {
    this.productID = ID;
    this.modalService.openExpiryModel({
      ID: ID
    });
  }

  showDeleteModal(ID) {
    this.showDelete = true;
    this.productID = ID;
    this.openDeleteModal();
  }

  openDeleteModal() {
    this.modalService.openDeleteItem({
      value: true
    });
  }
  showmodalGrade() {
    this.showCondition = true;
    this.openGradeModal();
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

  openSliderDialog(image: any) {
    this.dialog.open(PhotoSliderComponent, {
      height: '500px',
      width: '350px',
      data: [image, ...this.product.product_images]
    });
  }

  isEmpty(obj) {
    if (obj) {
      return Object.keys(obj).length === 0;
    }
  }

  checkReturnedAnswers() {
    let notAnswered_questions = [];
    for (const iterator of this.product.product_questions) {
      if (
        iterator.answer === '' &&
        this.loggedUserId !== iterator.user_id._id &&
        this.product.seller_id !== this.loggedUserId
      ) {
        notAnswered_questions.push(iterator._id);
      }
    }
    let result_array = this.product.product_questions.filter((item) => {
      return notAnswered_questions.indexOf(item._id) === -1;
    });
    return result_array;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
