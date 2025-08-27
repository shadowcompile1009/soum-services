import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  BuyService,
  TransactionSavePayload
} from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-payment-successful',
  templateUrl: './payment-successful.component.html',
  styleUrls: ['./payment-successful.component.scss']
})
export class PaymentSuccessfulComponent implements OnInit {
  productID;
  checkoutId = '';
  showBidModal = false;
  subscriptions: Subscription[] = [];
  constructor(
    private buyService: BuyService,
    private commonService: CommonService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService
  ) {
    history.pushState(null, null, location.href);
    window.onpopstate = () => {
      history.go(1);
    };
    this.getQueryParam();
    this.getOrderandProductId();
  }

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Payment-successfull'
    };
    window['dataLayer'].push(productGTM);
  }
  openSuccesbidModal() {
    this.modalService.proceedToBidSuccess({
      value: true
    });
  }
  getOrderandProductId() {
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        this.productID = params.product_id;
        if (params) {
          if (
            params.order_id &&
            params.product_id &&
            params.type &&
            this.checkoutId
          ) {
            switch (params.type) {
              case 'bid':
                this.saveBidTransaction(
                  params.product_id,
                  params.order_id,
                  this.checkoutId
                );
                break;

              case 'buy':
                this.saveTransaction(
                  params.order_id,
                  params.product_id,
                  this.checkoutId
                );
                break;

              case 'bid-accepted':
                this.saveTransaction(
                  params.order_id,
                  params.product_id,
                  this.checkoutId
                );
                break;
            }
          }
        }
      })
    );
  }

  getQueryParam() {
    this.subscriptions.push(
      this.activatedRoute.queryParams.subscribe((queryParams) => {
        if (queryParams) {
          this.checkoutId = queryParams.id;
          console.log('hyper pay response ====>>>', queryParams);
        }
      })
    );
  }

  saveTransaction(order_id: string, product_id: string, checkout_id: string) {
    this.commonService.presentSpinner();
    this.showBidModal = false;
    this.buyService
      .saveTransaction(
        new TransactionSavePayload({
          order_id: order_id,
          checkout_id: checkout_id,
          product_id: product_id,
          transaction_detail: 'success'
        })
      )
      .then(async (transaction) => {
        this.commonService.dismissSpinner();
        if (transaction) {
          this.router.navigate(['/order-status'], {
            queryParams: {
              status: transaction.paymentStatus,
              orderID: order_id
            }
          });
        } else {
          this.router.navigate(['/order-status'], {
            queryParams: { status: 'Fail', productID: this.productID }
          });
        }
      });
  }

  saveBidTransaction(product_id: string, bid_id: string, checkout_id: string) {
    this.buyService
      .bidTransactionSave(product_id, bid_id, checkout_id)
      .then(async (transaction) => {
        this.commonService.dismissSpinner();
        if (transaction) {
          this.showBidModal = true;
          this.openSuccesbidModal();
        } else {
          this.router.navigate(['/products']);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
