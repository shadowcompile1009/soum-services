import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BuyService, CancelOrder } from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';

@Component({
  selector: 'app-cancel-return',
  templateUrl: './cancel-return.component.html',
  styleUrls: ['./cancel-return.component.scss']
})
export class CancelReturnComponent implements OnDestroy {
  reason: string;
  order_id: string;
  subscriptions: Subscription[] = [];
  empty: boolean = false;

  constructor(
    private buyService: BuyService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private _location: Location
  ) {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        if (params && params.order_id) {
          this.order_id = params.order_id;
        }
      })
    );
  }

  goBack() {
    this._location.back();
  }

  cancelOrder() {
    this.commonService.presentSpinner();
    let payload = new CancelOrder(this.order_id, this.reason);
    this.buyService.cancelOrder(payload).subscribe(
      async (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this.commonService.presentAlert({
            header: 'Thank you!',
            message:
              'Your dispute was successfully submitted! \n The team will contact you soon.',
            button1: {
              text: 'Ok',
              handler: () => {
                this.empty = true;
              }
            }
          });
          this.router.navigate(['/bids-and-items'], {
            queryParams: { tab: 'bought-sold' }
          });
        }
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  openWhatsApp() {
    const trackingLink = document.createElement('a');
    trackingLink.href = `https://wa.me/966541850019`;
    trackingLink.target = '_blank';
    trackingLink.click();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
