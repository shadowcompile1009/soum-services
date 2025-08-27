import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig } from 'ngx-export-as';
import { Subscription } from 'rxjs';
import { BuyService } from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  orderCreatedDate;
  customOptions = {
    loop: false,
    autoplay: false,
    center: true,
    dots: true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 1
      },
      1000: {
        items: 1
      }
    }
  };
  invoiceOrderLink: any;
  orderType: any;
  orderId: any;
  orderDetails: any;
  orderSoldState = false;
  paramState;
  questionsAR;
  questionsEN;
  orderDetailsPrice: any = null;

  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'orderInvoice',
    download: true,
    options: {}
  };
  subscriptions: Subscription[] = [];
  constructor(
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private buyService: BuyService,
    private router: Router,
    public translate: TranslateService
  ) {
    if (this.commonService.isLoggedIn) {
      this.subscriptions.push(
        this.activatedRoute.queryParams.subscribe((param) => {
          if (param && param.order) {
            this.orderId = param.order;
            this.orderType = param.state ? param.state : 'bought';
            this.getOrderDetails();
            this.orderSoldState = param.state == 'sold' ? true : false;
          } else {
            this._location.back();
          }
        })
      );
    } else {
      this.router.navigate(['/login/continue']);
    }
  }
  getOrderDetails() {
    this.buyService.getOrderDetails(this.orderId).subscribe(
      (res) => {
        this.orderDetails = res?.OrderData;
        this.questionsEN = JSON.parse(
          this.orderDetails?.product.answer_to_questions ||
            this.orderDetails?.product.answer_to_questions_migration ||
            null
        );
        this.questionsAR = JSON.parse(
          this.orderDetails?.product.answer_to_questions_ar ||
            this.orderDetails?.product.answer_to_questions_ar_migration ||
            null
        );
        this.orderDetails.grand_total =
          this.orderDetails?.grand_total.toString();
        this.orderDetails.grand_total = this.orderDetails?.grand_total.concat(
          ' SAR',
          '(1 item)'
        );
        if (this.orderDetails.product.answer_to_questions_ar) {
          this.orderDetails.product.answer_to_questions_ar = JSON.parse(
            this.orderDetails.product.answer_to_questions_ar
          );
        }
        if (this.orderDetails.product.answer_to_questions) {
          this.orderDetails.product.answer_to_questions = JSON.parse(
            this.orderDetails.product.answer_to_questions
          );
        }
      },
      (error) => this.commonService.errorHandler(error)
    );
  }

  getOrderDetailsPrice() {
    const typeUser = this.orderType == 'bought' ? 'buyer' : 'seller';
    this.buyService.getOrderDetailsV2(this.orderId, typeUser).subscribe(
      (res) => {
        this.orderDetailsPrice = res.responseData;
        this.orderCreatedDate =  res.responseData.order_date;
      },
      (error) => this.commonService.errorHandler(error)
    );
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.paramState = params['state'];
    });
    this.getOrderDetailsPrice();
  }

  goBack() {
    !this.paramState
      ? this.router.navigate(['/products'])
      : this._location.back();
  }
  public downloadPDF() {
    const typeUser = this.orderType == 'bought' ? 'buyer' : 'seller';
    const invoiceLink = this.commonService.getInvoiceLinkForOrder(
      this.orderId,
      typeUser
    );
    window.open(
      invoiceLink,
      '_blank',
      'toolbar=yes,scrollbars=yes,resizable=yes,top=70px,left=0,height=100%,width=auto'
    );
  }
  printFun(id): void {
    let printContents, popupWin;
    printContents = document.getElementById(id).innerHTML;
    popupWin =
      window.open('', '_blank', 'top=70px,left=0,height=100%,width=auto') || {};
    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
      <html>
      <head>
      <title>${this.orderId}</title>
      <style>
      </style>
      </head>
      <body onload="window.print();">${printContents}</body>
      </html>`);
      popupWin.document.close();
    }
  }

  convertStringToNumber(value) {
    return Number(Number(value).toFixed(2));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
