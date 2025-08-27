import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';

@Component({
  selector: 'app-buy-info',
  templateUrl: './buy-info.component.html',
  styleUrls: ['./buy-info.component.scss']
})
export class BuyInfoComponent implements OnInit {
  showSecond = false;
  showThird = false;
  showModal = true;
  showFirst = true;
  showThanks = false;
  empty = false;

  constructor(
    private router: Router,
    private storage: StorageService,
    private commonService: CommonService,
    private eventService: EventsService
  ) {}
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openbuyInfo, (data: any) => {
      this.showModal = true;
    });
  }
  goNextForth() {
    this.empty = true;
  }
  goNextThird() {
    this.showSecond = false;
    this.showFirst = false;
    this.showThird = true;
  }
  goNextSecond() {
    this.showSecond = true;
    this.showFirst = false;
  }
  gobackFirst() {
    this.showSecond = false;
    this.showFirst = true;
    this.showThird = false;
  }
  gobackSecond() {
    this.showSecond = true;
    this.showFirst = false;
    this.showThird = false;
  }
  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }
  hideBidModal() {
    this.showModal = false;
  }
  navigateTo(route: string) {
    if (route === '/select-devices') {
      const savedData = this.storage.getSavedData();
      if (
        savedData &&
        savedData[storageKeys.userDetails] &&
        this.commonService.isLoggedIn
      ) {
        this.router.navigate([route]);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/products']);
    }
  }
}
