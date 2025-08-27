import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/services/common/common.service';
import { ProductsService } from 'src/app/services/products/products.service';
import { banks } from 'src/assets/banks-code/banks';
@Component({
  selector: 'app-payout-edit',
  templateUrl: './payout-edit.component.html',
  styleUrls: ['./payout-edit.component.scss']
})
export class PayoutEditComponent implements OnInit {
  payoutForm: FormGroup;
  ibanRegx: any = /^SA[0-9]{22}$/;
  orderDetails: any;
  allBanks: any[] = [];
  language: any=null;
  currency;
  constructor(
    public dialogeRef: MatDialogRef<PayoutEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    public translate: TranslateService,
    private commonService: CommonService,
    private productService: ProductsService
    ) {
      this.buildPayoutForm();
      this.allBanks = banks;
      this.language = JSON.parse(JSON.parse(localStorage.getItem('defaultLang')))
     }

  ngOnInit(): void {  
    this.getOrderPayoutDetails();
    this.currency = JSON.parse(localStorage.getItem('region')).currency;

  }

  buildPayoutForm() {
    this.payoutForm = this.fb.group({
      basePrice: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      sellerCommission: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      sellerCommissionAmount: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      vat: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      shippingCharge: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      netForSeller: [null, [Validators.required, Validators.min(0), Validators.minLength(1)]],
      iban: [null, [Validators.required, Validators.pattern(this.ibanRegx)]],
      bankName: [null, [Validators.required]]
    })
  }

  get basePrice() {return this.payoutForm.get('basePrice')}
  get sellerCommission() {return this.payoutForm.get('sellerCommission')}
  get sellerCommissionAmount() {return this.payoutForm.get('sellerCommissionAmount')}
  get vat() {return this.payoutForm.get('vat')}
  get shippingCharge() {return this.payoutForm.get('shippingCharge')}
  get netForSeller() {return this.payoutForm.get('netForSeller')}
  get iban() {return this.payoutForm.get('iban')}
  get bankName() {return this.payoutForm.get('bankName')}


  getOrderPayoutDetails() {
    this.commonService.presentSpinner()
    this.productService.getOrderPayoutDetails(this.data.order_id).subscribe(
      (res) => {
        if (res && res.body) {
          this.commonService.dismissSpinner();
          this.orderDetails = res.body.responseData;
          const payoutFormValue = {
            basePrice: this.orderDetails.sell_price || 0,
            sellerCommission: this.orderDetails.commission || 0,
            sellerCommissionAmount: this.orderDetails.commission_amount || 0,
            vat: this.orderDetails.vat || 0,
            shippingCharge: this.orderDetails.shipping_charge || 0,
            netForSeller: this.orderDetails.net_seller || 0,
            iban: this.orderDetails.iban || null,
            bankName: this.orderDetails.bank_name || ""
          }
          this.payoutForm.patchValue(payoutFormValue)
        }
      },
      (error) => {
        this.commonService.dismissSpinner();
        this.commonService.errorHandler(error);
      });
  }


  editPayoutOrderDetails() {
    this.commonService.presentSpinner();
    this.productService.updateOrderPayout(this.data.order_id, 
      {
        commission: this.payoutForm.get('sellerCommission').value, 
        commission_amount: this.payoutForm.get('sellerCommissionAmount').value,
        net_seller: this.payoutForm.get('netForSeller').value,
        bank_name: this.payoutForm.get('bankName').value,
        iban: this.payoutForm.get('iban').value
      }).subscribe((res) => {
      this.commonService.dismissSpinner();
      this.productService.updatePayout.next(true);
      this.dialogeRef.close();
    }, err => {
      this.commonService.dismissSpinner();
      this.commonService.errorHandler(err);
    })

  }

  closeModal() {
    this.dialogeRef.close();
    this.payoutForm.reset();
  }

  numbersOnly(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 46) {
      return false;
    } 
  }

}
