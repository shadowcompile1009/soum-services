import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { NgxBootstrapConfirmService } from 'ngx-bootstrap-confirm';
import { Subscription } from 'rxjs';
import { Entries } from 'src/app/models/interface';
import { CommonService } from 'src/app/services/common/common.service';
import { PromoCodeService } from 'src/app/services/promo-code/promo-code.service';
declare var $: any;

enum PaymentProvider { 
  HyperPay = 'hyperPay',
  Tabby = 'tabby', 
  Tamara = 'tamara' 
}

enum PaymentProviderType {
  ApplePay = 'APPLEPAY',
  Mada = 'MADA',
  VisaMaster = 'VISA_MASTER',
  StcPay = 'STC_PAY',
  Tabby = 'TABBY',
  Tamara = 'TAMARA'
}

enum PaymentProviderTypeDisplayName {
  ApplePay = 'Apple Pay',
  Mada = 'Mada',
  VisaMaster = 'Visa/MC',
  StcPay = 'STC',
  Tabby = 'Tabby',
  Tamara = 'Tamara'
}

function atleaseOnePaymentProviderChecked(minRequired = 1): ValidatorFn {
  return function validate(formGroup: FormGroup) {

    if (!formGroup.parent) {
      return null;
    }

    if (formGroup.parent.get('userType').value !== 'Buyer') {
      return null;;
    }

    let checked = 0;

    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.controls[key];

      if (control.value === true) {
        checked++;
      }
    });

    if (checked < minRequired) {
      return {
        requireCheckboxToBeChecked: true,
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-promo-list',
  templateUrl: './promo-list.component.html',
  styleUrls: ['./promo-list.component.scss'],
})
export class PromoListComponent implements OnInit {
  searchForm: FormGroup;
  searchValue: string = '';
  notMatchSearch: boolean = false;
  promoCodeList: any;
  selectedPromo: any;
  promoCodeID: string = '';
  limit: any = 20;
  totalResult: any;
  paginationNextLabel: string = '';
  paginationPreviousLabel: string = '';
  currentPage: number = 1;
  promoAddOrEdit: string = 'add';
  promotionForm: FormGroup;
  subscription: Subscription[] = [];
  showHidePercentage: boolean = true;
  disableBtn: boolean = false;
  patternCode: any = /^[a-zA-Z]{2}[0-9]{2}/;
  showCollectionIds: boolean = false;

  entries: Entries = {
    from: 0,
    to: 0,
    total: 0,
  };

  availablePaymentProviders = [{
    paymentProvider: PaymentProvider.Tabby, 
    paymentProviderType:PaymentProviderType.Tabby,
    displayName: PaymentProviderTypeDisplayName.Tabby
  },{
    paymentProvider: PaymentProvider.HyperPay, 
    paymentProviderType:PaymentProviderType.VisaMaster, 
    displayName: PaymentProviderTypeDisplayName.VisaMaster
  },{
    paymentProvider: PaymentProvider.HyperPay, 
    paymentProviderType:PaymentProviderType.Mada, 
    displayName: PaymentProviderTypeDisplayName.Mada
  },{
    paymentProvider: PaymentProvider.HyperPay, 
    paymentProviderType:PaymentProviderType.ApplePay, 
    displayName: PaymentProviderTypeDisplayName.ApplePay
  },{
    paymentProvider: PaymentProvider.Tamara, 
    paymentProviderType:PaymentProviderType.Tamara, 
    displayName: PaymentProviderTypeDisplayName.Tamara
  }]


  constructor(
    private promoService: PromoCodeService,
    private ngxBootstrapConfirmService: NgxBootstrapConfirmService,
    private commonService: CommonService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.createSearchForm();
    this.createPromotionForm();
    this.validateInputDate();
    this.currentPage =
      JSON.parse(localStorage.getItem('promo_page_number')) || 1;
    this.getListPromoCode();

    this.subscription.push(
      this.promotionForm.get('promoType').valueChanges.subscribe((type) => {
        if (type && type == 'Fixed') {
          this.showHidePercentage = true;
          this.promotionForm.get('percentage').setValue('');
          this.promotionForm.get('percentage').setValidators([]);
          this.promotionForm.get('percentage').updateValueAndValidity();
        } else {
          this.showHidePercentage = false;
          this.promotionForm
            .get('percentage')
            .setValidators([
              Validators.min(0),
              Validators.minLength(1),
              Validators.maxLength(3),
              Validators.max(100),
              Validators.required,
            ]);
          this.promotionForm.get('percentage').updateValueAndValidity();
        }
      })
    );

    this.subscription.push(
      this.promotionForm.get('fromDate').valueChanges.subscribe((res) => {
        const fromTime = new Date(res).getTime();
        const toTime =
          this.promotionForm.get('toDate').value !== ''
            ? new Date(this.promotionForm.get('toDate').value).getTime()
            : 0;
        document.getElementsByName('someDate')[1].setAttribute('min', res);

        if (toTime < fromTime) {
          this.promotionForm.get('toDate').setValue('');
          document.getElementsByName('someDate')[1].setAttribute('min', res);
        }
      })
    );
  }


  buildAvailablePayment(selectedPayments?: any[]) {

    let paymentMethods

    if(!selectedPayments || (selectedPayments && selectedPayments.length  === 0)) {
      paymentMethods = this.availablePaymentProviders.map(() => {
        return this.fb.control(false)
      })
    }

    if(selectedPayments && selectedPayments.length > 0) {
      paymentMethods = this.availablePaymentProviders.map((method) => {

        const isSelected = selectedPayments.some(paymentMethod => (
            paymentMethod.paymentProvider === method.paymentProvider && 
            paymentMethod.paymentProviderType === method.paymentProviderType))
  
        return this.fb.control(isSelected)
      })
    }

    return this.fb.array(paymentMethods, atleaseOnePaymentProviderChecked())
  }

  createPromotionForm() {
    this.promotionForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern(this.patternCode)]],
      userType: ['', Validators.required],
      promoType: ['', Validators.required],
      discount: ['', Validators.required],
      percentage: [''],
      fromDate: ['', Validators.required],
      toDate: ['', [Validators.required]],
      promoLimit: ['', [Validators.required]],
      availablePayment: this.buildAvailablePayment(),
      isDefault: [false, [Validators.required]],
      limitCollection: [''],
      collectionIds: ['']
    });

    /**
     * availablePayment is required only if userType is 'Buyer'
     */
    this.promotionForm.get('userType').valueChanges
    .subscribe((value) => {
        if(value === 'Seller') {
          this.promotionForm.get('availablePayment').reset()
        }
        this.promotionForm.get('availablePayment').updateValueAndValidity();
    });
  }

  get code() {
    return this.promotionForm.get('code');
  }
  get userType() {
    return this.promotionForm.get('userType');
  }
  get promoType() {
    return this.promotionForm.get('promoType');
  }
  get discount() {
    return this.promotionForm.get('discount');
  }
  get percentage() {
    return this.promotionForm.get('percentage');
  }
  get fromDate() {
    return this.promotionForm.get('fromDate');
  }
  get toDate() {
    return this.promotionForm.get('toDate');
  }
  get promoLimit() {
    return this.promotionForm.get('promoLimit');
  }
  get availablePayment():FormArray {
    return this.promotionForm.get('availablePayment') as FormArray
  }
  get isDefault() {
    return this.promotionForm.get('isDefault');
  }

  getListPromoCode() {
    this.commonService.presentSpinner();
    this.notMatchSearch = false;
    this.subscription.push(
      this.promoService
        .getListPromoCode(this.currentPage, this.limit, this.searchValue)
        .subscribe(
          (res) => {
            this.commonService.dismissSpinner();
            this.promoCodeList = res.body.promoList;
            this.notMatchSearch =
            this.promoCodeList && this.promoCodeList.length < 1 ? true : false;
            this.promoCodeList.forEach((promo) => {
              promo.checkStatus =
                promo.status.toLowerCase() == 'active' ? true : false;
            });

            this.limit = res.body.limit;
            this.totalResult = res.body.totalResult;
            this.entries = this.commonService.calculateEntries(
              this.promoCodeList,
              this.currentPage,
              this.limit,
              this.totalResult
            );

          },
          (err) => {
            this.commonService.dismissSpinner();
            this.commonService.errorHandler(err);
          }
        )
    );
  }
 
  selectPage(event) {
    this.currentPage = event;
    this.getListPromoCode();
    localStorage.setItem('promo_page_number', event);
  }

  // this is handle in phase 2
  deletePromoCode(promoId) {
    let options = {
      title: 'Are you Sure you want to delete this promo code?',
      confirmLabel: 'Okay',
      declineLabel: 'Cancel',
    };
    this.ngxBootstrapConfirmService.confirm(options).then((res: boolean) => {
      if (res) {
        this.promoService.deletePromoCode(promoId).subscribe(res => {
          this.commonService.successToaster(res.body.message);
          this.getListPromoCode();
        }, err => {
          this.commonService.errorToast(err.body.message);
        })
      } else {
        console.log('Cancel');
      }
    });
  }

  // this is handle in phase 2
  editPromoCode(promo) {
    this.showHidePercentage = promo.percentage ? false : true
    this.promotionForm.setControl('availablePayment',this.buildAvailablePayment(promo.availablePayment))
    this.openModal();

    this.promoAddOrEdit = 'edit';
    this.promotionForm.get('code').setValue(promo.code);
    this.promotionForm.get('userType').setValue(promo.userType);
    this.promotionForm.get('promoType').setValue(promo.promoType);
    this.promotionForm.get('discount').setValue(promo.discount);
    this.promotionForm.get('percentage').setValue(promo.percentage);
    this.promotionForm.get('fromDate').setValue(this.formatDate(promo.fromDate));
    this.promotionForm.get('toDate').setValue(this.formatDate(promo.toDate));
    this.promotionForm.get('promoLimit').setValue(promo.promoLimit || 0);
    this.promotionForm.get('isDefault').setValue(promo.isDefault)
    this.promotionForm.get('limitCollection').setValue(promo.promoCodeScope?.[0]?.promoCodeScopeType)
    this.updateShowCollectionIds(promo.promoCodeScope?.[0]?.promoCodeScopeType);
    this.promotionForm.get('collectionIds').setValue(promo.promoCodeScope?.[0]?.ids?.join(','))
    this.promoCodeID = promo._id;
  }

  addNewPromo() {


    const mappedPaymentMethods = this.promotionForm.value.availablePayment.map((method, index) => {
      
      if(!method) return;
      return ({
        paymentProvider: this.availablePaymentProviders[index].paymentProvider,
        paymentProviderType: this.availablePaymentProviders[index].paymentProviderType
      })
    }).filter(Boolean)

    const scopes = [
      {
        promoCodeScopeType: 'feeds',
        ids: this.promotionForm.value?.collectionIds?.split(',') || []
      }
    ]


    if (this.promoAddOrEdit == 'add') {
      this.disableBtn = true;
      this.subscription.push(
        this.promoService.addNewPromoCode({...this.promotionForm.value,availablePayment:mappedPaymentMethods, promoCodeScope: scopes}).subscribe(
          (res) => {
            this.disableBtn = false;
            this.closeModal();
            this.commonService.successToaster('Promo Added Successfully!')
          },
          (err) => {
            if (err && err.error.message) {
              this.disableBtn = false;
              this.commonService.errorToast(err.error.message);
            }
          }
        )
      );
    } else {
      this.disableBtn = true;
      this.subscription.push(
        this.promoService.updatePromoCode(this.promoCodeID, {...this.promotionForm.value,availablePayment:mappedPaymentMethods, promoCodeScope: scopes}).subscribe(
          (res) => {
            this.disableBtn = false;
            this.closeModal();
            this.commonService.successToaster(res.body.message);
          },
          (err) => {
            if (err && err.error.message) {
              this.disableBtn = false;
              this.commonService.errorToast(err.error.message);
            }
          }
        )
      );
    }
  }

  // Active / Inactive Promo Code
  changePromoStatus(promoId) {
    this.subscription.push(
      this.promoService.activeInactivePromoCode(promoId).subscribe(
        (res) => {
          this.commonService.successToaster(res.body.message);
        },
        (err) => {
          if(err?.error) {
            this.commonService.errorToast(err?.error.message);
            return;
          }
          const message = err.body ? err.body.message : err.message ? err.message : 'Unknown error'
          this.commonService.errorToast(message);
        }
      )
    );
  }

  // About Modal
  openModal() {
    this.showHidePercentage = true;
    $('#add-promo').modal('show');
    this.promoAddOrEdit = 'add';
  }

  closeModal() {
    this.promotionForm.reset();
    $('#add-promo').modal('hide');
    this.ngOnInit();
  }

  // Function To Format Date
  formatDate(date: string) {
    return date.split('T')[0];
  }

  validateInputDate() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementsByName('someDate')[0].setAttribute('min', today);
    document.getElementsByName('someDate')[1].setAttribute('min', today);
  }
  createSearchForm() {
    this.searchForm = this.fb.group({
      word: [''],
    });
  }

  get word() {
    return this.searchForm.get('word');
  }

  numberOnly(event: any): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  filterBy() {
    this.notMatchSearch = false;
    this.searchValue = this.word.value;
    this.currentPage = 1;
    this.getListPromoCode();
    this.searchForm.get('word').setValue('');
  }
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  onLimitCollectionChange(selectedValue: string) {
    this.showCollectionIds = selectedValue === 'feeds';
  }

  updateShowCollectionIds(selectedValue: string): void {
    this.showCollectionIds = selectedValue === 'feeds';
  }
}
