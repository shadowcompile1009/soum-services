import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/services/common/common.service';
import {
  ProductsService,
} from 'src/app/services/products/products.service';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PayoutEditComponent } from '../payout-edit/payout-edit.component';
@Component({
  selector: 'app-payout-order',
  templateUrl: './payout-order.component.html',
  styleUrls: ['./payout-order.component.scss'],
})
export class PayoutOrderComponent implements OnInit {
  orderDetails: any;
  disputeStaus: string = '';
  disputeComment: string;
  file: any;
  fileName: any;
  showPayout: any;
  updatePayoutForm: FormGroup;
  order_id: any;
  historyPayouts: any;

  constructor(
    private router: Router,
    private _location: Location,
    private productService: ProductsService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    public dailoge: MatDialog
  ) {
    this.getOrderFromStateNavigation();
    this.showPayout = JSON.parse(localStorage.getItem('payoutReady'))
  }

  getOrderFromStateNavigation() {
    let state = this.router.getCurrentNavigation().extras.state;
    if (state && state.payout && state.payoutReady) {
      this.orderDetails = state.payout;
      this.showPayout = state.payoutReady || null;
    } else {
      this.getOrderDetails();
    }
  }

  getOrderDetails() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.order_id) {
        this.commonService.dismissSpinner();
        this.productService.getOrderPayoutDetails(params.order_id).subscribe(
          (res) => {
            if (res) {
              this.orderDetails = res.body.responseData;
              this.showPayout = this.orderDetails?.isReadyToPayout || null;
            }
          },
          (error) => {
            this.commonService.dismissSpinner();
            this.commonService.errorHandler(error);
          }
        );
      }
    });
  }

  editOrderPayout() {
    this.dailoge.open(PayoutEditComponent, { data: { order_id: this.order_id }});
  }

  getOrderPayoutHistory() {
    this.productService.getOrderPayoutHistory(this.order_id).subscribe((data:any) => {
      this.historyPayouts = data.body.responseData;
    }, error => {
      console.log('error =====> ', error);
    })
  }


  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params.order_id) {
        this.order_id = params.order_id;
        this.getOrderPayoutHistory()
      }
    })

    this.productService.updatePayout.subscribe((updatePayout) => {
      if(updatePayout) {
        this.getOrderDetails();
        this.productService.updatePayout.next(false);
      }
    })
  }

  goBack() {
    this._location.back();
  }
}
