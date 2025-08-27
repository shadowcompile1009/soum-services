import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { BidsAndItemsService } from 'src/app/services/bids-and-items/bids-and-items.service';
import {
  BuyService,
  TransactionCancelPayload
} from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-hyper-pay',
  templateUrl: './hyper-pay.component.html',
  styleUrls: ['./hyper-pay.component.scss']
})
export class TestHyperPayComponent implements OnInit {
  checkoutId = '35B9EF50DD5130AE74D86F110FF255B2.uat01-vm-tx01';
  shopperResultUrl: string;
  paymentMode: string;
  product_id: any;
  subscriptions: Subscription[] = [];
  empty: boolean = false;

  order_id: any;
  actionType: 'bid' | 'buy';
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    switch (this.actionType) {
      case 'buy':
        this.buyService
          .cancelTransaction(
            new TransactionCancelPayload({
              order_id: this.order_id,
              product_id: this.product_id
            })
          )
          .subscribe(
            (res) => {
              this.empty = true;
            },
            (error) => {
              this.commonService.errorHandler(error, true);
            }
          );
        break;

      case 'bid':
        this.buyService
          .bidTransactionCancel(this.product_id, this.order_id)
          .then((res) => {
            this.empty = true;
          });
        break;
    }
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private _location: Location,
    private router: Router,
    private commonService: CommonService,
    private buyService: BuyService,
    private bidService: BidsAndItemsService
  ) {
    this.bidService.sendRouter(false);
  }

  ngOnInit(): void {
    this.getCheckoutId();
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'HyperPay'
    };
    window['dataLayer'].push(productGTM);
  }

  getCheckoutId() {
    this.shopperResultUrl = window.location.origin + '/payment-successful';
    this.subscriptions.push(
      this.activatedRoute.params.subscribe((params) => {
        if (params.order_id) {
          this.shopperResultUrl += '/' + params.order_id;
          this.order_id = params.order_id;
        }

        if (params.product_id) {
          this.shopperResultUrl += '/' + params.product_id;
          this.product_id = params.product_id;
        }

        if (params.payment_mode) {
          this.paymentMode = params.payment_mode;
          if (this.paymentMode === 'STC_PAY') {
            this.loadScriptForSTCPay(params.checkout_id);
          }
          if (this.paymentMode === 'MADA') {
            this.loadScriptForHyperPay(params.checkout_id);
          }
          if (this.paymentMode === 'VISA_MASTER') {
            this.loadScriptForHyperPay(params.checkout_id);
          }
          if (this.paymentMode === 'APPLEPAY') {
            this.loadScriptForApplePay(params.checkout_id);
          }
        }
        if (params) {
          if (params.checkout_id) {
            //write your code here
          }

          this.actionType = params.type;
          this.shopperResultUrl += '/' + params.type;
        } else {
          this._location.back();
        }
      })
    );
  }

  loadScriptForApplePay(checkout_id: string) {
    let locale = document.createElement('script');
    locale.type = 'text/javascript';
    locale.insertAdjacentText(
      'afterbegin',
      `var wpwlOptions = {
              registrations: {
                   requireCvv: true,
                   hideInitialPaymentForms: true
               },
              locale:"${this.translate.getDefaultLang()}"
           }
     
    `
    );
    document.getElementsByTagName('head')[0].appendChild(locale);
    let url = environment.hyperPayCheckout + checkout_id;
    let script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  loadScriptForSTCPay(checkout_id: string) {
    let locale = document.createElement('script');
    locale.type = 'text/javascript';
    locale.insertAdjacentText(
      'afterbegin',
      `var wpwlOptions = {
        paymentTarget:"_top",
        onReady: function(e){
          $('.wpwl-group-radio div:first').hide();
          $('.wpwl-form-card').find('.wpwl-button-pay').on('click', function(e){
            var holder = $('.wpwl-control-mobilePhone').val();
            if (holder.trim().length < 10 || holder[0] === '0' || holder[1] === '5'){
              return false;
            }
            return true;
          });
        },
        onBeforeSubmitCard: function(e){
          if(!$('.wpwl-wrapper-mobilePhone .wpwl-control-mobilePhone').val()){
              $('.wpwl-wrapper-mobilePhone .cardholder-err').remove();
              $('.wpwl-wrapper-mobilePhone .wpwl-control-mobilePhone').after("<div class='cardholder-err'>This field is required</div>")
              return false
          }
          return true;
        },
            locale:"${this.translate.getDefaultLang()}"
         }
      `
    );
    document.getElementsByTagName('head')[0].appendChild(locale);
    let url = environment.hyperPayCheckout + checkout_id;
    let script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  loadScriptForHyperPay(checkout_id: string) {
    let locale = document.createElement('script');
    locale.type = 'text/javascript';

    //wpwl-control wpwl-control-mobilePhone
    locale.insertAdjacentText(
      'afterbegin',
      `var wpwlOptions = {
      onBeforeSubmitCard: function(e){
        if(!$('.wpwl-wrapper-cardHolder .wpwl-control-cardHolder').val()){
            $('.wpwl-wrapper-cardHolder .cardholder-err').remove();
            $('.wpwl-wrapper-cardHolder .wpwl-control-cardHolder').after("<div class='cardholder-err'>This field is required</div>")
            return false
        }            
        return true;
    },
    registrations: {
      requireCvv: true,
      hideInitialPaymentForms: true
  },
          locale:"${this.translate.getDefaultLang()}"
       }
`
    );

    document.getElementsByTagName('head')[0].appendChild(locale);
    let url = environment.hyperPayCheckout + checkout_id;
    let script = document.createElement('script');
    script.src = url;
    script.type = 'text/javascript';
    script.async = true;
    script.charset = 'utf-8';
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  goBack() {
    switch (this.actionType) {
      case 'buy':
        this.buyService
          .cancelTransaction(
            new TransactionCancelPayload({
              order_id: this.order_id,
              product_id: this.product_id
            })
          )
          .subscribe(
            (res) => {
              this.router.navigate(['/product-detail'], {
                queryParams: { product: this.product_id }
              });
            },
            (error) => {
              this.commonService.errorHandler(error, true);
            }
          );
        break;

      case 'bid':
        this.buyService
          .bidTransactionCancel(this.product_id, this.order_id)
          .then((res) => {
            this.router.navigate(['/product-detail'], {
              queryParams: { product: this.product_id }
            });
          })
          .catch((error) => {
            console.log('error : ', error);
          });
        break;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
