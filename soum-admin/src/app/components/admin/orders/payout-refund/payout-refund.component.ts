import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { ProductsService } from 'src/app/services/products/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payout-refund',
  templateUrl: './payout-refund.component.html',
  styleUrls: ['./payout-refund.component.scss']
})
export class PayoutRefundComponent implements OnInit {
  orderDetails: any;
  refundForm: FormGroup;

  defaultPayment;
  paymentMethods: any[] = [];

  defaultRefund;
  refundMethods: any[] = [];

  disableSubmitBtn = false;
  language: any = null;

  constructor(
    public dialogeRef: MatDialogRef<PayoutRefundComponent>,
    private fb: FormBuilder,
    private productService: ProductsService,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonService: CommonService,
    private router: Router,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService) {
    this.paymentMethods = ['MADA', 'VISA_MASTER', 'APPLEPAY', 'STC_PAY'];
    this.refundMethods = ['Refund', 'Reversal'];
    this.language = JSON.parse(JSON.parse(localStorage.getItem('defaultLang')));
    this.buildRefundForm();
  }

  ngOnInit(): void {
    this.getOrderRefundDetails();
  }

  buildRefundForm() {
    this.refundForm = this.fb.group({
      paymentOption: [null, [Validators.required]],
      RefundOption: [null, [Validators.required]],
      transferAmount: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      fullAmount: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
    });
  }

  get paymentOption() { return this.refundForm.get('paymentOption') }
  get RefundOption() { return this.refundForm.get('RefundOption') }
  get transferAmount() { return this.refundForm.get('transferAmount') }
  get fullAmount() { return this.refundForm.get('fullAmount') }


  getOrderRefundDetails() {
    this.commonService.presentSpinner();
    this.orderDetails = this.data && this.data.order_details;
    this.defaultPayment = this.orderDetails && this.orderDetails.payment_type;
    if (this.defaultPayment == 'VISA_MASTER' || this.defaultPayment == 'APPLEPAY') {
      this.RefundOption.enable();
      this.transferAmount.disable();
      this.fullAmount.enable();
      this.defaultRefund = 'Reversal';
    } else if (this.defaultPayment == 'MADA') {
      this.fullAmount.enable();
      this.RefundOption.enable();
      this.transferAmount.enable();
      this.defaultRefund = 'Refund';
    } else {
      this.defaultRefund = '';
      this.RefundOption.disable();
      this.transferAmount.disable();
      this.fullAmount.disable();
      this.disableSubmitBtn = true;
      this.commonService.errorToast('Refund method is unavailable! please notify the buyer to fill out bank details at profile page!')
    }
    const RefundFormValue = {
      paymentOption: this.orderDetails.payment_type || "",
      RefundOption: this.defaultRefund || "",
      transferAmount: this.orderDetails.grand_total || 0,
      fullAmount: this.orderDetails.grand_total || 0,
    }
    this.refundForm.patchValue(RefundFormValue)
    this.commonService.dismissSpinner();
  }

  onOptionsSelected(value: string) {
    this.assignRefundOption(value)
  }

  assignRefundOption(defaultPayment?: string) {
    this.disableSubmitBtn = false;
    if (defaultPayment == 'VISA_MASTER' || defaultPayment == 'APPLEPAY') {
      this.RefundOption.enable();
      this.transferAmount.disable();
      this.fullAmount.enable();
      this.refundForm.patchValue({ RefundOption: 'Reversal' });
    } else if (defaultPayment == 'MADA') {
      this.RefundOption.enable();
      this.transferAmount.enable();
      this.fullAmount.enable();
      this.refundForm.patchValue({ RefundOption: 'Refund' });
    } else {
      this.disableSubmitBtn = true;
      this.RefundOption.disable();
      this.transferAmount.disable();
      this.fullAmount.disable();
      this.refundForm.patchValue({ RefundOption: '' });
      this.commonService.errorToast('Refund method is unavailable! please notify the buyer to fill out bank details at profile page!')
    }
  }

  handleRefundOrder() {
    let confirmTitle;
    confirmTitle = `Are you sure you want to refund the buyer the following amount ${this.refundForm.value.fullAmount}`

    let options = {
      title: confirmTitle,
      confirmLabel: 'Confirm',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {

        const payload = {
          orderId: this.orderDetails._id,
          refundAmount: this.refundForm.value.fullAmount,
          refundMethod: this.refundForm.value.RefundOption.toLowerCase() || ''
        }

        this.productService.refundOrder(payload).subscribe((res) => {
          this.closeModal();
          this.router.navigate(['admin/orders']);
        }, err => {
          this.commonService.errorToast(err.error.message)
          this.commonService.dismissSpinner();
          this.commonService.errorHandler(err);
        });
      } else { }
    });
  }

  closeModal() {
    this.dialogeRef.close();
    this.refundForm.reset();
  }

  numbersOnly(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    }
  }

}
