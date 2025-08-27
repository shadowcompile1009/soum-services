import { Location } from '@angular/common';
import { Component, Injector, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { Subscription } from 'rxjs';
import { BuyService } from 'src/app/services/buy/buy.service';
import { CommonService } from 'src/app/services/common/common.service';
import { storageKeys } from 'src/app/services/core/storage/storage-keys';
import { StorageService } from 'src/app/services/core/storage/storage.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderComponent implements OnInit {
  orderId: any;
  shippingDetails: any;
  orderedProduct: any;
  userDetail: any;
  userDetailAddress: any;
  file: any;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementIdOrContent: 'shipment_label',
    download: true,
    options: {
      margins: {
        top: '0',
        bottom: '0',
        left: '0',
        right: '0'
      }
    }
  };
  statusForBuyer1: any;
  statusForBuyer2: any;
  trackingDetail: any;
  cancelLimitExpired: boolean;
  subscriptions: Subscription[] = [];
  empty: boolean = false;

  commonService: CommonService;
  buyService: BuyService;
  storage: StorageService;
  exportAsService: ExportAsService;
  translate: TranslateService;

  constructor(
    private _location: Location,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public sanitizer: DomSanitizer,
    private injector: Injector
  ) {
    this.commonService = this.injector.get<CommonService>(CommonService);
    this.buyService = this.injector.get<BuyService>(BuyService);
    this.storage = this.injector.get<StorageService>(StorageService);
    this.exportAsService = this.injector.get<ExportAsService>(ExportAsService);
    this.translate = this.injector.get<TranslateService>(TranslateService);

    if (this.commonService.isLoggedIn) {
      this.subscriptions.push(
        this.activatedRoute.queryParams.subscribe((param) => {
          if (param && param.order) {
            this.orderId = param.order;
          } else {
            this._location.back();
          }
        })
      );
    } else {
      this._location.back();
    }

    let state = this.router.getCurrentNavigation().extras.state;
    if (state && state.product) {
      this.orderedProduct = state.product;
    } else {
      this._location.back();
    }

    this.translate.get('trackOrder.confirmDelivery').subscribe((text) => {
      this.statusForBuyer2 = {
        confirmDelivery: `"` + text + `"`
      };
    });
  }

  ngOnInit(): void {
    if (this.commonService.isLoggedIn) {
      const savedData = this.storage.getSavedData();
      if (savedData && savedData[storageKeys.userDetails]) {
        this.userDetail = savedData[storageKeys.userDetails];
        this.userDetailAddress = JSON.parse(this.userDetail.address);
      }
    }

    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    // Add GTM
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Track-order'
    };
    window['dataLayer'].push(productGTM);
  }

  goBack() {
    this.router.navigate(['/profile'], {
      state: { showHistory: true }
    });
  }

  goToOrderDetail() {
    this.router.navigate(['/order-details'], {
      queryParams: { order: this.orderId }
    });
  }

  getShippingDetails() {
    this.buyService.getShippingDetails(this.orderId).subscribe(
      (res) => {
        if (res) {
          this.shippingDetails = res;
          this.translate.get('trackOrder.trackShipping').subscribe((text) => {
            this.statusForBuyer1 = {
              ShipmentIdentificationNumber:
                this.shippingDetails &&
                this.shippingDetails.shipment_detail &&
                this.shippingDetails.shipment_detail.ShipmentResponse
                  ? this.shippingDetails.shipment_detail.ShipmentResponse
                      .ShipmentIdentificationNumber
                  : '',
              trackShipping: `"` + text + `"`
            };
            this.buyService
              .trackOrder(
                this.statusForBuyer1.ShipmentIdentificationNumber,
                this.orderId
              )
              .subscribe((trackingDetail) => {
                if (trackingDetail) {
                  this.cancelLimitExpired = trackingDetail.delivery_time
                    ? new Date(
                        new Date(trackingDetail.delivery_time).getTime() +
                          24 * 60 * 60 * 1000
                      ) <= new Date()
                    : false;
                  this.trackingDetail = trackingDetail.trackData;
                }
              });
          });
        } else {
          this._location.back();
        }
      },
      (error) => {
        this.commonService.errorHandler(error, true);
      }
    );
  }

  showPDF() {
    const linkSource =
      'data:application/pdf;base64,' +
      this.shippingDetails.shipment_detail.ShipmentResponse.LabelImage[0]
        .GraphicImage;
    this.file = linkSource;

    setTimeout(() => {
      this.exportAsConfig.fileName =
        this.shippingDetails.pickup_detail.PickUpResponse.DispatchConfirmationNumber;
      this.exportAsService.get(this.exportAsConfig).subscribe((genPDF) => {
        this.empty = true;
      });
    }, 500);
  }

  trackShipping() {
    let trackingNumber =
      this.shippingDetails &&
      this.shippingDetails.shipment_detail &&
      this.shippingDetails.shipment_detail.ShipmentResponse
        ? this.shippingDetails.shipment_detail.ShipmentResponse
            .ShipmentIdentificationNumber
        : '';
    const trackingLink = document.createElement('a');
    trackingLink.href = `https://www.dhl.com/sa-en/home/tracking.html?tracking-id=${trackingNumber}&submit=1`;
    trackingLink.target = '_blank';
    trackingLink.click();
  }

  confirmDelivery() {
    this.commonService.presentSpinner();
    this.buyService.confirmDelivery(this.orderId).subscribe(
      () => {
        this.commonService.dismissSpinner();
        window.location.reload();
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
