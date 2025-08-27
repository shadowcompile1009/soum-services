import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BuyPayload } from 'src/app/services/buy/buy.service';
import {
  BuyModalPrice,
  CommonService
} from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';
import { BuyProductData } from 'src/app/services/modal/modal.service';
import firebase from 'firebase';
import { PromoService } from 'src/app/services/promoCode-service/promo.service';
import { Subscription } from 'rxjs';
import { HomeService } from 'src/app/services/home/home.service';
import { BuyPayloadWhenBidAcceptednew } from '../../services/buy/buy.service';
import { PopupNewAddressComponent } from '../popup-new-address/popup-new-address.component';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from './../../services/profile/profile.service';

@Component({
  selector: 'buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.scss']
})
export class BuyModalComponent {
  product: any;
  productDetailsInfo: any;
  showModal: boolean;
  amountConfigForBuy: BuyModalPrice;

  bidAccepted: boolean;
  bid_id: string;
  address: any;
  promoCode: any = '';
  promoCodeValid: any = null;
  promoCodeInfo: any;
  waitingVerify: boolean = false;
  subscriptions: Subscription[] = [];
  calculationProduct: any = null;
  originalProduct: any = null;
  commissionDiscount: number = 0;
  devicePriceDiscount: number = 0;
  productIdWhenOpenModal: any;
  empty: boolean = false;
  userAddress: any;

  constructor(
    private router: Router,
    private storage: StorageService,
    private commonService: CommonService,
    private eventService: EventsService,
    private promoServ: PromoService,
    private homeService: HomeService,
    private dialog: MatDialog,
    private profileServ: ProfileService
  ) {
    this.triggerOpenModalEvent();
    this.getNewUserAddress();
  }

  triggerOpenModalEvent() {
    this.eventService.subscribe(
      EventsKey.openBuyModal,
      (data: BuyProductData) => {
        this.productIdWhenOpenModal = data?.product?._id;

        this.product = data.product || {};
        this.amountConfigForBuy = data.amountConfigForBuy;
        this.productDetailsInfo =
          data?.product?.bidding &&
          data?.product?.bidding[data.product.bidding.length - 1]?.bid_status ==
            'accepted'
            ? data.product.bidding[data.product.bidding.length - 1]
            : null;

        this.address = this.userAddress || {};
        this.showModal = true;

        this.getProductCalculationPrice();

        if (data.bidAccepted) {
          this.bidAccepted = data.bidAccepted;
          this.bid_id = data.bid_id;
        } else {
          this.bidAccepted = false;
          this.bid_id = '';
        }
      }
    );
  }

  hideBuyModal() {
    this.product = null;
    this.showModal = false;
  }

  onAddressChange(event) {
    if (event == 'add') {
      if (this.bidAccepted) {
        this.product.bidAccepted = this.bidAccepted;
      }
      this.storage.set(storageKeys.productToBuy, this.product);
      this.router.navigate(['/profile/add-address']);
    }
  }

  async buyProduct() {
    const existAddress = this.commonService.checkExistAddress();
    if (!existAddress) {
      this.hideBuyModal();
      this.dialog.open(PopupNewAddressComponent);
      return;
    }
    if (!this.address) {
      this.commonService.presentAlert({
        header: await this.commonService.getTranslatedString(
          'alertPopUpTexts.noAddressSelected'
        ),
        message: await this.commonService.getTranslatedString(
          'alertPopUpTexts.selectAddress'
        ),
        button1: {
          text: 'Ok',
          handler: () => {
            this.router.navigate(['/profile/add-address']);
          }
        }
      });
      return;
    }
    let payload = new BuyPayload({
      address_id: this.address._id || {},
      buy_amount: this.amountConfigForBuy.amount.toString(),
      product_id: this.product._id || this.product.product_id,
      commission: this.amountConfigForBuy.commission.toString(),
      grand_total: this.amountConfigForBuy.totalAmount.toString(),
      vat: this.amountConfigForBuy.VAT.toString(),
      shipping_charge: this.amountConfigForBuy.shippingCharges.toString()
    });

    if (!this.commonService.isLoggedIn) {
      this.commonService.loginRequested = {
        commands: [
          '/payment-options',
          this.product._id || this.product.product_id,
          'buy'
        ],
        extras: {
          state: {
            payload: payload,
            user_id: this.product.user_id,
            type: 'buy'
          }
        }
      };
      this.router.navigate(['/login/continue']);
      return;
    }
    firebase.analytics().logEvent('user_buys_item');

    this.router.navigate(
      ['/payment-options', this.product._id || this.product.product_id, 'buy'],
      { state: { payload: payload } }
    );
    this.hideBuyModal();
  }

  async buyProductWhenBidAccepted() {
    const existAddress = this.commonService.checkExistAddress();
    if (!existAddress) {
      this.hideBuyModal();
      this.dialog.open(PopupNewAddressComponent);
      return;
    }

    if (!this.address) {
      this.commonService.presentAlert({
        header: await this.commonService.getTranslatedString(
          'alertPopUpTexts.noAddressSelected'
        ),
        message: await this.commonService.getTranslatedString(
          'alertPopUpTexts.selectAddress'
        ),
        button1: {
          text: 'Ok',
          handler: () => {
            this.empty = true;
          }
        }
      });
      return;
    }

    let payload = new BuyPayloadWhenBidAcceptednew({
      address_id: this.address._id,
      productId: this.product._id || this.product.product_id,
      bidId: this.bid_id,
      buyerPromocodeId: this.promoCodeInfo ? this.promoCodeInfo._id : null,
      actionType: 'buyWithBid'
    });

    this.router.navigate(
      [
        '/payment-options',
        this.product._id || this.product.product_id,
        'bid-accepted'
      ],
      { state: { payload: payload } }
    );
    this.hideBuyModal();
  }

  // function to calucalte commission, vat, charging, sell price, totalPrice
  getProductCalculationPrice() {
    this.homeService
      .getProductCalculationPrice(
        this.product?.bid_id,
        this.productIdWhenOpenModal,
        '',
        'buyWithBid',
        this.product?.bid_price
      )
      .subscribe(
        (res) => {
          this.calculationProduct = res?.sellData;
          this.originalProduct = res?.sellData;
        },
        (error) => {
          this.commonService.errorHandler(error);
        }
      );
  }

  verifyCoupon() {
    this.waitingVerify = true;
    this.promoCodeValid = null;
    this.promoCodeInfo = null;
    this.subscriptions.push(
      this.promoServ
        .validatePromCode(this.promoCode, 'Buyer', this.product._id)
        .subscribe(
          (data) => {
            const promoCodeID = data?.promocodeDate?._id;
            // calculate data product prices if promo code exist
            this.homeService
              .getProductCalculationPrice(
                this.product?.bid_id,
                this.productIdWhenOpenModal,
                promoCodeID,
                'buyWithBid',
                this.product?.bid_price
              )
              .subscribe(
                (res) => {
                  this.calculationProduct = res?.discountData;
                  const oldCommission = res?.sellData?.commission;
                  if (res?.discountData?.disValue <= oldCommission) {
                    this.commissionDiscount = res?.discountData?.disValue;
                    this.devicePriceDiscount = 0;
                  } else {
                    this.commissionDiscount = oldCommission;
                    this.devicePriceDiscount =
                      res?.discountData?.disValue - this.commissionDiscount;
                  }
                  this.promoCodeValid = true;
                },
                (error) => {
                  this.promoCodeValid = false;
                  this.waitingVerify = false;
                  this.promoCodeValid = null;
                  this.promoCodeInfo = null;
                  this.productDetailsInfo.coupon = 0;
                  this.commissionDiscount = 0;
                  this.devicePriceDiscount = 0;
                  this.getProductCalculationPrice();
                  this.commonService.errorHandler(error);
                }
              );

            this.promoCodeInfo = data.promocodeDate;
            this.waitingVerify = false;
          },
          (err) => {
            this.promoCodeValid = false;
            this.waitingVerify = false;
            this.promoCodeInfo = null;
            this.productDetailsInfo.coupon = 0;
            this.getProductCalculationPrice();
            this.commissionDiscount = 0;
            this.devicePriceDiscount = 0;
          }
        )
    );
  }

  convertStringToNumber(value) {
    return Number(Number(value).toFixed(2));
  }

  getNewUserAddress() {
    this.profileServ.getNewUserAddress();
    this.userAddress = JSON.parse(localStorage.getItem('userAddress')) || null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
