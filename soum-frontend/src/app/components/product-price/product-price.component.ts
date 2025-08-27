import { Location } from '@angular/common';
import { Component, Injector, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import moment from 'moment';
import {
  BuyModalPrice,
  CommonService,
  
} from 'src/app/services/common/common.service';
import { SellerService } from 'src/app/services/seller/seller.service';
import { PromoService } from 'src/app/services/promoCode-service/promo.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { HomeService } from 'src/app/services/home/home.service';
import { PriceNudgingService } from 'src/app/services/price-nudging/price-nudging.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-product-price',
  templateUrl: './product-price.component.html',
  styleUrls: ['./product-price.component.scss']
})
export class ProductPriceComponent implements OnInit, OnDestroy {
  sell_price: any;
  bid_price: any;
  showExpiry = false;
  showModalBid = false;
  showModalBuy = false;
  showModal = false;
  current_price;
  description: any = '';
  expiryAfterInDays: number = 14;
  isListedBefore: any = 'no';
  appData: any;
  model: any;
  varient: any;
  promoCode: any = '';
  promoCodeValid: any = null;
  promoCodeInfo: any;
  percentage;
  valueDiscount;
  waitingVerify: boolean = false;
  subscriptions: Subscription[] = [];
  condition = 0;
  condition_ar = '';
  score = 0;
  siteLang: any = '';
  amountConfig: BuyModalPrice = {
    VAT: 0,
    amount: 0,
    commission: 0,
    commission_seller_key:0,
    commission_seller:0,
    shippingCharges: 0,
    totalAmount: 0,
    coupon: 0
  };
  valueOfSell = 0;
  showSaveAsDraftConfirm = false;
  productId: any;
  product: any;
  response = [];
  questionsList: any;
  answersList = [];
  brandName: string;
  deviceName: string;
  modelName: string;
  capacityName: string;
  validDescription: boolean = true;
  validDescriptionPromo: boolean = true;
  empty: boolean = false;
  is_BiddingDisabled: boolean = false;
  validProductSellPrice: boolean = true;
  maxSellerPrice: number = 0;
  userDetails;
  appSetting;
  priceNudgeServ: PriceNudgingService;
  sellerService: SellerService;
  commonService: CommonService;
  promoServ: PromoService;
  modalService: ModalService;
  homeService: HomeService;
 vatPercentage;
  constructor(
    private _location: Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private injector: Injector,
    private profileService: ProfileService,

  ) {
    this.appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    this.is_BiddingDisabled = this.appSetting?.is_bidding_enabled || false;
    this.priceNudgeServ =
    this.injector.get<PriceNudgingService>(PriceNudgingService);
    this.sellerService = this.injector.get<SellerService>(SellerService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.promoServ = this.injector.get<PromoService>(PromoService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.amountConfig.commission_seller =  Number(
      Number(
        (this.appSetting.seller_commission_percentage) / 100
      ).toFixed(2)
    );
 
    this.amountConfig.commission_seller_key =  Number(
      Number(
        (this.appSetting.business_seller_commission_percentage) / 100
      ).toFixed(2)
    );
     this.vatPercentage = Number(
      Number(
        (this.appSetting.vat_percentage) / 100
      ).toFixed(2)
    );
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params && params.product) {
        this.productId = params.product;
        localStorage.setItem('productIDForDraft', this.productId);
      }
    });

    let langFromStorage = JSON.parse(localStorage.getItem('defaultLang'));
    this.siteLang = JSON.parse(langFromStorage);
    this.openSuccesbidModal();
    this.openBuy();
    this.openBid();
    this.showExpireModal();
    this.changeListingt('no');
    let deviceCatID = JSON.parse(localStorage.getItem('selectedDevice'));
    let brandID = JSON.parse(localStorage.getItem('selectedBrand'));
    let modelID = JSON.parse(localStorage.getItem('selectedModel'));
    let varientID = JSON.parse(localStorage.getItem('selectedVarient'));
    this.brandName = brandID?.brand_name;
    this.deviceName = deviceCatID?.category_name;
    this.modelName = modelID?.model_name;
    this.capacityName = varientID?.varient;
  }
  openInfoBuy() {
    this.showModalBuy = true;
    this.openBuy();
  }
  openInfoBid() {
    this.showModalBid = true;
    this.openBid();
  }
  changeListingt(option) {
    this.isListedBefore = option;
  }
  checkDataOnPageEnter() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice &&
      !this.sellerService.selectedBrand &&
      !this.sellerService.selectedModel
    ) {
      this.router.navigate(['select-devices']);
    }

    if (this.sellerService.selectedModel) {
      this.model = this.sellerService.selectedModel;
    }

    if (this.sellerService.selectedVarient) {
      this.varient = this.sellerService.selectedVarient;
    }

    this.sell_price = this.sellerService.uploadProductData.sell_price || '';
    this.bid_price = this.sellerService.uploadProductData.bid_price || '';
    this.description = this.sellerService.uploadProductData.description || '';
    this.expiryAfterInDays =
      this.sellerService.uploadProductData.expiryAfterInDays || 14;
    this.isListedBefore =
      this.sellerService.uploadProductData.isListedBefore || 'no';
    if (this.sell_price) {
      this.onEnterSellPrice();
    }
  }
  openSuccesbidModal() {
    this.modalService.openCancelListing({
      value: true
    });
  }
  openBid() {
    this.modalService.openBid({
      value: true
    });
  }
  openBuy() {
    this.modalService.openBuy({
      value: true
    });
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.profileService.observableprofile.subscribe((profile) => {
        this.userDetails = profile;
      })
    );
    this.calculateMaxPriceForListingProduct();
    this.bid_price = this.is_BiddingDisabled ? 0 : this.bid_price;
    if (!this.productId) {
      this.checkDataOnPageEnter();
      this.calculatePriceNudging();
    } else {
      this.getProductDetail();
    }

    this.subscriptions.push(
      this.commonService.observableSett.subscribe((sett) => {
        this.appData = sett;
      })
    );

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Product-price'
    };
    window['dataLayer'].push(productGTM);
  }

  calculatePriceNudging() {
    // send request to backend to calculate score
    this.subscriptions.push(
      this.sellerService.observableLoading.subscribe((ques) => {
        var obj = { responses: ques };
        this.subscriptions.push(
          this.sellerService
            .calculateScorePriceNudging(obj)
            .subscribe((data) => {
              this.score = data.responseData?.score;
              this.subscriptions.push(
                this.priceNudgeServ
                  .getConditionPriceNudging(this.varient.id)
                  .subscribe(
                    (res) => {
                      const conditionData = res.condition[0];
                      if (this.score >= 98 && this.score <= 100) {
                        this.condition =
                          conditionData?.like_new !== '0'
                            ? conditionData?.like_new
                            : '';
                        this.condition_ar =
                          conditionData?.like_new_ar !== '0'
                            ? conditionData?.like_new_ar
                            : '';
                      } else if (this.score >= 90 && this.score < 98) {
                        this.condition =
                          conditionData?.light_use !== '0'
                            ? conditionData?.light_use
                            : '';
                        this.condition_ar =
                          conditionData?.light_use_ar !== '0'
                            ? conditionData?.light_use_ar
                            : '';
                      } else if (this.score >= 75 && this.score < 90) {
                        this.condition =
                          conditionData?.good_condition !== '0'
                            ? conditionData?.good_condition
                            : '';
                        this.condition_ar =
                          conditionData?.good_condition_ar !== '0'
                            ? conditionData?.good_condition_ar
                            : '';
                      } else if (this.score >= 0 && this.score < 75) {
                        this.condition =
                          conditionData?.extensive_use !== '0'
                            ? conditionData?.extensive_use
                            : '';
                        this.condition_ar =
                          conditionData?.extensive_use_ar !== '0'
                            ? conditionData?.extensive_use_ar
                            : '';
                      }
                    },
                    (err) => console.log('err --> ', err)
                  )
              );
            })
        );
      })
    );
  }

  goBack() {
    if (!this.sellerService.saveAsDraftAction) {
      this._location.back();
    } else {
      this.router.navigate(['/question-answer'], {
        queryParams: { product: this.productId }
      });
    }
  }

  validateDescription() {
    this.validDescription = this.commonService.validateDescAndComment(
      this.description
    );
    this.validDescriptionPromo = this.commonService.validateDescAndCommentPromo(
      this.description
    );
  }

  async addProductPrice() {
    if (
      this.sell_price &&
      this.bid_price &&
      this.validDescription &&
      this.validDescriptionPromo &&
      this.expiryAfterInDays !== 0 &&
      this.isListedBefore !== 0
    ) {
      if (this.sell_price > this.maxSellerPrice) {
        this.commonService.presentAlert({
          header: await this.commonService.getTranslatedString(
            'alertPopUpTexts.sorry'
          ),
          message: await this.commonService.getTranslatedString(
            'labels.sellingPriceHigherThanMarketPrice'
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
        return;
      }
      if (Number(this.bid_price) >= Number(this.sell_price)) {
        this.commonService.presentAlert({
          header: await this.commonService.getTranslatedString(
            'alertPopUpTexts.sorry'
          ),
          message: await this.commonService.getTranslatedString(
            'alertPopUpTexts.bidPriceValidationBasisOfSellPrice'
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
        return;
      }
      if (this.amountConfig.totalAmount > this.varient?.currentPrice) {
        // bid price must be minimum 40% of sell price
        this.commonService.presentAlert({
          header: await this.commonService.getTranslatedString(
            'alertPopUpTexts.sorry'
          ),
          message: await this.commonService.getTranslatedString(
            'alertPopUpTexts.priceVsamount'
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
        return;
      }
      if (
        Number(this.bid_price) <
        Number((Number(this.sell_price) * 0.4).toFixed(2))
      ) {
        // bid price must be minimum 40% of sell price
        this.commonService.presentAlert({
          header: await this.commonService.getTranslatedString(
            'alertPopUpTexts.sorry'
          ),
          message: await this.commonService.getTranslatedString(
            'alertPopUpTexts.bidPriceValidation',
            { price: (Number(this.sell_price) * 0.4).toFixed(2) }
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
        return;
      }
      this.sellerService.uploadProductData.sell_price = this.sell_price;
      this.sellerService.uploadProductData.bid_price = this.bid_price;
      this.sellerService.uploadProductData.description = this.description;
      this.sellerService.uploadProductData.expiryAfterInDays =
        this.expiryAfterInDays;
      this.sellerService.uploadProductData.isListedBefore = this.isListedBefore;

      // check by regex user not written any phone number
      const regex =
        /([\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}[\u0660-\u0669\u06F0-\u06F90-9]{1,}[\.\=\÷\?\<\>\@\!\#\$\%\^\&\(\)\-\+\~\`\ \,\_\*\/\\]{0,}){6,}/g;
      const matching_regex = this.description.match(regex);
      if (matching_regex) {
        matching_regex.forEach((matchReg) => {
          this.description = this.description.replace(matchReg, ' ');
        });
        this.sellerService.uploadProductData.description = this.description;
      }

      firebase.analytics().logEvent('user_adds_item_price');
      this.router.navigate(['/pick-up-address']);
    }
  }

  onEnterSellPrice() {
    if (<HTMLInputElement>document.getElementById('Sell-Price')) {
      const sell = (<HTMLInputElement>document.getElementById('Sell-Price')).value;

      if (sell) {
        this.sell_price = Number((Number(sell)).toFixed(2));
        this.validProductSellPrice = this.sell_price > this.maxSellerPrice ? false : true;
        this.amountConfig = this.commonService.calculatePriceForBuyModal(
          { sell_price: this.sell_price },
          'calculate'
        );
      } else {
        this.amountConfig = this.commonService.calculatePriceForBuyModal(
          { sell_price: 0 },
          'calculate'
        );
      }
    }

    if (this.amountConfig.amount > 0) {
      if (this.appData && this.appData.start_bid_percentage) {
        this.bid_price = (
          this.sell_price *
          (this.appData.start_bid_percentage / 100)
        ).toFixed(2);
      }
      this.calculateAfterValidaityCoupon();
    }
  }

  openAmountConfigModal(amountConfigPopUp: any) {
    switch (amountConfigPopUp.style.display) {
      case 'block':
        amountConfigPopUp.style.display = 'none';
        break;

      case 'none':
        amountConfigPopUp.style.display = 'block';
        break;
    }
  }

  verifyCoupon() {
    this.waitingVerify = true;
    this.promoCodeValid = null;
    this.promoCodeInfo = null;

    this.subscriptions.push(
      this.promoServ.validatePromCode(this.promoCode, 'Seller', null).subscribe(
        (res) => {
          this.percentage = res.promocodeDate.percentage;
          this.valueDiscount = res.promocodeDate.discount;
          this.promoCodeInfo = res.promocodeDate;

          this.calculateAfterValidaityCoupon();
          this.promoCodeValid = true;
          this.waitingVerify = false;
        },
        (err) => {
          this.promoCodeValid = false;
          this.waitingVerify = false;
          this.promoCodeInfo = null;
          this.amountConfig.coupon = 0;
          this.sellerService.uploadProductData.sellerPromocodeId = null;
          this.sellerService.uploadProductData.sellerDiscount = 0;
        }
      )
    );
  }

  calculateAfterValidaityCoupon() {
    if (
      this.promoCodeInfo &&
      this.amountConfig &&
      this.amountConfig.amount > 0
    ) {
      const couponValue = this.promoCodeInfo?.percentage
        ? (this.promoCodeInfo?.percentage / 100) * this.amountConfig.amount
        : this.promoCodeInfo?.discount;
      this.amountConfig.coupon =
        couponValue > this.promoCodeInfo?.discount
          ? Number((this.promoCodeInfo?.discount).toFixed(2))
          : Number(couponValue.toFixed(2));
      this.amountConfig.totalAmount =
        this.amountConfig.totalAmount + Number(this.amountConfig.coupon);

      this.sellerService.uploadProductData.sellerPromocodeId =
        this.promoCodeInfo._id;
      this.sellerService.uploadProductData.sellerDiscount =
        this.amountConfig.coupon;
    }
  }

  removePromoCode() {
    this.promoCodeValid = null;
    this.waitingVerify = false;
    this.promoCodeInfo = null;
    this.amountConfig.coupon = 0;
    this.sellerService.uploadProductData.sellerPromocodeId = '';
    this.sellerService.uploadProductData.sellerDiscount = 0;
  }

  showmodal() {
    this.showModal = true;
    this.openSuccesbidModal();
  }
  showSetExpired() {
    this.showExpiry = true;
    this.showExpireModal();
  }
  setDate(date) {
    this.expiryAfterInDays = date;
  }
  showExpireModal() {
    this.modalService.openSetExpiry({
      value: true
    });
  }
  // function to calculate commession if exist code
  calculateCommsissionExistCode(commission: any, coupon: any) {
    let res: any = 0;
    if (coupon >= commission) {
      res = 0;
    } else {
      res = commission - coupon;
    }

    return res;
  }

  // function to caluculate vat if exist code
  calculateVatExistCode(commission: any, coupon: any) {
    let commision = this.calculateCommsissionExistCode(commission, coupon);
    return Number(Number(commision * this.vatPercentage).toFixed(2));
  }
  calculateVat(){
    if(this.userDetails?.isKeySeller){
      return Number(Number(this.amountConfig.commission_seller_key * this.vatPercentage ).toFixed(2));

    }
    else{
      return Number(Number(this.amountConfig.commission_seller * this.vatPercentage ).toFixed(2));

    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  openSaveAsDraftModal() {
    if (this.productId) {
      this.sellerService.sendques(this.answersList);
      this.sellerService.selectedProductId = this.product._id;
    } else {
      this.sellerService.sendques(this.sellerService.tempSelectedResList);
    }
    const sell = (<HTMLInputElement>document.getElementById('Sell-Price'))
      .value;
    if (sell) {
      this.sellerService.uploadProductData.sell_price = sell;
    }
    this.sellerService.uploadProductData.bid_price = this.bid_price;
    this.sellerService.uploadProductData.isListedBefore = this.isListedBefore;
    this.sellerService.uploadProductData.expiryAfterInDays =
      this.expiryAfterInDays;
    this.sellerService.uploadProductData.description = this.description;

    this.modalService.openSaveAsDraftModal({
      value: true
    });
  }

  getPopupModal(modal) {
    switch (modal) {
      case 'saveAsDraft':
        this.showSaveAsDraftConfirm = true;
        this.openSaveAsDraftModal();
        break;
    }
  }

  getCategory(categoryId: string) {
    return this.homeService.getCategory(categoryId).then(async (data) => {
      if (data) {
        data.responseData.category_id = data.responseData._id;
        return data.responseData;
      }
    });
  }

  getBrand(brandId: string) {
    return this.homeService.getBrand(brandId).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  getModel(modelId: string) {
    return this.homeService.getModel(modelId).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  getVariant(variantId: string) {
    return this.homeService.getVariant(variantId).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  getQuestion() {
    this.subscriptions.push(
      this.sellerService.getQuestionnaires().subscribe(
        (ques) => {
          this.questionsList = ques.responseData[0].questions || [];
        },
        (err) => {
          this.router.navigate(['/select-devices']);
        }
      )
    );
  }

  getResponse() {
    this.subscriptions.push(
      this.sellerService.getAnswersToProduct(this.productId).subscribe(
        (data) => {
          this.response = data.responseData || [];
          if (this.response.length > 0) {
            this.sellerService.savedResponseId = this.response[0].response_id;
            this.mappingSelectedQuestion();
          }
        },
        (err) => {
          console.log(err);
        }
      )
    );
  }

  mappingSelectedQuestion() {
    for (let i = 0; i < this.questionsList?.length; i++) {
      const quesType = this.questionsList[i].type;
      const questionId = this.questionsList[i]._id;
      if (quesType === 'yes-no-without-options') {
        const selectedQues = this.response.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const answerId = selectedQues.answers[0]?.answer_id;
        if (!answerId) {
          continue;
        }
        this.questionsList[i].answers.map((a) => {
          if (a._id === answerId) {
            a.selected = true;
          }
          return a;
        });
        const newobj = {
          question_id: questionId,
          answer_ids: [
            {
              answer_id: answerId
            }
          ]
        };

        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        this.answersList.push(newobj);
      }
      if (quesType === 'yes-no-with-options') {
        const selectedQues = this.response.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const answerId = selectedQues.answers[0]?.answer_id;
        if (!answerId) {
          continue;
        }
        let indexAnswer = 0;
        this.questionsList[i].answers.map((a, index) => {
          if (a._id === answerId) {
            a.selected = true;
            indexAnswer = index;
          }
          return a;
        });
        const updateSubChoices = [];
        const subChoices = selectedQues.answers[0].sub_choices || [];
        for (const choice of subChoices) {
          const subChoiceId = choice?.choice_id;
          if (subChoiceId) {
            this.questionsList[i].answers[indexAnswer].sub_choices.map((c) => {
              if (c._id === subChoiceId) {
                c.selected = true;
              }
              return c;
            });
            updateSubChoices.push(subChoiceId);
          }
        }
        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        const newobj = {
          question_id: questionId,
          answer_ids: [
            {
              answer_id: answerId,
              sub_choices: updateSubChoices
            }
          ]
        };
        this.answersList.push(newobj);
      }
      if (quesType === 'dropdown') {
        const selectedQues = this.response.find(
          (q) => q.question_id === questionId
        );
        if (!selectedQues) {
          continue;
        }
        const choiceId = selectedQues.choices[0]?.choice_id;
        if (!choiceId) {
          continue;
        }
        this.questionsList[i].choices.map((c) => {
          if (c._id === choiceId) {
            c.selected = true;
          }
          return c;
        });
        const newobj = {
          question_id: questionId,
          choices: [choiceId]
        };
        this.answersList = this.answersList.filter(
          (itemInArray) => itemInArray.question_id !== questionId
        );
        this.answersList.push(newobj);
      }
    }
    this.sellerService.tempSelectedResList = this.answersList;
  }

  getProductDetail() {
    this.sellerService.uploadProductData.product_images = [];
    this.commonService.presentSpinner();
    this.sellerService.saveAsDraftAction = true;
    this.homeService.getSpecificProduct(this.productId).then(async (res) => {
      if (res && res.responseData) {
        this.product = res.responseData.result;
        if (this.product.product_images.length > 0) {
          this.sellerService.uploadProductData.product_images =
            this.product.product_images;
          this.sellerService.uploadProductData.product_images_url =
            this.product.product_images;
        }

        this.sellerService.selectedProductId = this.product._id;
        this.sellerService.uploadProductData.category_id = this.product.category._id;
        this.sellerService.selectedDevice = await this.getCategory(this.product.category._id);
        this.sellerService.selectedDevice.category_id = this.product.category._id;
        localStorage.setItem('selectedDevice', JSON.stringify(this.sellerService.selectedDevice));
        await this.getQuestion();
        await this.getResponse();
        this.commonService.dismissSpinner();

        this.sellerService.uploadProductData.brand_id = this.product.brands._id;
        this.sellerService.selectedBrand = await this.getBrand(this.product.brands._id);
        this.sellerService.selectedBrand.brand_id = this.product.brands._id;
        localStorage.setItem('selectedBrand', JSON.stringify(this.sellerService.selectedBrand));

        this.sellerService.uploadProductData.model_id = this.product.models._id;
        this.sellerService.selectedModel = await this.getModel(this.product.models._id);

        this.sellerService.uploadProductData.varient_id = this.product.varients._id;
        this.sellerService.uploadProductData.varient = this.product.varients.varient; // This varient.varient is NOT clear.
        this.sellerService.uploadProductData.varient_ar = this.product.varients.varient_ar; // This varient.varient is NOT clear.
        this.sellerService.selectedVarient = await this.getVariant(this.product.varients._id);
        this.varient = this.sellerService.selectedVarient;
        this.sellerService.selectedVarient.attributes = JSON.parse(this.product.variant_attributes_selections);
        localStorage.setItem('selectedVarient', JSON.stringify(this.sellerService.selectedVarient))}

        (<HTMLInputElement>document.getElementById('Sell-Price')).value = this.product.sell_price;
        this.onEnterSellPrice();

        this.sellerService.uploadProductData.bid_price = this.bid_price = this.product.bid_price;
        this.sellerService.uploadProductData.isListedBefore = this.isListedBefore = this.product.isListedBefore ? 'yes' : 'no';
        this.sellerService.uploadProductData.description = this.description = this.product.description;

        const expiredDate = moment(this.product.expiryDate, 'YYYY-MM-DD');
        const createdDate = moment(this.product.createdDate, 'YYYY-MM-DD');
        this.sellerService.uploadProductData.expiryAfterInDays =
          this.expiryAfterInDays = expiredDate.diff(createdDate, 'days');

        if (this.product.promocode) {
          this.promoCode = this.product.promocode.code;
          this.verifyCoupon();
        }
      }
    );
  }

  calculateMaxPriceForListingProduct() {
    let deviceCatID = JSON.parse(localStorage.getItem('selectedDevice'));
    let varientID = JSON.parse(localStorage.getItem('selectedVarient'));
    const currentMarketPrice = varientID?.currentPrice;
    this.sellerService.getModelSummartByCategoryID(deviceCatID.category_id).subscribe(res => {
      if(res && res?.status === "success" && res?.responseData?.length > 0) {
        const maxPercentage = res?.responseData[0]?.maxPercentage;
        this.maxSellerPrice = currentMarketPrice - (currentMarketPrice * maxPercentage / 100);
        return;
      }
      this.maxSellerPrice = currentMarketPrice - (currentMarketPrice * 5 / 100);
    })
  }
}
