import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SellerService } from 'src/app/services/seller/seller.service';
import firebase from 'firebase';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common/common.service';
import { HomeService } from 'src/app/services/home/home.service';

@Component({
  selector: 'app-select-variant',
  templateUrl: './select-variant.component.html',
  styleUrls: ['./select-variant.component.scss']
})
export class SelectVariantComponent implements OnInit, OnDestroy {
  photos: any;
  questions: any;
  apiHit: boolean;
  selectedVariant: any;
  modelID: any;

  color;
  showModal = false;
  variant;
  subscriptions: Subscription[] = [];

  newVariantsAttributes: any[] = [];
  selectedAttributeIDs: any[] = [];
  filterableAttributes: any[] = [];

  constructor(
    private router: Router,
    private sellerService: SellerService,
    public translate: TranslateService,
    public modalService: ModalService,
    private commonService: CommonService,
    private homeService: HomeService
  ) {
    this.openSuccesbidModal();
    this.apiHit = false;
    let state = this.router.getCurrentNavigation().extras.state;
    this.selectedVariant = JSON.parse(localStorage.getItem('selectedVarient'));

    if (state && state.questions) {
      this.questions = state.questions;
      this.sellerService.sendques(this.questions);
    }

    this.modelID = JSON.parse(localStorage.getItem('selectedModel'));

    if (state && state.backFromPhoto) {
      this.getBaseAttributeVariant();
      this.newVariantsAttributes = this.selectedVariant.attributes;
      this.sellerService.sendVar(this.newVariantsAttributes);
      this.checkEnableDisableNextBtn();
      this.apiHit = true;
    } else {
      this.getBaseAttributeVariant(true);
    }
  }

  getBaseAttributeVariant(pushVariants?: true) {
    this.newVariantsAttributes = []; this.selectedAttributeIDs = []; this.filterableAttributes = [];
    this.apiHit = false;
    this.sellerService.getBaseAttributesByModelID(this.modelID._id).subscribe(res => {
      this.apiHit = true;
      if(res?.responseData?.baseAttribute?.id) {
        pushVariants && this.newVariantsAttributes.push(res?.responseData?.baseAttribute);
        this.filterableAttributes.push(...res?.responseData?.filterableAttributes)
      }
    }, err => {
      this.alertNotFoundVariant();
      this.apiHit = true;
    })
  };

  getNextAttributeVariant(nextAttributeId: string) {
    this.apiHit = false;
    this.sellerService.getNextAttributeVariant(this.modelID._id, this.newVariantsAttributes[0]?.id, this.selectedAttributeIDs[0], nextAttributeId, this.selectedAttributeIDs.slice(1))
    .subscribe(res => {
      this.apiHit = true;
      if(res?.responseData?.queryAttribute) {
        this.newVariantsAttributes.push(res?.responseData?.queryAttribute)
      } else {
        this.alertNotFoundVariant();
      }
    }, err => {
      this.alertNotFoundVariant();
      this.apiHit = true;
    })
  };

  getVariantDetails() {
    if(this.selectedAttributeIDs.length - 1 !== this.filterableAttributes.length) {return};
    this.apiHit = false;
    this.sellerService.getVariantDetails(this.modelID._id, this.newVariantsAttributes[0].id, this.selectedAttributeIDs[0], this.selectedAttributeIDs.slice(1))
    .subscribe(res => {
      this.apiHit = true;
      if(!res?.responseData) { 
        this.alertNotFoundVariant()
        return;
      }
      res.responseData.attributes = this.newVariantsAttributes;
      localStorage.setItem('selectedVarient', JSON.stringify(res.responseData));
      this.variant = res?.responseData;
      this.sellerService.selectedVarient = res?.responseData;
      this.sellerService.uploadProductData.varient = res?.responseData?.varientEn;
      this.sellerService.uploadProductData.varient_ar = res?.responseData?.varientAr;
      this.sellerService.uploadProductData.varient_id = res?.responseData?.id;
      this.sellerService.uploadProductData.variant_attributes_selections = JSON.stringify(this.newVariantsAttributes);
      this.navigateToImgs();
      firebase.analytics().logEvent('user_selects_varient', { variant: res?.responseData?.id });
    }, err => {
      this.alertNotFoundVariant();
      this.apiHit = true;
    })
  };

  async alertNotFoundVariant() {
    this.commonService.presentAlert({
      header: await this.commonService.getTranslatedString(
        'alertPopUpTexts.noVariantFound'
      ),
      message: await this.commonService.getTranslatedString(
        'alertPopUpTexts.noVariantFoundMsg'
      ),
      button1: {
        text: await this.commonService.getTranslatedString(
          'alertPopUpTexts.ok'
        ),
        handler: () => {
          this.apiHit = true;
        }
      }
    });
  }

  markOptiopnAsSelected(optionID: string, attributeIndex: number, optionindex: number) {

    if (this.selectedAttributeIDs?.indexOf(optionID) >= 0) {
      return;
    }

    const option = this.newVariantsAttributes[attributeIndex]?.options[optionindex];
    this.newVariantsAttributes[attributeIndex].options?.map((opt) => (opt.selected = false));
    option.selected = true;

    if (attributeIndex === this.filterableAttributes.length) {
      this.checkEnableDisableNextBtn();
      return;
    }

    attributeIndex < this.newVariantsAttributes.length - 1 ? this.newVariantsAttributes?.splice(attributeIndex + 1) : null;
    this.checkEnableDisableNextBtn(attributeIndex, true);
  }

  checkEnableDisableNextBtn(attributeIndex?: number|any, getNextOption?: boolean) {
    this.selectedAttributeIDs = [];
    this.newVariantsAttributes?.map((attribute) => {
      attribute?.options?.map((option) => {
        if(option.selected == true) {
          this.selectedAttributeIDs.push(option.id);
        }
      });
    });
    getNextOption&&this.getNextAttributeVariant(this.filterableAttributes[attributeIndex].id);
  };


  openSuccesbidModal() {
    this.modalService.openCancelListing({
      value: true
    });
  }

  showmodal() {
    this.showModal = true;
    this.openSuccesbidModal();
  }

  ngOnInit(): void {
    const pageURL = this.router.url;
    window['dataLayer'] = window['dataLayer'] || [];
    const productGTM = {
      event: 'pageview',
      pagePath: pageURL,
      pageTitle: 'Select-variant'
    };
    window['dataLayer'].push(productGTM);
  }

  checkDataBeforePageLoad() {
    if (
      !this.sellerService.uploadProductData.product_images.length &&
      !this.sellerService.selectedDevice &&
      !this.sellerService.selectedBrand
    ) {
      this.router.navigate(['/select-devices']);
    }
  }

  goBack() {
    this.router.navigate(['/select-model']);
  }
  
  navigateToImgs() {
    if (this.sellerService.selectedVarient) {
      this.router.navigate(['/selected-photos', 'product']);
    }
  }

  getVariant(variantId: string) {
    return this.homeService.getVariant(this.sellerService.selectedVarient).then(async (data) => {
      if (data) {
        return data.responseData;
      }
    });
  }

  sendColor(color) {
    this.color = color;
    this.sellerService.selectedColor = color;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
