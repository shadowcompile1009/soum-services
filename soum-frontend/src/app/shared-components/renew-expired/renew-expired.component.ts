import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import { CommonService } from 'src/app/services/common/common.service';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-renew-expired',
  templateUrl: './renew-expired.component.html',
  styleUrls: ['./renew-expired.component.scss']
})
export class RenewExpiredComponent implements OnInit {
  showModal = true;
  @Output() expireDate = new EventEmitter();
  @Input() ID;

  arrayOfExpiry = [
    { value: 30, titleE: 'Month', titleA: 'شهر' },
    { value: 14, titleE: '2 weeks', titleA: 'أسبوعان' },
    { value: 7, titleE: '1 week', titleA: 'أسبوع' },
    { value: 3, titleE: '3 days', titleA: ' ٣ أيام' },
    { value: 1, titleE: '1 day', titleA: ' يوم واحد' }
  ];

  selectedItem = 14;
  constructor(
    private eventService: EventsService,
    private bidsAndItemService: BidsAndItemsService,
    private router: Router,
    private commonService: CommonService,
    public translate: TranslateService
  ) {}
  cancel() {
    this.router.navigate(['/products']);
  }
  selectItem(value) {
    this.selectedItem = value;
  }
  triggerOpenModalEvent() {
    this.eventService.subscribe(EventsKey.openExpiryModels, (data: any) => {
      this.showModal = true;
    });
  }
  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }
  hideBidModal() {
    this.showModal = false;
  }
  renew() {
    if (this.ID !== null) {
      this.commonService.presentSpinner();
      this.bidsAndItemService
        .renewProduct(this.ID, this.selectedItem)
        .then((res) => {
          this.selectedItem = 14;
          this.commonService.dismissSpinner();
          if (res) {
            this.expireDate.emit(this.ID);
            this.router.navigate(['/product-detail'], {
              queryParams: { product: this.ID }
            });
            this.hideBidModal();
          }
        });
    }
  }
}
