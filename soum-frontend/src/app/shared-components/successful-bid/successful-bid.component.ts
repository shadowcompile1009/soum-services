import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventsKey } from 'src/app/services/core/events/events-key.constant';
import { EventsService } from 'src/app/services/core/events/events.service';

@Component({
  selector: 'app-successful-bid',

  templateUrl: './successful-bid.component.html',
  styleUrls: ['./successful-bid.component.scss']
})
export class SuccessfulBidComponent implements OnInit {
  showModal = true;
  showFirst = false;
  showThanks = false;
  subscriptions: Subscription[] = [];
  constructor(private router: Router, private eventService: EventsService) {}
  triggerOpenModalEvent() {
    this.subscriptions.push(
      this.eventService.subscribe(EventsKey.openSuccessBid, (data: any) => {
        if (data == 'showFirstSell') {
          this.showFirst = true;
        }
        if (data) {
          this.showThanks = true;
        }
      })
    );
  }
  ngOnInit(): void {
    this.triggerOpenModalEvent();
  }
  hideBidModal() {
    this.showModal = false;
    this.router.navigate(['/bids-and-items'], {
      queryParams: {
        tab: 'bid-sell',
        subTab: 'bid'
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
