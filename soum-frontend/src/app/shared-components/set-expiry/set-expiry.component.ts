import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';

@Component({
  selector: 'app-set-expiry',
  templateUrl: './set-expiry.component.html',
  styleUrls: ['./set-expiry.component.scss']
})
export class SetExpiryComponent implements OnInit {
  showSecond = false;
  showThird = false;
  showModal = false;
  showFirst = true;
  subscriptions: Subscription[] = [];
  ExpiryDate;
  @Output() emitDate = new EventEmitter();
  showThanks = false;
  constructor(
    private router: Router,
    private storage: StorageService,
    private commonService: CommonService,
    private eventService: EventsService
  ) {
    this.triggerOpenModalEvent();
  }
  selectDay(date) {
    this.ExpiryDate = date;
    this.emitDate.emit(this.ExpiryDate);
    this.showModal = false;
  }
  triggerOpenModalEvent() {
    this.subscriptions.push(
      this.eventService.subscribe(EventsKey.openSetExpire, (data: any) => {
        this.showModal = true;
      })
    );
  }
  goNextForth() {
    // implement part of code here
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
