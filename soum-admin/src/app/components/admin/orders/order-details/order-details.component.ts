import { PayoutEditComponent } from './../payout-edit/payout-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { ExportAsConfig, ExportAsService } from 'ngx-export-as';
import { CommonService } from 'src/app/services/common/common.service';
import {
  DisputeClosure,
  ProductsService,
} from 'src/app/services/products/products.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { PayoutRefundComponent } from '../payout-refund/payout-refund.component';
@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: any;
  productListQuestions;
  disputeStaus: string = '';
  disputeComment: string;
  file: any;
  fileName: any;
  showStatus: any;
  QuestionsBuyer: any;
  showFile = false;
  showQuestionBuyer = false;
  orderDetailsBuyer: any = null;
  orderDetailsSeller: any = null;
  sellerAddress: any;
  buyerAdderss: any;
  orderId: any;
  currency;
  constructor(
    private router: Router,
    private _location: Location,
    private productService: ProductsService,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private dialoge: MatDialog
  ) {
    //  this.getOrderFromStateNavigation();
    this.getOrderDetails();
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }
  action(id) {
    let options = {
      title: 'Are you Sure you want to delete this question?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.deleteQ(id);
      } else {
        console.log('Cancel');
      }
    });
  }

  deleteQ(QID) {
    this.productService.deleteQ(QID._id).subscribe(
      (res) => {
        this.commonService.successToaster(res.body.message);
        this.getOrderDetails();
      },
      (error) => {
        this.commonService.errorHandler(error);
      }
    );
  }

  getOrderFromStateNavigation() {
    let state = this.router.getCurrentNavigation().extras.state;
    if (state && state.order) {
      this.orderDetails = state.order;

      if (this.orderDetails.dispute_comment) {
        this.disputeComment = this.orderDetails.dispute_comment;
      }
      if (this.orderDetails.dispute_validity) {
        this.disputeStaus = this.orderDetails.dispute_validity;
      }
      if (
        !this.orderDetails.shipment_detail ||
        !this.orderDetails.shipment_detail.ShipmentResponse ||
        !this.orderDetails.shipment_detail.ShipmentResponse.LabelImage
      ) {
        return;
      }
      const linkSource =
        'data:application/pdf;base64,' +
        this.orderDetails.shipment_detail.ShipmentResponse.LabelImage[0]
          .GraphicImage;
      this.file = linkSource;
      this.fileName =
        this.orderDetails.pickup_detail.PickUpResponse.DispatchConfirmationNumber;
    } else {
      this.getOrderDetails();

    }
  }

  getQuestions() {
    this.productService.getProductQuestions(this.orderDetails.product._id).subscribe(
      (res) => {
        this.productListQuestions = res.body.responseData;
        this.ref.detectChanges();
      }
    );
  }
  getOrderDetails() {
    this.activatedRoute.params.subscribe((params) => {
      if (params.order_id) {
        this.orderId = params.order_id;
        this.productService.getOrderDetail(params.order_id).subscribe(
          (res) => {
            if (res && res.body) {
              this.orderDetails = res.body.OrderData;
              this.getSellerUserAddress(this.orderDetails.seller._id);
              this.getBuyerUserAddress(this.orderDetails.buyer._id)

              this.getQuestions();
              if (this.orderDetails.product.answer_to_questions.length) {
                this.showStatus = JSON.parse(
                  this.orderDetails.product.answer_to_questions
                );
              }

              if (this.orderDetails.product.product_questions.length) {
                this.QuestionsBuyer =
                  this.orderDetails.product.product_questions;
              }

              if (
                !this.orderDetails.shipment_detail ||
                !this.orderDetails.shipment_detail.ShipmentResponse ||
                !this.orderDetails.shipment_detail.ShipmentResponse.LabelImage
              ) {
                return;
              }

              const linkSource =
                'data:application/pdf;base64,' +
                this.orderDetails.shipment_detail.ShipmentResponse.LabelImage[0]
                  .GraphicImage;
              this.file = linkSource;
              this.fileName =
                this.orderDetails.pickup_detail.PickUpResponse.DispatchConfirmationNumber;
              if (this.orderDetails.dispute_comment) {
                this.disputeComment = this.orderDetails.dispute_comment;
              }
              if (this.orderDetails.dispute_validity) {
                this.disputeStaus = this.orderDetails.dispute_validity;
              }
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

  getSellerUserAddress(userId) {
    this.commonService.getAddressFromV2(userId).subscribe((data) => {
      const addresses = data.body.responseData;
      this.sellerAddress = addresses.length >0 ? addresses[addresses.length - 1] : [];
    }, err => {
      this.commonService.errorHandler(err);
    })
  }

  getBuyerUserAddress(userId) {
    this.commonService.getAddressFromV2(userId).subscribe((data) => {
      const addresses = data.body.responseData;
      this.buyerAdderss = addresses.length >0 ? addresses[addresses.length - 1] : [];

    }, err => {
      this.commonService.errorHandler(err);
    })
  }

  getOrderDetailsPrice() {
    this.activatedRoute.params.subscribe((params) => {
      if(params.order_id) {
        this.productService.getOrderDetailsV2(params.order_id, 'buyer').subscribe((buyerOrderDetails) => {
          this.orderDetailsBuyer = buyerOrderDetails?.body?.responseData;
        })

        this.productService.getOrderDetailsV2(params.order_id, 'seller').subscribe((sellerOrderDetails) => {
          this.orderDetailsSeller = sellerOrderDetails?.body?.responseData;
        })
      }
    })
  }

  convertStringToNumber(value) {
    const converter = Number(Number(value).toFixed(2));
    return converter;
  }

  ngOnInit(): void {
    this.getOrderDetailsPrice()
    setTimeout(() => {
      this.showQuestions();
      this.showQuestionsBuyer();
    }, 3000);
    // this.getOrderFromStateNavigation();

    this.productService.updatePayout.subscribe((res) => {
      this.getOrderDetails();
    })
  }
  
  showQuestions() {
    if (
      this.orderDetails !== undefined &&
      this.orderDetails.product !== undefined &&
      this.orderDetails.product.answer_to_questions.length
    ) {
      this.showStatus = JSON.parse(
        this.orderDetails.product.answer_to_questions
      );
      this.showFile = !this.showFile;
    }
  }

  showQuestionsBuyer() {
    if (
      this.orderDetails !== undefined &&
      this.orderDetails.product !== undefined &&
      this.orderDetails.product.product_questions.length
    ) {
      this.QuestionsBuyer = this.orderDetails.product.product_questions;
      this.showQuestionBuyer = !this.showQuestionBuyer;
    }
  }

  disputeClosure() {
    this.commonService.presentSpinner();
    let payload = new DisputeClosure(
      this.orderDetails._id,
      this.disputeComment,
      this.disputeStaus
    );
    this.productService.disputeAction(payload).subscribe(
      (res) => {
        this.commonService.dismissSpinner();
        if (res) {
          this._location.back();
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      }
    );
  }

  trackShipping(trackingNumber) {
    if (!trackingNumber) {
      return;
    }
    const trackingLink = document.createElement('a');
    trackingLink.href = `https://www.dhl.com/sa-en/home/tracking.html?tracking-id=${trackingNumber}&submit=1`;
    trackingLink.target = '_blank';
    trackingLink.click();
  }

  showPDF() {
    // setTimeout(() => {
    //   this.exportAsConfig.fileName = this.orderDetails.pickup_detail.PickUpResponse.DispatchConfirmationNumber
    //   this.exportAsService.get(this.exportAsConfig).subscribe(
    //     (genPDF) => {
    //     }
    //   );
    // }, 500);
  }

  goBack() {
    this._location.back();
  }


  openPayoutModal() {
    this.dialoge.open(PayoutEditComponent, {data: {'order_id': this.orderId}})
  }

  openRefundForm() {
    this.dialoge.open(PayoutRefundComponent, {data: {'order_details': this.orderDetails}})
  }

  payConfirmation() {
      let options = {
        title: `Are you sure you want to pay the seller the following amount ${this.convertStringToNumber(this.orderDetailsSeller?.grand_total)} to ${this.orderDetails?.seller?.bankDetail?.accountId} ?`,
        confirmLabel: 'Okay',
        declineLabel: 'Cancel'
      }
      this.ngxBootstrapConfirmService.confirm(options).then((confirm: boolean) => {
        if (confirm) {
          const grandTotal = this.convertStringToNumber(this.orderDetailsSeller?.grand_total);
          this.commonService.presentSpinner();
          this.productService.confirmPaymentForSeller(this.orderId, {grand_total: grandTotal}).subscribe(res => {
            this.commonService.dismissSpinner();
            this.commonService.successToaster('Payment Confirmed');
            this.getOrderDetails();
          }, err => {
            this.commonService.dismissSpinner();
            this.commonService.errorHandler(err)
          })

        }
      });
  }

}
