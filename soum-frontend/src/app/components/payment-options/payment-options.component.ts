import { Platform } from '@angular/cdk/platform';
import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { BuyService } from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';
import { HomeService } from 'src/app/services/home/home.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-payment-options',
  templateUrl: './payment-options.component.html',
  styleUrls: ['./payment-options.component.scss']
})
export class PaymentOptionsComponent implements OnInit {
  cards: Array<any> = [
    { name: 'MADA', type: 'MADA', selected: false },
    { name: 'Master VISA', type: 'VISA_MASTER', selected: false },
    { name: 'STC PAY', type: 'STC_PAY', selected: false },
    { name: 'Tabby', type: 'TABBY', selected: false }
  ];

  PaymentOptions;
  product_id: any;
  selectedCard: string;
  cvv: string;
  payload: any;
  payment_type: 'bid' | 'buy' | 'bid-accepted';
  productPrice: any = 0;
  showModal = false;
  // previousUrl: string;
  subscriptions: Subscription[] = [];

  translate: TranslateService;
  bidsAndItemService: BidsAndItemsService;
  homeService: HomeService;
  commonService: CommonService;
  buyService: BuyService;
  profileService: ProfileService;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private platform: Platform,
    private injector: Injector
  ) {
    this.translate = this.injector.get<TranslateService>(TranslateService);
    this.bidsAndItemService =
      this.injector.get<BidsAndItemsService>(BidsAndItemsService);
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.buyService = this.injector.get<BuyService>(BuyService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);

    if (this.platform.SAFARI) {
      const temp = this.cards.pop();
      this.cards.push({ name: 'APPLE PAY', type: 'APPLEPAY', selected: false });
      this.cards.push(temp);
    }

    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        if (params) {
          this.product_id = params.product_id;
          this.payment_type = params.type;
          this.productPrice = params.price;
          if (this.payment_type == 'bid') this.cards.pop();
        } else {
          this._location.back();
        }
      })
    );
    let state = this.router.getCurrentNavigation().extras.state;
    if (state && state.payload) {
      this.payload = state.payload;
    } else {
      this._location.back();
    }
  }

  ngOnInit(): void {
    this.bidsAndItemService.sendRouter(false);
    window['dataLayer'] = window['dataLayer'] || [];
    const LayerData = {
      event: 'view_payment'
    };
    window['dataLayer'].push(LayerData);
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Payment-options'
    };
    window['dataLayer'].push(productGTM);
    this.getPaymentOptions();
  }

  getPaymentOptions() {
    let appSetting = JSON.parse(sessionStorage.getItem('appSetting'));
    this.PaymentOptions = {
      MADA: appSetting && appSetting.MADA,
      VISA_MASTER: appSetting && appSetting.VISA_MASTER,
      APPLEPAY: appSetting && appSetting.APPLEPAY,
      STC_PAY: appSetting && appSetting.STC_PAY,
      Tabby: appSetting && appSetting.Tabby
    };
    this.filterOptions();
  }

  filterOptions() {
    let newCards = this.cards;
    if (this.PaymentOptions && this.PaymentOptions.MADA && !this.PaymentOptions.MADA.includes('Web')) {
      newCards = newCards.filter((option) => option['type'] !== 'MADA');
    }
    if (!this.PaymentOptions.VISA_MASTER.includes('Web')) {
      newCards = newCards.filter((option) => option['type'] !== 'VISA_MASTER');
    }
    if (!this.PaymentOptions.APPLEPAY.includes('Web')) {
      newCards = newCards.filter((option) => option['type'] !== 'APPLEPAY');
    }
    if (!this.PaymentOptions.STC_PAY.includes('Web')) {
      newCards = newCards.filter((option) => option['type'] !== 'STC_PAY');
    }
    if (!this.PaymentOptions.Tabby.includes('Web')) {
      newCards = newCards.filter((option) => option['type'] !== 'TABBY');
    }
    this.cards = newCards;
  }

  getCards() {
    this.profileService.getCards().then((res) => {
      if (res && res.cardList) {
        this.cards = res.cardList;
        this.selectedCard = this.cards[0].cardId;
        this.cards[this.cards.length] = { name: 'addNew', selected: false };
        this.cards.forEach((card) => {
          card.selected = false;
        });
        this.cards[0].selected = true;
      } else {
        this.cards = [];
        this.cards[this.cards.length] = { name: 'addNew', selected: false };
      }
      // console.log(this.cards)
    });
  }

  onCardChange(event, index) {
    if (event == 'addNew') {
      //write your code here
    }
    for (let i = 0; i < this.cards.length; i++) {
      if (i == index) {
        this.cards[i].selected = true;
      } else {
        this.cards[i].selected = false;
      }
    }
  }

  goBack() {
    this.router.navigate(['/product-detail'], {
      queryParams: { product: this.product_id }
    });
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  onContinue() {
    firebase.analytics().logEvent('user_chooses_payment_option');
    window['dataLayer'] = window['dataLayer'] || [];
    const bidLayerData = {
      event: 'chooses_payment'
    };
    window['dataLayer'].push(bidLayerData);
    switch (this.payment_type) {
      case 'bid':
        this.bidProduct();
        break;

      case 'buy':
        this.buyProduct();
        break;

      case 'bid-accepted':
        this.buyProductWhenBidAccepted();
        break;
    }
  }

  buyProduct() {
    this.payload.paymentType = this.selectedCard;
    localStorage.setItem('paymentType', this.payload.paymentType);
    this.commonService.presentSpinner();
    this.buyService.buyProduct(this.payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          if (this.payload.paymentType != 'TABBY') {
            this.router.navigate([
              '/pay',
              res.order_id,
              this.product_id,
              res.checkout_id,
              this.selectedCard,
              'buy'
            ]);
          } else {
            //  window.open(`${environment.tabby.checkoutUrl}/?sessionId=${res.checkout_id}&apiKey=${environment.tabby.apiKey}&product=installments&merchantCode=${environment.tabby.merchantCode}`,"_self")
          }
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }

  bidProduct() {
    this.payload.payment_type = this.selectedCard;
    this.commonService.presentSpinner();
    localStorage.setItem('bidValue', this.payload.bid_price);
    this.homeService.putBid(this.payload).then(async (res) => {
      this.commonService.dismissSpinner();
      if (res) {
        this.router.navigate([
          '/pay',
          res.bid_id,
          this.product_id,
          res.checkout_id,
          this.selectedCard,
          'bid'
        ]);
      }
    });
  }

  buyProductWhenBidAccepted() {
    if (!this.payload) {
      this.goBack();
      return;
    }

    this.payload.paymentType = this.selectedCard;
    this.commonService.presentSpinner();
    this.buyService.buyProductWhenBidAccepted(this.payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.router.navigate([
            '/pay',
            res.order_id,
            this.product_id,
            res.checkout_id,
            this.selectedCard,
            'bid-accepted'
          ]);
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
