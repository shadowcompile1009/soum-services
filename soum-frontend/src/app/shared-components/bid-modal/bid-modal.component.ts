import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output
} from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { HomeService, PutBid } from 'src/app/services/home/home.service';
import {
  BidProductData,
  ModalService
} from 'src/app/services/modal/modal.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import firebase from 'firebase';
import { Subscription } from 'rxjs';
import { PopupNewAddressComponent } from '../popup-new-address/popup-new-address.component';
import { MatDialog } from '@angular/material/dialog';

declare var $: any;
@Component({
  selector: 'bid-modal',
  templateUrl: './bid-modal.component.html',
  styleUrls: ['./bid-modal.component.scss']
})
export class BidModalComponent implements OnInit {
  product: any;
  showModal: boolean;
  cardList: Array<any> = [];
  bidPrice: string;
  amountToBeHeld = { amountToHold: 0 };
  cvv: string;
  paymentCard: string = '';
  cardType: string = '';
  @Output() refresh = new EventEmitter();
  amountConfig: BuyModalPrice;
  oops: string;
  sorry: string;
  profileData: any;
  bidCannotBeEqualToCurrentPrice: string;
  bidCannotBeLessThanPrice: string;
  bidCannotBeEqualToGreaterThanCurrentPrice: string;
  bidValueLessThanCurrentBid: boolean = false;
  bidValueMoreThanCurrentBid: boolean = false;
  bidValueEqualCurrentBid: boolean = false;
  bidValueIsValidToBid: boolean = false;
  subscriptions: Subscription[] = [];
  empty: boolean = false;

  homeService: HomeService;
  commonService: CommonService;
  storage: StorageService;
  modalService: ModalService;
  profileService: ProfileService;
  translate: TranslateService;

  commonSettings;
  constructor(
    private router: Router,
    private eventService: EventsService,
    private injector: Injector,
    private dialog: MatDialog
  ) {
    this.homeService = this.injector.get<HomeService>(HomeService);
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.modalService = this.injector.get<ModalService>(ModalService);
    this.profileService = this.injector.get<ProfileService>(ProfileService);
    this.translate = this.injector.get<TranslateService>(TranslateService);

    this.triggerOpenModalEvent();
  }

  async ngOnInit() {
    this.oops = await this.commonService.getTranslatedString(
      'alertPopUpTexts.oops'
    );
    this.sorry = await this.commonService.getTranslatedString(
      'alertPopUpTexts.sorry'
    );
    this.bidCannotBeEqualToCurrentPrice =
      await this.commonService.getTranslatedString(
        'alertPopUpTexts.bidCannotBeEqualToCurrentBidPrice'
      );
    this.bidCannotBeLessThanPrice =
      await this.commonService.getTranslatedString(
        'alertPopUpTexts.bidCannotBeLessThanBidPrice'
      );
    this.bidCannotBeEqualToGreaterThanCurrentPrice =
      await this.commonService.getTranslatedString(
        'alertPopUpTexts.bidCannotBeEqualToGreaterThanCurrentPrice'
      );
    this.subscriptions.push(
      this.profileService.observableprofile.subscribe((sett) => {
        this.profileData = sett;
      })
    );
    this.subscriptions.push(
      this.commonService.observableSett.subscribe((settings) => {
        this.commonSettings = settings;
      })
    );
  }

  triggerOpenModalEvent() {
    this.eventService.subscribe(
      EventsKey.openBidModal,
      (data: BidProductData) => {
        this.product = data.product;
        this.cardList = data.cardList || [];
        this.showModal = true;
        this.paymentCard = data.selectedCard;
        if (this.paymentCard) {
          let selectedCard = this.cardList.find((card) => {
            return card.cardId == this.paymentCard;
          });
          this.cardType = selectedCard.cardType;
        } else {
          this.cardType = '';
        }
      }
    );
  }

  hideBidModal() {
    this.product = null;
    this.showModal = false;
    this.bidPrice = '';
    this.cvv = '';
    this.paymentCard = '';
    this.amountConfig = this.commonService.calculatePriceForBuyModal(
      { sell_price: 0 },
      'reset'
    );
    this.amountToBeHeld = { amountToHold: 0 };
  }

  async checkBidPrice() {
    return true;
  }

  async biddingAlert(header: string, message: string) {
    this.commonService.presentAlert({
      header: header,
      message: message,
      button1: {
        text: await this.commonService.getTranslatedString(
          'alertPopUpTexts.ok'
        ),
        handler: () => {
          this.empty = true;
        }
      }
    });
  }

  async putBid() {
    if (this.bidPrice) {
      if (Number(this.bidPrice) == Number(this.product.current_bid_price)) {
        this.biddingAlert(this.oops, this.bidCannotBeEqualToCurrentPrice);
        return;
      } else if (
        Number(this.bidPrice) < Number(this.product.current_bid_price)
      ) {
        this.biddingAlert(this.oops, this.bidCannotBeLessThanPrice);
        return;
      } else if (
        Number(this.bidPrice) >=
        Number(this.getOverAllPrice(this.product).totalAmount)
      ) {
        this.biddingAlert(
          await this.commonService.getTranslatedString('alertPopUpTexts.sorry'),
          this.bidCannotBeEqualToGreaterThanCurrentPrice
        );
        return;
      }
    } else {
      return;
    }
    firebase.analytics().logEvent('user_bids_item');
    let payload = new PutBid({
      bid_price: this.bidPrice,
      product_id: this.product._id || this.product.product_id,
      commission: this.amountConfig.commission.toString() || '',
      grand_total: this.amountConfig.totalAmount.toString() || '',
      shipping_charge: this.amountConfig.shippingCharges.toString() || '',
      vat: this.amountConfig.VAT.toString() || '',
      bidding_amount: this.amountToBeHeld.amountToHold.toString() || ''
    });

    this.validationBidPrice(payload);
  }

  validationBidPrice(payload: PutBid) {
    this.commonService.presentSpinner();
    this.homeService.validateBidPrice(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        const existAddress = this.commonService.checkExistAddress();
        if (!existAddress) {
          this.showModal = false;
          this.dialog.open(PopupNewAddressComponent);
          return;
        }
        if (res) {
          if (Number(payload.bidding_amount)) {
            this.router.navigate(
              [
                '/payment-options',
                this.product._id || this.product.product_id,
                'bid'
              ],
              { state: { payload: payload } }
            );
            this.hideBidModal();
          } else {
            this.commonService.presentSpinner();
            this.homeService.putBid(payload).then(async (data) => {
              this.commonService.dismissSpinner();
              if (data) {
                this.biddingAlert(
                  await this.commonService.getTranslatedString(
                    'alertPopUpTexts.congratulations'
                  ),
                  await this.commonService.getTranslatedString(
                    'alertPopUpTexts.bidAdded',
                    { bidPrice: this.bidPrice }
                  )
                );

                this.hideBidModal();
                this.refresh.emit(true);
              }
            });
          }
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }

  showBuyPopup() {
    this.modalService.proceedToBuy({
      product: this.product,
      // "addresses": this.profileService.addresses,
      address: this.profileData.address ? this.profileData.address : null,
      amountConfigForBuy: this.commonService.calculatePriceForBuyModal(
        this.product,
        'calculate'
      )
      // "selectedAddress": selectedAddress
    });
    this.showModal = false;
  }

  getOverAllPrice(product): BuyModalPrice {
    return this.commonService.calculatePriceForBuyModal(product, 'calculate');
  }

  onValueChange(amount: number) {
    // checkValidityBid added by @naeeim 23-6-2021

    this.bidValueLessThanCurrentBid = false;
    this.bidValueMoreThanCurrentBid = false;
    this.bidValueEqualCurrentBid = false;
    this.bidValueIsValidToBid = false;

    if (
      this.bidPrice !== null &&
      JSON.parse(this.bidPrice) !== 0 &&
      this.bidPrice !== ''
    ) {
      if (
        this.bidPrice !== '' &&
        JSON.parse(this.bidPrice) < this.product?.current_bid_price
      ) {
        this.bidValueLessThanCurrentBid = true;
      } else if (
        this.bidPrice !== '' &&
        JSON.parse(this.bidPrice) >
          this.getOverAllPrice(this.product)?.totalAmount
      ) {
        this.bidValueMoreThanCurrentBid = true;
      } else if (
        this.bidPrice !== '' &&
        JSON.parse(this.bidPrice) == this.product?.current_bid_price
      ) {
        this.bidValueEqualCurrentBid = true;
      } else if (
        this.bidPrice !== '' &&
        !this.bidValueLessThanCurrentBid &&
        !this.bidValueMoreThanCurrentBid &&
        !this.bidValueEqualCurrentBid
      ) {
        this.bidValueIsValidToBid = true;
      }
    }

    this.amountConfig = this.commonService.calculatePriceForBuyModal(
      { sell_price: Number(amount) },
      'calculate'
    );
    this.amountToBeHeld = {
      amountToHold: this.commonService.appSetting.bidding_amount
    };
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
    return true;
  }

  onCardSelect(event) {
    let selectedCardId = event.target.value;
    if (selectedCardId === 'newCard') {
      this.storage.set(storageKeys.productToBid, this.product);
      this.router.navigate(['/profile/add-card']);
    } else {
      let selectedCard = this.cardList.find((card) => {
        return card.cardId === selectedCardId;
      });
      this.cardType = selectedCard.cardType;
    }
  }

  onCardChange(event) {
    if (event == 'add') {
      this.storage.set(storageKeys.productToBuy, this.product);
      this.router.navigate(['/profile/add-address']);
    }
  }

  // AmountConfig Popup
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
