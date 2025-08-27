import { Injectable } from '@angular/core';
import { BuyModalPrice } from '../common/common.service';
import { EventsKey } from '../core/events/events-key.constant';
import { EventsService } from '../core/events/events.service';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private eventService: EventsService) {}
  openReferralModal(data: any) {
    this.eventService.publish(EventsKey.openReferralCode, data);
  }

  openModalGrade(data) {
    this.eventService.publish(EventsKey.openGrade, data);
  }
  openCancelListing(data) {
    this.eventService.publish(EventsKey.openCancel, data);
  }
  openSaveAsDraftModal(data) {
    this.eventService.publish(EventsKey.onSaveAsDraftModal, data);
  }
  openDeleteListingModal(data) {
    this.eventService.publish(EventsKey.openDeleteModal, data);
  }
  openSetExpiry(data) {
    this.eventService.publish(EventsKey.openSetExpire, data);
  }
  openBuy(data) {
    this.eventService.publish(EventsKey.openbuyInfo, data);
  }
  openBid(data) {
    this.eventService.publish(EventsKey.openbidInfo, data);
  }

  openSellModal(data) {
    this.eventService.publish(EventsKey.openSellModal, data);
  }
  openLoginModal(data) {
    this.eventService.publish(EventsKey.openLoginModal, data);
  }
  openPhotoModal(data) {
    this.eventService.publish(EventsKey.openPhotoModal, data);
  }
  openOptionModal(data) {
    this.eventService.publish(EventsKey.showOptions, data);
  }
  proceedToBidSuccess(data: any) {
    this.eventService.publish(EventsKey.openSuccessBid, data);
  }
  proceedToBuy(buyProductData: BuyProductData) {
    this.eventService.publish(EventsKey.openBuyModal, buyProductData);
  }

  proceedToBid(bidProductData: BidProductData) {
    this.eventService.publish(EventsKey.openBidModal, bidProductData);
  }
  openSetBattery(data) {
    this.eventService.publish(EventsKey.openSetBattery, data);
  }
  openExpiryModel(data) {
    this.eventService.publish(EventsKey.openExpiryModels, data);
  }

  openDeleteItem(data) {
    this.eventService.publish(EventsKey.openDeleteItem, data);
  }
}

export interface BuyProductData {
  product: any;
  amountConfigForBuy: BuyModalPrice;
  // addresses: any;
  address: any;
  // selectedAddress: string;
  bidAccepted?: boolean;
  bid_id?: string;
}

export interface BidProductData {
  product: any;
  cardList: Array<any>;
  selectedCard;
}
